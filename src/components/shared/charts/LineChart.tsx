"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import * as d3 from "d3";
import { getThemeColors } from "@/lib/utils/chartUtils";

interface ChartProps {
  title?: string;
  id?: string;
}

interface SubfolderData {
  name: string;
  total_files: number;
}

interface LineChartProps extends ChartProps {
  data: SubfolderData[];
  height?: number;
  xKey?: keyof SubfolderData;
  yKey?: keyof SubfolderData;
  showDots?: boolean;
  lineColor?: string;
  dotColor?: string;
  sortData?: boolean;
  xLabel?: string;
  yLabel?: string;
  className?: string;
}

const LineChart = memo(
  ({
    data,
    height = 300,
    title = "Files Distribution",
    xKey = "name",
    yKey = "total_files",
    showDots = true,
    sortData = true,
    xLabel,
    yLabel,
    className = "",
    id = "line-chart",
  }: LineChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Set up resize observer to handle responsive behavior
    useEffect(() => {
      if (!chartRef.current) return;

      const resizeObserver = new ResizeObserver((entries) => {
        if (!entries[0]) return;
        const { width } = entries[0].contentRect;
        setDimensions({ width, height });
      });

      resizeObserver.observe(chartRef.current);

      return () => {
        if (chartRef.current) resizeObserver.unobserve(chartRef.current);
      };
    }, [height]);

    // Render the chart when data or dimensions change
    useEffect(() => {
      if (!chartRef.current || !dimensions.width || data.length === 0) return;

      const margin = { top: 30, right: 20, bottom: 60, left: 50 };
      const width = dimensions.width - margin.left - margin.right;
      const chartHeight = dimensions.height - margin.top - margin.bottom;

      // Clear previous chart
      d3.select(chartRef.current).selectAll("*").remove();

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", "100%")
        .attr("height", dimensions.height)
        .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Sort data if needed
      const chartData = sortData
        ? [...data].sort((a, b) => {
            // Try to sort numerically first
            const numA = parseFloat(String(a[xKey]));
            const numB = parseFloat(String(b[xKey]));
            if (!isNaN(numA) && !isNaN(numB)) {
              return numA - numB;
            }
            // Fall back to string sort
            return String(a[xKey]).localeCompare(String(b[xKey]));
          })
        : data;

      // X axis
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(chartData.map((d) => String(d[xKey])))
        .padding(0.2);

      svg
        .append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .attr("class", "axis")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "10px");

      // X axis label
      if (xLabel) {
        svg
          .append("text")
          .attr("text-anchor", "middle")
          .attr("x", width / 2)
          .attr("y", chartHeight + margin.bottom - 5)
          .style("font-size", "12px")
          .text(xLabel);
      }

      // Y axis
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(chartData, (d) => Number(d[yKey])) || 0])
        .range([chartHeight, 0]);

      svg.append("g").attr("class", "axis").call(d3.axisLeft(y)).style("font-size", "10px");

      // Y axis label
      if (yLabel) {
        svg
          .append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left + 15)
          .attr("x", -chartHeight / 2)
          .style("font-size", "12px")
          .text(yLabel);
      }

      // Add title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(title);

      // Get theme colors
      const { secondary } = getThemeColors();

      // Add the line
      svg
        .append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", secondary)
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .line<SubfolderData>()
            .x((d) => (x(String(d[xKey])) || 0) + x.bandwidth() / 2)
            .y((d) => y(Number(d[yKey])))
        );

      // Add the points
      if (showDots) {
        svg
          .selectAll("dot")
          .data(chartData)
          .enter()
          .append("circle")
          .attr("cx", (d) => (x(String(d[xKey])) || 0) + x.bandwidth() / 2)
          .attr("cy", (d) => y(Number(d[yKey])))
          .attr("r", 5)
          .attr("fill", secondary)
          .append("title")
          .text((d) => `${d[xKey]}: ${d[yKey]}`);
      }
    }, [data, dimensions, title, xKey, yKey, showDots, sortData, xLabel, yLabel]);

    return (
      <div
        id={id}
        className={`chart-container ${className}`}
        ref={chartRef}
        style={{ height: `${height}px`, width: "100%" }}
      />
    );
  }
);

LineChart.displayName = "LineChart";

export default LineChart;
