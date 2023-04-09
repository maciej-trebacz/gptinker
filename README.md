# GPTinker

A proof of concept of a LLM-based developer sidekick that can make changes in existing code repositories. GPTinker is a Next.js application written in TypeScript that helps you navigate and modify codebases.

Short video demo: https://www.youtube.com/watch?v=XgMKCeiUDQc

## Prerequisites

1. Node.js 12.x or later
2. npm, yarn, or pnpm package manager

## Environment Variables

Create a `.env.local` file in the root directory of the project, and add your environment variables. Use the `.env` file as a reference. Here's an example of the required environment variables:

```
OPENAI_API_KEY=your_api_key_here
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-4
BASE_PATH=your_base_path_here
APP_DESCRIPTION="It's a Next.js application written in Typescript called GPTinker - an AI developer assistant that helps you navigate and modify codebases"
```

## Available Scripts

- `dev`: Run the app in development mode.
- `build`: Build the app for production.
- `start`: Start a production server.
- `lint`: Check for linting issues.
- `test`: Run tests using Jest.
- `countLoc`: Count lines of code in the project.

To run the app in development mode first install the dependencies and then run the app:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

To run tests:

```
npm run test
# or
yarn test
```
