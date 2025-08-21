# 🦷 Dental WhatsApp Bot

A complete WhatsApp chatbot system for dental appointment booking with Node.js backend, React admin dashboard, and Rasa NLP engine.

## 🏗️ Architecture

```
User → WhatsApp → WhatsApp Cloud API → Node.js Backend
   → Calls Rasa (intent/entities)
   → Queries MySQL (slots, appointments)
   → Responds back via WhatsApp Cloud API

Admin → React.js Dashboard → Node.js API → MySQL
```

## 📁 Project Structure

```
ai-bot/
├── backend/          # Node.js Express API
│   ├── package.json
│   ├── index.js      # Main server file
│   ├── db.js         # Database connection
│   ├── env.example   # Environment variables template
│   └── routes/
│       ├── whatsapp.js  # WhatsApp webhook routes
│       └── booking.js   # Booking management routes
├── frontend/         # React.js dashboard
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── index.js
│       ├── index.css
│       └── components/
│           ├── Dashboard.jsx
│           ├── Appointments.jsx
│           ├── Users.jsx
│           └── TimeSlots.jsx
├── rasa/             # Rasa chatbot project
│   ├── domain.yml
│   ├── config.yml
│   ├── endpoints.yml
│   └── data/
│       ├── nlu.yml
│       └── stories.yml
├── mysql/            # SQL schema
│   └── schema.sql
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Python (v3.8 or higher) - for Rasa
- WhatsApp Business API access

### 1. Database Setup

```bash
# Create MySQL database
mysql -u root -p < mysql/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your configuration
# - Database credentials
# - WhatsApp Business API tokens
# - Rasa server URL

# Start the server
npm start
# or for development
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Rasa Setup

```bash
cd rasa

# Install Rasa
pip install rasa

# Train the model
rasa train

# Start Rasa server
rasa run --enable-api --cors "*" --port 5005

# In another terminal, start actions server (if needed)
rasa run actions --port 5055
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dental_bot
DB_PORT=3306

# WhatsApp Business API Configuration
WHATSAPP_TOKEN=your_whatsapp_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_VERIFY_TOKEN=your_verify_token_here

# Rasa Configuration
RASA_URL=http://localhost:5005
RASA_WEBHOOK_URL=http://localhost:5005/webhooks/rest/webhook

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (for admin authentication)
JWT_SECRET=your_jwt_secret_here
```

### WhatsApp Business API Setup

1. Create a Meta Developer account
2. Set up a WhatsApp Business app
3. Configure webhook URL: `https://your-domain.com/api/whatsapp/webhook`
4. Get your access token and phone number ID

## 📱 Features

### WhatsApp Bot Features
- ✅ Appointment booking flow
- ✅ Service selection (Checkup, Cleaning, Filling, etc.)
- ✅ Date and time selection
- ✅ Booking confirmation
- ✅ Conversation state management
- ✅ User registration

### Admin Dashboard Features
- 📊 Dashboard with statistics
- 📅 Appointment management
- 👥 User management
- ⏰ Time slot management
- 🔄 Real-time updates
- 📱 Responsive design

### API Endpoints

#### WhatsApp Webhook
- `GET /api/whatsapp/webhook` - Webhook verification
- `POST /api/whatsapp/webhook` - Receive messages

#### Booking Management
- `GET /api/booking/appointments` - Get all appointments
- `GET /api/booking/appointments/:id` - Get specific appointment
- `PATCH /api/booking/appointments/:id/status` - Update appointment status
- `DELETE /api/booking/appointments/:id` - Delete appointment
- `GET /api/booking/users` - Get all users
- `GET /api/booking/time-slots` - Get time slots
- `POST /api/booking/time-slots` - Create time slot
- `GET /api/booking/stats` - Get dashboard statistics

## 🗄️ Database Schema

### Tables
- **users** - Patient information
- **appointments** - Booking details
- **time_slots** - Available appointment times
- **conversation_states** - Chat conversation tracking
- **admin_users** - Dashboard access control

### Key Features
- All tables include `created_at`, `updated_at`, `created_by`, `updated_by` fields
- Foreign key relationships
- Proper indexing for performance
- JSON storage for conversation context

## 🤖 Rasa Configuration

### Intents
- `greet` - Welcome messages
- `book_appointment` - Appointment booking
- `provide_name`, `provide_service`, `provide_date`, `provide_time`
- `confirm_booking`, `deny_booking`
- `help`, `goodbye`, `thank`

### Entities
- `name` - Patient name
- `service_type` - Dental service
- `date` - Appointment date
- `time` - Appointment time
- `phone_number` - Contact number

### Stories
- Complete booking flow
- Error handling
- Confirmation/cancellation flows

## 🎨 Frontend Features

### Components
- **Dashboard** - Statistics and overview
- **Appointments** - CRUD operations for bookings
- **Users** - Patient management
- **TimeSlots** - Schedule management

### UI/UX
- Modern, responsive design
- Real-time data updates
- Modal dialogs for actions
- Status badges and indicators
- Loading states and error handling

## 🔧 Development

### Running in Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: Rasa
cd rasa
rasa run --enable-api --cors "*" --port 5005

# Terminal 4: Rasa Actions (if needed)
cd rasa
rasa run actions --port 5055
```

### Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Production Setup

1. **Backend Deployment**
   - Use PM2 or similar process manager
   - Set up reverse proxy (Nginx)
   - Configure SSL certificates
   - Set production environment variables

2. **Frontend Deployment**
   - Build for production: `npm run build`
   - Serve static files with Nginx
   - Configure API proxy

3. **Database**
   - Use production MySQL instance
   - Set up regular backups
   - Configure connection pooling

4. **Rasa**
   - Deploy Rasa server
   - Set up model training pipeline
   - Configure webhook endpoints

## 📞 Support

For issues and questions:
- Check the logs in each service
- Verify environment variables
- Test WhatsApp webhook connectivity
- Ensure database connectivity

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Note**: This is a complete working system. Make sure to:
- Secure your WhatsApp API tokens
- Use strong passwords for database
- Set up proper SSL certificates for production
- Regularly backup your database
- Monitor system performance
