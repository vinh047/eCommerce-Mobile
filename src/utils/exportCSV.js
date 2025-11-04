// src/utils/exportCSV.js
import { toast } from "sonner";

export async function exportToCSV({ data, headers, mapRow, filename }) {
  if (!data || data.length === 0) {
    toast.warning("Không có dữ liệu để xuất.");
    return;
  }

  try {
    toast.info("Đang chuẩn bị dữ liệu xuất... 📦");

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return "";
      let str = String(val);
      if (str.match(/([",\n])/)) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const csvRows = [headers.join(",")];

    data.forEach((item) => {
      const rows = mapRow(item);

      rows.forEach((row, rowIndex) => {
        const formatted = row.map((cell) => {
          return escapeCSV(cell);
        });
        csvRows.push(formatted.join(","));
      });
    });

    const csvContent = csvRows.join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Xuất CSV thành công ✅");
  } catch (error) {
    console.error("Export CSV failed:", error);
    toast.error("Xuất CSV thất bại ❌");
  }
}
