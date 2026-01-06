"use client";
import Logo from '@/components/shared/logo/Logo';
import { EyeSvg } from '@/components/svgs/NavbarSvgs';
import { getCurrentLang } from '@/lib/api/main-page';
import { getDictionary } from '@/lib/i18n/getDictionary';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SignupForm = () => {
    const [language, setLanguage] = useState<any>();
    const [userType, setUserType] = useState<string>("");
    const [showSignUp, setShowSignUp] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const router = useRouter();

    const checkEmail = () => {
        const corporateEmailRegex = /^[a-zA-Z0-9._%+-]+@(?!gmail\.com$)(?!yahoo\.com$)(?!hotmail\.com$)(?!outlook\.com$)(?!live\.com$)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return corporateEmailRegex;
    }

    const checkPassword = () => {
        // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
        return passwordRegex;
    }

    useEffect(() => {
        const fetchLang = async () => {
            const lang = getCurrentLang();
            const dict = (await getDictionary(lang))?.login;
            setLanguage(dict)
        }
        fetchLang()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const mapSignupError = (message?: string) => {
        console.log('message&&&&', message)
        if (!message) return language?.somethingWentWrong;
      
        if (message.includes("Disposable")) {
          return language?.disposableEmailErrMsg;
        }
      
        if (message.includes("cannot receive emails")) {
          return language?.invalidDomainErrMsg;
        }
      
        if (message.includes("already registered")) {
          return language?.emailAlreadyExist;
        }
      
        if (message.includes("Passwords do not match")) {
          return language?.passwordsNotMatch;
        }
      
        return message; // fallback
      };
      

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email) {
            setError(language?.emptyEmailField)
            return;
        }

        if (!formData.password) {
            setError(language?.emptyPasswordField)
            return;
        }

        if (!formData.confirmPassword) {
            setError(language?.emptyConfirmPasswordField)
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError(language?.passwordsNotMatch)
            return;
        }

        if (!checkPassword().test(formData.password)) {
            setError(language?.passwordComplexityErrMsg)
            return;
        }

        if (!checkEmail().test(formData.email)) {
            setError(language?.personalEmailErrMsg)
            return;
        }
        setError("");

        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    userType
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const userMessage = mapSignupError(data?.message);
                throw new Error(userMessage);
            }

            // Redirect to verification page
            router.push(`/verify-email/${formData.email}`);
        } catch (err) {
            console.error("sign up error:", err);
            setError(err?.message || language?.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!showSignUp ?
                <div className='flex flex-col justify-center items-center h-[80vh]'>
                    <Logo />
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className='text-2xl font-semibold mb-3'>{language?.selectTypeHeading}</h1>
                        <p className='mb-5'>{language?.selectTypeDescription}</p>
                    </div>
                    <div className='flex flex-col sm:flex-row justify-center items-center gap-5'>
                        <div className={`${userType === "user" ? "bg-gray-150" : "bg-gray-100"} min-w-[20rem] hover:bg-gray-150 hover:cursor-pointer flex flex-col rounded-2xl shadow-2xl p-10 gap-1`} onClick={() => setUserType("user")}>
                            <div className='flex justify-center'>
                                <Image
                                    src={"/assets/images/user_logo.png"}
                                    alt="Profile"
                                    width={83}
                                    height={83}
                                    className=""
                                />
                            </div>
                            <p className='text-center'>{language?.continueAsUser}</p>
                        </div>
                        <div className={`${userType === "company" ? "bg-gray-150" : "bg-gray-100"} min-w-[20rem] hover:bg-gray-150 hover:cursor-pointer flex flex-col rounded-2xl shadow-2xl p-10 gap-1`} onClick={() => setUserType("company")}>
                            <div className='flex justify-center'>
                                <Image
                                    src={"/assets/images/company_logo.png"}
                                    alt="Profile"
                                    width={83}
                                    height={83}
                                    className=""
                                />
                            </div>
                            <p className='text-center'>{language?.continueAsCompany}</p>
                        </div>
                    </div>
                    <div className='flex justify-center mt-8'>
                        <button disabled={userType === "" ? true : false } className={`${userType === "" ? "bg-green-300 hover:bg-green-300" : "bg-green-600 cursor-pointer hover:bg-green-700"}  border rounded-full text-white py-2 px-10`} onClick={() => setShowSignUp(true)}>{language?.save}</button>
                    </div>
                </div>
                :
                <div className="mt-8 p-5 bg-white rounded-3xl max-w-[400px] w-full">
                    <h1 className='text-2xl font-semibold mb-3'>{language?.signUp}</h1>
                    <form className="mt-4 flex flex-col gap-2" onSubmit={handleSignup}>
                        <label className="text-left text-[12px] text-gray-500">
                            {language?.signUpEmail}
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder={"you@example.com"}
                            value={formData.email}
                            onChange={handleInputChange}
                            className="flex w-full px-3 py-2 border border-green-600 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-pri"
                        />
                        <label className="text-left text-[12px] text-gray-500">
                            {language?.signUpPassword}
                        </label>
                        <div className="flex w-full px-3 py-2 border border-green-600 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-pri">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                placeholder={"••••••••"}
                                className="w-full  focus:outline-none"
                            />
                            <button  onClick={(e: any) => {
                                e.preventDefault()
                                setShowPassword(!showPassword)
                            }} className="w-10 pl-6 focus:outline-none">
                                <EyeSvg className={`${showPassword ? 'text-gray-200' : 'text-black'} cursor-pointer`} />
                            </button>
                        </div>
                        <label className="text-left text-[12px] text-gray-500">
                            {language?.signUpConfirmPassword}
                        </label>
                        <div className="flex w-full px-3 py-2 border border-green-600 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-pri">
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                placeholder={"••••••••"}
                                className="w-full  focus:outline-none"
                            />
                            <button onClick={(e: any) => {
                                e.preventDefault()
                                setShowConfirmPassword(!showConfirmPassword)
                            }} className="w-10 pl-6 focus:outline-none">
                                <EyeSvg className={`${showConfirmPassword ? 'text-gray-200' : 'text-black'} cursor-pointer`} />
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </form>
                    <div className='flex justify-center mt-8'>
                        <button
                            onClick={handleSignup}
                            disabled={loading}
                            className='bg-green-600 hover:bg-green-700 disabled:bg-gray-400 border rounded-full text-white py-2 px-10 cursor-pointer'
                        >
                            {loading ? "Loading..." : language?.signUp}
                        </button>
                    </div>
                </div>
            }
        </>
    );
}

export default SignupForm;