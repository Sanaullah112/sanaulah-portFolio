import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiDownload, FiTrash2, FiFileText, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageTitle from '../components/ui/PageTitle';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import { confirmDialog } from '../components/ui/ConfirmDialog';
import { resumeService } from '../services/resumeService';
import { isValidPdf } from '../utils/validators';
import { speak } from '../utils/speak';
import { formatDate, formatBytes } from '../utils/formatters';
import { getAssetUrl } from '../utils/assetUrl';

const AdminResume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const fetchResume = useCallback(async () => {
    setLoading(true);
    try {
      const res = await resumeService.get();
      setResume(res.data?.resume || res.data || null);
    } catch (err) {
      if (err.status !== 404) toast.error(err.message || 'Failed to load resume');
      setResume(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const handleUpload = async (file) => {
    if (!file) return;
    if (!isValidPdf(file)) {
      toast.error('Please upload a valid PDF file under 10MB');
      speak('Upload failed.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    setProgress(0);
    try {
      if (resume?._id) {
        await resumeService.update(resume._id, formData, setProgress);
        toast.success('Resume updated successfully');
        speak('Resume updated successfully.');
      } else {
        await resumeService.upload(formData, setProgress);
        toast.success('Resume uploaded successfully');
        speak('Resume uploaded successfully.');
      }
      await fetchResume();
    } catch (err) {
      toast.error(err.message || 'Upload failed');
      speak('Upload failed.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!resume?._id) return;
    const confirmed = await confirmDialog({
      title: 'Delete Resume?',
      text: 'This will permanently remove the resume file.',
    });
    if (!confirmed) return;

    try {
      await resumeService.remove(resume._id);
      toast.success('Resume deleted successfully');
      speak('Resume deleted successfully.');
      setResume(null);
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
      speak('Something went wrong.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files?.[0]);
  };

  if (loading) return <Loader />;
  const resumeUrl = getAssetUrl(resume?.fileUrl || resume?.url);

  return (
    <div>
      <PageTitle
        title="Resume"
        subtitle="Manage your downloadable resume PDF"
        action={
          resume ? (
            <Button variant="outline" icon={FiRefreshCw} onClick={fetchResume}>
              Refresh
            </Button>
          ) : null
        }
      />

      <div className="card p-6">
        {resume ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600">
                  <FiFileText size={26} />
                </div>
                <div>
                  <p className="font-medium">{resume.fileName || 'resume.pdf'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatBytes(resume.fileSize)} • Uploaded {formatDate(resume.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={resumeUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" icon={FiDownload}>Download</Button>
                </a>
                <Button variant="danger" icon={FiTrash2} onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <iframe
                src={resumeUrl}
                title="Resume Preview"
                className="w-full h-[500px]"
              />
            </div>

            <ReplaceZone uploading={uploading} progress={progress} onDrop={handleDrop} onUpload={handleUpload} dragOver={dragOver} setDragOver={setDragOver} replace />
          </div>
        ) : (
          <ReplaceZone uploading={uploading} progress={progress} onDrop={handleDrop} onUpload={handleUpload} dragOver={dragOver} setDragOver={setDragOver} />
        )}
      </div>
    </div>
  );
};

const ReplaceZone = ({ uploading, progress, onDrop, onUpload, dragOver, setDragOver, replace = false }) => (
  <div>
    {replace && <p className="text-sm font-medium mb-2">Replace Resume</p>}
    <motion.div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => document.getElementById('resume-upload-input').click()}
      animate={{ borderColor: dragOver ? '#3b82f6' : undefined }}
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors ${
        dragOver ? 'bg-blue-50 dark:bg-blue-950/30' : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
      }`}
    >
      <input
        id="resume-upload-input"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => onUpload(e.target.files?.[0])}
      />
      <FiUploadCloud size={32} className="text-gray-400" />
      <p className="text-sm text-gray-500">
        <span className="text-blue-600 font-medium">Click to upload</span> or drag & drop a PDF
      </p>
      <p className="text-xs text-gray-400">Max file size 10MB</p>

      {uploading && (
        <div className="w-full max-w-xs mt-3">
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-center text-gray-500 mt-1">{progress}%</p>
        </div>
      )}
    </motion.div>
  </div>
);

export default AdminResume;
