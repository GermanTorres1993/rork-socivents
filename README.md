# Socivents - Event Discovery & Social App

A production-ready React Native app for discovering events and connecting with people through real-time chat.

## 🚀 Quick Setup for Production

### Prerequisites
- Node.js 18+ 
- Expo CLI
- Supabase account (required - no mock data)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase (Required)
1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from Settings > API
3. Update `.env` with your credentials:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Set Up Database
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire contents of `lib/database-setup.sql`
4. Click "Run" to execute all commands

### 4. Start the App
```bash
npm start
```

## ✨ Features

- **Real-time Authentication** - Secure login with Supabase Auth
- **Event Discovery** - Browse and filter events by category
- **Event Creation** - Create and manage your own events
- **Ticketing System** - Purchase and manage event tickets
- **Live Chat** - Real-time chat with other attendees
- **User Profiles** - Complete profile management
- **Payment Ready** - Stripe integration ready

## 🏗️ Architecture

### Frontend
- **React Native** with Expo SDK 53
- **TypeScript** for type safety
- **Zustand** for state management
- **Expo Router** for navigation
- **@expo/vector-icons** for icons

### Backend
- **Supabase** for database, auth, and real-time
- **PostgreSQL** with Row Level Security
- **Real-time subscriptions** for chat
- **tRPC** for type-safe API calls

### Key Components
- `/app` - Screen components and navigation
- `/components` - Reusable UI components  
- `/store` - Zustand state management
- `/lib` - Supabase configuration and utilities
- `/types` - TypeScript definitions

## 🔒 Security Features

- Row Level Security (RLS) policies
- JWT-based authentication
- Secure real-time subscriptions
- Input validation with Zod
- Protected routes and data access

## 📱 Screens

- **Authentication** - Login/signup with email or social
- **Event Discovery** - Browse events with category filters
- **Event Details** - Full event information and ticket purchase
- **Event Creation** - Create new events with image upload
- **Real-time Chat** - Event-specific chat rooms
- **User Profile** - Profile management and settings
- **Ticket Management** - View and manage purchased tickets
- **Legal** - EULA and privacy policy

## 🚀 Deployment

### Mobile App
```bash
# Build for production
expo build

# Or use EAS Build
eas build --platform all
```

### Backend
- Supabase handles all backend infrastructure
- Configure production environment variables
- Set up custom domain if needed

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | ✅ Yes |

## 📊 Database Schema

### Core Tables
- `users` - User profiles and authentication
- `events` - Event information and details  
- `tickets` - Ticket purchases and status
- `chat_rooms` - Event-specific chat rooms
- `chat_messages` - Real-time chat messages

### Features
- Automatic chat room creation for events
- Real-time message updates
- Secure ticket validation
- Event categorization and filtering

## 🛠️ Development

### Running Locally
```bash
# Start development server
npm start

# Start with web support
npm run start-web
```

### Code Structure
- Clean component architecture
- Type-safe API calls with tRPC
- Responsive design for mobile and web
- Error handling and loading states

## 📞 Support

For technical support or questions:
- 📧 support@socivents.com
- 📖 Check the database setup guide in `lib/database-setup.sql`
- 🐛 Report issues with detailed error logs

## 📄 License

MIT License - see LICENSE file for details

---

**Note**: This app requires Supabase configuration for production use. It's designed for real users with a complete backend infrastructure.