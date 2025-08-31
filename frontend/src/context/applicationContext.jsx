import React, { useEffect, useState } from 'react'
import { createContext } from 'react' 
import useAuth from '../hooks/useAuth';

const ApplicationContext = createContext({});


export const ApplicationProvider = ({children}) => {

    const {refreshAccessToken, resetAuth, token, setToken} = useAuth();
    // universel fetch 
    const fetchWithToken = async (url, options={}) =>
    {
        if (!token) 
        {
            resetAuth();
            throw new Error("No access token available");
        }
        
        let res = await fetch(url, {
            ...options,credentials:"include",
            headers:{
            ...(options.headers || {}),
                authorization: `Bearer ${token}`
            }
        })
        if(res.status !== 401) 
        {
            return res;
        }

        const newAccessToken = await refreshAccessToken();
        if(!newAccessToken)
        {
            resetAuth();
            throw new Error("Session expired, please log in again.");
        }
        setToken(newAccessToken) 
        res = await fetch(url, {
            ...options,
            credentials: "include",
            headers: {
                ...(options.headers || {}),
                authorization: `Bearer ${newAccessToken}`,
            },
        });
        return res;
    }

    // image kit
    const publicKey = import.meta.env.VITE_IK_PUBLIC_KEY; 
    const urlEndpoint = import.meta.env.VITE_IK_URL_ENDPOINT;
    const authenticator =  async () => 
    {
        try {
            const response = await fetch('http://localhost:5002/api/imagekit/auth',
                {
                    method:"GET",
                    credentials:"include"
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            const { signature, expire, token } = data;
            return { signature, expire, token };
        } catch (error) {
            throw new Error(`Authentication request failed: ${error.message}`);
        }
    };
    const imageKitConfig = 
    {
        urlEndpoint,
        publicKey,
        authenticator,
    };


    return (
        <ApplicationContext.Provider value={{imageKitConfig,authenticator,  fetchWithToken,}}>
            {children}
        </ApplicationContext.Provider>
    )
}

export default ApplicationContext;