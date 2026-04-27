# How to Fix MongoDB Connection Error

## Issues Found:

1. ✅ **MongoDB Connection String** - Fixed! The format is now correct.
2. ⚠️ **Cloudinary API Key** - Needs to be updated with actual key

## Steps to Fix:

### 1. Fix Cloudinary API Key

Your Cloudinary API_KEY is currently set to a URL, but it should be just the key.

**To get your Cloudinary API Key:**
1. Go to https://cloudinary.com/console
2. Log in to your account
3. Go to **Settings** → **API Keys** (or click on your dashboard)
4. You'll see:
   - **API Key**: A long number (like `123456789012345`)
   - **API Secret**: Already set correctly
5. Copy the **API Key** (just the number, NOT the URL)

**Update your `.env` file:**
- Open `backend/.env`
- Replace `CLOUDINARY_API_KEY=YOUR_ACTUAL_API_KEY_HERE` 
- With: `CLOUDINARY_API_KEY=your-actual-key-here` (the number from Cloudinary)

### 2. Verify MongoDB Connection String

Your MongoDB connection string should look like:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Important checks:**
- ✅ Database name (`dw_website`) is BEFORE the `?`
- ✅ Has `?retryWrites=true&w=majority` at the end
- ✅ Username and password are correct
- ✅ Make sure your IP is whitelisted in MongoDB Atlas

**To whitelist IP in MongoDB Atlas:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. For development, use `0.0.0.0/0` (allows all IPs)
4. Click "Confirm"

### 3. Restart Your Server

After updating the `.env` file:
```bash
# Stop the server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

### 4. Test the Connection

You should see:
```
✅ Connected to MongoDB Atlas
🚀 Server running on port 5000
```

If you still see errors, check:
- MongoDB Atlas cluster is running
- Database user credentials are correct
- IP address is whitelisted
- Connection string format is correct

## Quick Fix Summary:

1. Get Cloudinary API Key from dashboard
2. Update `backend/.env` with correct API key
3. Verify MongoDB connection string format
4. Whitelist IP in MongoDB Atlas
5. Restart server

---

**Need help?** The error message will tell you what's wrong:
- `ENOTFOUND` = Connection string format issue
- `Authentication failed` = Wrong username/password
- `IP not whitelisted` = Need to add IP in MongoDB Atlas
