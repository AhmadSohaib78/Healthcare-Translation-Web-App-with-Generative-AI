"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function VoiceTranslator() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [inputText, setInputText] = useState("");
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalTranscriptRef.current += result[0].transcript + " ";
        else interim += result[0].transcript;
      }
      setTranscript(finalTranscriptRef.current + interim);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.onend = () => {};
      finalTranscriptRef.current = transcript;
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const translateText = async (text?: string) => {
    const t = text || transcript || inputText;
    if (!t) return;
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t, targetLang }),
      });
      const data = await res.json();
      setTranslatedText(data.translatedText);
    } catch {
      setTranslatedText("Translation failed");
    }
  };

  const speakText = () => {
    if (!translatedText) return;
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang =
      targetLang === "es" ? "es-ES" :
      targetLang === "hi" ? "hi-IN" :
      targetLang === "fr" ? "fr-FR" :
      targetLang === "ru" ? "ru-RU" :
      "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const clearAll = () => {
    setTranscript("");
    setTranslatedText("");
    setInputText("");
    finalTranscriptRef.current = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F7FF] to-[#F5FAFF] flex flex-col items-center px-4 py-6">
      {/* Logo */}
      <div className="absolute top-0 left-0 p-2 rounded-lg bg-gradient-to-r from-[#A0D6FF] to-[#2E6DDE]">
        <div className="bg-gradient-to-br from-[#A0D6FF] to-[#2E6DDE] rounded-lg overflow-hidden flex items-center justify-center w-[140px] h-[60px]">
          <Image src="/logo.jpg" alt="Logo" width={140} height={60} className="object-contain" />
        </div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-[#E5E7EB] p-6 sm:p-8 space-y-4 mt-28">
        <h1 className="text-3xl font-semibold text-[#2E6DDE] text-center tracking-tight">
          Healthcare Voice Translator
        </h1>

        {/* Listening buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={startListening}
            disabled={listening}
            className="w-full py-3 rounded-lg bg-[rgb(154,207,140)] font-medium hover:brightness-90 transition disabled:opacity-40 text-[rgb(30,53,101)]"
          >
            Start Listening
          </button>
          <button
            onClick={stopListening}
            disabled={!listening}
            className="w-full py-3 rounded-lg bg-[rgb(154,207,140)] font-medium hover:brightness-90 transition disabled:opacity-40 text-[rgb(30,53,101)]"
          >
            Stop Listening
          </button>
        </div>

        {/* Target language */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Target Language</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[#E5E7EB] bg-white text-[#1A1A1A] focus:ring-2 focus:ring-[#2E6DDE] outline-none"
          >
            <option value="es">Spanish</option>
            <option value="hi">Hindi</option>
            <option value="fr">French</option>
            <option value="ru">Russian</option>
          </select>
        </div>

        {/* Original transcript */}
        <div>
          <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">Original Transcript</h3>
          <div className="p-3 bg-[#F0F4F8] rounded-md border border-[#E5E7EB] min-h-[60px] text-[#1A1A1A] break-words">
            {transcript || <span className="text-gray-400">Waiting for input...</span>}
          </div>
        </div>

        {/* Chat input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type here..."
          className="w-full px-3 py-2 rounded-md border border-[#E5E7EB] text-[#1A1A1A] focus:ring-2 focus:ring-[#2E6DDE] outline-none"
        />

        {/* Translate button full width */}
        <button
          onClick={() => translateText(inputText)}
          className="w-full py-3 mt-2 rounded-lg bg-[rgb(154,207,140)] font-medium hover:brightness-90 transition"
        >
          Translate
        </button>

        {/* Translated text and actions */}
        {translatedText && (
          <div className="space-y-2 mt-2">
            <h3 className="text-base font-semibold text-[#1A1A1A]">Translated Text</h3>
            <div className="p-3 bg-[#F0F4F8] rounded-md border border-[#E5E7EB] min-h-[60px] text-[#1A1A1A] break-words">
              {translatedText}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={speakText}
                className="flex-1 px-3 py-2 rounded-lg bg-[rgb(154,207,140)] font-medium hover:brightness-90 transition"
              >
                Speak Translation
              </button>
              <button
                onClick={clearAll}
                className="flex-1 px-3 py-2 rounded-lg bg-[rgb(154,207,140)] font-medium hover:brightness-90 transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full mt-12 bg-[#1e3565] text-white px-6 py-6 sm:px-12 sm:py-8">
        <div className="space-y-3">
          <h2 className="font-bold text-lg">Nao Medical</h2>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:underline">LinkedIn</a>
            <a href="#" className="hover:underline">Facebook</a>
            <a href="#" className="hover:underline">Twitter</a>
            <a href="#" className="hover:underline">Instagram</a>
          </div>
          <p className="text-sm mt-3">
            If you are vision-impaired or have some other impairment, please contact us. We use AI assistance; if any errors occur, report via email.
          </p>
        </div>
      </footer>
    </div>
  );
}
