// Import các thư viện cần thiết cho Next.js App Router API Routes
import { NextRequest, NextResponse } from "next/server";
import { specTemplateService } from "../services/specTemplate.service";

/**
 * Controller xử lý logic nghiệp vụ và trả về HTTP Response.
 * Được thiết kế để gọi trong file route.ts (Route Handler).
 */
export const specTemplateController = {
  /**
   * [GET] /api/filters/category/[categoryId]
   * Lấy SpecTemplate và toàn bộ cấu trúc bộ lọc (ProductSpec, VariantSpec) cho một Category.
   * @param req Đối tượng NextRequest
   * @param params Tham số động từ route (e.g., { categoryId: '123' })
   * @returns NextResponse (JSON response)
   */
  async getFiltersByCategoryId(
    req: NextRequest,
    { params }: { params: { categoryId: string } }
  ) {
    try {
      // 1. Lấy và kiểm tra tham số categoryId
      const { categoryId: categoryIdStr } = await params;
      if (!categoryIdStr) {
        return NextResponse.json(
          { message: "Thiếu tham số Category ID." },
          { status: 400 } // Bad Request
        );
      }

      const categoryId = parseInt(categoryIdStr);
      if (isNaN(categoryId)) {
        return NextResponse.json(
          { message: "Category ID không hợp lệ." },
          { status: 400 } // Bad Request
        );
      }

      // 2. Gọi Service để lấy dữ liệu
      const filters = await specTemplateService.getFiltersByCategoryId(
        categoryId
      );

      // 3. Kiểm tra kết quả và trả về
      if (!filters) {
        // Không tìm thấy SpecTemplate cho Category này
        return NextResponse.json(
          {
            message: `Không tìm thấy bộ lọc (Spec Template) cho Category ID ${categoryId}.`,
          },
          { status: 404 } // Not Found
        );
      }

      // Trả về dữ liệu thành công
      return NextResponse.json(filters, { status: 200 });
    } catch (error) {
      console.error("Lỗi khi lấy bộ lọc:", error);
      // Trả về lỗi Server Internal
      return NextResponse.json(
        { message: "Lỗi nội bộ máy chủ khi lấy bộ lọc." },
        { status: 500 }
      );
    }
  },
};
