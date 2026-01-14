"use client";
import React from 'react';
import CheckboxList from './CheckboxList';
import { toggleInArray } from './utils/helpers';

/**
 * Component này chịu trách nhiệm hiển thị một trường filter duy nhất.
 * Nó sẽ quyết định render control nào (checkbox, select) dựa trên định nghĩa (def).
 */
export default function FilterField({
    fieldKey,
    def,
    state,
    setState,
    optionsByField,
    withDivider,
}) {
    // Lấy giá trị hiện tại của field từ state chung
    const cur = state[fieldKey];

    // Xác định loại control dựa trên định nghĩa (def)
    const isBucket = def.control === "bucket-select";
    const isMulti = def.control === "multiselect" || (def.control === "select" && def.multi) || def.type === 'brand';
    const isBooleanTri = def.datatype === "boolean" && def.control === "select";
    const isSingleSelect = def.control === "select" && !isMulti && !isBooleanTri;

    // Hàm xử lý khi một checkbox được check/uncheck
    const handleToggle = (value) => {
        setState((s) => ({
            ...s,
            [fieldKey]: toggleInArray(s[fieldKey] || [], value),
        }));
    };
    
    // Hàm xử lý khi giá trị của select box thay đổi
    const handleSelectChange = (e) => {
        setState((s) => ({
            ...s,
            // Đối với boolean, giá trị rỗng "" sẽ được chuyển thành null
            [fieldKey]: isBooleanTri ? e.target.value || null : e.target.value,
        }));
    };


    // =========================================================================
    // === RENDER LOGIC ===
    // =========================================================================

    // 1. Dạng Bucket Select (Thường dùng cho khoảng giá, kích thước...)
    if (isBucket) {
        const bucketItems = (def?.facet?.buckets || []).map((b) => ({
            value: String(b.id),
            label: b.label,
        }));

        return (
            <section className={withDivider ? "pb-3 mb-3 border-b border-gray-100" : "mb-3"}>
                <h3 className="text-[13px] font-semibold mb-2">{def.label}</h3>
                <CheckboxList items={bucketItems} checked={cur || []} onToggle={handleToggle} />
            </section>
        );
    }

    // 2. Dạng Multiselect (Chọn nhiều, thường là checkbox)
    if (isMulti) {
        // Ưu tiên options được tải động, nếu không có thì dùng options tĩnh từ template
        const options = optionsByField[fieldKey] || def.options || [];

        return (
            <section className={withDivider ? "pb-3 mb-3 border-b border-gray-100" : "mb-3"}>
                <h3 className="text-[13px] font-semibold mb-2">{def.label}</h3>
                <CheckboxList items={options} checked={cur || []} onToggle={handleToggle} />
            </section>
        );
    }

    // 3. Dạng Single Select (Chọn một, dạng dropdown) & Boolean
    if (isSingleSelect || isBooleanTri) {
        const options = optionsByField[fieldKey] || def.options || [];
        let selectOptions = [];

        if (isBooleanTri) {
            // 3 trạng thái: Tất cả (null), Có (true), Không (false)
            selectOptions = [{ value: "", label: "Tất cả" }, ...options];
        } else {
            // Lựa chọn mặc định
            selectOptions = [{ value: "", label: "Tất cả" }, ...options];
        }

        return (
            <section className={withDivider ? "pb-3 mb-3 border-b border-gray-100" : "mb-3"}>
                <h3 className="text-[13px] font-semibold mb-2">{def.label}</h3>
                <select
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={cur ?? ""}
                    onChange={handleSelectChange}
                >
                    {selectOptions.map((o) => (
                        <option key={String(o.value)} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </section>
        );
    }

    // Nếu không khớp với loại control nào thì không render gì cả
    return null;
}