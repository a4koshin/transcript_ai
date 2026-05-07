"use client";

import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-900/5">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Trascritta AI
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            Transcribe Somali audio or video instantly
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Upload a file and receive a clean transcript right in the browser.
            Supported formats include audio and video files.
          </p>
        </div>

        <div className="space-y-6">
          <div
            className={
              "rounded-[1.75rem] border border-dashed bg-slate-50 p-8 text-center transition-all " +
              (isDragActive
                ? "border-primary/70 bg-primary/10"
                : "border-slate-300")
            }
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mx-auto flex max-w-md flex-col items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <span className="text-2xl">⏫</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Upload file
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Drag & drop or choose an audio/video file to start
                  transcription.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xs"
              >
                Choose file
              </Button>
              <p className="text-sm text-slate-400">
                Supported: audio/*, video/* · Max size 20 MB
              </p>
              {file ? (
                <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                  Selected file:{" "}
                  <span className="font-medium">{file.name}</span>
                </p>
              ) : null}
              <Input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Transcription output
              </label>
              <Textarea
                value={transcript}
                readOnly
                placeholder="Transcript will appear here..."
                className="min-h-[320px]"
              />
            </div>
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="h-12 w-full sm:w-auto"
            >
              {loading ? "Transcribing..." : "Upload & Transcribe"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
