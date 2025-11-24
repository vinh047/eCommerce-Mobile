"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { produce } from "immer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { json } from "zod";
import { getRelatedProduct, getReviewsProducts } from "@/lib/api/productApi";
import ProductCard from "@/components/ui/product/ProductCard";
import ProductCardSkeleton from "@/components/ui/product/ProductCardSkeleton";

const DetailProduct = ({ product}) => {
  const [variantCurrent, setVariantCurrent] = useState(product.variants[0]); // lưu variant mặc định sẽ hiển thị đầu tiên
  const [mediaCurrent, setMediaCurrent] = useState(variantCurrent.MediaVariant); // lưu ảnh của variant hiện tại đang hiển thị
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState(product.Review || []);
  const [loaded, setLoaded] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState(null);

  useEffect(()=>{
    async function fetchData(){
      const related=await getRelatedProduct({productId:product.id});
      console.log(related)
      setRelatedProducts(related);
    }
    fetchData()
  },[])

  useEffect(() => {
    setMediaCurrent(variantCurrent.MediaVariant);
  }, [variantCurrent]);
  const spec_group = [];
  const temp = {};

  product.variants.forEach((variant) => {
    variant.variantSpecValues.forEach((spec) => {
      if (!temp[spec.specKey]) {
        temp[spec.specKey] = {
          specKey: spec.specKey,
          label: spec.label,
          type: spec.type,
          unit: spec.unit,
          values: [], // gom tất cả loại giá trị vào đây
        };
      }

      // Lấy giá trị có thật (không null)
      const value =
        spec.numericValue ?? spec.stringValue ?? spec.booleanValue ?? null;

      // Nếu có giá trị và chưa có trong mảng thì thêm vào
      if (value !== null && !temp[spec.specKey].values.includes(value)) {
        temp[spec.specKey].values.push(value);
      }
    });
  });

  // Chuyển từ object sang mảng
  for (let key in temp) {
    spec_group.push(temp[key]);
  }

  console.log(spec_group);

  const handleChangeImage = (itemMedia) => {
    setMediaCurrent((prev) => {
      return produce(prev, (draft) => {
        draft.forEach((item) => {
          item.Media.isPrimary = item.Media.url === itemMedia.Media.url;
        });
      });
    });
  };
  const handleChangeVariant = (color, specs) => {
    const newVariant = product.variants.find((item) => {
      if (item.color !== color) return false;

      // Chuẩn hóa specs: bỏ id & variantId
      const cleanSpecs = specs.map(
        ({
          specKey,
          label,
          type,
          unit,
          numericValue,
          stringValue,
          booleanValue,
        }) => ({
          specKey,
          label,
          type,
          unit,
          numericValue,
          stringValue,
          booleanValue,
        })
      );

      const cleanItemSpecs = item.variantSpecValues.map(
        ({
          specKey,
          label,
          type,
          unit,
          numericValue,
          stringValue,
          booleanValue,
        }) => ({
          specKey,
          label,
          type,
          unit,
          numericValue,
          stringValue,
          booleanValue,
        })
      );

      // So sánh stringify sau khi bỏ id và variantId
      console.log(JSON.stringify(cleanSpecs));
      console.log(JSON.stringify(cleanItemSpecs));
      return JSON.stringify(cleanSpecs) === JSON.stringify(cleanItemSpecs);
    });

    if (newVariant) setVariantCurrent(newVariant);
    else {
      const fallback = product.variants.find((item) => item.color === color);
      if (fallback) setVariantCurrent(fallback);
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const elements = [
    "Thông số kỹ thuật",
    "Mô tả chi tiết",
    "Đánh giá từ khách hàng",
  ];

  const handleMoreReviews = async () => {
    setLoaded(true);
    const moreReviews = await getReviewsProducts({
      productId: product.id,
      limit: 5,
      offset: reviews.length,
    });
    setLoaded(false);
    setReviews((prev) => [...prev, ...moreReviews]);
  };

  return (
    <main className="max-w-7xl mx-auto py-6">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-6">
          <div className=" border border-gray-200 shadow-soft p-4 rounded-xl">
            <div className="relative w-3/5 mx-auto h-64 md:h-96">
              {mediaCurrent.find((item) => item.Media.isPrimary)?.Media.url && (
                <Image
                  src={
                    "/assets/products/" +
                    mediaCurrent.find((item) => item.Media.isPrimary).Media.url
                  }
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div
              className={`grid gap-3 mt-4 ${
                mediaCurrent.length === 1
                  ? "grid-cols-1"
                  : mediaCurrent.length === 2
                  ? "grid-cols-2"
                  : mediaCurrent.length === 3
                  ? "grid-cols-3"
                  : mediaCurrent.length === 4
                  ? "grid-cols-4"
                  : mediaCurrent.length === 5
                  ? "grid-cols-5"
                  : "grid-cols-6"
              }`}
            >
              {mediaCurrent.map((item) => (
                <button
                  onClick={() => {
                    handleChangeImage(item);
                  }}
                  className={clsx(
                    "relative h-32 border border-gray-200 rounded-lg",
                    item.Media.isPrimary && "outline-4 outline-blue-300"
                  )}
                  key={item.Media.url}
                >
                  <Image
                    src={"/assets/products/" + item.Media.url}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className=" col-span-6">
          <div className=" border bg-white border-gray-200 shadow-soft p-5 rounded-xl">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex">
                {[...Array(Math.floor(product.ratingAvg))].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className="fa fa-star text-yellow-400"
                    style={{ width: "18px", height: "18px" }}
                  />
                ))}
                {product.rating_avg > Math.floor(product.ratingAvg) && (
                  <FontAwesomeIcon
                    icon={faStarHalf}
                    className="fa fa-star-half text-yellow-400"
                    style={{ width: "18px", height: "18px" }}
                  />
                )}
              </div>
              <div className="text-sm text-gray-600 ">
                {product.ratingAvg}/5 • {product.ratingCount} đánh giá
              </div>
            </div>
            <div className="mt-4 flex items-end gap-3">
              <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                {" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(variantCurrent.price)}
              </div>
              <div className="ml-auto">
                <div
                  className={clsx(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border",
                    variantCurrent.stock > 0
                      ? "bg-green-50 text-green-700 border-green-200"
                      : " bg-red-50 text-red-700 border-red-200"
                  )}
                >
                  <span
                    className={clsx(
                      "w-2 h-2 rounded-full",
                      variantCurrent.stock > 0 ? "bg-green-500" : "bg-red-500"
                    )}
                  ></span>
                  {variantCurrent.stock > 0 ? "Còn hàng" : "Hết hàng"}
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-5">
              {/* Color  */}
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-800">Màu sắc</label>
                <span className="text-sm text-gray-500">
                  {" "}
                  {variantCurrent.color}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  ...new Set(
                    product.variants
                      .filter((item) => item.productId === product.id)
                      .map((item) => item.color)
                  ),
                ].map((color, i) => (
                  <button
                    onClick={() =>
                      handleChangeVariant(
                        color,
                        variantCurrent.variantSpecValues
                      )
                    }
                    key={i}
                    className={clsx(
                      "px-3 py-2 rounded-xl border ",
                      color === variantCurrent.color
                        ? "border-blue-300 bg-blue-50 text-sm "
                        : "border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-2 "
                    )}
                  >
                    <span className="text-sm">{color}</span>
                  </button>
                ))}
              </div>
              {/* Specs Variant  */}
              {spec_group.map((specItem) => {
                const selectedValue = variantCurrent.variantSpecValues.find(
                  (v) => v.specKey === specItem.specKey
                );

                // lấy giá trị hiện tại (ưu tiên numeric > string > boolean)
                const currentValue =
                  selectedValue?.numericValue ??
                  selectedValue?.stringValue ??
                  selectedValue?.booleanValue?.toString() ??
                  "";

                return (
                  <div key={specItem.specKey} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-medium text-gray-800">
                        {specItem.label}
                      </label>
                      <span
                        id="capacitySelectedLabel"
                        className="text-sm text-gray-500"
                      >
                        {currentValue + " " + (specItem.unit || "")}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {specItem.values.map((value) => {
                        const isSelected =
                          selectedValue?.numericValue === value ||
                          selectedValue?.stringValue === value ||
                          selectedValue?.booleanValue?.toString() ===
                            value.toString();

                        return (
                          <button
                            key={`${specItem.specKey}-${value}`}
                            onClick={() => {
                              // clone sâu variantSpecValues
                              const newSpecs = variantCurrent.variantSpecValues
                                .filter(
                                  (spec, index, arr) =>
                                    index ===
                                    arr.findIndex(
                                      (s) => s.specKey === spec.specKey
                                    ) // loại trùng specKey
                                )
                                .map((spec) => {
                                  if (spec.specKey === specItem.specKey) {
                                    switch (spec.type) {
                                      case "number":
                                        return {
                                          ...spec,
                                          numericValue: value,
                                          stringValue: null,
                                          booleanValue: null,
                                        };
                                      case "string":
                                        return {
                                          ...spec,
                                          stringValue: value,
                                          numericValue: null,
                                          booleanValue: null,
                                        };
                                      case "boolean":
                                        return {
                                          ...spec,
                                          booleanValue:
                                            value === true || value === "true",
                                          numericValue: null,
                                          stringValue: null,
                                        };
                                      default:
                                        return spec;
                                    }
                                  }
                                  return spec;
                                });

                              handleChangeVariant(
                                variantCurrent.color,
                                newSpecs
                              );
                            }}
                            className={clsx(
                              "px-3 py-2 rounded-xl border text-sm transition-colors duration-150",
                              isSelected
                                ? "border-blue-400 bg-blue-50 text-blue-700"
                                : "border-gray-200 bg-white hover:bg-gray-50"
                            )}
                          >
                            {`${value} ${specItem.unit || ""}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Quantity  */}
              <div className="flex items-center gap-4">
                <label className="font-medium text-gray-800">Số lượng</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    className="w-10 h-10 grid place-items-center text-gray-600 hover:bg-gray-50"
                    onClick={() => setQuantity((s) => Math.max(s - 1, 1))}
                  >
                    -
                  </button>

                  <div className="w-12 text-center font-medium">{quantity}</div>
                  <button
                    className="w-10 h-10 grid place-items-center text-gray-600 hover:bg-gray-50"
                    onClick={() => setQuantity((s) => s + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Button Payment  */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                <button
                  className="w-full px-4 py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition cursor-pointer disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                  disabled={variantCurrent.stock <= 0}
                >
                  Mua ngay
                </button>
                <button
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold text-gray-800 transition cursor-pointer  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={variantCurrent.stock <= 0}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
              {/* Info  */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="inline-flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 grid place-items-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"></path>
                    </svg>
                  </span>
                  Bảo hành chính hãng 12T
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 grid place-items-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 12h18M3 12l5 5M3 12l5-5"></path>
                    </svg>
                  </span>
                  Đổi trả 7 ngày
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 grid place-items-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 6h18v12H3z M7 10h4v4H7z"></path>
                    </svg>
                  </span>
                  Giao nhanh, miễn phí
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="rounded-xl bg-white border border-gray-200 shadow-soft">
          <div className="px-5 md:px-6 pt-4 border-b border-gray-100">
            <nav className="flex gap-2 md:gap-4">
              {elements.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium hover:bg-gray-50 ${
                    activeIndex === index ? "text-blue-700" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Desc  */}
          <div className="p-5 md:p-6">
            {(() => {
              switch (activeIndex) {
                case 1:
                  return (
                    <div
                      className="tab-panel"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {product.description}
                    </div>
                  );
                case 0:
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-700">
                      {product.productSpecValues.map((item) => (
                        <div
                          key={item.specKey}
                          className="flex justify-between border-b border-gray-100 pb-2"
                        >
                          <div className="text-gray-500">{item.label}</div>
                          <div>
                            {item.stringValue ??
                              item.numericValue ??
                              (item.booleanValue !== undefined
                                ? item.booleanValue
                                  ? "Có"
                                  : "Không"
                                : "")}
                            {item.unit ?? ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                case 2:
                  return (
                    <>
                      <div className="max-w-3xl">
                        {reviews.length === 0 ? (
                          <div className="text-center text-gray-500">
                            Chưa có đánh giá nào.
                          </div>
                        ) : (
                          reviews.map(
                            (review) =>
                              review.isActived && (
                                <div
                                  key={review.id}
                                  className="border-b border-gray-100 pb-4 mb-4"
                                >
                                  <div className="flex items-center mb-2">
                                    <div className="h-6 w-6 border-transparent rounded-full border-2 mr-1.5">
                                      <Image
                                        src={review.user.avatar}
                                        alt={review.user.name}
                                        width={24}
                                        height={24}
                                        className="rounded-full object-cover"
                                      />
                                    </div>
                                    <div className="font-medium text-gray-800 mr-4">
                                      {review.user.name}
                                    </div>
                                    <div className="flex">
                                      {[...Array(review.stars)].map((_, i) => (
                                        <FontAwesomeIcon
                                          key={i}
                                          icon={faStar}
                                          className="fa fa-star text-yellow-400"
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-gray-700">
                                    {review.content}
                                  </div>
                                </div>
                              )
                          )
                        )}
                      </div>
                      {loaded && (
                        <div className="mt-2 text-sm text-gray-600 animate-pulse">
                          Đang tải thêm đánh giá...
                        </div>
                      )}
                      {reviews.length % 5 === 0 && (
                        <button
                          className="mt-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-50 text-sm"
                          onClick={handleMoreReviews}
                        >
                          Xem thêm đánh giá
                        </button>
                      )}
                    </>
                  );
                default:
                  return null;
              }
            })()}
          </div>
        </div>
        {/* Sản phẩm liên quan  */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Sản phẩm liên quan</h2>
          </div>

          {relatedProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((related) => {
                const productRelated={...related,image: related.variants[0].MediaVariant[0].Media.url,price:related.variants[0].price};
                return <ProductCard key={related.slug} product={productRelated} />
})}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />

            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default DetailProduct;
