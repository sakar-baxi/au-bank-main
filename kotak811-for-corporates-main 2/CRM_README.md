# Kotak811 for Corporates - Relationship Manager Dashboard

## Overview
Kotak811 for Corporates is a comprehensive module designed for Relationship Managers to manage corporate clients, configure product eligibility rules, and gain insights through AI-powered analytics.

## Accessing Kotak811 for Corporates
Navigate to: **`/#crm`**

Kotak811 for Corporates is a separate, independent module with its own authentication (auto-authenticated for demo purposes).

## Features

### 1. Corporate Dashboard
**Purpose:** Manage and view all corporate clients and their employees.

**Features:**
- **Corporate Overview Cards**
  - View all corporate clients at a glance
  - Key metrics: Total employees, active products, average credit score
  - Corporate details: Industry, location, since when they're a client
  - Relationship manager assignment
  
- **Employee Details**
  - Click "View Employee Details" on any corporate card to expand
  - See complete employee list with:
    - Name, designation, employee ID
    - Salary and tenure information
    - Credit score and active products count
    - Contact information (email & phone)
  - Quick "View" button for detailed employee profile

- **Actions Available:**
  - Add new corporate clients
  - View individual employee details
  - Track product adoption per corporate

**Use Cases:**
- Quick overview of all managed corporate relationships
- Identify high-value clients (by employee count and product adoption)
- Access employee information for verification or support

---

### 2. Rule Engine
**Purpose:** Define and manage eligibility rules for financial products (credit cards, loans, insurance).

**Features:**
- **Rule Management**
  - View all active and draft rules
  - Product categorization: Credit Cards, Personal Loans, Home Loans, etc.
  - Tier-based rules: Platinum, Gold, Silver, Standard, Premium
  
- **Rule Structure**
  Each rule consists of:
  - **Eligibility Conditions:** Define who qualifies
    - Field (e.g., Minimum Salary, Credit Score, Tenure)
    - Operator (≥, ≤, =, <, >)
    - Value threshold
    - Required/Optional flag
  
  - **Product Benefits:** What customers get
    - Cashback percentages
    - Interest rates
    - Special perks (lounge access, insurance, etc.)
    - Credit limits and tenure options
  
- **Rule Status**
  - **Active:** Currently in use, visible to employees
  - **Draft:** Under development, not yet visible

- **Priority Levels**
  - High Priority: Critical rules (e.g., loan eligibility)
  - Medium Priority: Standard products
  - Low Priority: Optional/new products

**Pre-configured Rules:**
1. **Platinum Credit Card Eligibility**
   - Salary ≥ ₹8L, Credit Score ≥ 750, Tenure ≥ 2 years
   - 5% cashback, airport lounge access, zero forex markup

2. **Gold Credit Card Eligibility**
   - Salary ≥ ₹5L, Credit Score ≥ 700, Tenure ≥ 1 year
   - 2% cashback, dining rewards, travel insurance

3. **Personal Loan - Standard**
   - Salary ≥ ₹3L, Credit Score ≥ 650, Tenure ≥ 6 months
   - Interest: 10.5%-14%, Flexible tenure: 12-60 months

4. **Home Loan - Premium**
   - Salary ≥ ₹10L, Credit Score ≥ 750, Tenure ≥ 2 years, Age ≤ 55
   - Interest: 8.5%, Up to ₹2 Cr, Zero processing fee

5. **Silver Credit Card Eligibility** (Draft)
   - Entry-level card with basic benefits

**Use Cases:**
- Define which employees qualify for specific products
- Update eligibility criteria based on market conditions
- Ensure consistent product offering across all corporates
- Create custom rules for premium clients

**Actions Available:**
- Edit existing rules
- Create new rules
- Activate/Deactivate rules
- View rule application history

---

### 3. Analytics Dashboard (Text-to-Insight)
**Purpose:** AI-powered analytics that answers natural language queries and visualizes data.

**How It Works:**
1. Enter a natural language question in the search bar
2. Click "Analyze" (or press Enter)
3. AI processes your query and generates:
   - Relevant visualizations (bar charts, pie charts, line graphs, tables)
   - Data-driven summary
   - AI-generated insights

**Sample Queries:**
- "How many employees applied for platinum credit card in last 3 days?"
- "Show me loan approval rates this month"
- "Which corporate has the highest product adoption?"
- "What is the revenue trend for last 6 months?"

**Visualization Types:**

1. **Bar Charts**
   - Time-series comparisons
   - Application volumes by day/week/month
   - Example: Credit card applications over time

2. **Pie Charts**
   - Distribution analysis
   - Status breakdowns (approved/pending/rejected)
   - Product category distribution

3. **Line Graphs**
   - Trend analysis
   - Revenue/disbursal trends
   - Month-over-month growth

4. **Data Tables**
   - Corporate-wise comparisons
   - Employee-level data
   - Product penetration rates

**AI-Generated Insights:**
Each query returns intelligent insights such as:
- Peak activity periods
- Approval/rejection rates
- Growth trends and patterns
- Predictive analytics
- Comparative analysis across corporates
- Recommendations based on data

**Sample Results:**

**Query:** "How many employees applied for platinum credit card in last 3 days?"
- **Visualization:** Bar chart showing daily applications
- **Summary:** "47 employees across 4 corporates applied"
- **Insights:**
  - Peak on Day 2 (18 applications)
  - 65% have credit scores above 780
  - 89% approval rate
  - Average processing time: 2.4 hours

**Query:** "Show me loan approval rates this month"
- **Visualization:** Pie chart with approval status distribution
- **Summary:** "234 applications, 87% approval rate"
- **Insights:**
  - 5% increase from last month
  - Average loan amount: ₹8.5 Lakhs
  - Tech industry has 92% approval rate
  - Most common rejection: Low credit score

**Actions Available:**
- Export reports (PDF/Excel)
- Share insights with team
- Save queries for regular monitoring
- Clear results and start new query

---

## Data Model

### Corporate
```typescript
{
  id: string              // CORP001, CORP002, etc.
  name: string            // Company name
  industry: string        // Technology, Finance, Healthcare, etc.
  employees: number       // Total employee count
  activeProducts: number  // Total products across all employees
  avgCreditScore: number  // Average credit score (0-100)
  location: string        // City
  since: string           // Year of partnership
  status: string          // active, inactive
  relationshipManager: string  // RM name
}
```

### Employee (within Corporate)
```typescript
{
  id: string              // EMP001, EMP002, etc.
  name: string
  designation: string
  salary: number          // Annual salary
  tenure: number          // Years at company
  creditScore: number     // 0-100
  products: number        // Number of active products
  email: string
  phone: string
}
```

### Rule
```typescript
{
  id: string                    // RULE001, RULE002, etc.
  name: string                  // Rule display name
  productType: string           // Credit Card, Personal Loan, etc.
  productTier: string           // Platinum, Gold, Standard, etc.
  status: 'active' | 'draft'
  lastModified: string
  applicableProducts: string
  conditions: Array<{
    field: string               // Minimum Salary, Credit Score, etc.
    operator: string            // ≥, ≤, =, <, >
    value: string               // Threshold value
    required: boolean           // Must satisfy or optional
  }>
  benefits: string[]            // List of product benefits
  priority: 'high' | 'medium' | 'low'
}
```

---

## Design Philosophy

### Independent Module
Kotak811 for Corporates is completely independent from:
- Employee Dashboard
- HR Portal
- Agent interfaces

This separation ensures:
- Role-based access control
- Clean separation of concerns
- Scalable architecture
- Easy maintenance

### AI-First Analytics
The Analytics Dashboard demonstrates modern AI capabilities:
- Natural language understanding
- Context-aware responses
- Smart visualizations
- Actionable insights
- No need for complex query builders

### Rule-Based Product Eligibility
The Rule Engine provides:
- Centralized rule management
- Consistent product offering
- Easy updates and modifications
- Transparency in eligibility criteria
- Audit trail for compliance

---

## Technical Implementation

### Components
- **`CRM.tsx`**: Main component with tab-based navigation
- Three main sections managed through state (`activeTab`)
- Responsive design with Tailwind CSS
- Dark mode support

### State Management
```typescript
const [activeTab, setActiveTab] = useState<'corporate' | 'rules' | 'analytics'>('corporate');
const [selectedCorporate, setSelectedCorporate] = useState<string | null>(null);
const [analyticsQuery, setAnalyticsQuery] = useState("");
const [analyticsResult, setAnalyticsResult] = useState<any>(null);
const [isAnalyzing, setIsAnalyzing] = useState(false);
```

### Routing
- Accessible via `/#crm` hash-based routing
- Auto-authentication for demo purposes
- Separate from employee/HR authentication flow

---

## Future Enhancements

### Corporate Dashboard
- [ ] Real-time sync with corporate HRMS
- [ ] Employee import/export functionality
- [ ] Bulk operations on employees
- [ ] Advanced filtering and search
- [ ] Corporate-specific product catalogs
- [ ] Contract management
- [ ] Document repository

### Rule Engine
- [ ] Rule versioning and history
- [ ] A/B testing for rules
- [ ] Simulation mode (test rules without activation)
- [ ] Rule templates
- [ ] Bulk rule creation
- [ ] Rule dependencies and conflicts detection
- [ ] Approval workflow for rule changes

### Analytics Dashboard
- [ ] Real AI/ML model integration
- [ ] Scheduled reports
- [ ] Dashboard builder (save custom views)
- [ ] Predictive analytics
- [ ] Anomaly detection
- [ ] Benchmark comparisons
- [ ] Export to PowerPoint/PDF with branding
- [ ] Email report delivery
- [ ] Real-time alerts

### General
- [ ] Role-based permissions (Senior RM, RM, Junior RM)
- [ ] Activity logs and audit trail
- [ ] Notification system
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] API for external integrations
- [ ] Advanced reporting tools

---

## Sample Use Cases

### Use Case 1: Onboarding New Corporate
1. Navigate to Corporate Dashboard
2. Click "Add New Corporate"
3. Enter corporate details
4. Configure eligible products via Rule Engine
5. Sync employee data
6. Monitor adoption via Analytics

### Use Case 2: Updating Product Rules
1. Go to Rule Engine
2. Find relevant rule (e.g., "Platinum Credit Card")
3. Click "Edit"
4. Modify conditions (e.g., lower minimum salary from ₹8L to ₹7L)
5. Save and activate
6. Rule becomes immediately effective for all employees

### Use Case 3: Monthly Performance Review
1. Open Analytics Dashboard
2. Query: "Show me total disbursals for last month"
3. Query: "Which corporate has highest product adoption?"
4. Query: "What is the approval rate trend?"
5. Export all reports
6. Share with management team

### Use Case 4: Troubleshooting Low Adoption
1. Analytics: "Which corporate has lowest product adoption?"
2. Identify: HealthCare Plus has low adoption
3. Corporate Dashboard: View HealthCare Plus employees
4. Analyze: Average credit score is 79 (good)
5. Rule Engine: Check if eligibility criteria are too strict
6. Action: Adjust rules or conduct awareness session

---

## Tips for Relationship Managers

1. **Regular Monitoring**
   - Check corporate dashboard daily for new sign-ups
   - Monitor analytics weekly for trends
   - Review rule effectiveness monthly

2. **Proactive Engagement**
   - Use analytics to identify underserved corporates
   - Reach out to corporates with high-potential employees
   - Customize product offerings based on industry

3. **Rule Optimization**
   - Start with strict rules, gradually relax based on performance
   - Monitor approval rates - aim for 75-85%
   - Keep benefits competitive with market

4. **Data-Driven Decisions**
   - Always check analytics before making changes
   - Use insights to predict seasonal trends
   - Benchmark against industry standards

---

## Support & Contact

For technical issues or feature requests regarding Kotak811 for Corporates:
- Refer to the main project documentation
- Contact development team
- Submit feature requests through project management system

---

## Changelog

### Version 1.0.0 (Current)
- ✅ Corporate Dashboard with employee details
- ✅ Rule Engine with 5 pre-configured rules
- ✅ AI-powered Analytics Dashboard
- ✅ Multiple visualization types
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Independent routing (/#crm)

---

**Built with ❤️ for Relationship Managers**

