'use client';
import CustomModal from './ui/modal';
import TextInput from './ui/input';
import Button from '@mui/material/Button';
import { useState, useActionState, useEffect } from 'react';
import { login } from '../actions/auth';
import { useAuthenticatedAdminUser } from '../context';
import { useRouter } from 'next/navigation';

interface AdminAccessFormProps {
  open: boolean;
  onClose: () => void;
  redirectPath?: string;
}

const AdminAccessForm = ({ open, onClose, redirectPath }: AdminAccessFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    admin_key: '',
    redirectPath: redirectPath || '',
  });
  const router = useRouter();
  const { setIsAuthenticated } = useAuthenticatedAdminUser();
  const [state, formAction, pending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.login_success) {
      router.push(redirectPath || '/');
      setIsAuthenticated(true);
      onClose();
    }
  }, [state?.login_success, router, setIsAuthenticated, redirectPath, onClose]);

  return (
    <CustomModal open={open} onClose={onClose}>
      <h3>Admin Access Required</h3>
      <p>Please enter admin credentials to proceed.</p>
      <form
        action={() => {
          // Convert the formData state into a FormData object for submission
          const data = new FormData();
          data.append('email', formData.email);
          data.append('password', formData.password);
          data.append('admin_key', formData.admin_key);
          data.append('redirectPath', formData.redirectPath);
          formAction(data);
        }}
      >
        <TextInput
          label="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          name="email"
          type="email"
        />
        {state?.fields?.includes('email') && (
          <p style={{ color: 'red' }}>{state.errors[state.fields.indexOf('email')]}</p>
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
        <input type="hidden" name="redirectPath" value={formData.redirectPath} />
        {state?.fields?.includes('redirectPath') && (
          <p style={{ color: 'red' }}>{state.errors[state.fields.indexOf('redirectPath')]}</p>
        )}
        <Button disabled={pending} variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </CustomModal>
  );
};

export default AdminAccessForm;
