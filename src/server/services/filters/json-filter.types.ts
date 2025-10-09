// định nghĩa schema filter (map key → đường dẫn JSON, kiểu dữ liệu, phép so sánh hỗ trợ).
export type JsonFieldType = 'number' | 'string' | 'boolean' | 'string_array';

export type Operator =
  | 'eq' | 'ne'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'has'        // phần tử trong mảng
  | 'includes';  // substring cho string thường

export interface JsonFieldDef {
  path: string[];         // ví dụ: ['size','value']
  type: JsonFieldType;
  units?: string[];       // để strip đơn vị như ["inch","mAh","GB"]
  allowOps: Operator[];
}

export const PRODUCT_JSON_FIELDS: Record<string, JsonFieldDef> = {
  size:        { path: ['size','value'],       type: 'number', allowOps: ['eq','gt','gte','lt','lte'] },
  ram:         { path: ['ram','value'],        type: 'string', units: ['GB'], allowOps: ['eq','includes'] },
  chipset:     { path: ['chipset','value'],    type: 'string', allowOps: ['eq','includes'] },
  capacity:    { path: ['capacity','value'],   type: 'number', units: ['mAh'], allowOps: ['eq','gt','gte','lt','lte'] },
  waterproof:  { path: ['waterproof','value'], type: 'boolean', allowOps: ['eq'] },
  connectivity:{ path: ['connectivity','value'], type: 'string_array', allowOps: ['has'] },
};
