/* Own */
import EChartBase from "../base";

export default function BoxwhiskerChart({ options }: {
  options: {
    title: string,
    data: number[],
  },
}) {
  return (
    <EChartBase
      option={{
        title: {
          text: options.title,
          left: 'center',
          top: 20,
          bottom: 0,
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '30%',
          right: '30%',
          bottom: '15%'
        },
        xAxis: {
          show: false,
          type: 'category',
          boundaryGap: true,
          nameGap: 30,
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitArea: {
            show: true
          },
          min: 20,
        },
        series: [
          {
            name: '',
            type: 'boxplot',
            data: [{ value: options.data }],
            itemStyle: { color: '#7555a6', borderColor: '#422273', opacity: 0.7 },
            encode: {
              x: '',
              y: ['min', 'Q1', 'median', 'Q3', 'max'],
              itemName: '',
              tooltip: ['min', 'Q1', 'median', 'Q3', 'max']
            }
          },
        ]
      }}
    />
  );
};
