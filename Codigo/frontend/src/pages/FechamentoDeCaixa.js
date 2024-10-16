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
import { fireSuccess, fireWarningConfirm } from "../utils/alerts";
import { formatBrazilianCurrency } from "../utils/currencyFormatter";

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
    bill2: {
      count: 0,
      total: 0,
    },
    bill5: {
      count: 0,
      total: 0,
    },
    bill10: {
      count: 0,
      total: 0,
    },
    bill20: {
      count: 0,
      total: 0,
    },
    bill50: {
      count: 0,
      total: 0,
    },
    Bill100: {
      count: 0,
      total: 0,
    },
    bill200: {
      count: 0,
      total: 0,
    },
    coin1: {
      count: 0,
      total: 0,
    },
    coin5: {
      count: 0,
      total: 0,
    },
    coin10: {
      count: 0,
      total: 0,
    },
    coin25: {
      count: 0,
      total: 0,
    },
    coin50: {
      count: 0,
      total: 0,
    },
    coin1Real: {
      count: 0,
      total: 0,
    },
  });

  const [previousDayCashBalance, setPreviousDayCashBalance] = useState(0);
  const [cashRegisterWithdrawal, setCashRegisterWithdrawal] = useState(0);
  const [cashAlreadyClosed, setCashAlreadyClosed] = useState(false);
  const [payments, setPayments] = useState([]);

  const navigate = useNavigate();
  const { isLoading, startLoading, stopLoading } = useLoading();

  const isReferenceDateToday = referenceDate === nowLocalISODateOnly();

  const totalMoneyCounter = Object.values(moneyCounter).reduce(
    (acc, { total }) => acc + total,
    0
  );

  const cashBalance = totalMoneyCounter - cashRegisterWithdrawal;

  async function getDailySummary() {
    try {
      startLoading();
      const dailySummary = await getFechamentoCaixaResumoDia(referenceDate);
      console.debug("Resumo do dia", dailySummary);

      setMoneyCounter(dailySummary.moneyCounter);
      setCashRegisterWithdrawal(dailySummary.cashRegisterWithdrawal);
      setPreviousDayCashBalance(
        dailySummary.previousDayCashBalance.cashBalance
      );
      setCashAlreadyClosed(dailySummary.cashAlreadyClosed);
      setPayments(dailySummary.payments);
    } catch (error) {
      console.debug("Erro ao buscar resumo do dia", error);
    } finally {
      stopLoading();
    }
  }

  async function handleCashRegisterWithdrawalChange(event) {
    if (totalMoneyCounter === 0) {
      fireWarningConfirm("Não há dinheiro no caixa para retirar");
      return;
    }

    const value = event.target.value == "" ? 0 : parseFloat(event.target.value);
    if (isNaN(value)) {
      return;
    }

    let newValue = value;
    if (totalMoneyCounter - value < 0) {
      newValue = totalMoneyCounter;
    }

    setCashRegisterWithdrawal(newValue);
  }

  async function handleConfirmarFechamento() {
    if (cashBalance < 0) {
      fireWarningConfirm(
        "O caixa está negativo. Verifique o valor a ser retirado"
      );
      return;
    }

    const { isConfirmed } = await fireWarningConfirm(
      "Confirme sua intenção de fechar o caixa"
    );
    if (!isConfirmed) {
      return;
    }

    const moneyCounterCount = Object.entries(moneyCounter).reduce(
      (acc, [key, value]) => {
        acc[key] = { count: value.count };
        return acc;
      },
      {}
    );

    const data = {
      date: referenceDate,
      moneyCounter: moneyCounterCount,
      cashRegisterWithdrawal,
    };

    console.debug("Confirmar fechamento", data);

    try {
      startLoading();
      await postFechamentoCaixaDia(data);
      console.debug("Fechamento confirmado");
    } catch (error) {
      console.debug("Erro ao confirmar fechamento", error);
      return;
    } finally {
      stopLoading();
    }

    fireSuccess("Caixa fechado com sucesso");
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
      <SideDrawer isOpen={true} />

      <section className="ml-[250px] p-10 max-w-screen-lg">
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
              <p>
                Caixa anterior:
                {formatBrazilianCurrency(previousDayCashBalance)}
              </p>
              <p>
                Total no caixa hoje:
                {formatBrazilianCurrency(totalMoneyCounter)}
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-base font-bold">Retirar do caixa</h2>
              <div>
                <p>
                  Insira o valor a retirar: R$
                  <input
                    title="Valor a ser retirado do caixa"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={cashRegisterWithdrawal.toString()}
                    onChange={handleCashRegisterWithdrawalChange}
                  />
                </p>
                <p>
                  Próximo caixa:
                  {formatBrazilianCurrency(cashBalance)}
                </p>
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
          {cashAlreadyClosed ? (
            <span>Caixa já fechado</span>
          ) : (
            <Button type="button" onClick={handleConfirmarFechamento}>
              Confirmar fechamento
            </Button>
          )}
        </div>
      </section>
    </>
  );
}

export default FechamentoDeCaixa;
