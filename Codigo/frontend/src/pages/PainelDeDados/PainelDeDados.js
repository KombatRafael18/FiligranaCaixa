import React, { useEffect, useState } from "react";
import SideDrawer from "../../components/SideDrawer";
import { useLoading } from "../../hooks/loading-hook";
import {
  getAnnualSummary,
  getMonthlySummary,
} from "../../services/filigranaapi";
import { fireError } from "../../utils/alerts";
import { formatBrazilianCurrency } from "../../utils/currencyFormatter";
import { BarChartCard } from "./subcomponents/BarChartCard";
import { PieChartCard } from "./subcomponents/PieChartCard";
import { StatCard } from "./subcomponents/StatCard";
import PasswordModal from "../../components/modal/PasswordModal";

const VIEWS = Object.freeze({
  ANUAL: "ANUAL",
  MENSAL: "MENSAL",
});

const VIEW_OPTIONS = [
  {
    value: VIEWS.ANUAL,
    label: "Anual",
  },
  {
    value: VIEWS.MENSAL,
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

/**
 * Retorna o ano atual no formato ISO (YYYY).
 */
function currentYearISOFormat() {
  return new Date().getFullYear().toString();
}

/**
 * Formata uma data ISO de mês (YYYY-MM) para uma string de mês local.
 */
function formatToLocalMonthString(monthISOFormat) {
  const d = new Date(monthISOFormat);
  return d.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Formata uma data ISO de mês (YYYY-MM) para uma string de mês local curta.
 * Exemplo: "2024-01" => "jan."
 */
function formatToLocalMonthShortString(monthISOFormat) {
  const d = new Date(monthISOFormat);
  return d.toLocaleDateString(undefined, {
    month: "short",
    timeZone: "UTC",
  });
}

function PainelDeDadosMensal({ referenceDate }) {
  const { isLoading, startLoading, stopLoading } = useLoading();

  const [monthlySummary, setMonthlySummary] = useState(null);

  async function loadMonthlySummary() {
    try {
      startLoading();
      const response = await getMonthlySummary(referenceDate);
      setMonthlySummary(response);
    } catch (error) {
      setMonthlySummary(null);
      console.error("Erro ao carregar resumo mensal", { error });
      fireError(error.message, "Erro ao carregar Painel Mensal");
    } finally {
      stopLoading();
    }
  }

  useEffect(() => {
    console.debug("Referência de data alterada", referenceDate);
    loadMonthlySummary();
  }, [referenceDate]);

  if (isLoading) {
    return (
      <p>
        Carregando painel mensal de {formatToLocalMonthString(referenceDate)}...
      </p>
    );
  }

  if (!monthlySummary) {
    return <p>Não foi possível carregar as informações do mês</p>;
  }

  return (
    <>
      <div className="mt-6 flex flex-col gap-6">
        <div className="flex gap-4">
          <StatCard
            title="Total de Vendas do Mês"
            value={monthlySummary.totalSales}
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
            value={
              (monthlySummary.comparisonLastMonth > 0 ? "+" : "") +
              formatBrazilianCurrency(monthlySummary.comparisonLastMonth)
            }
          />
        </div>

        <BarChartCard
          title="Vendas por dia do mês"
          barData={monthlySummary.salesByDays.map((data) => ({
            name: new Date(data.date).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "2-digit",
              timeZone: "UTC",
            }),
            value: data.totalAmount,
          }))}
          yAxisLabelFormatter={(v) => formatBrazilianCurrency(v)}
        />

        <div className="flex gap-4">
          <PieChartCard
            title="Distribuição de Vendas por Categoria"
            pieData={monthlySummary.salesByType.map((data) => ({
              name: data.saleType,
              value: data.count,
            }))}
          />
          <PieChartCard
            title="Distribuição de Vendas por Forma de Pagamento"
            pieData={monthlySummary.salesByPaymentMethod.map((data) => ({
              name: data.paymentMethod,
              value: data.count,
            }))}
          />
        </div>
      </div>
    </>
  );
}

function PainelDeDadosAnual({ referenceYear }) {
  const { isLoading, startLoading, stopLoading } = useLoading();

  const [yearlySummary, setYearlySummary] = useState(null);

  async function loadAnnualSummary() {
    try {
      startLoading();
      const response = await getAnnualSummary(referenceYear);
      setYearlySummary(response);
    } catch (error) {
      setYearlySummary(null);
      console.error("Erro ao carregar resumo anual", { error });
      fireError(error.message, "Erro ao carregar Painel Anual");
    } finally {
      stopLoading();
    }
  }

  useEffect(() => {
    console.debug("Ano Referência alterado", referenceYear);
    loadAnnualSummary();
  }, [referenceYear]);

  if (isLoading) {
    return <p>Carregando painel anual de {referenceYear}...</p>;
  }

  if (!yearlySummary) {
    return <p>Não foi possível carregar as informações do ano</p>;
  }

  return (
    <>
      <div className="mt-6 flex flex-col gap-6">
        <div className="flex gap-4">
          <StatCard
            title="Total de Vendas do Ano"
            value={yearlySummary.totalSales}
          />
          <StatCard
            title="Vendas do Ano"
            value={formatBrazilianCurrency(yearlySummary.totalSalesAmount)}
          />
        </div>

        <BarChartCard
          title="Vendas por mês do ano"
          yAxisLabelFormatter={(v) => formatBrazilianCurrency(v)}
          barData={yearlySummary.salesByMonths.map(
            ({ month, totalAmount }) => ({
              name: formatToLocalMonthShortString(month),
              value: totalAmount,
            })
          )}
        />
      </div>
    </>
  );
}

function PainelDeDados() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedView, setSelectedView] = useState(VIEWS.MENSAL);
  const [referenceYear, setReferenceYear] = useState(currentYearISOFormat());
  const [referenceDate, setReferenceDate] = useState(currentMonthISOFormat());

  const isReferenceYearCurrent = referenceYear === currentYearISOFormat();
  const isReferenceDateToday = referenceDate === currentMonthISOFormat();

  const handlePasswordSubmit = (password) => {
    const correctPassword = "adm";
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Senha incorreta!");
    }
  };

  if (!isAuthenticated) {
    return <PasswordModal onSubmit={handlePasswordSubmit} />;
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

          {selectedView === VIEWS.MENSAL ? (
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
          ) : selectedView === VIEWS.ANUAL ? (
            <label>
              Ano:{" "}
              <input
                type="number"
                value={referenceYear}
                min="2024"
                max={currentYearISOFormat()}
                required="required"
                onChange={(e) => setReferenceYear(e.target.value)}
              />
              {isReferenceYearCurrent && (
                <small className="text-cyan-500">&nbsp;(Este ano)</small>
              )}
            </label>
          ) : null}
        </section>

        {selectedView === VIEWS.MENSAL ? (
          <PainelDeDadosMensal referenceDate={referenceDate} />
        ) : selectedView === VIEWS.ANUAL ? (
          <PainelDeDadosAnual referenceYear={referenceYear} />
        ) : (
          <p>Selecione uma opção de visualização</p>
        )}
      </section>
    </>
  );
}

export default PainelDeDados;
