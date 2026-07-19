import type { ReactNode } from 'react';

interface SettingsRowProps {
  label: string;
  description?: string;
  children: ReactNode;
}

function SettingsRow({ label, description, children }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        {description ? (
          <p className="text-white/40 text-xs mt-0.5">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default SettingsRow;
