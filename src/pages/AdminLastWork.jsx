import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
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
import { lastWorkService } from '../services/lastWorkService';
import { truncate } from '../utils/formatters';
import toast from 'react-hot-toast';

// CHANGED: added githubLink to the default shape
const emptyWork = { title: '', category: '', description: '', githubLink: '' };

const AdminLastWork = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    data, loading, submitting, page, setPage, totalPages, setParams,
    create, update, remove,
  } = useCrud(lastWorkService, { entityName: 'Last work' });

  useMemo(() => setParams({ search: debouncedSearch }), [debouncedSearch, setParams]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: emptyWork });

  const openCreate = () => {
    setEditing(null);
    setImageFile(null);
    reset(emptyWork);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setImageFile(null);
    // CHANGED: carry githubLink over when editing an existing item
    reset({
      title: item.title,
      category: item.category,
      description: item.description,
      githubLink: item.githubLink || '',
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
    const confirmed = await confirmDialog({ title: `Delete "${item.title}"?` });
    if (confirmed) await remove(item._id);
  };

  const columns = [
    {
      key: 'image', header: 'Image',
      render: (row) => <img src={row.imageUrl || row.image} alt={row.title} className="h-10 w-10 rounded-lg object-cover" />,
    },
    { key: 'title', header: 'Title' },
    { key: 'category', header: 'Category' },
    {
      key: 'description', header: 'Description',
      render: (row) => <span className="text-gray-500">{truncate(row.description, 60)}</span>,
    },
    // CHANGED: new column so admins can see/click the linked repo in the table
    {
      key: 'githubLink', header: 'GitHub',
      render: (row) =>
        row.githubLink ? (
          <a
            href={row.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View
          </a>
        ) : (
          <span className="text-gray-300">—</span>
        ),
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
        title="Last Work"
        subtitle="Manage your recent work showcase"
        action={<Button icon={FiPlus} onClick={openCreate}>Add Work</Button>}
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Search last work..." className="sm:max-w-xs mb-4" />

      <Table columns={columns} data={data} loading={loading} emptyMessage="No last work items found" />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Last Work' : 'Add Last Work'} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ImageUpload label="Image" value={editing?.imageUrl} onChange={setImageFile} />
          <Input label="Work Title" error={errors.title?.message} {...register('title', { required: 'Title is required' })} />
          <Input label="Category" error={errors.category?.message} {...register('category', { required: 'Category is required' })} />
          {/* CHANGED: new GitHub link field, optional with a basic URL pattern check */}
          <Input
            label="GitHub Link"
            placeholder="https://github.com/username/repo"
            error={errors.githubLink?.message}
            {...register('githubLink', {
              pattern: {
                value: /^https?:\/\/(www\.)?github\.com\/.+/i,
                message: 'Enter a valid GitHub URL',
              },
            })}
          />
          <TextArea label="Description" error={errors.description?.message} {...register('description', { required: 'Description is required', maxLength: { value: 800, message: 'Max 800 characters' } })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editing ? 'Update' : 'Add'} Work</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminLastWork;