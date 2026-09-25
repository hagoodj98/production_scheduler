import TextField from '@mui/material/TextField';

type TextInputProps = {
  label: string;
  value: string;
  name: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextInput = ({ label, value, onChange, name, type }: TextInputProps) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      name={name}
      type={type}
      variant="outlined"
      fullWidth
    />
  );
};

export default TextInput;
