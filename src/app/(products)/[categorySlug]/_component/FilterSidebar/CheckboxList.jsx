export default function CheckboxList({ items, checked, onToggle }) {
  return (
    <div className="space-y-2">
      {items.map((opt) => (
        <label
          key={String(opt.value)}
          className="flex items-center text-[13px] leading-5"
        >
          <input
            type="checkbox"
            className="chk h-4 w-4 rounded-md border border-gray-300 mr-2 align-middle"
            checked={(checked || []).map(String).includes(String(opt.value))}
            onChange={() => onToggle(opt.value)}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
