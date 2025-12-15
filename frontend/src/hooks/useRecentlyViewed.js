import { useEffect, useState } from "react";
import { getRecentlyViewed } from "../utils/recentlyViewed";

export default function useRecentlyViewed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  return items;
}
