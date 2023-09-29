/* Own */
import EChartBase from "../base";

export default function BoxwhiskerChart({ options }: {
  options: {
    title: string,
    data: (number | string)[][],
  },
}) {
  return (
    <EChartBase
      option={{
        title: {
          text: '',
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
          left: '10%',
          right: '5%',
          bottom: '15%'
        },
        xAxis: {
          show: true,
          type: 'category',
          boundaryGap: true,
          nameGap: 30,
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            fontSize: 14,
            fontWeight: 400,
            rotate: 45,
          },
        },
        yAxis: {
          type: 'value',
          splitArea: {
            show: true
          },
          min: 0,
          axisLabel: {
            fontSize: 14,
            fontWeight: 400,
          },
        },
        dataset: {
          source: [
            ['score', 'min', 'Q1', 'median', 'Q3', 'max'],
            ...options.data,
          ]
        },
        series: [
          {
            name: '',
            type: 'boxplot',
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
      width="100%"
      height="600px"
    />
  );
};
