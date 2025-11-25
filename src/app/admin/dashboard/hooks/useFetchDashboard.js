"use client";

import { useState, useEffect } from "react";
import dashboardApi from "@/lib/api/dashboardApi";

export function useFetchDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardApi.getStats();
        setData(res);
      } catch (err) {
        console.error("Failed to load dashboard", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, isLoading, error };
}