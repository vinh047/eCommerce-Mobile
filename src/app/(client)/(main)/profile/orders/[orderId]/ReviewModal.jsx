"use client";
import { useState } from "react";

export default function ReviewModal({ open, onClose, productId, orderItemId, productName, onSubmitted }) {
    const [stars, setStars] = useState(5);
    const [content, setContent] = useState("");

    if (!open) return null;

    const submit = async () => {
        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                productId,
                orderItemId,
                stars,
                content,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert("Không thể gửi đánh giá!\n" + data.error);
            return;
        }

        alert("Đã gửi đánh giá!");
        onSubmitted?.();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-xl animate-fadeIn">

                <h2 className="text-xl font-semibold mb-2">Đánh giá sản phẩm</h2>

                <p className="text-sm text-gray-500 mb-4">{productName}</p>

                {/* Stars */}
                <label className="font-medium">Chọn sao:</label>
                <select
                    value={stars}
                    onChange={(e) => setStars(Number(e.target.value))}
                    className="border rounded p-2 w-full mb-3"
                >
                    {[1, 2, 3, 4, 5].map(s => (
                        <option key={s} value={s}>{s} ★</option>
                    ))}
                </select>

                {/* Content */}
                <textarea
                    rows={4}
                    placeholder="Nhận xét của bạn..."
                    className="border rounded p-2 w-full"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        className="px-4 py-2 rounded border bg-gray-200 hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Hủy
                    </button>

                    <button
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        onClick={submit}
                    >
                        Gửi đánh giá
                    </button>
                </div>
            </div>
        </div>
    );
}
