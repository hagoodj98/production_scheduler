'use client';
import CustomModal from './ui/modal';
import TextInput from './ui/input';
import Button from '@mui/material/Button';
import { useActionState, useEffect, useReducer } from 'react';
import { login } from '../actions/auth';
import { useAdminUserContext } from '../context';
import { useRouter } from 'next/navigation';
import { AdminFormAction, AdminFormState } from './types';

interface AdminAccessFormProps {
  open: boolean;
  onClose: () => void;
  redirectPath?: string;
}

const reducer = (adminFormState: AdminFormState, action: AdminFormAction) => {
  switch (action.type) {
    case 'setEmployee_id':
      return {
        ...adminFormState,
        formData: {
          ...adminFormState.formData,
          employee_id: action.value,
        },
      };
    case 'setPassword':
      return {
        ...adminFormState,
        formData: {
          ...adminFormState.formData,
          password: action.value,
        },
      };
    case 'setAdmin_key':
      return {
        ...adminFormState,
        formData: {
          ...adminFormState.formData,
          admin_key: action.value,
        },
      };

    default:
      return adminFormState;
  }
};

const AdminAccessForm = ({ open, onClose, redirectPath }: AdminAccessFormProps) => {
  const [adminFormState, dispatch] = useReducer(reducer, {
    formData: {
      employee_id: '',
      password: '',
      admin_key: '',
    },
  });

  const router = useRouter();
  const { setUserIsAuthenticated, userIsAuthenticated } = useAdminUserContext();
  const [state, formAction, pending] = useActionState(login, undefined);

  useEffect(() => {
    // Reset form data when the component mounts or state changes

    if (state && 'login_success' in state && state.login_success) {
      if (userIsAuthenticated.state !== 'authenticated') {
        setUserIsAuthenticated({ name: state.name, state: 'authenticated' });
        onClose();
        router.push(redirectPath || '/');
      }
    }
  }, [state, router, setUserIsAuthenticated, redirectPath, onClose, userIsAuthenticated.state]);

  return (
    <CustomModal open={open} onClose={onClose}>
      <h3>Admin Access Required</h3>
      <p>Please enter admin credentials to proceed.</p>
      <form
        action={() => {
          // Convert the formData state into a FormData object for submission
          const data = new FormData();
          data.append('employee_id', adminFormState.formData.employee_id);
          data.append('password', adminFormState.formData.password);
          data.append('admin_key', adminFormState.formData.admin_key);
          formAction(data);
        }}
      >
        <TextInput
          label="Employee ID"
          value={adminFormState.formData.employee_id}
          onChange={(e) => dispatch({ type: 'setEmployee_id', value: e.target.value })}
          name="employee_id"
          type="text"
        />
        {state?.fields?.includes('employee_id') && (
          <p style={{ color: 'red' }}>{state.errors[state.fields.indexOf('employee_id')]}</p>
        )}
        <TextInput
          label="Password"
          value={adminFormState.formData.password}
          onChange={(e) => dispatch({ type: 'setPassword', value: e.target.value })}
          name="password"
          type="password"
        />
        {state?.fields?.includes('password') && (
          <p style={{ color: 'red' }}>{state.errors[state.fields.indexOf('password')]}</p>
        )}
        <TextInput
          label="Admin Key"
          value={adminFormState.formData.admin_key}
          onChange={(e) => dispatch({ type: 'setAdmin_key', value: e.target.value })}
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
