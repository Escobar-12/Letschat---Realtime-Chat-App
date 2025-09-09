import React from 'react'
import toast from "react-hot-toast"
import {create} from "zustand"

import useAuthStore from './AuthStore'

const useChatStore = create((set, get) => 
    ({
        messages:[],
        participants: [],
        selectedChat: null,
        isChatsLoading: false,
        isMessagesLoading: false,


        // get all chats where user is a participant
        getChats: async () =>
        {
            set({isChatsLoading:true});
            try
            {
                const token = useAuthStore.getState().auth;
                const res = await fetch('http://localhost:5002/api/message/chats', 
                    {
                        method:"GET",
                        credentials:true,
                        headers:
                        {
                            authorization: `Bearer ${token}`,
                        }
                    }
                );
                const data = await res.json();

                if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch chats");

                set({
                    participants: data.conversations || [],
                    isChatsLoading: false,
                });
            }
            catch(err){}
            finally
            {
                set({isChatsLoading:false});
            }
        },

        // find all chat messages
        getMessages: async ({chat, lastMessageId}) =>
        {
            set({isMessagesLoading:true});

            try
            {
                const res = await fetch('http://localhost:5002/api/message/chat', 
                    {
                        method:"GET",
                        credentials:true,
                        headers:
                        {
                            authorization: `Bearer ${token}`,
                            "Content-Type":"application/json"
                        },
                        body:{chat,lastMessageId}
                    }
                );
                const data = await res.json();

                if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch chat");

                set({
                    messages: data.chat || [],
                    isMessagesLoading: false,
                });
            }
            catch(err){}
            finally
            {
                set({isMessagesLoading:false});
            }
        },

        // 

        setSelectedChat: (selectedChat) => set({selectedChat})
    })
)
export default useChatStore