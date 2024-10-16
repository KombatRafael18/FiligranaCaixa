import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideDrawer from '../components/SideDrawer';
import Button from '../components/Button';

function FechamentoVenda() {
    const [valores, setValores] = useState(Array(10).fill('R$00,00'));
    const [codigos, setCodigos] = useState(Array(10).fill(''));
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

    const handleCodigoChange = (index, value) => {
        const newCodigos = [...codigos];
        newCodigos[index] = value;
        setCodigos(newCodigos);
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
                            <div key={index} className='flex items-center mb-2'>
                                <span>{index + 1}</span>
                                <input 
                                    type="text" 
                                    className='mx-2 border-b' 
                                    value={codigos[index]}
                                    onChange={(e) => handleCodigoChange(index, e.target.value)}
                                    placeholder="Código"

                                />
                                <input 
                                    type="text" 
                                    className='ml-2 border-b w-24' 
                                    value={valor}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    placeholder={`R$00,00`} 
                                />
                            </div>
                        ))}
                    </div>
                    <div className='ml-10'>
                        <div className='mb-4'>
                            <label>CASHBACK</label>
                            <input 
                                type="text" 
                                className='border-b ml-2' 
                                value={cashback}
                                onChange={(e) => handleCashbackChange(e.target.value)}
                                placeholder={`R$00,00`} 
                            />
                        </div>
                        <div className='mb-4'>
                            <label>DESCONTO (%)</label>
                            <input 
                                type="text" 
                                className='border-b ml-2' 
                                value={desconto}
                                onChange={(e) => handleDescontoChange(e.target.value)}
                                placeholder={`0%`} 
                            />
                        </div>
                    </div>
                </div>
                <div className='mt-10'>
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
                    <div className='flex mt-4'>
                        <Button className='mr-2' onClick={handleCancel}>CANCELAR</Button>
                        <Button onClick={handleFinalizarCompra} className='bg-green-500 text-white'>FINALIZAR COMPRA</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
const handleFinalizarCompra = async () => {
    // Simulando uma chamada ao back-end
    setTimeout(() => {
        alert('Compra finalizada com sucesso!');
        // navigate('/home');
    }, 1000); // Simulando um atraso de 1 segundo
};

export default FechamentoVenda;