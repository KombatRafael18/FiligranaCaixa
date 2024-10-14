import { useState } from "react";

export function useLoading() {
  const [loadings, setLoadings] = useState(0);

  const isLoading = loadings > 0;

  function startLoading() {
    setLoadings((l) => l + 1);
  }

  function stopLoading() {
    setLoadings((l) => l - 1);
  }

  return { isLoading, startLoading, stopLoading };
}
