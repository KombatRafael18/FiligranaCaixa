import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Venda from './pages/Venda';
import CadastrarCliente from './pages/CadastrarCliente';
import FechamentoDeCaixa from './pages/FechamentoDeCaixa';
import FechamentoVenda from './pages/FechamentoVenda';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
