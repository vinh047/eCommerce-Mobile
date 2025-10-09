// nhận req.query → chuẩn hoá thành các “điều kiện” có cấu trúc.
import { PRODUCT_JSON_FIELDS, Operator } from './json-filter.types';

function normalizeNumber(raw: string, units?: string[]): number | null {
  let s = raw.trim();
  if (units?.length) {
    for (const u of units) s = s.replace(new RegExp(u+'$','i'), '');
  }
  s = s.replace(/[^\d.,-]/g,'').replace(',','.');
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export interface ParsedCond {
  fieldKey: string;
  op: Operator;
  value: any;
}

export function parseQueryToConds(q: Record<string, string | string[]>): ParsedCond[] {
  const conds: ParsedCond[] = [];

  for (const [key, val] of Object.entries(q)) {
    const def = PRODUCT_JSON_FIELDS[key];
    if (!def) continue;

    const values = Array.isArray(val) ? val : [val];

    for (let raw of values) {
      raw = decodeURIComponent(String(raw));

      // tách op nếu có dạng "lt_...", "gte_..."
      let [maybeOp, ...rest] = raw.split('_');
      let op: Operator | null = null;
      let operandRaw = raw;

      const opCandidates: Operator[] = ['lt','lte','gt','gte','eq','has','includes'];
      if (opCandidates.includes(maybeOp as Operator)) {
        op = maybeOp as Operator;
        operandRaw = rest.join('_');
      }

      if (!op) op = 'eq';
      if (!def.allowOps.includes(op)) continue;

      switch (def.type) {
        case 'number': {
          const n = normalizeNumber(operandRaw, def.units);
          if (n == null) break;
          conds.push({ fieldKey: key, op, value: n });
          break;
        }
        case 'boolean': {
          const b = operandRaw.toLowerCase() === 'true' ? true
                : operandRaw.toLowerCase() === 'false' ? false : null;
          if (b == null) break;
          conds.push({ fieldKey: key, op: 'eq', value: b });
          break;
        }
        case 'string': {
          conds.push({ fieldKey: key, op, value: operandRaw });
          break;
        }
        case 'string_array': {
          // cho phép nhiều giá trị ngăn bởi dấu phẩy
          const items = operandRaw.split(',').map(s => s.trim()).filter(Boolean);
          for (const it of items) conds.push({ fieldKey: key, op: 'has', value: it });
          break;
        }
      }
    }
  }
  return conds;
}
