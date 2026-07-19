interface SettingsToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function SettingsToggle({ checked, onChange, label }: SettingsToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`settings-toggle${checked ? ' settings-toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="settings-toggle__knob" />
    </button>
  );
}

export default SettingsToggle;
