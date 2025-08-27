// =================| Format Date Ago |=================
export const formatTimeAgo = (dateString: string, useLocalTimezone = true): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();

    // Handle timezone differences
    let diffMs;
    if (useLocalTimezone) {
      // Use the user's local timezone (default behavior)
      diffMs = now.getTime() - date.getTime();
    } else {
      // Use consistent UTC time comparison to avoid timezone issues
      diffMs = now.getTime() - date.getTime();
      // Adjust for timezone offset differences
      const serverTimezoneOffset = date.getTimezoneOffset();
      const clientTimezoneOffset = now.getTimezoneOffset();
      diffMs += (serverTimezoneOffset - clientTimezoneOffset) * 60 * 1000;
    }

    // Convert to seconds, minutes, hours, days
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Format based on time difference
    if (diffSec < 60) {
      return "just now";
    } else if (diffMin < 60) {
      return `${diffMin}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else if (diffDays < 365) {
      // Format date for older entries within a year (e.g., "Jan 12")
      const month = date.toLocaleString("en-US", { month: "short" });
      const day = date.getDate();
      return `${month} ${day}`;
    } else {
      // For dates older than a year, include the year (e.g., "Jan 12, 2022")
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: useLocalTimezone ? undefined : "America/New_York",
      };
      return date.toLocaleDateString("en-US", options);
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};
