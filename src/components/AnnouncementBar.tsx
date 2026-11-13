/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useShop();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#E9F399] text-[#4A2E1B] text-xs border-b border-[#7A5C38]/25 relative z-30">
      <div className="w-full max-w-[1680px] mx-auto px-3 xs:px-4 sm:px-8 lg:px-14 xl:px-24 min-h-9 py-1.5 flex items-center justify-center relative">
        <p className="font-semibold tracking-[0.03em] text-[10px] xs:text-[11px] sm:text-xs text-[#4A2E1B] leading-snug text-center pr-6 sm:pr-8 truncate max-w-full">
          {settings.announcementText ||
            'Panjeeri  ·  SpiceMix  ·  Tooth Guardian'}
        </p>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-2.5 xs:right-3 sm:right-8 lg:right-14 xl:right-24 text-[#4A2E1B]/75 hover:text-[#4A2E1B] transition-colors duration-150 p-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
