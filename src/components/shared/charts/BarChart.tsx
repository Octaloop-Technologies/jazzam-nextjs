"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import * as d3 from "d3";
import { getThemeColors } from "@/lib/utils/chartUtils";

interface SourceData {
  name: string;
  total_files: number;
}

interface ChartProps {
  title?: string;
  id?: string;
}

interface BarChartProps extends ChartProps {
  data: SourceData[];
  height?: number;
  selectedItem?: string | null;
  onItemClick?: (item: SourceData) => void;
  className?: string;
}

const BarChart = memo(
  ({
    data,
    height = 300,
    title = "Total Files by Folder",
    selectedItem,
    onItemClick,
    className = "",
    id = "bar-chart",
  }: BarChartProps) => {
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

      const margin = { top: 30, right: 20, bottom: 70, left: 40 };
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

      // X axis
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.name))
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

      // Add Y axis
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.total_files) || 0])
        .range([chartHeight, 0]);

      svg.append("g").attr("class", "axis").call(d3.axisLeft(y)).style("font-size", "10px");

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
      const { primary } = getThemeColors();

      // Add bars
      svg
        .selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.name) || 0)
        .attr("y", (d) => y(d.total_files))
        .attr("width", x.bandwidth())
        .attr("height", (d) => chartHeight - y(d.total_files))
        .attr("fill", primary)
        .on("click", (event, d) => {
          if (onItemClick) onItemClick(d);
        })
        .style("cursor", onItemClick ? "pointer" : "default")
        .style("opacity", (d) => (d.name === selectedItem ? 1 : 0.7))
        .on("mouseover", function () {
          d3.select(this).style("opacity", 1);
        })
        .on("mouseout", function (event, d) {
          if (d.name !== selectedItem) {
            d3.select(this).style("opacity", 0.7);
          }
        });
    }, [data, dimensions, selectedItem, onItemClick, title]);

    return (
      <div
        id={id}
        className={`chart-container ${className || ""}`}
        ref={chartRef}
        style={{ height: `${height}px`, width: "100%" }}
      />
    );
  }
);

BarChart.displayName = "BarChart";

export default BarChart;
