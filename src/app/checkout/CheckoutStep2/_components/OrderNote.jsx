export default function OrderNote({ note, onChangeNote }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ghi chú đơn hàng (tuỳ chọn)
      </label>
      <textarea
        value={note}
        onChange={(e) => onChangeNote(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        rows={3}
        placeholder="Ví dụ: Giao trong giờ hành chính, liên hệ trước khi giao…"
      />
    </div>
  );
}
