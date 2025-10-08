'use client'

import { useState, useEffect } from 'react'
import CartHeader from '@/components/Cart/CartHeader'
import CartBreadcrumb from '@/components/Cart/CartBreadcrumb'
import CartItem from '@/components/Cart/CartItem'
import CartSummary from '@/components/Cart/CartSummary'
import CartMobileCheckout from '@/components/Cart/CartMobileCheckout'
import { LoadingState, EmptyState, ErrorState } from '@/components/Cart/CartStates'
import { formatPrice, showNotification } from '@/utils/format'
import './CartStyles.css'

export default function CartPage() {
  const [cartState, setCartState] = useState('loading') // loading, empty, error, success
  const [cartData, setCartData] = useState({
    items: [],
    coupon: null,
    discount: 0,
    shipping: 0
  })

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    setCartState('loading')
    
    // Simulate API call
    setTimeout(() => {
      const initialData = {
        items: [
          {
            id: 1,
            name: "iPhone 15 Pro Max",
            variant: "256GB - Titan Tự Nhiên",
            price: 28990000,
            quantity: 1,
            image: "iphone15pro.jpg"
          },
          {
            id: 2,
            name: "AirPods Pro 2nd Gen",
            variant: "USB-C - Trắng",
            price: 5990000,
            quantity: 2,
            image: "airpods.jpg"
          }
        ],
        coupon: null,
        discount: 0,
        shipping: 0
      }

      if (initialData.items.length === 0) {
        setCartState('empty')
      } else {
        setCartData(initialData)
        setCartState('success')
      }
    }, 1500)
  }

  const handleUpdateQuantity = (itemId, change) => {
    setCartData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change
          if (newQuantity < 1) {
            // Will be handled by remove item
            return item
          }
          if (newQuantity > 10) {
            showNotification('Số lượng tối đa là 10', 'error')
            return item
          }
          return { ...item, quantity: newQuantity }
        }
        return item
      })
      
      return { ...prev, items: updatedItems }
    })
    
    showNotification('Đã cập nhật số lượng', 'success')
  }

  const handleRemoveItem = (itemId) => {
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`)
    itemElement?.classList.add('removing')
    
    setTimeout(() => {
      setCartData(prev => {
        const updatedItems = prev.items.filter(item => item.id !== itemId)
        if (updatedItems.length === 0) {
          setCartState('empty')
        }
        return { ...prev, items: updatedItems }
      })
      
      showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success')
    }, 300)
  }

  const handleApplyCoupon = (event) => {
    event.preventDefault()
    const couponInput = document.getElementById('couponInput')
    const couponCode = couponInput.value.trim().toUpperCase()
    const errorDiv = document.getElementById('couponError')
    const successDiv = document.getElementById('couponSuccess')
    
    errorDiv.classList.add('hidden')
    successDiv.classList.add('hidden')
    
    if (!couponCode) {
      errorDiv.textContent = 'Vui lòng nhập mã giảm giá'
      errorDiv.classList.remove('hidden')
      return
    }
    
    // Simulate coupon validation
    const validCoupons = {
      'WELCOME10': { discount: 0.1, minOrder: 0, description: 'Giảm 10%' },
      'SAVE50K': { discount: 50000, minOrder: 500000, description: 'Giảm 50.000₫' },
      'FREESHIP': { discount: 0, shipping: 0, description: 'Miễn phí vận chuyển' }
    }
    
    const coupon = validCoupons[couponCode]
    
    if (!coupon) {
      errorDiv.textContent = 'Mã giảm giá không hợp lệ'
      errorDiv.classList.remove('hidden')
      couponInput.classList.add('error-shake')
      setTimeout(() => couponInput.classList.remove('error-shake'), 500)
      return
    }
    
    const subtotal = cartData.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      errorDiv.textContent = `Đơn hàng tối thiểu ${formatPrice(coupon.minOrder)}`
      errorDiv.classList.remove('hidden')
      return
    }
    
    setCartData(prev => ({
      ...prev,
      coupon: coupon,
      discount: typeof coupon.discount === 'number' && coupon.discount < 1 
        ? subtotal * coupon.discount 
        : coupon.discount,
      shipping: coupon.shipping !== undefined ? coupon.shipping : prev.shipping
    }))
    
    successDiv.textContent = `Đã áp dụng: ${coupon.description}`
    successDiv.classList.remove('hidden')
    couponInput.value = ''
    couponInput.classList.add('success-animation')
    setTimeout(() => couponInput.classList.remove('success-animation'), 600)
  }

  const handleCheckout = () => {
    if (cartData.items.length === 0) {
      showNotification('Giỏ hàng trống', 'error')
      return
    }
    
    showNotification('Đang chuyển đến trang thanh toán...', 'success')
    
    // Simulate navigation
    setTimeout(() => {
      console.log('Navigate to checkout with data:', cartData)
    }, 1000)
  }

  const subtotal = cartData.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const total = formatPrice(subtotal - cartData.discount + cartData.shipping)

  return (
    <div className="bg-gray-50">
      <CartHeader />
      <CartBreadcrumb />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 lg:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
          <p className="text-gray-600 mt-1">Xem lại và chỉnh sửa đơn hàng trước khi thanh toán</p>
        </div>

        {cartState === 'loading' && <LoadingState />}
        {cartState === 'empty' && <EmptyState />}
        {cartState === 'error' && <ErrorState onRetry={loadCart} />}
        {cartState === 'success' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartData.items.map(item => (
                <CartItem 
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
              
              {/* Continue Shopping */}
              <div className="pt-4">
                <a href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium focus-ring rounded">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Tiếp tục mua sắm
                </a>
              </div>
            </div>

            <CartSummary 
              subtotal={subtotal}
              discount={cartData.discount}
              shipping={cartData.shipping}
              onApplyCoupon={handleApplyCoupon}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </main>

      {cartState === 'success' && (
        <CartMobileCheckout 
          total={total}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  )
}