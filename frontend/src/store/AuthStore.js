import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";


export const useAuthStore = create(
    persist(
        (set, get) => ({
            auth:null,
            token:null,
            loading:false,
            isError:false,
            error:"",
            isChecking: true,

            // Reset 

            resetAuth : async () => {
                try 
                { 
                    await fetch("http://localhost:5002/api/auth/logout", 
                        { 
                            method: "POST", credentials: "include" 
                        }
                    ); 
                    toast.success("Logged out successfully");
                } catch {toast.error("Failed to logout");}
                set({auth:null, token: null, isError: false, error:"", loading: false});
            },

            // Refresh

            refreshAccessToken : async () => {
                try {
                    const res = await fetch("http://localhost:5002/api/auth/refresh", {
                        method:"GET",
                        credentials: "include",
                    });

                    const data = await res.json();

                    if (!data?.Access_token) 
                    {
                        set({isError:true, error:"No access token in data" });
                        toast.error("Session expired. Please log in again");
                        
                        return null;
                    }

                    const updatedAuth = {
                        user: data.user,
                        roles: data.roles,
                        id: data.id,
                        img: data.img
                    };

                    set({token:data.Access_token, auth:updatedAuth, isError:false, loading:false});
                    return data.Access_token;

                } catch (err) {
                    console.error("Failed to refresh token", err);
                    set({error:"Failed to refresh token"});
                    toast.error("Session expired. Please log in again");
                    await get().resetAuth();
                    return null;
                }
            },

            // Check Auth

            checkAuth : async () => {
                set({ loading: true });
                let currentToken = get().token;

                if (!currentToken) {
                    console.log("refresh...");
                    const newAccessToken = await get().refreshAccessToken();
                    if (!newAccessToken) {
                        console.log("Refresh failed");
                        set({ isError: true, loading: false, error:"Refresh failed" });
                        toast.error("Session expired. Please log in again");
                        await get().resetAuth();
                        return false;
                    }
                    currentToken = newAccessToken;
                }
                try 
                {
                    set({ loading: true });
                    const res = await fetch("http://localhost:5002/api/auth/me", {
                        headers: {
                            authorization: `Bearer ${currentToken}`, 
                        },
                        credentials: "include",
                    });

                    if (!res.ok) 
                    {
                        const refreshedToken = await get().refreshAccessToken();
                        if (!refreshedToken) {
                            set({ isError: true, loading: false });
                            toast.error("Session expired. Please log in again");
                            await get().resetAuth();
                            return false;
                        }
                        return true;
                    }

                    const data = await res.json();
                    set((state) => ({
                        auth : {
                            ...state.auth,
                            user: data.user,
                            roles: data.roles,
                            img: data.profile,
                            id: data.id,
                        },
                        isError:false,
                    }));
                
                    return true;

                } catch (err) {
                    set({ isError: true, error: "Authentication failed, trying refresh..."});
                    toast.error("Authentication failed, refreshing session...");
                    
                    await get().refreshAccessToken();
                } finally {
                    set({ loading: false });
                }
            },

            // login 


            login : async (form) => 
            {
                set({ loading: true });
                try {
                    const res = await fetch("http://localhost:5002/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userName:form.userName, pwd:form.pwd }),
                        credentials: "include",
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        set({ isError: true });
                        toast.error(data?.message || "Login failed");
                        return;
                    }

                    const roles = data.role;
                    const img = data.profile;
                    const id = data.id;
                    const user = data.user;
                    
                    const userData = { user, roles, img, id };
                    set({auth: userData, isError: false, token:data.Access_token});
                    await get().checkAuth();
                    toast.success("Logged in successfully");
                } catch (error) {
                    set({ isError: true });
                    toast.error("Login failed. Please try again.");
                }
                finally
                {
                    set({ loading: false });
                }
            },

            // register

            register : async (form) =>
            {
                set({ loading: true });
                try {
                    const res = await fetch("http://localhost:5002/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userName: form.userName,
                            email: form.email,
                            pwd: form.pwd,
                            img: form.img || "user.png",
                        }),
                        credentials: "include",
                    });

                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);

                    const userData = { user: form.userName, roles: data.role, id: data.id, img: data.profile };
                    set({auth: userData, error:"", isError:false, token: data.Access_token});
                    toast.success("Registered Successfuly");

                } catch (error) {
                    set({isError:true})
                    toast.error(error.message || "Registration failed");
                }
                finally
                {
                    set({ loading: false });
                }
            }
        }),
        {
            name: "auth",
            partialize: (state) => ({ auth: state.auth }) 
        }
    )
);
export default useAuthStore;