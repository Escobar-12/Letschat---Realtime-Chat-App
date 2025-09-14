import React from 'react'
import toast from "react-hot-toast"
import {create} from "zustand"

import useAuthStore from './AuthStore'
import IKUplaod from '../components/IKUplaod'


const useChatStore = create((set, get) => 
    ({
        messages:[],
        participants: [],
        onlineUsers:[],
        searchedUsers:[],
        selectedChat: null,
        isChatsLoading: false,
        isMessagesLoading: false,
        isSendingMessage: false,
        isCreatingNewChat:false,
        isSearchingForUsers:false,
        

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


        // set selected chat

        setSelectedChat: (selectedChat) => set({selectedChat}),


        // send message

        sendMessage : async (message="",pic=null) =>
        {
            if(!message && !pic) return;
            set({isSendingMessage:true});

            try
            {
                let token = useAuthStore.getState().token;
                if (!token) {
                    console.error("No token available");
                    return;
                }
                let imgUplaoded = null;
                if(pic)
                {
                    imgUplaoded = await IKUplaod(pic);
                }
                
                const sendMessagesFunc = async () => 
                {
                    const res = await fetch("http://localhost:5002/api/message/send", 
                    {
                        method: "POST",
                        credentials: "include",
                        body: JSON.stringify({ 
                            text:message || "", 
                            pic:imgUplaoded ? imgUplaoded.filePath : "", 
                            conversationId:get().selectedChat?._id 
                        }),
                        
                        headers: {
                            authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    return res;
                };

                let res = await sendMessagesFunc();

                if (res.status === 401) 
                {
                    await useAuthStore.getState().refreshAccessToken();
                    token = useAuthStore.getState().token; 
                    res = await sendMessagesFunc();        
                }

                const data = await res.json();
                if (!res.ok || !data.success) {
                    console.log(data.message || "Failed to send message");
                }

                set({ messages:
                    [
                        data.newMessage,
                        ...get().messages,
                        
                    ] 
                });
            }
            catch(err)
            {
                toast.error("Faild to send message!");
            } 
            finally 
            {
                set({ isSendingMessage: false });
            }
        } ,

        // update message stack

        setNewMessage: (message) =>
        {
            set({ messages:
                [
                    message,
                    ...get().messages,
                ] 
            });
        },


        // create a new chat

        addNewChat: async (reciever) =>
        {
            set({isCreatingNewChat:true});

            try
            {

                // checking if the chat already exists 
                const exists = get().participants.find((chat) => 
                    chat.participants?.some((p) => p._id.toString() === reciever.toString())
                )
                if (exists) 
                {
                    get().setSelectedChat(exists)
                    set({ isCreatingNewChat: false });
                    return;
                }

                let token = useAuthStore.getState().token;
                if (!token) {
                    console.error("No token available");
                    return;
                }


                console.log('/')
                const addChatFunc = async () => 
                {
                    const res = await fetch("http://localhost:5002/api/message/newchat", 
                    {
                        method: "POST",
                        credentials: "include",
                        body: JSON.stringify({ 
                            reciever
                        }),
                        
                        headers: {
                            authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    return res;
                };

                let res = await addChatFunc();

                if (res.status === 401) 
                {
                    await useAuthStore.getState().refreshAccessToken();
                    token = useAuthStore.getState().token; 
                    res = await addChatFunc();        
                }

                const data = await res.json();
                if (!res.ok || !data.success) {

                    console.log(data.message);
                    throw new Error ("Failed to add chat");
                }

                get().setNewChat(data.newConversation);
                
            }
            catch(err)
            {
                toast.error(err.message || "Failed to add chat");
            } 
            finally 
            {
                set({ isCreatingNewChat: false });
            }
        },

        // update chats

        setNewChat: (newChat) =>
        {
            set({participants:[
                ...get().participants,
                newChat
            ]})
        },

        // remove chats

        deleteChat: (chatId) =>
        {
            set({ participants: get().participants.filter(p => p._id !== chatId) })
        },
    
        
        
        // search for people

        searchUsers: async (search) =>
        {
            set({isSearchingForUsers:true});

            try
            {
                let token = useAuthStore.getState().token;
                if (!token) {
                    console.error("No token available");
                    return;
                }
                
                const searchUsersFunc = async () => 
                {
                    const res = await fetch("http://localhost:5002/api/auth/findusers", 
                    {
                        method: "POST",
                        credentials: "include",
                        body: JSON.stringify({ 
                            userToFind:search,
                        }),
                        
                        headers: {
                            authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    return res;
                };

                let res = await searchUsersFunc();

                if (res.status === 401) 
                {
                    await useAuthStore.getState().refreshAccessToken();
                    token = useAuthStore.getState().token; 
                    res = await searchUsersFunc();        
                }

                const data = await res.json();
                if (!res.ok ) {
                    console.log(data.message);
                    throw new Error ("Failed to get users");
                }

                console.log(data)

                set({searchedUsers : data.foundUsers});
                
            }
            catch(err)
            {
                toast.error(err.message || "Failed to get users");
                set({searchedUsers : []});
            } 
            finally 
            {
                set({ isSearchingForUsers: false });
            }
        },
    
    })
)
export default useChatStore