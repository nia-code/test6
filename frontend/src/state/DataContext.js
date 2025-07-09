import React, { createContext, useCallback, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(
    async ({ page = 1, limit = 5, q = "" } = {}, signal) => {
      setLoading(true);
      try {
        const url = new URL(`${process.env.BASE_URL}/items`);
        url.searchParams.append("page", page);
        url.searchParams.append("limit", limit);
        if (q) url.searchParams.append("q", q);

        const res = await fetch(url, { signal });
        const json = await res.json();

        setItems(json.results || []);
        setTotal(json.total || 0);
        setLoading(false);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    },
    []
  );

  return (
    <DataContext.Provider value={{ items, fetchItems, total, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
