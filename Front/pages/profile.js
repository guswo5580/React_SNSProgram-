import React from 'react';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';

const Profile = () => {
    return(
        <>
            <Head>
                <title>PeaceOcean2</title>
                <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css'/>
                <script src='https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js'/>
            </Head>
            <AppLayout>
                <div>Profile</div>
            </AppLayout>
        </>
        
    );
};

export default Profile;