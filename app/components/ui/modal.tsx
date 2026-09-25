import Modal from '@mui/material/Modal';

type CustomModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  title?: string;
  subtitle?: string;
  maxWidthClass?: string;
};

const CustomModal = ({
  children,
  onClose,
  open,
  title,
  subtitle,
  maxWidthClass,
}: CustomModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div
        className={`absolute left-1/2 top-1/2 w-[92%] -translate-x-1/2 -translate-y-1/2 ${maxWidthClass ?? 'max-w-lg'} outline-none bg-white p-4 rounded shadow-lg relative`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;
