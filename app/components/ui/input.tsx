import TextField from '@mui/material/TextField';
import { memo } from 'react';

interface TextInputProps {
  label: string;
  value: string;
  name: string;
  type: string;
  sx?: object;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
// Memoized text input component for form usage to prevent unnecessary re-renders
const TextInput = memo(({ label, value, onChange, name, type, sx }: TextInputProps) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      name={name}
      type={type}
      variant="outlined"
      fullWidth
      autoComplete="off"
      sx={sx}
    />
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
