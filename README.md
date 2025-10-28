# Jazzam - Lead Generation Platform

A modern, multilingual lead generation platform built with Next.js 15, featuring a comprehensive dashboard for businesses to manage and analyze leads effectively.

## 🚀 Features

- **Lead Management**: Comprehensive lead tracking and management system
- **Analytics Dashboard**: Real-time analytics and reporting with interactive charts
- **Multi-language Support**: Built-in internationalization (i18n) supporting English and Arabic
- **Authentication System**: Secure user authentication with role-based access
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Notifications**: Toast notifications and real-time updates
- **Form Builder**: Dynamic form creation and management
- **Data Visualization**: Interactive charts powered by D3.js
- **Progressive Web App**: PWA support with service worker
- **Subscription Management**: Built-in subscription and billing system

## 🛠 Technology Stack

- **Frontend**: Next.js 15.4.7 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit with React-Redux
- **Charts**: D3.js for data visualization
- **Animations**: GSAP (GreenSock Animation Platform)
- **Email**: EmailJS for email integration
- **Build Tool**: Turbopack (Next.js 15)
- **Fonts**: Roboto (Latin), Tajawal (Arabic)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (main-page)/       # Public pages
│   └── super-user/        # Admin dashboard
├── components/            # Reusable UI components
│   ├── shared/           # Common components
│   ├── svgs/             # SVG components
│   ├── ui/               # UI components library
│   └── view/             # Page-specific components
├── lib/                   # Utilities and configurations
│   ├── constants/        # Application constants
│   ├── hooks/            # Custom React hooks
│   ├── i18n/             # Internationalization
│   └── utils/            # Utility functions
├── providers/            # Context providers
├── redux/                # Redux store and slices
├── styles/               # CSS and animations
└── types/                # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jazzam-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🐳 Docker Support

The project includes Docker configuration for containerized deployment:

```bash
# Build Docker image
docker build -t jazzam-nextjs .

# Run container
docker run -p 3000:3000 jazzam-nextjs
```

## 🌍 Internationalization

The application supports multiple languages:

- **English** (en) - Default language
- **Arabic** (ar) - RTL support

Language files are located in the `dictionaries/` folder. The i18n system automatically handles:
- Text translation
- RTL layout for Arabic
- Font switching (Roboto for Latin, Tajawal for Arabic)

## 🎨 UI Components

The project includes a comprehensive UI component library:

- **Navigation**: Breadcrumbs, navigation indicators
- **Forms**: Inputs, textareas, dropouts, datepickers
- **Data Display**: Tables, charts, progress indicators
- **Feedback**: Toasts, modals, tooltips
- **Layout**: Accordions, tabs, marquee

## 📊 State Management

Redux Toolkit is used for state management with the following slices:

- **authSlice**: User authentication state
- **toastSlice**: Toast notification management
- **uiSlice**: UI state and preferences

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```bash
docker build -t jazzam-nextjs .
docker run -p 3000:3000 jazzam-nextjs
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Octaloop Technologies.

## 🆘 Support

For support and questions, please contact the development team at Octaloop Technologies.

---

**Built with ❤️ by Octaloop Technologies**
