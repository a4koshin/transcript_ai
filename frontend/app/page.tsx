import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-[2rem] border bg-white p-6 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Trascritta AI
        </p>

        <h1 className="mt-4 text-3xl font-semibold text-slate-950">
          Choose transcription method
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/url"
            className="rounded-2xl border p-5 hover:bg-slate-50"
          >
            <h2 className="font-semibold">Transcribe URL</h2>
            <p className="mt-2 text-sm text-slate-500">
              Paste YouTube, TikTok, or Facebook link.
            </p>
          </Link>

          <Link
            href="/upload"
            className="rounded-2xl border p-5 hover:bg-slate-50"
          >
            <h2 className="font-semibold">Upload File</h2>
            <p className="mt-2 text-sm text-slate-500">
              Upload audio or video from your device.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
