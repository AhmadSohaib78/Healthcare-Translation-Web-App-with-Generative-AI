# Healthcare Voice Translator

A voice-based translation web app built with **Next.js**, allowing users to speak, translate, and listen to translations in multiple languages. Designed for healthcare and general users who need quick, accurate translations in real time.

---

## Features

- **Real-time Voice Recognition:**  
  Captures speech using the browser’s `SpeechRecognition` API and converts it into text dynamically. Supports continuous listening and updates the transcript live without delays.

- **Multiple Language Translation:**  
  Translate speech or typed text into **Spanish, Hindi, French, and Russian**. Users can easily switch the target language using a simple dropdown menu.

- **Text-to-Speech:**  
  Translated text can be spoken aloud using the browser’s `SpeechSynthesis` API. Ensures proper pronunciation for each language.

- **Manual Text Input:**  
  Users can type text directly into an input field, providing flexibility when voice input is inconvenient or inaccurate.

- **Clear Button:**  
  Quickly clears the transcript, typed input, and translated text in a single click.

- **Responsive Design:**  
  Optimized for **desktop and mobile devices**. Layout automatically adjusts to smaller screens to maintain usability and readability.

- **User-Friendly UI:**  
  Clean, intuitive interface built with **Tailwind CSS**, featuring full-width buttons, readable fonts, and accessible color schemes.

- **Lightweight and Fast:**  
  Minimalistic design ensures fast loading times and smooth performance on all modern browsers.

---

## Tech Stack

### Frontend

- **Next.js 13:** Server-rendered React framework with routing, API support, and optimized performance.  
- **React:** Manages dynamic state for transcript, input, and translation components.  
- **Tailwind CSS:** Utility-first CSS framework for responsive, modern design without heavy custom styling.  

### Backend/API

- **Custom Translation API (`/api/translate`):** Sends text to a translation service or model and returns translated results. Handles POST requests with JSON input/output.

### Browser APIs

- **SpeechRecognition API:** Captures live voice input and converts it into text in real time.  
- **SpeechSynthesis API:** Converts translated text into spoken audio, supporting multiple languages and locales.

### Deployment

- **Vercel:** Optimized platform for Next.js apps with automatic builds, global CDN, and easy deployment.


