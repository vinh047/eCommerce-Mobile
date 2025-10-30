export default function FilterActionBar({ onApply, onReset }) {
  return (
    <div className="action-bar border-t bg-white px-4 py-3">
      <div className="flex gap-2">
        <button
          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 text-[13px]"
          type="button"
          onClick={onApply}
        >
          Áp dụng
        </button>
        <button
          className="flex-1 bg-gray-100 text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-200 text-[13px]"
          type="button"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
