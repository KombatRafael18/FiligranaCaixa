import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaShoppingCart,
  FaChartBar,
  FaCashRegister,
  FaQuestionCircle,
  FaUsers,
} from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { getApiOrigin } from "../services/filigranaapi/config";

const SideDrawer = ({ isOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.get(`${getApiOrigin()}/api/login/logout`);
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full ${
          isCollapsed && !isHovering ? "w-16" : "w-64"
        } 
                    bg-[#f6b9b6] transform transition-width duration-150 ease-in-out z-50`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ transition: "width 0.15s ease-in-out" }} // Adiciona animação de expansão
      >
        <div className="flex flex-col h-full justify-between p-6">
          <div className="flex flex-col gap-8">
            <Link to="/home" className="mb-4 text-[#7d4b5f]">
              <h3>{isCollapsed && !isHovering ? "F" : "FILIGRANA"}</h3>
            </Link>
            <nav>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/venda"
                    className="flex items-center gap-3 hover:text-[#9b5c6f]"
                  >
                    <FaShoppingCart />
                    {(isHovering || !isCollapsed) && <span>NOVA VENDA</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/clientes"
                    className="flex items-center gap-3 hover:text-[#9b5c6f]"
                  >
                    <FaUsers />
                    {(isHovering || !isCollapsed) && <span>CLIENTES</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/fechamento-de-caixa"
                    className="flex items-center gap-3 hover:text-[#9b5c6f]"
                  >
                    <FaCashRegister />
                    {(isHovering || !isCollapsed) && <span>FECHAR CAIXA</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/painel-de-dados"
                    className="flex items-center gap-3 hover:text-[#9b5c6f]"
                  >
                    <FaChartBar />
                    {(isHovering || !isCollapsed) && (
                      <span>PAINEL DE DADOS</span>
                    )}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <ul className="space-y-4 py-4">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-3 hover:text-gray-700"
                  onClick={handleLogout}
                >
                  <ImExit />
                  {(isHovering || !isCollapsed) && <span>SAIR</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/ajuda"
                  className="flex items-center gap-3 hover:text-gray-700"
                >
                  <FaQuestionCircle />
                  {(isHovering || !isCollapsed) && <span>AJUDA</span>}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
