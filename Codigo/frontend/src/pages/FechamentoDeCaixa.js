import React, { useState } from "react";
import Button from "../components/Button";
import MoneyCounter from "../components/CurrencyCounter/MoneyCounter";
import SideDrawer from "../components/SideDrawer";

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

  const [bill2value, setBill2Value] = useState(0);

  const isReferenceDateToday = referenceDate === nowLocalISODateOnly();

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

        <section className="mt-6">
          <h2 className="text-base font-bold">Vendas</h2>

          {/* TODO: Tabela de vendas */}
          <table className="mt-3">
            <thead>
              {/* ID Venda Data/Hora Modalidade Pagamento Total */}
              <tr>
                <th>ID Venda</th>
                <th>Data/Hora</th>
                <th>Modalidade</th>
                <th>Pagamento</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>121</td>
                <td>07/10/24 13:32</td>
                <td>Varejo</td>
                <td>DINHEIRO</td>
                <td>R$ 210,00</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mt-6">
          <h2 className="text-base font-bold">Resumo vendas em DINHEIRO</h2>

          {/* TODO: Total de vendas em dinheiro */}
          <p>Total: R$ 999,00</p>
        </section>

        <section className="mt-6">
          <h2 className="text-base font-bold">Contagem do caixa</h2>

          {/* TODO: Contadores de cédulas e moedas */}
          <MoneyCounter />
        </section>

        <section className="mt-6">
          <h2 className="text-base font-bold">Variação do caixa</h2>

          {/* TODO: Diferença entre o fechamento de ontem e o total no caixa hoje */}
          <div>
            <p>Fechamento de ontem: R$735,00</p>
            <p>Total de vendas em dinheiro: R$ 115,00</p>
            <p>Total no caixa hoje: R$ 950,00</p>
            <p>Diferença: R$ 0,00</p>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-base font-bold">Retirar do caixa</h2>

          {/* TODO: Permitir retirar dinheiro do caixa */}
          <div>
            <p>Insira o valor a retirar: | 0,00 |</p>
            <p>Fechamento de hoje: R$735,00</p>
          </div>
        </section>

        <div className="mt-6">
          <Button type="button">Confirmar fechamento</Button>
        </div>
      </section>
    </>
  );
}

export default FechamentoDeCaixa;
