// ==========================================================
// Status Options
// ==========================================================
const statusOptions = [
  { value: "hot", label: "Hot Lead", color: "hot" },
  { value: "warm", label: "Warm Lead", color: "sec" },
  { value: "cold", label: "Cold Lead", color: "cold" },
  { value: "qualified", label: "Qualified", color: "pipeline" },
];

// ==========================================================
// Source Options
// ==========================================================
const sourceOptions = [
  "website",
  "social media",
  "email campaign",
  "cold outreach",
  "referral",
  "event",
  "advertisement",
  "content marketing",
  "seo",
  "partnership",
  "direct sales",
  "linkedin",
  "other",
];

// ==========================================================
// Industry Options
// ==========================================================
const industryOptions = [
  "technology",
  "healthcare",
  "finance",
  "education",
  "manufacturing",
  "retail",
  "real estate",
  "consulting",
  "marketing",
  "legal",
  "non-profit",
  "government",
  "entertainment",
  "agriculture",
  "transportation",
  "energy",
  "construction",
  "food & beverage",
  "telecommunications",
  "other",
];

// ==========================================================
// Company Size Options
// ==========================================================
const companySizeOptions = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1001-5000 employees",
  "5000+ employees",
];

// ==========================================================
// Predefined Interests
// ==========================================================
const interestsOptions = [
  "AI",
  "Cloud Infrastructure",
  "DevOps",
  "Machine Learning",
  "Data Analytics",
  "Cybersecurity",
  "Mobile Development",
  "Web Development",
  "Other",
];

// ==========================================================
// Helper function to format enum values for display
// ==========================================================
const formatDisplayLabel = (value: string): string => {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// ==========================================================
// Source Options with Display Labels
// ==========================================================
const sourceOptionsWithLabels = sourceOptions.map((source) => ({
  value: source,
  label: formatDisplayLabel(source),
}));

// ==========================================================
// Industry Options with Display Labels
// ==========================================================
const industryOptionsWithLabels = industryOptions.map((industry) => ({
  value: industry,
  label: formatDisplayLabel(industry),
}));

export {
  statusOptions,
  sourceOptions,
  sourceOptionsWithLabels,
  industryOptions,
  industryOptionsWithLabels,
  companySizeOptions,
  interestsOptions,
  formatDisplayLabel,
};
