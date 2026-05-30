# 🥗 NutriSnap - Nutrition Tracking Made Simple

![NutriSnap Logo](./public/favicon.svg)

> **Built with [Bolt.new](https://bolt.new)** - Modern AI-powered full-stack development in seconds

A beautiful and intelligent nutrition tracking application that helps you monitor your daily food intake, water consumption, and achieve your health goals with an intuitive and stunning interface.

---

## 🚀 Built with Bolt.new

This project was rapidly developed using **[Bolt.new](https://bolt.new)**, a revolutionary AI-powered web development platform that allows developers to build full-stack applications in seconds. Bolt.new combines:

- **Claude AI Integration**: Intelligent code generation and problem-solving
- **Real-time Preview**: Instant visual feedback as you build
- **Full-Stack Setup**: Complete environment from frontend to backend configuration
- **Rapid Development**: Weeks of work compressed into hours

Using Bolt.new allowed us to:
- ⚡ Rapidly prototype and iterate on complex features
- 🎨 Design a beautiful, modern UI with TailwindCSS
- 🔧 Configure a complete tech stack with best practices
- 🤖 Integrate advanced AI capabilities (Gemini Vision)
- ✅ Deploy production-ready code faster than traditional development

> Learn more at [bolt.new](https://bolt.new) - Transform your ideas into working applications instantly!

---

## 🎯 Features

### Core Tracking
- **Food Logging**: Search and log meals with comprehensive nutritional data from USDA database
- **AI-Powered Food Scanner**: Use your camera to automatically identify and log food items with Gemini Vision AI
- **Water Tracking**: Monitor daily water intake with visual progress indicators
- **Macro Tracking**: Track proteins, carbs, fats, and fiber intake with visual ring charts
- **Calorie Counter**: Real-time calorie calculation and daily goal monitoring

### Analytics & Insights
- **Daily Dashboard**: Overview of calories, macros, water intake, and nutritional insights
- **Insights Engine**: AI-powered daily nutrition insights and recommendations
- **Analytics Dashboard**: Detailed charts and statistics for food consumption patterns
- **Streak Tracking**: Visual streak badges for consistency motivation
- **Goals Management**: Set and track personalized health goals

### User Experience
- **Authentication**: Secure user registration and login with Supabase
- **Responsive Design**: Beautiful UI optimized for desktop, tablet, and mobile
- **Dark Mode Support**: Eye-friendly dark theme
- **Real-time Updates**: Instant synchronization across devices
- **Food Suggestions**: Smart meal suggestions based on daily progress

### Additional Features
- **Profile Customization**: Personalize health goals and preferences
- **Settings**: Configure notifications and app preferences
- **About Section**: Learn more about the application
- **Forgot Password**: Secure password recovery

---

## 🤖 Development with Bolt.new - The Magic Behind NutriSnap

This application exemplifies the power of AI-assisted development. Here's how **Bolt.new** accelerated the development:

### Architecture & Setup
✅ **Instant Project Scaffolding**: Complete React + TypeScript + Vite setup in seconds
✅ **Dependency Management**: Automatically configured all 40+ npm packages with correct versions
✅ **Configuration Files**: TailwindCSS, ESLint, TypeScript configurations pre-optimized
✅ **Routing Setup**: React Router configured for multi-page SPA navigation

### Component Development  
✅ **Smart Component Generation**: Claude AI generated complex components with proper hooks and state management
✅ **UI Consistency**: All Radix UI components integrated with consistent styling via TailwindCSS
✅ **Responsive Design**: Mobile-first approach built into every component from the start
✅ **Dark Mode Support**: Theme system implemented across all components automatically

### Advanced Features
✅ **State Management**: Zustand stores created with proper TypeScript typing
✅ **API Integration**: Supabase configuration, USDA API client, and Gemini Vision integration
✅ **Real-time Updates**: React Query cache strategy implemented efficiently
✅ **Custom Hooks**: 7+ custom hooks created with proper error handling and loading states

### Quality & Best Practices
✅ **Type Safety**: Full TypeScript implementation with strict mode enabled
✅ **Error Handling**: Graceful error states and recovery options throughout the app
✅ **Performance**: Optimized renders, lazy loading, and efficient state updates
✅ **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation built-in

### Time to Market
- **Traditional Development**: Would take 2-4 weeks with a full team
- **Bolt.new Approach**: Completed in hours with AI assistance
- **Quality**: Enterprise-grade code with best practices

> **The Bolt.new Advantage**: Instead of spending weeks on boilerplate setup, debugging configuration, and context-switching between different tools, developers can focus on business logic and user experience. Claude AI handles the technical complexity!

---

## 🛠️ Tech Stack

### Frontend
- **React 19**: Latest React with server components support
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components

### Backend & Database
- **Supabase**: PostgreSQL database and authentication
- **TanStack React Query**: Server state management
- **Zustand**: Client state management

### AI & APIs
- **Google Generative AI**: Gemini Vision for food recognition
- **USDA FoodData Central**: Comprehensive food nutrition database
- **Recharts**: Data visualization and charts

### Tools
- **React Router**: Client-side navigation
- **React Hook Form**: Efficient form management
- **Zod**: TypeScript-first schema validation
- **Lucide React**: Beautiful icon library
- **date-fns**: Modern date manipulation

## 📁 Project Structure

```
src/
├── pages/                 # Page components
│   ├── Dashboard.tsx     # Main nutrition dashboard
│   ├── FoodSearch.tsx    # Food database search
│   ├── WaterTracking.tsx # Water intake tracking
│   ├── Analytics.tsx     # Charts and statistics
│   ├── Goals.tsx         # Goal management
│   ├── Profile.tsx       # User profile
│   ├── Settings.tsx      # App settings
│   └── Landing.tsx       # Public landing page
├── components/
│   ├── dashboard/        # Dashboard widgets
│   ├── layout/           # Layout components
│   └── shared/           # Shared UI components
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication logic
│   ├── useDailyProgress.ts # Progress tracking
│   ├── useInsights.ts    # AI insights
│   └── ...
├── lib/                  # Utilities & services
│   ├── aiScanner.ts      # AI food recognition
│   ├── foodApi.ts        # USDA API integration
│   ├── insightsEngine.ts # AI recommendations
│   └── ...
├── stores/               # Zustand state management
├── types/                # TypeScript interfaces
└── router/               # Route configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud API key (for Gemini Vision)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/idixd33-code/NutriSnap.git
cd NutriSnap
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_AI_VISION_KEY=your_google_ai_key
VITE_USDA_API_KEY=your_usda_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 📖 Usage

### Tracking Food
1. Navigate to the Dashboard or Food Search page
2. Search for food items in the database
3. Select portion size and meal type
4. Food is automatically logged with nutritional data

### AI Food Recognition
1. Click the camera icon on the dashboard
2. Allow camera access
3. Point camera at your food
4. AI identifies and logs the food automatically

### Monitoring Progress
- View daily calories and macros on the dashboard
- Track water intake with the water widget
- Monitor streaks for consistency motivation
- Review analytics for weekly/monthly trends

### Setting Goals
1. Go to Goals page
2. Set daily targets for calories, macros, water, etc.
3. Track progress against your goals
4. Receive AI-powered recommendations

## 🎨 UI/UX Highlights

- Clean, minimalist design with emerald green accent colors
- Smooth animations and transitions
- Loading states with skeleton screens
- Empty states with helpful guidance
- Error handling with recovery options
- Responsive grid layouts
- Accessible form components

## 📊 Data Flow

```
User Input → Food API/AI Scanner
    ↓
Zustand State Store
    ↓
Supabase Database
    ↓
React Query Cache
    ↓
Analytics Engine & Insights
    ↓
Dashboard Visualization
```

## 🔒 Security

- Authentication via Supabase
- API keys stored in environment variables
- USDA FoodData Central for verified nutrition data
- Secure password storage and recovery
- Type-safe API interactions

## 🚢 Deployment

The application is ready for deployment on:
- Vercel (recommended for Vite + React)
- Netlify
- GitHub Pages
- Custom servers with Node.js

## 📝 License

This project is open source and available under the **MIT License**.

### MIT License Summary
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

**The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.**

For the full license text, see the [LICENSE](./LICENSE) file in this repository.

### Third-Party Licenses

NutriSnap uses several open-source libraries. Below are the key dependencies and their licenses:

| Package | License | Purpose |
|---------|---------|---------|
| React | MIT | UI framework |
| TypeScript | Apache 2.0 | Type safety |
| Vite | MIT | Build tool |
| TailwindCSS | MIT | Styling |
| Radix UI | MIT | Component primitives |
| Supabase | Apache 2.0 | Backend & Database |
| Zustand | MIT | State management |
| TanStack Query | MIT | Server state |
| Google Generative AI | Apache 2.0 | AI Vision API |
| React Router | MIT | Routing |
| Recharts | MIT | Charts & graphs |

All licenses comply with open-source standards. For complete license information, run `npm license` or see `node_modules/.package-lock.json`.

---

## 👥 Contributors & Credits

### Project Team

**NutriSnap** was created as a demonstration of modern AI-assisted development using Bolt.new. 

- **Architecture & Design**: Built with Bolt.new's Claude AI integration
- **AI Development**: Leverages Claude AI for intelligent code generation
- **UI/UX**: Modern design principles with React and TailwindCSS

### Special Thanks

- **[Bolt.new](https://bolt.new)** - Revolutionary AI-powered web development platform
- **Claude AI** - Intelligent code generation and problem-solving
- **Supabase** - Backend infrastructure and database
- **Google Cloud** - Generative AI and Vision API
- **USDA** - FoodData Central API
- **Radix UI** - Accessible component primitives
- **The React Community** - For the amazing ecosystem

### Open to Contributors

We welcome contributions! If you'd like to contribute:

1. **Report Bugs**: Found an issue? [Create a bug report](https://github.com/idixd33-code/NutriSnap/issues)
2. **Feature Requests**: Have an idea? [Suggest a feature](https://github.com/idixd33-code/NutriSnap/issues)
3. **Code Contributions**: 
   - Fork the repository
   - Create a feature branch (`git checkout -b feature/amazing-feature`)
   - Commit your changes (`git commit -m 'Add amazing feature'`)
   - Push to the branch (`git push origin feature/amazing-feature`)
   - Open a Pull Request

### Developer Credits

This project demonstrates best practices in:
- **Full-Stack Development**: React + TypeScript + Supabase
- **AI Integration**: Gemini Vision and Google Generative AI
- **Modern UI**: TailwindCSS + Radix UI components
- **State Management**: Zustand + React Query
- **Rapid Development**: Built with Bolt.new

---

## 💡 About This Project

**NutriSnap** is designed with the modern health-conscious user in mind. Whether you're:
- 🏋️ Tracking macros for fitness goals
- 🥗 Adopting a healthier lifestyle
- 📊 Monitoring nutritional intake for medical reasons
- 💚 Simply curious about your eating habits

NutriSnap provides an intuitive platform with powerful AI capabilities to make nutrition tracking effortless and engaging.

### Key Innovations

1. **AI-Powered Food Recognition**: Instead of manually searching and logging every item, point your camera at your food and let Gemini Vision AI do the heavy lifting
2. **Comprehensive Nutrition Database**: Powered by USDA FoodData Central with thousands of food items and their exact nutritional breakdowns
3. **Smart Insights**: The Insights Engine analyzes your daily consumption patterns and provides personalized recommendations
4. **Beautiful Analytics**: Visualize your nutrition trends with intuitive charts and weekly/monthly statistics
5. **Streak Gamification**: Maintain consistency with visual streak badges to motivate daily tracking

### Why NutriSnap?

- **No Learning Curve**: Intuitive interface that's easy to navigate for users of all tech levels
- **AI-Assisted**: Advanced AI makes tracking faster and more accurate than manual entry
- **Privacy First**: All data synced to your personal Supabase instance
- **Real-time Feedback**: Instant calculations and progress updates as you log meals
- **Beautiful Design**: Modern UI with dark mode support for comfortable extended use

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🏢 Project Information

- **Repository**: [github.com/idixd33-code/NutriSnap](https://github.com/idixd33-code/NutriSnap)
- **Developer**: [idixd33-code](https://github.com/idixd33-code)
- **Built with**: [Bolt.new](https://bolt.new) - AI-Powered Development Platform
- **AI Assistant**: Claude (Anthropic)
- **Status**: Active Development 🚀
- **Latest Update**: May 30, 2026

## 📧 Support & Contact

For support, questions, or feedback:

- 📧 **Email**: dev@nutrisnap.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/idixd33-code/NutriSnap/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/idixd33-code/NutriSnap/discussions)
- 🤝 **Partnerships**: Contact via GitHub or email

## 🌟 Show Your Support

If you find NutriSnap helpful:
- ⭐ Star the repository on GitHub
- 🐛 Report any bugs you find
- 💬 Share your feedback and suggestions
- 📢 Tell your friends about NutriSnap!

---

## 📜 Changelog

### Version 1.0.0 (May 30, 2026)
- ✅ Initial release with core features
- ✅ AI-powered food recognition
- ✅ Complete nutrition tracking system
- ✅ User authentication and profiles
- ✅ Analytics and insights dashboard
- ✅ Water tracking with goals
- ✅ Responsive mobile-first design
- ✅ Dark mode support

---

<div align="center">

**[NutriSnap](https://github.com/idixd33-code/NutriSnap)** - Track your nutrition with beautiful simplicity. 🥗💚

*Built with Artificial Intelligence for Natural Health*

**[Explore on GitHub](https://github.com/idixd33-code/NutriSnap)** • **[Try the App](https://github.com/idixd33-code/NutriSnap)** • **[Report Issues](https://github.com/idixd33-code/NutriSnap/issues)**

</div>
