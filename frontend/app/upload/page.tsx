"use client";

import { type ChangeEvent, useRef, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

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
    <main className="min-h-screen bg-slate-50 px-6 py-10 flex justify-center">
      <div className="w-full max-w-xl rounded-[2rem] border bg-white p-6 shadow-xl">
        <Link href="/" className="text-sm text-slate-500">
          ← Back
        </Link>

        <h1 className="mt-4 text-2xl font-semibold">Upload File</h1>

        <div className="mt-6 space-y-4">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            Choose audio/video file
          </Button>

          <Input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {file && (
            <p className="rounded-xl bg-slate-100 p-3 text-sm">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? "Transcribing..." : "Upload & Transcribe"}
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
