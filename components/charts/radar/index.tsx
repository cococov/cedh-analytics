import EChartBase from "../base";

export default function RadarChart({ options }: {
  options: {
    title: string,
    indicators: { name: string, max: number }[],
    values: number[],
  },
}) {
  return (
    <EChartBase
      option={{
        indicator: options.indicators,
        responsive: true,
        maintainAspectRatio: false,
        tooltip: {
          trigger: 'axis',
          position: 'left',
          confine: true,
        },
        textStyle: {
          fontSize: 12,
        },
        legend: { show: false },
        radar: {
          indicator: options.indicators,
          radius: 135,
          center: ['50%', '50%'],
          axisNameGap: 2,
          axisName: {
            fontSize: 11,
            color: '#ccc',
          },
        },
        series: [
          {
            name: options.title,
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            areaStyle: {},
            data: [
              {
                value: options.values,
                name: options.title,
              }
            ]
          }
        ]
      }}
    />
  );
};
