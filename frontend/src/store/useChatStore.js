import React from 'react'
import toast from "react-hot-toast"
import {create} from "zustand"

import useAuthStore from './AuthStore'
import IKUplaod from '../components/IKUplaod'


const useChatStore = create((set, get) => 
    ({
        messages:[],
        participants: [],
        searchedUsers:[],
        selectedChat: null,
        isChatsLoading: false,
        isMessagesLoading: false,
        isSendingMessage: false,
        isCreatingNewChat:false,
        isSearchingForUsers:false,
        typingUsers:{}, // conv : set(users) 
        

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
                

                // optimistic updating

                // let optipic = pic ? URL.createObjectURL(pic) : "";
                
                // const optimisticMsg = 
                // {
                //     _id: `temp-${Date.now()}`,
                //     senderId:useAuthStore.getState().auth.id, 
                //     text:message || "", 
                //     pic: optipic, 
                //     conversationId:get().selectedChat?._id,
                //     received: false,
                //     pending: true,
                //     createdAt: 'just now',
                // }
                
                let imgUplaoded = null;
                if(pic)
                {
                    imgUplaoded = await IKUplaod(pic);
                }
                // get().setNewMessage(optimisticMsg);
                
                const sendMessagesFunc = async () => 
                {
                    const res = await fetch("http://localhost:5002/api/message/send", 
                    {
                        method: "POST",
                        credentials: "include",
                        body: JSON.stringify({ 
                            text:message || "", 
                            pic:imgUplaoded ? imgUplaoded.filePath : "", 
                            conversationId:get().selectedChat?._id,
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
                    // get().removeMessage(optimisticMsg._id);
                    return false;
                }

                return true;
                // get().replaceMessage(optimisticMsg._id, data.newMessage);
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

        // send audio

        sendAudio : async (audio=null) =>
        {
            if(!audio) return;
            set({isSendingMessage:true});

            try
            {
                let token = useAuthStore.getState().token;
                if (!token) {
                    console.error("No token available");
                    return;
                }

                const formData = new FormData();
                formData.append("audio", audio, "voice.webm");
                formData.append("conversationId", get().selectedChat?._id);
                
                const sendAudioFunc = async () => 
                {
                    const res = await fetch("http://localhost:5002/api/message/sendaudio", 
                    {
                        method: "POST",
                        credentials: "include",
                        body: formData,
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    });
                    return res;
                };

                let res = await sendAudioFunc();

                if (res.status === 401) 
                {
                    await useAuthStore.getState().refreshAccessToken();
                    token = useAuthStore.getState().token;
                    res = await sendAudioFunc();
                }

                const data = await res.json();
                if (!res.ok || !data.success) {
                    console.log(data.message || "Failed to send audio");
                    return false;
                }

                return true;
            }
            catch(err)
            {
                toast.error("Faild to send audio!");
            } 
            finally 
            {
                set({ isSendingMessage: false });
            }
        },

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

        removeMessage: (msgId) =>
        {
            set({ messages: get().messages.filter(msg => msg._id !== msgId) });
        },

        replaceMessage: (msgId, newMessage) =>
        {
            set({ messages: get().messages.map((msg) => msg._id === msgId ? newMessage : msg)
            });
        },

        // create a new chat

        addNewChat: async (reciever) =>
        {
            set({isCreatingNewChat:true});

            try
            {

                // checking if the chat already exists 
                const exists = get().participants?.find(chat => {
                    // Skip if chat or isGroup is undefined
                    if (chat?.isGroup) return false;

                    const participantIds = chat.participants?.map(p => p._id?.toString() || p.toString()) || [];
                    return participantIds.includes(reciever?.toString());
                });

                if (exists) 
                {
                    get().setSelectedChat(exists);
                    set({ isCreatingNewChat: false });
                    return;
                }

                console.log("creating")

                let token = useAuthStore.getState().token;
                if (!token) throw new Error("No token available");

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
                    throw new Error (data.message);
                }

                console.log("success")


                const newChat = data.conversation;
                get().setNewChat(newChat);

                get().setSelectedChat(newChat);
            }
            catch(err)
            {
                console.log(err)
                toast.error(err.message || "Failed to add chat");
            } 
            finally 
            {
                set({ isCreatingNewChat: false });
            }
        },

        // add new group

        addNewGroup: async (participants=[], groupName, groupImage) =>
        {

            if(!participants.length) return;
            set({isCreatingNewChat:true});
            try
            {
                let token = useAuthStore.getState().token;
                if (!token) throw new Error("No token available");

                let imgUplaoded = null;
                if(groupImage)
                {
                    imgUplaoded = await IKUplaod(groupImage);
                }
                console.log('adding')

                const addGroupFunc = async () => 
                {
                    const res = await fetch("http://localhost:5002/api/message/newgroup", 
                    {
                        method: "POST",
                        credentials: "include",
                        body: JSON.stringify({ 
                            participants, groupName, groupImage:imgUplaoded ? imgUplaoded.url : ""
                        }),
                        
                        headers: {
                            authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    return res;
                };

                let res = await addGroupFunc();

                if (res.status === 401) 
                {
                    await useAuthStore.getState().refreshAccessToken();
                    token = useAuthStore.getState().token; 
                    res = await addGroupFunc();        
                }

                const data = await res.json();
                if (!res.ok || !data.success) {

                    console.log(data.message);
                    throw new Error ("Failed to add group");
                }

                const newChat = data.conversation;
                get().setNewChat(newChat);

                get().setSelectedChat(newChat);
            }
            catch(err)
            {
                toast.error(err.message || "Failed to add group");
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

        // remove chat

        deleteChat: async (chatId) =>
        {
            set({ isMessagesLoading: true });
            try
            {
                let token = useAuthStore.getState().token;
                if (!token) {
                    console.error("No token available");
                    return;
                }
                
                const deleteChatFunc = async () => 
                {
                    const res = await fetch("http://localhost:5002/api/message/deletechat", 
                    {
                        method: "DELETE",
                        credentials: "include",
                        body: JSON.stringify({ 
                            conversationId:chatId
                        }),
                        
                        headers: {
                            authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    return res;
                };

                let res = await deleteChatFunc();

                if (res.status === 401) 
                {
                    await useAuthStore.getState().refreshAccessToken();
                    token = useAuthStore.getState().token; 
                    res = await deleteChatFunc();        
                }

                const data = await res.json();
                if (!res.ok || !data.success) {

                    console.log(data.message);
                    throw new Error ("Failed to delete chat");
                }

                toast.success("Chat Deleted");
                set({selectedChat:null});
                
            }
            catch(err)
            {
                toast.error(err.message || "Failed to delete chat");
            } 
            finally 
            {
                set({ isMessagesLoading: false });
            }
        },
    
        // remove chats

        deleteChats: async () =>
        {
            set({ isMessagesLoading: true });
            try
            {
                let token = useAuthStore.getState().token;
                if (!token) {
                    console.error("No token available");
                    return;
                }
                
                const deleteChatsFunc = async () => 
                {
                    const res = await fetch("http://localhost:5002/api/message/deleteallchats", 
                    {
                        method: "DELETE",
                        credentials: "include",
                        headers: {
                            authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    return res;
                };

                let res = await deleteChatsFunc();

                if (res.status === 401) 
                {
                    await useAuthStore.getState().refreshAccessToken();
                    token = useAuthStore.getState().token; 
                    res = await deleteChatsFunc();        
                }

                const data = await res.json();
                if (!res.ok || !data.success) {

                    console.log(data.message);
                    throw new Error ("Failed to delete chat");
                }

                toast.success("Chats Deleted");
                set({participants:[], selectedChat:null});
                
            }
            catch(err)
            {
                toast.error(err.message || "Failed to delete chat");
            } 
            finally 
            {
                set({ isMessagesLoading: false });
            }
        },

        // clear chat

        clearChat: async (chatId) =>
        {
            set({ isMessagesLoading: true });
            try
            {
                let token = useAuthStore.getState().token;
                if (!token) {
                    console.error("No token available");
                    return;
                }
                
                const clearChatFunc = async () => 
                {
                    const res = await fetch("http://localhost:5002/api/message/clearchat", 
                    {
                        method: "DELETE",
                        credentials: "include",
                        body: JSON.stringify({ 
                            conversationId:chatId
                        }),
                        
                        headers: {
                            authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    return res;
                };

                let res = await clearChatFunc();

                if (res.status === 401) 
                {
                    await useAuthStore.getState().refreshAccessToken();
                    token = useAuthStore.getState().token; 
                    res = await clearChatFunc();        
                }

                const data = await res.json();
                if (!res.ok || !data.success) {

                    console.log(data.message);
                    throw new Error ("Failed to clear chat");
                }

                toast.success("Chat Cleared");
                set({messages:[]});
                
            }
            catch(err)
            {
                toast.error(err.message || "Failed to clear chat");
            } 
            finally 
            {
                set({ isMessagesLoading: false });
            }
        },

        // clear chats

        clearChats: async () =>
        {
            set({ isMessagesLoading: true });
            try
            {
                let token = useAuthStore.getState().token;
                if (!token) {
                    console.error("No token available");
                    return;
                }
                
                const clearChatsFunc = async (chatId) => 
                {
                    const res = await fetch("http://localhost:5002/api/message/clearallchats", 
                    {
                        method: "DELETE",
                        credentials: "include",
                        headers: {
                            authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    return res;
                };

                let res = await clearChatsFunc();

                if (res.status === 401) 
                {
                    await useAuthStore.getState().refreshAccessToken();
                    token = useAuthStore.getState().token; 
                    res = await clearChatsFunc();        
                }

                const data = await res.json();
                if (!res.ok || !data.success) {

                    console.log(data.message);
                    throw new Error ("Failed to clear chat");
                }
                
                toast.success("Chats Cleared");
                set({messages:[]});

            }
            catch(err)
            {
                toast.error(err.message || "Failed to clear chat");
            } 
            finally 
            {
                set({ isMessagesLoading: false });
            }
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