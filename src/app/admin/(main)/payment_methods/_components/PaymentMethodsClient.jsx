"use client";

import { useState, useCallback, useEffect } from "react";
import { Plus, CreditCard } from "lucide-react";
import paymentApi from "@/lib/api/paymentApi";
import { usePaymentMutations } from "../hooks/usePaymentMutations";
import PageHeader from "@/components/common/PageHeader";
import PaymentMethodList from "./PaymentMethodList";
import PaymentMethodDetail from "./PaymentMethodDetail";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSION_KEYS } from "../../constants/permissions";
import PermissionGate from "../../../_components/PermissionGate";

export default function PaymentMethodsClient({ initialData }) {
  // State Data
  const [methods, setMethods] = useState(initialData || []);
  const [isLoading, setIsLoading] = useState(false);

  // State UI
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch Data Function
  const fetchMethods = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await paymentApi.getMethods({});
      setMethods(res.data || res); // Tùy cấu trúc trả về của API
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Init Mutations Hook
  const { saveMethod, deleteMethod, saveAccount, deleteAccount, isMutating } =
    usePaymentMutations(fetchMethods);

  // Handlers
  const handleSelectMethod = (id) => {
    setIsCreating(false);
    setSelectedMethodId(id);
  };

  const handleCreateNew = () => {
    setSelectedMethodId(null);
    setIsCreating(true);
  };

  // Logic lấy method đang active để truyền xuống Detail
  const activeMethod = methods.find((m) => m.id === selectedMethodId);

  // Logic sau khi save thành công thì reset mode
  const handleSaveMethodWrapper = async (data) => {
    const mode = isCreating ? "create" : "edit";
    await saveMethod(data, mode, selectedMethodId);
    if (isCreating) setIsCreating(false); // Tắt form tạo mới sau khi lưu xong
  };

  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSION_KEYS.VIEW_PAYMENT_METHOD)) {
    return (
      <div className="p-6 text-red-600">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return (
    <div className="overflow-auto px-8 py-6 h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Phương thức thanh toán
          </h1>
        </div>
        <PermissionGate permission={PERMISSION_KEYS.CREATE_PAYMENT_METHOD}>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm phương thức
          </button>
        </PermissionGate>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left: List */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <PaymentMethodList
            methods={methods}
            selectedId={isCreating ? "new" : selectedMethodId}
            onSelect={handleSelectMethod}
          />
        </div>

        {/* Right: Detail */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm min-h-[500px]">
            {activeMethod || isCreating ? (
              <PaymentMethodDetail
                key={activeMethod?.id || "new"} // Force re-render form khi đổi item
                isCreating={isCreating}
                method={activeMethod}
                // Props mutation truyền xuống dưới
                onSaveMethod={handleSaveMethodWrapper}
                onDeleteMethod={() => deleteMethod(activeMethod?.id)}
                onSaveAccount={saveAccount}
                onDeleteAccount={deleteAccount}
                isMutating={isMutating}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-10">
                <CreditCard className="w-16 h-16 mb-4 opacity-50" />
                <p>Chọn phương thức thanh toán để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
