# TruVerify AI 🛡️

A B2B identity verification platform that uses **Google Gemini 2.5 Flash** (Multimodal) to verify user identities by comparing government-issued IDs against live video selfies.

## Features

- **Document Analysis**: Extracts and validates data from ID cards using Gemini Vision.
- **Biometric Matching**: Compares facial features between ID photos and selfies.
- **Fraud Detection**: Analyzes metadata and visual artifacts to detect spoofing.
- **Client Dashboard**: View verification history and status.
- **Demo Mode**: One-click autofill for testing "Approved" and "Rejected" flows.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React
- **AI**: Google GenAI SDK (`gemini-2.5-flash`)
- **Deployment**: Vercel (Recommended) or Docker

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API Key (Get one at [aistudio.google.com](https://aistudio.google.com))

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd truverify-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your API Key:**
   Create a `.env` file in the root directory:
   ```env
   API_KEY=AIzaSy...YourKeyHere
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Deployment

### Deploy on Vercel (Free & Recommended)

Vercel provides free hosting for hobby projects and is the easiest way to deploy this app.

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and sign up/log in.
3. Click **"Add New Project"** and select your repository.
4. Vercel will auto-detect the Vite framework.
5. In the **Environment Variables** section, add:
   - **Key**: `API_KEY`
   - **Value**: `Your Google Gemini API Key`
6. Click **Deploy**.

### Docker Deployment

You can also run the app locally or on a VPS using Docker.

```bash
# Set your API key in your terminal
export API_KEY=AIzaSy...

# Build and start the container
docker-compose up --build
```

## Project Structure

- `/src/services/geminiService.ts`: Core logic for interacting with Gemini API.
- `/src/pages/VerificationPortal.tsx`: Main user flow for uploading ID/Selfie.
- `/src/utils/demoData.ts`: Mock data for the demo mode.

## License

MIT
