"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function VoiceTranslator() {
  const [mounted, setMounted] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [userInput, setUserInput] = useState("");
  const recognitionRef = useRef<any>(null);

  // Mount check to prevent SSR hydration errors
  useEffect(() => setMounted(true), []);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (!mounted) return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setTranscript(text);
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [mounted]);

  // Start / Stop listening
  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.onend = () => {};
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  // Translate text
  const translateText = async (textToTranslate?: string) => {
    const text = textToTranslate || transcript || userInput;
    if (!text) return;
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });
      const data = await res.json();
      setTranslatedText(data.translatedText);
    } catch {
      setTranslatedText("Translation failed");
    }
  };

  // Speak translated text
  const speakText = () => {
    if (!translatedText || !mounted) return;
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang =
      targetLang === "es" ? "es-ES" :
      targetLang === "hi" ? "hi-IN" :
      targetLang === "fr" ? "fr-FR" :
      targetLang === "ru" ? "ru-RU" :
      "en-US";
    window.speechSynthesis.cancel(); // prevent repeats
    window.speechSynthesis.speak(utterance);
  };

  // Clear all fields
  const clearAll = () => {
    setTranscript("");
    setUserInput("");
    setTranslatedText("");
  };

  if (!mounted) return null; // prevent SSR mismatch

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F7FF] to-[#F5FAFF] flex flex-col items-center px-4 py-6">
      {/* Logo */}
      <div className="absolute top-0 left-0 p-2 rounded-lg bg-gradient-to-r from-[#A0D6FF] to-[#2E6DDE]">
        <div className="bg-gradient-to-br from-[#A0D6FF] to-[#2E6DDE] rounded-lg overflow-hidden flex items-center justify-center w-[140px] h-[60px]">
          <Image src="/logo.jpg" alt="Logo" width={140} height={60} className="object-contain"/>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-[#E5E7EB] p-8 space-y-6 mt-28">
        <h1 className="text-3xl font-semibold text-[#2E6DDE] text-center tracking-tight">
          Healthcare Voice Translator
        </h1>

        {/* Voice Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={startListening} disabled={listening} className="w-full py-3 rounded-lg bg-[rgb(154,207,140)] font-medium hover:brightness-90 transition disabled:opacity-40 text-[rgb(30,53,101)]">Start Listening</button>
          <button onClick={stopListening} disabled={!listening} className="w-full py-3 rounded-lg bg-[rgb(154,207,140)] font-medium hover:brightness-90 transition disabled:opacity-40 text-[rgb(30,53,101)]">Stop Listening</button>
        </div>

        {/* Language Selector */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Target Language</label>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] bg-white text-[#1A1A1A] focus:ring-2 focus:ring-[#2E6DDE] outline-none">
            <option value="es">Spanish</option>
            <option value="hi">Hindi</option>
            <option value="fr">French</option>
            <option value="ru">Russian</option>
          </select>
        </div>

        {/* Original Transcript */}
        <div>
          <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">Original Transcript</h3>
          <div className="p-4 bg-[#F0F4F8] rounded-md border border-[#E5E7EB] min-h-[60px] text-[#1A1A1A]">
            {transcript || <span className="text-gray-400">Waiting for input...</span>}
          </div>
        </div>

        {/* User Input */}
        <div className="flex gap-2">
          <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Type here..." className="flex-1 px-4 py-3 rounded-md border border-[#E5E7EB] text-[#1A1A1A] focus:ring-2 focus:ring-[#2E6DDE] outline-none"/>
          <button onClick={() => translateText(userInput)} className="px-4 py-3 rounded-lg bg-[rgb(154,207,140)] font-medium hover:brightness-90 transition text-[rgb(30,53,101)]">Translate</button>
        </div>

        {/* Translated Text */}
        {translatedText && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">Translated Text</h3>
            <div className="p-4 bg-[#F0F4F8] rounded-md border border-[#E5E7EB] min-h-[60px] text-[#1A1A1A]">{translatedText}</div>
            <div className="flex gap-2">
              <button onClick={speakText} className="flex-1 py-3 bg-[rgb(154,207,140)] text-[rgb(30,53,101)] font-semibold rounded-lg hover:brightness-90 transition">Speak Translation</button>
              <button onClick={clearAll} className="flex-1 py-3 bg-[rgb(154,207,140)] text-[rgb(30,53,101)] font-semibold rounded-lg hover:brightness-90 transition">Clear</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full mt-12 bg-[#1e3565] text-white px-8 py-8 sm:px-20 sm:py-12">
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Nao Medical</h2>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="hover:underline">LinkedIn</a>
            <a href="#" className="hover:underline">Facebook</a>
            <a href="#" className="hover:underline">Twitter</a>
            <a href="#" className="hover:underline">Instagram</a>
          </div>
          <p className="text-sm mt-4">
            If you are vision-impaired or have some other impairment, please contact us. We use AI assistance; if any errors occur, report via email.
          </p>
        </div>
      </footer>
    </div>
  );
}
