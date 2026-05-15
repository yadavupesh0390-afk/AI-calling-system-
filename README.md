# 🚀 AI/IVR Automated Calling System

A production-ready automated calling system for business lead generation and qualification using AI-powered IVR.

## ✨ Features

✅ Secure JWT authentication with role-based access
✅ Campaign management (create, upload, start/stop)
✅ Automated calling via Twilio
✅ IVR voice flow with DTMF detection
✅ Lead management with multiple panels
✅ WhatsApp follow-up automation
✅ Real-time analytics dashboard
✅ Excel/CSV export
✅ Call recording support
✅ Docker deployment ready

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Redis
- **Frontend**: React, Tailwind CSS, Axios
- **Calling**: Twilio API
- **Queue**: Bull with Redis
- **DevOps**: Docker, PM2, Nginx

## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/yadavupesh0390-afk/AI-calling-system-.git
cd AI-calling-system-

# Install dependencies
npm install
cd apps/dashboard-ui && npm install && cd ../..

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start with Docker
docker-compose up -d

# Or with PM2
pm2 start ecosystem.config.js --env production
```

### Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
POST   /api/auth/change-password
```

### Campaigns
```
GET    /api/campaigns
POST   /api/campaigns
GET    /api/campaigns/:id
POST   /api/campaigns/:id/upload
POST   /api/campaigns/:id/start
POST   /api/campaigns/:id/stop
DELETE /api/campaigns/:id
```

### Leads
```
GET    /api/leads/interested
GET    /api/leads/callback-later
GET    /api/leads/not-interested
GET    /api/leads/search
GET    /api/leads/export
PATCH  /api/leads/:id
POST   /api/leads/:id/notes
```

### Analytics
```
GET    /api/analytics/dashboard
GET    /api/analytics/daily-report
GET    /api/analytics/campaign-performance
```

## 🔐 Security

✅ JWT authentication (7-day expiry)
✅ Password hashing (bcrypt)
✅ Rate limiting
✅ Input validation
✅ CORS protection
✅ Helmet.js headers
✅ Activity logging
✅ Role-based access control

## 📊 Database Models

### User
- name, email, password, role, companyName
- isActive, lastLogin, activityLog

### Campaign
- name, description, createdBy, status
- phoneNumbers, totalLeads
- ivrScript, voiceSettings, callSettings
- followupSettings
- Statistics (interestedLeads, failedCalls, etc.)

### Lead
- campaignId, phoneNumber, callStatus
- userResponse (interested, callback_later, not_interested)
- dtmfResponse, callDuration, retryCount
- leadQuality, notes, assignedTo
- callAttempts, recordingUrl

## 🚀 Deployment

### Docker
```bash
docker-compose up -d
```

### PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## 📝 Configuration

Create `.env` file:
```
NODE_ENV=production
JWT_SECRET=your_secret_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
MONGODB_URI=mongodb://...
REDIS_HOST=localhost
```

## 🎯 IVR Script

**Hindi**:
"Namaste Sir/Madam, Hum business website, software aur AI automation solutions provide karte hain. Agar aap interested hain to 1 dabayein. Agar future me information chahte hain to 2 dabayein. Agar call band karna chahte hain to 3 dabayein."

**DTMF Responses**:
- 1 = Interested
- 2 = Callback Later
- 3 = Not Interested

## 📈 Features

- Real-time call monitoring
- Automatic lead qualification
- WhatsApp follow-up
- Excel export
- Campaign analytics
- Call recording
- Retry logic
- DND protection
- Duplicate prevention

## 🤝 Support

For issues and support, open an issue on GitHub.

## 📄 License

MIT License

---

**Made with ❤️ for automated lead generation**