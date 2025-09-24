import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import IKUplaod from "../components/IKUplaod";
import {io} from "socket.io-client"
import useChatStore from "./useChatStore";
import { useNavigate } from "react-router-dom";



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
            onlineUsers: new Set() ,
            socket: null,

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
                    
                    return data.Access_token;

                } catch (err) {
                    console.error("Failed to refresh token", err);
                    await get().resetAuth();
                    return null;
                }
                finally
                {
                    set({isChecking:false});
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
                        await get().resetAuth();
                        return false;
                    }
                    currentToken = newAccessToken;
                }
                try 
                {
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
                            user: data.user,
                            roles: data.roles,
                            img: data.profile,
                            email: data.email,
                            createdAt:data.createdAt,
                            id: data.id,
                        },
                        token:currentToken,
                        isError:false,
                    });

                    get().connectSocket();
                    
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

                    get().connectSocket();
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
                    
                    let imgUpload = null;
                    if(form.img)
                    {
                        imgUpload = await IKUplaod(form.img);
                    }
                    
                    const res = await fetch("http://localhost:5002/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userName: form.userName,
                            email: form.email,
                            pwd: form.pwd,
                            img: imgUpload ? imgUpload?.url : "",
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
                        img: data.profile ? data.profile : (imgUpload ? imgUpload.url : ""),
                    };

                    set({auth: userData, error:"", isError:false, token: data.Access_token});
                    // await get().checkAuth();

                    toast.success("Registered Successfuly");

                    get().connectSocket();

                    return true;

                } catch (error) {
                    set({isError:true})
                    toast.error(error.message || "Registration failed");
                    return false;
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
                    get().disconnectSocket();

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

            connectSocket: () => 
            {
                const {auth, socket} = get();
                
                if(!auth || (socket && socket.connected)) return;

                const newSocket = io("http://localhost:5002", 
                    {
                        query:
                        {
                            userId:auth.id,
                        }
                    }
                );
                set({ socket: newSocket });

                newSocket.on('updateOnlineUsers', (online) =>
                {
                    set({onlineUsers: new Set(online)});
                })

                newSocket.on('newMessage', (newMessage) =>
                {
                    if(newMessage && useChatStore.getState().selectedChat._id === newMessage.conversationId)
                    {
                        useChatStore.getState().setNewMessage(newMessage);
                    }
                })

                newSocket.on('isTyping', ({ conversationId, typer }) => {
                    useChatStore.setState((state) => {
                        const prev = state.typingUsers[conversationId] || [];
                        if (prev.includes(typer)) return state; 
                        return {
                        ...state,
                        typingUsers: {
                            ...state.typingUsers,
                            [conversationId]: [...prev, typer],
                        },
                        };
                    });
                });

                newSocket.on('isStopedTyping', ({ conversationId, typer }) => {
                    useChatStore.setState((state) => {
                        const prev = state.typingUsers[conversationId] || [];
                        return {
                        ...state,
                        typingUsers: {
                            ...state.typingUsers,
                            [conversationId]: prev.filter((t) => t !== typer),
                        },
                        };
                    });
                });

            },
            disconnectSocket: () => 
            {
                if (get().socket?.connected)
                {
                    get().socket.disconnect();
                    set({ socket: null });
                } 
            },
        }),
        {
            name: "auth",
            serialize: (state) => {
                return JSON.stringify({...state, onlineUsers:[...state.onlineUsers]});
            },
            deserialize: (str) => {
                const state = JSON.parse(str);
                return {
                    ...state, onlineUsers : new Set(state.onlineUsers || [])
                }
            },
            partialize: (state) => ({ auth: state.auth, onlineUsers:state.onlineUsers }) 
        }
    )
);
export default useAuthStore;