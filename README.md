# 📸 Studio Management App

A comprehensive studio management solution for marriages, photo albums, and restoration works.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
├──────────────────────┬──────────────────────────────────────────┤
│   Flutter Mobile     │         React Web Admin                   │
│   (Customers)        │         (Studio Owners)                   │
└──────────────────────┴──────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
├──────────────────────┬──────────────────────────────────────────┤
│   Django Backend     │      Node.js Backend                      │
│   (REST APIs,        │      (Real-time,                          │
│    Payments,         │       WebSockets,                         │
│    Auth)             │       Notifications)                      │
├──────────────────────┼──────────────────────────────────────────┤
│   PostgreSQL         │      MongoDB                              │
│   (Relational Data)  │      (Documents, Chats)                   │
└──────────────────────┴──────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│   Razorpay (Google Pay / PhonePe) │ AWS S3 / Cloudinary          │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile App | Flutter (Dart) |
| Web Admin | React.js (MERN) |
| Backend APIs | Django REST Framework |
| Real-time | Node.js + Socket.io |
| Database | PostgreSQL + MongoDB |
| Payments | Razorpay (UPI, Cards) |
| Storage | AWS S3 / Cloudinary |

## 📁 Project Structure

```
studio-app/
├── backend-django/      # Django REST API
├── backend-node/        # Node.js Real-time Server
├── mobile-flutter/      # Flutter Mobile App
├── web-admin/           # React Admin Dashboard
├── docker-compose.yml   # Docker orchestration
├── .env.example         # Environment variables template
└── docs/                # Documentation
```

## 🐳 Docker Setup (Recommended)

### Prerequisites
- Docker & Docker Compose installed
- Git

### One-Command Setup
```bash
# Clone and start all services
git clone <repository-url>
cd studio-app
cp .env.example .env
docker-compose up --build
```

### Services Available
- **Django API**: http://localhost:8000
- **Node.js Real-time**: http://localhost:5000
- **React Admin**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

### Docker Commands
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build django
```

## 🛠️ Manual Setup (Without Docker)

### 1. Prerequisites
- Python 3.11+
- Node.js 18+
- Flutter 3.0+
- PostgreSQL 15+
- MongoDB 7+
- Redis 7+

### 2. Django Backend
```bash
cd backend-django
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Node.js Backend
```bash
cd backend-node
npm install
npm run dev
```

### 4. Flutter Mobile
```bash
cd mobile-flutter
flutter pub get
flutter run
```

### 5. React Web Admin
```bash
cd web-admin
npm install
npm start
```

## 💳 Payment Integration

Uses **Razorpay** for secure payments supporting:
- Google Pay
- PhonePe
- UPI
- Credit/Debit Cards
- Net Banking

To enable checkout, set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` on the
Django service. Create a separate webhook secret in Razorpay and set it as
`RAZORPAY_WEBHOOK_SECRET`; configure the webhook URL as
`https://<your-api-host>/api/v1/payments/webhook/` and subscribe to
`payment.captured`, `payment.failed`, and `refund.processed` events. Use test
mode credentials until the integration is approved for live payments.

### Supabase Auth with Django on Render

The web app signs users in with Supabase. Django verifies that Supabase session
on every protected API request and links it to a local user, while keeping all
payment logic and Razorpay secrets on the Django service. In the Render Django
service, set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, then deploy so the
`accounts.0002_user_supabase_user_id` migration runs. Do not put Razorpay
secrets or a Supabase service-role key in a browser or Flutter application.

## 📄 License

MIT License - Feel free to use for your studio business!
