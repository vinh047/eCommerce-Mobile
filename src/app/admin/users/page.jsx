import AdminLayout from "@/components/Layout/AdminLayout";
import UsersClient from "./UsersClient";
import usersApi from "@/lib/api/usersApi";

export default async function UsersPage({ searchParams }) {
  const resolvedParams = JSON.parse(JSON.stringify(searchParams));
  const paramsArray = Object.entries(resolvedParams)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();
  const initialData = await usersApi.getUsers(queryString);
  console.log(initialData);
  return (
    <AdminLayout>
      <UsersClient initialUsers={initialData} />
    </AdminLayout>
  );
}


