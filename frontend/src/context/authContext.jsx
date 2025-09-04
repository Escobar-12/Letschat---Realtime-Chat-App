import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});



export const AuthProvider = ({ children }) => {
    const storedAuth = JSON.parse(localStorage.getItem("auth")) || null;
    const [auth, setAuth] = useState(storedAuth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [token, setToken] = useState(null);

    const resetAuth = async () => {
        try 
        { 
            await fetch("http://localhost:5002/api/auth/logout", 
                { 
                    method: "POST", credentials: "include" 
                }); 
        } catch {}
        localStorage.removeItem("auth");
        setToken(null);
        setAuth(null);
        setError(false);
        setLoading(false);
    };

    const refreshAccessToken = async () => {
        try {
            const res = await fetch("http://localhost:5002/api/auth/refresh", {
                method:"GET",
                credentials: "include",
            });

            const data = await res.json();

            if (!data?.Access_token) 
            {
                setError(true);
                return console.log("No access token in data");
            }
            setToken(data.Access_token);
            const updatedAuth = {
                user: data.user,
                roles: data.roles,
                id: data.id,
                img: data.img
            };

            setAuth(updatedAuth);
            localStorage.setItem("auth", JSON.stringify(updatedAuth));
            setError(false);
            return data.Access_token;

        } catch (err) {
            console.error("Failed to refresh token", err);
            resetAuth();
            return null;
        }
    };

    const checkAuth = async () => {
        setLoading(true);
        let currentToken = token;

        if (!currentToken) {
            console.log("refresh...");
            const newAccessToken = await refreshAccessToken();
            if (!newAccessToken) {
                console.log("Refresh failed");
                setError(true);
                resetAuth();
                return false;
            }
            setError(false);
            currentToken = newAccessToken;
        }
        try 
        {
            setLoading(true);
            const res = await fetch("http://localhost:5002/api/auth/me", {
                headers: {
                    authorization: `Bearer ${currentToken}`, 
                },
                credentials: "include",
            });

            if (!res.ok) 
            {
                const refreshedToken = await refreshAccessToken();
                if (!refreshedToken) {
                    setError(true);
                    resetAuth();
                    return false;
                }
                return true;
            }

            const data = await res.json();
            const updatedAuth = {
                ...auth,
                user: data.user,
                roles: data.roles,
                img: data.profile,
                id: data.id,
            };

            setAuth(updatedAuth);
            localStorage.setItem("auth", JSON.stringify(updatedAuth));
            setError(false);
            return true;

        } catch (err) {
            setError(true);
            console.error("Authentication failed, trying refresh...", err);
            console.log("refresh...");
            await refreshAccessToken();
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>
    {
        checkAuth();
    },[])

    return (
        <AuthContext.Provider value={{ auth, setAuth, token, loading, error, setToken, checkAuth, resetAuth, refreshAccessToken }}>
            { children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
