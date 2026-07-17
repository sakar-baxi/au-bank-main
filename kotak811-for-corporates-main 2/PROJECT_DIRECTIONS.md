# Employee Financial Wellness Platform - Project Directions

## 🎯 Project Overview

An **AI-centric, corporate-branded unified digital hub** where employees can access banking and financial services seamlessly within their work ecosystem. Built for Kotak811 + Tartan partnership.

## 🏗️ Architecture & Design Philosophy

### Core Principles
1. **AI-First Approach**: FinAgent (AI Financial Agent) is the primary interface for user interactions
2. **Hyper-Personalization**: All recommendations based on employee profile (salary, tenure, company policies)
3. **Embedded Journeys**: Banking integrated into HRMS/workflows, reducing paperwork
4. **Goal-Based Planning**: Help employees achieve life goals (car, home, education, retirement)

### Technology Stack
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Font**: Plus Jakarta Sans
- **Color Scheme**: Kotak811 theme
- **State Management**: React hooks
- **Build Tool**: Vite

## 📐 Current Layout Structure

### 1. Login Page (`/src/components/Login.tsx`)
- **Left (60%)**: Geographic illustration with Kotak811 branding
- **Right (40%)**: Mobile OTP login
  - Step 1: Phone number input (auto-focused)
  - Step 2: OTP verification (auto-focused)
- **Authentication**: Mocked (accepts any 10-digit phone + any 6-digit OTP)

### 2. Employee Dashboard (`/src/components/Dashboard.tsx`)

#### Layout: 80/20 Split
- **Left (80%)**: Main content area
  - Welcome hero section
  - Financial Health Card
  - Pre-approved Offers
  - Goal-based Journeys
  - Product Marketplace

- **Right (20%)**: FinAgent Sidebar (380px fixed width)
  - Unified AI agent interface
  - Smart action buttons
  - Conversational chat
  - Agentic thinking visualization

#### Header
- Kotak811 branding
- Navigation: Dashboard | My Orders
- User dropdown menu (Profile, Settings, Logout)

### 3. My Orders Page (`/src/components/Orders.tsx`)

Employee's financial products and applications overview.

#### Active Products Tab
- Credit cards with limits and benefits
- Insurance policies (term, travel)
- Active loans
- Investment products

#### Application History Tab
- Approved applications
- In-review applications
- Rejected applications with reasons
- Resume incomplete applications

#### Features
- Tabbed interface for organization
- Status badges (Active, Approved, In Review, Rejected)
- Quick actions (Manage, View Details, Continue)
- Minimal, clean design

### 4. HR Portal (`/src/components/HR.tsx`)

**Role-Based Access**: Separate interface for HR administrators (no navigation from employee dashboard).

#### Overview Tab
- **Metrics Dashboard**:
  - Total Employees (1247)
  - Active Products (3891)
  - Pending Approvals (23)
  - Avg Financial Score (76)
  - Monthly Disbursals (₹2.3Cr)
  - Adoption Rate (68%)
- **Quick Actions**: Direct access to key features
- **Recent Activity**: Timeline of important events

#### Employee Directory Tab
- **HRMS Sync**: Modal-based sync with progress indicator
- **Search & Filter**: Find employees by name, ID, department
- **Employee Table**: 
  - Name, Employee ID
  - Department, Salary, Tenure
  - Financial Health Score
  - Number of active products
  - Status indicator
- **Actions**: View employee details, manage access

#### Benefits Management Tab
- **Enable/Disable**: Toggle switch for each benefit
- **Categories**: Loans, Cards, Insurance, Savings
- **Benefit Cards**:
  - Name, description, eligibility criteria
  - Utilization rate with progress bar
  - Total users count
  - Edit and view details options
- **Example Benefits**:
  - Pre-approved Personal Loans
  - Premium Credit Cards
  - Group Health Insurance
  - Tax Saving FD
  - Home Loan Benefits
  - Travel Insurance

#### Pending Approvals Tab
- **Application Queue**:
  - Employee name and ID
  - Product type (Personal Loan, Home Loan, Credit Card)
  - Amount requested
  - Application date
  - Priority level (High, Medium, Low)
- **Actions**: Approve, Reject, View Details
- **Visual Priority**: Color-coded urgency badges

## 🤖 FinAgent - AI Financial Agent

### Smart Actions (Pre-configured)
1. **💰 Loan Interest Rate**
   - Shows: Personalized loan rate based on profile
   - Thinking: 7 steps showing profile analysis
   
2. **🏠 Home Loan Check**
   - Shows: Eligibility up to ₹50L
   - Includes: EMI calculation, tax benefits

3. **📊 Tax Optimization**
   - Shows: Complete tax-saving plan
   - Breakdown: 80C, 80D, NPS recommendations

4. **💎 Investment Advice**
   - Shows: Best options for timeline
   - Compares: FD, Debt Funds, Liquid Funds

### Agentic Behavior
- **Thinking Visualization**: Shows step-by-step analysis
- **Personalized Results**: Based on salary (₹8.5L), tenure (3.5y), score (78)
- **Rich Answers**: Detailed with emojis, amounts, and action items

## 📊 Dashboard Components

### 1. Welcome Hero Section
- **Design**: Light background, not AI-centric
- **Purpose**: Quick access to common financial tasks
- **Actions**: Car planning, Home loan, Tax saving, Investments

### 2. Financial Health Card
- **Score Display**: Large gradient number (0-100)
- **Visual**: Circular progress ring
- **Stats**: Salary, Tenure in grid cards
- **Benefits**: Pre-approved offers, premium cards, higher rates

### 3. Pre-approved Offers
- **Cards**: Credit cards, Personal loans, Home loans
- **Info**: Interest rates, amounts, tenure, benefits
- **Design**: Gradient headers, countdown timers

### 4. Goal-based Journeys
- **Active Goals**: Car purchase, Trip planning
- **Progress**: Visual bars with percentages
- **AI Recommendations**: Specific products for each goal
- **New Goals**: Home, Education, Retirement, Wedding

### 5. Product Marketplace
- **Categories**: Savings, Insurance, Investments, Tax, Loans
- **Filters**: Interactive category pills
- **Products**: 8+ financial products
- **Design**: Hover effects, clean cards

## 🎨 Design System

### Colors (Kotak811 Theme)
```css
--primary: 231 100% 61%;     /* Primary brand blue (#3857ff) */
--secondary: 231 100% 96%;   /* Soft blue surfaces */
--accent: 343 100% 96%;      /* Subtle accent tint from #ff0049 */
```

### Spacing
- Gap between sections: 24px (`space-y-6`)
- Gap between left/right: 32px (`gap-8`)
- Container max-width: 1600px
- Padding: Responsive (px-4 sm:px-6 lg:px-8)

### Typography
- Font: Plus Jakarta Sans (300-800 weights)
- Headings: Bold, gradient text for important numbers
- Body: Regular weight, good line-height

## 🔄 User Flows

### Employee Flow
1. **Login**: Mobile OTP → Employee Dashboard
2. **Dashboard Landing**: See welcome message + quick actions
3. **Explore Options**: 
   - Click smart actions in FinAgent
   - Browse pre-approved offers
   - View active goals
   - Explore product marketplace
4. **AI Interaction**:
   - Click smart action → See thinking → Get result
   - Type custom question → See thinking → Get answer
5. **My Orders**: Navigate to view active products and applications
6. **Logout**: User menu → Logout

### HR Admin Flow
1. **Login**: Separate role-based login → HR Portal
2. **Overview Dashboard**: View company-wide metrics
3. **Employee Management**:
   - Sync HRMS data
   - Search and view employee directory
   - Monitor financial health scores
4. **Benefits Configuration**:
   - Enable/disable products
   - Set eligibility criteria
   - Monitor utilization rates
5. **Approval Workflow**:
   - Review pending applications
   - Approve or reject requests
   - View detailed application info

## 📝 Mock Data

### User Profile
```typescript
{
  name: "Rahul Sharma",
  company: "Tech Corp India",
  employeeId: "EMP12345",
  salary: 850000,      // ₹8.5L per year
  tenure: 3.5,         // years
  healthScore: 78      // out of 100
}
```

### Calculation Examples
- **Home Loan Eligibility**: 40% of annual income = EMI capacity
- **Tax Savings**: 80C (₹1.5L) + 80D (₹25k) + NPS (₹50k)
- **FD Returns**: 7.5% p.a. = ₹7,500 per ₹1L

## 🚀 Next Steps / Roadmap

### Phase 1 (Current) ✅
- ✅ Login with OTP
- ✅ Employee Dashboard layout
- ✅ FinAgent with smart actions
- ✅ Pre-approved offers
- ✅ Goal journeys
- ✅ Product marketplace
- ✅ My Orders page
- ✅ HR Portal (Overview, Directory, Benefits, Approvals)

### Phase 2 (Planned)
- [ ] Real API integration
- [ ] User profile management
- [ ] Application workflows (end-to-end)
- [ ] Document upload & verification
- [ ] Status tracking & notifications
- [ ] Role-based authentication
- [ ] Real HRMS sync integration

### Phase 3 (Future)
- [ ] Multiple company support
- [ ] Advanced analytics dashboard
- [ ] Bank account linking
- [ ] Payment gateway integration
- [ ] Mobile app (React Native)
- [ ] Chatbot NLP integration

## 🔧 Development Guidelines

### Component Structure
```
src/
├── components/
│   ├── Login.tsx                 # Login page (OTP)
│   ├── Dashboard.tsx             # Employee dashboard
│   ├── Orders.tsx                # Employee orders/products
│   ├── HR.tsx                    # HR Portal (separate role)
│   └── dashboard/
│       ├── DashboardHeader.tsx   # Header with navigation
│       ├── AIHeroSection.tsx     # Welcome section
│       ├── FinancialHealthCard.tsx
│       ├── AIAgentSidebar.tsx    # Right sidebar agent
│       ├── PreApprovedOffers.tsx
│       ├── GoalJourneys.tsx
│       └── ProductMarketplace.tsx
```

### State Management
- Local state with `useState` for UI
- Props drilling for user data
- Future: Context API or Zustand for global state

### Styling Conventions
- Use Tailwind utilities
- shadcn/ui for interactive components
- Gradient backgrounds for emphasis
- Consistent spacing (multiples of 4px)

## 🎯 Key Features

### 1. Hyper-Personalization
- All data based on employee profile
- Dynamic interest rates
- Tailored product recommendations
- Goal-specific advice

### 2. Agentic AI
- Step-by-step thinking visualization
- Contextual responses
- Smart action shortcuts
- Natural language understanding (mocked)

### 3. Embedded Finance
- Pre-approved offers based on employer
- Simplified documentation
- Quick approvals
- Integrated workflows

### 4. Goal-Based Planning
- Life event planning (car, home, education)
- Progress tracking
- Product recommendations per goal
- Timeline-based suggestions

## 📱 Responsive Design

- **Desktop (1280px+)**: Full layout with sidebar
- **Tablet (768px-1279px)**: Stacked layout, hidden sidebar
- **Mobile (<768px)**: Single column, bottom navigation

## 🔐 Security Considerations (Future)

- JWT token-based auth
- Encrypted data transmission
- PII data handling
- Session management
- Role-based access control

## 📞 Support & Contact

- **Kotak811**: Primary banking partner
- **Tartan**: Technology platform provider
- **Company HR**: Employee benefits coordination

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: Active Development

