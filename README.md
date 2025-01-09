# Compute UI

A modern, feature-rich web application for GPU marketplace and AI model deployment platform built with Next.js 14, Supabase, and TypeScript.

## Features

- 🔐 Secure Authentication with Supabase
- 💳 Credits System for Platform Usage
- 🖼️ AI Image Generation
- 🚀 Custom Model Deployment
- 💻 GPU Marketplace
- 🌐 Real-time Updates
- 🎨 Modern UI with Tailwind CSS
- 🔄 Responsive Design

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Auth**: Supabase Auth
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **State Management**: React Context
- **Animations**: Framer Motion

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/nitishmeswal/computeui.git
cd computeui
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file and add your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable UI components
- `/lib` - Utility functions and shared logic
- `/contexts` - React Context providers
- `/types` - TypeScript type definitions
- `/public` - Static assets
- `/styles` - Global styles and Tailwind configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
