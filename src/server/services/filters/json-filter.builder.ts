// biến các điều kiện đó thành SQL cho JSONB (dùng $queryRaw), đồng thời vẫn cho phép kết hợp các điều kiện không-JSON qua Prisma where.
import { Prisma } from '@prisma/client';
import { PRODUCT_JSON_FIELDS } from './json-filter.types';
import type { ParsedCond } from './json-filter.parser';

export interface SqlBuild {
  whereSql: Prisma.Sql;
  params: any[];
}

export function buildJsonbWhere(conds: ParsedCond[]): SqlBuild {
  const parts: Prisma.Sql[] = [];

  for (const c of conds) {
    const def = PRODUCT_JSON_FIELDS[c.fieldKey];
    const pathSql = Prisma.sql`data #> ${JSON.stringify(def.path)}::text[]`; // JSONB at path

    switch (def.type) {
      case 'number': {
        // trích giá trị text rồi cast float
        const numExpr = Prisma.sql`(${pathSql} #>> '{}')::float`;
        if (c.op === 'eq') parts.push(Prisma.sql`${numExpr} = ${c.value}`);
        if (c.op === 'gt') parts.push(Prisma.sql`${numExpr} > ${c.value}`);
        if (c.op === 'gte') parts.push(Prisma.sql`${numExpr} >= ${c.value}`);
        if (c.op === 'lt') parts.push(Prisma.sql`${numExpr} < ${c.value}`);
        if (c.op === 'lte') parts.push(Prisma.sql`${numExpr} <= ${c.value}`);
        break;
      }
      case 'boolean': {
        const boolExpr = Prisma.sql`(${pathSql})::jsonb ?? 't'`; // cách khác: so sánh text
        // dùng dạng text để chắc chắn:
        const textExpr = Prisma.sql`lower(${pathSql} #>> '{}')`;
        parts.push(Prisma.sql`${textExpr} = ${String(c.value).toLowerCase()}`);
        break;
      }
      case 'string': {
        const txt = Prisma.sql`${pathSql} #>> '{}'`;
        if (c.op === 'eq') parts.push(Prisma.sql`${txt} = ${c.value}`);
        if (c.op === 'includes') parts.push(Prisma.sql`${txt} ILIKE '%' || ${c.value} || '%'`);
        break;
      }
      case 'string_array': {
        // Kiểm tra một phần tử có trong mảng
        // data->'connectivity'->'value' @> ["Wi-Fi 6E"]
        const arrAtPath = pathSql;
        parts.push(Prisma.sql`${arrAtPath} @> ${JSON.stringify([c.value])}::jsonb`);
        break;
      }
    }
  }

  if (parts.length === 0) {
    return { whereSql: Prisma.sql`TRUE`, params: [] };
  }
  // nối bằng AND
  const joined = parts.reduce((acc, cur, i) =>
    i === 0 ? cur : Prisma.sql`${acc} AND ${cur}`, Prisma.sql`` as Prisma.Sql);

  return { whereSql: joined, params: [] };
}
