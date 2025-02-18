// PasswordModal.js
import React, { useState } from "react";
import "./PasswordModal.css";

function PasswordModal({ onSubmit }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          Digite a senha para acessar o Painel de Dados
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="modal-input"
          />
          <button type="submit" className="modal-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordModal;
