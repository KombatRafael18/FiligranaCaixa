import { formatBrazilianCurrency } from "../../utils/currencyFormatter";

export default function SalesTable({ payments }) {
  return (
    <table className="w-full text-xs md:text-base text-center bg-neutral-100 border border-neutral-300">
      <thead className="text-white bg-[#7D4B5F]">
        <tr>
          <th>Pagamento</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        {payments.map((row, index) => (
          <tr key={index} className="border border-neutral-300">
            <td className="uppercase">{row.paymentMethod}</td>
            <td>{formatBrazilianCurrency(row.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
