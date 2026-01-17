"use client";

import { useState, useEffect } from "react";
import reportsApi from "@/lib/api/reportsApi";

export function useFetchReports(initialRange = "7days") {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState(initialRange);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await reportsApi.getReports(range);
        setData(res);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [range]); 

  return { data, isLoading, range, setRange };
}