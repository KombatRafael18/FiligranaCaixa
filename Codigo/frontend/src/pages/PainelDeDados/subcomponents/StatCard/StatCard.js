export function StatCard({ title, value }) {
  return (
    <article className="w-full p-3 rounded-lg flex flex-col gap-2 justify-between bg-white bg-opacity-50 shadow">
      <h2 className="text-sm font-bold text-neutral-400">{title}</h2>
      <p className="text-xl font-bold ">{value}</p>
    </article>
  );
}
