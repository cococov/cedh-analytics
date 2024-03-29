/* Own */
import EChartBase from '@/components/charts/base';

export default function PieChart({ options }: {
  options: {
    title: string,
    data: { value: number, name: string, selected?: boolean }[],
    colors?: string[],
  },
}) {
  return (
    <EChartBase
      option={{
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: options.title,
            type: 'pie',
            radius: [30, '90%'],
            roseType: 'radius',
            label: {
              position: 'inner',
              fontSize: 12
            },
            data: options.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
        ],
        color: options.colors,
      }}
      width={'350px'}
      height={'250px'}
    />
  );
};
