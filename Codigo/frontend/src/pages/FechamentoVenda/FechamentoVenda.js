import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideDrawer from "../../components/SideDrawer";
import Button from "../../components/Button";
import Input from "../../components/Input";
import "./FechamentoVenda.css";
import { getApiOrigin } from "../../services/filigranaapi/config";
import { ProductList } from "./subcomponents/ProductList";

function FechamentoVenda() {
  // Declaração de estados para armazenar os valores e códigos dos produtos, status de carregamento, etc.
  const [valores, setValores] = useState(Array(1).fill("R$00,00")); // Valores de cada produto (preenchidos inicialmente com R$00,00)
  const [codigos, setCodigos] = useState(Array(1).fill("")); // Códigos dos produtos
  const [codigoEncontrado, setCodigoEncontrado] = useState(Array(9).fill(true)); // Flag para indicar se o código foi encontrado no servidor
  const [products, setProducts] = useState([]);
  const [desconto, setDesconto] = useState(""); // Desconto aplicado
  const [cashback, setCashback] = useState(""); // Cashback a ser aplicado
  const [valorTotal, setValorTotal] = useState("R$00,00"); // Valor total da venda
  const [metodoPagamento, setMetodoPagamento] = useState(""); // Método de pagamento selecionado
  const navigate = useNavigate(); // Hook para navegação entre rotas
  const location = useLocation();
  const clientData = location.state?.clientData;
  const sellType = location.state?.sellType;

  // Atualiza os valores dos produtos ao carregar códigos ou ao alterar desconto/cashback
  useEffect(() => {
    const fetchProductValues = async () => {
      const fetchPromises = codigos
        .map((codigo, index) => {
          if (codigo && codigo !== "0") {
            return fetch(`${getApiOrigin()}/api/products/name/${codigo}`)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(
                    `Erro ao buscar produto com código ${codigo}`
                  );
                }
                return response.json();
              })
              .then((product) => {
                setValores((prevValores) => {
                  const newValores = [...prevValores];
                  newValores[index] = formatCurrency(product.price * 100);
                  return newValores;
                });
              })
              .catch((error) => {
                console.error(error);
              });
          }
          return null;
        })
        .filter(Boolean);

      await Promise.all(fetchPromises);
    };

    fetchProductValues();
  }, [codigos]);

  // Calcula o valor total quando os valores, desconto ou cashback mudam
  useEffect(() => {
    calcularValorTotal();
  }, [valores, desconto, cashback]);

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

  // Formata um valor para a moeda brasileira
  const formatCurrency = (value) => {
    const number = parseFloat(value) / 100;
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Calcula o valor total considerando desconto e cashback
  const calcularValorTotal = () => {
    const somaPecas = valores.reduce((acc, valor) => {
      const numero =
        parseFloat(valor.replace(/[^\d,-]/g, "").replace(",", ".")) || 0;
      return acc + numero;
    }, 0);

    const descontoValor = (somaPecas * (parseFloat(desconto) || 0)) / 100;
    const cashbackValor = parseFloat(cashback) || 0;

    const total = somaPecas - descontoValor - cashbackValor;
    setValorTotal(formatCurrency(total * 100));
  };

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

    const produtos = codigos
      .map((codigo, index) => {
        const valorString = valores[index]
          .replace(/[^\d,]/g, "")
          .replace(",", ".");
        const valorDouble = parseFloat(valorString);
        return {
          codigo,
          valor: valorDouble,
        };
      })
      .filter((produto) => produto.codigo && produto.valor > 0);

    // console.log(produtos);

    if (produtos.length === 0) {
      alert("Por favor, adicione pelo menos um produto.");
      return;
    }

    // Verificar se existem códigos inválidos
    const invalidCodes = codigos.filter(
      (codigo, index) => codigo && !codigoEncontrado[index]
    );
    if (invalidCodes.length > 0) {
      alert(
        "Existem códigos de produtos inválidos. Por favor, adicione os produtos ou remova os códigos inválidos."
      );
      return;
    }

    const valorTotalDouble = parseFloat(
      valorTotal.replace(/[^\d,-]/g, "").replace(",", ".")
    );

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
