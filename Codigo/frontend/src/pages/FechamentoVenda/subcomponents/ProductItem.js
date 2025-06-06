import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import debounce from "lodash/debounce";
import { useCallback, useRef, useEffect } from "react";
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

export function ProductItem({
  product: {
    id: productId,
    code: productCode,
    price: productPrice,
    quantity: productQuantity,
  },
  setProduct,
  handleAddItem,
  handleDeleteItem,
  isInputDisabled,
  idx,
}) {
  const searchProductByCodeAbortRef = useRef(null);
  const inputRef = useRef(null);

  const { isLoading, startLoading, stopLoading } = useLoading();

  const found = productCode !== "" && productId !== null;

  function mergeProductUpdates(partialProduct) {
    setProduct((prev) => ({
      ...prev,
      ...partialProduct,
    }));
  }

  async function searchProductByCode(code) {
    searchProductByCodeAbortRef.current?.abort();
    const newAbortController = new AbortController();
    searchProductByCodeAbortRef.current = newAbortController;

    try {
      startLoading();
      const res = await getProductByCode(code, newAbortController.signal);
      console.debug("Produto encontrado:", res);

      mergeProductUpdates({
        id: res.id,
        price: formatBrazilianCurrency(res.price),
      });
    } catch (error) {
      if (error.name === "AbortError") {
        console.debug("Busca por produto abortada", code, { error });
        return;
      }

      if (error instanceof ApiError && error.isNotFoundError()) {
        console.debug("Produto não encontrado");

        mergeProductUpdates({
          id: null,
          price: zeroCurrency,
        });

        return;
      }
      console.error("Erro getProductByCode:", { error });
    } finally {
      stopLoading();
    }
  }

  const debounceSearchProductByCode = useCallback(
    debounce(searchProductByCode, 250),
    [setProduct]
  );

  async function handleCodigoChange(val) {
    const v = val.trim();

    mergeProductUpdates({
      code: v,
    });

    debounceSearchProductByCode(v);
  }

  // Manipula a entrada de valores, formatando como moeda
  function handlePriceChange(v) {
    const numericValue = v.replace(/[^0-9]/g, "");

    let value = numericValue;
    if (numericValue === "") {
      value = "0";
    }

    const formattedValue = formatBrazilianCurrency(numericValue / 100);

    mergeProductUpdates({
      price: formattedValue,
    });
  }

  function handleQuantityChange(e) {
    let newValue = Number(e.target.value);
    if (isNaN(newValue) || newValue < 1) {
      newValue = 1;
    }

    mergeProductUpdates({
      quantity: newValue,
    });
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

      mergeProductUpdates({
        id: res.id,
      });
    } catch (error) {
      console.error("Erro postProduct:", { error });
      alert(`Erro ao adicionar produto: ${error.message}`);
    } finally {
      stopLoading();
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <li className="produto-item">
      <Input
        ref={inputRef}
        type="text"
        value={productCode}
        onChange={(e) => handleCodigoChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAddItem();
          }
        }}
        placeholder="Código"
        fullWidth={false}
        variant="custom"
        className="codigo-input"
        disabled={isInputDisabled}
        data-index={idx}
      />
      <div className="flex items-center gap-2">
        <div className="w-40">
          <Input
            type="text"
            value={productPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            placeholder={zeroCurrency}
            fullWidth
            variant="custom"
            disabled={found}
            className="valor-input"
          />
        </div>

        {" × "}

        <div className="w-20">
          <Input
            title="Quantidade"
            type="number"
            min="1"
            inputMode="numeric"
            value={productQuantity?.toString()}
            onChange={handleQuantityChange}
            fullWidth
            variant="custom"
          />
        </div>

        <button
          onClick={handleAddItem}
          className="p-1 text-blue-500 hover:text-blue-700 "
          title="Adicionar nova peça"
        >
          <PlusIcon className="h-5 w-5 text-[#9b5c6f]" />
        </button>

        <button
          onClick={() => handleDeleteItem()}
          className="p-1 text-red-500 hover:text-red-700"
          title="Remover esta peça"
        >
          <TrashIcon className="h-5 w-5 text-[#9b5c6f]" />
        </button>

        {!found && (
          <button
            onClick={() => handleCreateProduct()}
            className="p-1 add-produto-btn"
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
      </div>
    </li>
  );
}
