export default function SummaryRow({ label, value, strong }) {
  return (
    <div className="flex justify-between text-sm">
      <span
        className={`text-gray-700 ${strong ? "font-semibold" : "font-medium"}`}
      >
        {label}
      </span>
      <span className={`text-gray-900 ${strong ? "font-bold text-base" : ""}`}>
        {value}
      </span>
    </div>
  );
}
