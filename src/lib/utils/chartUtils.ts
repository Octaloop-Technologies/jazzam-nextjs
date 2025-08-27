"use client";

// Parse file size string to number (in MB)
export const parseSize = (sizeStr: string): number => {
  const match = sizeStr.match(/^([\d.]+)\s*([KMGT]?B)$/i);
  if (!match) return 0;

  const [, numStr, unit] = match;
  const num = parseFloat(numStr);

  switch (unit.toUpperCase()) {
    case "KB":
      return num / 1024;
    case "MB":
      return num;
    case "GB":
      return num * 1024;
    case "TB":
      return num * 1024 * 1024;
    default:
      return num / (1024 * 1024); // Bytes to MB
  }
};

// Format number with commas for thousands
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
  else return (bytes / 1073741824).toFixed(2) + " GB";
};

// Get theme colors from CSS variables
export const getThemeColors = (): { primary: string; secondary: string } => {
  const primary = getComputedStyle(document.documentElement).getPropertyValue("--pri").trim();
  const secondary = getComputedStyle(document.documentElement).getPropertyValue("--sec").trim();

  return {
    primary: primary || "#028f83",
    secondary: secondary || "#00c2b2",
  };
};
