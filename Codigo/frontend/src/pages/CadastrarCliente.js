import React, { useState } from "react";
import SideDrawer from "../components/SideDrawer";
import { getApiOrigin } from "../services/filigranaapi/config";

function CadastrarCliente() {
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePhoneChange = (value) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, "");

    let formattedPhone = "";
    if (numericValue.length > 0) {
      formattedPhone += `(${numericValue.slice(0, 2)}`;
      if (numericValue.length > 2) {
        formattedPhone += `) ${numericValue.slice(2, 7)}`;
        if (numericValue.length > 7) {
          formattedPhone += `-${numericValue.slice(7, 11)}`;
        }
      }
    }

    setPhone(formattedPhone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Limpa o CPF removendo caracteres especiais
    const cleanedCpf = cpf.replace(/[^\d]/g, "");
    const cleanedPhone = phone.replace(/[^\d]/g, "");

    const client = {
      cpf: cleanedCpf,
      name,
      email,
      address,
      phone,
    };

    console.log("Dados enviados:", client);

    fetch(`${getApiOrigin()}/api/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 409) {
            throw new Error("CPF já cadastrado.");
          }
          throw new Error(
            `Erro ao cadastrar cliente: ${response.status} - ${response.statusText}`
          );
        }
        return response.json();
      })
      .then(() => {
        setCpf("");
        setName("");
        setEmail("");
        setAddress("");
        setPhone("");
        setErrorMessage("");
        alert("Cliente cadastrado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao cadastrar cliente:", error);
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="container">
      <SideDrawer isOpen={true} />

      <div className="content ml-[250px] p-10">
        <h1 className="text-4xl font-bold mb-4 text-[#7d4b5f]">
          Cadastrar Cliente
        </h1>

        {errorMessage && (
          <div className="mb-4 text-red-500">{errorMessage}</div>
        )}

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
            <label className="block text-lg mb-2 text-[#7d4b5f]">
              Endereço
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-[#7d4b5f] p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2 text-[#7d4b5f]">
              Telefone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
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
