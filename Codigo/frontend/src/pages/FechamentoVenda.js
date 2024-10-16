import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideDrawer from '../components/SideDrawer';
import Button from '../components/Button';
import Input from '../components/Input';
import { PlusIcon } from '@heroicons/react/solid';

function FechamentoVenda() {
    const [valores, setValores] = useState(Array(9).fill('R$00,00'));
    const [codigos, setCodigos] = useState(Array(9).fill(''));
    const [codigoEncontrado, setCodigoEncontrado] = useState(Array(9).fill(true));
    const [desconto, setDesconto] = useState('');
    const [cashback, setCashback] = useState('');
    const [valorTotal, setValorTotal] = useState('R$00,00');
    const [metodoPagamento, setMetodoPagamento] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        calcularValorTotal();
    }, [valores, desconto, cashback]);

    const handleInputChange = (index, value) => {
        const numericValue = value.replace(/[^0-9]/g, '');

        if (numericValue === '') {
            updateValue(index, 'R$00,00');
        } else {
            const formattedValue = formatCurrency(numericValue);
            updateValue(index, formattedValue);
        }
    };

    const handleCodigoChange = async (index, value) => {
        const trimmedValue = value.trim();
        const newCodigos = [...codigos];
        newCodigos[index] = value.trim();
        setCodigos(newCodigos);

        if (value.trim() === "") {
            updateValue(index, 'R$00,00');
            return;
          }

          try {
            const response = await fetch(`http://localhost:3000/api/products/name/${encodeURIComponent(value.trim())}`);
        
            if (response.ok) {
              const product = await response.json();
              updateValue(index, formatCurrency(product.price * 100));
            } else if (response.status === 404) {
              
              const adicionar = window.confirm(`Código "${value.trim()}" não encontrado. Deseja adicionar um novo produto?`);
              if (adicionar) {
                
                navigate('/adicionar-produto', { state: { name: value.trim() } });
              }
              updateValue(index, 'R$00,00');
            } else {
              alert('Erro ao verificar o código do produto.');
            }
          } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor.');
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
        try {
            const response = await fetch('https://seu-backend.com/api/finalizar-compra', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    total: valorTotal,
                    metodoPagamento,
                    valores: codigos.map((codigo, index) => ({
                        codigo,
                        valor: valores[index],
                    })),
                }),
            });

            if (response.ok) {
                alert('Compra finalizada com sucesso!');
                navigate('/home');
            } else {
                alert('Erro ao finalizar a compra.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor.');
        }
    };

    const handleMetodoPagamento = (metodo) => {
        setMetodoPagamento(metodo);
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
                                <Input
                                    type="text"
                                    value={valor}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    placeholder={`R$00,00`}
                                    variant='custom'
                                />
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
