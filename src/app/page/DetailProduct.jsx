"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { produce } from "immer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";

const DetailProduct = ({ product, variant, media }) => {
  // product : thông tin sản phẩm
  // variant : Tất cả biến thể của sản phẩm
  // media: Tất cả ảnh của sản phẩm
  const [variantCurrent, setVariantCurrent] = useState(variant[0]); // lưu variant mặc định sẽ hiển thị đầu tiên
  const [mediaCurrent, setMediaCurrent] = useState(
    media.filter((item) => item.variant_id === variant[0].id)
  ); // lưu ảnh của variant hiện tại đang hiển thị
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setMediaCurrent(
      media.filter(
        (item) =>
          item.variant_id ===
          variant.find((v) => v.color === variantCurrent.color).id
      )
    );
  }, [variantCurrent, media]);
  const specsGroup = {}; // Gom gia tri theo key trong variant.specs_json
  variant.forEach((v) => {
    for (let key in v.specs_json) {
      if (!specsGroup[key]) specsGroup[key] = new Set();
      specsGroup[key].add(v.specs_json[key]);
    }
  });
  const handleChangeImage = (url) => {
    setMediaCurrent((prev) => {
      return produce(prev, (draft) => {
        draft.forEach((item) => {
          item.is_primary = item.url === url.url;
        });
      });
    });
  };
  const handleChangeVariant = (color, specs) => {
    const KeysGroup = Object.keys(specs);
    const newVariant = variant.find((item) => {
      if (item.color !== color) return false;
      for (let key of KeysGroup) {
        if (item.specs_json[key] !== specs[key]) return false;
      }
      return true;
    });
    if (newVariant) setVariantCurrent(newVariant);
    else {
      setVariantCurrent(variant.find((item) => item.color === color));
    }
  };
  const [activeIndex, setActiveIndex] = useState(0);
  const elements = [
    "Mô tả chi tiết",
    "Thông số kỹ thuật",
    "Đánh giá từ khách hàng",
  ];
  return (
    <main className="max-w-7xl mx-auto py-6">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-6">
          <div className=" border border-gray-200 shadow-soft p-4 rounded-xl">
            <div className="relative w-3/5 mx-auto h-64 md:h-96">
              {mediaCurrent.find((item) => item.is_primary)?.url && (
                <Image
                  src={mediaCurrent.find((item) => item.is_primary).url}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div
              className={
                "grid grid-cols-" + mediaCurrent.length + " gap-3 mt-4"
              }
            >
              {mediaCurrent.map((item) => (
                <button
                  onClick={() => {
                    handleChangeImage(item);
                  }}
                  className={clsx(
                    "relative h-32 border border-gray-200 rounded-lg",
                    item.is_primary && "outline-4 outline-blue-300"
                  )}
                  key={item.url}
                >
                  <Image
                    src={item.url}
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
                {[...Array(Math.floor(product.rating_avg))].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className="fa fa-star text-yellow-400"
                    style={{ width: "18px", height: "18px" }}
                  />
                ))}
                {product.rating_avg > Math.floor(product.rating_avg) && (
                  <FontAwesomeIcon
                    icon={faStarHalf}
                    className="fa fa-star-half text-yellow-400"
                    style={{ width: "18px", height: "18px" }}
                  />
                )}
              </div>
              <div className="text-sm text-gray-600 ">
                {product.rating_avg}/5 • {product.rating_count} đánh giá
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
                    variant
                      .filter((item) => item.product_id === product.id)
                      .map((item) => item.color)
                  ),
                ].map((color, i) => (
                  <button
                    onClick={() =>
                      handleChangeVariant(color, variantCurrent.specs_json)
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
              {Object.entries(specsGroup).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium text-gray-800">{key}</label>
                    <span
                      id="capacitySelectedLabel"
                      className="text-sm text-gray-500"
                    >
                      {variantCurrent.specs_json[key]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[...value].map((item) => {
                      return variant.map((v) =>
                        v.color === variantCurrent.color &&
                        v.specs_json[key] === item ? (
                          <button
                            key={item}
                            onClick={() => {
                              const specs = { ...variantCurrent.specs_json };
                              specs[key] = item;
                              handleChangeVariant(variantCurrent.color, specs);
                            }}
                            className={clsx(
                              "px-3 py-2 rounded-xl border text-sm ",
                              variantCurrent.specs_json[key] === item
                                ? "border-blue-300 bg-blue-50"
                                : "border-gray-200 bg-white hover:bg-gray-50"
                            )}
                          >
                            {" "}
                            {item}
                          </button>
                        ) : (
                          ""
                        )
                      );
                    })}
                  </div>
                </div>
              ))}
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
                case 0:
                  return (
                    <div
                      className="tab-panel"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {product.description}
                    </div>
                  );
                case 1:
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-700">
                      {Object.entries(product.specs_json).map(
                        ([key, value]) => (
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <div className="text-gray-500">{key}</div>
                            <div>{value}</div>
                          </div>
                        )
                      )}
                    </div>
                  );
              }
            })()}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetailProduct;
