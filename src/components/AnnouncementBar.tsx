/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X } from 'lucide-react';
import { WaveDivider } from './WaveDivider';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useShop();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-30">
      <div className="bg-[#40563D] text-[#F2EBD0]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-9 flex items-center justify-center relative">
          <p className="font-dm font-medium tracking-[0.06em] uppercase text-[10px] sm:text-[11px] text-[#F2EBD0] leading-none text-center pr-6 truncate">
            <span className="text-[#E9F390] font-bold">Fresh Nationwide Dispatch</span>
            <span className="mx-2.5 opacity-50" aria-hidden="true">
              ·
            </span>
            <span>
              {settings.announcementText ||
                'Panjeeri  ·  SpiceMix  ·  Tooth Guardian'}
            </span>
          </p>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss announcement"
            className="absolute right-3 sm:right-8 lg:right-12 text-[#F2EBD0]/75 hover:text-[#E9F390] transition-colors duration-150 p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <WaveDivider fromColor="#40563D" toColor="#F2EBD0" compact strokeColor="none" />
    </div>
  );
};
