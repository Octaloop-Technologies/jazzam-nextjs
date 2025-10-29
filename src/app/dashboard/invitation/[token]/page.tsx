"use client"
import { getCookies } from '@/lib/utils/cookies';
import React from 'react';

const Page = ({ params }: { params: { token: string } }) => {
    const { token } = params;

const cleanToken = decodeURIComponent(token).replace(/%/g, '').split('token=')[1];
console.log("cleanToken********", cleanToken);
// Output: f75013ab83a5dc50d7e8650058066d5b400d9e658a3d92893cbb82985a5fed04    console.log("cleanToken********", cleanToken);

    const acceptInvitation = async (token: string) => {
        const cookies = getCookies()
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/invite/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.accessToken}`
                },
                body: JSON.stringify({
                    token: cleanToken
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to accept invitation');
            }

            return data;
        } catch (error) {
            console.error('Error accepting invitation:', error);
            throw error;
        }
    };

    const handleAcceptInvite = () => {
        if (!token) {
            alert('No invitation token found');
            return;
        }

        acceptInvitation(token);
    };

    return (
        <div className='flex flex-col items-center'>
            <h1 className='mb-4 text-xl font-semibold'>Click on button to accept invite</h1>
            <button
                onClick={handleAcceptInvite}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-pri text-white hover:bg-pri/80`}
            >
                Accept invite
            </button>
        </div>
    );
}

export default Page;