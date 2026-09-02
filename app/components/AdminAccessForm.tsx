'use client';
import CustomModal from './ui/modal';
import TextInput from './ui/input';
import Button from '@mui/material/Button';
import { useState, useActionState } from 'react';
import { adminAccessValidationSchema } from '../../utils/validationSchema';
import { ZodError } from 'zod';
import { signin } from '../actions/auth';

const AdminAccessForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '', admin_key: '' });
  const [error, setError] = useState('');
  const [state, formAction, pending] = useActionState(signin, undefined);
  const [showModal, setShowModal] = useState(true);

  return (
    <CustomModal open={showModal} onClose={() => setShowModal(false)}>
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
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </CustomModal>
  );
};

export default AdminAccessForm;
