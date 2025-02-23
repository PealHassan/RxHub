# 🏥 RxHub  
*A Comprehensive Healthcare Procurement Platform*  

## 📌 About the Project  
RxHub is a full-stack web application designed to streamline the procurement process of pharmaceutical and medical supplies. It connects suppliers and healthcare providers, ensuring a seamless, secure, and efficient purchasing experience.  

## 🚀 Features  
- 🏥 **Healthcare Procurement System** – Enables hospitals and pharmacies to order medical supplies effortlessly.  
- 🔐 **Secure Authentication** – User authentication and authorization using JWT for secure access.  
- 📦 **Inventory Management** – Real-time stock updates for suppliers and buyers.  
- 🛒 **Order Processing System** – Automated tracking and processing of orders.  
- 📊 **Admin Dashboard** – Comprehensive analytics and reports for better decision-making.  
- 🌍 **Cloud Deployment** – Fully hosted with **Vercel** (frontend) and **Railway** (backend) for scalability.  

## 🛠️ Tech Stack  
- **Frontend:** React.js, TailwindCSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Deployment:** Vercel (Frontend), Railway (Backend)  

## 🔧 Setup Instructions  
Follow these steps to set up the project locally:  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/PealHassan/RxHub.git
cd RxHub
```

### 2️⃣ Install Dependencies  
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3️⃣ Setup Environment Variables  
Create a `.env` file in the `server` directory and add the required variables:  
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Application  
```bash
# Start Backend
cd server
npm start

# Start Frontend
cd ../client
npm start
```
The application should now be running on **http://localhost:3000/** 🎉  
