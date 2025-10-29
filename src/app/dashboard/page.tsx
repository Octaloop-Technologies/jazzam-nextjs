import React from 'react';

const Pages = () => {
    const divStyling = 'h-52 w-52 bg-gray-100 flex text-center justify-center items-center hover:bg-gray-150 hover:cursor-pointer';
    return (
        <>
            <div className='flex justify-center items-center gap-5 mt-40'>
                <div className={divStyling}>My Dashboard</div>
                <div className={divStyling}>Company Dashboard</div>
            </div>
        </>
    );
}

export default Pages;
