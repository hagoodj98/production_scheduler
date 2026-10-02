import type { ReactNode } from 'react';

type FormHeaderProps = {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  titleAs: 'h1' | 'h2';
  className: string;
  badge?: ReactNode;
};

const FormHeader = ({
  icon,
  eyebrow,
  title,
  description,
  titleAs: Title,
  className,
  badge,
}: FormHeaderProps) => {
  return (
    <header className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase text-emerald-800">{eyebrow}</p>
          <Title className="text-xl font-semibold text-slate-900">{title}</Title>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
      </div>
      {badge}
    </header>
  );
};

export default FormHeader;
