"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function VoiceTranslator() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setTranscript(text);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = () => {};
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

  const translateText = async () => {
    if (!transcript) return;

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript, targetLang }),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F7FF] to-[#F5FAFF] flex flex-col items-center px-4 py-6">
      {/* Top-left logo with gradient background */}
      <div className="absolute top-0 left-0 p-2 rounded-lg bg-gradient-to-r from-[#A0D6FF] to-[#2E6DDE]">
        <div className="bg-gradient-to-br from-[#A0D6FF] to-[#2E6DDE] rounded-lg overflow-hidden flex items-center justify-center w-[140px] h-[60px]">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={140} // smaller width
            height={60} // smaller height
            className="object-contain"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-[#E5E7EB] p-8 space-y-6 mt-28">
        <h1 className="text-3xl font-semibold text-[#2E6DDE] text-center tracking-tight">
          Healthcare Voice Translator
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
            Target Language
          </label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] bg-white text-[#1A1A1A] focus:ring-2 focus:ring-[#2E6DDE] outline-none"
          >
            <option value="es">Spanish</option>
            <option value="hi">Hindi</option>
            <option value="fr">French</option>
            <option value="ru">Russian</option>
          </select>
        </div>

        <div>
          <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">Original Transcript</h3>
          <div className="p-4 bg-[#F0F4F8] rounded-md border border-[#E5E7EB] min-h-[60px] text-[#1A1A1A]">
            {transcript || <span className="text-gray-400">Waiting for input...</span>}
          </div>
        </div>

        <button
          onClick={translateText}
          className="w-full py-3 bg-[rgb(154,207,140)] text-[rgb(30,53,101)] font-semibold rounded-lg hover:brightness-90 transition"
        >
          Translate
        </button>

        {translatedText && (
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">Translated Text</h3>
              <div className="p-4 bg-[#F0F4F8] rounded-md border border-[#E5E7EB] min-h-[60px] text-[#1A1A1A]">
                {translatedText}
              </div>
            </div>
            <button
              onClick={speakText}
              className="w-full py-3 bg-[rgb(154,207,140)] text-[rgb(30,53,101)] font-semibold rounded-lg hover:brightness-90 transition"
            >
              Speak Translation
            </button>
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
            If you are vision-impaired or have some other impairment covered by the Americans with Disabilities Act or a similar law, and you wish to discuss potential accommodations related to using this website, please contact Sharad Suri at service@naomedical.com or by phone at (917) 633-1548 Extension 288. In our goal to answer your questions as quick as possible, we use the assistance of a large language model wherever applicable. If there are any errors or concerns, please bring it to our attention by emailing us.
          </p>
        </div>
      </footer>
    </div>
  );
}
