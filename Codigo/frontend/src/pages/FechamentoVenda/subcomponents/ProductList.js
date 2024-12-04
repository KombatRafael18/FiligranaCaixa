import { useCallback, useEffect, useState } from "react";
import { ProductItem } from "./ProductItem";

/**
 * Componente que encapsula ProductItem com um índice para otimização de
 * renderização.
 */
function ProductItemWithIdx({
  idx,
  product,
  handleSetProductWithIdx,
  handleAddItemWithIdx,
  handleDeleteItemWithIdx,
  isInputDisabled,
}) {
  const handleSetProduct = useCallback(
    (setProductAction) => {
      handleSetProductWithIdx(setProductAction, idx);
    },
    [handleSetProductWithIdx, idx]
  );

  return (
    <ProductItem
      product={product}
      setProduct={handleSetProduct}
      handleAddItem={() => handleAddItemWithIdx(idx)}
      handleDeleteItem={() => handleDeleteItemWithIdx(product, idx)}
      isInputDisabled={isInputDisabled}
    />
  );
}

export function ProductList({ products, setProducts }) {
  const [disabledInputs, setDisabledInputs] = useState([]);

  function genTempKey() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
  }

  function buildProduct() {
    return {
      id: null,
      tempKey: genTempKey(),
      code: "",
      price: "",
      quantity: 1,
    };
  }

  const handleSetProduct = useCallback(
    (setProductAction, idx) => {
      setProducts((prev) => {
        const newProducts = [...prev];
        newProducts[idx] = setProductAction(newProducts[idx]);
        return newProducts;
      });
    },
    [setProducts]
  );

  function handleAddItem(idx) {
    setProducts((prev) => {
      const newProduct = buildProduct();
      const newProducts = [...prev];
      newProducts.splice(idx + 1, 0, newProduct);
      return newProducts;
    });

    setDisabledInputs((prev) => {
      const newDisabledInputs = [...prev];
      newDisabledInputs[idx] = true;
      return newDisabledInputs;
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

    setDisabledInputs((prev) => {
      const newDisabledInputs = [...prev];
      newDisabledInputs.splice(idx, 1);
      return newDisabledInputs;
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
        <ProductItemWithIdx
          key={p.tempKey}
          idx={i}
          product={p}
          handleSetProductWithIdx={handleSetProduct}
          handleAddItemWithIdx={handleAddItem}
          handleDeleteItemWithIdx={handleDeleteItem}
          isInputDisabled={disabledInputs[i] || false}
        />
      ))}
    </ol>
  );
}
