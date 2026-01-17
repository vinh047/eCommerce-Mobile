import { useState, useEffect } from "react";
import specsApi from "@/lib/api/specsApi"; // Giả sử bạn có api này để get template by category

export function useTemplateFetcher(categoryId) {
  const [template, setTemplate] = useState(null);
  const [isLoadingTemplate, setIsLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setTemplate(null);
      return;
    }

    const fetchTemplate = async () => {
      setIsLoading(true);
      try {
        // Gọi API lấy Template dựa theo Category ID
        // Backend cần endpoint: GET /api/specs/template-by-category/:categoryId
        const res = await specsApi.getTemplateByCategoryId(categoryId);
        setTemplate(res.data); 
      } catch (err) {
        console.error("Failed to load spec template:", err);
        setTemplate(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [categoryId]);

  return { template, isLoadingTemplate };
}