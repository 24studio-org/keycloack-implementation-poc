# Frontend - Keycloak Authentication

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx                    # Home/Landing page with navigation
│   ├── login/
│   │   └── page.tsx                # Login page
│   └── register/
│       └── page.tsx                # Registration page
├── components/
│   ├── login-form.tsx              # Login form with validation
│   ├── register-form.tsx           # Registration form with validation
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── api.ts                      # API service layer
│   └── utils.ts                    # Utilities
├── .env.local                      # Environment variables
└── .env.example                    # Environment template
```

## ✨ Features

### **1. API Service Layer**

- Centralized API calls with TypeScript
- Type-safe interfaces
- Error handling
- Easy to extend

### **2. Login Form**

- Form validation
- Loading states
- Error messages
- Token storage
- Auto-redirect after login
- Link to registration

### **3. Registration Form**

- Multi-field validation
- Password confirmation
- Loading states
- Success notifications
- Auto-redirect to login
- Link to login page

### **4. Modern Home Page**

- Navigation to login/register
- Feature highlights
- Responsive design
- Dark mode support

## 🚀 Getting Started

### Install Dependencies

```bash
pnpm install
```

### Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local if needed
```

### Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001)

## 📍 Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

## 🔐 Authentication Flow

### Registration

1. Fill registration form
2. Validate inputs
3. Call `POST /keycloack/register`
4. Show success message
5. Redirect to login

### Login

1. Enter credentials
2. Call `POST /keycloack/login`
3. Store tokens in localStorage
4. Redirect to home

## 🎨 UI Features

- ✅ Loading states
- ✅ Error handling
- ✅ Success messages
- ✅ Responsive design
- ✅ Dark mode
- ✅ Form validation
- ✅ Disabled states

## 📦 Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

## 🔧 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🔄 Next Steps

- [ ] Protected routes middleware
- [ ] Token refresh logic
- [ ] Logout functionality
- [ ] User profile page
- [ ] Password strength indicator
- [ ] Remember me checkbox
- [ ] Email verification
