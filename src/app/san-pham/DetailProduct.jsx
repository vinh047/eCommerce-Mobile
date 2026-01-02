"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { produce } from "immer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import {
  ShoppingCart,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  Truck,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { getRelatedProduct, getReviewsProducts } from "@/lib/api/productApi";
import cartsApi from "@/lib/api/cartsApi";
import { globalEvents } from "@/lib/globalEvents";
import ProductCard from "@/components/ui/product/ProductCard";
import ProductCardSkeleton from "@/components/ui/product/ProductCardSkeleton";

const DetailProduct = ({ product }) => {
  const router = useRouter();

  // --- STATE ---
  const [variantCurrent, setVariantCurrent] = useState(product.variants[0]);
  const [mediaCurrent, setMediaCurrent] = useState(variantCurrent.MediaVariant);
  const [quantity, setQuantity] = useState(1);

  // Reviews & Data
  const [reviews, setReviews] = useState(product.Review || []);
  const [relatedProducts, setRelatedProducts] = useState(null);

  // UI States
  const [activeTab, setActiveTab] = useState("desc"); // 'desc' | 'specs' | 'reviews'
  const [isExpandingDesc, setIsExpandingDesc] = useState(false); // Xem thêm mô tả
  const [loadedBtn, setLoadedBtn] = useState(false); // Loading cho nút mua
  const [loadingReviews, setLoadingReviews] = useState(false); // Loading xem thêm review
  const [showAllRelated, setShowAllRelated] = useState(false);

  // --- LOGIC: FETCH RELATED ---
  useEffect(() => {
    async function fetchData() {
      try {
        const related = await getRelatedProduct({ productId: product.id });
        setRelatedProducts(related);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, [product.id]);

  // --- LOGIC: UPDATE MEDIA KHI ĐỔI VARIANT ---
  useEffect(() => {
    setMediaCurrent(variantCurrent.MediaVariant);
  }, [variantCurrent]);

  // --- LOGIC: TÍNH TOÁN SPECS GROUP (Dùng useMemo để tối ưu) ---
  const specGroups = useMemo(() => {
    const temp = {};
    product.variants.forEach((variant) => {
      variant.variantSpecValues.forEach((spec) => {
        if (!temp[spec.specKey]) {
          temp[spec.specKey] = {
            specKey: spec.specKey,
            label: spec.label,
            type: spec.type,
            unit: spec.unit,
            values: [],
          };
        }
        const value =
          spec.numericValue ?? spec.stringValue ?? spec.booleanValue ?? null;
        if (value !== null && !temp[spec.specKey].values.includes(value)) {
          temp[spec.specKey].values.push(value);
        }
      });
    });
    return Object.values(temp);
  }, [product.variants]);

  // --- HANDLERS ---
  const handleChangeImage = (itemMedia) => {
    setMediaCurrent((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item) => {
          item.Media.isPrimary = item.Media.url === itemMedia.Media.url;
        });
      })
    );
  };

  const handleChangeVariant = (color, specs) => {
    const newVariant = product.variants.find((item) => {
      if (item.color !== color) return false;
      const cleanSpecs = specs.map(({ id, variantId, ...rest }) => rest);
      const cleanItemSpecs = item.variantSpecValues.map(
        ({ id, variantId, ...rest }) => rest
      );
      return JSON.stringify(cleanSpecs) === JSON.stringify(cleanItemSpecs);
    });

    if (newVariant) setVariantCurrent(newVariant);
    else {
      const fallback = product.variants.find((item) => item.color === color);
      if (fallback) setVariantCurrent(fallback);
    }
  };

  const handleMoreReviews = async () => {
    setLoadingReviews(true);
    const moreReviews = await getReviewsProducts({
      productId: product.id,
      limit: 5,
      offset: reviews.length,
    });
    setLoadingReviews(false);
    setReviews((prev) => [...prev, ...moreReviews]);
  };

  const handleAddToCart = async (isBuyNow = false) => {
    if (variantCurrent.stock <= 0) return;
    try {
      setLoadedBtn(true);
      await cartsApi.addCart(variantCurrent.id, quantity);
      globalEvents.emitCartUpdated();

      if (isBuyNow) {
        toast.success("Đang chuyển đến giỏ hàng...");
        router.push("/cart");
      } else {
        toast.success("Đã thêm vào giỏ hàng!");
      }
    } catch (err) {
      toast.error(err?.payload?.message || "Có lỗi xảy ra");
      if (err.status === 401) router.push("/signin");
    } finally {
      setLoadedBtn(false);
    }
  };

  // Safe related products
  const safeRelated = relatedProducts ?? [];
  const displayRelated = showAllRelated ? safeRelated : safeRelated.slice(0, 5);

  return (
    <div className="bg-gray-50 min-h-screen pb-10 font-sans">
      {/* 1. Breadcrumb (Điều hướng) */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex text-sm text-gray-500 items-center gap-2">
          <span
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => router.push("/")}
          >
            Trang chủ
          </span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-blue-600 cursor-pointer">Sản phẩm</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4">
        {/* 2. Main Product Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- LEFT: IMAGE GALLERY (Sticky) --- */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="sticky top-24 space-y-4">
              {/* Main Image */}
              <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden border border-gray-100 group">
                {mediaCurrent.find((item) => item.Media.isPrimary)?.Media
                  .url && (
                  <Image
                    src={
                      "/assets/products/" +
                      mediaCurrent.find((item) => item.Media.isPrimary).Media
                        .url
                    }
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                )}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-3">
                {mediaCurrent.map((item) => (
                  <button
                    key={item.Media.url}
                    onClick={() => handleChangeImage(item)}
                    className={clsx(
                      "relative aspect-square rounded-lg overflow-hidden border transition-all",
                      item.Media.isPrimary
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-gray-400"
                    )}
                  >
                    <Image
                      src={"/assets/products/" + item.Media.url}
                      alt="Thumbnail"
                      fill
                      className="object-cover p-1"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT: PRODUCT INFO --- */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            {/* Header Info */}
            <div className="border-b border-gray-100 pb-5">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              <div className="mt-3 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                  <span className="font-bold text-gray-900 text-base border-b border-yellow-400 mr-1">
                    {product.ratingAvg}
                  </span>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={
                        i < Math.floor(product.ratingAvg)
                          ? faStar
                          : i < product.ratingAvg
                          ? faStarHalf
                          : faStar
                      } // Logic icon tạm thời
                      className={
                        i < product.ratingAvg
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-gray-500">
                  {product.ratingCount} Đánh giá
                </span>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-gray-500">
                  Đã bán {product.sold || 0}
                </span>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-700">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(variantCurrent.price)}
                </span>
                {variantCurrent.compareAtPrice && (
                  <span className="text-gray-400 line-through text-sm">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(variantCurrent.compareAtPrice)}
                  </span>
                )}
              </div>
              <div
                className={clsx(
                  "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5",
                  variantCurrent.stock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                )}
              >
                <div
                  className={clsx(
                    "w-2 h-2 rounded-full",
                    variantCurrent.stock > 0 ? "bg-green-500" : "bg-red-500"
                  )}
                ></div>
                {variantCurrent.stock > 0
                  ? `Còn hàng (${variantCurrent.stock})`
                  : "Hết hàng"}
              </div>
            </div>

            {/* Variants Selector */}
            <div className="space-y-5">
              {/* Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Màu sắc:{" "}
                  <span className="text-blue-600 font-normal">
                    {variantCurrent.color}
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    ...new Set(
                      product.variants
                        .filter((v) => v.productId === product.id)
                        .map((v) => v.color)
                    ),
                  ].map((color, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleChangeVariant(
                          color,
                          variantCurrent.variantSpecValues
                        )
                      }
                      className={clsx(
                        "px-4 py-2 rounded-lg text-sm border transition-all duration-200 min-w-20",
                        color === variantCurrent.color
                          ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white cursor-pointer"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs */}
              {specGroups.map((spec) => {
                // Lấy giá trị hiện tại của spec này trong variant hiện tại
                const selectedSpec = variantCurrent.variantSpecValues.find(
                  (v) => v.specKey === spec.specKey
                );
                const currentVal =
                  selectedSpec?.numericValue ??
                  selectedSpec?.stringValue ??
                  selectedSpec?.booleanValue?.toString();

                return (
                  <div key={spec.specKey}>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      {spec.label}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {spec.values.map((val) => {
                        const isActive =
                          currentVal === val ||
                          (typeof currentVal === "boolean" &&
                            currentVal.toString() === val.toString());
                        return (
                          <button
                            key={val}
                            onClick={() => {
                              // Logic giữ nguyên từ code cũ của bạn
                              const newSpecs = variantCurrent.variantSpecValues
                                .filter(
                                  (s, idx, arr) =>
                                    idx ===
                                    arr.findIndex(
                                      (t) => t.specKey === s.specKey
                                    )
                                )
                                .map((s) => {
                                  if (s.specKey === spec.specKey) {
                                    return {
                                      ...s,
                                      numericValue:
                                        typeof val === "number" ? val : null,
                                      stringValue:
                                        typeof val === "string" ? val : null,
                                      booleanValue:
                                        typeof val === "boolean" ? val : null,
                                    };
                                  }
                                  return s;
                                });
                              handleChangeVariant(
                                variantCurrent.color,
                                newSpecs
                              );
                            }}
                            className={clsx(
                              "px-4 py-2 rounded-lg text-sm border transition-all duration-200",
                              isActive
                                ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                                : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white cursor-pointer"
                            )}
                          >
                            {val} {spec.unit}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions: Quantity & Buttons */}
            <div className="border-t border-gray-100 pt-6 space-y-6">
              <div className="flex items-center gap-6">
                <span className="text-sm font-semibold text-gray-800">
                  Số lượng:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-12 text-center font-medium text-gray-900">
                    {quantity}
                  </div>
                  <button
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={quantity >= variantCurrent.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={loadedBtn || variantCurrent.stock <= 0}
                  className="flex-1 py-3.5 px-4 rounded-xl cursor-pointer border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>
                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={loadedBtn || variantCurrent.stock <= 0}
                  className="flex-1 py-3.5 px-4 rounded-xl cursor-pointer bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadedBtn ? "Đang xử lý..." : "Mua ngay"}
                </button>
              </div>
            </div>

            {/* Policy Box (Trust Signals) */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Bảo hành chính hãng
                  </p>
                  <p className="text-gray-500 text-xs">
                    {product.warrantyMonths
                      ? `${product.warrantyMonths} tháng`
                      : "Theo chính sách"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Đổi trả miễn phí
                  </p>
                  <p className="text-gray-500 text-xs">Trong vòng 7 ngày</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Giao hàng toàn quốc
                  </p>
                  <p className="text-gray-500 text-xs">
                    Vận chuyển nhanh chóng
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Thanh toán tiện lợi
                  </p>
                  <p className="text-gray-500 text-xs">Đa dạng hình thức</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Details & Reviews Tabs */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-100">
            {["desc", "specs", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "flex-1 py-4 text-sm md:text-base font-semibold transition-all border-b-2 cursor-pointer",
                  activeTab === tab
                    ? "border-blue-600 text-blue-600 bg-blue-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                {tab === "desc" && "Mô tả sản phẩm"}
                {tab === "specs" && "Thông số kỹ thuật"}
                {tab === "reviews" && `Đánh giá (${reviews.length})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-10">
            {/* Description Tab */}
            {activeTab === "desc" && (
              <div className="relative">
                <div
                  className={clsx(
                    "prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line",
                    !isExpandingDesc && "max-h-[300px] overflow-hidden"
                  )}
                >
                  {product.description || "Đang cập nhật..."}
                </div>
                {/* Fade out effect if collapsed */}
                {!isExpandingDesc && product.description?.length > 500 && (
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
                )}
                {product.description?.length > 500 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setIsExpandingDesc(!isExpandingDesc)}
                      className="px-6 py-2 rounded-full border border-blue-600 text-blue-600 text-sm font-medium hover:bg-blue-50 transition"
                    >
                      {isExpandingDesc ? "Thu gọn" : "Xem thêm"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Specs Tab */}
            {activeTab === "specs" && (
              <div className="max-w-3xl mx-auto">
                <table className="w-full text-sm text-left">
                  <tbody>
                    {product.productSpecValues.map((item, idx) => (
                      <tr
                        key={idx}
                        className={clsx(
                          "border-b border-gray-100",
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        )}
                      >
                        <td className="py-3 px-4 font-medium text-gray-600 w-1/3">
                          {item.label}
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          {item.stringValue ??
                            item.numericValue ??
                            (item.booleanValue ? "Có" : "Không")}{" "}
                          {item.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="max-w-4xl mx-auto">
                {reviews.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="inline-block p-4 rounded-full bg-gray-100 text-gray-400 mb-3">
                      <FontAwesomeIcon icon={faStar} className="w-8 h-8" />
                    </div>
                    <p className="text-gray-500">
                      Chưa có đánh giá nào cho sản phẩm này.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map(
                      (review) =>
                        review.isActived && (
                          <div
                            key={review.id}
                            className="flex gap-4 pb-6 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex-shrink-0">
                              {review.user.avatar ? (
                                <Image
                                  src={review.user.avatar}
                                  alt="Avatar"
                                  width={48}
                                  height={48}
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                  {review.user.name?.charAt(0).toUpperCase() ||
                                    "U"}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-gray-900">
                                  {review.user.name}
                                </h4>
                                <span className="text-xs text-gray-400">
                                  {new Date(
                                    review.createdAt || Date.now()
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                              <div className="flex text-yellow-400 text-xs mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={
                                      i < review.stars ? "" : "text-gray-200"
                                    }
                                  />
                                ))}
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {review.content}
                              </p>
                            </div>
                          </div>
                        )
                    )}

                    {reviews.length > 0 && reviews.length % 5 === 0 && (
                      <div className="text-center pt-4">
                        <button
                          onClick={handleMoreReviews}
                          disabled={loadingReviews}
                          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                        >
                          {loadingReviews ? "Đang tải..." : "Xem thêm đánh giá"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. Related Products */}
        <section className="mt-12 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Sản phẩm liên quan
            </h2>
            {safeRelated.length > 5 && (
              <button
                onClick={() => setShowAllRelated(!showAllRelated)}
                className="text-blue-600 font-medium hover:underline text-sm"
              >
                {showAllRelated ? "Thu gọn" : "Xem tất cả"}
              </button>
            )}
          </div>

          {relatedProducts === null ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : safeRelated.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
              Không tìm thấy sản phẩm liên quan
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {displayRelated.map((related) => {
                // Prepare product data for Card
                const productForCard = {
                  ...related,
                  image:
                    related.variants?.[0]?.MediaVariant?.[0]?.Media?.url || "",
                  price: related.variants?.[0]?.price || 0,
                };
                return (
                  <ProductCard
                    key={related.slug || related.id}
                    product={productForCard}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DetailProduct;
