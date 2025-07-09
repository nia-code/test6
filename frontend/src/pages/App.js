import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Items from "./Items";
import ItemDetail from "./ItemDetail";
import { DataProvider } from "../state/DataContext";
import Upload from "./upload";

import "../style/style.css";

function App() {
  return (
    <DataProvider>
      <nav
        style={{
          padding: 16,
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Link to="/">Items</Link>
        <Link to="/upload">Add Product</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </DataProvider>
  );
}

export default App;
