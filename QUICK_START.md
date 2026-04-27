# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites Setup

1. **MongoDB Atlas** (5 minutes)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a free cluster (M0)
   - Create database user (Database Access)
   - Whitelist IP (Network Access - use 0.0.0.0/0 for development)
   - Get connection string (Connect → Connect your application)

2. **Cloudinary** (2 minutes)
   - Sign up at https://cloudinary.com/
   - Copy credentials from Dashboard:
     - Cloud Name
     - API Key
     - API Secret

### Backend Setup (2 minutes)

```bash
cd backend
npm install

# Create .env file (copy from env.example)
# Add your MongoDB Atlas and Cloudinary credentials

npm run dev
# Backend runs on your deployed backend domain
```

### Frontend Setup (2 minutes)

```bash
cd frontend
npm install

# Create .env file
# VITE_API_BASE_URL=https://your-backend-domain.com/api

npm run dev
# Frontend runs on your deployed frontend domain
```

### Test the Application

1. Open your deployed frontend domain
2. Click "Upload Your Work"
3. Fill in the form and upload a file
4. View your work in the Gallery

## 📝 Environment Variables Checklist

### Backend `.env` (backend/.env)
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Your Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- [ ] `PORT` - Server port (default: 5000)
- [ ] `CORS_ORIGIN` - Frontend URL (example: https://your-frontend-domain.com)

### Frontend `.env` (frontend/.env)
- [ ] `VITE_API_BASE_URL` - Backend API URL (example: https://your-backend-domain.com/api)

## 🐛 Common Issues

**Issue:** Backend can't connect to MongoDB
- ✅ Check your connection string in `.env`
- ✅ Ensure IP is whitelisted in MongoDB Atlas
- ✅ Verify database user credentials

**Issue:** File upload fails
- ✅ Check Cloudinary credentials
- ✅ Verify file size is under 300MB
- ✅ Check file type is supported

**Issue:** Frontend can't connect to backend
- ✅ Ensure backend is running
- ✅ Check `VITE_API_BASE_URL` in frontend `.env`
- ✅ Verify CORS configuration

## 🚢 Deployment Checklist

### Backend (Render/Railway)
- [ ] Push code to GitHub
- [ ] Connect repository to Render/Railway
- [ ] Set root directory to `backend`
- [ ] Add all environment variables
- [ ] Deploy and get backend URL

### Frontend (Vercel)
- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Set root directory to `frontend`
- [ ] Add `VITE_API_BASE_URL` with deployed backend URL
- [ ] Deploy and get frontend URL

### Update CORS
- [ ] Update `CORS_ORIGIN` in backend `.env` with deployed frontend URL

---

**Need help?** Check the main [README.md](README.md) for detailed instructions.
