import { useState } from "react";
import { ProductItem } from "./ProductItem";

export function ProductList({}) {
  const [products, setProducts] = useState([buildProduct()]);

  function genTempKey() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
  }

  function buildProduct() {
    return {
      id: null,
      tempKey: genTempKey(),
      code: "",
      price: "",
      amount: 0,
    };
  }

  function handleAddItem(idx) {
    setProducts((prev) => {
      const newProduct = buildProduct();
      const newProducts = [...prev];
      newProducts.splice(idx + 1, 0, newProduct);
      return newProducts;
    });
  }

  function handleDeleteItem(p, idx) {
    setProducts((prev) => {
      const newProducts = [...prev];
      newProducts.splice(idx, 1);

      if (newProducts.length === 0) {
        const newProduct = buildProduct();
        newProducts.push(newProduct);
      }

      return newProducts;
    });
  }

  return (
    <ol>
      {products.map((p, i) => (
        <ProductItem
          key={p.tempKey}
          handleAddItem={() => handleAddItem(i)}
          handleDeleteItem={() => handleDeleteItem(p, i)}
        />
      ))}
    </ol>
  );
}
