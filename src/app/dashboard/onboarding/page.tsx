"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import tokenStorage from '@/lib/utils/tokenStorage';

type Props = {
  onSubmit?: (data: CompanyOnboardingData) => void;
  onBack?: () => void;
};

interface CompanyOnboardingData {
  companyName: string;
  description: string;
  skillType: string;
  skills: string[];
  otherSkill?: string;
}

const softSkills = [
  { id: "communication", label: "Communication" },
  { id: "teamwork", label: "Teamwork" },
  { id: "creativity", label: "Creativity" },
  { id: "problem_solving", label: "Problem Solving" },
  { id: "leadership", label: "Leadership" },
  { id: "time_management", label: "Time Management" },
  { id: "adaptability", label: "Adaptability" },
  { id: "critical_thinking", label: "Critical Thinking" },
  { id: "other", label: "Other" }
];

const managerialSkills = [
  { id: "project_management", label: "Project Management" },
  { id: "budgeting", label: "Budgeting" },
  { id: "strategic_planning", label: "Strategic Planning" },
  { id: "team_building", label: "Team Building" },
  { id: "performance_management", label: "Performance Management" },
  { id: "decision_making", label: "Decision Making" },
  { id: "conflict_resolution", label: "Conflict Resolution" },
  { id: "stakeholder_management", label: "Stakeholder Management" },
  { id: "other", label: "Other" }
];

const skillTypeOptions = [
  { id: "soft_skills", label: "Soft Skills" },
  { id: "managerial_skills", label: "Managerial Skills" },
  { id: "other", label: "Other" },
];

const CompanyOnboardingForm = ({ onSubmit, onBack }: Props) => {
  const [formData, setFormData] = useState<CompanyOnboardingData>({
    companyName: "",
    description: "",
    skillType: "",
    skills: [],
    otherSkill: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { accessToken } = tokenStorage?.getTokens();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const skillType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      skillType,
      skills: [],
      otherSkill: "",
    }));
  };

  const handleSkillToggle = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((s) => s !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  const getSkillsForType = () => {
    switch (formData.skillType) {
      case "soft_skills":
        return softSkills;
      case "managerial_skills":
        return managerialSkills;
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.companyName.trim()) {
      setError("Company name is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (!formData.skillType) {
      setError("Please select a skill type");
      return;
    }

    if (formData.skillType === "other" && !formData.otherSkill?.trim()) {
      setError("Please enter a skill");
      return;
    }

    if (formData.skillType !== "other" && formData.skills.length === 0) {
      setError("Please select at least one skill");
      return;
    }

    setLoading(true);

    try {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        const payload = {
          companyName: formData.companyName.trim(),
          description: formData.description.trim(),
          skillType: formData.skillType.trim(),
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/company-onboarding`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", 
            Authorization: `Bearer ${accessToken}`
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Onboarding failed");
          setLoading(false);
          return;
        }

        // Redirect on success
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Network error");
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex-col-center min-h-screen w-full p-4">
      <div className="mt-8 p-5 bg-white rounded-3xl max-w-[500px] w-full">
        <div className="capitalize leading-none tracking-wide mb-6 text-center">
          <h1 className="text-[26px] text-pri font-[600]">Company Details</h1>
          <p className="mt-1 text-[14px] text-gray-300">
            Complete your company information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Company Name */}
          <div>
            <label className="text-left text-[12px] text-gray-500">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Enter company name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-left text-[12px] text-gray-500">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about your company"
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri mt-1 resize-none"
            />
          </div>

          {/* Skill Type Dropdown */}
          <div>
            <label className="text-left text-[12px] text-gray-500">
              Select Skill Type *
            </label>
            <select
              value={formData.skillType}
              onChange={handleSkillTypeChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri mt-1"
            >
              <option value="">-- Choose a skill type --</option>
              {skillTypeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Skills Display */}
          {formData.skillType && formData.skillType !== "other" && (
            <div>
              <label className="text-left text-[12px] text-gray-500">
                Select Skills (at least one) *
              </label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {getSkillsForType().map((skill) => (
                  <label
                    key={skill.id}
                    className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill.id)}
                      onChange={() => handleSkillToggle(skill.id)}
                      className="w-4 h-4 accent-pri"
                    />
                    <span className="text-[14px] text-gray-700">{skill.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Other Skill Input */}
          {formData.skillType === "other" && (
            <div>
              <label className="text-left text-[12px] text-gray-500">
                Enter Skill *
              </label>
              <input
                type="text"
                name="otherSkill"
                value={formData.otherSkill}
                onChange={handleInputChange}
                placeholder="Enter your skill"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri mt-1"
              />
            </div>
          )}

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pri hover:bg-pri/90 text-white py-2 rounded-lg font-medium disabled:opacity-60"
            >
              {loading ? "Saving..." : "Complete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyOnboardingForm;