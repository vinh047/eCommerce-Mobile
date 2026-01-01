// components/Cart/CartMobileCheckout.jsx
import { Button } from "../ui/form/Button" 

export default function CartMobileCheckout({ total, onCheckout, itemCount, disabled }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Tổng cộng ({itemCount} món)</span>
          <span className="font-bold text-xl text-blue-600">{total}</span>
        </div>
        <Button 
            primary 
            size="lg" 
            className="flex-1 shadow-md shadow-blue-200"
            onClick={onCheckout}
            disabled={disabled}
        >
          Đặt hàng ngay
        </Button>
      </div>
    </div>
  )
}