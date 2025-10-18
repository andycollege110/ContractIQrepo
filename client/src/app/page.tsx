// src/app/page.tsx
// Simple confirmation page so you know you're running locally.

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">ContractIQ is running locally ✅</h1>
        <p className="text-sm text-gray-300">
          You’re on http://localhost:3000 (local dev server).
        </p>
        <p className="text-xs text-gray-400">
          Next step: open <strong>/dashboard</strong> to see your first page.
        </p>
      </div>
    </main>
  );
}
