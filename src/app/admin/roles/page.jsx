import AdminLayout from "@/components/Layout/AdminLayout";
import RolesClient from "./_components/RolesClient";
import rolesApi from "@/lib/api/rolesApi";
import permissionsApi from "@/lib/api/permissionsApi";

export default async function RolesPage({ searchParams }) {
  // Parse params giống Users để support search/sort nếu cần sau này
  const resolvedParams = JSON.parse(JSON.stringify(await searchParams));
  const paramsArray = Object.entries(resolvedParams)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();

  const [rolesRes, permissionsRes] = await Promise.all([
    rolesApi.getRoles(queryString).catch((e) => {
      console.error("Fetch roles error:", e);
      return { data: [], pagination: { totalItems: 0 } };
    }),
    permissionsApi.getPermissions({ pageSize: 1000 }).catch((e) => {
      console.error("Fetch permissions error:", e);
      return { data: [] };
    }),
  ]);

  return (
    <RolesClient
      initialRoles={rolesRes}
      initialPermissions={permissionsRes.data}
    />
  );
}
