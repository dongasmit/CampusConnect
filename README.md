<div align="center">
  <h1>🎓 CampusConnect 2.0</h1>
  <p>
    <strong>An AI-Powered Campus Marketplace built for the Modern Student.</strong>
  </p>
  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
    <a href="https://postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-pgvector-336791?style=flat-square&logo=postgresql" alt="PostgreSQL" /></a>
  </p>
</div>

***

## 🚀 Overview

Link: https://campus-connect-amber.vercel.app/

**CampusConnect** is a robust, AI-driven marketplace designed specifically for university students. Whether you are looking to buy a secondhand textbook or sell your old dorm equipment, CampusConnect makes it effortless. 

Powered by **Gemini Vector Embeddings**, our search engine doesn't just look for exact text matches—it understands the *intent* and *context* of what you are searching for, delivering highly relevant results instantly.

---

## ✨ Key Features

- 🧠 **AI-Powered Semantic Search**: Utilizes Gemini embeddings and PostgreSQL `pgvector` to perform highly accurate nearest-neighbor searches.
- 🔐 **Secure Authentication**: Frictionless Google Sign-In powered by `NextAuth.js`.
- 🖼️ **Seamless Image Handling**: Blazing fast image uploads and edge delivery powered by `UploadThing`.
- ⚡ **Next.js App Router**: Built with the latest Next.js 15 features, including React Server Components and Server Actions.
- 🎨 **Beautiful UI**: Highly responsive and accessible design crafted with `Tailwind CSS`.
- 🗄️ **Type-Safe Database**: Fully robust database interactions securely typed with `Prisma ORM`.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Next.js App Router](https://nextjs.org/) | React framework for production. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework. |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Relational database (requires `pgvector`). |
| **ORM** | [Prisma](https://www.prisma.io/) | Next-generation Node.js and TypeScript ORM. |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) | Authentication for Next.js. |
| **AI/ML** | [Google Generative AI](https://ai.google.dev/) | Using Gemini models for vector embeddings. |
| **Storage** | [UploadThing](https://uploadthing.com/) | File uploads for modern web apps. |

---

## 🚦 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js** 18+ (Recommended)
- **PostgreSQL** Database with the `pgvector` extension enabled (e.g., [Neon](https://neon.tech/), [Supabase](https://supabase.com/)).

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/campus-connect.git
cd campus-connect
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file at the root of your project and populate it with the following variables:

```env
# 🐘 Database Configuration (Must support pgvector)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"

# 🔐 NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_a_strong_secret_using_openssl"

# 👤 Google OAuth Credentials
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# 🧠 Gemini AI Configuration
GEMINI_API_KEY="your_gemini_api_key"

# ☁️ UploadThing Credentials
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"
```

> **Note**: You can generate a strong `NEXTAUTH_SECRET` by running `openssl rand -base64 32` in your terminal.

### 4. Database Setup

Push the Prisma schema to your PostgreSQL database and generate the client:

```bash
npx prisma generate
npx prisma db push
```

*(Optional)* Seed the database with dummy data to test the platform:

```bash
npx prisma db seed
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application!

---

## ⚙️ Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the application for production deployment.
- `npm run start` - Runs the compiled application in production mode.
- `npm run lint` - Runs ESLint to catch and fix issues.

---

## 🧠 How the AI Search Works

Traditional searches rely on exact keyword matches. CampusConnect is smarter:
1. **Embedding Generation**: Every time a user creates a product listing, the title and description are parsed through Gemini (`gemini-embedding-001`) to generate a 768-dimensional vector mathematical representation.
2. **Vector Storage**: This array is stored natively in PostgreSQL using the `pgvector` extension.
3. **Semantic Querying**: When a user types a search term, the term itself is converted into an embedding. The database then performs a blazing-fast "nearest-neighbor" calculation (`<=>`) to fetch products that are contextually and semantically similar, even if exact keywords aren't used!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request if you want to contribute.

<div align="center">
  <b>Built with ❤️</b>
</div>
