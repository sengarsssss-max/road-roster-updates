type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export default function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-9 w-16 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? 'bg-orange-500' : 'bg-zinc-700'
      }`}
    >
      <span
        className={`absolute top-1 h-7 w-7 rounded-full bg-zinc-50 shadow transition-transform duration-200 ${
          checked ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
