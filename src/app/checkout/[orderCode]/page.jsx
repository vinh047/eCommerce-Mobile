// Đường dẫn: app/checkout/[orderCode]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosClient from "@/lib/api/axiosClient"; // Ensure path is correct

// --- Helper: Format currency ---
const fmt = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

/**
 * ===================================================================
 * Main Component: Checkout Page
 * ===================================================================
 */
export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const orderCode = params.orderCode;

  const [order, setOrder] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User selections
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("COD"); // Default

  // --- NEW: State for adding new address ---
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    line: "",
    phone: "",
    ward: "",
    district: "",
    province: "",
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isDeletingAddress, setIsDeletingAddress] = useState(null); // Store ID of deleting address
  // -----------------------------------------

  useEffect(() => {
    if (orderCode) {
      loadCheckoutData();
    }
  }, [orderCode]);

  // 1. Load pending order details and addresses
  const loadCheckoutData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`/api/checkout/${orderCode}`);
      setOrder(response.data);
      const userAddresses = response.data.user?.addresses || [];
      setAddresses(userAddresses);

      // Auto-select default or first address
      const defaultAddress = userAddresses.find(
        (a) => a.isDefault ?? a.is_default
      ); // Check isDefault mapping
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (userAddresses.length > 0) {
        setSelectedAddressId(userAddresses[0].id);
      }
      setShowNewAddressForm(userAddresses.length === 0); // Show form if no address exists
    } catch (err) {
      console.error("Could not load order:", err);
      setError(
        err.response?.data?.error || "Could not find order or it has expired."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Handle adding a new address ---
  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault(); // Prevent form submission
    // Basic validation
    if (
      !newAddress.line ||
      !newAddress.phone ||
      !newAddress.province ||
      !newAddress.district ||
      !newAddress.ward
    ) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ."); // Use proper notification
      return;
    }

    setIsSavingAddress(true);
    setError(null);
    try {
      // Call the new API to save the address (See Step 2 below)
      const response = await axiosClient.post(
        `/api/users/addresses`,
        newAddress
      );
      const savedAddress = response.data;

      // Add to list, select it, and hide form
      setAddresses((prev) => [...prev, savedAddress]);
      setSelectedAddressId(savedAddress.id);
      setShowNewAddressForm(false);
      setNewAddress({
        line: "",
        phone: "",
        ward: "",
        district: "",
        province: "",
      }); // Clear form
    } catch (err) {
      console.error("Error saving address:", err);
      setError(err.response?.data?.error || "Could not save new address.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  // ----------------------------------------
  // --- NEW: Handle Deleting an Address ---
  const handleDeleteAddress = async (addressIdToDelete) => {
    if (addressIdToDelete === selectedAddressId) {
      setError(
        "Bạn không thể xóa địa chỉ đang được chọn. Vui lòng chọn địa chỉ khác trước khi xóa."
      );
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      // Nên dùng modal thay vì confirm
      return;
    }
    setIsDeletingAddress(addressIdToDelete);
    setError(null);
    try {
      // Gọi API DELETE (sẽ tạo ở file tiếp theo)
      await axiosClient.delete(`/api/users/addresses/${addressIdToDelete}`);
      setAddresses((prev) =>
        prev.filter((addr) => addr.id !== addressIdToDelete)
      );
      // Nếu địa chỉ bị xóa đang được chọn (ít xảy ra do check ở trên), bỏ chọn nó
      if (selectedAddressId === addressIdToDelete) {
        setSelectedAddressId(null);
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      setError(err.response?.data?.error || "Không thể xóa địa chỉ.");
    } finally {
      setIsDeletingAddress(null);
    }
  };
  // ----------------------------------------
  // 2. Handle "Place Order" button click
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      // Check if user is trying to use the new address form but hasn't saved yet
      if (showNewAddressForm && newAddress.line) {
        alert("Vui lòng lưu địa chỉ mới trước khi đặt hàng.");
      } else {
        alert("Vui lòng chọn hoặc thêm địa chỉ giao hàng.");
      }
      return;
    }

    setLoading(true); // Indicate placing order process
    setError(null);
    try {
      // Call PUT API to finalize the order
      const response = await axiosClient.put(`/api/checkout/${orderCode}`, {
        addressId: selectedAddressId,
        paymentMethod: selectedPayment,
      });

      // 3. Redirect to Thank You page
      router.push(`/checkout/thank-you?orderCode=${response.data.orderCode}`);
    } catch (err) {
      console.error("Error placing order:", err);
      setError(
        err.response?.data?.error ||
          "Could not complete order. Please try again."
      );
      setLoading(false); // Re-enable button on error
    }
  };

  // --- Render UI ---
  // (Loading and Error states remain the same)
  if (loading && !order) {
    // Show loading only initially
    return (
      <div className="min-h-screen grid place-items-center text-gray-600 bg-gray-50">
        Đang tải...
      </div>
    );
  }
  if (error && !order) {
    // Show full error page only if order loading failed
    return (
      <div className="min-h-screen grid place-items-center text-red-600 bg-gray-50">
        {error}
      </div>
    );
  }
  if (!order) return null; // Should not happen

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {" "}
      {/* Add padding bottom */}
      <CheckoutHeader />
      <CheckoutBreadcrumb orderCode={order.code} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Show persistent errors */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Main Info */}
          <div className="lg:col-span-7 space-y-6">
            <AddressSelector
              addresses={addresses}
              selectedId={selectedAddressId}
              onSelect={setSelectedAddressId}
              // --- NEW Props ---
              showNewForm={showNewAddressForm}
              onToggleNewForm={() => {
                setShowNewAddressForm(!showNewAddressForm);
                if (!showNewAddressForm) setSelectedAddressId(null); // Deselect if opening form
              }}
              newAddressData={newAddress}
              onNewAddressChange={handleNewAddressChange}
              onSaveNewAddress={handleAddNewAddress}
              isSaving={isSavingAddress}
              onDelete={handleDeleteAddress}
              isDeletingId={isDeletingAddress}
              // ---------------
            />
            <PaymentSelector
              selectedMethod={selectedPayment}
              onSelect={setSelectedPayment}
            />
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <OrderSummary
              order={order}
              onPlaceOrder={handlePlaceOrder}
              loading={loading || isSavingAddress} // Disable button while loading or saving address
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-Components (CheckoutHeader, CheckoutBreadcrumb, PaymentSelector, OrderSummary remain mostly the same) ---

// [Keep CheckoutHeader component code here]
function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-3 h-16">
          <a
            href="/"
            className="flex items-center gap-2 group focus-ring rounded"
          >
            <div className="w-9 h-9 rounded-xl bg-primary text-white grid place-items-center shadow-soft">
              {/* Phone Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect
                  x="6"
                  y="2"
                  width="12"
                  height="20"
                  rx="3"
                  fill="currentColor"
                />
                <circle cx="12" cy="18" r="1.2" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              MobileX
            </span>
          </a>
          <div className="text-sm font-medium text-gray-700">
            Thanh toán an toàn
          </div>
        </div>
      </div>
    </header>
  );
}

// [Keep CheckoutBreadcrumb component code here]
function CheckoutBreadcrumb({ orderCode }) {
  return (
    <nav className="max-w-7xl mx-auto px-4 md:px-6 mt-4 text-sm text-gray-500">
      <ol className="flex items-center gap-2 whitespace-nowrap overflow-x-auto">
        <li>
          <a href="/" className="hover:text-gray-700 focus-ring rounded">
            Trang chủ
          </a>
        </li>
        <li className="text-gray-400">/</li>
        <li>
          <a href="/cart" className="hover:text-gray-700 focus-ring rounded">
            Giỏ hàng
          </a>
        </li>
        <li className="text-gray-400">/</li>
        <li className="text-gray-700 font-medium truncate" aria-current="page">
          Thanh toán ({orderCode})
        </li>
      </ol>
    </nav>
  );
}

/**
 * ===================================================================
 * Component Phụ 3: Chọn Địa chỉ (UPDATED)
 * ===================================================================
 */
function AddressSelector({
  addresses = [],
  selectedId,
  onSelect,
  // --- NEW Props ---
  showNewForm,
  onToggleNewForm,
  newAddressData,
  onNewAddressChange,
  onSaveNewAddress,
  isSaving,
  onDelete,
  isDeletingId,
  // ---------------
}) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-soft p-5 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          1. Chọn hoặc thêm địa chỉ giao hàng
        </h2>
        {/* --- NEW: Toggle Button --- */}
        <button
          onClick={onToggleNewForm}
          className="text-sm font-medium text-primary hover:text-blue-700 focus-ring rounded px-2 py-1"
        >
          {showNewForm ? "Hủy" : "Thêm địa chỉ mới +"}
        </button>
        {/* ------------------------ */}
      </div>

      {/* --- Show Form OR List --- */}
      {showNewForm ? (
        <NewAddressForm
          addressData={newAddressData}
          onChange={onNewAddressChange}
          onSubmit={onSaveNewAddress}
          isSaving={isSaving}
        />
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {addresses.map((addr) => {
            const isSelected = addr.id === selectedId;
            const isDefault = addr.isDefault ?? addr.is_default ?? false;
            return (
              <div
                key={addr.id}
                onClick={() => onSelect(addr.id)} // Select this address
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") onSelect(addr.id);
                }}
                className={`rounded-lg border p-4 cursor-pointer transition focus-ring relative ${
                  isSelected
                    ? "border-primary bg-blue-50 ring-2 ring-primary/30"
                    : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start mb-1 gap-2">
                  <span className="font-medium text-gray-800 break-words">
                    {addr.line}
                  </span>
                  {isDefault && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 flex-shrink-0">
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 break-words">
                  {addr.ward}, {addr.district}, {addr.province}
                </p>
                {addr.phone && (
                  <p className="text-sm text-gray-600">SĐT: {addr.phone}</p>
                )}
              </div>
            );
          })}
          {addresses.length === 0 && !showNewForm && (
            <p className="text-sm text-gray-500 italic">
              Bạn chưa có địa chỉ nào.
            </p>
          )}
        </div>
      )}
      {showNewForm ? (
        <NewAddressForm /* ... */ />
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {addresses.map((addr) => {
            const isSelected = addr.id === selectedId;
            const isDeleting = isDeletingId === addr.id; // Kiểm tra xem có đang xóa cái này không
            const isDefault = addr.isDefault ?? addr.is_default ?? false;
            return (
              // Thêm class opacity-50 pointer-events-none khi đang xóa
              <div
                key={addr.id}
                className={`rounded-lg border transition ${
                  isSelected
                    ? "border-primary bg-blue-50 ring-2 ring-primary/30"
                    : "border-gray-200"
                } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div
                  onClick={() => !isDeleting && onSelect(addr.id)} // Không cho chọn khi đang xóa
                  // ... rest of the div props ...
                  className="p-4 cursor-pointer focus-ring rounded-t-lg" // Chỉ bo góc trên
                >
                  {/* ... existing address details ... */}
                </div>

                {/* --- THÊM KHỐI NÚT XÓA --- */}
                <div className="border-t border-gray-200 px-4 py-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn click vào card
                      onDelete(addr.id);
                    }}
                    disabled={isDeleting || isSelected} // Không cho xóa nếu đang xóa HOẶC đang được chọn
                    className="text-xs font-medium text-red-600 hover:text-red-800 focus-ring rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Xóa địa chỉ ${addr.line}`}
                  >
                    {isDeleting ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
                {/* ------------------------- */}
              </div>
            );
          })}
          {/* ... rest of AddressSelector ... */}
        </div>
      )}
    </div>
  );
}

/**
 * ===================================================================
 * Component Phụ 3.1: Form Địa chỉ Mới
 * ===================================================================
 */
function NewAddressForm({ addressData, onChange, onSubmit, isSaving }) {
  // Simple form layout, you can enhance this
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* Input Fields */}
      <div>
        <label
          htmlFor="line"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Địa chỉ (Số nhà, đường)
        </label>
        <input
          type="text"
          name="line"
          id="line"
          required
          value={addressData.line}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm focus-ring"
        />
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Số điện thoại
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          required
          value={addressData.phone}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm focus-ring"
        />
      </div>
      {/* Use Selects for Province/District/Ward later for better UX */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tỉnh/Thành phố
          </label>
          <input
            type="text"
            name="province"
            id="province"
            required
            value={addressData.province}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm focus-ring"
          />
        </div>
        <div>
          <label
            htmlFor="district"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quận/Huyện
          </label>
          <input
            type="text"
            name="district"
            id="district"
            required
            value={addressData.district}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm focus-ring"
          />
        </div>
        <div>
          <label
            htmlFor="ward"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phường/Xã
          </label>
          <input
            type="text"
            name="ward"
            id="ward"
            required
            value={addressData.ward}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm focus-ring"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={isSaving}
        className="mt-2 w-full sm:w-auto px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-blue-700 transition focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            {" "}
            {/* Spinner */}
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Đang lưu...
          </>
        ) : (
          "Lưu và sử dụng địa chỉ này"
        )}
      </button>
    </form>
  );
}

// [Keep PaymentSelector component code here]
function PaymentSelector({ selectedMethod, onSelect }) {
  // Example methods
  const methods = [
    { id: "COD", name: "Thanh toán khi nhận hàng (COD)", disabled: false },
    { id: "VNPAY", name: "Thanh toán qua VNPAY", disabled: false }, // Allow selection for demo
    { id: "MOMO", name: "Thanh toán qua MoMo", disabled: true }, // Example disabled
  ];

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-soft p-5 md:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        2. Chọn phương thức thanh toán
      </h2>
      <div className="space-y-3">
        {methods.map((method) => {
          const isSelected = method.id === selectedMethod;
          return (
            <div
              key={method.id}
              onClick={() => !method.disabled && onSelect(method.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={method.disabled ? -1 : 0} // Make it focusable
              onKeyDown={(e) => {
                if (!method.disabled && (e.key === " " || e.key === "Enter"))
                  onSelect(method.id);
              }}
              className={`rounded-lg border p-4 transition focus-ring relative ${
                method.disabled
                  ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" // Disabled style
                  : isSelected
                  ? "border-primary bg-blue-50 ring-2 ring-primary/30 cursor-pointer" // Selected
                  : "border-gray-200 hover:border-gray-400 hover:bg-gray-50 cursor-pointer" // Default
              }`}
            >
              <span
                className={`font-medium ${
                  isSelected && !method.disabled ? "text-gray-800" : ""
                }`}
              >
                {method.name}
              </span>
              {method.disabled && (
                <span className="text-xs text-gray-400 ml-2">(Sắp có)</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// [Keep OrderSummary component code here - Button is already always visible]
function OrderSummary({ order, onPlaceOrder, loading }) {
  return (
    <div className="lg:sticky lg:top-24">
      <div className="rounded-xl bg-white border border-gray-200 shadow-soft p-5 md:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tóm tắt đơn hàng
        </h2>
        {/* Product List */}
        <div className="space-y-3 border-b border-gray-200 pb-4 max-h-60 overflow-y-auto pr-2">
          {(order.order_items || []).map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 grid place-items-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M6 10l6-6 6 6M4 19h16"
                  ></path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {item.name_snapshot || "Sản phẩm không xác định"}
                </p>
                <p className="text-sm text-gray-500">SL: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                {fmt.format(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        {/* Pricing Details */}
        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính</span>
            <span className="font-medium text-gray-800">
              {fmt.format(order.subtotal)}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Giảm giá (Coupon)</span>
              <span className="font-medium text-green-600">
                -{fmt.format(order.discount)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span className="font-medium text-gray-800">
              {order.shipping_fee > 0
                ? fmt.format(order.shipping_fee)
                : "Miễn phí"}
            </span>
          </div>
          <hr className="my-2 !mt-3 !mb-3" />
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-900">Tổng cộng</span>
            <span className="text-primary">{fmt.format(order.total)}</span>
          </div>
        </div>
        {/* Place Order Button */}
        <button
          onClick={onPlaceOrder}
          disabled={loading}
          className="mt-6 w-full px-4 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-blue-700 transition focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              {" "}
              {/* Spinner */}
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            "Đặt hàng"
          )}
        </button>
        <div className="mt-4 flex items-center justify-center text-xs text-gray-500 gap-1">
          <svg
            className="w-3 h-3 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
              clipRule="evenodd"
            />
          </svg>
          Thông tin của bạn được bảo mật
        </div>
      </div>
    </div>
  );
}
