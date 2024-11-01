import React, { useEffect, useState } from "react";
import SideDrawer from "../../components/SideDrawer";
import { useLoading } from "../../hooks/loading-hook";
import { formatBrazilianCurrency } from "../../utils/currencyFormatter";
import { StatCard } from "./subcomponents/StatCard";

const VIEWS = Object.freeze({
  ANUAL: "ANUAL",
  MENSAL: "MENSAL",
});

const VIEW_OPTIONS = [
  {
    value: "ANUAL",
    label: "Anual",
  },
  {
    value: "MENSAL",
    label: "Mensal",
  },
];

/**
 * Retorna o mês atual no formato ISO (YYYY-MM).
 */
function currentMonthISOFormat() {
  const now = new Date();
  const y = now.getFullYear().toString();
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  return `${y}-${m}`;
}

function PainelDeDados() {
  const [selectedView, setSelectedView] = useState(VIEWS.MENSAL);
  const [referenceDate, setReferenceDate] = useState(currentMonthISOFormat());

  const { isLoading, startLoading, stopLoading } = useLoading();

  const isReferenceDateToday = referenceDate === currentMonthISOFormat();

  const [monthlySummary, setMonthlySummary] = useState({
    totalSales: 120,
    totalSalesAmount: 93,
    averageTicket: 50.12,
    comparisonLastMonth: -1.2,
  });

  useEffect(() => {
    console.debug("Referência de data alterada", referenceDate);
    // getDailySummary();
  }, [referenceDate]);

  if (isLoading) {
    return <p>Carregando informações do dia {referenceDate}...</p>;
  }

  return (
    <>
      <SideDrawer isOpen={true} />

      <section className="ml-[250px] p-10 max-w-screen-lg">
        <header>
          <h1 className="text-3xl font-bold">Painel de dados</h1>
          <p className="text-xl font-light">
            Visão Geral do Desempenho de Vendas
          </p>
        </header>

        <section className="mt-6 flex gap-4">
          <fieldset className="flex gap-2">
            {VIEW_OPTIONS.map(({ value, label }) => (
              <label key={value}>
                <input
                  type="radio"
                  name="view"
                  value={value}
                  checked={selectedView === value}
                  onChange={(e) => setSelectedView(e.target.value)}
                />
                {label}
              </label>
            ))}
          </fieldset>

          {selectedView === VIEWS.MENSAL && (
            <label>
              Mês:{" "}
              <input
                type="month"
                value={referenceDate}
                min="2024-01"
                max={currentMonthISOFormat()}
                required="required"
                onChange={(e) => setReferenceDate(e.target.value)}
              />
              {isReferenceDateToday && (
                <small className="text-cyan-500">&nbsp;(Este mês)</small>
              )}
            </label>
          )}
        </section>

        <div className="mt-6 flex flex-col gap-6">
          <div className="flex gap-4">
            <StatCard
              title="Total de Vendas do Mês"
              value={formatBrazilianCurrency(monthlySummary.totalSales)}
            />
            <StatCard
              title="Vendas do Mês"
              value={formatBrazilianCurrency(monthlySummary.totalSalesAmount)}
            />
            <StatCard
              title="Ticket Médio Mensal"
              value={formatBrazilianCurrency(monthlySummary.averageTicket)}
            />
            <StatCard
              title="Comparação com o Mês Anterior"
              value={formatBrazilianCurrency(
                monthlySummary.comparisonLastMonth
              )}
            />
          </div>

          <div>
            <div>
              <h2 className="text-sm font-bold">Vendas por dia do mês</h2>
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <h2 className="text-sm font-bold">
                Distribuição de Vendas por Categoria
              </h2>
            </div>
            <div>
              <h2 className="text-sm font-bold">
                Distribuição de Vendas por Forma de Pagamento
              </h2>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PainelDeDados;
