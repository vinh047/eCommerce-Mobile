import AdminLayout from "@/components/Layout/AdminLayout";
import UsersClient from "./UsersClient";
import usersApi from "@/lib/api/usersApi";

export default async function UsersPage({ searchParams }) {
  const resolvedParams = JSON.parse(JSON.stringify(searchParams));

  console.log("Resolved Search Params:", resolvedParams);

  const paramsArray = Object.entries(resolvedParams)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();
  console.log("Query String:", queryString);

  const initialData = await usersApi.getUsers(queryString);

  return (
    <AdminLayout>
      <UsersClient initialUsers={initialData} searchParams={resolvedParams} />
    </AdminLayout>
  );
}


