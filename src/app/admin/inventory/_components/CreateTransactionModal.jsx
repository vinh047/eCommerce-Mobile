"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Save,
  Trash2,
  Barcode,
  Search,
  Package,
  ListChecks,
  QrCode,
  AlertCircle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

// Import thư viện mới
import { useZxing } from "react-zxing";
import { BrowserMultiFormatReader } from "@zxing/browser";
import VariantSelector from "./VariantSelector";

// --- SUB COMPONENT: CAMERA ---
// Tách ra để chỉ kích hoạt Camera khi được mount
const ScannerCamera = ({ onScan }) => {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onScan(result.getText());
    },
    onError(error) {
      // Bỏ qua log lỗi liên tục khi chưa bắt được mã
    },
  });

  return (
    <div className="w-full h-full relative bg-black">
      <video ref={ref} className="w-full h-full object-cover" />
      {/* Hiệu ứng tia laser */}
      <div className="absolute inset-0 border-2 border-red-500/50 pointer-events-none flex items-center justify-center">
        <div className="w-4/5 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse"></div>
      </div>
      <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/70 bg-black/40 py-1">
        Đưa mã vào giữa khung hình
      </p>
    </div>
  );
};

// --- MAIN COMPONENT ---

// Giả lập tiếng bip
const playScanSound = (success = true) => {
  const audio = new Audio(
    success
      ? "https://www.soundjay.com/buttons/sounds/button-3.mp3"
      : "https://www.soundjay.com/buttons/sounds/button-10.mp3"
  );
  audio.volume = 0.5;
  audio.play().catch(() => {});
};

export default function CreateTransactionModal({
  type,
  onClose,
  onSave,
  variants = [],
}) {
  // --- STATE ---
  const [items, setItems] = useState([]);
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [ticketReason, setTicketReason] = useState("");

  const [currentVariant, setCurrentVariant] = useState(null);
  const [scanInput, setScanInput] = useState("");

  // State xử lý upload ảnh
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const scanInputRef = useRef(null);
  const fileInputRef = useRef(null); // Ref cho input file ẩn

  const isOutbound = type === "out";
  const isAudit = type === "adjustment";

  // --- LOGIC XỬ LÝ ---

  const handleProcessSerial = (code) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    if (!currentVariant) {
      alert("Vui lòng chọn dòng sản phẩm (Variant) trước khi quét!");
      playScanSound(false);
      return;
    }

    const existingItemIndex = items.findIndex(
      (i) => i.variant.id === currentVariant.id
    );
    let newItems = [...items];

    if (existingItemIndex > -1) {
      const existingItem = newItems[existingItemIndex];
      if (existingItem.serials.includes(cleanCode)) {
        playScanSound(false);
        // Có thể thêm toast thông báo trùng ở đây
        return;
      }
      newItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
        serials: [cleanCode, ...existingItem.serials],
      };
    } else {
      newItems.push({
        variant: currentVariant,
        quantity: 1,
        serials: [cleanCode],
      });
    }

    setItems(newItems);
    setScanInput("");
    playScanSound(true);
  };

  // Xử lý upload ảnh để decode
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessingImage(true);
    try {
      const reader = new BrowserMultiFormatReader();
      // Tạo URL tạm từ file
      const imageUrl = URL.createObjectURL(file);

      // Decode
      const result = await reader.decodeFromImageUrl(imageUrl);

      handleProcessSerial(result.getText());

      // Dọn dẹp memory
      URL.revokeObjectURL(imageUrl);
    } catch (err) {
      console.error(err);
      alert("Không tìm thấy mã vạch hợp lệ trong ảnh này!");
      playScanSound(false);
    } finally {
      setIsProcessingImage(false);
      // Reset input file để chọn lại cùng 1 file được
      e.target.value = null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleProcessSerial(scanInput);
    }
  };

  const handleRemoveSerial = (itemIndex, serialToRemove) => {
    const newItems = [...items];
    const item = newItems[itemIndex];
    const newSerials = item.serials.filter((s) => s !== serialToRemove);

    if (newSerials.length === 0) {
      newItems.splice(itemIndex, 1);
    } else {
      item.serials = newSerials;
      item.quantity = newSerials.length;
    }
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitTicket = () => {
    if (items.length === 0) return alert("Phiếu rỗng!");

    const payload = {
      type,
      reason: ticketReason,
      createdById: 1,
      transactions: items.map((item) => ({
        variantId: item.variant.id,
        quantity: item.quantity,
        deviceIdentifiers: item.serials,
      })),
    };
 
    onSave(payload);
  };

  // Focus input khi chọn variant
  useEffect(() => {
    if (currentVariant && scanInputRef.current) {
      scanInputRef.current.focus();
    }
  }, [currentVariant]);

  const getTitle = () => {
    if (isAudit) return "Kiểm kê / Cân bằng kho";
    return isOutbound ? "Xuất kho" : "Nhập kho";
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <div className="relative z-10 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl flex flex-col h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center shrink-0">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span
                  className={`p-2 rounded-lg ${
                    isAudit
                      ? "bg-purple-100 text-purple-600"
                      : isOutbound
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {isAudit ? <ListChecks size={24} /> : <Package size={24} />}
                </span>
                {getTitle()}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Quét mã vạch hoặc tải ảnh mã để nhập kho
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* LEFT: WORKSTATION */}
            <div className="w-[400px] flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-20">
              {/* 1. Chọn Sản phẩm */}
              <div className="p-5 border-b dark:border-gray-700">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Đang làm việc với sản phẩm
                </label>

                {!currentVariant ? (
                  <button
                    onClick={() => setShowVariantSelector(true)}
                    className="w-full py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all flex flex-col items-center gap-2 group"
                  >
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-blue-200 transition-colors">
                      <Search className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="font-medium">
                      Chọn sản phẩm để bắt đầu
                    </span>
                  </button>
                ) : (
                  <div className="relative group">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex items-start gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                        <Package className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white truncate">
                          {currentVariant.product?.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {currentVariant.color} • SKU: {currentVariant.sku}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-xs bg-white/50 px-2 py-1 rounded border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                            Tồn kho: {currentVariant.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowVariantSelector(true)}
                      className="absolute -top-2 -right-2 bg-white dark:bg-gray-700 shadow border rounded-full p-1.5 hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                      title="Đổi sản phẩm"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Khu vực SCAN */}
              <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
                {currentVariant && (
                  <>
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Barcode className="w-4 h-4" />
                        Nhập liệu / Quét mã
                      </label>

                      {/* Control Buttons */}
                      <div className="flex gap-2">
                        {/* Nút Upload Ảnh */}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 transition-colors"
                          title="Tải ảnh chứa mã vạch để quét"
                        >
                          <Upload className="w-3 h-3" />
                          {isProcessingImage ? "Đang đọc..." : "Tải ảnh"}
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />

                        {/* Nút Toggle Camera */}
                        <button
                          onClick={() => setShowCamera(!showCamera)}
                          className={`text-xs flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
                            showCamera
                              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                              : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                          }`}
                        >
                          {showCamera ? (
                            <X className="w-3 h-3" />
                          ) : (
                            <QrCode className="w-3 h-3" />
                          )}
                          {showCamera ? "Tắt Cam" : "Mở Cam"}
                        </button>
                      </div>
                    </div>

                    {/* Camera View Area */}
                    {showCamera ? (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden relative shadow-inner">
                        <ScannerCamera onScan={handleProcessSerial} />
                      </div>
                    ) : (
                      // Placeholder khi tắt cam
                      <div className="aspect-video bg-gray-100 dark:bg-gray-700/50 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-xs">Camera đang tắt</p>
                      </div>
                    )}

                    {/* Manual Input */}
                    <div className="relative">
                      <input
                        ref={scanInputRef}
                        type="text"
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Đặt trỏ chuột vào đây và bắn..."
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border-2 border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 font-mono text-lg transition-all"
                        autoFocus
                      />
                      <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        Enter
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-xs text-blue-700 dark:text-blue-300 leading-relaxed border border-blue-100 dark:border-blue-900/30">
                      <p className="flex gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          Mẹo: Bạn có thể tải ảnh mã vạch lên để test nếu không
                          có Camera.
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Left */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 text-xs text-gray-500 text-center">
                Tổng số lượng:{" "}
                <b className="text-lg text-gray-900 dark:text-white ml-1">
                  {items.reduce((acc, i) => acc + i.quantity, 0)}
                </b>
              </div>
            </div>

            {/* RIGHT: TICKET PREVIEW */}
            <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
              {/* Note Field */}
              <div className="p-6 pb-2">
                <input
                  className="w-full bg-transparent text-2xl font-semibold placeholder-gray-400 border-none focus:ring-0 px-0 text-gray-900 dark:text-white"
                  placeholder="Nhập tên phiếu (VD: Nhập hàng lô #A10)..."
                  value={ticketReason}
                  onChange={(e) => setTicketReason(e.target.value)}
                />
                <div className="h-px w-full bg-gray-200 dark:bg-gray-700 mt-2"></div>
              </div>

              {/* List Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 select-none">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <ListChecks className="w-10 h-10" />
                    </div>
                    <p className="text-lg font-medium">Chưa có dữ liệu</p>
                    <p className="text-sm">Chọn sản phẩm bên trái để bắt đầu</p>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group"
                    >
                      <div className="px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
                        <div className="font-bold text-gray-800 dark:text-gray-200">
                          {idx + 1}. {item.variant.product?.name}
                          <span className="ml-2 font-normal text-sm text-gray-500">
                            ({item.variant.color})
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-500">
                            SL:{" "}
                            <span className="font-bold text-gray-900 dark:text-white text-base">
                              {item.quantity}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {item.serials.map((serial, sIdx) => (
                            <div
                              key={sIdx}
                              className="group/tag relative pl-3 pr-8 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded border border-blue-100 dark:border-blue-800 text-sm font-mono flex items-center hover:bg-blue-100 transition-colors cursor-default"
                            >
                              {serial}
                              <button
                                onClick={() => handleRemoveSerial(idx, serial)}
                                className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 hover:bg-red-200 hover:text-red-600 rounded-full transition-colors opacity-0 group-hover/tag:opacity-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex justify-end gap-3 shrink-0 z-30">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmitTicket}
              disabled={items.length === 0}
              className={`px-8 py-2.5 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all transform active:scale-95
                  ${
                    items.length === 0
                      ? "opacity-50 cursor-not-allowed bg-gray-400"
                      : isAudit
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                      : isOutbound
                      ? "bg-gradient-to-r from-red-600 to-orange-600"
                      : "bg-gradient-to-r from-blue-600 to-cyan-600"
                  }
                `}
            >
              <Save className="w-5 h-5" />
              {isAudit ? "Hoàn tất Kiểm kê" : "Lưu phiếu"}
            </button>
          </div>
        </div>
      </div>

      {showVariantSelector && (
        <VariantSelector
          variants={variants}
          currentId={null}
          onSelect={(v) => {
            setCurrentVariant(v);
            setShowVariantSelector(false);
          }}
          onClose={() => setShowVariantSelector(false)}
        />
      )}
    </>
  );
}
