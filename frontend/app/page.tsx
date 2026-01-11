import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <main className="flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Keycloak Authentication
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
            A modern authentication system powered by Keycloak, NestJS, and
            Next.js
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/login">
            <Button size="lg" className="min-w-[200px]">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="min-w-[200px]">
              Create Account
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
              🔐 Secure
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Enterprise-grade authentication with Keycloak
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
              ⚡ Fast
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Built with Next.js and NestJS for optimal performance
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
              🎨 Modern
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Beautiful UI with Tailwind CSS and shadcn/ui
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
