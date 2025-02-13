import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import SideDrawer from "../../components/SideDrawer";
import "./Clientes.css";
import { getApiOrigin } from "../../services/filigranaapi/config";

const API_URL = `${getApiOrigin()}/api/clients`;

function Clientes() {
  const [clients, setClients] = useState([]);
  const [editingClientId, setEditingClientId] = useState(null);
  const [editedClient, setEditedClient] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientSales, setSelectedClientSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const filteredClients = clients.filter((client) =>
    normalizeText(client.NAME.toLowerCase()).includes(
      normalizeText(searchTerm.toLowerCase())
    )
  );

  const handleNavigateToCadastro = () => {
    navigate("/cadastrar-cliente");
  };

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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
        method: "DELETE",
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

  const showSales = async (id) => {
    try {
      const response = await fetch(`${getApiOrigin()}/api/sales/cliente/${id}`);
      const data = await response.json();
      console.log(data);
      setSelectedClientSales(data);
      setIsModalOpen(true); // Abre o modal
    } catch (error) {
      console.error("Erro ao buscar compras:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClientSales([]);
  };

  return (
    <div className="container">
      <SideDrawer isOpen={true} />
      <div className="content ml-[250px] p-10">
        <h1 className="text-3xl font-bold mb-4">Clientes</h1>

        <div
          className="flex items-center mb-5 mt-7"
          style={{ marginLeft: "6.5vh" }}
        >
          <style>{`
            .custom-placeholder::placeholder {
                color: #9b5c6f;
                opacity: 1;
            }
          `}</style>

          <input
            type="text"
            placeholder="Buscar por nome"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded p-2 mr-4 w-1/3"
            style={{
              width: "40rem",
              padding: "0.5rem",
              border: "2px solid #9b5c6f",
              borderRadius: "0.375rem",
              backgroundColor: "#f8fafc",
            }}
          />
          <Button size="default" onClick={handleNavigateToCadastro}>
            Cadastrar Cliente
          </Button>
        </div>

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
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.ID}>
                  <td className="border p-2">{client.ID}</td>
                  <td className="border p-2">
                    {editingClientId === client.ID ? (
                      <input
                        type="text"
                        name="CPF"
                        value={editedClient.CPF || ""}
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
                        value={editedClient.NAME || ""}
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
                        value={editedClient.EMAIL || ""}
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
                        value={editedClient.ADDRESS || ""}
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
                        value={editedClient.PHONE || ""}
                        onChange={handleEditChange}
                        className="border p-1"
                      />
                    ) : (
                      client.PHONE
                    )}
                  </td>
                  <td className="border p-2">
                    {editingClientId === client.ID ? (
                      <input />
                    ) : (
                      client.CASHBACK
                    )}
                  </td>
                  <td className="border p-2 action-cell ">
                    {editingClientId === client.ID ? (
                      <>
                        <button
                          className="button button-save"
                          onClick={() => saveClient(client.ID)}
                        >
                          Salvar
                        </button>
                        <button
                          className="button button-cancel"
                          onClick={() => setEditingClientId(null)}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="button button-view-sales"
                          onClick={() => showSales(client.ID)}
                        >
                          Ver compras
                        </button>
                        <button
                          className="button button-edit"
                          onClick={() => startEditing(client)}
                        >
                          Editar
                        </button>
                        <button
                          className="button button-delete"
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
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-3/5">
              <div className="modal-header">
                <h2 className="text-2xl font-bold mb-4">Compras do Cliente</h2>
                <button className="modal-close-button" onClick={closeModal}>
                  Fechar
                </button>
              </div>
              <table className="sales-table w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2">ID da compra</th>
                    <th className="border p-2">ID dos produtos</th>
                    <th className="border p-2">Tipo</th>
                    <th className="border p-2">Método de pagamento</th>
                    <th className="border p-2 w-[100px]">Valor total</th>
                    <th className="border p-2 w-[110px]">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClientSales.length > 0 ? (
                    selectedClientSales.map((sale) => (
                      <tr key={sale.ID}>
                        <td className="border p-2">{sale.ID}</td>
                        <td className="border p-2">
                          {Array.isArray(sale.PRODUCTS)
                            ? sale.PRODUCTS.join(", ")
                            : ""}
                        </td>
                        <td className="border p-2">{sale.SALE_TYPE}</td>
                        <td className="border p-2">{sale.PAYMENT_METHOD}</td>
                        <td className="border p-2">{sale.TOTAL_AMOUNT}</td>
                        <td className="border p-2">
                          {format(new Date(sale.SALE_DATE), "dd-MM-yyyy")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4">
                        Nenhuma compra encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Clientes;
