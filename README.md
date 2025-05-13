# Mostaqel Backend API

A robust backend API for a freelancing platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- User Authentication and Authorization
- Real-time messaging using Pusher and Ably
- Payment integration (PayPal, Stripe)
- Project Management
- Proposal System
- Review System
- Portfolio Management
- Admin Dashboard
- Notification System
- File Upload System
- Category Management
- Skills Management
- Complaint System
- Balance and Transaction Management
- Platform Earnings Tracking

## 🛠️ Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Real-time Communication:** Pusher, Ably, Socket.io
- **Payment Processing:** PayPal, Stripe
- **File Upload:** Multer, Sharp
- **Authentication:** JWT, bcryptjs
- **Validation:** Joi, Validator
- **Image Processing:** Cloudinary
- **Environment Variables:** dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- PayPal Developer Account
- Stripe Account
- Pusher Account
- Ably Account

## 🔧 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd mostaqelCloneBackEnd
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MYDB=your_mongodb_connection_string
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
ABLY_API_KEY=your_ably_api_key
PORT=3344
```

4. Start the server:
```bash
npm start
```

## 📁 Project Structure

```
mostaqelCloneBackEnd/
├── controllers/     # Business logic
├── models/         # Database models
├── routes/         # API routes
├── middlewares/    # Custom middlewares
├── uploads/        # File uploads
├── static/         # Static files
└── index.js        # Application entry point
```

## 🔌 API Endpoints

- `/users` - User management
- `/messages` - Messaging system
- `/payment` - Payment processing
- `/categories` - Category management
- `/proposals` - Proposal system
- `/reviews` - Review system
- `/projects` - Project management
- `/complaints` - Complaint system
- `/admins` - Admin operations
- `/notifications` - Notification system
- `/skills` - Skills management
- `/portfolio` - Portfolio management
- `/balance` - Balance management
- `/conversations` - Conversation management
- `/transactions` - Transaction history
- `/paypal` - PayPal integration
- `/earning` - Earnings management
- `/platformEarnings` - Platform earnings tracking

## 🔒 Security

- JWT Authentication
- Password Hashing with bcrypt
- CORS enabled
- Environment Variables for sensitive data
- Input validation using Joi
- Secure file upload handling

## 🚀 Deployment

The application can be deployed on various platforms:
- Heroku (using Procfile)
- Vercel (using vercel.json)
- Netlify (using netlify.toml)

## 📝 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request