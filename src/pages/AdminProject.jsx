import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FiPlus, FiEdit2, FiTrash2, FiGithub, FiExternalLink, FiStar } from 'react-icons/fi';
import PageTitle from '../components/ui/PageTitle';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import Select from '../components/ui/Select';
import ImageUpload from '../components/ui/ImageUpload';
import SearchBar from '../components/ui/SearchBar';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import { confirmDialog } from '../components/ui/ConfirmDialog';
import { useCrud } from '../hooks/useCrud';
import { useDebounce } from '../hooks/useDebounce';
import { projectService } from '../services/projectService';
import { PROJECT_CATEGORIES } from '../config/endpoints';
import { isValidUrl } from '../utils/validators';
import { getAssetUrl } from '../utils/assetUrl';
import toast from 'react-hot-toast';

const emptyProject = {
  name: '', category: '', description: '', technologies: '',
  githubUrl: '', liveUrl: '', featured: false, displayOrder: 0,
};

const AdminProject = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    data, loading, submitting, page, setPage, totalPages, setParams,
    create, update, remove,
  } = useCrud(projectService, { entityName: 'Project' });

  useMemo(() => {
    setParams({ search: debouncedSearch, category: categoryFilter });
  }, [debouncedSearch, categoryFilter, setParams]);

  const {
    register, handleSubmit, reset, control, formState: { errors },
  } = useForm({ defaultValues: emptyProject });

  const openCreate = () => {
    setEditing(null);
    setImageFile(null);
    reset(emptyProject);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setImageFile(null);
    reset({
      name: project.name, category: project.category, description: project.description,
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies,
      githubUrl: project.githubUrl, liveUrl: project.liveUrl,
      featured: !!project.featured, displayOrder: project.displayOrder || 0,
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

  const handleDelete = async (project) => {
    const confirmed = await confirmDialog({
      title: `Delete "${project.name}"?`,
      text: 'This project will be permanently removed.',
    });
    if (confirmed) await remove(project._id);
  };

  const columns = [
    {
      key: 'image', header: 'Image',
      render: (row) => (
        <img src={getAssetUrl(row.imageUrl || row.image)} alt={row.name} className="h-10 w-10 rounded-lg object-cover" />
      ),
    },
    { key: 'name', header: 'Name' },
    { key: 'category', header: 'Category' },
    {
      key: 'links', header: 'Links',
      render: (row) => (
        <div className="flex gap-2 text-gray-400">
          {row.githubUrl && <a href={row.githubUrl} target="_blank" rel="noreferrer" className="hover:text-blue-600"><FiGithub size={16} /></a>}
          {row.liveUrl && <a href={row.liveUrl} target="_blank" rel="noreferrer" className="hover:text-blue-600"><FiExternalLink size={16} /></a>}
        </div>
      ),
    },
    {
      key: 'featured', header: 'Featured',
      render: (row) => row.featured ? <FiStar className="text-amber-500" /> : <span className="text-gray-300">—</span>,
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
        title="Projects"
        subtitle="Manage your portfolio projects"
        action={<Button icon={FiPlus} onClick={openCreate}>Add Project</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." className="sm:max-w-xs" />
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          options={PROJECT_CATEGORIES}
          placeholder="All Categories"
          containerClassName="sm:max-w-xs"
        />
      </div>

      <Table columns={columns} data={data} loading={loading} emptyMessage="No projects found" />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Add Project'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ImageUpload
            label="Project Image"
            value={editing?.imageUrl}
            onChange={setImageFile}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Project Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
            <Controller
              control={control}
              name="category"
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select label="Category" options={PROJECT_CATEGORIES} error={errors.category?.message} {...field} />
              )}
            />
          </div>
          <TextArea label="Description" error={errors.description?.message} {...register('description', { required: 'Description is required', maxLength: { value: 1000, message: 'Max 1000 characters' } })} />
          <Input label="Technologies (comma separated)" placeholder="React, Node.js, MongoDB" {...register('technologies')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub URL" placeholder="https://github.com/..."
              error={errors.githubUrl?.message}
              {...register('githubUrl', { validate: (v) => isValidUrl(v) || 'Enter a valid URL' })}
            />
            <Input
              label="Live URL" placeholder="https://..."
              error={errors.liveUrl?.message}
              {...register('liveUrl', { validate: (v) => isValidUrl(v) || 'Enter a valid URL' })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <Input label="Display Order" type="number" {...register('displayOrder')} />
            <label className="flex items-center gap-2 pb-2.5 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="h-4 w-4 rounded accent-blue-600" />
              <span className="text-sm font-medium">Featured Project</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editing ? 'Update' : 'Add'} Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProject;
