"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import tokenStorage from '@/lib/utils/tokenStorage';
import { useAppSelector } from '@/redux/store';

type Props = {
  onSubmit?: (data: CompanyOnboardingData) => void;
  onBack?: () => void;
};

interface CompanyOnboardingData {
  companyName: string;
  description: string;
  service: string;
  subServices: string[];
  otherSkill?: string;
}

const CompanyOnboardingForm = ({ onSubmit, onBack }: Props) => {
  const [services, setServices] = useState<any>([]);
  const [subServices, setSubServices] = useState<any>([]);
  const [formData, setFormData] = useState<CompanyOnboardingData>({
    companyName: "",
    description: "",
    service: "",
    subServices: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user  = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  const { accessToken } = tokenStorage?.getTokens();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/services`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data.data); // Assuming the API returns { data: [...] }
      } catch (error) {
        console.error(error);
      }
    };

    fetchServices();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSkillTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSkillType = event.target.value;
    setFormData({ ...formData, service: selectedSkillType, subServices: [] });
    setSubServices(services.find((service: any) => service.label === selectedSkillType)?.sub_services);
    // Fetch sub-services based on selected skill type if needed
    // alert("hello")

  };

  const handleSerivceToggle = (subService: string) => {
    setFormData((prev) => ({
      ...prev,
      subServices: prev.subServices.includes(subService)
        ? prev.subServices.filter((s) => s !== subService)
        : [...prev.subServices, subService],
    }));
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

    if (!formData.service) {
      setError("Please select a service type");
      return;
    }

    if (formData.subServices.length === 0) {
      setError("Please select at least one sub service");
      return;
    }

    setLoading(true);

    try {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        const payload = {
          companyId: user?._id,
          companyName: formData.companyName.trim(),
          description: formData.description.trim(),
          service: formData.service.trim(),
          subServices: formData.subServices
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/company-onboarding`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
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
              value={formData.service}
              onChange={handleSkillTypeChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri mt-1"
            >
              <option value="">-- Choose a skill type --</option>
              {services.map((service: any) => (
                <option key={service?.id} value={service?.id}>
                  {service?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Skills Display */}
          {formData.service && (
            <div>
              <label className="text-left text-[12px] text-gray-500">
                Select Skills (at least one) *
              </label>

              <div className="grid grid-cols-2 gap-3 mt-2">
                {subServices?.map((sub: any) => (
                  <label
                    key={sub}
                    className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      value={sub}
                      checked={formData.subServices.includes(sub)}
                      onChange={() => handleSerivceToggle(sub)}
                      className="w-4 h-4 accent-pri"
                    />
                    <span className="text-[14px] text-gray-700">{sub}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
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