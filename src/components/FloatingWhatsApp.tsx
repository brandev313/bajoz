import React from 'react';
import { useShop } from '../context/ShopContext';
import { Mic } from 'lucide-react';

export function buildReliableWhatsAppUrl(rawNumber?: string, rawGreeting?: string): string {
  const digitsOnly = String(rawNumber || '').replace(/\D/g, '');
  let normalizedPhone = '923154388166';

  if (digitsOnly.length >= 10) {
    if (digitsOnly.startsWith('03') && digitsOnly.length === 11) {
      normalizedPhone = `92${digitsOnly.slice(1)}`;
    } else if (digitsOnly.startsWith('0092')) {
      normalizedPhone = digitsOnly.slice(2);
    } else if (digitsOnly.startsWith('3') && digitsOnly.length === 10) {
      normalizedPhone = `92${digitsOnly}`;
    } else {
      normalizedPhone = digitsOnly;
    }
  }

  const greeting =
    String(rawGreeting || '').trim() ||
    'Assalam-o-Alaikum BAJOZ! I have a question about your natural products.';

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(greeting)}`;
}

export const FloatingWhatsApp: React.FC = () => {
  const {
    settings,
    currentView,
    setIsVoiceConciergeOpen,
    activeSelectionContext,
  } = useShop();

  if (currentView === 'admin') return null;

  const url = buildReliableWhatsAppUrl(
    settings?.whatsappNumber,
    settings?.whatsappGreeting
  );

  const voiceLabel = activeSelectionContext
    ? `Voice Guide · ${
        activeSelectionContext.productId === 'panjeeri'
          ? 'Panjeeri'
          : activeSelectionContext.productId === 'spicemix'
          ? 'SpiceMix'
          : activeSelectionContext.productId === 'toothpowder'
          ? 'Tooth Guardian'
          : 'Live'
      }`
    : 'Live Voice Guide';

  return (
    <aside
      aria-label="Customer Care & Live Voice Guide"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[95] flex items-center gap-2 sm:gap-2.5 pointer-events-auto"
    >
      <button
        type="button"
        onClick={() => setIsVoiceConciergeOpen(true)}
        aria-label="Open Context-Aware Live Voice Guide"
        className="inline-flex items-center gap-2 min-h-[44px] bg-[#F2EBD0] hover:bg-[#E9F390] text-[#40563D] border-[1.5px] border-[#5A4E38] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-lg transition-all duration-150 text-xs font-extrabold uppercase tracking-[0.06em] cursor-pointer whitespace-nowrap"
      >
        <Mic className="w-4 h-4 text-[#40563D] shrink-0" />
        <span className="hidden sm:inline">{voiceLabel}</span>
        <span className="sm:hidden">Voice</span>
      </button>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="inline-flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#40563D] hover:bg-[#E9F390] text-[#E9F390] hover:text-[#40563D] border-[1.5px] border-[#5A4E38] shadow-lg transition-all duration-150 hover:scale-105 cursor-pointer group"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-6 h-6 shrink-0"
        >
          <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.49 0 .14 5.34.14 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.29-1.65a11.88 11.88 0 0 0 5.77 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.17-3.47-8.42ZM12.07 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9a9.84 9.84 0 0 1 7 2.9 9.83 9.83 0 0 1 2.9 7c0 5.46-4.45 9.88-9.91 9.88Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </a>
    </aside>
  );
};
