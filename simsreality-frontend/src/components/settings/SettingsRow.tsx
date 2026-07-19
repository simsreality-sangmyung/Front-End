import type { ReactNode } from 'react';

interface SettingsRowProps {
  label: string;
  description?: string;
  children: ReactNode;
}

function SettingsRow({ label, description, children }: SettingsRowProps) {
  return (
    <div className="settings-row">
      <div className="settings-row__text">
        <p className="settings-row__label">{label}</p>
        {description ? <p className="settings-row__description">{description}</p> : null}
      </div>
      <div className="settings-row__control">{children}</div>
    </div>
  );
}

export default SettingsRow;
