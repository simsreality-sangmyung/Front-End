import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface SettingsSectionProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  children: ReactNode;
}

function SettingsSection({ icon: Icon, eyebrow, title, children }: SettingsSectionProps) {
  return (
    <section className="twin-card settings-section">
      <div className="settings-section__header">
        <Icon size={16} strokeWidth={2} className="settings-section__icon" />
        <div>
          <p className="settings-section__eyebrow">// {eyebrow}</p>
          <h2 className="settings-section__title">{title}</h2>
        </div>
      </div>
      <div className="settings-section__body">{children}</div>
    </section>
  );
}

export default SettingsSection;
