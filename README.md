# 💬 Letschat --- Real-Time Chat App with Audio Messaging

A **modern, real-time chat application** built with **React**, **Node.js**, **Express**, and **MongoDB**, supporting **text, images, and audio messages**. Includes **typing indicators**, **group chats**, and a **real-time socket system** for instant messaging.

---

## 🚀 Features

✨ **Real-Time Messaging** – Instant chat with friends and groups  
🎤 **Audio Messages** – Record, send, and play audio messages in chats  
🖼️ **Image Sharing** – Upload and preview images  
⌨️ **Typing Indicators** – See when others are typing  
👥 **Group & Private Chats** – Support for private and group conversations  
📦 **MongoDB Storage** – Persistent storage for messages and user data  
✅ **Message Delivery Status** – Track received and pending messages  

---

## 🛠️ Technologies

| Frontend | Backend | Database | Audio |
|----------|---------|---------|-------|
| React ⚛️ | Node.js 🟢 | MongoDB 🍃 | MediaRecorder API 🎙️ |
| Zustand 🗂️ | Express.js 🚂 | Mongoose 📜 | Blob storage 💾 |
| TailwindCSS 🎨 | Socket.io 🌐 | JWT 🔐 | |

---

## ⚡ Setup

1️⃣ **Clone the repository**  

```bash
git clone https://github.com/Escobar-12/Letschat---Realtime-Chat-App.git
cd Letschat---Realtime-Chat-App


# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

3️⃣ **Configure environment variables** 

Create a .env file in the backend folder:
```bash
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
IMAGE_KIT_ENDPOINT=your_endpoint
IMAGE_KIT_PUBLIC_KEY=your_public_key
IMAGE_KIT_PRIVATE_KEY=your_private_key
PORT=5002
```
4️⃣ **Run the server and client** 
```bash
# Backend
npm run dev

# Frontend
npm start
```
---

🗂️ **Folder Structure** 
```bash
Letschat---Realtime-Chat-App/
├─ frontend/          # React frontend
│  ├─ src/
│  │  ├─ components/   # UI components
│  │  ├─ pages/   
│  │  ├─ layout/ 
│  │  ├─ store/        # Zustand state management
│  │  └─ App.js
├─ backend/          # Express backend
│  ├─ controllers/     # API logic
│  ├─ models/          # Mongoose models
│  ├─ routes/          # API routes
│  ├─ middleware/      # Auth and helpers
│  └─ server.js
│  └─ socket.io.js
```
---
🎧 **Audio Messages Storage Flow** 

Record Audio – Using MediaRecorder API in the browser

Send Audio – Blob sent directly to the backend via fetch

Store Audio – Audio buffer stored in MongoDB

Retrieve & Play – Convert buffer to Blob → create object URL → play via ```<audio>```
