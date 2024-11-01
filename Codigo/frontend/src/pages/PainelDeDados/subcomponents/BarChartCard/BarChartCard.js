import * as echarts from "echarts";
import { useEffect, useRef } from "react";

function generateFakeData() {
  // Gera todos os dias do mês atual
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const days = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(y, m, i + 1)
  );

  // Gera valores aleatórios para cada dia
  return days.map((day) => {
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

    return {
      // day: day.getDate(),
      day: day.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      totalSales: isWeekend ? 0 : Math.floor(Math.random() * 100),
      totalSalesAmount: isWeekend ? 0 : Math.floor(Math.random() * 1000),
    };
  });
}

const fakeData = generateFakeData();

export function BarChartCard({ title, yAxisLabelFormatter = undefined }) {
  const chartElRef = useRef(null);

  useEffect(() => {
    console.debug("BarChartCard mounted", chartElRef.current);

    const chart = echarts.init(chartElRef.current);

    const resizeListener = () => {
      chart.resize();
    };
    window.addEventListener("resize", resizeListener);

    const xd = fakeData.map((data) => data.day);
    const sd = fakeData.map((data) => data.totalSalesAmount);

    chart.setOption({
      grid: {
        left: "15%",
        top: "10%",
        right: "10%",
        bottom: "20%",
      },
      tooltip: {
        trigger: "axis",
        // axisPointer: {
        //   type: "cross",
        // },
        formatter:
          yAxisLabelFormatter &&
          ((params) => {
            return `${params[0].name}: ${yAxisLabelFormatter(params[0].value)}`;
          }),
      },
      xAxis: {
        type: "category",
        data: xd,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        axisLabel: {
          formatter: yAxisLabelFormatter,
        },
      },
      series: [
        {
          type: "bar",
          name: "Vendas no dia",
          data: sd,
          itemStyle: {
            color: "#7d4b5f",
          },
        },
      ],
    });

    return () => {
      console.debug("BarChartCard unmounted");
      window.removeEventListener("resize", resizeListener);
      chart.dispose();
    };
  }, [yAxisLabelFormatter]);

  return (
    <div className="w-full p-3 rounded-lg flex flex-col gap-2 justify-between bg-white bg-opacity-50 shadow">
      <h2 className="text-sm font-bold text-neutral-400">{title}</h2>
      <div className="w-full h-44" ref={chartElRef}></div>
    </div>
  );
}
