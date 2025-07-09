import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${process.env.BASE_URL}/items/` + id)
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((res) => {
          console.log(res);

          setItem(res);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setItem(null);
        });
    }
  }, [id, navigate]);

  if (!loading && !item) return <p>Item not found.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{loading ? <Skeleton width={200} /> : item?.name}</h2>
      <p>
        <strong>Category:</strong>{" "}
        {loading ? <Skeleton width={120} /> : item?.category}
      </p>
      <p>
        <strong>Price:</strong>{" "}
        {loading ? <Skeleton width={80} /> : `$${item?.price}`}
      </p>
    </div>
  );
}

export default ItemDetail;
