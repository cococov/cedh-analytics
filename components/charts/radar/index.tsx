/* Own */
import EChartBase from '@/components/charts/base';

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
          axisNameGap: 4,
          axisName: {
            fontSize: 12,
            fontWeight: 700,
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
            ],
          }
        ],
        color: ['#422273'],
      }}
    />
  );
};
