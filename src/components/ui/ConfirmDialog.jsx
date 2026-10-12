import Swal from 'sweetalert2';

/**
 * Reusable SweetAlert2 confirmation dialog.
 * Returns a boolean Promise.
 */
export const confirmDialog = async ({
  title = 'Are you sure?',
  text = 'This action cannot be undone.',
  confirmText = 'Yes, delete it',
  cancelText = 'Cancel',
  icon = 'warning',
} = {}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    customClass: {
      popup: 'rounded-2xl',
    },
    reverseButtons: true,
  });
  return result.isConfirmed;
};

export default confirmDialog;
