# 📦 eve-backend

Back-end system for EVE: a smart AI employee assistant built with Node.js, Express, Sequelize, and AI integration (Cohere).  
This project handles authentication, employee knowledge storage, file parsing (PDF/DOCX), and communication with an AI model.

---

## 🚀 Features

- ✅ User signup & login (with JWT)
- ✅ Role-based access
- ✅ Employee creation & knowledge updates
- ✅ File uploads (.pdf, .docx)
- ✅ AI integration via Cohere
- ✅ PDF & DOCX parsing
- ✅ Full CORS support
- ✅ MySQL with Sequelize
- ✅ Ready for Windows Server or local deployment

---

## ⚙️ Requirements

- Node.js 20+
- npm
- MySQL
- Windows Server or local machine

---

## 📁 Installation

```bash
git clone <your-repo-url>
cd eve-backend
npm install

🚀 Run with PM2 (Production)


npm install -g pm2

// ecosystem.config.js
export default {
  apps: [
    {
      name: "eve-backend",
      script: "./index.js",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};

pm2 start ecosystem.config.js
pm2 save
pm2 startup
