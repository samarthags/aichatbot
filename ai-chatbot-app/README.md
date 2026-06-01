# AI Chatbot App

A fully working Next.js full-stack AI chatbot using the OpenAI Node SDK and Responses API.

## Setup

```bash
npm install
cp .env.example .env.local
```

Add your OpenAI API key in `.env.local`:

```env
OPENAI_API_KEY=your_api_key_here
```

Run:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy on Vercel

Add `OPENAI_API_KEY` in Vercel project environment variables, then deploy.
