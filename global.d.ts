declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      NEXTAUTH_SECRET:"GEjwx9TtuJRDpCvtn0/O2TiUrgNHSh3HH4kPr1BBrWc="
    }
  }
}

export {};
