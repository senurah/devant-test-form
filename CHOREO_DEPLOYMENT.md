# 🚀 Choreo Deployment Guide

## Overview

You have **ONE** deployment option since you're using Choreo:

**Single Choreo Service**: Deploy everything (frontend + backend) as one service in Choreo

```
User → Choreo Service (HTML Form + Express API) → Your Integration
```

## 📁 Project Structure for Choreo

```
├── server.js              # Express server (serves HTML + API)
├── index.html              # Frontend form
├── package.json            # Dependencies & scripts
├── .env.template           # Environment variables template
└── README.md               # Documentation
```

## 🔧 Choreo Deployment Steps

### 1. **Prepare Your Repository**

Make sure your code is in a Git repository (GitHub/GitLab/Bitbucket).

### 2. **Create Choreo Component**

1. Go to [Choreo Console](https://console.choreo.dev/)
2. Create new component
3. Select **"Web Application"** type
4. Connect your Git repository
5. Set build/deploy configurations:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: `3000`

### 3. **Configure Environment Variables in Choreo**

In your Choreo component dashboard, add these environment variables:

```bash
DEVANT_API_URL=https://apis.choreo.dev/component-mgt/1.0.0/orgs/eightytwodevs/projects/c9e1f8e6-4541-4039-ac1d-b7289ee559af/components/2d4f3ce9-fdba-4294-8ceb-d7f5849c490f/releases/d7419abb-8be8-4ad3-8510-fdd231b31159/run-pod

DEVANT_API_TOKEN=your_actual_token_here

ALLOWED_ORIGIN=https://your-choreo-app-url.choreo.dev

PORT=3000
```

### 4. **Deploy**

- Push your code to the connected repository
- Choreo will automatically build and deploy
- Get your deployment URL from Choreo dashboard

## 🔗 How It Works

### Architecture Flow:

1. **User fills form** → `https://your-app.choreo.dev/`
2. **Form submits** → `https://your-app.choreo.dev/api/submit-form`
3. **Express server validates** → Input sanitization, rate limiting
4. **Server calls your integration** → Your Choreo integration URL
5. **Response sent back** → Success/error message to user

### Security Features:

- ✅ API token stored securely in Choreo
- ✅ Server-side validation & sanitization
- ✅ Rate limiting (5 requests/minute)
- ✅ CORS protection
- ✅ No client-side token exposure

## 🧪 Local Testing

1. **Clone repository**:

   ```bash
   git clone your-repo-url
   cd devant-test-form
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create local environment**:

   ```bash
   cp .env.template .env.local
   # Edit .env.local with your values
   ```

4. **Run locally**:

   ```bash
   npm run dev
   ```

5. **Test form**:
   - Open: `http://localhost:3000`
   - Fill form and submit
   - Check console logs for requests

## 🔍 Troubleshooting

### Common Issues:

1. **"Server configuration error"**

   - Check environment variables in Choreo dashboard
   - Ensure `DEVANT_API_URL` and `DEVANT_API_TOKEN` are set

2. **"Failed to process request"**

   - Verify your integration URL is correct
   - Check API token permissions
   - Review Choreo logs

3. **CORS errors**

   - Set `ALLOWED_ORIGIN` to your Choreo app URL
   - For testing: temporarily set to `*`

4. **Rate limiting**
   - Normal behavior: 5 requests/minute per IP
   - Wait 1 minute or adjust in `server.js`

### Debugging Steps:

1. Check Choreo component logs
2. Test API endpoint directly: `POST /api/submit-form`
3. Verify environment variables
4. Test integration URL separately

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to Git repository
- [ ] Choreo component created and configured
- [ ] Environment variables set in Choreo
- [ ] Build/start commands configured
- [ ] Integration URL and token ready
- [ ] CORS origin set to your Choreo app URL

## 🎯 Next Steps After Deployment

1. **Test the deployed form**
2. **Monitor Choreo logs** for any issues
3. **Update ALLOWED_ORIGIN** to your actual Choreo URL
4. **Test your integration** end-to-end
5. **Set up monitoring/alerts** if needed

---

**You only need ONE deployment in Choreo - everything runs together! 🎉**
