"use client";
import { getCurrentLang } from '@/lib/api/main-page';
import { useToast } from '@/lib/hooks/useToast';
import { getDictionary } from '@/lib/i18n/getDictionary';
import tokenStorage from '@/lib/utils/tokenStorage';
import { fetchCurrentUser } from '@/redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

function page() {
    const [userType, setUserType] = useState<string>("");
    const { user } = useAppSelector((state) => state.auth);
    const { accessToken } = tokenStorage?.getTokens();
    const [loading, setLoading] = useState<boolean>(false);
    const [language, setLanguage] = useState<any>();
    const [selectedUser, setSelectedUser] = useState<boolean>(false);
    const [selectedCompany, setSelectedCompany] = useState<boolean>(false);


    const dispatch = useAppDispatch()
    const lang = getCurrentLang()

    const { success, error: ToastError } = useToast();

    useEffect(() => {
        const fetchLanguage = async () => {
            const dict = (await getDictionary(lang))?.superUser?.navbar.settings;
            setLanguage(dict);
        }
        fetchLanguage()
    }, [])

    const handleUser = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/update-user-type/${user?._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify({ userType })
            });
            if (res.ok) {
                const data = await res.json();
                if (data?.success === true) {
                    success(user?.userType === "user" ? "user" : "company" + language?.dashboardSuccessMessage);
                    dispatch(fetchCurrentUser());
                }
            }
        } catch (error) {
            ToastError(language?.dashboardErrorMessage);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    if (user?.userType === "company") {
        window.location.href = "/super-user"
    } else if (user?.userFirstLogin === true && user?.userType === "user" && user?.joinedCompanyStatus === false) {
        return (
            <div className='flex flex-col justify-center items-center h-[80vh]'>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-2xl font-semibold mb-3'>{language?.selectTypeHeading}</h1>
                    <p className='mb-5'>{language?.selectTypeDescription}</p>
                </div>
                <div className='flex flex-col sm:flex-row justify-center items-center gap-5'>
                    <div className={`${selectedUser ? 'bg-gray-150' : 'bg-gray-100'} hover:bg-gray-150 hover:cursor-pointer flex flex-col p-10 gap-1`} onClick={() => {
                        setUserType("user");
                        setSelectedCompany(false);
                        setSelectedUser(true);
                    }}>
                        <div className='flex justify-center'>
                            <Image
                                src={"/assets/images/user_logo.png"}
                                alt="Profile"
                                width={83}
                                height={83}
                                className=""
                            />
                        </div>
                        <p className=''>{language?.continueUser}</p>
                    </div>
                    <div className={`${selectedCompany ? 'bg-gray-150' : 'bg-gray-100'} hover:bg-gray-150 hover:cursor-pointer flex flex-col p-10 gap-1`} onClick={() => {
                        setUserType("company");
                        setSelectedCompany(true);
                        setSelectedUser(false);
                    }}>
                        <div className='flex justify-center'>
                            <Image
                                src={"/assets/images/company_logo.png"}
                                alt="Profile"
                                width={83}
                                height={83}
                                className=""
                            />
                        </div>
                        <p className=''>{language?.continueCompany}</p>
                    </div>
                </div>
                <div className='flex justify-center mt-3'>
                    <button className='bg-green-600 border rounded-full text-white py-2 px-10' onClick={handleUser}>{loading ? "loading..." : 'Save'}</button>
                </div>
            </div>
        )
    } else if (user?.userFirstLogin === false && user?.userType === "user" && user?.joinedCompanyStatus === true) {
        window.location.href = `/super-user?companyId=${user?.joinedCompanies}`
    } else if (user?.userFirstLogin === false && user?.userType === "user" && user?.joinedCompanyStatus === false) {
        window.location.href = `/super-user/settings`
    }
}

export default page