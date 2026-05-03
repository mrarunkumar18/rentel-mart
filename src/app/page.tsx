import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-accent">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-primary">Rentify</h1>
        <p className="text-lg text-muted-foreground">
          P2P Rental Marketplace — Rent anything from anyone
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white text-primary px-6 py-3 rounded-lg border border-primary hover:bg-accent transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
