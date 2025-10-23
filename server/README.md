# Zeni Server - Firebase Admin Setup

## Setup Instructions

### 1. Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ > **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the JSON file (you can name it `serviceAccountKey.json`)

### 2. Configure Environment Variables

You have two options:

#### Option A: Use Environment Variables (Recommended)

1. Open the `.env` file in this directory
2. Copy the values from your `serviceAccountKey.json`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and line breaks as `\n`)

#### Option B: Use Service Account JSON File

1. Place your `serviceAccountKey.json` in the server directory
2. Update `config/firebase.js` to use:
```javascript
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Public Endpoints
- `GET /health` - Health check

### Protected Endpoints (Require Authentication)
- `POST /api/users/profile` - Create/update user profile
- `GET /api/users/profile` - Get current user profile

### Admin Endpoints (Require Admin Role)
- `GET /api/users/all` - List all users

## Testing with cURL

```bash
# Health check
curl http://localhost:3000/health

# Create user profile (replace YOUR_TOKEN with actual Firebase token)
curl -X POST http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "John Doe", "currency": "USD"}'

# Get user profile
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` or `serviceAccountKey.json` to version control
- Keep your Firebase credentials secure
- Update CORS origin in `index.js` to match your client URL
- In production, use environment variables from your hosting provider
