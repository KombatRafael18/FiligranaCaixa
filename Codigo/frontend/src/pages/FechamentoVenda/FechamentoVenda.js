import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideDrawer from "../../components/SideDrawer";
import Button from "../../components/Button";
import Input from "../../components/Input";
import "./FechamentoVenda.css";
import { getApiOrigin } from "../../services/filigranaapi/config";
import { formatBrazilianCurrency } from "../../utils/currencyFormatter";
import { ProductList } from "./subcomponents/ProductList";

function FechamentoVenda() {
  // Declaração de estados para armazenar os valores e códigos dos produtos, status de carregamento, etc.
  const [products, setProducts] = useState([]);
  const [desconto, setDesconto] = useState(""); // Desconto aplicado
  const [cashback, setCashback] = useState(""); // Cashback a ser aplicado
  const [metodoPagamento, setMetodoPagamento] = useState(""); // Método de pagamento selecionado
  const navigate = useNavigate(); // Hook para navegação entre rotas
  const location = useLocation();
  const clientData = location.state?.clientData;
  const sellType = location.state?.sellType;

  // Valor total da venda
  // Calcula o valor total quando os valores, desconto ou cashback mudam
  const valorTotalDouble = calcularValorTotal();
  const valorTotal = formatBrazilianCurrency(valorTotalDouble);
  console.debug("Valor total:", valorTotalDouble, valorTotal);

  // Manipula a entrada de desconto, limitando a 100%
  const handleDescontoChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "" || parseInt(numericValue) > 100) {
      setDesconto("");
    } else {
      setDesconto(numericValue);
    }
  };

  // Manipula a entrada de cashback
  const handleCashbackChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setCashback(numericValue);
  };

  // Calcula o valor total considerando desconto e cashback
  function calcularValorTotal() {
    const somaPecas = products
      .map((p) => p.price)
      .reduce((acc, valor) => {
        const numero =
          parseFloat(valor.replace(/[^\d,-]/g, "").replace(",", ".")) || 0;
        return acc + numero;
      }, 0);

    const descontoValor = (somaPecas * (parseFloat(desconto) || 0)) / 100;
    const cashbackValor = parseFloat(cashback) || 0;

    const total = somaPecas - descontoValor - cashbackValor;
    return total;
  }

  // Função para cancelar e voltar para a página inicial
  const handleCancel = () => {
    navigate("/home");
  };

  // Finaliza a compra, verificando pré-condições e enviando dados para a API
  const handleFinalizarCompra = async () => {
    if (!metodoPagamento) {
      alert("Por favor, selecione um método de pagamento.");
      return;
    }

    const produtos = products
      .map((p) => {
        const valorString = p.price.replace(/[^\d,]/g, "").replace(",", ".");
        const valorDouble = parseFloat(valorString);
        return {
          codigo: p.code,
          valor: valorDouble,
          quantity: p.quantity,
        };
      })
      .filter((produto) => produto.codigo && produto.valor > 0);

    // console.log(produtos);

    if (produtos.length === 0) {
      alert("Por favor, adicione pelo menos um produto.");
      return;
    }

    // Verificar se existem códigos inválidos
    const invalidCodes = products.filter((product) => !product.id);
    if (invalidCodes.length > 0) {
      alert(
        "Existem códigos de produtos inválidos. Por favor, adicione os produtos ou remova os códigos inválidos."
      );
      return;
    }

    const discountNumber = (parseFloat(desconto) || 0) / 100;
    const cashbackNumber = parseFloat(cashback) || 0;

    try {
      const response = await fetch(
        `${getApiOrigin()}/api/sales/finalizar-compra`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: clientData ? clientData.ID : null,
            total_amount: valorTotalDouble,
            discount: discountNumber,
            cashback: cashbackNumber,
            sale_type: sellType,
            payment_method: metodoPagamento,
            sale_date: new Date(),
            products: produtos,
          }),
        }
      );

      if (response.ok) {
        alert("Compra finalizada com sucesso!");
        navigate("/home");
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error || "Erro ao finalizar a compra."}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleMetodoPagamento = (metodo) => {
    setMetodoPagamento(metodo);
  };

  useEffect(() => {
    if (clientData) {
      console.log("Dados do cliente:", clientData.NAME);
      console.log("Tipo de venda:", sellType);
    }
  }, [clientData]);

  return (
    <div className="container-fechamento-venda">
      <SideDrawer isOpen={true} />
      <div className="container-content">
        <h1 className="title-page">
          FECHAMENTO DE VENDA {sellType ? " - " + sellType.toUpperCase() : ""}{" "}
          {clientData ? " - " + clientData.NAME : ""}
        </h1>
        <div className="section-produtos">
          <div className="lista-produtos">
            <h2>PEÇAS:</h2>
            <ProductList products={products} setProducts={setProducts} />
          </div>
          <div className="section-pagamento">
            <div className="input-group">
              <label>CASHBACK</label>
              <Input
                type="text"
                value={cashback}
                onChange={(e) => handleCashbackChange(e.target.value)}
                placeholder={`R$00,00`}
                variant="custom"
                className="cashback-input"
              />
            </div>
            <div className="input-group">
              <label>DESCONTO (%)</label>
              <Input
                type="text"
                value={desconto}
                onChange={(e) => handleDescontoChange(e.target.value)}
                placeholder={`0%`}
                variant="custom"
                className="desconto-input"
              />
            </div>
          </div>
        </div>
        <div className="container-right">
          <div className="align-container">
            <div className="flex mt-4">
              <Button
                className={`metodo-pagamento-btn ${
                  metodoPagamento === "DINHEIRO" ? "selected" : ""
                }`}
                onClick={() => handleMetodoPagamento("DINHEIRO")}
              >
                DINHEIRO
              </Button>
              <Button
                className={`metodo-pagamento-btn ${
                  metodoPagamento === "PIX" ? "selected" : ""
                }`}
                onClick={() => handleMetodoPagamento("PIX")}
              >
                PIX
              </Button>
              <Button
                className={`metodo-pagamento-btn ${
                  metodoPagamento === "CRÉDITO" ? "selected" : ""
                }`}
                onClick={() => handleMetodoPagamento("CRÉDITO")}
              >
                CRÉDITO
              </Button>
              <Button
                className={`metodo-pagamento-btn ${
                  metodoPagamento === "DÉBITO" ? "selected" : ""
                }`}
                onClick={() => handleMetodoPagamento("DÉBITO")}
              >
                DÉBITO
              </Button>
              <Button
                className={`metodo-pagamento-btn ${
                  metodoPagamento === "QR PIX" ? "selected" : ""
                }`}
                onClick={() => handleMetodoPagamento("QR PIX")}
              >
                QR PIX
              </Button>
              <Button
                className={`metodo-pagamento-btn ${
                  metodoPagamento === "PROMISSORIA" ? "selected" : ""
                }`}
                onClick={() => handleMetodoPagamento("PROMISSORIA")}
              >
                PROMISSORIA
              </Button>
            </div>
            <h2 className="valor-total">VALOR TOTAL: {valorTotal}</h2>
            <div className="container-botoes">
              <div className="acao-botoes">
                <Button className="cancelar-btn" onClick={handleCancel}>
                  CANCELAR
                </Button>
                <Button
                  className="finalizar-btn"
                  onClick={handleFinalizarCompra}
                >
                  FINALIZAR COMPRA
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FechamentoVenda;
