import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { speak } from '../utils/speak';

/**
 * Generic CRUD hook for list-based admin pages (projects, testimonials, last work).
 * service must implement: list, create, update, remove
 */
export const useCrud = (service, { entityName = 'Item', initialParams = {} } = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await service.list({ ...params, page });
      const payload = res.data;
      setData(payload?.data || payload?.items || payload || []);
      setTotalPages(payload?.totalPages || 1);
    } catch (err) {
      toast.error(err.message || `Failed to load ${entityName.toLowerCase()}s`);
    } finally {
      setLoading(false);
    }
  }, [service, params, page, entityName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (formData) => {
    setSubmitting(true);
    try {
      await service.create(formData);
      toast.success(`${entityName} added successfully`);
      speak(`${entityName} added successfully.`);
      await fetchData();
      return true;
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
      speak('Something went wrong.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const update = async (id, formData) => {
    setSubmitting(true);
    try {
      await service.update(id, formData);
      toast.success(`${entityName} updated successfully`);
      speak(`${entityName} updated successfully.`);
      await fetchData();
      return true;
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
      speak('Something went wrong.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    setSubmitting(true);
    try {
      await service.remove(id);
      toast.success(`${entityName} deleted successfully`);
      speak(`${entityName} deleted successfully.`);
      await fetchData();
      return true;
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
      speak('Something went wrong.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    data, loading, submitting, page, setPage, totalPages,
    params, setParams, fetchData, create, update, remove,
  };
};
