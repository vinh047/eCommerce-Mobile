"use client";

import { useState, useEffect, useCallback } from "react";
import usePagination from "@/hooks/usePagination";

// Sample product data
const sampleProducts = [
  {
    id: "PRD001",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD0001",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD0011",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD0021",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD0031",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD0041",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD0051",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD0061",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD0071",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD0081",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD0091",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD009001",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD00711",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD00721",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD00731",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD00741",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD00751",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD00761",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD00771",
    name: "iPhone 15 Pro Max 256GB",
    sku: "SKU001",
    brand: "Apple",
    category: "Điện thoại",
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    createdAt: "2024-11-15",
    price: 29990000,
    salePrice: 27990000,
    stock: 50,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp.",
  },
  {
    id: "PRD002",
    name: "Samsung Galaxy S24 Ultra",
    sku: "SKU002",
    brand: "Samsung",
    category: "Điện thoại",
    rating: 4.6,
    reviewCount: 89,
    isActive: true,
    createdAt: "2024-11-14",
    price: 32990000,
    salePrice: 30990000,
    stock: 30,
    description:
      "Galaxy S24 Ultra với S Pen tích hợp và camera zoom 100x Space Zoom.",
  },
  {
    id: "PRD003",
    name: "AirPods Pro 2nd Gen",
    sku: "SKU003",
    brand: "Apple",
    category: "Phụ kiện",
    rating: 4.9,
    reviewCount: 256,
    isActive: true,
    createdAt: "2024-11-13",
    price: 6490000,
    salePrice: 5990000,
    stock: 100,
    description:
      "AirPods Pro thế hệ thứ 2 với chip H2 và tính năng chống ồn nâng cao.",
  },
  {
    id: "PRD004",
    name: "iPad Air 5th Gen",
    sku: "SKU004",
    brand: "Apple",
    category: "Máy tính bảng",
    rating: 4.7,
    reviewCount: 67,
    isActive: false,
    createdAt: "2024-11-12",
    price: 15990000,
    salePrice: 14990000,
    stock: 25,
    description:
      "iPad Air với chip M1 mạnh mẽ và màn hình Liquid Retina 10.9 inch.",
  },
  {
    id: "PRD005",
    name: "MacBook Air M2",
    sku: "SKU005",
    brand: "Apple",
    category: "Laptop",
    rating: 4.8,
    reviewCount: 145,
    isActive: true,
    createdAt: "2024-11-11",
    price: 27990000,
    salePrice: 25990000,
    stock: 15,
    description:
      "MacBook Air với chip M2 nhanh hơn 18% so với M1 và pin 18 giờ.",
  },
];

export function useProducts() {
  const [products, setProducts] = useState(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    column: "",
    direction: "asc",
  });

  const {
    paginatedData: currentProducts,
    pageSize,
    currentPage,
    totalPages,
    totalItems,
    setPageSize,
    setCurrentPage,
    changePage,
    changePageSize,
  } = usePagination(filteredProducts, 10);

  // --- Filtering ---
  const applyFilters = useCallback(() => {
    let filtered = [...products];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.sku?.toLowerCase().includes(searchLower) ||
          product.id.toLowerCase().includes(searchLower)
      );
    }

    if (filters.brands?.length) {
      filtered = filtered.filter((p) =>
        filters.brands.some((b) => p.brand.toLowerCase() === b.toLowerCase())
      );
    }

    if (filters.categories?.length) {
      filtered = filtered.filter((p) =>
        filters.categories.some(
          (c) => p.category.toLowerCase() === c.toLowerCase()
        )
      );
    }

    if (filters.status?.length) {
      filtered = filtered.filter(
        (p) =>
          (filters.status.includes("active") && p.isActive) ||
          (filters.status.includes("inactive") && !p.isActive)
      );
    }

    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, filters, setCurrentPage]);

  // --- Sorting ---
  const applySorting = useCallback(() => {
    if (!sortConfig.column) return;
    const sorted = [...filteredProducts].sort((a, b) => {
      const aVal = a[sortConfig.column];
      const bVal = b[sortConfig.column];

      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
    setFilteredProducts(sorted);
  }, [filteredProducts, sortConfig]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    applySorting();
  }, [applySorting]);

  // --- Actions ---
  const selectItem = useCallback((id, selected) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (selected) newSet.add(id);
      else newSet.delete(id);
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    currentProducts.forEach((p) => selectedItems.add(p.id));
  }, [currentProducts, selectedItems]);

  const deselectAll = useCallback(() => setSelectedItems(new Set()), []);

  const updateFilters = useCallback((newFilters) => setFilters(newFilters), []);
  const updateSort = useCallback((col) => {
    setSortConfig((prev) => ({
      column: col,
      direction:
        prev.column === col && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const bulkAction = useCallback((action, ids) => {
    setLoading(true);
    setTimeout(() => {
      setProducts((prev) => {
        switch (action) {
          case "activate":
            return prev.map((p) =>
              ids.includes(p.id) ? { ...p, isActive: true } : p
            );
          case "deactivate":
            return prev.map((p) =>
              ids.includes(p.id) ? { ...p, isActive: false } : p
            );
          case "delete":
            return prev.filter((p) => !ids.includes(p.id));
          default:
            return prev;
        }
      });
      setSelectedItems(new Set());
      setLoading(false);
    }, 1000);
  }, []);

  const deleteProduct = useCallback((id) => {
    setLoading(true);
    setTimeout(() => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setLoading(false);
    }, 500);
  }, []);

  const refreshProducts = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setProducts([...sampleProducts]);
      setLoading(false);
    }, 1000);
  }, []);

  return {
    products: currentProducts,
    selectedItems,
    currentPage,
    totalPages,
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
    refreshProducts,
  };
}
