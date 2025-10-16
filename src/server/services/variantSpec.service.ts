import prisma from "@/lib/prisma";
import { VariantBucket, VariantSpec, VariantSpecOption } from '@prisma/client';

/**
 * Kiểu dữ liệu (Type) cho VariantSpec khi có include Options và Buckets.
 * KHÔNG BAO GỒM template.
 */
export type VariantSpecWithRelations = VariantSpec & {
    options: VariantSpecOption[];
    buckets: VariantBucket[];
};

/**
 * Service quản lý các thao tác liên quan đến VariantSpec.
 */
export const variantSpecService = {
    
    /**
     * Lấy tất cả VariantSpec, bao gồm các options và buckets liên quan.
     * @returns Promise<VariantSpecWithRelations[]>
     */
    async getAllVariantSpecs(): Promise<VariantSpecWithRelations[]> {
        
        const variantSpecs = await prisma.variantSpec.findMany({
            include: {
                options: {
                    orderBy: { sortOrder: 'asc' },
                },
                buckets: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
            orderBy: {
                id: 'asc', 
            }
        });

        return variantSpecs as VariantSpecWithRelations[];
    },

    
};