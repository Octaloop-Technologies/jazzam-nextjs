"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import tokenStorage from '@/lib/utils/tokenStorage';
import { useAppSelector } from '@/redux/store';
import { getCurrentLang } from '@/lib/api/main-page';
import { getDictionary } from '@/lib/i18n/getDictionary';

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
  const [language, setLanguage] = useState<any>()


  const { accessToken } = tokenStorage?.getTokens();

  const lang = getCurrentLang();


  useEffect(() => {
    const fetchLanguage = async () => {
      const dict = (await getDictionary(lang));
      setLanguage(dict);
    }
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
    fetchLanguage();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSkillTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSkillType = arabicSkills[event.target.value] ? arabicSkills[event.target.value] : event.target.value ;
    setFormData({ ...formData, service: selectedSkillType, subServices: [] });
    console.log("susjdjjdjd*********", selectedSkillType)
    setSubServices(services.find((service: any) => service.label === selectedSkillType)?.sub_services);
    // Fetch sub-services based on selected skill type if needed
    // alert("hello")

  };

  const handleSerivceToggle = (subService: string) => {
    const translatedSubService = arabicSkills[subService] ? arabicSkills[subService] : subService;
    setFormData((prev) => ({
      ...prev,
      subServices: prev.subServices.includes(translatedSubService)
        ? prev.subServices.filter((s) => s !== translatedSubService)
        : [...prev.subServices, translatedSubService],
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

    const payload = {
      companyId: user?._id,
      companyName: formData.companyName.trim(),
      description: formData.description.trim(),
      service: formData.service.trim(),
      subServices: formData.subServices
    };


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
          <h1 className="text-[26px] text-pri font-[600]">{language?.dashboard?.companyDetails}</h1>
          <p className="mt-1 text-[14px] text-gray-300">
            {language?.dashboard?.completeYourCompanyInformation}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Company Name */}
          <div>
            <label className="text-left text-[12px] text-gray-500">
              {language?.dashboard?.companyName} *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder={language?.dashboard?.enterCompanyName}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-left text-[12px] text-gray-500">
              {language?.dashboard?.description} *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={language?.dashboard?.tellUsAboutYourCompany}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri mt-1 resize-none"
            />
          </div>

          {/* Skill Type Dropdown */}
          <div>
            <label className="text-left text-[12px] text-gray-500">
              {language?.dashboard?.selectSkillType} *
            </label>
            <select
              value={formData.service}
              onChange={handleSkillTypeChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri mt-1"
            >
              <option value="">{language?.dashboard?.chooseSkillType}</option>
              {services.map((service: any) => (
                <option key={service?.id} value={service?.id}>
                  {language?.dashboard[service?.label]}
                </option>
              ))}
            </select>
          </div>

          {/* Skills Display */}
          {formData.service && (
            <div>
              <label className="text-left text-[12px] text-gray-500">
                {language?.dashboard?.selectSkills} *
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
                    <span className="text-[14px] text-gray-700">{language?.dashboard[sub]}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* {error && <div className="text-red-500 text-sm text-center">{error}</div>} */}

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pri hover:bg-pri/90 text-white py-2 rounded-lg font-medium disabled:opacity-60"
            >
              {loading ? language?.dashboard?.saving : language?.dashboard?.complete}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyOnboardingForm;

const arabicSkills = {
  "تقنية المعلومات والبرمجيات": "Information Technology & Software",
  "التسويق الرقمي والإعلان": "Digital Marketing & Advertising",
  "التصميم والإبداع": "Design & Creative",
  "الكتابة وإنشاء المحتوى": "Writing & Content Creation",
  "الاستشارات والخدمات التجارية": "Business Consulting & Services",
  "المبيعات ودعم العملاء": "Sales & Customer Support",
  "الهندسة والعمارة": "Engineering & Architecture",
  "التعليم والتدريب": "Education & Training",
  "الصحة والعافية واللياقة البدنية": "Health, Wellness & Fitness",
  "العقارات والإنشاءات": "Real Estate & Construction",
  "تخطيط وإدارة الفعاليات": "Event Planning & Management",
  "السفر والضيافة": "Travel & Hospitality",
  "التصنيع والإنتاج": "Manufacturing & Production",
  "الخدمات اللوجستية والنقل": "Logistics & Transportation",
  "المالية والمحاسبة": "Finance & Accounting",
  "الخدمات القانونية": "Legal Services",
  "التجارة الإلكترونية وخدمات البيع بالتجزئة": "E-commerce & Retail Services",
  "الصوت والموسيقى": "Audio & Music",
  "خدمات مهنية متنوعة / أخرى": "Miscellaneous / Other Professional Services",

  "تطوير الويب": "Web Development",
  "تطوير تطبيقات الجوال (iOS/Android)": "Mobile App Development (iOS/Android)",
  "تطوير البرمجيات المخصصة": "Custom Software Development",
  "تصميم واجهات وتجربة المستخدم": "UI/UX Design",
  "خدمات DevOps والحوسبة السحابية": "DevOps & Cloud Services",
  "الأمن السيبراني": "Cybersecurity",
  "تطوير البلوك تشين": "Blockchain Development",
  "الذكاء الاصطناعي وتعلم الآلة": "AI & Machine Learning",
  "علم البيانات والتحليلات": "Data Science & Analytics",
  "ضمان الجودة واختبار البرمجيات": "QA & Software Testing",
  "تنفيذ أنظمة ERP/CRM": "ERP/CRM Implementation",
  "دعم تقنية المعلومات والخدمات المُدارة": "IT Support & Managed Services",

  "تحسين محركات البحث (SEO)": "SEO (Search Engine Optimization)",
  "إعلانات الدفع لكل نقرة / جوجل / السوشيال": "PPC / Google Ads / Social Ads",
  "إدارة وسائل التواصل الاجتماعي": "Social Media Management",
  "تسويق المحتوى": "Content Marketing",
  "التسويق عبر البريد الإلكتروني": "Email Marketing",
  "التسويق عبر المؤثرين": "Influencer Marketing",
  "التسويق بالعمولة": "Affiliate Marketing",
  "التسويق بالفيديو": "Video Marketing",
  "العلامة التجارية واستراتيجيتها": "Branding & Brand Strategy",
  "تحسين معدل التحويل": "Conversion Rate Optimization (CRO)",
  "إدارة السمعة الإلكترونية": "Online Reputation Management",

  "التصميم الجرافيكي": "Graphic Design",
  "تصميم الشعار وهوية العلامة التجارية": "Logo & Brand Identity Design",
  "الرسم التوضيحي": "Illustration",
  "الرسوم المتحركة والجرافيك الحركي": "Animation & Motion Graphics",
  "إنتاج وتحرير الفيديو": "Video Production & Editing",
  "النمذجة والتصيير ثلاثي الأبعاد": "3D Modeling & Rendering",
  "التصوير وتحرير الصور": "Photography & Photo Editing",
  "تصميم واجهات المستخدم والويب": "UI/UX & Web Design",
  "تصميم التغليف": "Packaging Design",
  "تصميم المطبوعات": "Print Design",

  "كتابة المحتوى الإعلاني": "Copywriting",
  "كتابة المدونات والمقالات": "Blog & Article Writing",
  "الكتابة التقنية": "Technical Writing",
  "الكتابة باسم الغير": "Ghostwriting",
  "كتابة السيناريو": "Scriptwriting",
  "الترجمة والتوطين": "Translation & Localization",
  "التدقيق اللغوي والتحرير": "Proofreading & Editing",
  "كتابة السيرة الذاتية": "Resume/CV Writing",
  "كتابة الكتب الإلكترونية": "eBook Writing",
  "كتابة البيانات الصحفية": "Press Release Writing",

  "استراتيجية وتخطيط الأعمال": "Business Strategy & Planning",
  "الاستشارات المالية ومسك الدفاتر": "Financial Consulting & Bookkeeping",
  "استشارات الموارد البشرية والتوظيف": "HR Consulting & Recruitment",
  "الاستشارات الضريبية": "Tax Consulting",
  "استشارات الشركات الناشئة": "Startup Consulting",
  "إدارة المشاريع": "Project Management",
  "إدارة العمليات": "Operations Management",
  "استشارات سلاسل الإمداد والخدمات اللوجستية": "Supply Chain & Logistics Consulting",
  "أبحاث السوق": "Market Research",

  "توليد العملاء المحتملين": "Lead Generation",
  "الاتصال البارد والتسويق الهاتفي": "Cold Calling & Telemarketing",
  "دعم العملاء (هاتف / دردشة / بريد)": "Customer Support (Phone/Chat/Email)",
  "خدمات المساعد الافتراضي": "Virtual Assistant Services",
  "تدريب المبيعات": "Sales Training",
  "إدارة أنظمة CRM": "CRM Management",

  "الهندسة المدنية": "Civil Engineering",
  "الهندسة الميكانيكية": "Mechanical Engineering",
  "الهندسة الكهربائية": "Electrical Engineering",
  "العمارة والتصميم الداخلي": "Architecture & Interior Design",
  "تصميم ورسم CAD": "CAD Design & Drafting",
  "الطباعة ثلاثية الأبعاد والنماذج الأولية": "3D Printing & Prototyping",
  "الهندسة الإنشائية": "Structural Engineering",
  "تصميم وتطوير المنتجات": "Product Design & Development",

  "إنشاء الدورات الإلكترونية": "Online Course Creation",
  "التدريب المؤسسي": "Corporate Training",
  "الدروس الخصوصية (مواد أكاديمية)": "Tutoring (Academic subjects)",
  "تدريب اللغات": "Language Training",
  "تطوير المهارات (ناعمة وتقنية)": "Skill Development (Soft skills, technical)",
  "التدريب والإرشاد": "Coaching & Mentoring",

  "التدريب البدني واللياقة": "Fitness Training & Coaching",
  "التغذية وتخطيط الحميات": "Nutrition & Diet Planning",
  "الصحة النفسية والإرشاد": "Mental Health & Counseling",
  "اليوغا والتأمل": "Yoga & Meditation",
  "العلاج الطبيعي": "Physiotherapy",
  "الكتابة الطبية والمحتوى الصحي": "Medical Writing / Health Content",

  "الوساطة العقارية": "Real Estate Brokerage",
  "إدارة الممتلكات": "Property Management",
  "البناء والتجديد": "Construction & Renovation",
  "تجهيز المنازل للبيع": "Home Staging",
  "تصوير العقارات": "Real Estate Photography/Videography",

  "تخطيط حفلات الزفاف": "Wedding Planning",
  "تخطيط الفعاليات المؤسسية": "Corporate Event Planning",
  "تخطيط الحفلات وأعياد الميلاد": "Party & Birthday Planning",
  "إدارة المعارض والمؤتمرات": "Exhibition & Trade Show Management",
  "إدارة الفعاليات الافتراضية": "Virtual Event Management",

  "خدمات وكالات السفر": "Travel Agency Services",
  "خدمات الإرشاد السياحي": "Tour Guide Services",
  "حجز وإدارة الفنادق": "Hotel Booking & Management",
  "حجز مواقع الفعاليات": "Event Venue Booking",
  "المساعدة في التأشيرات والهجرة": "Visa & Immigration Assistance",

  "تصنيع المنتجات": "Product Manufacturing",
  "خدمات OEM/ODM": "OEM/ODM Services",
  "سلاسل الإمداد والتوريد": "Supply Chain & Sourcing",
  "مراقبة الجودة والتفتيش": "Quality Control & Inspection",
  "التغليف ووضع الملصقات": "Packaging & Labeling",

  "الشحن والتخليص": "Freight Forwarding",
  "التخزين وتنفيذ الطلبات": "Warehousing & Fulfillment",
  "التوصيل للمرحلة الأخيرة": "Last-Mile Delivery",
  "التخليص الجمركي": "Customs Clearance",
  "إدارة الأساطيل": "Fleet Management",

  "مسك الدفاتر والمحاسبة": "Bookkeeping & Accounting",
  "التدقيق": "Auditing",
  "خدمات الرواتب": "Payroll Services",
  "النمذجة المالية": "Financial Modeling",
  "الاستشارات الاستثمارية": "Investment Advisory",
  "خدمات التأمين": "Insurance Services",

  "صياغة ومراجعة العقود": "Contract Drafting & Review",
  "الملكية الفكرية (علامات تجارية، براءات)": "Intellectual Property (Trademark, Patent)",
  "التقاضي وحل النزاعات": "Litigation & Dispute Resolution",
  "قانون الهجرة": "Immigration Law",
  "قانون الشركات": "Corporate Law",
  "قانون الأسرة": "Family Law",

  "إدارة متاجر أمازون / إيباي / شوبيفاي": "Amazon/eBay/Shopify Store Management",
  "إدراج المنتجات وتحسينها": "Product Listing & Optimization",
  "خدمات الدروبشيبينغ": "Dropshipping Services",
  "إدارة المخزون": "Inventory Management",
  "تنفيذ الطلبات": "Order Fulfillment",

  "إنتاج الموسيقى": "Music Production",
  "خدمات التعليق الصوتي": "Voice-Over Services",
  "تصميم الصوت": "Sound Design",
  "إنتاج البودكاست": "Podcast Production",
  "تحرير الصوت والمكساج": "Audio Editing & Mastering",

  "مساعد افتراضي": "Virtual Assistant",
  "إدخال البيانات": "Data Entry",
  "الأبحاث والاستبيانات": "Research & Surveys",
  "تفريغ الصوت": "Transcription",
  "الترجمة النصية والعناوين": "Subtitling & Captioning",

  "تسجيل براءات الاختراع والعلامات التجارية": "Patent & Trademark Filing",
  "كتابة المنح": "Grant Writing",

  "توفير...": "saving",
  "مكتمل": "complete"
}
