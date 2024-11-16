import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Input from "../../../components/Input";
import { useLoading } from "../../../hooks/loading-hook";
import {
  ApiError,
  getProductByCode,
  postProduct,
} from "../../../services/filigranaapi";
import { formatBrazilianCurrency } from "../../../utils/currencyFormatter";
import { SpinnerIcon } from "./SpinnerIcon";

const zeroCurrency = formatBrazilianCurrency(0);

export function ProductItem({ handleAddItem, handleDeleteItem }) {
  const [productId, setProductId] = useState(null);
  const [productCode, setProductCode] = useState("");
  const [productPrice, setProductPrice] = useState(zeroCurrency);
  const [productAmount, setProductAmount] = useState(0);

  const { isLoading, startLoading, stopLoading } = useLoading();

  const found = productCode !== "" && productId !== null;

  async function handleCodigoChange(val) {
    const v = val.trim();
    setProductCode(v);

    try {
      startLoading();
      const res = await getProductByCode(v);
      console.debug("Produto encontrado:", res);
      setProductId(res.id);
      setProductPrice(formatBrazilianCurrency(res.price));
    } catch (error) {
      if (error instanceof ApiError && error.isNotFoundError()) {
        console.debug("Produto não encontrado");
        setProductId(null);
        setProductPrice(zeroCurrency);
        return;
      }
      console.error("Erro getProductByCode:", { error });
    } finally {
      stopLoading();
    }
  }

  // Manipula a entrada de valores, formatando como moeda
  function handlePriceChange(v) {
    const numericValue = v.replace(/[^0-9]/g, "");

    if (numericValue === "") {
      setProductPrice(zeroCurrency);
      return;
    }

    const formattedValue = formatBrazilianCurrency(numericValue / 100);
    setProductPrice(formattedValue);
  }

  async function handleCreateProduct() {
    const valorString = productPrice.replace(/[^\d,]/g, "").replace(",", ".");
    const valor = parseFloat(valorString);

    if (!productCode || isNaN(valor) || valor <= 0) {
      alert("Por favor, insira um código válido e um preço positivo.");
      return;
    }

    const produto = {
      name: productCode,
      price: valor,
    };

    try {
      startLoading();
      const res = await postProduct(produto);
      console.debug("Produto adicionado:", res);
      alert("Produto adicionado com sucesso!");
      setProductId(res.id);
    } catch (error) {
      console.error("Erro postProduct:", { error });
      alert(`Erro ao adicionar produto: ${error.message}`);
    } finally {
      stopLoading();
    }
  }

  return (
    <li className="produto-item">
      <Input
        type="text"
        value={productCode}
        onChange={(e) => handleCodigoChange(e.target.value)}
        placeholder="Código"
        variant="custom"
        className="codigo-input"
      />
      <div className="flex items-center">
        <Input
          type="text"
          value={productPrice}
          onChange={(e) => handlePriceChange(e.target.value)}
          placeholder={zeroCurrency}
          variant="custom"
          disabled={found}
          className="valor-input"
        />
        <button
          onClick={handleAddItem}
          className="ml-6 text-blue-500 hover:text-blue-700 "
          title="Adicionar nova peça"
        >
          <PlusIcon className="h-5 w-5 text-[#9b5c6f]" />
        </button>

        <button
          onClick={() => handleDeleteItem()}
          className="ml-2 text-red-500 hover:text-red-700"
          title="Remover esta peça"
        >
          <TrashIcon className="h-5 w-5 text-[#9b5c6f]" />
        </button>

        {!found && (
          <button
            onClick={() => handleCreateProduct()}
            className="add-produto-btn"
            title="Criar Produto"
            disabled={isLoading}
          >
            {isLoading ? (
              <SpinnerIcon />
            ) : (
              <ArrowUpTrayIcon className="h-5 w-5 text-[#9b5c6f]" />
            )}
          </button>
        )}

        {isLoading && <SpinnerIcon />}
      </div>
    </li>
  );
}
