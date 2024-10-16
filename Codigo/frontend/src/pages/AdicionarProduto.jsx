import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

function AdicionarProduto() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialName = location.state?.name || '';

  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState('');

  const handleAdicionar = async () => {
    // Validações básicas
    if (!name || price === '') {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (isNaN(price) || parseFloat(price) < 0) {
      alert('O preço deve ser um número positivo.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price: parseFloat(price) }),
      });

      if (response.ok) {
        alert('Produto adicionado com sucesso!');
        navigate('/fechamento-venda');
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className='p-10'>
      <h1 className='text-2xl mb-4'>Adicionar Novo Produto</h1>
      <div className='mb-4'>
        <label className='block mb-1'>Código:</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Código do Produto"
          variant='custom'
        />
      </div>
      <div className='mb-4'>
        <label className='block mb-1'>Preço:</label>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Preço do Produto"
          variant='custom'
          min="0"
          step="0.01"
        />
      </div>
      <div className='flex'>
        <Button onClick={() => navigate('/fechamento-venda')} className='mr-2'>
          Cancelar
        </Button>
        <Button onClick={handleAdicionar} className='bg-green-500 text-white'>
          Adicionar Produto
        </Button>
      </div>
    </div>
  );
}

export default AdicionarProduto;
