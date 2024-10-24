import React, { useState, useEffect } from 'react';
import SideDrawer from '../components/SideDrawer'; 
import './Clientes.css'; 

const API_URL = "http://localhost:3000/api/clients"; 

function Clientes() {
  const [clients, setClients] = useState([]);
  const [editingClientId, setEditingClientId] = useState(null);
  const [editedClient, setEditedClient] = useState({});

  const fetchClients = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedClient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const startEditing = (client) => {
    setEditingClientId(client.ID); 
    setEditedClient(client); 
  };

  const saveClient = async (id) => {
    try {
      const editedClientToSave = {
        cpf: editedClient.CPF,         
        name: editedClient.NAME,
        email: editedClient.EMAIL,
        address: editedClient.ADDRESS,
        phone: editedClient.PHONE,
        cashback: parseFloat(editedClient.CASHBACK) || 0,  
      };

      console.log("Dados enviados ao backend:", editedClientToSave);

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedClientToSave),
      });

      if (response.ok) {
        await fetchClients();  
        setEditingClientId(null);
        setEditedClient({}); 
      } else {
        console.error("Erro ao salvar cliente:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  };

  const deleteClient = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClients(clients.filter((client) => client.ID !== id));
      } else {
        console.error("Erro ao deletar cliente:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    }
  };

  return (
    <div className="container">
      <SideDrawer isOpen={true} />
      <div className="content ml-[250px] p-10">
        <h1 className="text-3xl font-bold mb-4">Clientes</h1>

        <table className="client-table w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">CPF</th>
              <th className="border p-2">Nome</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Endereço</th>
              <th className="border p-2">Telefone</th>
              <th className="border p-2">Cashback</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.ID}>
                  <td className="border p-2">{client.ID}</td>
                  <td className="border p-2">
                    {editingClientId === client.ID ? (
                      <input
                        type="text"
                        name="CPF"
                        value={editedClient.CPF || ''}
                        onChange={handleEditChange}
                        className="border p-1"
                      />
                    ) : (
                      client.CPF
                    )}
                  </td>
                  <td className="border p-2">
                    {editingClientId === client.ID ? (
                      <input
                        type="text"
                        name="NAME"
                        value={editedClient.NAME || ''}
                        onChange={handleEditChange}
                        className="border p-1"
                      />
                    ) : (
                      client.NAME
                    )}
                  </td>
                  <td className="border p-2">
                    {editingClientId === client.ID ? (
                      <input
                        type="email"
                        name="EMAIL"
                        value={editedClient.EMAIL || ''}
                        onChange={handleEditChange}
                        className="border p-1"
                      />
                    ) : (
                      client.EMAIL
                    )}
                  </td>
                  <td className="border p-2">
                    {editingClientId === client.ID ? (
                      <input
                        type="text"
                        name="ADDRESS"
                        value={editedClient.ADDRESS || ''}
                        onChange={handleEditChange}
                        className="border p-1"
                      />
                    ) : (
                      client.ADDRESS
                    )}
                  </td>
                  <td className="border p-2">
                    {editingClientId === client.ID ? (
                      <input
                        type="text"
                        name="PHONE"
                        value={editedClient.PHONE || ''}
                        onChange={handleEditChange}
                        className="border p-1"
                      />
                    ) : (
                      client.PHONE
                    )}
                  </td>
                  <td className="border p-2">
                    {editingClientId === client.ID ? (
                      <input
                        type="text"
                        name="CASHBACK"
                        value={editedClient.CASHBACK || ''}
                        onChange={handleEditChange}
                        className="border p-1"
                      />
                    ) : (
                      client.CASHBACK
                    )}
                  </td>
                  <td className="border p-2">
                    {editingClientId === client.ID ? (
                      <>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => saveClient(client.ID)}
                        >
                          Salvar
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => setEditingClientId(null)}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => startEditing(client)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => deleteClient(client.ID)}
                        >
                          Deletar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clientes;
