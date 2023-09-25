/* Own */
import EChartBase from "../base";

export default function BarChart({ options }: {
  options: {
    categories: string[],
    subCategories: string[],
    data: { [key: string]: number }[],
    colors?: string[],
    withToolBox?: boolean,
  },
}) {
  return (
    <EChartBase
      option={{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: options.subCategories,
        },
        toolbox: {
          show: options.withToolBox,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: options.categories,
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: options.subCategories.map((subCategory) => ({
          name: subCategory,
          type: 'bar',
          emphasis: {
            focus: 'series'
          },
          data: options.data.map((data) => data[subCategory]),
        })),
        color: options.colors,
      }}
    />
  );
};
