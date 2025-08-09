import useSWR from "swr";
import api from "@/lib/axios";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useUsers() {
  const { data, error, mutate, isLoading } = useSWR("/users", fetcher);

  return {
    users: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
