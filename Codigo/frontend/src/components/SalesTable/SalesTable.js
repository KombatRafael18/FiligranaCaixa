import styles from "./SalesTable.module.css";

export default function SalesTable({ maxHeigth = undefined }) {
  return (
    <table
      className={`${
        maxHeigth ? styles["scroll-table"] : ""
      } w-full text-xs md:text-base text-center bg-neutral-100 border border-neutral-300`}
      style={{
        ["--table-max-height"]: maxHeigth,
      }}
    >
      <thead className="text-white bg-[#7D4B5F]">
        <tr>
          <th>ID Venda</th>
          <th>Data/Hora</th>
          <th>Modalidade</th>
          <th>Pagamento</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        {Array.from({ length: 40 }).map((_, index) => (
          <tr key={index} className="border border-neutral-300">
            <td>121</td>
            <td>07/10/24 13:32</td>
            <td>Varejo</td>
            <td>DINHEIRO</td>
            <td>R$ 210,00</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
