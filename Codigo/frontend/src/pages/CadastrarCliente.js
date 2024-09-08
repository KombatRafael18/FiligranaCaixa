import React, { useState, useEffect } from 'react';

function CadastrarCliente() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    // Fetch clients from API
    fetch('/api/clients')
      .then(response => response.json())
      .then(data => setClients(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const client = { name, email, address, phone };

    const method = editingClient ? 'PUT' : 'POST';
    const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    })
      .then(response => response.json())
      .then(() => {
        setName('');
        setEmail('');
        setAddress('');
        setPhone('');
        setEditingClient(null);
        fetch('/api/clients')
          .then(response => response.json())
          .then(data => setClients(data));
      });
  };

  const handleDelete = (id) => {
    fetch(`/api/clients/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setClients(clients.filter(client => client.id !== id));
      });
  };

  const handleEdit = (client) => {
    setName(client.name);
    setEmail(client.email);
    setAddress(client.address);
    setPhone(client.phone);
    setEditingClient(client);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-[#7d4b5f]">
        {editingClient ? 'Editar Cliente' : 'Cadastrar Cliente'}
      </h1>
      
      <form onSubmit={handleSubmit} className="mb-4">
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
          {editingClient ? 'Atualizar Cliente' : 'Adicionar Cliente'}
        </button>
      </form>

      <h2 className="text-3xl font-bold mb-4 text-[#7d4b5f]">Lista de Clientes</h2>
      <ul>
        {clients.map(client => (
          <li key={client.id} className="mb-2">
            <span className="text-lg">{client.name} - {client.email}</span>
            <button
              onClick={() => handleEdit(client)}
              className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(client.id)}
              className="bg-red-500 text-white px-2 py-1 rounded ml-2"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CadastrarCliente;
