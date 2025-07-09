import React, { useEffect, useState } from "react";
import { useData } from "../state/DataContext";
import { Link } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Items() {
  const { items, fetchItems, total, loading } = useData();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const limit = 2; // items per page
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const controller = new AbortController(); // create controller

    fetchItems({ page, limit, q }, controller.signal).catch((err) => {
      if (err.name !== "AbortError") {
        console.error(err);
      }
    });

    return () => {
      controller.abort(); // cancel the fetch on unmount
    };
  }, [fetchItems, page, q]);

  // if (!items.length) return <p>Loading...</p>;

  const Row = ({ index, style }) => {
    const item = items[index];
    return (
      <div style={style}>
        <Link to={`/items/${item.id}`}>{item.name}</Link>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="item-container">
        <input
          type="text"
          className="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search items"
          aria-label="Search items"
        />

        {loading ? (
          <div>
            <p>Loading...</p>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                height={30}
                style={{ marginBottom: "10px" }}
              />
            ))}
          </div>
        ) : items.length ? (
          <List
            height={400}
            itemCount={items.length}
            itemSize={40}
            width={"100%"}
            role="list"
          >
            {Row}
          </List>
        ) : (
          <p>No items found.</p>
        )}
      </div>

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>
        </span>
        <button
          className="pagination-btn"
          disabled={page == totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Items;
