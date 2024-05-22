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

/* Own */
import EChartBase from '@/components/charts/base';

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
