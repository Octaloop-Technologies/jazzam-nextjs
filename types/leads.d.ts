interface Lead {
  _id: string;
  linkedinProfileUrl: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  headline?: string;
  email?: string;
  phone?: string;
  followers?: number;
  connections?: number;
  publicIdentifier?: string;
  company?: string;
  companyIndustry?: string;
  companyWebsite?: string;
  companyLinkedin?: string;
  companyFoundedIn?: number;
  companySize?: string;
  jobTitle?: string;
  currentJobDuration?: string;
  currentJobDurationInYrs?: number;
  location?: string;
  addressCountryOnly?: string;
  addressWithCountry?: string;
  addressWithoutCountry?: string;
  profilePic?: string;
  profilePicHighQuality?: string;
  about?: string;
  creatorWebsite?: {
    name?: string;
    link?: string;
  };
  experiences?: any[];
  educations?: any[];
  skills?: any[];
  languages?: any[];
  interests?: any[];
  status: string;
  notes?: string;
  assignedTo?: string;
  tags?: string[];
  leadScore?: number;
  createdAt: string;
  updatedAt: string;
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
