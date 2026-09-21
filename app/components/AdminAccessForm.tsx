'use client';
import CustomModal from './ui/modal';
import TextInput from './ui/input';
import Button from '@mui/material/Button';
import { useState, useActionState, useEffect } from 'react';
import { login } from '../actions/auth';
import { useAuthenticatedAdminUserContext } from '../context';
import { useRouter } from 'next/navigation';

interface AdminAccessFormProps {
  open: boolean;
  onClose: () => void;
  redirectPath?: string;
}

const AdminAccessForm = ({ open, onClose, redirectPath }: AdminAccessFormProps) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    password: '',
    admin_key: '',
  });
  const router = useRouter();
  const { setUserIsAuthenticated, userIsAuthenticated } = useAuthenticatedAdminUserContext();
  const [state, formAction, pending] = useActionState(login, undefined);

  useEffect(() => {
    if (state && 'login_success' in state && state.login_success) {
      if (!userIsAuthenticated.isAuthenticated) {
        setUserIsAuthenticated({ name: state.name, isAuthenticated: true });
        onClose();
        router.push(redirectPath || '/');
      }
    }
  }, [
    state,
    router,
    setUserIsAuthenticated,
    redirectPath,
    onClose,
    userIsAuthenticated.isAuthenticated,
  ]);

  return (
    <CustomModal open={open} onClose={onClose}>
      <h3>Admin Access Required</h3>
      <p>Please enter admin credentials to proceed.</p>
      <form
        action={() => {
          // Convert the formData state into a FormData object for submission
          const data = new FormData();
          data.append('employee_id', formData.employee_id);
          data.append('password', formData.password);
          data.append('admin_key', formData.admin_key);
          formAction(data);
        }}
      >
        <TextInput
          label="Employee ID"
          value={formData.employee_id}
          onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
          name="employee_id"
          type="text"
        />
        {state?.fields?.includes('employee_id') && (
          <p style={{ color: 'red' }}>{state.errors[state.fields.indexOf('employee_id')]}</p>
        )}
        <TextInput
          label="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          name="password"
          type="password"
        />
        {state?.fields?.includes('password') && (
          <p style={{ color: 'red' }}>{state.errors[state.fields.indexOf('password')]}</p>
        )}
        <TextInput
          label="Admin Key"
          value={formData.admin_key}
          onChange={(e) => setFormData({ ...formData, admin_key: e.target.value })}
          name="admin_key"
          type="text"
        />
        {state?.fields?.includes('admin_key') && (
          <p style={{ color: 'red' }}>{state.errors[state.fields.indexOf('admin_key')]}</p>
        )}

        <Button disabled={pending} variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </CustomModal>
  );
};

export default AdminAccessForm;
