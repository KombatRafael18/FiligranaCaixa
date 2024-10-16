// FechamentoVenda.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SideDrawer from '../components/SideDrawer';
import Button from '../components/Button';
import Input from '../components/Input';
import { PlusIcon } from '@heroicons/react/24/solid';
import debounce from 'lodash/debounce';

function FechamentoVenda() {
  const [valores, setValores] = useState(Array(9).fill('R$00,00'));
  const [codigos, setCodigos] = useState(Array(9).fill(''));
  const [codigoEncontrado, setCodigoEncontrado] = useState(Array(9).fill(true));
  const [carregando, setCarregando] = useState(Array(9).fill(false));
  const [desconto, setDesconto] = useState('');
  const [cashback, setCashback] = useState('');
  const [valorTotal, setValorTotal] = useState('R$00,00');
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    calcularValorTotal();
  }, [valores, desconto, cashback]);

  // Função para verificar o código do produto
  const verificarCodigo = async (index, codigo) => {
    if (codigo === "") {
      updateValue(index, 'R$00,00');
      updateCodigoEncontrado(index, true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/products/name/${encodeURIComponent(codigo)}`);

      if (response.ok) {
        const product = await response.json();
        updateValue(index, formatCurrency(product.price * 100)); // Assumindo que o preço está em reais
        updateCodigoEncontrado(index, true);
      } else if (response.status === 404) {
        // Produto não encontrado, mostrar o símbolo de "+"
        updateCodigoEncontrado(index, false);
        updateValue(index, 'R$00,00');
      } else {
        alert('Erro ao verificar o código do produto.');
        updateCodigoEncontrado(index, true);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
      updateCodigoEncontrado(index, true);
    } finally {
      // Finalizar o carregamento
      const updatedCarregando = [...carregando];
      updatedCarregando[index] = false;
      setCarregando(updatedCarregando);
    }
  };

  // Função de debounce para evitar chamadas excessivas ao backend
  const debouncedVerificarCodigo = useCallback(debounce(verificarCodigo, 500), [carregando]);

  const handleCodigoChange = (index, value) => {
    const trimmedValue = value.trim();
    const newCodigos = [...codigos];
    newCodigos[index] = trimmedValue;
    setCodigos(newCodigos);

    if (trimmedValue === "") {
      updateValue(index, 'R$00,00');
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

  const handleInputChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue === '') {
      updateValue(index, 'R$00,00');
    } else {
      const formattedValue = formatCurrency(numericValue);
      updateValue(index, formattedValue);
    }
  };

  const handleDescontoChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '' || parseInt(numericValue) > 100) {
      setDesconto('');
    } else {
      setDesconto(numericValue);
    }
  };

  const handleCashbackChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setCashback(numericValue);
  };

  const updateValue = (index, newValue) => {
    const newValores = [...valores];
    newValores[index] = newValue;
    setValores(newValores);
  };

  const updateCodigoEncontrado = (index, encontrado) => {
    const newCodigoEncontrado = [...codigoEncontrado];
    newCodigoEncontrado[index] = encontrado;
    setCodigoEncontrado(newCodigoEncontrado);
  };

  const formatCurrency = (value) => {
    const number = parseFloat(value) / 100;
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const calcularValorTotal = () => {
    const somaPecas = valores.reduce((acc, valor) => {
      const numero = parseFloat(valor.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
      return acc + numero;
    }, 0);

    const descontoValor = (somaPecas * (parseFloat(desconto) || 0)) / 100;
    const cashbackValor = parseFloat(cashback) || 0;

    const total = somaPecas - descontoValor - cashbackValor;
    setValorTotal(formatCurrency(total * 100));
  };

  const handleCancel = () => {
    navigate('/home');
  };

  const handleFinalizarCompra = async () => {
    if (!metodoPagamento) {
      alert('Por favor, selecione um método de pagamento.');
      return;
    }

    const produtos = codigos.map((codigo, index) => ({
      codigo,
      valor: valores[index],
    })).filter(produto => produto.codigo && produto.valor !== 'R$00,00');

    if (produtos.length === 0) {
      alert('Por favor, adicione pelo menos um produto.');
      return;
    }

    // Verificar se existem códigos inválidos
    const invalidCodes = codigos.filter((codigo, index) => codigo && !codigoEncontrado[index]);
    if (invalidCodes.length > 0) {
      alert('Existem códigos de produtos inválidos. Por favor, adicione os produtos ou remova os códigos inválidos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/finalizar-compra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total: valorTotal,
          metodoPagamento,
          valores: produtos,
        }),
      });

      if (response.ok) {
        alert('Compra finalizada com sucesso!');
        navigate('/home');
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error || 'Erro ao finalizar a compra.'}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  const handleMetodoPagamento = (metodo) => {
    setMetodoPagamento(metodo);
  };

  const handleAdicionarProduto = async (index) => {
    const codigo = codigos[index];
    const valorString = valores[index].replace(/[^\d,]/g, '').replace(',', '.'); 
    const valor = parseFloat(valorString);
    
    if (!codigo || isNaN(valor) || valor <= 0) {
        alert('Por favor, insira um código válido e um preço positivo.');
        return;
      }
    
    const produto = {
      name: codigo,
      price: valor,
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
      });
  
      if (response.ok) {
        alert('Produto adicionado com sucesso!');
        fetchProducts();
        // Opcional: Atualize a interface para refletir que o produto foi adicionado
      } else {
        const errorData = await response.json();
        alert(`Erro ao adicionar produto: ${errorData.error || 'Erro desconhecido.'}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      const produtos = await response.json();
  
      // Atualizar os valores e códigos com os dados mais recentes, mantendo os campos vazios
      const novosValores = [...valores]; // Copia o estado atual
      const novosCodigos = [...codigos]; // Copia o estado atual
  
      produtos.forEach((produto, index) => {
        if (novosCodigos[index] !== '') { // Mantém o que já está preenchido
          novosValores[index] = formatCurrency(produto.price * 100);
          novosCodigos[index] = produto.name;
        }
      });
  
      setValores(novosValores);
      setCodigos(novosCodigos);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      alert('Erro ao buscar produtos.');
    }
  };

  return (
    <div className='flex h-screen'>
      <SideDrawer isOpen={true} />
      <div className='flex flex-col ml-[250px] p-10 flex-grow'>
        <h1 className='text-2xl mb-4'>FECHAMENTO DE VENDA</h1>
        <div className='flex'>
          <div className='flex-grow'>
            <h2>PEÇAS:</h2>
            {valores.map((valor, index) => (
              <div key={index} className='flex items-center mb-2 gap-4'>
                <span className='text-lg'>{index + 1}</span>
                <Input
                  type="text"
                  value={codigos[index]}
                  onChange={(e) => handleCodigoChange(index, e.target.value)}
                  placeholder={`Código`}
                  variant='custom'
                />
                <div className='flex items-center'>
                  <Input
                    type="text"
                    value={valor}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={`R$00,00`}
                    variant='custom'
                    readOnly
                  />
                  {!codigoEncontrado[index] && (
                    <button
                      onClick={() => handleAdicionarProduto(index)}
                      className='ml-2 text-green-500 hover:text-green-700'
                      title="Adicionar Produto"
                      disabled={carregando[index]} 
                    >
                      {carregando[index] ? (
                        <svg className="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                      ) : (
                        <PlusIcon className='h-5 w-5' />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className='ml-10'>
            <div className='mb-4 flex items-center'>
              <label className='w-24'>CASHBACK</label>
              <Input
                type="text"
                value={cashback}
                onChange={(e) => handleCashbackChange(e.target.value)}
                placeholder={`R$00,00`}
                variant='custom'
              />
            </div>
            <div className='mb-4 flex items-center'>
              <label className='w-24'>DESCONTO (%)</label>
              <Input
                type="text"
                value={desconto}
                onChange={(e) => handleDescontoChange(e.target.value)}
                placeholder={`0%`}
                variant='custom'
              />
            </div>
          </div>
        </div>
        <div>
          <div className='flex mt-4'>
            <Button
              className={`mr-2 ${metodoPagamento === 'DINHEIRO' ? 'bg-blue-500' : ''}`}
              onClick={() => handleMetodoPagamento('DINHEIRO')}
            >
              DINHEIRO
            </Button>
            <Button
              className={`mr-2 ${metodoPagamento === 'PIX' ? 'bg-blue-500' : ''}`}
              onClick={() => handleMetodoPagamento('PIX')}
            >
              PIX
            </Button>
            <Button
              className={`${metodoPagamento === 'CARTÃO' ? 'bg-blue-500' : ''}`}
              onClick={() => handleMetodoPagamento('CARTÃO')}
            >
              CARTÃO
            </Button>
          </div>
          <h2 className='mt-4'>VALOR TOTAL: {valorTotal}</h2>
          <div className='flex mt-4 pb-8'>
            <Button className='mr-2' onClick={handleCancel}>CANCELAR</Button>
            <Button onClick={handleFinalizarCompra} className='bg-green-500 text-white'>FINALIZAR COMPRA</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FechamentoVenda;
