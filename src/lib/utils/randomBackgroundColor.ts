export const randomBackgroundColor = (str: string) => {
  const colors = [
    "bg-blue-500/30",
    "bg-red-500/30",
    "bg-green-500/30",
    "bg-yellow-500/30",
    "bg-purple-500/30",
    "bg-pink-500/30",
    "bg-indigo-500/30",
    "bg-teal-500/30",
  ];

  // Calculate a hash value from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use the absolute value of hash modulo colors length
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};
