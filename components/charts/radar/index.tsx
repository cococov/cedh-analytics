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
