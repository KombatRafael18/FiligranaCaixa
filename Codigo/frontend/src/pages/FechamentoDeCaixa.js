import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import MoneyCounter from "../components/CurrencyCounter/MoneyCounter";
import SalesTable from "../components/SalesTable";
import SideDrawer from "../components/SideDrawer";
import { useLoading } from "../hooks/loading-hook";
import {
  getFechamentoCaixaResumoDia,
  postFechamentoCaixaDia,
} from "../services/filigranaapi";
import { fireWarningConfirm } from "../utils/alerts";

/**
 * Retorna a data atual no formato ISO (YYYY-MM-DD) sem a parte do tempo.
 */
function nowLocalISODateOnly() {
  const now = new Date();
  const y = now.getFullYear().toString();
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const d = now.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function FechamentoDeCaixa() {
  const [referenceDate, setReferenceDate] = useState(nowLocalISODateOnly());

  const [moneyCounter, setMoneyCounter] = useState({
    BILL_2: {
      count: 0,
      total: 0,
    },
    BILL_5: {
      count: 0,
      total: 0,
    },
    BILL_10: {
      count: 0,
      total: 0,
    },
    BILL_20: {
      count: 0,
      total: 0,
    },
    BILL_50: {
      count: 0,
      total: 0,
    },
    BILL_100: {
      count: 0,
      total: 0,
    },
    BILL_200: {
      count: 0,
      total: 0,
    },
    COIN_1: {
      count: 0,
      total: 0,
    },
    COIN_5: {
      count: 0,
      total: 0,
    },
    COIN_10: {
      count: 0,
      total: 0,
    },
    COIN_25: {
      count: 0,
      total: 0,
    },
    COIN_50: {
      count: 0,
      total: 0,
    },
    COIN_1_REAL: {
      count: 0,
      total: 0,
    },
  });

  const navigate = useNavigate();
  const { isLoading, startLoading, stopLoading } = useLoading();

  const isReferenceDateToday = referenceDate === nowLocalISODateOnly();

  async function getDailySummary() {
    try {
      startLoading();
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const resumoDia = await getFechamentoCaixaResumoDia(referenceDate);
      console.debug("Resumo do dia", resumoDia);
    } catch (error) {
      console.debug("Erro ao buscar resumo do dia", error);
    } finally {
      stopLoading();
    }
  }

  async function handleConfirmarFechamento() {
    const { isConfirmed } = await fireWarningConfirm(
      "Confirme sua intenção de fechar o caixa"
    );
    if (!isConfirmed) {
      return;
    }

    const data = {
      moneyCounter,
      cashRegisterWithdrawal: 0,
    };

    console.debug("Confirmar fechamento", referenceDate, data);

    try {
      startLoading();
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await postFechamentoCaixaDia(referenceDate, data);
      console.debug("Fechamento confirmado");
    } catch (error) {
      console.debug("Erro ao confirmar fechamento", error);
      return;
    } finally {
      stopLoading();
    }

    navigate("/home");
  }

  useEffect(() => {
    console.debug("Referência de data alterada", referenceDate);
    getDailySummary();
  }, [referenceDate]);

  if (isLoading) {
    return <p>Carregando informações do dia {referenceDate}...</p>;
  }

  return (
    <>
      {/* <SideDrawer isOpen={true} /> */}

      {/* <section className="ml-[250px] p-10 max-w-screen-lg"> */}
      <section className="p-10 max-w-screen-lg">
        <header>
          <h1 className="text-3xl font-bold">Fechamento de caixa</h1>
          <p className="text-xl font-light">
            Visualize as vendas do dia e confira valores recebidos
          </p>
        </header>

        <section className="mt-6">
          Data:{" "}
          <input
            type="date"
            value={referenceDate}
            min="2024-01-01"
            max={nowLocalISODateOnly()}
            onChange={(e) => setReferenceDate(e.target.value)}
          />
          {isReferenceDateToday && (
            <small className="text-green-500">&nbsp;(Hoje)</small>
          )}
        </section>

        <div className="flex gap-12">
          <div>
            <section className="mt-6">
              <h2 className="text-base font-bold">Vendas</h2>
              {/* TODO: Tabela de vendas */}
              <div className="mt-3">
                <SalesTable maxHeigth="250px" />
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-base font-bold">Resumo das vendas</h2>
              {/* TODO: Total de vendas em dinheiro */}
              <p>Caixa anterior: R$536,00</p>
              <p>Total no caixa hoje: R$5.079,50</p>
            </section>

            <section className="mt-6">
              <h2 className="text-base font-bold">Retirar do caixa</h2>
              {/* TODO: Permitir retirar dinheiro do caixa */}
              <div>
                <p>Insira o valor a retirar: | 0,00 |</p>
                <p>Próximo caixa: R$735,00</p>
              </div>
            </section>
          </div>

          <div>
            <section className="mt-6">
              <h2 className="text-base font-bold">Contagem do caixa</h2>

              {/* TODO: Contadores de cédulas e moedas */}
              <MoneyCounter
                moneyCounter={moneyCounter}
                setMoneyCounter={setMoneyCounter}
              />
            </section>
          </div>
        </div>

        <div className="mt-6">
          <Button type="button" onClick={handleConfirmarFechamento}>
            Confirmar fechamento
          </Button>
        </div>
      </section>
    </>
  );
}

export default FechamentoDeCaixa;
