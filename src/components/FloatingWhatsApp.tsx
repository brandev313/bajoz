import React from 'react';
import { useShop } from '../context/ShopContext';
import { MessageCircle, Mic } from 'lucide-react';

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
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[95] flex flex-col sm:flex-row items-end sm:items-center gap-2.5 pointer-events-auto"
    >
      <button
        type="button"
        onClick={() => setIsVoiceConciergeOpen(true)}
        aria-label="Open Context-Aware Live Voice Guide"
        className="inline-flex items-center gap-2 bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] px-4 sm:px-5 py-3 sm:py-3.5 rounded-full shadow-lg transition-all duration-150 text-xs font-extrabold uppercase tracking-[0.06em] cursor-pointer whitespace-nowrap"
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#40563D] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#40563D]" />
        </span>
        <Mic className="w-4 h-4 text-[#40563D] shrink-0" />
        <span>{voiceLabel}</span>
      </button>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="inline-flex items-center gap-2 bg-[#40563D] hover:bg-[#344731] text-[#F9F5E9] border-[1.5px] border-[#7A5C38] px-4 sm:px-5 py-3 sm:py-3.5 rounded-full shadow-lg transition-colors duration-150 text-xs font-extrabold uppercase tracking-[0.06em] cursor-pointer whitespace-nowrap"
      >
        <MessageCircle className="w-4 h-4 text-[#E9F399] shrink-0" />
        <span>WhatsApp Desk</span>
      </a>
    </aside>
  );
};

