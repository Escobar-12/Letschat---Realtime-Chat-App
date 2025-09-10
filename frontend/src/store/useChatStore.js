import React from 'react'
import toast from "react-hot-toast"
import {create} from "zustand"

import useAuthStore from './AuthStore'


const useChatStore = create((set, get) => 
    ({
        messages:[],
        participants: [],
        onlineUsers:[],
        selectedChat: null,
        isChatsLoading: false,
        isMessagesLoading: false,
        

        // get all chats where user is a participant
        getChats: async () =>
        {
            set({ isChatsLoading: true });
            try 
            {
                let token = useAuthStore.getState().token;
                if (!token) return console.error("No token available");

                const getChatsFunc = async () => {
                    const res = await fetch("http://localhost:5002/api/message/chats", 
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { authorization: `Bearer ${token}` },
                    });
                    return res;
                };

                let res = await getChatsFunc();

                if (res.status === 401) 
                {
                    await useAuthStore.getState().refreshAccessToken();
                    token = useAuthStore.getState().token; 
                    res = await getChatsFunc();
                }

                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.message || "Failed to fetch chats");
                }

                set({ participants: data.formattedConversations || [] });
            } 
            catch (err) 
            {
                console.error("getChats failed", err);
                toast.error("Failed to get chats");
            } 
            finally 
            {
                set({ isChatsLoading: false });
            }
        },

        // find all chat messages
        getMessages: async (chat) => 
        {
            set({ isMessagesLoading: true });
            try 
            {
                let token = useAuthStore.getState().token;
                if (!token) {
                    console.error("No token available");
                    return;
                }

                const getMessagesFunc = async () => 
                {
                    const res = await fetch("http://localhost:5002/api/message/chat", 
                    {
                        method: "POST",
                        credentials: "include",
                        body: JSON.stringify({ chatId: chat }),
                        headers: {
                            authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    return res;
                };

                let res = await getMessagesFunc();

                if (res.status === 401) 
                {
                    await useAuthStore.getState().refreshAccessToken();
                    token = useAuthStore.getState().token; 
                    res = await getMessagesFunc();        
                }

                const data = await res.json();
                console.log(data)
                if (!res.ok || !data.success) {
                    throw new Error(data.message || "Failed to fetch chat");
                }

                set({ messages: data.chat || [] });
            } 
            catch (err) 
            {
                console.error("getMessages failed", err);
                toast.error("Failed to get messages");
            } 
            finally 
            {
                set({ isMessagesLoading: false });
            }
        },


        // 

        setSelectedChat: (selectedChat) => set({selectedChat})
    })
)
export default useChatStore