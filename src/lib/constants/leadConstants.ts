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
// Company Industry Options (Based on LinkedIn data)
// ==========================================================
const companyIndustryOptions = [
  "Information Technology And Services",
  "Computer Software",
  "Internet",
  "Financial Services",
  "Banking",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Consulting",
  "Marketing And Advertising",
  "Legal Services",
  "Non-Profit Organization Management",
  "Government Administration",
  "Entertainment",
  "Agriculture",
  "Transportation",
  "Energy",
  "Construction",
  "Food & Beverages",
  "Telecommunications",
  "Media Production",
  "E-Learning",
  "Computer Networking",
  "Computer Games",
  "Biotechnology",
  "Pharmaceuticals",
  "Automotive",
  "Aerospace",
  "Defense & Space",
  "Other",
];

// ==========================================================
// Company Size Options (Based on LinkedIn data)
// ==========================================================
const companySizeOptions = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"];

// ==========================================================
// Sort Options (Based on backend model fields)
// ==========================================================
const sortOptions = [
  { value: "createdAt", label: "Date Created" },
  { value: "updatedAt", label: "Last Updated" },
  { value: "fullName", label: "Name" },
  { value: "company", label: "Company" },
  { value: "companyIndustry", label: "Industry" },
  { value: "location", label: "Location" },
  { value: "leadScore", label: "Lead Score" },
  { value: "followers", label: "Followers" },
  { value: "connections", label: "Connections" },
];

// ==========================================================
// Sort Order Options
// ==========================================================
const sortOrderOptions = [
  { value: "desc", label: "Desc", icon: "↓" },
  { value: "asc", label: "Asc", icon: "↑" },
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
// Company Industry Options with Display Labels
// ==========================================================
const companyIndustryOptionsWithLabels = companyIndustryOptions.map((industry) => ({
  value: industry,
  label: industry, // LinkedIn industries are already properly formatted
}));

export {
  statusOptions,
  sourceOptions,
  sourceOptionsWithLabels,
  companyIndustryOptions,
  companyIndustryOptionsWithLabels,
  companySizeOptions,
  sortOptions,
  sortOrderOptions,
  interestsOptions,
  formatDisplayLabel,
};
