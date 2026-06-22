import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4">Noema</h1>

      <p className="text-xl text-center max-w-xl mb-8">
        Track behaviors, emotions, habits, and triggers.
        Discover meaningful patterns in your daily life.
      </p>

      <div className="flex gap-4">
        <Link
          href="/events"
          className="border px-4 py-2 rounded"
        >
          Event Entry 
        </Link>

        <Link
          href="/events-list"
          className="border px-4 py-2 rounded"
        >
          Event History
        </Link>

        <Link
          href="/analytics"
          className="border px-4 py-2 rounded"
        >
          Analytics
        </Link>
      </div>
    </main>
  );
}