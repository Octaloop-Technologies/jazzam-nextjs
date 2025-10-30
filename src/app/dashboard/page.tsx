"use client";
import React, { useEffect, useState } from 'react';
import { useAppSelector } from "@/redux/store";
import { getCookies } from '@/lib/utils/cookies';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Company {
    _id: string;
    name: string;
    email: string;
    logo: string
}

interface Dashboard {
    ownCompany: Company;
    joinedCompanies: Company;
}

const Pages = () => {
    const [dashboard, setDashboard] = useState<Dashboard>({
        ownCompany: {
            _id: "",
            name: "",
            email: "",
            logo: "",
        },
        joinedCompanies: {
            _id: "",
            name: "",
            email: "",
            logo: ""
        },
    });
    const user = useAppSelector((state) => state.auth.user);

    const router = useRouter()


    useEffect(() => {
        const fetchCompany = async () => {
            const cookies = getCookies();

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/companies/${user?._id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: cookies?.accessToken || "",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch company data");
                }

                const data = await response.json();
                console.log("data*********", data?.data);

                // ✅ Set the API response into state
                setDashboard({
                    ownCompany: data?.data.ownCompany,
                    joinedCompanies: data?.data.joinedCompanies
                });
                localStorage.setItem("joinedCompany", JSON.stringify(data?.data.joinedCompanies));
            } catch (error) {
                console.log("error*******", error);
            }
        };

        fetchCompany();
    }, []);


    const navigateUser = () => {
        router.push("/super-user")
    }


    const divStyling = 'h-52 w-52 bg-gray-100 flex flex-col text-center justify-center items-center hover:bg-gray-150 hover:cursor-pointer';
    return (
        <>
            <div className='flex justify-center items-center gap-5 mt-40'>
                <div className={divStyling} onClick={navigateUser}>
                    <h1 className='text-gray-600 text-2xl mb-2 font-medium'>My Company</h1>
                    <Image
                        src={
                            typeof dashboard?.ownCompany?.logo === "string"
                                ? dashboard?.ownCompany?.logo || "/assets/icons/favicon.ico"
                                : dashboard?.ownCompany?.logo || "/assets/icons/favicon.ico"
                        }
                        width={100}
                        height={100}
                        alt="company logo"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/assets/icons/favicon.ico";
                        }}
                    />


                </div>
                <div className={divStyling} onClick={() => router.push("/dashboard/joined-company/follow-ups")}>
                    <h1 className='text-gray-600 text-2xl mb-2 font-medium'>Joined Company</h1>
                    <Image
                        src={
                            typeof dashboard?.joinedCompanies?.logo === "string"
                                ? dashboard?.joinedCompanies?.logo || "/assets/icons/favicon.ico"
                                : dashboard?.joinedCompanies?.logo || "/assets/icons/favicon.ico"
                        }
                        width={100}
                        height={100}
                        alt="company logo"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/assets/icons/favicon.ico"; 
                        }}
                    />

                </div>
            </div>
        </>
    );
}

export default Pages;
