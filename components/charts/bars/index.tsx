/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2023-present CoCoCov
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  Original Repo: https://github.com/cococov/cedh-analytics
 *  https://www.cedh-analytics.com/
 */

/* Vendor */
import { replace } from 'ramda';
/* Own */
import EChartBase from '@/components/charts/base';

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
