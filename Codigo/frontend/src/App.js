import React from "react";
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
import AdicionarProduto from "./pages/AdicionarProduto";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/venda" element={<Venda />} />
          <Route path="/cadastrar-cliente" element={<CadastrarCliente />} />
          <Route path="/fechamento-de-caixa" element={<FechamentoDeCaixa />} />
          <Route path="/fechamento-venda" element={<FechamentoVenda />} />
          <Route path="/adicionar-produto" element={<AdicionarProduto />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
