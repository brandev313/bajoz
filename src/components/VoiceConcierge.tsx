/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Radio,
  Send,
  MessageCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { buildReliableWhatsAppUrl } from './FloatingWhatsApp';
import { BAJOZ_MASTER_VECTORS } from '../lib/brandAssets';

interface TranscriptEntry {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

function sanitizeClientPakistaniText(text: string): string {
  return text
    .replace(/\bnamaste\b/gi, 'Assalam-o-Alaikum')
    .replace(/\bdhanyavad\b/gi, 'Shukriya')
    .replace(/\bswagat\b/gi, 'Khush Aamdeed')
    .replace(/\baavashyakta\b/gi, 'zaroorat')
    .replace(/\bbhojan\b/gi, 'khana')
    .replace(/\bswad\b/gi, 'zaiqa')
    .replace(/\bsugandh\b/gi, 'khushbu')
    .replace(/\bswasthya\b/gi, 'sehat')
    .replace(/\bparivar\b/gi, 'khandaan')
    .replace(/\bupyog\b/gi, 'istemal')
    .replace(/\bprayog\b/gi, 'istemal')
    .replace(/\bmulya\b/gi, 'qeemat')
    .replace(/\bkripya\b/gi, 'meherbani');
}

function detectClientLanguage(text: string): 'urdu' | 'english' {
  const raw = (text || '').trim();
  if (!raw) return 'english';
  if (/[\u0600-\u06FF]/.test(raw)) return 'urdu';
  const romanUrduPattern =
    /\b(kya|hai|hain|kaise|kaisa|kaisi|kitne|kitna|kitni|qeemat|batao|batayein|bataiye|mein|main|aur|se|ko|ka|ki|ke|ye|yeh|hum|aap|mujhe|mera|meri|hamara|ghar|khana|masala|pyaz|lahsun|adrak|namak|chahiye|milega|milti|hoti|hota|karna|karein|salam|assalam|aoa|shukriya|meherbani|wapsi|dant|masoor|ghee|cheeni|ajzaa|tareeqa|pakayein|istemal|kon|konsa|farq|haal)\b/i;
  return romanUrduPattern.test(raw) ? 'urdu' : 'english';
}

const QUICK_QUESTIONS = [
  'What is in SpiceMix?',
  'SpiceMix se khana kaise pakayein?',
  'Tell me about Panjeeri',
  'Delivery & COD in Pakistan',
];

function getLocalFallbackAnswer(
  rawInput: string,
  agentName: string,
  ctx?: {
    pageTitle?: string;
    productName?: string;
    variantName?: string;
    packSizeLabel?: string;
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
  }
): string {
  const q = (rawInput || '').toLowerCase().trim();
  const lang = detectClientLanguage(rawInput);

  const formatReply = (enText: string, romanUrduText: string) => {
    return sanitizeClientPakistaniText(lang === 'urdu' ? romanUrduText : enText);
  };

  const enSel =
    ctx?.productName
      ? ` Right now on your screen, you picked ${ctx.quantity || 1}× ${
          ctx.productName
        }${ctx.variantName ? ` (${ctx.variantName})` : ''}${
          ctx.packSizeLabel ? ` in ${ctx.packSizeLabel}` : ''
        } (Price: N/A).`
      : '';

  const urSel =
    ctx?.productName
      ? ` Is waqt aap ki screen par ${ctx.quantity || 1}× ${
          ctx.productName
        }${ctx.variantName ? ` (${ctx.variantName})` : ''}${
          ctx.packSizeLabel ? ` (${ctx.packSizeLabel})` : ''
        } select hai (Price: N/A).`
      : '';

  if (!q || /^(hi|hello|salam|assalam|aoa|hey|start|help|kya haal)\b/.test(q)) {
    return formatReply(
      `Assalam-o-Alaikum! Welcome to BAJOZ. I am ${agentName}.${enSel} Ask me about our products, ingredients, sizes, or prices!`,
      `Assalam-o-Alaikum! BAJOZ mein Khush Aamdeed. Main ${agentName} hoon.${urSel} Aap mujh se hamaray products, ajzaa, jar sizes, ya qeemat pooch saktay hain!`
    );
  }

  if (
    q.includes('current') ||
    q.includes('selection') ||
    q.includes('selected') ||
    q.includes('mera') ||
    (q.includes('price') && ctx?.productName) ||
    (q.includes('qeemat') && ctx?.productName)
  ) {
    if (ctx?.productName) {
      return formatReply(
        `You are looking at ${ctx.productName} (${ctx.variantName || 'Standard'}, ${
          ctx.packSizeLabel || 'Standard Jar'
        }, Quantity: ${ctx.quantity || 1}). Price: N/A right now.`,
        `Aap is waqt ${ctx.productName} (${ctx.variantName || 'Standard'}, ${
          ctx.packSizeLabel || 'Standard Jar'
        }, Quantity: ${ctx.quantity || 1}) dekh rahay hain. Price: N/A.`
      );
    }
  }

  if (
    q.includes('panjeeri') ||
    q.includes('panjiri') ||
    q.includes('suji') ||
    q.includes('alsi') ||
    q.includes('moong') ||
    q.includes('ghee')
  ) {
    return formatReply(
      `Our Panjeeri is made in 100% pure Desi Ghee with almonds, cashews, pistachios, char maghaz, and 4 gondain. It has zero white sugar. Choose from Suji, Alsi, or Daal Moong flavours in 250 gm, 450 gm, and 950 gm jars (Price: N/A).${enSel}`,
      `Hamari Panjeeri 100% khalis Desi Ghee, badam, kaju, pista, char maghaz aur 4 gondain se ghar ke tareeqay se banti hai. Is mein safed cheeni nahi hai. Yeh 3 flavours (Suji, Alsi, Daal Moong) aur 3 jar sizes: 250 gm, 450 gm aur 950 gm mein milti hai (Price: N/A).${urSel}`
    );
  }

  if (
    q.includes('spicemix') ||
    q.includes('spice mix') ||
    q.includes('paste') ||
    q.includes('onion') ||
    q.includes('pyaz') ||
    q.includes('garlic') ||
    q.includes('ginger') ||
    q.includes('masala')
  ) {
    return formatReply(
      `BAJOZ SpiceMix has fresh garlic, ginger, salt, and 14 Pakistani spices in one jar. It has no onion and no flavour variants. Just fry onions and tomatoes, add meat, daal, or vegetables, and add 1-2 tablespoons of SpiceMix to cook any Pakistani dish in half the time! Sizes: 250 gm, 450 gm, and 950 gm (Price: N/A).${enSel}`,
      `BAJOZ SpiceMix mein taza lahsun, adrak, namak aur 14 Pakistani masalay sahi miqdar mein shamil hain. Is mein pyaz nahi hai aur koi alag flavour variant nahi hai. Bas pyaz aur tamatar fry karein, gosht, daal ya sabzi dalein aur 1 se 2 chamach SpiceMix shamil kar ke har Pakistani khana aadhay waqt mein pakayein! Sizes: 250 gm, 450 gm aur 950 gm (Price: N/A).${urSel}`
    );
  }

  if (
    q.includes('tooth') ||
    q.includes('guardian') ||
    q.includes('powder') ||
    q.includes('charcoal') ||
    q.includes('oral') ||
    q.includes('dant') ||
    q.includes('masoor')
  ) {
    return formatReply(
      `Tooth Guardian is a natural homemade tooth cleaning powder made with alum (phitkari), cloves (laung), natural salts, and tree bark powders. Available in 40 gm and 80 gm jars (Price: N/A).${enSel}`,
      `Tooth Guardian qudrati ghar ka bana tooth cleaning powder hai jo phitkari, laung, qudrati namak aur darakhton ki chhaal ke powder se bana hai. Yeh 40 gm aur 80 gm jar sizes mein milta hai (Price: N/A).${urSel}`
    );
  }

  if (
    q.includes('deliver') ||
    q.includes('shipping') ||
    q.includes('cod') ||
    q.includes('cash') ||
    q.includes('bank') ||
    q.includes('meezan') ||
    q.includes('payment')
  ) {
    return formatReply(
      `We deliver all across Pakistan! We accept Cash on Delivery (COD) and Meezan Bank transfer.${enSel}`,
      `Hum pooray Pakistan mein delivery kartay hain! Aap Cash on Delivery (COD) ya Meezan Bank transfer se payment kar saktay hain.${urSel}`
    );
  }

  if (q.includes('return') || q.includes('refund') || q.includes('exchange') || q.includes('wapsi')) {
    return formatReply(
      'Because all BAJOZ items are fresh homemade foods and personal care items, we do not offer returns or refunds once an order is sent out. For any help, message us on WhatsApp at 0315-4388166.',
      'Kyunkay BAJOZ ki tamam cheezein taza ghar ki bani khorak aur zaati istemal ki hain, is liye order rawana honay ke baad wapsi (return) ya refund nahi hota. Madad ke liye WhatsApp 0315-4388166 par rabta karein.'
    );
  }

  return formatReply(
    `At BAJOZ in Lahore, we make 3 pure products: SpiceMix (250 gm, 450 gm & 950 gm), Panjeeri (250 gm, 450 gm & 950 gm), and Tooth Guardian Oral Care Tooth Powder (40 gm & 80 gm). Prices are currently N/A.${enSel}`,
    `BAJOZ Lahore mein hum 3 khalis cheezein tayyar kartay hain: SpiceMix (250 gm, 450 gm aur 950 gm), Panjeeri (250 gm, 450 gm aur 950 gm), aur Tooth Guardian Tooth Powder (40 gm aur 80 gm). Prices filhal N/A hain.${urSel}`
  );
}

export const VoiceConcierge: React.FC = () => {
  const {
    isVoiceConciergeOpen,
    setIsVoiceConciergeOpen,
    siteCopy,
    settings,
    activeProductId,
    setActiveProductId,
    activePageSlug,
    customPages,
    products,
    activeSelectionContext,
    addToCart,
    cartCount,
    cartTotals,
    setIsTrackingOpen,
  } = useShop();

  const activeProduct = products.find((p) => p.id === activeProductId) || null;
  const activeCustomPage =
    customPages.find((pg) => pg.slug === activePageSlug) || null;

  const pageTitle = activeProduct
    ? `Product Page: ${activeProduct.name}`
    : activeCustomPage
    ? `Page: ${activeCustomPage.title}`
    : 'BAJOZ Homepage';

  const voiceContextPayload = {
    pageTitle,
    productId: activeSelectionContext?.productId || activeProduct?.id || '',
    productName: activeSelectionContext?.productName || activeProduct?.name || '',
    variantName: activeSelectionContext?.variantName || '',
    packSizeLabel: activeSelectionContext?.packSizeLabel || '',
    quantity: activeSelectionContext?.quantity || 1,
    unitPrice: activeSelectionContext?.unitPrice || activeProduct?.basePrice || 0,
    totalPrice:
      activeSelectionContext?.totalPrice || activeProduct?.basePrice || 0,
    cartCount,
    cartTotal: cartTotals.subtotal,
  };

  const contextQuickPrompts = activeProduct
    ? activeProduct.id === 'panjeeri'
      ? [
          'Explain my Panjeeri selection & sizes',
          'Compare Suji, Alsi & Daal Moong flavours',
          'Panjeeri mein kon se ajzaa hain?',
          '250 gm, 450 gm & 950 gm jar sizes',
        ]
      : activeProduct.id === 'spicemix'
      ? [
          'Explain my SpiceMix selection & sizes',
          'What 17 ingredients are in SpiceMix?',
          'SpiceMix se khana kaise pakayein?',
          'Does SpiceMix have any onion?',
        ]
      : [
          'Explain Tooth Guardian 40 gm & 80 gm jars',
          'What are the ingredients & how to brush?',
          'Tooth Guardian kaise istemal karein?',
          'Delivery & COD across Pakistan',
        ]
    : QUICK_QUESTIONS;

  const agentName = siteCopy?.voiceAgentName?.trim() || 'BAJOZ Live Voice Guide';
  const agentSubtitle = activeSelectionContext
    ? `Viewing ${activeSelectionContext.productName}`
    : 'Auto-Detects Your Language';

  const defaultWelcome = activeSelectionContext
    ? `Assalam-o-Alaikum! You are looking at ${activeSelectionContext.productName} in ${activeSelectionContext.packSizeLabel} (Qty: ${activeSelectionContext.quantity}, Price: N/A). Tap the mic to talk or type your question below!`
    : 'Assalam-o-Alaikum! Welcome to BAJOZ. Tap the mic to talk or type a question below — I will reply in the same language you use!';

  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [isMutedSpokenReply, setIsMutedSpokenReply] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isSendingText, setIsSendingText] = useState(false);
  const [addedFromVoice, setAddedFromVoice] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: defaultWelcome,
    },
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const speechRecognitionRef = useRef<any>(null);
  const receivedGeminiAudioRef = useRef<boolean>(false);
  const liveModeRef = useRef<'gemini-live' | 'hybrid-24x7' | null>(null);
  const activeAudioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const stopAllAudioPlayback = useCallback(() => {
    for (const src of activeAudioSourcesRef.current) {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // ignore if already ended
      }
    }
    activeAudioSourcesRef.current = [];
    nextPlayTimeRef.current = 0;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    setTranscripts((prev) =>
      prev.map((item) =>
        item.id === 'welcome' ? { ...item, text: defaultWelcome } : item
      )
    );
  }, [defaultWelcome]);

  // Keep open WebSocket informed of context changes
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(
          JSON.stringify({
            type: 'context',
            context: voiceContextPayload,
          })
        );
      } catch {
        // ignore
      }
    }
  }, [
    voiceContextPayload.pageTitle,
    voiceContextPayload.productId,
    voiceContextPayload.variantName,
    voiceContextPayload.packSizeLabel,
    voiceContextPayload.quantity,
    voiceContextPayload.totalPrice,
  ]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  const speakWithBrowserTTS = useCallback(
    (text: string) => {
      // CRITICAL: Never use browser speechSynthesis if Gemini Live audio session is active
      // or if Gemini PCM audio has been received — prevents two voices talking at once!
      if (
        isMutedSpokenReply ||
        liveModeRef.current === 'gemini-live' ||
        receivedGeminiAudioRef.current ||
        activeAudioSourcesRef.current.length > 0 ||
        typeof window === 'undefined' ||
        !('speechSynthesis' in window)
      ) {
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const cleaned = sanitizeClientPakistaniText(text);
        const detected = detectClientLanguage(cleaned);
        const utterance = new SpeechSynthesisUtterance(cleaned);
        utterance.rate = 0.98;
        utterance.pitch = 1.0;
        utterance.lang = detected === 'urdu' ? 'ur-PK' : 'en-GB';
        utterance.onstart = () => setStatus('speaking');
        utterance.onend = () => {
          setStatus((prev) => (isActive ? 'listening' : prev === 'speaking' ? 'idle' : prev));
        };
        utterance.onerror = () => {
          setStatus((prev) => (isActive ? 'listening' : prev === 'speaking' ? 'idle' : prev));
        };
        window.speechSynthesis.speak(utterance);
      } catch {
        // ignore synthesis errors on restricted browsers
      }
    },
    [isMutedSpokenReply, isActive]
  );

  const stopSession = useCallback(() => {
    stopAllAudioPlayback();

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // ignore
      }
      speechRecognitionRef.current = null;
    }
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {
        // ignore
      }
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      void inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      void outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    receivedGeminiAudioRef.current = false;
    liveModeRef.current = null;
    setIsActive(false);
    setStatus('idle');
  }, [stopAllAudioPlayback]);

  useEffect(() => {
    if (!isVoiceConciergeOpen) {
      stopSession();
    }
  }, [isVoiceConciergeOpen, stopSession]);

  const playPcmChunk = async (base64Data: string) => {
    if (isMutedSpokenReply) return;

    // Immediately stop any browser TTS or parallel speech recognition so two voices never overlap
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // ignore
      }
      speechRecognitionRef.current = null;
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!outputAudioCtxRef.current) {
      outputAudioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
    }
    const audioCtx = outputAudioCtxRef.current;
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume().catch(() => {});
    }

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }

    const buffer = audioCtx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);

    const currentTime = audioCtx.currentTime;
    const startTime = Math.max(currentTime, nextPlayTimeRef.current);
    activeAudioSourcesRef.current.push(source);
    source.start(startTime);
    nextPlayTimeRef.current = startTime + buffer.duration;

    setStatus('speaking');
    source.onended = () => {
      activeAudioSourcesRef.current = activeAudioSourcesRef.current.filter((s) => s !== source);
      if (
        outputAudioCtxRef.current &&
        outputAudioCtxRef.current.currentTime >= nextPlayTimeRef.current - 0.05
      ) {
        setStatus((prev) => (prev === 'speaking' ? 'listening' : prev));
      }
    };
  };

  const askConciergeQuestion = useCallback(
    async (questionText: string) => {
      const trimmed = questionText.trim();
      if (!trimmed) return;

      setTranscripts((prev) => [
        ...prev,
        {
          id: `${Date.now()}-user`,
          role: 'user',
          text: trimmed,
        },
      ]);

      // If Gemini Live WebSocket is active, route through the single live session
      if (
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN &&
        liveModeRef.current === 'gemini-live'
      ) {
        try {
          wsRef.current.send(
            JSON.stringify({
              type: 'text',
              text: trimmed,
              context: voiceContextPayload,
            })
          );
          return;
        } catch {
          // Fall through to HTTP 24/7 endpoint
        }
      }

      setIsSendingText(true);
      try {
        const res = await fetch('/api/concierge/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            context: voiceContextPayload,
          }),
        });
        const data = await res.json();
        const rawReply =
          (data && typeof data.reply === 'string' && data.reply.trim()) ||
          getLocalFallbackAnswer(trimmed, agentName, voiceContextPayload);
        const reply = sanitizeClientPakistaniText(rawReply);

        setTranscripts((prev) => [
          ...prev,
          {
            id: `${Date.now()}-assistant`,
            role: 'assistant',
            text: reply,
          },
        ]);
        speakWithBrowserTTS(reply);
      } catch {
        const fallback = getLocalFallbackAnswer(trimmed, agentName, voiceContextPayload);
        setTranscripts((prev) => [
          ...prev,
          {
            id: `${Date.now()}-assistant`,
            role: 'assistant',
            text: fallback,
          },
        ]);
        speakWithBrowserTTS(fallback);
      } finally {
        setIsSendingText(false);
      }
    },
    [agentName, speakWithBrowserTTS, voiceContextPayload]
  );

  const startBrowserSpeechRecognition = useCallback(() => {
    // Only use browser speech recognition in hybrid fallback mode, NEVER alongside Gemini Live
    if (liveModeRef.current === 'gemini-live' || receivedGeminiAudioRef.current) {
      return;
    }
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    try {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-PK';

      recognition.onresult = (event: any) => {
        if (liveModeRef.current === 'gemini-live' || receivedGeminiAudioRef.current) {
          return;
        }
        const lastIdx = event.results.length - 1;
        const transcript = event.results[lastIdx]?.[0]?.transcript?.trim();
        if (transcript) {
          void askConciergeQuestion(transcript);
        }
      };

      recognition.onerror = () => {
        // Keep session active for tap/text or retry
      };

      recognition.start();
      speechRecognitionRef.current = recognition;
    } catch {
      // ignore if already started or unsupported
    }
  }, [askConciergeQuestion]);

  const startSession = async () => {
    try {
      stopAllAudioPlayback();
      setStatus('connecting');
      receivedGeminiAudioRef.current = false;
      liveModeRef.current = null;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!outputAudioCtxRef.current) {
        outputAudioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
      }
      if (outputAudioCtxRef.current.state === 'suspended') {
        await outputAudioCtxRef.current.resume().catch(() => {});
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setIsActive(true);
        setStatus('listening');

        try {
          ws.send(
            JSON.stringify({
              type: 'context',
              context: voiceContextPayload,
            })
          );
        } catch {
          // ignore
        }

        // Stream microphone PCM to Gemini Live
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                channelCount: 1,
                echoCancellation: true,
                noiseSuppression: true,
              },
            });
            mediaStreamRef.current = stream;

            const inputCtx = new AudioCtx({ sampleRate: 16000 });
            if (inputCtx.state === 'suspended') {
              await inputCtx.resume().catch(() => {});
            }
            inputAudioCtxRef.current = inputCtx;

            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (event) => {
              if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

              const inputData = event.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
              }

              const uint8 = new Uint8Array(pcm16.buffer);
              let binary = '';
              for (let i = 0; i < uint8.byteLength; i++) {
                binary += String.fromCharCode(uint8[i]);
              }
              const base64 = btoa(binary);

              wsRef.current.send(
                JSON.stringify({
                  type: 'audio',
                  data: base64,
                })
              );
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          } catch {
            // If mic permission denied, fall back to hybrid text/speech
            if (liveModeRef.current !== 'gemini-live') {
              liveModeRef.current = 'hybrid-24x7';
              speakWithBrowserTTS(defaultWelcome);
            }
          }
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'ready') {
            liveModeRef.current = msg.mode === 'gemini-live' ? 'gemini-live' : 'hybrid-24x7';
            if (liveModeRef.current === 'hybrid-24x7') {
              startBrowserSpeechRecognition();
              speakWithBrowserTTS(defaultWelcome);
            } else {
              // Ensure browser speech recognition and browser TTS are completely off in gemini-live mode
              if (speechRecognitionRef.current) {
                try {
                  speechRecognitionRef.current.stop();
                } catch {
                  // ignore
                }
                speechRecognitionRef.current = null;
              }
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
            }
          } else if (msg.type === 'mode' && msg.mode === 'hybrid-24x7') {
            liveModeRef.current = 'hybrid-24x7';
            startBrowserSpeechRecognition();
          } else if (msg.type === 'audio' && msg.data) {
            liveModeRef.current = 'gemini-live';
            receivedGeminiAudioRef.current = true;
            void playPcmChunk(msg.data);
          } else if (msg.type === 'transcript' && msg.text) {
            const cleanText = sanitizeClientPakistaniText(msg.text);
            setTranscripts((prev) => {
              // Append streaming assistant transcript chunks cleanly instead of duplicating bubbles
              const last = prev[prev.length - 1];
              if (
                msg.role === 'assistant' &&
                msg.speak === false &&
                last &&
                last.role === 'assistant' &&
                last.id !== 'welcome'
              ) {
                return [
                  ...prev.slice(0, -1),
                  {
                    ...last,
                    text: `${last.text}${cleanText}`,
                  },
                ];
              }
              return [
                ...prev,
                {
                  id: `${Date.now()}-${Math.random()}`,
                  role: msg.role || 'assistant',
                  text: cleanText,
                },
              ];
            });
            if (
              msg.speak === true &&
              liveModeRef.current !== 'gemini-live' &&
              !receivedGeminiAudioRef.current
            ) {
              speakWithBrowserTTS(cleanText);
            }
          } else if (msg.type === 'interrupted') {
            stopAllAudioPlayback();
            setStatus('listening');
          }
        } catch {
          // ignore
        }
      };

      ws.onerror = () => {
        liveModeRef.current = 'hybrid-24x7';
        setIsActive(true);
        setStatus('listening');
        startBrowserSpeechRecognition();
        speakWithBrowserTTS(defaultWelcome);
      };
    } catch {
      liveModeRef.current = 'hybrid-24x7';
      setIsActive(true);
      setStatus('listening');
      startBrowserSpeechRecognition();
      speakWithBrowserTTS(defaultWelcome);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isSendingText) return;
    const question = textInput;
    setTextInput('');
    void askConciergeQuestion(question);
  };

  if (!isVoiceConciergeOpen) return null;

  const whatsappUrl = buildReliableWhatsAppUrl(
    settings?.whatsappNumber,
    settings?.whatsappGreeting
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div
        className="fixed inset-0 bg-[#5A4E38]/60 backdrop-blur-sm"
        onClick={() => setIsVoiceConciergeOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-[#F9F5E9] rounded-3xl shadow-2xl border-[1.5px] border-[#7A5C38] overflow-hidden z-10 flex flex-col max-h-[92vh] sm:max-h-[88vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#40563D] text-[#F9F5E9] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={BAJOZ_MASTER_VECTORS.masterSvg}
              alt="BAJOZ Emblem"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-xl border border-[#F9F5E9]/30 object-contain shrink-0 select-none"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base sm:text-lg font-bold leading-tight text-[#F9F5E9] truncate">
                  {agentName}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F9F5E9]/15 text-[#E9F399] text-[10px] font-bold uppercase tracking-wider shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E9F399] animate-pulse" />
                  Live Context
                </span>
              </div>
              <p className="text-[11px] text-[#F9F5E9]/85 flex items-center gap-1.5 truncate">
                <Radio className="w-3 h-3 text-[#E9F399] shrink-0" />
                <span className="truncate">{agentSubtitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                const nextMuted = !isMutedSpokenReply;
                setIsMutedSpokenReply(nextMuted);
                if (nextMuted) {
                  stopAllAudioPlayback();
                }
              }}
              aria-label={isMutedSpokenReply ? 'Unmute voice output' : 'Mute voice output'}
              className="p-2 text-[#F9F5E9]/80 hover:text-[#E9F399] rounded-full cursor-pointer transition-colors"
              title={isMutedSpokenReply ? 'Unmute spoken responses' : 'Mute spoken responses'}
            >
              {isMutedSpokenReply ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsVoiceConciergeOpen(false)}
              aria-label="Close Live Voice Guide"
              className="p-2 text-[#F9F5E9]/80 hover:text-[#F9F5E9] rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Context-Aware Active Selection Bar */}
        <div className="px-4 py-2.5 bg-[#E9F399] border-b border-[#7A5C38]/30 flex flex-wrap items-center justify-between gap-2 text-xs text-[#40563D]">
          {activeSelectionContext && activeProduct ? (
            <>
              <div className="font-semibold truncate">
                <span className="font-extrabold">{activeSelectionContext.productName}:</span>{' '}
                {activeSelectionContext.variantName} · {activeSelectionContext.packSizeLabel} ×{' '}
                {activeSelectionContext.quantity} (
                <span className="font-mono font-extrabold">
                  Price: N/A
                </span>
                )
              </div>
              <button
                type="button"
                onClick={() => {
                  addToCart(
                    activeProduct,
                    activeSelectionContext.variantId,
                    activeSelectionContext.packSizeId,
                    activeSelectionContext.quantity
                  );
                  setAddedFromVoice(true);
                  setTimeout(() => setAddedFromVoice(false), 1800);
                }}
                className="px-3 py-1 rounded-full bg-[#40563D] text-[#F9F5E9] font-bold text-[11px] cursor-pointer shrink-0"
              >
                {addedFromVoice ? 'Added to Bag!' : '+ Add Selection to Bag'}
              </button>
            </>
          ) : (
            <div className="w-full flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold">Viewing: {pageTitle}</span>
              <div className="flex items-center gap-1.5">
                {products.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActiveProductId(p.id);
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-[#F9F5E9] hover:bg-white text-[#40563D] border border-[#7A5C38] text-[10px] font-bold cursor-pointer"
                  >
                    {p.id === 'panjeeri'
                      ? 'Panjeeri'
                      : p.id === 'spicemix'
                      ? 'SpiceMix'
                      : 'Tooth Guardian'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Voice Stage */}
        <div className="p-4 sm:p-5 flex flex-col items-center text-center border-b border-[#E6DDC8] bg-[#F5EBC8]">
          <button
            type="button"
            onClick={() => (isActive ? stopSession() : void startSession())}
            disabled={status === 'connecting'}
            aria-label={isActive ? 'Stop live voice call' : 'Start live voice call'}
            className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
              status === 'speaking'
                ? 'bg-[#E9F399] text-[#5A4E38] scale-105 ring-8 ring-[#E9F399]/40'
                : status === 'listening'
                ? 'bg-[#40563D] text-[#F9F5E9] ring-8 ring-[#40563D]/20 animate-pulse'
                : 'bg-[#40563D] hover:bg-[#334530] text-[#F9F5E9] border-2 border-[#E6DDC8]'
            }`}
          >
            {status === 'speaking' ? (
              <Volume2 className="w-7 h-7 text-[#5A4E38]" />
            ) : isActive ? (
              <MicOff className="w-7 h-7" />
            ) : (
              <Mic className="w-7 h-7 text-[#F9F5E9]" />
            )}
          </button>

          <p className="mt-2.5 font-serif text-sm sm:text-base font-bold text-[#5A4E38]">
            {status === 'connecting'
              ? `Connecting to ${agentName}...`
              : status === 'speaking'
              ? `${agentName} is speaking...`
              : status === 'listening'
              ? 'Listening — speak naturally, I will reply in your language'
              : 'Tap the mic to talk — I auto-detect how you speak'}
          </p>

          {/* Context-Aware Quick Topic Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {contextQuickPrompts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => void askConciergeQuestion(q)}
                className="px-3 py-1 rounded-full bg-[#F9F5E9] hover:bg-[#E9F399] text-[#40563D] border border-[#7A5C38] text-[11px] font-semibold transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Transcripts */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#F5EBC8]/60 min-h-[140px]">
          {transcripts.map((t) => (
            <div
              key={t.id}
              className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                t.role === 'assistant'
                  ? 'bg-[#F9F5E9] text-[#5A4E38] border border-[#7A5C38]/40'
                  : 'bg-[#40563D] text-[#F9F5E9] ml-8'
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wider opacity-70 mb-1 font-semibold">
                {t.role === 'assistant' ? agentName : 'You'}
              </span>
              {t.text}
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>

        {/* 24/7 Interactive Question Input */}
        <form
          onSubmit={handleTextSubmit}
          className="px-4 py-2.5 bg-[#F9F5E9] border-t border-[#E6DDC8] flex items-center gap-2"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              activeSelectionContext
                ? `Ask a question about ${activeSelectionContext.productName}...`
                : 'Type your question in English or Urdu...'
            }
            className="flex-1 bg-[#F5EBC8] border border-[#7A5C38]/40 rounded-full px-3.5 py-2 text-xs text-[#5A4E38] placeholder:text-[#786C57]/75 focus:outline-none focus:border-[#40563D]"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isSendingText}
            aria-label="Send question to Live Voice Guide"
            className="px-3.5 py-2 rounded-full bg-[#40563D] hover:bg-[#334530] disabled:opacity-50 text-[#F9F5E9] text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-[#F9F5E9]" />
            <span>Ask</span>
          </button>
        </form>

        {/* Footer Controls */}
        <div className="px-4 sm:px-6 py-3 bg-[#F9F5E9] border-t border-[#E6DDC8] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DCE7C9] hover:bg-[#E1E9D7] text-[#5A4E38] border border-[#7A5C38]/40 font-semibold text-[11px] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#40563D]" />
              <span>WhatsApp 24/7</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setIsVoiceConciergeOpen(false);
                setIsTrackingOpen(true);
              }}
              className="px-3 py-1.5 rounded-full bg-[#F5EBC8] hover:bg-[#E9F399] text-[#40563D] border border-[#7A5C38]/40 font-semibold text-[11px] cursor-pointer transition-colors"
            >
              Track Order
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isActive ? (
              <button
                type="button"
                onClick={stopSession}
                className="px-4 py-2 bg-[#9B6A73] text-[#F9F5E9] font-semibold rounded-full cursor-pointer text-xs"
              >
                End Voice Call
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void startSession()}
                className="px-4 py-2 bg-[#40563D] hover:bg-[#334530] text-[#F9F5E9] font-bold rounded-full cursor-pointer text-xs transition-colors"
              >
                Start Voice Call
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
