/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';

interface WaveDividerProps {
  fromColor: string;
  toColor: string;
  flip?: boolean;
  compact?: boolean;
  strokeColor?: string;
}

/**
 * Builds a seamless, tileable SVG path for a molded triangle border with slightly curved edges.
 * Horizontal tangents at x=0, x=W/2, and x=W guarantee smooth C1 tiling across any viewport width,
 * while tight apex/valley rounding and subtly bowed flanks create an unmistakable curved-edge triangle profile.
 */
function buildCurvedTriangleEdgePath(
  tileWidth: number,
  baseY: number,
  tipY: number
): string {
  const w = tileWidth;
  const d = tipY - baseY;
  const f = (n: number) => Number(n.toFixed(2));

  return [
    `M0,${f(baseY)}`,
    `C${f(0.06 * w)},${f(baseY)} ${f(0.12 * w)},${f(baseY + 0.19 * d)} ${f(0.25 * w)},${f(baseY + 0.53 * d)}`,
    `C${f(0.38 * w)},${f(baseY + 0.87 * d)} ${f(0.44 * w)},${f(tipY)} ${f(0.5 * w)},${f(tipY)}`,
    `C${f(0.56 * w)},${f(tipY)} ${f(0.62 * w)},${f(baseY + 0.87 * d)} ${f(0.75 * w)},${f(baseY + 0.53 * d)}`,
    `C${f(0.88 * w)},${f(baseY + 0.19 * d)} ${f(0.94 * w)},${f(baseY)} ${f(w)},${f(baseY)}`,
  ].join(' ');
}

/**
 * Artisanal curved-edge triangular section border.
 * Uses a fixed-pixel SVG <pattern> so every softly curved triangle peak stays crisp and uniform
 * across mobile, tablet, and widescreen viewports without horizontal stretching.
 */
export const WaveDivider: React.FC<WaveDividerProps> = ({
  fromColor,
  toColor,
  flip = false,
  compact = false,
  strokeColor,
}) => {
  const rawId = useId();
  const patternId = `bajoz-tri-border-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  // True-scale curved triangle geometry (constant pixel pitch at every viewport width)
  const tileWidth = compact ? 24 : 30;
  const tileHeight = compact ? 13 : 17;
  const edgePad = compact ? 2 : 2.5;

  const isSameFill = fromColor.trim().toLowerCase() === toColor.trim().toLowerCase();
  const isDarkTransition =
    fromColor.trim().toLowerCase() === '#40563d' ||
    toColor.trim().toLowerCase() === '#40563d';

  // Resolve seam stroke:
  // - 'none' disables the seam stroke for pure color-block transitions
  // - Same-color or light-to-light transitions default to crisp Earthy Brown (#5A4E38)
  // - Legacy faint yellow strokes (#E9F390) on light-to-light seams upgrade to #5A4E38 for clarity
  const resolvedStroke =
    strokeColor === 'none'
      ? null
      : strokeColor && strokeColor.toLowerCase() !== '#e9f390'
      ? strokeColor
      : isDarkTransition && !isSameFill
      ? null
      : '#5A4E38';

  // flip=false: top section (fromColor) molds DOWNWARD in curved triangles over bottom section (toColor)
  // flip=true:  bottom section (toColor) molds UPWARD in curved triangles over top section (fromColor)
  const containerBg = flip ? fromColor : toColor;
  const motifFill = flip ? toColor : fromColor;

  const baseY = flip ? tileHeight - edgePad : edgePad;
  const tipY = flip ? edgePad : tileHeight - edgePad;

  const strokePath = buildCurvedTriangleEdgePath(tileWidth, baseY, tipY);
  // Extend polygon 3px beyond solid edge + paint a full-width solid base strip to eliminate
  // subpixel anti-aliasing hairlines on dark/light section seams at any zoom level.
  const fillPath = flip
    ? `${strokePath} L${tileWidth},${tileHeight + 3} L0,${tileHeight + 3} Z`
    : `${strokePath} L${tileWidth},-3 L0,-3 Z`;

  return (
    <div
      aria-hidden="true"
      style={{
        backgroundColor: containerBg,
        marginTop: flip ? 0 : '-1px',
        marginBottom: flip ? '-1px' : 0,
      }}
      className="relative w-full overflow-hidden leading-[0] pointer-events-none select-none"
    >
      <svg
        width="100%"
        height={tileHeight}
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full"
        style={{ height: `${tileHeight}px` }}
        shapeRendering="geometricPrecision"
      >
        <defs>
          <pattern
            id={patternId}
            width={tileWidth}
            height={tileHeight}
            patternUnits="userSpaceOnUse"
          >
            <path d={fillPath} fill={motifFill} />
            {resolvedStroke && (
              <path
                d={strokePath}
                fill="none"
                stroke={resolvedStroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </pattern>
        </defs>
        <rect width="100%" height={tileHeight} fill={`url(#${patternId})`} />
        <rect
          x="0"
          y={flip ? tileHeight - edgePad : 0}
          width="100%"
          height={edgePad + 1}
          fill={motifFill}
        />
      </svg>
    </div>
  );
};

interface ScallopedHeaderEdgeProps {
  fillColor?: string;
  strokeColor?: string;
}

/**
 * Transparent-backed hanging curved-edge triangle border for sticky headers,
 * matching the molded triangle section dividers across the site.
 */
export const ScallopedHeaderEdge: React.FC<ScallopedHeaderEdgeProps> = ({
  fillColor = '#F2EBD0',
  strokeColor = '#5A4E38',
}) => {
  const rawId = useId();
  const patternId = `bajoz-header-tri-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const tileWidth = 24;
  const tileHeight = 12;
  const baseY = 1.5;
  const tipY = 10.2;

  const strokePath = buildCurvedTriangleEdgePath(tileWidth, baseY, tipY);
  const fillPath = `${strokePath} L${tileWidth},0 L0,0 Z`;

  return (
    <div
      aria-hidden="true"
      className="absolute left-0 right-0 top-full w-full overflow-hidden leading-[0] pointer-events-none select-none"
      style={{ height: `${tileHeight}px` }}
    >
      <svg
        width="100%"
        height={tileHeight}
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full"
      >
        <defs>
          <pattern
            id={patternId}
            width={tileWidth}
            height={tileHeight}
            patternUnits="userSpaceOnUse"
          >
            <path d={fillPath} fill={fillColor} />
            <path
              d={strokePath}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height={tileHeight} fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};
