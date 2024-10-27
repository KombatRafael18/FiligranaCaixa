import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Adicione esta importação

const SideDrawer = ({ isOpen }) => {
  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/api/login/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  

  return (
    <>
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#f6b9b6] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex flex-col h-full justify-between p-10">
          <div className="flex flex-col gap-8">
            <Link to="/home" className="mb-8 text-[#7d4b5f]">
              <h3>FILIGRANA</h3>
            </Link>
            <nav>
              <ul className="space-y-4">
                <li><Link to="/venda" className="block hover:text-[#9b5c6f]">NOVA VENDA</Link></li>
                <li><Link to="/cadastrar-cliente" className="block hover:text-[#9b5c6f]">CADASTRAR CLIENTE</Link></li>
                <li><Link to="/clientes" className="block hover:text-[#9b5c6f]">CLIENTES</Link></li>
                <li><Link to="/fechamento-de-caixa" className="block hover:text-[#9b5c6f]">FECHAR CAIXA</Link></li>
                <li><Link to="/painel-de-dados" className="block hover:text-[#9b5c6f]">PAINEL DE DADOS</Link></li>
              </ul>
            </nav>
          </div>
          <div>
            <ul className="space-y-4 py-12">
              <li><Link to="/" className="block hover:text-gray-700" onClick={handleLogout}>SAIR</Link></li>
              <li><Link to="/ajuda" className="block hover:text-gray-700">AJUDA</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
