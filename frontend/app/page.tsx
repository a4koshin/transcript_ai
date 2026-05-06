"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await api.post("/api/transcriptions/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTranscript(res.data.text);
    } catch (error) {
      console.error(error);
      alert("Transcription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border p-6 shadow-sm space-y-4">
        <h1 className="text-2xl font-bold">Trascritta AI</h1>
        <p className="text-sm text-gray-500">
          Upload Somali audio or video and get transcript
        </p>

        <input
          type="file"
          accept="audio/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full rounded-lg border p-3"
        />

        <Button
          onClick={handleUpload}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Transcribing..." : "Upload & Transcribe"}
        </Button>

        <textarea
          value={transcript}
          readOnly
          placeholder="Transcript will appear here..."
          className="h-80 w-full rounded-xl border p-4 outline-none"
        />
      </div>
    </main>
  );
}
