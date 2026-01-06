import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      id: _id, 
      productId, 
      MediaVariant,
      variantSpecValues,
      ...createData 
    } = data;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const newVariant = await prisma.variant.create({
      data: {
        ...createData,
        productId: Number(productId), 

        
        MediaVariant: {
          create: Array.isArray(MediaVariant)
            ? MediaVariant.map((mv: any) => ({
                Media: {
                  create: {
                    url: mv.Media.url,
                    isPrimary: mv.Media.isPrimary ?? false,
                    sortOrder: mv.Media.sortOrder ?? 0,
                  },
                },
              }))
            : [],
        },

        
        variantSpecValues: {
          create: Array.isArray(variantSpecValues)
            ? variantSpecValues.map((v: any) => ({
                specKey: v.specKey,
                label: v.label,
                type: v.type,
                unit: v.unit,
                stringValue: v.stringValue ?? "",
                numericValue: v.numericValue ? Number(v.numericValue) : null,
                booleanValue: v.booleanValue ?? null,
              }))
            : [],
        },
      },
    });

    return NextResponse.json(newVariant);
  } catch (error: any) {
    console.error("Create Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const sort = searchParams.get("sort") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const isActiveQuery = searchParams.get("isActive") || "";
    const stockStatus = searchParams.get("stockStatus") || "";

    let sortBy = "id";
    let sortOrder: "asc" | "desc" = "desc";

    if (sort) {
      const [column, direction] = sort.split(":");
      sortBy = column || "id";
      sortOrder = direction === "asc" ? "asc" : "desc";
    }

    const where: any = { isDeleted: false };

    if (search) {
      const searchNum = parseInt(search);
      where.OR = [
        { color: { contains: search, mode: "insensitive" } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ];
      if (!isNaN(searchNum)) {
        where.OR.push({ id: searchNum });
      }
    }

    if (isActiveQuery) {
      where.isActive = isActiveQuery === "true";
    }

    if (stockStatus === "in_stock") {
      where.stock = { gt: 0 };
    } else if (stockStatus === "out_of_stock") {
      where.stock = { lte: 0 };
    } else if (stockStatus === "low_stock") {
      where.stock = { lte: 5, gt: 0 };
    }

    const totalItems = await prisma.variant.count({ where });

    const data = await prisma.variant.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        product: { select: { name: true } },
        MediaVariant: {
          include: { Media: true },
        },
        variantSpecValues: {
          include: {
            variantSpecs: {
              include: {
                template: true,
                buckets: true,
                options: true,
                variantSpecValues: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    });
  } catch (err: any) {
    console.error("Error fetching variants:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
