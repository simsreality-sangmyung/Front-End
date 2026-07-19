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
      onClick={() => onChange(!checked)}
      className="shrink-0"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: 44,
        height: 24,
        borderRadius: 999,
        background: checked ? '#00d4ff' : 'rgba(255,255,255,0.12)',
        transition: 'background 0.2s',
        padding: 3,
        boxSizing: 'border-box',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          display: 'block',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          transition: 'transform 0.2s',
          transform: checked ? 'translateX(20px)' : 'translateX(0px)',
          flexShrink: 0,
        }}
      />
    </button>
  );
}

export default SettingsToggle;
