'use client';
import CustomModal from './ui/modal';
import TextInput from './ui/input';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { adminAccessValidationSchema } from '../../utils/validationSchema';
import { ZodError } from 'zod';

const AdminAccessForm = () => {
  const [validationData, setValidationData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Handle admin access form submission logic here
      const { username, password } = validationData;
      if (!username || !password) {
        setError('Username and password are required.');
        return;
      }
      // Validate the admin access form data using the Zod schema
      adminAccessValidationSchema.parse({ username, password });
      // No need to check success, parse will throw if invalid
      const response = await fetch('/api/admin-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error('Failed to authenticate admin access.');
      }
      setError(''); // Clear any previous error if validation passes
      // Perform further validation or API call for admin access here

      setShowModal(false);
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.issues[0].message);
        return;
      }
      console.error('Error submitting admin access form:', error);
      setError('Failed to submit admin access form.');
    }
  };

  const [showModal, setShowModal] = useState(true);

  return (
    <CustomModal open={showModal} onClose={() => setShowModal(false)}>
      <h3>Admin Access Required</h3>
      <p>Please enter admin credentials to proceed.</p>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Username"
          value={validationData.username}
          onChange={(e) => setValidationData({ ...validationData, username: e.target.value })}
          name="username"
          type="text"
        />
        {error && error.includes('Username') && <p style={{ color: 'red' }}>{error}</p>}

        <TextInput
          label="Password"
          value={validationData.password}
          onChange={(e) => setValidationData({ ...validationData, password: e.target.value })}
          name="password"
          type="password"
        />
        {error && error.includes('Password') && <p style={{ color: 'red' }}>{error}</p>}
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </CustomModal>
  );
};

export default AdminAccessForm;
