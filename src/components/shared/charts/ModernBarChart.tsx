"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import * as d3 from "d3";

interface BarData {
  category: string;
  value: number;
}

interface ModernBarChartProps {
  data: BarData[];
  height?: number;
  width?: number;
  className?: string;
  id?: string;
  barColor?: string;
  textColor?: string;
  backgroundColor?: string;
  showGrid?: boolean;
  animate?: boolean;
}

const ModernBarChart = memo(
  ({
    data,
    height = 400,
    width = 600,
    className = "",
    id = "modern-bar-chart",
    barColor = "#1E8449",
    textColor = "#ffffff",
    backgroundColor = "#ffffff",
    showGrid = true,
    animate = true,
  }: ModernBarChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Set up resize observer to handle responsive behavior
    useEffect(() => {
      if (!chartRef.current) return;

      const resizeObserver = new ResizeObserver((entries) => {
        if (!entries[0]) return;
        const { width: containerWidth } = entries[0].contentRect;
        setDimensions({ width: containerWidth, height });
      });

      resizeObserver.observe(chartRef.current);

      return () => {
        if (chartRef.current) resizeObserver.unobserve(chartRef.current);
      };
    }, [height]);

    // Render the chart when data or dimensions change
    useEffect(() => {
      if (!chartRef.current || !dimensions.width || data.length === 0) return;

      const margin = { top: 40, right: 30, bottom: 60, left: 60 };
      const chartWidth = dimensions.width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      // Clear previous chart
      d3.select(chartRef.current).selectAll("*").remove();

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", `0 0 ${dimensions.width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Add background rectangle without border
      svg
        .append("rect")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("fill", backgroundColor)
        .attr("rx", 12)
        .attr("ry", 12);

      // X scale
      const x = d3
        .scaleBand()
        .range([0, chartWidth])
        .domain(data.map((d) => d.category))
        .padding(0.3);

      // Y scale
      const maxValue = d3.max(data, (d) => d.value) || 0;
      const y = d3
        .scaleLinear()
        .domain([0, maxValue * 1.1]) // Dynamic domain with 10% padding
        .range([chartHeight, 0]);

      // Add Y axis with grid lines
      const yAxis = d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => d.toString())
        .tickSize(-chartWidth) // Extend tick marks across chart
        .tickPadding(10);

      const yAxisGroup = svg.append("g").attr("class", "y-axis");

      yAxisGroup.call(yAxis);

      // Style grid lines conditionally
      if (showGrid) {
        yAxisGroup
          .selectAll(".tick line")
          .attr("stroke", "#f3f4f6")
          .attr("stroke-width", 1)
          .attr("opacity", 0.5);
      } else {
        // Remove grid lines when showGrid is false
        yAxisGroup.selectAll(".tick line").remove();
      }

      // Style Y axis
      yAxisGroup
        .selectAll(".tick text")
        .style("font-size", "12px")
        .style("fill", "#6b7280")
        .style("font-family", "Inter, system-ui, sans-serif");

      yAxisGroup.selectAll(".domain").attr("stroke", "#e5e7eb").attr("stroke-width", 1);

      // Add X axis
      const xAxis = d3.axisBottom(x).tickSize(0).tickPadding(15);

      svg
        .append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .attr("class", "x-axis")
        .call(xAxis);

      // Style X axis
      svg
        .selectAll(".x-axis .tick text")
        .style("font-size", "14px")
        .style("fill", "#374151")
        .style("font-weight", "500")
        .style("font-family", "Inter, system-ui, sans-serif");

      svg.selectAll(".x-axis .domain").attr("stroke", "#e5e7eb").attr("stroke-width", 1);

      // Add bars with rounded top corners only
      const bars = svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.category) || 0)
        .attr("y", chartHeight) // Start from bottom
        .attr("width", x.bandwidth())
        .attr("height", 0) // Start with 0 height
        .attr("fill", barColor)
        .attr("rx", 20) // Rounded top corners only
        .attr("ry", 20)
        .style("opacity", 1); // Explicitly set initial opacity

      // Add value labels inside bars
      const labels = svg
        .selectAll(".bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", (d) => (x(d.category) || 0) + x.bandwidth() / 2)
        .attr("y", chartHeight)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .style("fill", textColor)
        .style("font-family", "Inter, system-ui, sans-serif")
        .style("opacity", 0); // Start invisible

      // Animate bars and labels
      if (animate) {
        bars
          .transition()
          .duration(800)
          .ease(d3.easeCubicOut)
          .attr("y", (d) => y(d.value))
          .attr("height", (d) => chartHeight - y(d.value));

        labels
          .transition()
          .duration(800)
          .ease(d3.easeCubicOut)
          .delay(400)
          .attr("y", (d) => y(d.value) + (chartHeight - y(d.value)) / 2)
          .style("opacity", 1)
          .text((d) => d.value.toString()); // Ensure text content is set
      } else {
        bars.attr("y", (d) => y(d.value)).attr("height", (d) => chartHeight - y(d.value));

        labels
          .attr("y", (d) => y(d.value) + (chartHeight - y(d.value)) / 2)
          .style("opacity", 1)
          .text((d) => d.value.toString()); // Ensure text content is set
      }

      // Add hover effects
      bars
        .on("mouseover", function () {
          d3.select(this).transition().duration(150).style("opacity", 0.8);
        })
        .on("mouseout", function () {
          d3.select(this).transition().duration(150).style("opacity", 1);
        });
    }, [data, dimensions, height, barColor, textColor, backgroundColor, showGrid, animate]);

    return (
      <div
        id={id}
        className={`modern-chart-container ${className || ""}`}
        ref={chartRef}
        style={{
          height: `${height}px`,
          width: "100%",
          minWidth: `${width}px`,
        }}
      />
    );
  }
);

ModernBarChart.displayName = "ModernBarChart";

export default ModernBarChart;
