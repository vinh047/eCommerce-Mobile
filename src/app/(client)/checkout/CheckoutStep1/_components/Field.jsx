import { Input } from "@/components/ui/form/Input";

export default function Field({
  label,
  value,
  onChange,
  className = "",
  helperText,
  placeholder,
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        size="md"
        fullWidth
      />
      {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}