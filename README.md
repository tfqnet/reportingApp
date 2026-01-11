# SafetyReport - Multi-Tenant Safety Reporting System

A comprehensive safety reporting system for managing Unsafe Acts and Unsafe Conditions across multiple organizations in industries like oil & gas, construction, and manufacturing.

## 🏗️ Architecture

This is a monorepo containing:

- **`backend/`** - Node.js + Express + TypeScript + Prisma + PostgreSQL API
- **`web/`** - React + TypeScript + Vite web application
- **`mobile/`** - React Native + Expo mobile application
- **`shared/`** - Shared TypeScript types and utilities
- **`docs/`** - System documentation

## ✨ Features (MVP Phase 1)

- ✅ Multi-tenant architecture with complete data isolation
- ✅ Report submission with photo capture and GPS location
- ✅ Smart categorization (Unsafe Acts vs Unsafe Conditions)
- ✅ Assignment workflow for supervisors and safety officers
- ✅ Dashboard with key safety metrics
- ✅ JWT-based authentication
- ✅ Offline support for mobile app
- ✅ Role-based access control

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker and Docker Compose (for database)
- Expo CLI (for mobile development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd safetyreport
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Web
cp web/.env.example web/.env
# Edit web/.env with your configuration

# Mobile
cp mobile/.env.example mobile/.env
# Edit mobile/.env with your configuration
```

4. Start the PostgreSQL database:
```bash
npm run docker:up
```

5. Run database migrations:
```bash
npm run db:migrate
```

6. (Optional) Seed the database:
```bash
npm run db:seed
```

### Development

Run all services in separate terminals:

```bash
# Terminal 1 - Backend API
npm run backend

# Terminal 2 - Web app
npm run web

# Terminal 3 - Mobile app
npm run mobile
```

Access the applications:
- Backend API: http://localhost:3000
- Web App: http://localhost:5173
- Mobile App: Scan QR code with Expo Go app

## 📁 Project Structure

```
safetyreport/
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   ├── tests/               # Backend tests
│   └── package.json
├── web/                     # React web app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── store/           # State management
│   │   ├── utils/           # Helper functions
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   └── package.json
├── mobile/                  # React Native app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── screens/         # Screen components
│   │   ├── navigation/      # Navigation setup
│   │   ├── services/        # API client & offline
│   │   ├── store/           # State management
│   │   └── App.tsx          # Entry point
│   ├── assets/              # Images, fonts
│   └── package.json
├── shared/                  # Shared code
│   ├── src/
│   │   ├── types/           # TypeScript interfaces
│   │   ├── constants/       # App constants
│   │   └── utils/           # Shared utilities
│   └── package.json
├── docs/                    # Documentation
│   ├── architecture.md
│   ├── api-spec.md
│   └── database-schema.md
├── docker-compose.yml       # Docker services
├── package.json             # Root package.json
└── README.md
```

## 🔧 Available Scripts

### Root Level
- `npm run install:all` - Install all dependencies
- `npm run build:all` - Build all packages
- `npm run lint` - Run linters on all packages
- `npm run format` - Format code with Prettier
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Run Prisma migrations
- `npm run studio` - Open Prisma Studio

### Web
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Mobile
- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/uauc_db

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# AWS S3 (or compatible)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=uauc-media

# Cors
CORS_ORIGIN=http://localhost:5173
```

### Web (`web/.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

### Mobile (`mobile/.env`)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## 🗄️ Database

The system uses PostgreSQL with a multi-tenant architecture:
- Single shared database
- All tables include `tenant_id` for isolation
- Row-level security enabled
- Automatic tenant filtering via middleware

See [docs/database-schema.md](docs/database-schema.md) for detailed schema documentation.

## 📱 Multi-Tenant Features

Each tenant (organization) gets:
- ✅ Complete data isolation
- ✅ Custom branding (colors, logo)
- ✅ Custom categories and workflows
- ✅ Independent user management
- ✅ Separate media storage
- ✅ Custom reporting fields

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Web tests
cd web && npm test

# Mobile tests
cd mobile && npm test
```

## 📚 Documentation

- [Architecture Overview](docs/architecture.md)
- [API Specification](docs/api-spec.md)
- [Database Schema](docs/database-schema.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

Built with ❤️ for safer workplaces

---

For questions or support, please open an issue on GitHub.
