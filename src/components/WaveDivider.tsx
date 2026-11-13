/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';

interface WaveDividerProps {
  fromColor: '#F5EBC8' | '#F9F5E9' | '#FFFDF9' | string;
  toColor: '#F5EBC8' | '#F9F5E9' | '#FFFDF9' | string;
  flip?: boolean;
  compact?: boolean;
}

/**
 * Postage-stamp perforated / scalloped bottom-border for full-width sections.
 * Semicircular stamp perforations bite upward into the bottom edge of each section
 * (matching the bottom border of the stamp box in the reference design).
 */
export const WaveDivider: React.FC<WaveDividerProps> = ({
  fromColor,
  toColor,
}) => {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const patternId = `bajoz-stamp-bottom-${rawId}`;

  // Bottom-border stamp geometry: semicircular notches bite upward into the upper section (fromColor)
  const fillPath =
    'M 0 16 L 4.5 16 A 6.5 6.5 0 0 1 17.5 16 L 22 16 L 22 22 L 0 22 Z';
  const strokePath =
    'M 0 16 L 4.5 16 A 6.5 6.5 0 0 1 17.5 16 L 22 16';

  return (
    <div
      aria-hidden="true"
      style={{ backgroundColor: fromColor }}
      className="relative w-full overflow-hidden leading-[0] pointer-events-none select-none -mt-px -mb-px"
    >
      <svg
        width="100%"
        height="22"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full h-[22px]"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <path d={fillPath} fill={toColor} />
            <path
              d={strokePath}
              fill="none"
              stroke="#7A5C38"
              strokeWidth="1.25"
              strokeLinecap="butt"
              strokeLinejoin="round"
            />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="22" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};
