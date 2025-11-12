"use client";
import { useToast } from '@/lib/hooks/useToast';
import tokenStorage from '@/lib/utils/tokenStorage';
import { fetchCurrentUser } from '@/redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import React, { useState } from 'react'

function page() {
    const [userType, setUserType] = useState<string>("");
    const { user } = useAppSelector((state) => state.auth);
    const { accessToken } = tokenStorage?.getTokens();
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch()

    const { success, error: ToastError } = useToast();

    const handleUser = async() => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/auth/update-user-type/${user?._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify({ userType })
            });
            if(res.ok){
                const data = await res.json();
                if(data?.success === true){
                    success("User type updated successfully");
                    dispatch(fetchCurrentUser()); 
                }
            }
        } catch (error) {
            ToastError("Unable to update user type try again later");
            setLoading(false);
        }finally{
            setLoading(false);
        }
    }

    if(user?.userType === "company"){
        window.location.href = "/super-user"
    }else if(user?.userFirstLogin === true && user?.userType === "user" && user?.joinedCompanyStatus === false){
          return (
            <>
                <div className='flex justify-center items-center gap-5'>
                    <div className='bg-gray-100 flex p-10 gap-1'>
                        <input type="checkbox" value={userType} onChange={() => setUserType("user")} />
                        <p className='font-semibold'>Continue as user</p>
                    </div>
                    <div className='bg-gray-100 flex p-10 gap-1'>
                        <input type="checkbox" value={userType} onChange={() => setUserType("company")} />
                        <p className='font-semibold'>Continue as company</p>
                    </div>
                </div>
                <div className='flex justify-center mt-3'>
                <button className='bg-green-600 border rounded text-white py-2 px-5' onClick={handleUser}>{ loading ? "loading..." : 'Save'}</button>
                </div>
            </>
          )
    }else if(user?.userFirstLogin === false && user?.userType === "user" && user?.joinedCompanyStatus === true){
        window.location.href = `/super-user?companyId=${user?.joinedCompanies}`
    }else if(user?.userFirstLogin === false && user?.userType === "user" && user?.joinedCompanyStatus === false){
        window.location.href = `/super-user/settings`
    }
}

export default page