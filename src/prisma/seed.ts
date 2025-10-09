// prisma/seed.ts
import {
  PrismaClient,
  ControlType,
  DataType,
  FacetType,
  Prisma,
} from '@prisma/client'

const prisma = new PrismaClient()

// ----------------- Helpers -----------------
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const pick = <T>(arr: T[]) => arr[randInt(0, arr.length - 1)]

// ----------------- Seed master data -----------------
const BRAND_NAMES = ['Apple', 'Samsung', 'Xiaomi', 'Dell', 'ASUS', 'Lenovo', 'HP', 'Acer']

type CatKey = 'phone' | 'laptop' | 'accessory'
const CATEGORIES: Record<CatKey, { name: string; iconKey: string; hint: string }> = {
  phone: { name: 'Điện thoại', iconKey: 'smartphone', hint: 'Điện thoại thông minh' },
  laptop: { name: 'Laptop', iconKey: 'laptop', hint: 'Máy tính xách tay' },
  accessory: { name: 'Phụ kiện', iconKey: 'headphones', hint: 'Phụ kiện công nghệ' },
}

// Facet/Spec blueprint cho từng category
const BLUEPRINTS: Record<
  CatKey,
  {
    facets: {
      code: string
      type: FacetType
      buckets: { label: string; gt?: number | null; lte?: number | null }[]
    }[]
    productSpecs: {
      name: string
      label: string
      filterable?: boolean
      multi?: boolean
      control: ControlType
      datatype: DataType
      facetCode?: string
    }[]
    variantSpecs: {
      name: string
      label: string
      filterable?: boolean
      multi?: boolean
      control: ControlType
      datatype: DataType
      facetCode?: string
    }[]
  }
> = {
  phone: {
    facets: [
      {
        code: 'price',
        type: FacetType.range,
        buckets: [
          { label: 'Dưới 5tr', gt: 0, lte: 5_000_000 },
          { label: '5–10tr', gt: 5_000_000, lte: 10_000_000 },
          { label: '10–20tr', gt: 10_000_000, lte: 20_000_000 },
          { label: 'Trên 20tr', gt: 20_000_000, lte: null },
        ],
      },
      {
        code: 'screen',
        type: FacetType.range,
        buckets: [
          { label: '<= 6.0"', gt: 0, lte: 6.0 },
          { label: '6.1–6.5"', gt: 6.1, lte: 6.5 },
          { label: '>= 6.6"', gt: 6.6, lte: null },
        ],
      },
      {
        code: 'ram',
        type: FacetType.range,
        buckets: [
          { label: '4 GB', gt: 3.5, lte: 4.5 },
          { label: '6 GB', gt: 5.5, lte: 6.5 },
          { label: '8 GB', gt: 7.5, lte: 8.5 },
          { label: '12 GB+', gt: 11.5, lte: null },
        ],
      },
      {
        code: 'color',
        type: FacetType.discrete,
        buckets: [{ label: 'Đen' }, { label: 'Trắng' }, { label: 'Xanh' }, { label: 'Đỏ' }, { label: 'Bạc' }],
      },
    ],
    productSpecs: [
      { name: 'screen_size', label: 'Kích thước màn hình (inch)', filterable: true, control: ControlType.bucket_select, datatype: DataType.number, facetCode: 'screen' },
      { name: 'battery', label: 'Dung lượng pin (mAh)', control: ControlType.select, datatype: DataType.number },
      { name: 'ram', label: 'RAM (GB)', filterable: true, control: ControlType.select, datatype: DataType.number, facetCode: 'ram' },
      { name: 'storage', label: 'Bộ nhớ trong (GB)', filterable: true, control: ControlType.select, datatype: DataType.number },
      { name: 'os', label: 'Hệ điều hành', filterable: true, control: ControlType.select, datatype: DataType.string },
    ],
    variantSpecs: [
      { name: 'color', label: 'Màu sắc', filterable: true, control: ControlType.select, datatype: DataType.string, facetCode: 'color' }, // không seed value cho color
      { name: 'sim', label: 'Số khe SIM', control: ControlType.select, datatype: DataType.number },
    ],
  },
  laptop: {
    facets: [
      {
        code: 'price',
        type: FacetType.range,
        buckets: [
          { label: 'Dưới 15tr', gt: 0, lte: 15_000_000 },
          { label: '15–25tr', gt: 15_000_000, lte: 25_000_000 },
          { label: '25–35tr', gt: 25_000_000, lte: 35_000_000 },
          { label: 'Trên 35tr', gt: 35_000_000, lte: null },
        ],
      },
      {
        code: 'screen',
        type: FacetType.range,
        buckets: [
          { label: '13–13.9"', gt: 13.0, lte: 13.9 },
          { label: '14–14.9"', gt: 14.0, lte: 14.9 },
          { label: '15–16"', gt: 15.0, lte: 16.0 },
        ],
      },
      {
        code: 'ram',
        type: FacetType.range,
        buckets: [
          { label: '8 GB', gt: 7.5, lte: 8.5 },
          { label: '16 GB', gt: 15.5, lte: 16.5 },
          { label: '32 GB+', gt: 31.5, lte: null },
        ],
      },
      { code: 'color', type: FacetType.discrete, buckets: [{ label: 'Đen' }, { label: 'Bạc' }, { label: 'Xám' }] },
    ],
    productSpecs: [
      { name: 'cpu', label: 'CPU', filterable: true, control: ControlType.select, datatype: DataType.string },
      { name: 'ram', label: 'RAM (GB)', filterable: true, control: ControlType.select, datatype: DataType.number, facetCode: 'ram' },
      { name: 'storage', label: 'SSD (GB)', filterable: true, control: ControlType.select, datatype: DataType.number },
      { name: 'screen_size', label: 'Kích thước màn (inch)', filterable: true, control: ControlType.bucket_select, datatype: DataType.number, facetCode: 'screen' },
      { name: 'weight', label: 'Khối lượng (kg)', control: ControlType.select, datatype: DataType.number },
      { name: 'gpu', label: 'GPU', filterable: true, control: ControlType.select, datatype: DataType.string },
    ],
    variantSpecs: [
      { name: 'color', label: 'Màu sắc', filterable: true, control: ControlType.select, datatype: DataType.string, facetCode: 'color' },
      { name: 'keyboard', label: 'Bàn phím', control: ControlType.select, datatype: DataType.string },
    ],
  },
  accessory: {
    facets: [
      {
        code: 'price',
        type: FacetType.range,
        buckets: [
          { label: 'Dưới 500k', gt: 0, lte: 500_000 },
          { label: '500k–1tr', gt: 500_000, lte: 1_000_000 },
          { label: '1–2tr', gt: 1_000_000, lte: 2_000_000 },
          { label: 'Trên 2tr', gt: 2_000_000, lte: null },
        ],
      },
      { code: 'color', type: FacetType.discrete, buckets: [{ label: 'Đen' }, { label: 'Trắng' }, { label: 'Xanh' }, { label: 'Đỏ' }] },
    ],
    productSpecs: [
      { name: 'type', label: 'Loại phụ kiện', filterable: true, control: ControlType.select, datatype: DataType.string },
      { name: 'compatibility', label: 'Tương thích', filterable: true, control: ControlType.select, datatype: DataType.string },
      { name: 'brand_origin', label: 'Hãng / Xuất xứ', control: ControlType.select, datatype: DataType.string },
    ],
    variantSpecs: [
      { name: 'color', label: 'Màu sắc', filterable: true, control: ControlType.select, datatype: DataType.string, facetCode: 'color' },
      { name: 'length', label: 'Chiều dài (cm)', control: ControlType.select, datatype: DataType.number },
    ],
  },
}

const COLOR_POOL = ['Đen', 'Trắng', 'Xanh', 'Đỏ', 'Bạc', 'Xám']
const PHONE_OS = ['iOS', 'Android']
const CPU_POOL = ['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'Apple M2']
const GPU_POOL = ['iGPU', 'RTX 3050', 'RTX 4050', 'RX 6600M']
const ACCESSORY_TYPES = ['Tai nghe', 'Sạc nhanh', 'Cáp USB-C', 'Ốp lưng', 'Bàn phím', 'Chuột']

// tiện bọc deleteMany để không fail khi bảng chưa tồn tại (P2021)
async function safeDeleteMany<T>(op: () => Promise<T>) {
  try {
    return await op()
  } catch (e: any) {
    if (e?.code === 'P2021') {
      console.warn('⚠️ Skip deleteMany (table not found)')
      return
    }
    throw e
  }
}

async function main() {
  console.log('⏳ Reset minimal related data (in-order)…')
  await safeDeleteMany(() => prisma.media.deleteMany())
  await safeDeleteMany(() => prisma.variantSpecValue.deleteMany())
  await safeDeleteMany(() => prisma.productSpecValue.deleteMany())
  await safeDeleteMany(() => prisma.variant.deleteMany())
  await safeDeleteMany(() => prisma.product.deleteMany())
  await safeDeleteMany(() => prisma.bucket.deleteMany())
  await safeDeleteMany(() => prisma.facet.deleteMany())
  await safeDeleteMany(() => prisma.productSpec.deleteMany())
  await safeDeleteMany(() => prisma.variantSpec.deleteMany())
  await safeDeleteMany(() => prisma.specTemplate.deleteMany())
  await safeDeleteMany(() => prisma.category.deleteMany())
  await safeDeleteMany(() => prisma.brand.deleteMany())

  // -------- Brands --------
  console.log('▶ Seeding brands')
  const brands = await Promise.all(
    BRAND_NAMES.map((name) =>
      prisma.brand.create({
        data: { name, slug: slugify(name), isActive: true },
      }),
    ),
  )

  // -------- Categories --------
  console.log('▶ Seeding categories')
  const catMap: Record<CatKey, { id: number; name: string }> = {
    phone: await prisma.category.create({
      data: { name: CATEGORIES.phone.name, slug: slugify(CATEGORIES.phone.name), iconKey: CATEGORIES.phone.iconKey },
      select: { id: true, name: true },
    }),
    laptop: await prisma.category.create({
      data: { name: CATEGORIES.laptop.name, slug: slugify(CATEGORIES.laptop.name), iconKey: CATEGORIES.laptop.iconKey },
      select: { id: true, name: true },
    }),
    accessory: await prisma.category.create({
      data: { name: CATEGORIES.accessory.name, slug: slugify(CATEGORIES.accessory.name), iconKey: CATEGORIES.accessory.iconKey },
      select: { id: true, name: true },
    }),
  }

  // -------- Templates + Facets/Buckets + Specs per category --------
  console.log('▶ Seeding templates, facets, specs')
  const registry: Record<
    CatKey,
    { facetIdByCode: Record<string, number>; templateId: number }
  > = {} as any

  for (const key of Object.keys(BLUEPRINTS) as CatKey[]) {
    const bp = BLUEPRINTS[key]
    const cat = catMap[key]

    // 1) Tạo SpecTemplate trước
    const template = await prisma.specTemplate.create({
      data: { categoryId: cat.id, name: `Template ${cat.name} v1`, version: 1, isActive: true },
      select: { id: true },
    })

    // 2) Tạo Facets & Buckets
    const facetIdByCode: Record<string, number> = {}
    for (const f of bp.facets) {
      const facet = await prisma.facet.create({ data: { type: f.type }, select: { id: true } })
      facetIdByCode[f.code] = facet.id
      if (f.buckets?.length) {
        await prisma.bucket.createMany({
          data: f.buckets.map((b) => ({
            facetId: facet.id,
            label: b.label,
            gt: b.gt ?? null,
            lte: b.lte ?? null,
          })),
        })
      }
    }

    // 3) ProductSpecs (gắn specTemplateId)
    for (const s of bp.productSpecs) {
      await prisma.productSpec.create({
        data: {
          specTemplateId: template.id,
          name: s.name,
          label: s.label,
          multi: s.multi ?? false,
          filterable: s.filterable ?? false,
          control: s.control,
          datatype: s.datatype,
          facetId: s.facetCode ? facetIdByCode[s.facetCode] ?? null : null,
        },
      })
    }

    // 4) VariantSpecs (gắn specTemplateId)
    for (const s of bp.variantSpecs) {
      await prisma.variantSpec.create({
        data: {
          specTemplateId: template.id,
          name: s.name,
          label: s.label,
          multi: s.multi ?? false,
          filterable: s.filterable ?? false,
          control: s.control,
          datatype: s.datatype,
          facetId: s.facetCode ? facetIdByCode[s.facetCode] ?? null : null,
        },
      })
    }

    registry[key] = { facetIdByCode, templateId: template.id }
  }

  // -------- Products & Variants (with spec values + media) --------
  console.log('▶ Seeding products & variants')
  const perCategory = 10
  const priceRange: Record<CatKey, [number, number]> = {
    phone: [3_000_000, 35_000_000],
    laptop: [10_000_000, 60_000_000],
    accessory: [100_000, 3_000_000],
  }

  for (const key of Object.keys(CATEGORIES) as CatKey[]) {
    const cat = catMap[key]
    for (let i = 1; i <= perCategory; i++) {
      const brand = pick(brands)
      const baseName = `${cat.name} ${brand.name} ${i}`
      const product = await prisma.product.create({
        data: {
          name: baseName,
          slug: slugify(`${baseName}-${Date.now()}-${i}`),
          brandId: brand.id,
          categoryId: cat.id,
          description: `${CATEGORIES[key].hint} – seed demo thông số & lọc.`,
          isActive: true,
        },
      })

      // ---- ProductSpecValue (theo category) ----
      const psv: Prisma.ProductSpecValueCreateManyInput[] = []

      if (key === 'phone') {
        const screen = pick([6.1, 6.5, 6.7])
        const battery = pick([3500, 4000, 4500, 5000])
        const ram = pick([4, 6, 8, 12])
        const storage = pick([64, 128, 256, 512])
        const os = pick(PHONE_OS)

        psv.push(
          { productId: product.id, specKey: 'screen_size', label: 'Kích thước màn hình', valueJson: { value: screen }, type: DataType.number, unit: 'inch', numericValue: screen },
          { productId: product.id, specKey: 'battery', label: 'Dung lượng pin', valueJson: { value: battery }, type: DataType.number, unit: 'mAh', numericValue: battery },
          { productId: product.id, specKey: 'ram', label: 'RAM', valueJson: { value: ram }, type: DataType.number, unit: 'GB', numericValue: ram },
          { productId: product.id, specKey: 'storage', label: 'Bộ nhớ trong', valueJson: { value: storage }, type: DataType.number, unit: 'GB', numericValue: storage },
          { productId: product.id, specKey: 'os', label: 'Hệ điều hành', valueJson: { value: os }, type: DataType.string, unit: null, stringValue: os },
        )
      }

      if (key === 'laptop') {
        const screen = pick([13.3, 14.0, 15.6])
        const ram = pick([8, 16, 32])
        const storage = pick([256, 512, 1024])
        const weight = pick([1.25, 1.4, 1.7, 2.1])
        const cpu = pick(CPU_POOL)
        const gpu = pick(GPU_POOL)

        psv.push(
          { productId: product.id, specKey: 'cpu', label: 'CPU', valueJson: { value: cpu }, type: DataType.string, unit: null, stringValue: cpu },
          { productId: product.id, specKey: 'ram', label: 'RAM', valueJson: { value: ram }, type: DataType.number, unit: 'GB', numericValue: ram },
          { productId: product.id, specKey: 'storage', label: 'SSD', valueJson: { value: storage }, type: DataType.number, unit: 'GB', numericValue: storage },
          { productId: product.id, specKey: 'screen_size', label: 'Kích thước màn', valueJson: { value: screen }, type: DataType.number, unit: 'inch', numericValue: screen },
          { productId: product.id, specKey: 'weight', label: 'Khối lượng', valueJson: { value: weight }, type: DataType.number, unit: 'kg', numericValue: weight },
          { productId: product.id, specKey: 'gpu', label: 'GPU', valueJson: { value: gpu }, type: DataType.string, unit: null, stringValue: gpu },
        )
      }

      if (key === 'accessory') {
        const type = pick(ACCESSORY_TYPES)
        const compatibility = pick(['iOS', 'Android', 'Windows', 'macOS', 'Universal'])
        const origin = pick(['VN', 'CN', 'KR', 'JP', 'US', 'TW'])

        psv.push(
          { productId: product.id, specKey: 'type', label: 'Loại phụ kiện', valueJson: { value: type }, type: DataType.string, unit: null, stringValue: type },
          { productId: product.id, specKey: 'compatibility', label: 'Tương thích', valueJson: { value: compatibility }, type: DataType.string, unit: null, stringValue: compatibility },
          { productId: product.id, specKey: 'brand_origin', label: 'Hãng / Xuất xứ', valueJson: { value: origin }, type: DataType.string, unit: null, stringValue: origin },
        )
      }

      if (psv.length > 0) {
        await prisma.productSpecValue.createMany({ data: psv, skipDuplicates: true })
      }

      // ---- Variants (1–3) ----
      const [minP, maxP] = priceRange[key]
      const variantCount = randInt(1, 3)

      for (let v = 1; v <= variantCount; v++) {
        const variant = await prisma.variant.create({
          data: {
            productId: product.id,
            color: pick(COLOR_POOL), // KHÔNG thêm color vào VariantSpecValue
            price: randInt(minP, maxP),
            stock: randInt(10, 200),
            isActive: true,
          },
        })

        // VariantSpecValue — không include color
        const vsv: Prisma.VariantSpecValueCreateManyInput[] = []

        if (key === 'phone') {
          const sim = pick([1, 2])
          vsv.push({ variantId: variant.id, specKey: 'sim', label: 'Số khe SIM', valueJson: { value: sim }, type: DataType.number, unit: null, numericValue: sim })
        }

        if (key === 'laptop') {
          const keyboard = pick(['ANSI', 'ISO', 'JIS'])
          vsv.push({ variantId: variant.id, specKey: 'keyboard', label: 'Bàn phím', valueJson: { value: keyboard }, type: DataType.string, unit: null, stringValue: keyboard })
        }

        if (key === 'accessory') {
          const length = randInt(50, 200) // cm
          vsv.push({ variantId: variant.id, specKey: 'length', label: 'Chiều dài', valueJson: { value: length }, type: DataType.number, unit: 'cm', numericValue: length })
        }

        if (vsv.length > 0) {
          await prisma.variantSpecValue.createMany({ data: vsv, skipDuplicates: true })
        }

        // Media mặc định
        await prisma.media.create({
          data: { variantId: variant.id, url: 'iphone_air-3_2.webp', isPrimary: true, sortOrder: 0 },
        })
      }
    }
  }

  console.log('🎉 Seeding completed.')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
