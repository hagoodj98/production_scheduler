'use client';
import CustomModal from './ui/modal';
import TextInput from './ui/input';
import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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
      <div className="mb-5 flex items-start gap-3 border-b border-slate-200 pb-4 pr-8">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <LockOutlinedIcon fontSize="small" />
        </span>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-emerald-800">Secure sign-in</p>
          <h2 className="text-xl font-semibold text-slate-900">Admin access required</h2>
          <p className="mt-1 text-sm text-slate-600">Enter your credentials to continue.</p>
        </div>
      </div>
      {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
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
          sx={{
            marginTop: 2,
          }}
        />
        {state?.fields?.find((field) => field.path === 'employee_id') && (
          <p style={{ color: 'red' }}>
            {state.fields.find((field) => field.path === 'employee_id')?.message}
          </p>
        )}
        <TextInput
          label="Password"
          value={adminFormState.formData.password}
          onChange={(e) => dispatch({ type: 'setPassword', value: e.target.value })}
          name="password"
          sx={{
            marginY: 2,
          }}
          type="password"
        />
        {state?.fields?.find((field) => field.path === 'password') && (
          <p style={{ color: 'red' }}>
            {state.fields.find((field) => field.path === 'password')?.message}
          </p>
        )}
        <TextInput
          label="Admin Key"
          value={adminFormState.formData.admin_key}
          onChange={(e) => dispatch({ type: 'setAdmin_key', value: e.target.value })}
          name="admin_key"
          type="text"
          sx={{
            marginBottom: 3,
          }}
        />
        {state?.fields?.find((field) => field.path === 'admin_key') && (
          <p style={{ color: 'red' }}>
            {state.fields.find((field) => field.path === 'admin_key')?.message}
          </p>
        )}

        <Button disabled={pending} variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </CustomModal>
  );
};

export default AdminAccessForm;
