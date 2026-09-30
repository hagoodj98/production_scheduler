import TextField from '@mui/material/TextField';

interface TextInputProps {
  label: string;
  value: string;
  name: string;
  type: string;
  sx?: object;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = ({ label, value, onChange, name, type, sx }: TextInputProps) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      name={name}
      type={type}
      variant="outlined"
      fullWidth
      sx={sx}
    />
  );
};

export default TextInput;
