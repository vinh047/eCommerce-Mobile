import { useRouter, useSearchParams } from "next/navigation";

export function useQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = (key) => searchParams.get(key);
  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined || value === null) params.delete(key);
    else params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  return { getParam, setParam, all: Object.fromEntries(searchParams) };
}
