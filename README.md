# VoucherX | Save with AI

**Don't let your vouchers expire. Trade. Earn. Repeat.**

VoucherX is a modern web application that enables users to trade, buy, and sell vouchers before they expire. Built with React, TypeScript, and Supabase, it features an AI-powered assistant that helps users optimize their voucher portfolio and make smart trading decisions.

![VoucherX](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.57.4-3ECF8E?logo=supabase)

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Database Schema](#️-database-schema)
- [Tech Stack](#-tech-stack)
- [Key Features Explained](#-key-features-explained)
- [Security Features](#-security-features)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Documentation](#-documentation)
- [Roadmap](#-roadmap)
- [Contributors](#-contributors)
- [License](#-license)
- [Support](#-support)

## 🌟 Features

### Core Features
- **🛍️ Marketplace**: Browse and purchase verified vouchers from trusted sellers
- **🔄 Smart Exchange**: AI-powered voucher matching for optimal trades
- **💼 Digital Wallet**: Manage your active and redeemed vouchers in one place
- **🏆 Gamification**: Complete challenges to earn VoucherCoins
- **❤️ Wishlist**: Track favorite brands and get notified of new deals
- **👤 User Profiles**: Manage your account, view stats, and track your trading history

### AI-Powered Features
- **🤖 AI Assistant**: Get intelligent recommendations and insights
- **📊 Portfolio Analysis**: Analyze your voucher collection
- **⏰ Expiry Tracking**: Smart alerts for vouchers nearing expiration
- **💰 Discount Calculator**: Calculate savings from multiple vouchers
- **🎯 Smart Recommendations**: Personalized trading suggestions

### Security & Trust
- **✅ Voucher Verification**: All vouchers are verified before listing
- **⭐ User Ratings**: Transparent rating system for buyers and sellers
- **🔒 Secure Authentication**: Powered by Supabase Auth
- **🛡️ RLS Policies**: Row-level security for data protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/voucherx.git
cd voucherx
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**

- Go to your Supabase project dashboard
- Navigate to the SQL Editor
- Copy the contents of `DATABASE_QUERIES.md` and execute the SQL

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
voucherx/
├── src/
│   ├── components/          # React components
│   │   ├── AIAssistant.tsx  # AI chat interface
│   │   ├── Auth.tsx         # Authentication forms
│   │   └── Layout.tsx       # Main layout wrapper
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── Home.tsx
│   │   ├── Marketplace.tsx
│   │   ├── Exchange.tsx
│   │   ├── Wallet.tsx
│   │   ├── Challenges.tsx
│   │   ├── Wishlist.tsx
│   │   └── Profile.tsx
│   ├── utils/               # Utility functions
│   │   └── aiAssistant.ts   # AI logic and algorithms
│   ├── lib/                 # Third-party integrations
│   │   └── supabase.ts      # Supabase client
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── supabase/
│   └── migrations/          # Database migrations
├── public/                  # Static assets
├── DATABASE_QUERIES.md      # Complete database schema
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🗄️ Database Schema

### Core Tables
- **profiles**: User accounts and statistics
- **vouchers**: Marketplace voucher listings
- **trades**: Voucher exchange transactions
- **transactions**: Purchase history
- **user_vouchers**: User's voucher wallet
- **ratings**: User reviews and ratings
- **challenges**: Gamification challenges
- **user_challenges**: Challenge progress tracking
- **wishlists**: User wishlist items
- **notifications**: User notifications

See `DATABASE_QUERIES.md` for the complete schema with all tables, policies, and indexes.

## 🎨 Tech Stack

### Frontend
- **React 18.3.1**: UI library
- **TypeScript 5.5.3**: Type safety
- **Vite 5.4.2**: Build tool and dev server
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Lucide React**: Icon library

### Backend
- **Supabase**: Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Row Level Security
  - Real-time subscriptions

### Development Tools
- **ESLint**: Code linting
- **TypeScript ESLint**: TypeScript-specific linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📚 Key Features Explained

### AI Assistant
The AI Assistant provides:
- Real-time portfolio analysis
- Expiry status monitoring
- Multi-voucher discount calculations
- Smart trade recommendations
- Portfolio optimization suggestions

### Smart Exchange
Matches vouchers based on:
- Value similarity
- Brand popularity
- Expiry dates
- User preferences
- Trading history

### VoucherCoins System
Earn coins by:
- Completing daily/weekly challenges
- Trading vouchers
- Maintaining high ratings
- Verifying vouchers

Use coins for:
- Fee-free trades (500+ coins)
- Premium features
- Real voucher redemption

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Authentication**: Secure email/password authentication via Supabase
- **Data Validation**: Client and server-side validation
- **Secure Code Storage**: Voucher codes protected and encrypted
- **User Verification**: Voucher verification system

## 🚦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run typecheck
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any static hosting service (Netlify, AWS S3, etc.)

```bash
# Build the app
npm run build

# Deploy the 'dist' folder
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGc...` |

## 🐛 Troubleshooting

### Common Issues

**Issue**: Database connection fails
- **Solution**: Verify your Supabase credentials in `.env`

**Issue**: Tables not found
- **Solution**: Run the SQL from `DATABASE_QUERIES.md` in Supabase SQL Editor

**Issue**: Authentication not working
- **Solution**: Check Supabase Auth settings and ensure email confirmation is configured

**Issue**: Build fails
- **Solution**: Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 📖 Documentation

For detailed documentation on specific features:
- [Database Schema](./DATABASE_QUERIES.md)
- [AI Assistant Logic](./src/utils/aiAssistant.ts)
- [Authentication Flow](./src/contexts/AuthContext.tsx)

## 🎯 Roadmap

- [ ] Push notifications for expiring vouchers
- [ ] Mobile app (React Native)
- [ ] Social sharing features
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment gateway integration
- [ ] Auction system for rare vouchers
- [ ] Referral program

## � Contributors

Thanks to all the amazing people who have contributed to VoucherX! 🎉

<a href="https://github.com/jaiashwinisatish/VoucherX/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=jaiashwinisatish/VoucherX" alt="VoucherX Contributors" />
</a>

Want to see your face here? Check out our [Contributing Guide](#-contributing) and submit a PR!

## �📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Author

- **jaiashwinisatish** - Project Owner - [GitHub](https://github.com/jaiashwinisatish)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Lucide](https://lucide.dev) for the beautiful icons
- [Vite](https://vitejs.dev) for the lightning-fast build tool

## 📞 Support

For support, email support@voucherx.com or open an issue in the GitHub repository.

---

**Built with ❤️ by the VoucherX Team**

*Don't let your vouchers expire. Trade. Earn. Repeat.*
