"use client";
import { useAppSelector } from "@/redux/store";
import React, { useEffect } from "react";

function page(){

    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if(user?.userType !== "admin"){
            window.location.href = "/super-user"
        }
    }, [])

    if(user?.userType !== "admin"){
        return;
    }


    return (
        <>
        <h1>Admin dashboard</h1>
        </>
    )
}

export default page;