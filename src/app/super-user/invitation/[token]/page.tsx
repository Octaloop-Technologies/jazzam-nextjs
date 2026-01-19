"use client"
import { getCurrentLang } from '@/lib/api/main-page';
import { useToast } from '@/lib/hooks/useToast';
import { getDictionary } from '@/lib/i18n/getDictionary';
import tokenStorage from '@/lib/utils/tokenStorage';
import { fetchCurrentUser } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';

const Page = ({ params }: { params: Promise<{ token: string }> }) => {
    // Use the use() hook to unwrap the promise
    const { token } = use(params);
    const [language, setLanguage] = useState<any>();
    const lang = getCurrentLang()

    useEffect(() => {
        const fetchLanguage = async() => {
            const dict = (await getDictionary(lang))?.superUser?.navbar?.settings;
            setLanguage(dict);
        }
        fetchLanguage();
    }, [])
    
    const cleanToken = decodeURIComponent(token).replace(/%/g, '').split('token=')[1];
    console.log("cleanToken********", cleanToken);

    const { accessToken } = tokenStorage?.getTokens();

    const router = useRouter();

    const dispatch = useAppDispatch();

    const { success, error: ToastError } = useToast()

    const acceptInvitation = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/invite/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    token: cleanToken
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to accept invitation');
            }

            if(data?.success === true){
                success(language?.invitationSuccess)
                dispatch(fetchCurrentUser())
                router.push("/super-user")
            }
            
            return data;
        } catch (error) {
            ToastError(language?.tryAgain)
            console.error('Error accepting invitation:', error);
            throw error;
        }
    };

    const handleAcceptInvite = () => {
        if (!token) {
            alert(language?.noTokenFound);
            return;
        }

        acceptInvitation();
    };

    useEffect(() => {
        if(!accessToken){
            alert(language?.notLoginMsg)
            router.push("/login")
        }
    }, [])




    if(!accessToken){
        return;
    }else{
        return (
            <div className='flex flex-col items-center'>
                <h1 className='mb-4 text-xl font-semibold'>{language?.acceptDesc}</h1>
                <button
                    onClick={handleAcceptInvite}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-pri text-white hover:bg-pri/80`}
                >
                    {language?.acceptInvite}
                </button>
            </div>
        );
    }
}

export default Page;