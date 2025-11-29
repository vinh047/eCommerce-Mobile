-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'blocked', 'deleted');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('fixed', 'percentage');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'returned', 'refunded');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed');

-- CreateEnum
CREATE TYPE "InventoryTxnType" AS ENUM ('in', 'out', 'adjustment', 'reservation', 'release');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('in_stock', 'sold', 'reserved', 'returned', 'locked');

-- CreateEnum
CREATE TYPE "PaymentTxnStatus" AS ENUM ('pending', 'success', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "RmaType" AS ENUM ('return', 'exchange', 'warranty');

-- CreateEnum
CREATE TYPE "RmaStatus" AS ENUM ('pending', 'approved', 'rejected', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ControlType" AS ENUM ('select', 'multiselect');

-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('string', 'number', 'boolean');

-- CreateEnum
CREATE TYPE "ValueType" AS ENUM ('discrete', 'range');

-- CreateTable
CREATE TABLE "banners" (
    "id" SERIAL NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "alt_text" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "avatar" VARCHAR(255),
    "status" "AccountStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "line" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "ward" VARCHAR(100),
    "district" VARCHAR(100),
    "province" VARCHAR(100),
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(191) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(191) NOT NULL,
    "parent_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "icon_key" VARCHAR(64),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spec_templates" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spec_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_specs" (
    "id" SERIAL NOT NULL,
    "spec_template_id" INTEGER NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "valueType" "ValueType" NOT NULL,
    "datatype" "DataType" NOT NULL,
    "unit" VARCHAR(32),
    "filterable" BOOLEAN NOT NULL DEFAULT false,
    "control" "ControlType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "groupLabel" VARCHAR(128),
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_spec_options" (
    "id" SERIAL NOT NULL,
    "product_spec_id" INTEGER NOT NULL,
    "value" VARCHAR(191) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_spec_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_buckets" (
    "id" SERIAL NOT NULL,
    "product_spec_id" INTEGER NOT NULL,
    "gt" DECIMAL(18,6),
    "lte" DECIMAL(18,6),
    "label" VARCHAR(255) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_buckets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_specs" (
    "id" SERIAL NOT NULL,
    "spec_template_id" INTEGER NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "valueType" "ValueType" NOT NULL,
    "datatype" "DataType" NOT NULL,
    "unit" VARCHAR(32),
    "filterable" BOOLEAN NOT NULL DEFAULT false,
    "control" "ControlType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "is_variant_key" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "groupLabel" VARCHAR(128),
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "variant_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_spec_options" (
    "id" SERIAL NOT NULL,
    "variant_spec_id" INTEGER NOT NULL,
    "value" VARCHAR(191) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "variant_spec_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_buckets" (
    "id" SERIAL NOT NULL,
    "variant_spec_id" INTEGER NOT NULL,
    "gt" DECIMAL(18,6),
    "lte" DECIMAL(18,6),
    "label" VARCHAR(255) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "variant_buckets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(191) NOT NULL,
    "brand_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "description" TEXT,
    "rating_avg" DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warrantyMonths" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variants" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "color" VARCHAR(100) NOT NULL,
    "price" DECIMAL(12,2),
    "compare_at_price" DECIMAL(12,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "low_stock_threshold" INTEGER,

    CONSTRAINT "variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_spec_values" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "spec_key" VARCHAR(191) NOT NULL,
    "label" VARCHAR(255),
    "type" "DataType" NOT NULL,
    "unit" VARCHAR(64),
    "stringValue" VARCHAR(255),
    "numericValue" DOUBLE PRECISION,
    "booleanValue" BOOLEAN,

    CONSTRAINT "product_spec_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_spec_values" (
    "id" SERIAL NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "spec_key" VARCHAR(191) NOT NULL,
    "label" VARCHAR(255),
    "type" "DataType" NOT NULL,
    "unit" VARCHAR(64),
    "stringValue" VARCHAR(255),
    "numericValue" DOUBLE PRECISION,
    "booleanValue" BOOLEAN,

    CONSTRAINT "variant_spec_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_variant" (
    "id" SERIAL NOT NULL,
    "media_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,

    CONSTRAINT "media_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "type" "CouponType" NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "min_order" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "max_order" DECIMAL(12,2) DEFAULT 0.00,
    "starts_at" TIMESTAMP(0),
    "ends_at" TIMESTAMP(0),
    "usage_limit" INTEGER,
    "used" INTEGER NOT NULL DEFAULT 0,
    "status" "AccountStatus" NOT NULL DEFAULT 'active',
    "category_id" INTEGER,
    "brand_id" INTEGER,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "payment_account_id" INTEGER,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "shipping_fee" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "address_snapshot" JSONB,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid_at" TIMESTAMP(0),
    "note" TEXT,
    "shipping_provider" VARCHAR(100),
    "shipping_status" VARCHAR(50),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "name_snapshot" VARCHAR(255) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "payment_method_id" INTEGER,
    "provider_payment_id" VARCHAR(100),
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "PaymentTxnStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "content" TEXT,
    "photos_json" JSONB,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_actived" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rmas" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "type" "RmaType" NOT NULL,
    "reason" TEXT,
    "status" "RmaStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evidence_json" JSONB,

    CONSTRAINT "rmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staffs" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "avatar" VARCHAR(255),
    "status" "AccountStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_roles" (
    "staff_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_roles_pkey" PRIMARY KEY ("staff_id","role_id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "granted_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "inventory_transactions" (
    "id" SERIAL NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "type" "InventoryTxnType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "reference_json" JSONB,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_transaction_devices" (
    "id" SERIAL NOT NULL,
    "inventory_txn_id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,

    CONSTRAINT "inventory_transaction_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" SERIAL NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "identifier" VARCHAR(20) NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'in_stock',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_devices" (
    "id" SERIAL NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,

    CONSTRAINT "order_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "logo_url" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_accounts" (
    "id" SERIAL NOT NULL,
    "payment_method_id" INTEGER NOT NULL,
    "account_name" VARCHAR(255) NOT NULL,
    "account_number" VARCHAR(50) NOT NULL,
    "bank_name" VARCHAR(100),
    "bank_branch" VARCHAR(255),
    "qr_code_url" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "payment_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductSpecToProductSpecValue" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductSpecToProductSpecValue_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_VariantSpecToVariantSpecValue" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VariantSpecToVariantSpecValue_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "banners_product_id_idx" ON "banners"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "address_user_id_idx" ON "address"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE INDEX "idx_brands_slug" ON "brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "idx_categories_slug" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE INDEX "spec_templates_category_id_is_active_idx" ON "spec_templates"("category_id", "is_active");

-- CreateIndex
CREATE INDEX "idx_product_specs_template" ON "product_specs"("spec_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_product_specs_tmpl_code" ON "product_specs"("spec_template_id", "code");

-- CreateIndex
CREATE INDEX "idx_product_spec_option_spec" ON "product_spec_options"("product_spec_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_product_spec_option_value" ON "product_spec_options"("product_spec_id", "value");

-- CreateIndex
CREATE INDEX "idx_product_buckets_spec" ON "product_buckets"("product_spec_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_product_buckets_range" ON "product_buckets"("product_spec_id", "gt", "lte");

-- CreateIndex
CREATE INDEX "idx_variant_specs_template" ON "variant_specs"("spec_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_variant_specs_tmpl_code" ON "variant_specs"("spec_template_id", "code");

-- CreateIndex
CREATE INDEX "idx_variant_spec_option_spec" ON "variant_spec_options"("variant_spec_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_variant_spec_option_value" ON "variant_spec_options"("variant_spec_id", "value");

-- CreateIndex
CREATE INDEX "idx_variant_buckets_spec" ON "variant_buckets"("variant_spec_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_variant_buckets_range" ON "variant_buckets"("variant_spec_id", "gt", "lte");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "idx_products_category" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "idx_products_brand" ON "products"("brand_id");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "idx_products_slug" ON "products"("slug");

-- CreateIndex
CREATE INDEX "variants_product_id_idx" ON "variants"("product_id");

-- CreateIndex
CREATE INDEX "variants_price_idx" ON "variants"("price");

-- CreateIndex
CREATE INDEX "product_spec_values_product_id_idx" ON "product_spec_values"("product_id");

-- CreateIndex
CREATE INDEX "product_spec_values_spec_key_idx" ON "product_spec_values"("spec_key");

-- CreateIndex
CREATE INDEX "product_spec_values_type_idx" ON "product_spec_values"("type");

-- CreateIndex
CREATE INDEX "product_spec_values_numericValue_idx" ON "product_spec_values"("numericValue");

-- CreateIndex
CREATE INDEX "variant_spec_values_variant_id_idx" ON "variant_spec_values"("variant_id");

-- CreateIndex
CREATE INDEX "variant_spec_values_spec_key_idx" ON "variant_spec_values"("spec_key");

-- CreateIndex
CREATE INDEX "variant_spec_values_type_idx" ON "variant_spec_values"("type");

-- CreateIndex
CREATE INDEX "variant_spec_values_numericValue_idx" ON "variant_spec_values"("numericValue");

-- CreateIndex
CREATE UNIQUE INDEX "media_variant_media_id_variant_id_key" ON "media_variant"("media_id", "variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_starts_at_idx" ON "coupons"("starts_at");

-- CreateIndex
CREATE INDEX "coupons_ends_at_idx" ON "coupons"("ends_at");

-- CreateIndex
CREATE INDEX "idx_coupons_code" ON "coupons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_cart_variant" ON "cart_items"("cart_id", "variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_code_key" ON "orders"("code");

-- CreateIndex
CREATE INDEX "idx_orders_user" ON "orders"("user_id");

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "orders"("status");

-- CreateIndex
CREATE INDEX "idx_orders_created_at" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "orders_payment_account_id_idx" ON "orders"("payment_account_id");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "payment_transactions_order_id_idx" ON "payment_transactions"("order_id");

-- CreateIndex
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions"("status");

-- CreateIndex
CREATE INDEX "payment_transactions_payment_method_id_idx" ON "payment_transactions"("payment_method_id");

-- CreateIndex
CREATE INDEX "idx_reviews_product" ON "reviews"("product_id");

-- CreateIndex
CREATE INDEX "idx_reviews_user" ON "reviews"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "staffs_email_key" ON "staffs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE INDEX "inventory_transaction_devices_device_id_idx" ON "inventory_transaction_devices"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_transaction_devices_inventory_txn_id_device_id_key" ON "inventory_transaction_devices"("inventory_txn_id", "device_id");

-- CreateIndex
CREATE UNIQUE INDEX "devices_identifier_key" ON "devices"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "order_devices_device_id_key" ON "order_devices"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_code_key" ON "payment_methods"("code");

-- CreateIndex
CREATE INDEX "payment_accounts_payment_method_id_idx" ON "payment_accounts"("payment_method_id");

-- CreateIndex
CREATE INDEX "_ProductSpecToProductSpecValue_B_index" ON "_ProductSpecToProductSpecValue"("B");

-- CreateIndex
CREATE INDEX "_VariantSpecToVariantSpecValue_B_index" ON "_VariantSpecToVariantSpecValue"("B");

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spec_templates" ADD CONSTRAINT "spec_templates_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specs" ADD CONSTRAINT "product_specs_spec_template_id_fkey" FOREIGN KEY ("spec_template_id") REFERENCES "spec_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_spec_options" ADD CONSTRAINT "product_spec_options_product_spec_id_fkey" FOREIGN KEY ("product_spec_id") REFERENCES "product_specs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_buckets" ADD CONSTRAINT "product_buckets_product_spec_id_fkey" FOREIGN KEY ("product_spec_id") REFERENCES "product_specs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_specs" ADD CONSTRAINT "variant_specs_spec_template_id_fkey" FOREIGN KEY ("spec_template_id") REFERENCES "spec_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_spec_options" ADD CONSTRAINT "variant_spec_options_variant_spec_id_fkey" FOREIGN KEY ("variant_spec_id") REFERENCES "variant_specs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_buckets" ADD CONSTRAINT "variant_buckets_variant_spec_id_fkey" FOREIGN KEY ("variant_spec_id") REFERENCES "variant_specs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_spec_values" ADD CONSTRAINT "product_spec_values_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_spec_values" ADD CONSTRAINT "variant_spec_values_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_variant" ADD CONSTRAINT "media_variant_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_variant" ADD CONSTRAINT "media_variant_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_account_id_fkey" FOREIGN KEY ("payment_account_id") REFERENCES "payment_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rmas" ADD CONSTRAINT "rmas_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rmas" ADD CONSTRAINT "rmas_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_roles" ADD CONSTRAINT "staff_roles_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_roles" ADD CONSTRAINT "staff_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "staffs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transaction_devices" ADD CONSTRAINT "inventory_transaction_devices_inventory_txn_id_fkey" FOREIGN KEY ("inventory_txn_id") REFERENCES "inventory_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transaction_devices" ADD CONSTRAINT "inventory_transaction_devices_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_devices" ADD CONSTRAINT "order_devices_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_devices" ADD CONSTRAINT "order_devices_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_accounts" ADD CONSTRAINT "payment_accounts_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSpecToProductSpecValue" ADD CONSTRAINT "_ProductSpecToProductSpecValue_A_fkey" FOREIGN KEY ("A") REFERENCES "product_specs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSpecToProductSpecValue" ADD CONSTRAINT "_ProductSpecToProductSpecValue_B_fkey" FOREIGN KEY ("B") REFERENCES "product_spec_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantSpecToVariantSpecValue" ADD CONSTRAINT "_VariantSpecToVariantSpecValue_A_fkey" FOREIGN KEY ("A") REFERENCES "variant_specs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantSpecToVariantSpecValue" ADD CONSTRAINT "_VariantSpecToVariantSpecValue_B_fkey" FOREIGN KEY ("B") REFERENCES "variant_spec_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;
