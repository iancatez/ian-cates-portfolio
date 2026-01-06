# Ian Cates Portfolio

A modern, single-page portfolio website built with Next.js, ShadCN UI, and Tailwind CSS.

## Tech Stack

- **Next.js 16.1.1** - React framework with App Router
- **ShadCN UI** - Component library (MUST use exclusively - see rules below)
- **Tailwind CSS v4** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Framer Motion** - Animations (planned)

## Component Library Rules

**IMPORTANT**: This project strictly uses **ShadCN UI components only**. 

- ✅ Always use ShadCN components from `@/components/ui/`
- ✅ Install new components: `npx shadcn@latest add [component-name]`
- ✅ Customize installed ShadCN components as needed
- ❌ Never create custom UI components that replicate ShadCN functionality
- ❌ Never build buttons, cards, inputs, etc. from scratch

See [ShadCN Documentation](https://ui.shadcn.com/docs/components) for available components.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
