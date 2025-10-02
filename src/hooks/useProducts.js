'use client'

import { useState, useEffect, useCallback } from 'react'

// Sample product data
const sampleProducts = [
  {
    id: 'PRD001',
    name: 'iPhone 15 Pro Max 256GB',
    sku: 'SKU001',
    brand: 'Apple',
    category: 'Điện thoại',
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: '2024-11-15',
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.'
  },
  {
    id: 'PRD002',
    name: 'Samsung Galaxy S24 Ultra',
    sku: 'SKU002',
    brand: 'Samsung',
    category: 'Điện thoại',
    rating: 4.6,
    reviewCount: 89,
    isActive: true,
    createdAt: '2024-11-14',
    price: 32990000,
    salePrice: 30990000,
    stock: 30,
    description: 'Galaxy S24 Ultra với S Pen tích hợp và camera zoom 100x Space Zoom.'
  },
  {
    id: 'PRD003',
    name: 'AirPods Pro 2nd Gen',
    sku: 'SKU003',
    brand: 'Apple',
    category: 'Phụ kiện',
    rating: 4.9,
    reviewCount: 256,
    isActive: true,
    createdAt: '2024-11-13',
    price: 6490000,
    salePrice: 5990000,
    stock: 100,
    description: 'AirPods Pro thế hệ thứ 2 với chip H2 và tính năng chống ồn nâng cao.'
  },
  {
    id: 'PRD004',
    name: 'iPad Air 5th Gen',
    sku: 'SKU004',
    brand: 'Apple',
    category: 'Máy tính bảng',
    rating: 4.7,
    reviewCount: 67,
    isActive: false,
    createdAt: '2024-11-12',
    price: 15990000,
    salePrice: 14990000,
    stock: 25,
    description: 'iPad Air với chip M1 mạnh mẽ và màn hình Liquid Retina 10.9 inch.'
  },
  {
    id: 'PRD005',
    name: 'MacBook Air M2',
    sku: 'SKU005',
    brand: 'Apple',
    category: 'Laptop',
    rating: 4.8,
    reviewCount: 145,
    isActive: true,
    createdAt: '2024-11-11',
    price: 27990000,
    salePrice: 25990000,
    stock: 15,
    description: 'MacBook Air với chip M2 nhanh hơn 18% so với M1 và pin 18 giờ.'
  }
]

export function useProducts() {
  const [products, setProducts] = useState(sampleProducts)
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts)
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [totalItems, setTotalItems] = useState(sampleProducts.length)
  const [filters, setFilters] = useState({})
  const [sortConfig, setSortConfig] = useState({ column: '', direction: 'asc' })

  // Filter products based on current filters
  const applyFilters = useCallback(() => {
    let filtered = [...products]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.id.toLowerCase().includes(searchLower)
      )
    }

    // Apply brand filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.some(brand => product.brand.toLowerCase() === brand.toLowerCase())
      )
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.some(category => product.category.toLowerCase() === category.toLowerCase())
      )
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(product => {
        if (filters.status.includes('active') && product.isActive) return true
        if (filters.status.includes('inactive') && !product.isActive) return true
        return false
      })
    }

    // Apply rating filter
    if (filters.rating) {
      const minRating = parseInt(filters.rating)
      filtered = filtered.filter(product => product.rating >= minRating)
    }

    setFilteredProducts(filtered)
    setTotalItems(filtered.length)
    setCurrentPage(1) // Reset to first page when filtering
  }, [products, filters])

  // Apply sorting
  const applySorting = useCallback(() => {
    if (!sortConfig.column) return

    const sorted = [...filteredProducts].sort((a, b) => {
      const aValue = a[sortConfig.column]
      const bValue = b[sortConfig.column]

      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortConfig.direction === 'asc' ? comparison : -comparison
      }

      if (typeof aValue === 'number') {
        const comparison = aValue - bValue
        return sortConfig.direction === 'asc' ? comparison : -comparison
      }

      return 0
    })

    setFilteredProducts(sorted)
  }, [filteredProducts, sortConfig])

  // Get current page products
  const getCurrentPageProducts = useCallback(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredProducts.slice(startIndex, endIndex)
  }, [filteredProducts, currentPage, pageSize])

  // Effects
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  useEffect(() => {
    applySorting()
  }, [applySorting])

  // Actions
  const selectItem = useCallback((itemId, selected) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(itemId)
      } else {
        newSet.delete(itemId)
      }
      return newSet
    })
  }, [])

  const selectAll = useCallback(() => {
    const currentPageProducts = getCurrentPageProducts()
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      currentPageProducts.forEach(product => newSet.add(product.id))
      return newSet
    })
  }, [getCurrentPageProducts])

  const deselectAll = useCallback(() => {
    setSelectedItems(new Set())
  }, [])

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  const updateSort = useCallback((column) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  const changePage = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  const changePageSize = useCallback((size) => {
    setPageSize(size)
    setCurrentPage(1)
  }, [])

  const bulkAction = useCallback((action, itemIds) => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      switch (action) {
        case 'activate':
          setProducts(prev => prev.map(product => 
            itemIds.includes(product.id) ? { ...product, isActive: true } : product
          ))
          break
        case 'deactivate':
          setProducts(prev => prev.map(product => 
            itemIds.includes(product.id) ? { ...product, isActive: false } : product
          ))
          break
        case 'delete':
          setProducts(prev => prev.filter(product => !itemIds.includes(product.id)))
          break
      }
      
      setSelectedItems(new Set())
      setLoading(false)
    }, 1000)
  }, [])

  const deleteProduct = useCallback((productId) => {
    setLoading(true)
    
    setTimeout(() => {
      setProducts(prev => prev.filter(product => product.id !== productId))
      setLoading(false)
    }, 500)
  }, [])

  const refreshProducts = useCallback(() => {
    setLoading(true)
    
    setTimeout(() => {
      // Simulate data refresh
      setProducts([...sampleProducts])
      setLoading(false)
    }, 1000)
  }, [])

  return {
    products: getCurrentPageProducts(),
    selectedItems,
    currentPage,
    pageSize,
    totalItems,
    loading,
    filters,
    sortConfig,
    selectItem,
    selectAll,
    deselectAll,
    updateFilters,
    updateSort,
    changePage,
    changePageSize,
    bulkAction,
    deleteProduct,
    refreshProducts
  }
}