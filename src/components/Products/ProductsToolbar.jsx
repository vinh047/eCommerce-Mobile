'use client'

import { useState } from 'react'

const brandOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'samsung', label: 'Samsung' },
  { value: 'xiaomi', label: 'Xiaomi' },
  { value: 'oppo', label: 'OPPO' }
]

const categoryOptions = [
  { value: 'smartphone', label: 'Điện thoại' },
  { value: 'tablet', label: 'Máy tính bảng' },
  { value: 'accessory', label: 'Phụ kiện' },
  { value: 'laptop', label: 'Laptop' }
]

const statusOptions = [
  { value: 'active', label: 'Đang hiển thị' },
  { value: 'inactive', label: 'Đã ẩn' }
]

const ratingOptions = [
  { value: '5', label: '5 sao trở lên' },
  { value: '4', label: '4 sao trở lên' },
  { value: '3', label: '3 sao trở lên' },
  { value: '2', label: '2 sao trở lên' },
  { value: '1', label: '1 sao trở lên' }
]

export default function ProductsToolbar({ filters, onFiltersChange, onClearFilters }) {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [searchValue, setSearchValue] = useState('')

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
  }

  const handleCheckboxChange = (filterType, value, checked) => {
    const currentValues = filters[filterType] || []
    let newValues

    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter(v => v !== value)
    }

    onFiltersChange({
      ...filters,
      [filterType]: newValues
    })
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchValue(value)
    onFiltersChange({
      ...filters,
      search: value
    })
  }

  const handleClearFilters = () => {
    setSearchValue('')
    onClearFilters()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <input 
              type="text" 
              value={searchValue}
              onChange={handleSearch}
              placeholder="Tìm theo tên sản phẩm hoặc SKU..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
            />
            <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
          </div>
        </div>
        
        {/* Advanced Filters */}
        <div className="flex items-center space-x-3">
          {/* Brand Filter */}
          <FilterDropdown
            label="Thương hiệu"
            options={brandOptions}
            selectedValues={filters.brands || []}
            onSelectionChange={(values) => onFiltersChange({ ...filters, brands: values })}
            isOpen={openDropdown === 'brand'}
            onToggle={() => toggleDropdown('brand')}
          />
          
          {/* Category Filter */}
          <FilterDropdown
            label="Danh mục"
            options={categoryOptions}
            selectedValues={filters.categories || []}
            onSelectionChange={(values) => onFiltersChange({ ...filters, categories: values })}
            isOpen={openDropdown === 'category'}
            onToggle={() => toggleDropdown('category')}
          />
          
          {/* Status Filter */}
          <FilterDropdown
            label="Trạng thái"
            options={statusOptions}
            selectedValues={filters.status || []}
            onSelectionChange={(values) => onFiltersChange({ ...filters, status: values })}
            isOpen={openDropdown === 'status'}
            onToggle={() => toggleDropdown('status')}
          />
          
          {/* Rating Filter */}
          <div className="relative">
            <select 
              value={filters.rating || ''}
              onChange={(e) => onFiltersChange({ ...filters, rating: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">Đánh giá</option>
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Clear Filters */}
          <button 
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <i className="fas fa-times mr-2"></i>Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  )
}

function FilterDropdown({ label, options, selectedValues, onSelectionChange, isOpen, onToggle }) {
  const handleCheckboxChange = (value, checked) => {
    let newValues
    if (checked) {
      newValues = [...selectedValues, value]
    } else {
      newValues = selectedValues.filter(v => v !== value)
    }
    onSelectionChange(newValues)
  }

  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 bg-white dark:bg-gray-700 dark:text-white"
      >
        <span>{label}</span>
        <i className="fas fa-chevron-down text-sm"></i>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
          <div className="p-3 space-y-2">
            {options.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm dark:text-white">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}