import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl mb-4'>404 - Página Não Encontrada</h1>
      <Button onClick={() => navigate('/home')} className='bg-blue-500 text-white'>
        Voltar para Home
      </Button>
    </div>
  );
}

export default NotFound;
