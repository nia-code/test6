import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!price || !name || !category) return alert("Plase fill all fields");
    setLoading(true);
    const newItem = {
      name,
      category,
      price: parseFloat(price), // Ensure price is a number
    };

    try {
      const response = await fetch("http://localhost:3001/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload item");
      }

      const savedItem = await response.json();
      console.log("Item saved:", savedItem);

      setLoading(false);

      // Optionally clear fields
      setName("");
      setCategory("");
      setPrice("");
      alert("Item uploaded successfully!");

      navigate("/");
    } catch (error) {
      console.error("Upload failed:", error.message);
      alert("Upload failed. Try again.");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="header">Upload Product</h2>

      <div>
        <h3>Product Name</h3>
        <input
          type="text"
          className="search-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          aria-label="Product Name"
          required
        />
      </div>

      <div>
        <h3>Product Category</h3>
        <input
          type="text"
          className="search-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Product Category"
          aria-label="Product Category"
          required
        />
      </div>

      <div>
        <h3>Product Price</h3>
        <div className="input-form-cash">
          <span>$</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Product Price"
            aria-label="Product Price"
            required
          />
        </div>
      </div>

      <button type="submit" className="submit-btn">
        {loading ? <span className="spinner" /> : " Upload Product"}
      </button>
    </form>
  );
};

export default Upload;
