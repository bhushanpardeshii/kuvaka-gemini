# Gemini Chat Clone 
Live Link
https://kuvaka-gemini-delta.vercel.app

screenshots
<img width="1000" height="550" alt="geminisearch" src="https://github.com/user-attachments/assets/8e618301-c289-4cfb-85f3-0761d15c285d" />
<img width="1000" height="550" alt="geminilight" src="https://github.com/user-attachments/assets/c0cb0413-a95b-40a4-9b5a-7562ad11c180" />
<img width="1000" height="550" alt="otp" src="https://github.com/user-attachments/assets/a51a88a6-9f83-4f51-a3a1-6272d4552cee" />
 Prerequisites
- Node.js  
- npm or yarn


 Install dependencies
npm install

 Run the development server

npm run dev
Open (http://localhost:3000) in your browser.

 Build for Production

npm run build
npm start

project structure:
```
geminichat/
app/                         
    chat/                     # Main chat interface
    signup/                   # OTP authentication page
    globals.css              # Global styles & CSS variables
    layout.tsx               # Root layout with providers
    page.tsx                 # Landing page with auth redirect
components/                   # React components
  ui/                      # Reusable UI components
    ChatArea.tsx             # Main chat container
    ChatroomList.tsx         # Chatroom management
    MessageInput.tsx         # Message composition
    MessageItem.tsx          # Individual message display
    MessageList.tsx          # Message list with infinite scroll
    Sidebar.tsx              # Navigation sidebar
    ThemeToggle.tsx          # Dark/light mode toggle
    StoreProvider.tsx        # Redux store wrapper
lib/                         # Utilities and configurations
    hooks.ts                 # Custom Redux hooks
    localStorage.ts          # Data persistence utilities
    slices/                  # Redux toolkit slices
    theme-context.tsx        # Theme management
 public/                      # Static assets

```

 OTP auth system:
 #Country Selection - Fetches country data from given api
 #Phone Verification - Validates phone numbers with React Hook Form + Zod
 #OTP Simulation - Simulates OTP sending with setTimeout (use "123456" for testing)
 #Data Persistence - Auth data saved to localStorage




Built with React Hook Form and Zod for type-safe validation:
- Real-time validation with error messages
- Debounced search for chatrooms (300ms delay)
- File upload validation (image types)
- OTP validation with proper error handling


Messages load progressively as users scroll up:
- Scroll-based loading - Triggers when reaching top
- Loading states - Shows spinners during data fetch
- Simulated API - Generates dummy messages for demo

All data is stored locally using localStorage:

- Auth persistence - Users stay logged in across sessions
- Chat history - Messages and chatrooms persist on refresh
- Theme preferences - Dark/light mode saved automatically





