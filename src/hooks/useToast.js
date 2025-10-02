'use client'

import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    const toast = {
      id,
      message,
      type,
      duration
    }

    setToasts(prev => [...prev, toast])

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return {
    toasts,
    showToast,
    removeToast
  }
}