import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { chartOptions } from "../chart-options";

export function BarChartCard({
  title,
  barData,
  yAxisLabelFormatter = undefined,
}) {
  const chartElRef = useRef(null);

  useEffect(() => {
    console.debug("BarChartCard mounted", chartElRef.current);

    const chart = echarts.init(chartElRef.current);

    const resizeListener = () => {
      chart.resize();
    };
    window.addEventListener("resize", resizeListener);

    const xd = barData.map((data) => data.name);
    const sd = barData.map((data) => data.value);

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
          color: chartOptions.color,
          name: "Vendas no dia",
          data: sd,
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
