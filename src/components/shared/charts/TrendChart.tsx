"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import * as d3 from "d3";
import { getThemeColors } from "@/lib/utils/chartUtils";

interface ChartProps {
  title?: string;
  id?: string;
}

interface TrendDataPoint {
  date: string;
  count: number;
}

interface TrendChartProps extends ChartProps {
  data: TrendDataPoint[];
  height?: number;
  dateFormat?: string;
  showTooltip?: boolean;
  lineColor?: string;
  dotColor?: string;
  xLabel?: string;
  yLabel?: string;
  ticksCount?: number;
  className?: string;
}

const TrendChart = memo(
  ({
    data,
    height = 250,
    title = "Weekly Trend Chart",
    dateFormat = "MM-dd",
    showTooltip = true,
    xLabel = "Date",
    yLabel = "Count",
    ticksCount = 5,
    className = "",
    id = "trend-chart",
  }: TrendChartProps) => {
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

      const margin = { top: 20, right: 20, bottom: 50, left: 50 };
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

      // Format dates for display
      const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        // Return in MM-DD format
        return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
          2,
          "0"
        )}`;
      };

      // X axis using scaleBand for discrete dates
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.date))
        .padding(0.1);

      svg
        .append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .attr("class", "axis")
        .call(
          d3.axisBottom(x).tickFormat((d: string, i: number) => (i % 2 === 0 ? formatDate(d) : ""))
        )
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "10px");

      // X axis label
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", chartHeight + margin.bottom - 4)
        .style("font-size", "12px")
        .text(xLabel);

      // Y axis
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.count) as number])
        .range([chartHeight, 0])
        .nice(); // Makes the scale nicer at the edges

      svg
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(ticksCount))
        .style("font-size", "10px");

      // Y axis label
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -chartHeight / 2)
        .style("font-size", "12px")
        .text(yLabel);

      // Add title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(title);

      // Get theme colors
      const { primary } = getThemeColors();

      // Add the line
      const line = d3
        .line<TrendDataPoint>()
        .x((d) => (x(d.date) || 0) + x.bandwidth() / 2)
        .y((d) => y(d.count));

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", primary)
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add the dots
      svg
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => (x(d.date) || 0) + x.bandwidth() / 2)
        .attr("cy", (d) => y(d.count))
        .attr("r", 4)
        .attr("fill", primary)
        .attr("stroke", "white")
        .attr("stroke-width", 1.5);

      // Add tooltip for dots
      if (showTooltip) {
        const tooltip = d3
          .select(chartRef.current)
          .append("div")
          .style("position", "absolute")
          .style("visibility", "hidden")
          .style("background-color", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "5px 10px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none");

        svg
          .selectAll("circle")
          .on("mouseover", function (event, d) {
            d3.select(this).transition().duration(200).attr("r", 6);

            const dataPoint = d as TrendDataPoint;
            tooltip
              .style("visibility", "visible")
              .html(`Date: ${dataPoint.date}<br>Count: ${dataPoint.count.toLocaleString()}`)
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY - 30}px`);
          })
          .on("mouseout", function () {
            d3.select(this).transition().duration(200).attr("r", 4);
            tooltip.style("visibility", "hidden");
          });
      }
    }, [data, dimensions, title, dateFormat, showTooltip, xLabel, yLabel, ticksCount]);

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

TrendChart.displayName = "TrendChart";

export default TrendChart;
