export async function getCategories() {
  try {
    const res = await fetch("http://localhost:3000/api/categories", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      cache: "no-store", // hoặc "no-store" nếu muốn luôn lấy dữ liệu mới
    });

    if (!res.ok) {
      throw new Error(`Fetch categories failed (${res.status})`);
    }

    const json = await res.json();
    return json.data; // BE trả { data: [...] } thì lấy phần này
  } catch (err) {
    console.error("Error fetching categories:", err);
    return []; // tránh crash UI nếu lỗi
  }
}

export async function getCategoryBySlug(slug) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/categories/slug/${slug}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) {
      throw new Error(`Fetch category by slug failed (${res.status})`);
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return []; // tránh crash UI nếu lỗi}
  }
}
