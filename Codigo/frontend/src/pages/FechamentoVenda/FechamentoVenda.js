import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideDrawer from "../../components/SideDrawer";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import debounce from "lodash/debounce";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import "./FechamentoVenda.css";

function FechamentoVenda() {
  // Declaração de estados para armazenar os valores e códigos dos produtos, status de carregamento, etc.
  const [valores, setValores] = useState(Array(1).fill("R$00,00")); // Valores de cada produto (preenchidos inicialmente com R$00,00)
  const [codigos, setCodigos] = useState(Array(1).fill("")); // Códigos dos produtos
  const [codigoEncontrado, setCodigoEncontrado] = useState(Array(9).fill(true)); // Flag para indicar se o código foi encontrado no servidor
  const [carregando, setCarregando] = useState(Array(9).fill(false)); // Status de carregamento por produto
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
            return fetch(`http://localhost:3000/api/products/name/${codigo}`)
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

  // Função para verificar o código do produto
  const verificarCodigo = async (index, codigo) => {
    if (codigo === "") {
      updateValue(index, "R$00,00"); // Define o valor padrão se o código estiver vazio
      updateCodigoEncontrado(index, true); // Marca como encontrado para não mostrar o ícone de "+", etc.
      return;
    }

    try {
      // Busca o código do produto na API
      const response = await fetch(
        `http://localhost:3000/api/products/name/${encodeURIComponent(codigo)}`
      );

      if (response.ok) {
        const product = await response.json();
        updateValue(index, formatCurrency(product.price * 100)); // Assumindo que o preço está em reais
        updateCodigoEncontrado(index, true);
      } else if (response.status === 404) {
        // Produto não encontrado, mostrar o símbolo de "+"
        updateCodigoEncontrado(index, false);
        updateValue(index, "R$00,00");
      } else {
        alert("Erro ao verificar o código do produto.");
        updateCodigoEncontrado(index, true);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
      updateCodigoEncontrado(index, true);
    } finally {
      // Finalizar o carregamento
      const updatedCarregando = [...carregando];
      updatedCarregando[index] = false;
      setCarregando(updatedCarregando);
    }
  };

  // Função de debounce para evitar chamadas excessivas ao backend
  const debouncedVerificarCodigo = useCallback(debounce(verificarCodigo, 500), [
    carregando,
  ]);

  // Manipula a mudança de código e chama a função de debounce
  const handleCodigoChange = (index, value) => {
    const trimmedValue = value.trim();
    const newCodigos = [...codigos];
    newCodigos[index] = trimmedValue;
    setCodigos(newCodigos);

    if (trimmedValue === "") {
      updateValue(index, "R$00,00");
      updateCodigoEncontrado(index, true);
      return;
    }

    // Iniciar o carregamento
    const newCarregando = [...carregando];
    newCarregando[index] = true;
    setCarregando(newCarregando);

    // Chamar a função de debounce
    debouncedVerificarCodigo(index, trimmedValue);
  };

  // Manipula a entrada de valores, formatando como moeda
  const handleInputChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "") {
      updateValue(index, "R$00,00");
    } else {
      const formattedValue = formatCurrency(numericValue);
      updateValue(index, formattedValue);
    }
  };

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

  // Atualiza o valor do produto em um índice específico
  const updateValue = (index, newValue) => {
    const newValores = [...valores];
    newValores[index] = newValue;
    setValores(newValores);
  };

  // Atualiza o status de código encontrado
  const updateCodigoEncontrado = (index, encontrado) => {
    const newCodigoEncontrado = [...codigoEncontrado];
    newCodigoEncontrado[index] = encontrado;
    setCodigoEncontrado(newCodigoEncontrado);
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
        "http://localhost:3000/api/sales/finalizar-compra",
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

  const handleAdicionarProduto = async (index) => {
    const codigo = codigos[index];
    const valorString = valores[index].replace(/[^\d,]/g, "").replace(",", ".");
    const valor = parseFloat(valorString);

    if (!codigo || isNaN(valor) || valor <= 0) {
      alert("Por favor, insira um código válido e um preço positivo.");
      return;
    }

    const produto = {
      name: codigo,
      price: valor,
    };

    try {
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });

      if (response.ok) {
        alert("Produto adicionado com sucesso!");

        // Atualizar o valor e manter os produtos existentes
        const newValores = [...valores]; // Crie uma nova cópia do estado valores
        newValores[index] = formatCurrency(valor * 100); // Atualiza o valor do produto adicionado
        setValores(newValores); // Atualiza o estado com os novos valores

        const newCodigos = [...codigos]; // Crie uma nova cópia do estado codigos
        newCodigos[index] = codigo; // Assegura que o código seja mantido
        setCodigos(newCodigos); // Atualiza o estado com os novos códigos

        // Você pode querer chamar outras funções para atualizar o estado, se necessário
        updateCodigoEncontrado(index, true); // Atualiza o status de encontrado
      } else {
        const errorData = await response.json();
        alert(
          `Erro ao adicionar produto: ${
            errorData.error || "Erro desconhecido."
          }`
        );
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleAdicionarCampo = () => {
    setValores([...valores, "R$00,00"]);
    setCodigos([...codigos, ""]);
    setCodigoEncontrado([...codigoEncontrado, true]);
    setCarregando([...carregando, false]);
  };

  const handleDeletarCampo = (index) => {
    if (valores.length > 1) {
      setValores(valores.filter((_, i) => i !== index));
      setCodigos(codigos.filter((_, i) => i !== index));
      setCodigoEncontrado(codigoEncontrado.filter((_, i) => i !== index));
      setCarregando(carregando.filter((_, i) => i !== index));
    }
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
            {valores.map((valor, index) => (
              <div key={index} className="produto-item">
                <span>{index + 1}</span>
                <Input
                  type="text"
                  value={codigos[index]}
                  onChange={(e) => handleCodigoChange(index, e.target.value)}
                  placeholder={`Código`}
                  variant="custom"
                  className="codigo-input"
                />
                <div className="flex items-center">
                  <Input
                    type="text"
                    value={valor}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={`R$00,00`}
                    variant="custom"
                    readOnly
                    className="valor-input"
                  />
                  <button
                    onClick={handleAdicionarCampo}
                    className="ml-6 text-blue-500 hover:text-blue-700 "
                    title="Adicionar Campo"
                  >
                    <PlusIcon className="h-5 w-5 text-[#9b5c6f]" />
                  </button>

                  <button
                    onClick={() => handleDeletarCampo(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    title="Deletar Campo"
                  >
                    <TrashIcon className="h-5 w-5 text-[#9b5c6f]" />
                  </button>

                  {!codigoEncontrado[index] && (
                    <button
                      onClick={() => handleAdicionarProduto(index)}
                      className="add-produto-btn"
                      title="Adicionar Produto"
                      disabled={carregando[index]}
                    >
                      {carregando[index] ? (
                        <svg
                          className="spinner"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                      ) : (
                        <ArrowUpTrayIcon className="h-5 w-5 text-[#9b5c6f]" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
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
                  metodoPagamento === "CARTÃO" ? "selected" : ""
                }`}
                onClick={() => handleMetodoPagamento("CARTÃO")}
              >
                CARTÃO
              </Button>
            </div>
            <h2 className="valor-total">VALOR TOTAL: {valorTotal}</h2>
            <div className="acao-botoes">
              <Button className="cancelar-btn" onClick={handleCancel}>
                CANCELAR
              </Button>
              <Button className="finalizar-btn" onClick={handleFinalizarCompra}>
                FINALIZAR COMPRA
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FechamentoVenda;
