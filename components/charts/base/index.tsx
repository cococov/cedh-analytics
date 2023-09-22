"use client";

import { useRef, useEffect } from 'react';
/* Vendor */
import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent, GridComponent, ToolboxComponent } from 'echarts/components';
import type { EChartsOption, SetOptionOpts, ToolboxComponentOption, SeriesOption } from "echarts";
import { RadarChart, PieChart, BarChart, LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  GridComponent,
]);

type App = {
  configParameters: {
    rotate: {
      min: number,
      max: number,
    },
    align: {
      options: {
        left: string,
        center: string,
        right: string,
      },
    },
    verticalAlign: {
      options: {
        top: string,
        middle: string,
        bottom: string,
      },
    },
    position: {
      options: {
        [key: string]: string,
      },
    },
    distance: {
      min: number,
      max: number,
    },
  },
  config: {
    rotate: number,
    align: string,
    verticalAlign: string,
    position: string,
    distance: number,
    onChange: () => void,
  },
}

export interface ReactEChartsProps {
  option: EChartsOption;
  style?: React.CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
};

type ECharts = ReturnType<typeof echarts.init>;

export default function EChartBase({
  option,
  style,
  settings,
  loading,
  theme,
  width,
  height,
}: ReactEChartsProps & { width?: string, height?: string }) {
  const chartRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = echarts.init(chartRef.current, theme);
    }

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = echarts.getInstanceByDom(chartRef.current);
      chart?.setOption(option, settings);
    }
    // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function.
  }, [option, settings, theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = echarts.getInstanceByDom(chartRef.current);
      loading === true ? chart?.showLoading() : chart?.hideLoading();
    }
  }, [loading, theme]);

  return (
    <span ref={chartRef} style={{ width: width || "100%", height: height || "300px", ...style }} />
  );
};
