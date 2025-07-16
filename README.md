# Gemini Chat Clone

A modern, responsive chat application built with Next.js 15, featuring OTP-based authentication, real-time messaging, and a clean UI inspired by Google's Gemini.

[Live Demo](https://your-deployment-link.com) | [GitHub](https://github.com/yourusername/geminichat)

![Gemini Chat Preview](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Gemini+Chat+Preview)


## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn


# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
geminichat/
app/                          # Next.js 15 app directory
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

## 🔧 Implementation Details

### Authentication Flow

The app uses a simple OTP-based authentication system:

1. **Country Selection** - Fetches country data from [restcountries.com](https://restcountries.com)
2. **Phone Verification** - Validates phone numbers with React Hook Form + Zod
3. **OTP Simulation** - Simulates OTP sending with setTimeout (use "123456" for testing)
4. **Data Persistence** - Auth data saved to localStorage

```typescript
// Example validation schema
const phoneSchema = z.object({
  country: z.string().min(1, "Select a country"),
  phone: z.string().min(6).max(15).regex(/^\d+$/, "Only digits allowed"),
});
```

### Form Validation

Built with **React Hook Form** and **Zod** for type-safe validation:

- **Real-time validation** with error messages
- **Debounced search** for chatrooms (300ms delay)
- **File upload validation** (image types, size limits)
- **OTP validation** with proper error handling

### Infinite Scroll & Pagination

Messages load progressively as users scroll up:

```typescript
// Scroll detection for loading older messages
const handleScroll = () => {
  if (container.scrollTop === 0 && !isLoadingMore) {
    loadOlderMessages();
  }
};
```

- **Scroll-based loading** - Triggers when reaching top
- **Loading states** - Shows spinners during data fetch
- **Page management** - Tracks current page and total messages
- **Simulated API** - Generates dummy messages for demo

### Data Persistence

All data is stored locally using localStorage:

- **Auth persistence** - Users stay logged in across sessions
- **Chat history** - Messages and chatrooms persist on refresh
- **Theme preferences** - Dark/light mode saved automatically
- **Graceful fallbacks** - Handles SSR safely

### Throttling & Performance

- **Debounced search** - 300ms delay prevents excessive API calls
- **Optimized re-renders** - React.memo and useMemo for performance
- **Lazy loading** - Components load only when needed
- **Efficient state management** - Redux Toolkit for predictable updates

### Responsive Design

Built with Tailwind CSS for mobile-first design:

- **Mobile sidebar** - Collapsible navigation on small screens
- **Flexible layouts** - Adapts to different screen sizes
- **Touch-friendly** - Proper button sizes and spacing
- **Theme-aware** - All components respect dark/light mode

## 🛠️ Tech Stack

- **Framework** - Next.js 15 (App Router)
- **Language** - TypeScript
- **Styling** - Tailwind CSS v4
- **State Management** - Redux Toolkit
- **Forms** - React Hook Form + Zod
- **Icons** - Lucide React
- **Notifications** - Sonner
- **UI Components** - Custom components with shadcn/ui patterns


---

Built with ❤️ using Next.js and modern web technologies.
