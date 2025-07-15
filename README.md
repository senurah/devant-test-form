# Devant Test Form - Secure Integration

A secure web form that triggers Devant platform integrations through a backend proxy API.

## 🔒 Security Features

- **Backend Proxy**: API credentials never exposed to client-side
- **Input Validation**: Comprehensive server-side validation and sanitization
- **Rate Limiting**: 5 requests per minute per IP address
- **CORS Protection**: Configurable allowed origins
- **Security Headers**: XSS protection, content type sniffing prevention
- **Error Handling**: No sensitive information leaked in error messages
- **Request Logging**: Secure logging with anonymized sensitive data

## 🏗️ Architecture

```
User Form → Vercel Serverless Function → Devant Platform API
```

**Benefits:**

- ✅ Credentials stored securely on server
- ✅ Full input validation and sanitization
- ✅ Rate limiting and abuse prevention
- ✅ Proper error handling and logging
- ✅ No client-side security vulnerabilities

## 🚀 Quick Deploy to Vercel

1. **Fork/Clone this repository**

2. **Set up environment variables in Vercel:**

   ```bash
   DEVANT_API_URL=https://api.devant.com/v1/integrations/your-integration-id/trigger
   DEVANT_API_TOKEN=your_devant_bearer_token_here
   ALLOWED_ORIGIN=https://your-domain.vercel.app
   ```

3. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

## 🔧 Environment Variables

| Variable           | Description                 | Example                                              |
| ------------------ | --------------------------- | ---------------------------------------------------- |
| `DEVANT_API_URL`   | Devant integration endpoint | `https://api.devant.com/v1/integrations/123/trigger` |
| `DEVANT_API_TOKEN` | Devant API bearer token     | `your_secret_token_here`                             |
| `ALLOWED_ORIGIN`   | Allowed CORS origin         | `https://yourdomain.com`                             |

## 🧪 Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create environment file:**

   ```bash
   cp .env.template .env.local
   # Edit .env.local with your actual values
   ```

3. **Run locally:**
   ```bash
   vercel dev
   ```

## 📝 API Documentation

### POST `/api/submit-form`

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com"
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Form submitted successfully! Your automation has been triggered.",
  "submissionId": "sub_1642789123"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Please enter a valid email address."
}
```

## 🛡️ Security Considerations

1. **Environment Variables**: Never commit API tokens to version control
2. **Rate Limiting**: Currently set to 5 requests/minute per IP
3. **Input Validation**: All inputs are sanitized and validated
4. **CORS**: Configure `ALLOWED_ORIGIN` to your domain only
5. **Logging**: Sensitive data is anonymized in logs

## 🔍 Monitoring & Logging

The API logs important events:

- Form submissions (with anonymized email)
- API errors (without sensitive details)
- Rate limit violations
- Security violations

View logs in Vercel dashboard: Functions → View Function Logs

## 🐛 Troubleshooting

**Common Issues:**

1. **"Server configuration error"**

   - Check that `DEVANT_API_URL` and `DEVANT_API_TOKEN` are set in Vercel

2. **"Failed to process your request"**

   - Verify Devant API URL is correct
   - Check Devant API token permissions
   - Review function logs for specific error

3. **"Too many requests"**

   - Rate limit exceeded, wait 1 minute
   - Consider increasing rate limit if needed

4. **CORS errors**
   - Set `ALLOWED_ORIGIN` to your domain
   - For development, use `http://localhost:3000`

## 📞 Support

For issues related to:

- **Form functionality**: Check browser console and network tab
- **Devant API**: Verify credentials and endpoint URL
- **Deployment**: Check Vercel function logs

## 🔄 Updates

To update the form or API:

1. Make changes to files
2. Commit to repository
3. Vercel will auto-deploy from connected Git repository

---

**Security Note**: This implementation follows security best practices for protecting API credentials and preventing common web vulnerabilities. Always keep your environment variables secure and never expose them in client-side code.
devant-test-form
