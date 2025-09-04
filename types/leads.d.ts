interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  followUp: string;
  status: string;
  date: string;
}

interface LeadScore {
  score: number;
  color: string;
}

interface LeadFormData {
  // Personal Information
  name: string;
  email: string;
  phone: string;
  linkedinProfile: string;

  // Company Information
  company: string;
  location: string;
  website: string;
  industry: string;
  companySize: string;
  source: string;

  // Additional Information
  interests: string[];
  notes: string;
  status: string;

  // Index signature for useForm compatibility
  [key: string]: unknown;
}
