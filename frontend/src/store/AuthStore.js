import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import IKUplaod from "../components/IKUplaod";

const useAuthStore = create(
    persist(
        (set, get) => ({
            auth:null,
            token:null,
            loading:false,
            isError:false,
            error:"",
            isChecking: false,
            isUpdatingProfile: false,

            // Reset 

            resetAuth : async () => {
                try 
                { 
                    await fetch("http://localhost:5002/api/auth/logout", 
                        { 
                            method: "POST", credentials: "include" 
                        }
                    ); 
                    useAuthStore.persist.clearStorage();
                } catch {}
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
                        
                        return null;
                    }

                    const updatedAuth = {
                        user: data.user,
                        email: data.email,
                        roles: data.roles,
                        id: data.id,
                        img: data.profile,
                        createdAt:data.createdAt,
                    };

                    set({token:data.Access_token, auth:updatedAuth, isError:false, loading:false});
                    console.log(get().auth)
                    
                    return data.Access_token;

                } catch (err) {
                    console.error("Failed to refresh token", err);
                    set({error:"Failed to refresh token"});
                    await get().resetAuth();
                    return null;
                }
            },

            // Check Auth

            checkAuth : async () => {
                set({ isChecking: true });
                let currentToken = get().token;

                if (!currentToken) {
                    console.log("refresh...");
                    const newAccessToken = await get().refreshAccessToken();
                    if (!newAccessToken) {
                        console.log("Refresh failed");
                        set({ isError: true, isChecking: false, error:"Refresh failed" });
                        await get().resetAuth();
                        return false;
                    }
                    currentToken = newAccessToken;
                }
                try 
                {
                    set({ isChecking: true });
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
                            set({ isError: true, isChecking: false });
                            await get().resetAuth();
                            return false;
                        }
                        return true;
                    }

                    const data = await res.json();
                    set({
                        auth : {
                            ...get().auth,
                            token:currentToken,
                            user: data.user,
                            roles: data.roles,
                            img: data.profile,
                            email: data.email,
                            createdAt:data.createdAt,
                            id: data.id,
                        },
                        isError:false,
                    });
                    
                    return true;

                } catch (err) {
                    set({ isError: true, error: "Authentication failed, trying refresh..."});
                    
                    await get().refreshAccessToken();
                } finally {
                    set({ isChecking: false });
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
                        set({ isError: true, error:data?.message||"Error while logging in" });
                        toast.error(data?.message||"Login failed");
                        return;
                    }

                    const userData = {
                        user: data.user,
                        roles: data.role,
                        id: data.id,
                        email: data.email,
                        img: data.profile, 
                        createdAt:data.createdAt,
                    };
                    set({auth: userData, isError: false, token:data.Access_token});

                    // await get().checkAuth();
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
                    const imgUpload = await IKUplaod(form.img);
                    console.log(imgUpload)
                    const res = await fetch("http://localhost:5002/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userName: form.userName,
                            email: form.email,
                            pwd: form.pwd,
                            img: imgUpload.url || "user.png",
                        }),
                        credentials: "include",
                    });



                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);

                    const userData = {
                        user: data.user,
                        roles: data.role,
                        id: data.id,
                        email: data.email,
                        createdAt:data.createdAt,
                        img: data.profile || imgUpload.url || "default-user.jpg", 
                    };

                    set({auth: userData, error:"", isError:false, token: data.Access_token});
                    // await get().checkAuth();
                    toast.success("Registered Successfuly");

                } catch (error) {
                    set({isError:true})
                    toast.error(error.message || "Registration failed");
                }
                finally
                {
                    set({ loading: false });
                }
            },

            // log out

            logout: async () =>
            {
                try 
                {
                    const res = await fetch("http://localhost:5002/api/auth/logout", {
                        method: "POST",
                        credentials:"include"
                    });
                    
                    if (!res.ok) {
                        toast.error("Error while logging out.");
                        return console.log("Error while logging out.");
                    }
                    
                    set({ auth: null, token: null, error: "", isError: false, loading: false });
                    useAuthStore.persist.clearStorage();
                    toast.success("Logged out successfully");
                } 
                catch (err) 
                {
                    console.error("Logout failed:", err);
                    toast.error("Logout failed");
                }
            },

            // update prfile

            updateProfile: async (img) =>
            {
                set({ isUpdatingProfile: true });
                try
                {
                    const imgUpload = await IKUplaod(img);

                    const sendUpdate = async () =>
                    {
                        const res = await fetch("http://localhost:5002/api/auth/updateprofile", {
                            method: "PUT",
                            credentials:"include",
                            headers:
                            {
                                "Content-Type":"application/json",
                                authorization: `Bearer ${get().token}`,
                            },
                            body:JSON.stringify({
                                profilePic:imgUpload.url,
                            })
                        });
                        return res;
                    }
                    
                    let res = await sendUpdate();

                    if (res.status === 401) {
                        await get().refreshAccessToken();
                        res = await sendUpdate();
                    }

                    if (!res.ok) {
                        toast.error("Error while updating, try again.");
                        return console.log("Error while updating.");
                    }
                    const data = await res.json();

                    set({auth:
                        {
                            ...get().auth, img: data.updatedUser.profile || imgUpload.url
                        } , error:"", 
                        isError: false, error: "",});
                    toast.success("Registered Successfuly");
                }   
                catch (err) 
                {
                    console.error("Update failed:", err);
                    toast.error("Update failed");
                }
                finally
                {
                    set({ isUpdatingProfile: false });
                }
            } ,
        }),
        {
            name: "auth",
            partialize: (state) => ({ auth: state.auth }) 
        }
    )
);
export default useAuthStore;