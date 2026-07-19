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
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden mb-5">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/8">
        <Icon className="w-4 h-4 text-[#00d4ff]" strokeWidth={2} />
        <div>
          <p className="text-[10px] text-[#00d4ff] font-['JetBrains_Mono',monospace] tracking-[0.2em]">
            // {eyebrow}
          </p>
          <h2 className="text-base font-bold tracking-wide">{title}</h2>
        </div>
      </div>
      <div className="divide-y divide-white/5">{children}</div>
    </div>
  );
}

export default SettingsSection;
