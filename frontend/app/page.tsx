"use client";

import { type ChangeEvent, type DragEvent, useRef, useState } from "react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");

  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
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
    <main className="min-h-screen bg-slate-50 px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/5">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Trascritta AI
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Somali AI Transcription
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Upload files or paste video URLs to generate Somali transcripts.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-2xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab("url")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
              activeTab === "url"
                ? "bg-white shadow-sm text-slate-950"
                : "text-slate-500"
            }`}
          >
            URL
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
              activeTab === "upload"
                ? "bg-white shadow-sm text-slate-950"
                : "text-slate-500"
            }`}
          >
            Upload
          </button>
        </div>

        {/* URL TAB */}
        {activeTab === "url" && (
          <div className="space-y-4">
            <Input
              placeholder="https://youtube.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <Button
              onClick={handleUrlTranscription}
              disabled={!url || loading}
              className="w-full h-11"
            >
              {loading ? "Processing..." : "Transcribe URL"}
            </Button>
          </div>
        )}

        {/* UPLOAD TAB */}
        {activeTab === "upload" && (
          <div
            className={
              "rounded-[1.75rem] border border-dashed bg-slate-50 p-6 text-center transition-all " +
              (isDragActive
                ? "border-primary/70 bg-primary/10"
                : "border-slate-300")
            }
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Upload audio/video</h2>

                <p className="mt-2 text-sm text-slate-500">
                  Drag & drop or choose a file.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Choose file
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
            </div>
          </div>
        )}

        {/* Transcript */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Transcript
          </label>

          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Transcript will appear here..."
            className="min-h-[300px]"
          />
        </div>
      </div>
    </main>
  );
}
