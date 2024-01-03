/* Vendor */
import { replace } from 'ramda';
/* Own */
import EChartBase from '@components/charts/base';

type DataWithStyle = { value: number, itemStyle: { color: string } }
type DataWithSubCategory = { [key: string]: (number | DataWithStyle) };

export default function BarChart({ options }: {
  options: {
    categories: string[],
    subCategories?: string[],
    data: (number | DataWithSubCategory | DataWithStyle)[],
    colors?: string[],
    yAxisLabelFormat?: string,
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
            type: 'value',
            axisLabel: {
              formatter: options.yAxisLabelFormat || '{value}',
              fontSize: 14,
            },
          }
        ],
        series: (options.subCategories !== undefined)
          ? options.subCategories.map((subCategory) => ({
            name: subCategory,
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: options.data.map((data) => (data as DataWithSubCategory)[subCategory]),
          }))
          : {
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            tooltip: {
              valueFormatter: (value) => {
                return replace(/{value}/g, String(value), String(options.yAxisLabelFormat));
              }
            },
            data: (options.data as any),
          },
        color: options.colors,
      }}
    />
  );
};
