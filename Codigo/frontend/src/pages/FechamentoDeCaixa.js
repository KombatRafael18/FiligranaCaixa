import React from "react";
import SideDrawer from "../components/SideDrawer";

function FechamentoDeCaixa() {
  return (
    <>
      <SideDrawer isOpen={true} />

      <section className="ml-[250px] p-10">
        <header>
          <h1 className="text-3xl font-bold">Fechamento de caixa</h1>
          <p className="text-xl font-light">
            Visualize as vendas do dia e confira valores recebidos
          </p>
        </header>
      </section>
    </>
  );
}

export default FechamentoDeCaixa;
