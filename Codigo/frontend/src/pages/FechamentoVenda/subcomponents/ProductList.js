import { useEffect } from "react";
import { ProductItem } from "./ProductItem";

export function ProductList({ products, setProducts }) {
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

  function handleSetProduct(setProductAction, idx) {
    setProducts((prev) => {
      const newProducts = [...prev];
      newProducts[idx] = setProductAction(newProducts[idx]);
      return newProducts;
    });
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

  useEffect(() => {
    console.debug("products.length", products.length);
    if (products.length === 0) {
      const newProduct = buildProduct();
      setProducts([newProduct]);
    }
  }, [products, setProducts]);

  return (
    <ol>
      {products.map((p, i) => (
        <ProductItem
          key={p.tempKey}
          product={p}
          setProduct={(setProductAction) =>
            handleSetProduct(setProductAction, i)
          }
          handleAddItem={() => handleAddItem(i)}
          handleDeleteItem={() => handleDeleteItem(p, i)}
        />
      ))}
    </ol>
  );
}
