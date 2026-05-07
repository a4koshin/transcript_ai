"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function UrlPage() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUrlTranscription = async () => {
    if (!url) return;

    try {
      setLoading(true);

      const res = await api.post("/api/transcriptions/transcribe-url", {
        url,
      });

      setTranscript(res.data.text);
    } catch (error) {
      console.error(error);
      alert("URL transcription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 flex justify-center">
      <div className="w-full max-w-xl rounded-[2rem] border bg-white p-6 shadow-xl">
        <Link href="/" className="text-sm text-slate-500">
          ← Back
        </Link>

        <h1 className="mt-4 text-2xl font-semibold">Transcribe from URL</h1>

        <div className="mt-6 space-y-4">
          <Input
            placeholder="https://youtube.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <Button
            onClick={handleUrlTranscription}
            disabled={!url || loading}
            className="w-full"
          >
            {loading ? "Processing..." : "Transcribe URL"}
          </Button>

          <Textarea
            value={transcript}
            readOnly
            placeholder="Transcript will appear here..."
            className="min-h-[260px]"
          />
        </div>
      </div>
    </main>
  );
}
