# Kotak811 for enterprises

A corporate-branded, unified digital hub where employees can access banking and financial services seamlessly within their work ecosystem. Built for **Kotak811 + Tartan** partnership.

## 🎯 Overview

This platform provides:
- **AI-Centric Experience**: FinAgent (AI Financial Agent) for personalized recommendations
- **Hyper-Personalization**: Products based on salary, tenure, and company policies
- **Pre-approved Offers**: Credit cards, loans, insurance
- **Goal-Based Planning**: Help employees achieve life goals
- **HR Management**: Benefits administration and approval workflows

## 🚀 Getting Started

```bash
npm install
npm run dev
```

The app will start on `http://localhost:5173`

## 🔐 Login Credentials

**Mock Authentication** - Use any credentials:
- **Phone**: Any 10-digit number
- **OTP**: Any 6-digit number

## 📱 Pages & Navigation

### Employee Interface
1. **Login Page** (`/`)
   - Mobile OTP authentication
   - Geographic branding on left

2. **Dashboard** (after login)
   - 80/20 split layout
   - FinAgent AI sidebar
   - Financial health score
   - Pre-approved offers
   - Goal-based journeys
   - Product marketplace

3. **My Orders** (via navigation button)
   - Active products (credit cards, insurance, etc.)
   - Application history
   - Track status of applications

### HR Portal
**Note**: The HR Portal is a separate interface for HR administrators (role-based access).

**To access the HR Portal**:
- Simply navigate to: `http://localhost:5173/#hr`
- Or append `#hr` to your current URL
- The HR portal will auto-authenticate (separate role in production)

**HR Features**:
- Overview dashboard with company metrics
- Employee directory with HRMS sync
- Benefits management (enable/disable products)
- Approval queue for pending applications

## 🎨 Design System

- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Font**: Plus Jakarta Sans
- **Colors**: Kotak811 theme
- **Components**: shadcn/ui (Button, Card, Badge, Input, etc.)

## 📂 Project Structure

```
src/
├── components/
│   ├── Login.tsx                 # Login page
│   ├── Dashboard.tsx             # Employee dashboard
│   ├── Orders.tsx                # My Orders page
│   ├── HR.tsx                    # HR Portal
│   ├── ui/                       # shadcn/ui components
│   └── dashboard/                # Dashboard components
├── App.tsx                       # Main app router
├── index.css                     # Global styles + Kotak811 theme
└── main.tsx                      # Entry point
```

## 📖 Documentation

See `PROJECT_DIRECTIONS.md` for comprehensive documentation including:
- Architecture and design philosophy
- Component structure
- User flows
- Mock data
- Development guidelines

## 🔧 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Hooks** for state management

## 🎯 Key Features

### FinAgent (AI Agent)
- Smart pre-configured actions
- Step-by-step thinking visualization
- Personalized responses based on employee profile
- Natural language interface

### Hyper-Personalization
- All recommendations based on salary, tenure, financial score
- Dynamic interest rates
- Tailored product suggestions

### HR Management
- Employee directory with sync
- Benefits administration
- Approval workflows
- Analytics dashboard

## 🚀 Future Enhancements

- Real API integration
- Role-based authentication
- Document upload & verification
- Real HRMS sync
- Bank account linking
- Mobile app

---

**Built with ❤️ for Kotak811 x Tartan**
