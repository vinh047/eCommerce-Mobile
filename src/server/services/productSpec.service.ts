import prisma from "@/lib/prisma";
import { ProductBucket, ProductSpec, ProductSpecOption } from '@prisma/client';

/**
 * Kiểu dữ liệu (Type) cho ProductSpec khi có include Options và Buckets.
 * KHÔNG BAO GỒM template.
 */
export type ProductSpecWithRelations = ProductSpec & {
    options: ProductSpecOption[];
    buckets: ProductBucket[];
};

/**
 * Service quản lý các thao tác liên quan đến ProductSpec.
 */
export const productSpecService = {
    
    /**
     * Lấy tất cả ProductSpec thuộc về một SpecTemplate cụ thể (Không có template trong response).
     * @param templateId ID của SpecTemplate
     * @returns Promise<ProductSpecWithRelations[]>
     */
    async getProductSpecsByTemplateId(templateId: number): Promise<ProductSpecWithRelations[]> {
        
        const productSpecs = await prisma.productSpec.findMany({
            where: {
                specTemplateId: templateId,
            },
            include: {
                options: {
                    orderBy: { sortOrder: 'asc' },
                },
                buckets: {
                    orderBy: { sortOrder: 'asc' },
                },
                // BỎ TRƯỜNG 'template': false // Không include template
            },
            orderBy: {
                displayOrder: 'asc', 
            }
        });

        return productSpecs as ProductSpecWithRelations[];
    },
};
