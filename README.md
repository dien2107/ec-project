# E-Commerce Fashion Platform - MEYA Shop

> Full-stack E-commerce application built with React Router v7, TypeScript, Redux Toolkit, and modern web technologies.

## 🚀 Tech Stack

### Frontend Core

- **React Router v7** - Server-side rendering & routing
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components

### State Management & Data Fetching

- **Redux Toolkit** - Global state management
- **React Query (TanStack Query)** - Server state management
- **React Hook Form** - Form validation and handling
- **Zod** - Schema validation

### UI & Animations

- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Swiper** - Touch slider
- **Lucide React** - Icon library
- **React Hot Toast / Sonner** - Toast notifications

### Real-time Features

- **Socket.io Client** - WebSocket communication for live chat

## 📁 Project Structure

```
app/
├── features/              # Feature-based modules
│   ├── clients/          # Customer-facing features
│   │   ├── home/         # Homepage with hero banner, categories
│   │   ├── product-detail/ # Product detail page with reviews
│   │   ├── cart/         # Shopping cart & checkout
│   │   ├── payment/      # Payment processing (QR, COD)
│   │   ├── user-profile/ # User dashboard, orders, reviews
│   │   ├── auth/         # Login, register, forgot password, verify
│   │   ├── categories/   # Product listing & filtering
│   │   ├── address/      # Address management
│   │   └── chatbox/      # AI chatbot support
│   │
│   └── system/           # Admin panel features
│       ├── dashboard/    # Analytics & statistics
│       ├── products/     # Product management
│       ├── orders/       # Order processing
│       ├── customers/    # Customer management
│       ├── categories/   # Category management
│       ├── reviews/      # Review moderation
│       ├── promotions/   # Discount & promotion management
│       ├── material/     # Material & fabric management
│       ├── colors/       # Color variants management
│       ├── sizes/        # Size management
│       ├── suppliers/    # Supplier management
│       ├── payment/      # Payment method configuration
│       ├── shipping/     # Shipping method setup
│       ├── import-orders/ # Inventory management
│       ├── decentralization/ # Role & permission management
│       └── user-information-detail/ # Admin user profile
│
├── components/           # Shared components
│   ├── ui/              # Reusable UI components (Button, Card, Dialog, etc.)
│   ├── common/          # Common components (Navbar, Menu)
│   ├── layouts/         # Layout components (Header, Footer)
│   └── features/        # Feature-specific shared components
│
├── layouts/             # Layout wrappers
│   ├── customer-layout.tsx  # Customer-facing layout
│   └── admin-layout.tsx     # Admin panel layout
│
├── redux/               # Redux store configuration
│   ├── store.ts         # Store setup with TypeScript
│   └── slices/          # Redux slices (auth, cart, products, etc.)
│
├── services/            # API service layer
│   ├── auth.ts          # Authentication APIs
│   ├── products.ts      # Product APIs
│   ├── orders.ts        # Order APIs
│   └── ...              # Other service modules
│
├── types/               # TypeScript type definitions
│   ├── address/         # Address-related types
│   ├── product/         # Product types
│   └── ...              # Domain-specific types
│
├── hooks/               # Custom React hooks
├── libs/                # Utility functions & helpers
├── middlewares/         # API middleware
├── constants/           # Application constants
└── configs/             # Configuration files

public/                  # Static assets
```

## ✨ Key Features

### Customer Features

- **🛍️ Product Browsing**
  - Advanced filtering & sorting
  - Category navigation
  - Search functionality
  - Product detail with image gallery
- **🛒 Shopping Cart & Checkout**
  - Real-time cart updates
  - Discount code application
  - Multiple payment methods (Bank transfer, COD)
  - QR code payment integration
- **👤 User Account**
  - Profile management with avatar upload
  - Order history tracking
  - Review & rating system
  - Address book management
- **💬 AI Chatbot**
  - Real-time support via Socket.io
  - Product recommendations

### Admin Features

- **📊 Dashboard**
  - Revenue analytics (Bar/Line/Pie charts)
  - Order statistics
  - Customer insights
  - Weekly/monthly reports
- **📦 Product Management**
  - CRUD operations with image upload
  - Variant management (size, color)
  - Material & fabric tracking
  - Inventory management
- **🎫 Promotion Management**
  - Discount code creation
  - Percentage/Fixed amount discounts
  - Usage limits & tracking
- **👥 Customer Management**
  - User profiles & order history
  - Account status control
- **🔒 Role & Permission System**
  - Granular permission control
  - Role-based access (RBAC)
  - Resource-level permissions

## 🔑 Technical Highlights

### Performance Optimizations

- Server-side rendering with React Router v7
- Code splitting by route
- Image lazy loading
- Optimistic UI updates with React Query
- Memoized components with `React.memo`

### State Management

- **Redux Toolkit** for global state (auth, cart, user)
- **React Query** for server state with caching & invalidation
- **React Hook Form** for performant form handling

### Security

- JWT-based authentication
- Role-based access control (RBAC)
- Form validation with Zod schemas
- XSS protection via sanitization

### Real-time Features

- Socket.io for live chat
- Real-time order updates
- Instant notifications with toast system

### Developer Experience

- Full TypeScript coverage
- ESLint & Prettier configured
- Component-driven architecture
- Reusable UI component library
- Hot module replacement (HMR)

## 🎨 UI/UX Features

- Responsive design (mobile-first)
- Smooth animations with Framer Motion
- Accessible components (Radix UI)
- Consistent design system
- Loading skeletons for better UX
- Toast notifications for user feedback

## 📦 Build & Deployment

```bash
# Development
npm run dev

# Production build
npm run build

# Docker support
docker build -t ecommerce-app .
docker run -p 3000:3000 ecommerce-app
```

## 🔧 Configuration

- Environment variables via `.env`
- TypeScript config in `tsconfig.json`
- Vite config in `vite.config.ts`
- TailwindCSS config in `tailwind.config.js`

## 📈 Scalability Considerations

- Feature-based folder structure for easy maintenance
- Separation of concerns (services, components, state)
- Modular component design
- API service layer for easy backend switching
- Type-safe development reducing runtime errors

---

**Note**: This is a production-ready e-commerce platform with comprehensive features for both customers and administrators, built with modern web technologies and best practices.
