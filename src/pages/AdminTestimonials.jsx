import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiLinkedin } from 'react-icons/fi';
import PageTitle from '../components/ui/PageTitle';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import ImageUpload from '../components/ui/ImageUpload';
import SearchBar from '../components/ui/SearchBar';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import { confirmDialog } from '../components/ui/ConfirmDialog';
import { useCrud } from '../hooks/useCrud';
import { useDebounce } from '../hooks/useDebounce';
import { testimonialService } from '../services/testimonialService';
import { isValidUrl } from '../utils/validators';
import { getAssetUrl } from '../utils/assetUrl';
import toast from 'react-hot-toast';

const emptyTestimonial = { name: '', jobTitle: '', company: '', review: '', rating: 5, linkedin: '' };

const AdminTestimonials = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    data, loading, submitting, page, setPage, totalPages, setParams,
    create, update, remove,
  } = useCrud(testimonialService, { entityName: 'Testimonial' });

  useMemo(() => setParams({ search: debouncedSearch }), [debouncedSearch, setParams]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: emptyTestimonial });

  const openCreate = () => {
    setEditing(null);
    setImageFile(null);
    reset(emptyTestimonial);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setImageFile(null);
    reset({
      name: item.name, jobTitle: item.jobTitle, company: item.company,
      review: item.review, rating: item.rating, linkedin: item.linkedin,
    });
    setModalOpen(true);
  };

  const onSubmit = async (values) => {
    if (!imageFile && !editing) {
      toast.error('Please fill required fields');
      return;
    }
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => formData.append(key, val));
    if (imageFile) formData.append('image', imageFile);

    const ok = editing ? await update(editing._id, formData) : await create(formData);
    if (ok) setModalOpen(false);
  };

  const handleDelete = async (item) => {
    const confirmed = await confirmDialog({ title: `Delete testimonial from "${item.name}"?` });
    if (confirmed) await remove(item._id);
  };

  const columns = [
    {
      key: 'image', header: 'Photo',
      render: (row) => <img src={getAssetUrl(row.imageUrl || row.image)} alt={row.name} className="h-10 w-10 rounded-full object-cover" />,
    },
    { key: 'name', header: 'Name' },
    {
      key: 'role', header: 'Role',
      render: (row) => <span>{row.jobTitle} {row.company ? `. ${row.company}` : ''}</span>,
    },
    {
      key: 'rating', header: 'Rating',
      render: (row) => (
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: row.rating || 0 }).map((_, i) => <FiStar key={i} size={13} fill="currentColor" />)}
        </div>
      ),
    },
    {
      key: 'linkedin', header: 'Social',
      render: (row) => row.linkedin ? (
        <a href={row.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600"><FiLinkedin size={16} /></a>
      ) : '—',
    },
    {
      key: 'actions', header: '', render: (row) => (
        <div className="flex gap-2 justify-end">
          <button onClick={() => openEdit(row)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600"><FiEdit2 size={15} /></button>
          <button onClick={() => handleDelete(row)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"><FiTrash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageTitle
        title="Testimonials"
        subtitle="Manage client testimonials and reviews"
        action={<Button icon={FiPlus} onClick={openCreate}>Add Testimonial</Button>}
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Search testimonials..." className="sm:max-w-xs mb-4" />

      <Table columns={columns} data={data} loading={loading} emptyMessage="No testimonials found" />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ImageUpload label="Photo" value={editing?.imageUrl} onChange={setImageFile} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
            <Input label="Job Title" error={errors.jobTitle?.message} {...register('jobTitle', { required: 'Job title is required' })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Company" {...register('company')} />
            <Input
              label="Rating (1-5)" type="number" min={1} max={5}
              error={errors.rating?.message}
              {...register('rating', { required: 'Rating is required', min: 1, max: 5 })}
            />
          </div>
          <TextArea label="Review" error={errors.review?.message} {...register('review', { required: 'Review is required', maxLength: { value: 600, message: 'Max 600 characters' } })} />
          <Input
            label="LinkedIn URL" placeholder="https://linkedin.com/in/..."
            error={errors.linkedin?.message}
            {...register('linkedin', { validate: (v) => isValidUrl(v) || 'Enter a valid URL' })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editing ? 'Update' : 'Add'} Testimonial</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTestimonials;
