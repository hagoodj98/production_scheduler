'use client';
import CustomModal from './ui/modal';
import TextInput from './ui/input';
import Button from '@mui/material/Button';
import { useState, useActionState, useEffect, useReducer } from 'react';
import { signin } from '../actions/auth';

interface AdminAccessFormProps {
  open: boolean;
  onClose: () => void;
}

const AdminAccessForm = ({ open, onClose }: AdminAccessFormProps) => {
  const [formData, setFormData] = useState({ email: '', password: '', admin_key: '' });
  const [state, formAction, pending] = useActionState(signin, undefined);
  useEffect(() => {
    if (state?.userAuthenticated) {
      onClose();
    }
  }, [state, onClose]);
  // const handleClose = () => setShowModal(false);

  return (
    <CustomModal open={open} onClose={onClose}>
      <h3>Admin Access Required</h3>
      <p>Please enter admin credentials to proceed.</p>
      <form
        action={() => {
          formAction(formData);
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
        <Button disabled={pending} variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </CustomModal>
  );
};

export default AdminAccessForm;
