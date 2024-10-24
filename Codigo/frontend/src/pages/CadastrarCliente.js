import React, { useState } from 'react';
import SideDrawer from '../components/SideDrawer'; 

function CadastrarCliente() {
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const client = { cpf, name, email, address, phone };

    fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao cadastrar cliente: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then(() => {
        setCpf('');
        setName('');
        setEmail('');
        setAddress('');
        setPhone('');
        alert("Cliente cadastrado com sucesso!");
      })
      .catch(error => console.error('Erro ao cadastrar cliente:', error));
  };

  return (
    <div className="container">
      <SideDrawer isOpen={true} /> 
      
      <div className="content ml-[250px] p-10"> 
        <h1 className="text-4xl font-bold mb-4 text-[#7d4b5f]">Cadastrar Cliente</h1>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-lg mb-2 text-[#7d4b5f]">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="border border-[#7d4b5f] p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2 text-[#7d4b5f]">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-[#7d4b5f] p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2 text-[#7d4b5f]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[#7d4b5f] p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2 text-[#7d4b5f]">Endereço</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-[#7d4b5f] p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2 text-[#7d4b5f]">Telefone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-[#7d4b5f] p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-[#7d4b5f] text-white px-4 py-2 rounded"
          >
            Adicionar Cliente
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastrarCliente;
