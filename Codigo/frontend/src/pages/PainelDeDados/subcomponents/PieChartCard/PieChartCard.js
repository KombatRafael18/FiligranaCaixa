import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { chartOptions } from "../chart-options";

export function PieChartCard({ title, pieData }) {
  const chartElRef = useRef(null);

  useEffect(() => {
    console.debug("PieChartCard mounted", chartElRef.current);

    const chart = echarts.init(chartElRef.current);

    const resizeListener = () => {
      chart.resize();
    };
    window.addEventListener("resize", resizeListener);

    chart.setOption({
      color: chartOptions.color,
      tooltip: {
        trigger: "item",
      },
      legend: {
        itemGap: 4,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 12,
        },
        icon: "circle",
      },
      series: [
        {
          name: "Total",
          type: "pie",

          // top: "20%",
          left: "-20%",
          right: "-20%",
          bottom: "-20%",

          radius: "45%",
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            show: true,
            formatter: "{c} ({d}%)",
            textStyle: {
              fontSize: 12,
            },
          },
        },
      ],
    });

    return () => {
      console.debug("PieChartCard unmounted");
      window.removeEventListener("resize", resizeListener);
      chart.dispose();
    };
  }, [title, pieData]);

  return (
    <div className="w-full p-3 rounded-lg flex flex-col gap-2 justify-between bg-white bg-opacity-50 shadow">
      <h2 className="text-sm font-bold text-neutral-400">{title}</h2>
      <div className="w-full h-44" ref={chartElRef}></div>
    </div>
  );
}
