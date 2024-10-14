import { formatBrazilianCurrency } from "../../utils/currencyFormatter";

const mockData = [
  { paymentMethod: "Dinheiro", amount: 1439.5 },
  { paymentMethod: "Pix", amount: 180.0 },
  { paymentMethod: "Qr pix", amount: 330.0 },
  { paymentMethod: "Débito", amount: 210.0 },
  { paymentMethod: "Credito", amount: 2200.0 },
  { paymentMethod: "Promissoria", amount: 720.0 },
];

export default function SalesTable({}) {
  return (
    <table className="w-full text-xs md:text-base text-center bg-neutral-100 border border-neutral-300">
      <thead className="text-white bg-[#7D4B5F]">
        <tr>
          <th>Pagamento</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        {mockData.map((row, index) => (
          <tr key={index} className="border border-neutral-300">
            <td className="uppercase">{row.paymentMethod}</td>
            <td>{formatBrazilianCurrency(row.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
