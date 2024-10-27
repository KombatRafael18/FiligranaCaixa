import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./index.css";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Venda from "./pages/Venda";
import CadastrarCliente from "./pages/CadastrarCliente";
import FechamentoDeCaixa from "./pages/FechamentoDeCaixa";
import FechamentoVenda from "./pages/FechamentoVenda";
import NotFound from "./pages/NotFound";
import Clientes from "./pages/Clientes"; 

function PrivateRoute({ element, ...rest }) {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetch('http://localhost:3000/api/login/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        setIsValid(data.valid);
        setLoading(false);
      })
      .catch(() => {
        setIsValid(false);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen font-bold text-2xl">
        Carregando...
      </div>
    );
  }

  return isValid ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/venda" element={<PrivateRoute element={<Venda />} />} />
          <Route path="/cadastrar-cliente" element={<PrivateRoute element={<CadastrarCliente />} />} />
          <Route path="/fechamento-de-caixa" element={<PrivateRoute element={<FechamentoDeCaixa />} />} />
          <Route path="/fechamento-venda" element={<PrivateRoute element={<FechamentoVenda />} />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/clientes" element={<PrivateRoute element={<Clientes />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
