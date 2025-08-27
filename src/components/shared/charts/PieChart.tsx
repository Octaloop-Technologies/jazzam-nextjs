"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import * as d3 from "d3";
import { getThemeColors, parseSize } from "@/lib/utils/chartUtils";

interface ChartProps {
  title?: string;
  id?: string;
}

interface SourceData {
  name: string;
  size: string;
}

interface PieChartProps extends ChartProps {
  data: SourceData[];
  height?: number;
  selectedItem?: string | null;
  onItemClick?: (item: SourceData) => void;
  valueKey?: keyof SourceData | "sizeInMB";
  className?: string;
}

const PieChart = memo(
  ({
    data,
    height = 300,
    title = "Storage Allocation by Folder",
    selectedItem,
    onItemClick,
    valueKey = "sizeInMB",
    className = "",
    id = "pie-chart",
  }: PieChartProps) => {
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

      const radius = Math.min(dimensions.width, dimensions.height) / 2.5;

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
        .attr("transform", `translate(${dimensions.width / 2},${dimensions.height / 2})`);

      // Prepare data: convert size strings to numbers if needed
      const processedData = data.map((source) => ({
        name: source.name,
        value:
          valueKey === "sizeInMB" ? parseSize(source.size) : source[valueKey as keyof SourceData],
        original: source,
      }));

      // Get theme colors
      const { primary, secondary } = getThemeColors();

      // Color scale - use theme colors for interpolation
      const color = d3
        .scaleOrdinal()
        .domain(processedData.map((d) => d.name))
        .range(d3.quantize((t) => d3.interpolateRgb(primary, secondary)(t), processedData.length));

      // Compute position of each group on the pie
      const pie = d3
        .pie<(typeof processedData)[0]>()
        .sort(null)
        .value((d) => Number(d.value));

      const arc = d3
        .arc<d3.PieArcDatum<(typeof processedData)[0]>>()
        .innerRadius(0)
        .outerRadius(radius * 0.8);

      // Add title
      svg
        .append("text")
        .attr("x", 0)
        .attr("y", -radius - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(title);

      // Build pie chart
      const arcs = svg
        .selectAll("arc")
        .data(pie(processedData))
        .enter()
        .append("g")
        .attr("class", "arc");

      // Add slices
      arcs
        .append("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data.name) as string)
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", (d) => (d.data.original.name === selectedItem ? 1 : 0.7))
        .style("cursor", onItemClick ? "pointer" : "default")
        .on("click", (event, d) => {
          if (onItemClick) onItemClick(d.data.original);
        })
        .on("mouseover", function () {
          d3.select(this).style("opacity", 1);
        })
        .on("mouseout", function (event, d) {
          if (d.data.original.name !== selectedItem) {
            d3.select(this).style("opacity", 0.7);
          }
        });

      // Add labels
      arcs
        .append("text")
        .attr("transform", (d) => {
          const centroid = arc.centroid(d);
          const x = centroid[0] * 1.5;
          const y = centroid[1] * 1.5;
          return `translate(${x},${y})`;
        })
        .attr("dy", "0.35em")
        .text((d) => {
          // Only show label if the slice is big enough
          const value = Number(d.data.value);
          const total = d3.sum(processedData, (d) => Number(d.value));
          const percentage = (value / total) * 100;
          return percentage > 5 ? d.data.name : "";
        })
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#333");

      // Add polylines for labels
      arcs
        .filter((d) => {
          const value = Number(d.data.value);
          const total = d3.sum(processedData, (d) => Number(d.value));
          const percentage = (value / total) * 100;
          return percentage > 5;
        })
        .append("polyline")
        .attr("points", (d) => {
          const centroid = arc.centroid(d);
          const midAngle = Math.atan2(centroid[1], centroid[0]);
          const x1 = Math.cos(midAngle) * radius * 0.8;
          const y1 = Math.sin(midAngle) * radius * 0.8;
          const x2 = Math.cos(midAngle) * radius * 1.2;
          const y2 = Math.sin(midAngle) * radius * 1.2;
          return [x1, y1, x2, y2].join(",");
        })
        .style("fill", "none")
        .style("stroke", "#999")
        .style("stroke-width", "1px");
    }, [data, dimensions, selectedItem, onItemClick, title, valueKey]);

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

PieChart.displayName = "PieChart";

export default PieChart;
