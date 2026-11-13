/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Luxury Global DTC Editorial Culinary & Botanical Ink-and-Wash Illustrations
 * for the BAJOZ – The House of Naturals SpiceMix Interactive Recipe Guide (/guide).
 *
 * Includes:
 * 1. IngredientSpotDoodle — Symmetrical Ingredient Visual Grid spot illustrations
 *    (BAJOZ SpiceMix Jar, Sliced Onions, Diced Tomatoes, Whipped Yogurt, Meat/Chicken,
 *    Fish Fillets, Lentils/Chana, Basmati Rice, Oil/Ghee, Water, Fresh Garnish, Flour Slurry).
 * 2. RecipeStepDoodle — 3-Step Visual Cooking Workflow illustrations.
 */

import React from 'react';

export type IngredientDoodleType =
  | 'spicemix-jar'
  | 'onions'
  | 'tomatoes'
  | 'yogurt'
  | 'meat-cuts'
  | 'fish-fillets'
  | 'lentils-bowl'
  | 'basmati-rice'
  | 'cooking-oil'
  | 'water-glasses'
  | 'fresh-garnish'
  | 'flour-slurry';

export type RecipeDoodleVariant =
  | 'curry-step-1'
  | 'curry-step-2'
  | 'curry-step-3'
  | 'lentil-step-1'
  | 'lentil-step-2'
  | 'lentil-step-3'
  | 'rice-step-1'
  | 'rice-step-2'
  | 'rice-step-3'
  | 'fry-roast-step-1'
  | 'fry-roast-step-2'
  | 'fry-roast-step-3';

interface IngredientSpotDoodleProps {
  type: IngredientDoodleType;
  className?: string;
}

export const IngredientSpotDoodle: React.FC<IngredientSpotDoodleProps> = ({
  type,
  className = 'w-14 h-14 sm:w-16 sm:h-16 shrink-0',
}) => {
  return (
    <svg
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      {/* Organic Ink-and-Wash Backdrop Halo */}
      <circle cx="44" cy="44" r="39" fill="#FAF9F7" />
      <path
        d="M45 8C65 8 80 22 80 43C80 64 65 79 43 80C21 81 8 65 8 44C8 23 25 8 45 8Z"
        fill="#E1E9D7"
        fillOpacity="0.6"
      />
      <circle
        cx="44"
        cy="44"
        r="37.5"
        stroke="#5A4E38"
        strokeWidth="0.85"
        strokeOpacity="0.3"
      />

      {/* 1. BAJOZ SPICEMIX JAR & WOODEN SPOON */}
      {type === 'spicemix-jar' && (
        <g>
          {/* Warm Terracotta Offset Wash */}
          <rect x="28" y="31" width="32" height="39" rx="7" fill="#C98A6A" fillOpacity="0.55" />
          <circle cx="62" cy="26" r="9" fill="#E9F390" fillOpacity="0.7" />
          {/* Jar Brass Lid */}
          <rect
            x="30"
            y="21"
            width="28"
            height="7"
            rx="2.5"
            fill="#C7B39A"
            stroke="#5A4E38"
            strokeWidth="1.3"
          />
          {/* Glass Jar Body */}
          <rect
            x="26"
            y="28"
            width="36"
            height="42"
            rx="7"
            fill="#FAF9F7"
            fillOpacity="0.5"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          {/* Cream Label with BAJOZ Tree Motif */}
          <rect
            x="30"
            y="38"
            width="28"
            height="22"
            rx="3"
            fill="#F9F5E9"
            stroke="#5A4E38"
            strokeWidth="1.1"
          />
          <circle cx="44" cy="46" r="4.5" fill="#DCE7C9" stroke="#40563D" strokeWidth="1" />
          <path d="M44 46V54" stroke="#40563D" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="35" y1="56" x2="53" y2="56" stroke="#5A4E38" strokeWidth="1.1" strokeLinecap="round" />
          {/* Small Wooden Measuring Spoon Beside Jar */}
          <path d="M66 19L57 34" stroke="#5A4E38" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="55" cy="36" r="4.2" fill="#C98A6A" stroke="#5A4E38" strokeWidth="1.2" />
        </g>
      )}

      {/* 2. SLICED ONIONS */}
      {type === 'onions' && (
        <g>
          <ellipse cx="42" cy="49" rx="22" ry="15" fill="#9B6A73" fillOpacity="0.28" />
          {/* Whole Red Onion Bulb */}
          <path
            d="M28 50C28 38 37 33 41 25C45 33 54 38 54 50C54 59 48 64 41 64C34 64 28 59 28 50Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <path d="M36 36C34 44 35 55 41 63" stroke="#9B6A73" strokeWidth="1" strokeLinecap="round" />
          <path d="M46 36C48 44 47 55 41 63" stroke="#9B6A73" strokeWidth="1" strokeLinecap="round" />
          {/* Sliced Onion Rings in Foreground */}
          <ellipse
            cx="54"
            cy="56"
            rx="13"
            ry="7.5"
            fill="#FAF9F7"
            stroke="#9B6A73"
            strokeWidth="1.35"
          />
          <ellipse cx="54" cy="56" rx="8.5" ry="4.5" stroke="#5A4E38" strokeWidth="1" />
          <ellipse cx="54" cy="56" rx="4" ry="2" stroke="#9B6A73" strokeWidth="1" />
        </g>
      )}

      {/* 3. DICED / HALVED TOMATOES */}
      {type === 'tomatoes' && (
        <g>
          <circle cx="40" cy="47" r="17" fill="#C98A6A" fillOpacity="0.55" />
          <circle
            cx="38"
            cy="46"
            r="16"
            fill="#C98A6A"
            fillOpacity="0.35"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          {/* Tomato Leaf Calyx */}
          <path
            d="M32 31L38 34L44 31M38 28V35"
            stroke="#40563D"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Halved Juicy Tomato Slice */}
          <path
            d="M44 54C44 45 52 43 60 46C65 48.5 64 58 56 61C49 63.5 44 59 44 54Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.3"
          />
          <path
            d="M48 53C48 48.5 53 47 57 49C60 50.5 59 56 54 57.5C50 58.5 48 56 48 53Z"
            fill="#C98A6A"
            fillOpacity="0.65"
          />
          <circle cx="52" cy="52" r="1" fill="#5A4E38" />
          <circle cx="56" cy="53.5" r="1" fill="#5A4E38" />
        </g>
      )}

      {/* 4. WHIPPED YOGURT (DAHI BOWL) */}
      {type === 'yogurt' && (
        <g>
          <ellipse cx="45" cy="54" rx="23" ry="12" fill="#C7B39A" fillOpacity="0.38" />
          <path
            d="M21 45H67C65 60 56 66 44 66C32 66 23 60 21 45Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
            strokeLinejoin="round"
          />
          {/* Creamy Whipped Yogurt Peaks */}
          <path
            d="M22 45C27 38 35 42 41 37C46 33 52 39 58 37C63 36 65 41 66 45H22Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path
            d="M32 42C37 39 44 43 52 40"
            stroke="#E1E9D7"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Small Spoon */}
          <path d="M56 38L67 24" stroke="#5A4E38" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      )}

      {/* 5. MEAT / CHICKEN CUTS */}
      {type === 'meat-cuts' && (
        <g>
          <ellipse cx="45" cy="52" rx="24" ry="14" fill="#C98A6A" fillOpacity="0.38" />
          <ellipse
            cx="44"
            cy="53"
            rx="26"
            ry="13"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.3"
          />
          {/* Drumstick / Bone-in Cut */}
          <path
            d="M32 49C32 41 42 38 51 42C56 44.5 56 52 49 55C41 58 32 55 32 49Z"
            fill="#C98A6A"
            fillOpacity="0.6"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <path
            d="M32 47L24 43C22 42 21 45 23 47L31 50"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.25"
          />
          {/* Marbling lines */}
          <path d="M39 46C43 45 47 47 49 50" stroke="#FAF9F7" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="57" cy="49" r="4.5" fill="#C7B39A" stroke="#5A4E38" strokeWidth="1.2" />
        </g>
      )}

      {/* 6. FISH FILLETS */}
      {type === 'fish-fillets' && (
        <g>
          <ellipse cx="45" cy="50" rx="25" ry="14" fill="#E9F390" fillOpacity="0.45" />
          <path
            d="M22 50C26 39 44 37 62 43C68 45 70 50 65 55C58 61 38 61 25 55C21 53.5 21 51.5 22 50Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <path
            d="M26 49C30 42 44 41 59 45C63 46.5 64 50 60 53C54 57 38 57 28 53Z"
            fill="#C98A6A"
            fillOpacity="0.45"
          />
          <line x1="36" y1="42" x2="33" y2="55" stroke="#5A4E38" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="46" y1="42" x2="43" y2="56" stroke="#5A4E38" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="56" y1="44" x2="53" y2="55" stroke="#5A4E38" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      )}

      {/* 7. LENTILS / CHICKPEAS BOWL (DAAL / CHANA) */}
      {type === 'lentils-bowl' && (
        <g>
          <ellipse cx="44" cy="52" rx="23" ry="13" fill="#E9F390" fillOpacity="0.55" />
          <path
            d="M21 46H67C65 60 56 66 44 66C32 66 23 60 21 46Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <path
            d="M23 46C29 36 59 36 65 46H23Z"
            fill="#C98A6A"
            fillOpacity="0.5"
            stroke="#5A4E38"
            strokeWidth="1.25"
          />
          {/* Lentil / Chickpea Stipples */}
          <circle cx="35" cy="43" r="1.5" fill="#5A4E38" />
          <circle cx="42" cy="41" r="1.5" fill="#9B6A73" />
          <circle cx="49" cy="43" r="1.5" fill="#5A4E38" />
          <circle cx="55" cy="44" r="1.4" fill="#9B6A73" />
          <circle cx="39" cy="44.5" r="1.3" fill="#FAF9F7" />
        </g>
      )}

      {/* 8. BASMATI RICE BOWL */}
      {type === 'basmati-rice' && (
        <g>
          <ellipse cx="44" cy="53" rx="23" ry="12" fill="#DCE7C9" fillOpacity="0.65" />
          <path
            d="M21 46H67C65 60 56 66 44 66C32 66 23 60 21 46Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <path
            d="M23 46C28 33 60 33 65 46H23Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.3"
          />
          {/* Slender Rice Grain Strokes */}
          <line x1="36" y1="39" x2="40" y2="41" stroke="#5A4E38" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="44" y1="37" x2="48" y2="39" stroke="#5A4E38" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="51" y1="41" x2="55" y2="42" stroke="#5A4E38" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="39" y1="43" x2="44" y2="44" stroke="#5A4E38" strokeWidth="1.1" strokeLinecap="round" />
        </g>
      )}

      {/* 9. COOKING OIL / DESI GHEE */}
      {type === 'cooking-oil' && (
        <g>
          <circle cx="44" cy="48" r="18" fill="#E9F390" fillOpacity="0.65" />
          {/* Glass Oil Cruet Bottle */}
          <path
            d="M39 24H49V32L57 44C60 49 58 64 44 64C30 64 28 49 31 44L39 32V24Z"
            fill="#FAF9F7"
            fillOpacity="0.8"
            stroke="#5A4E38"
            strokeWidth="1.35"
            strokeLinejoin="round"
          />
          {/* Golden Oil Level Inside */}
          <path
            d="M32 49C37 47 51 47 56 49C57 56 53 62 44 62C35 62 31 56 32 49Z"
            fill="#E9F390"
            stroke="#5A4E38"
            strokeWidth="1.1"
          />
          {/* Pour Spout & Cork */}
          <rect x="41" y="19" width="6" height="5" rx="1.5" fill="#C7B39A" stroke="#5A4E38" strokeWidth="1.1" />
        </g>
      )}

      {/* 10. MEASURED WATER GLASSES */}
      {type === 'water-glasses' && (
        <g>
          <circle cx="44" cy="46" r="18" fill="#E1E9D7" fillOpacity="0.85" />
          <path
            d="M29 26H59L55 62C54.5 65 51 67 44 67C37 67 33.5 65 33 62L29 26Z"
            fill="#FAF9F7"
            fillOpacity="0.85"
            stroke="#5A4E38"
            strokeWidth="1.35"
            strokeLinejoin="round"
          />
          <path
            d="M31 40C37 38 43 42 49 40C52 39 55 40 57 40L54.5 61C54 63.5 50.5 65 44 65C37.5 65 34 63.5 33.5 61L31 40Z"
            fill="#E1E9D7"
            fillOpacity="0.8"
          />
          <path
            d="M31 40C37 38 43 42 49 40C52 39 55 40 57 40"
            stroke="#5A4E38"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* 11. FRESH GARNISH (CORIANDER, MINT, GREEN CHILLIES & LEMON) */}
      {type === 'fresh-garnish' && (
        <g>
          <circle cx="44" cy="45" r="18" fill="#DCE7C9" fillOpacity="0.7" />
          {/* Slit Green Chilli */}
          <path
            d="M24 54C30 44 46 40 58 46C48 55 34 58 24 54Z"
            fill="#40563D"
            stroke="#5A4E38"
            strokeWidth="1.3"
          />
          <path d="M58 46L65 42" stroke="#40563D" strokeWidth="1.4" strokeLinecap="round" />
          {/* Coriander Leaf Sprig */}
          <path d="M32 38C36 28 45 24 54 24" stroke="#40563D" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="42" cy="29" r="5" fill="#DCE7C9" stroke="#40563D" strokeWidth="1.2" />
          <circle cx="51" cy="26" r="4.5" fill="#40563D" fillOpacity="0.8" stroke="#5A4E38" strokeWidth="1.1" />
          {/* Lemon Wedge */}
          <path
            d="M40 62C40 55 47 52 55 53C61 54 64 58 63 63L40 62Z"
            fill="#E9F390"
            stroke="#5A4E38"
            strokeWidth="1.25"
          />
        </g>
      )}

      {/* 12. WHEAT FLOUR (ATTA) SLURRY BOWL FOR NIHARI */}
      {type === 'flour-slurry' && (
        <g>
          <ellipse cx="44" cy="53" rx="22" ry="12" fill="#C7B39A" fillOpacity="0.4" />
          <path
            d="M22 46H66C64 60 55 66 44 66C33 66 24 60 22 46Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <ellipse
            cx="44"
            cy="46"
            rx="22"
            ry="5"
            fill="#F9F5E9"
            stroke="#5A4E38"
            strokeWidth="1.25"
          />
          {/* Whisk / Spoon Stirring Slurry */}
          <path d="M46 45L62 23" stroke="#5A4E38" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M35 46C40 44 48 48 53 45" stroke="#C7B39A" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};

interface RecipeStepDoodleProps {
  variant: RecipeDoodleVariant;
  className?: string;
}

export const RecipeStepDoodle: React.FC<RecipeStepDoodleProps> = ({
  variant,
  className = 'w-20 h-20 sm:w-24 sm:h-24 shrink-0',
}) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      {/* =====================================================================
          AIRY EDITORIAL MEDALLION BACKDROP
          Soft Sage Mist (#E1E9D7) organic wash + Pure White Cream (#FAF9F7) halo
          + fine double-hairline architectural ring & botanical star accents
          ===================================================================== */}
      <circle cx="60" cy="60" r="54" fill="#FAF9F7" />
      <path
        d="M62 10C88 10 109 29 109 57C109 85 89 108 60 109C31 110 11 88 11 59C11 30 36 10 62 10Z"
        fill="#E1E9D7"
        fillOpacity="0.65"
      />
      <circle
        cx="60"
        cy="60"
        r="52"
        stroke="#5A4E38"
        strokeWidth="0.85"
        strokeOpacity="0.28"
      />
      <circle
        cx="60"
        cy="60"
        r="48.5"
        stroke="#C7B39A"
        strokeWidth="0.75"
        strokeDasharray="2 3"
        strokeOpacity="0.65"
      />
      <path
        d="M93 23L94.2 26.8L98 28L94.2 29.2L93 33L91.8 29.2L88 28L91.8 26.8L93 23Z"
        fill="#C98A6A"
        fillOpacity="0.55"
      />
      <circle cx="26" cy="91" r="1.5" fill="#40563D" fillOpacity="0.35" />

      {/* =====================================================================
          1. CURRY STEP 1: Artisanal Brass Karahi, Aromatics & Measured Spoon
          ===================================================================== */}
      {variant === 'curry-step-1' && (
        <g>
          <ellipse cx="62" cy="70" rx="29" ry="15" fill="#C7B39A" fillOpacity="0.38" />
          <ellipse cx="60" cy="60" rx="28" ry="6.5" fill="#C98A6A" fillOpacity="0.45" />
          <circle cx="52" cy="33" r="11" fill="#E9F390" fillOpacity="0.65" />

          <path
            d="M47 96C48 92 50 90 51 87C52.5 90 54 91.5 54.5 94C56.5 90 59 86 60 83C61.5 86.5 63.5 90 65.5 94C66.5 91.5 68 90 69 87C70.5 90 72 92 73 96"
            stroke="#C98A6A"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="40"
            y1="96.5"
            x2="80"
            y2="96.5"
            stroke="#5A4E38"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />

          <path
            d="M31 60C31 76.5 43.5 85 60 85C76.5 85 89 76.5 89 60"
            stroke="#5A4E38"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <ellipse
            cx="60"
            cy="60"
            rx="29"
            ry="6.5"
            fill="#FAF9F7"
            fillOpacity="0.45"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <ellipse cx="60" cy="60.5" rx="24.5" ry="4.5" fill="#C98A6A" fillOpacity="0.5" />

          <path
            d="M31 62C24 60 22 51 27 48C30 46.5 33 51 33 57"
            stroke="#5A4E38"
            strokeWidth="1.35"
            strokeLinecap="round"
          />
          <path
            d="M89 62C96 60 98 51 93 48C90 46.5 87 51 87 57"
            stroke="#5A4E38"
            strokeWidth="1.35"
            strokeLinecap="round"
          />

          <path
            d="M37 67C40 75 48 80 58 81"
            stroke="#5A4E38"
            strokeWidth="0.85"
            strokeLinecap="round"
            strokeOpacity="0.55"
          />
          <path
            d="M68 80.5C75 79 81 74.5 83.5 67.5"
            stroke="#5A4E38"
            strokeWidth="0.85"
            strokeDasharray="2 2"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />

          <ellipse
            cx="49"
            cy="59.5"
            rx="6.5"
            ry="2.8"
            fill="#FAF9F7"
            stroke="#9B6A73"
            strokeWidth="1.15"
          />
          <ellipse cx="49" cy="59.5" rx="3.2" ry="1.3" stroke="#9B6A73" strokeWidth="0.9" />
          <path
            d="M63 60.5C63 56.8 68.5 55.5 73 57.8C75 59 73.5 62 68.5 62.2C65 62.3 63 61.5 63 60.5Z"
            fill="#C98A6A"
            fillOpacity="0.75"
            stroke="#5A4E38"
            strokeWidth="1.15"
          />

          <path d="M84 21L59 34" stroke="#5A4E38" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M44 37C43 33.5 49 30.5 55.5 32C60 33 60.5 36.8 56.5 39C51.5 41.2 44.8 40 44 37Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <path
            d="M45.5 35.8C47.5 30.5 53 29.8 57 33.8C58.5 35.2 55.5 38 50 38C46.5 38 45 37 45.5 35.8Z"
            fill="#C98A6A"
            stroke="#5A4E38"
            strokeWidth="1.15"
          />

          <circle cx="52" cy="44" r="1.2" fill="#C98A6A" />
          <circle cx="55.5" cy="47.5" r="1" fill="#40563D" />
          <circle cx="49.5" cy="49" r="1.1" fill="#C98A6A" />
          <circle cx="53.5" cy="52.5" r="1.2" fill="#9B6A73" />
          <circle cx="57" cy="54.5" r="0.9" fill="#C98A6A" />
        </g>
      )}

      {/* =====================================================================
          2. CURRY STEP 2: Copper Degchi, Seared Cuts & Pouring Carafe Stream
          ===================================================================== */}
      {variant === 'curry-step-2' && (
        <g>
          <path
            d="M32 62H86L83 89C82 94 77 97 71 97H47C41 97 36 94 35 89L32 62Z"
            fill="#C7B39A"
            fillOpacity="0.35"
          />
          <circle cx="77" cy="31" r="13" fill="#E1E9D7" fillOpacity="0.85" />

          <path
            d="M30 61H84L81 88C80 93 75 96 69 96H45C39 96 34 93 33 88L30 61Z"
            fill="#FAF9F7"
            fillOpacity="0.55"
            stroke="#5A4E38"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M30 66C24 66 23 73 31 74" stroke="#5A4E38" strokeWidth="1.35" strokeLinecap="round" />
          <path d="M84 66C90 66 91 73 83 74" stroke="#5A4E38" strokeWidth="1.35" strokeLinecap="round" />

          <ellipse
            cx="57"
            cy="61"
            rx="27"
            ry="5.8"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <ellipse cx="57" cy="61.3" rx="23" ry="4" fill="#C98A6A" fillOpacity="0.55" />

          <path
            d="M39 59.5C39.5 55 45 53 50.5 55.5C54 57 53.5 61 49 62C44 63 39 61.8 39 59.5Z"
            fill="#C98A6A"
            fillOpacity="0.8"
            stroke="#5A4E38"
            strokeWidth="1.2"
          />
          <path
            d="M53 60C54 56 60 55 64 58C66 59.8 63.5 62.5 58.5 62.5C54.5 62.5 52.5 61.5 53 60Z"
            fill="#C7B39A"
            stroke="#5A4E38"
            strokeWidth="1.2"
          />

          <path
            d="M38 70L40 87C40.5 90 43.5 92 48 92"
            stroke="#5A4E38"
            strokeWidth="0.85"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />

          <g transform="rotate(-30 79 30)">
            <path
              d="M68 19H88L85.5 42C85 44.5 82.5 46 78 46C73.5 46 71 44.5 70.5 42L68 19Z"
              fill="#FAF9F7"
              fillOpacity="0.9"
              stroke="#5A4E38"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <ellipse
              cx="78"
              cy="19"
              rx="10"
              ry="2.6"
              fill="#E1E9D7"
              stroke="#5A4E38"
              strokeWidth="1.2"
            />
            <line x1="74" y1="24" x2="75" y2="41" stroke="#5A4E38" strokeWidth="0.75" strokeOpacity="0.4" />
          </g>

          <path
            d="M66 36C61.5 42 60 50 61.5 59.5C63.5 59.5 66 59.5 67 58C66 49 67.5 42 70.5 37Z"
            fill="#E1E9D7"
            fillOpacity="0.85"
            stroke="#5A4E38"
            strokeWidth="1.15"
            strokeLinejoin="round"
          />
          <circle cx="58" cy="52" r="1.2" fill="#FAF9F7" stroke="#5A4E38" strokeWidth="0.9" />
          <circle cx="71" cy="51" r="1" fill="#FAF9F7" stroke="#5A4E38" strokeWidth="0.9" />
        </g>
      )}

      {/* =====================================================================
          3. CURRY STEP 3: Covered Artisanal Handi, Fresh Coriander & Ginger
          ===================================================================== */}
      {variant === 'curry-step-3' && (
        <g>
          <path
            d="M34 58H88C94 68 93 84 81 93C74 97 68 99 61 99C54 99 48 97 41 93C29 84 28 68 34 58Z"
            fill="#C98A6A"
            fillOpacity="0.32"
          />
          <circle cx="76" cy="40" r="12" fill="#DCE7C9" fillOpacity="0.7" />

          <path
            d="M33 57H87C93 67 92 83 80 92C73 96.5 67 98 60 98C53 98 47 96.5 40 92C28 83 27 67 33 57Z"
            fill="#FAF9F7"
            fillOpacity="0.6"
            stroke="#5A4E38"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M30 52.5H90L87 57.5H33L30 52.5Z"
            fill="#C7B39A"
            fillOpacity="0.45"
            stroke="#5A4E38"
            strokeWidth="1.35"
            strokeLinejoin="round"
          />
          <path
            d="M30 73C46 77.5 74 77.5 90 73"
            stroke="#5A4E38"
            strokeWidth="0.9"
            strokeDasharray="3 2.5"
            strokeOpacity="0.55"
          />

          <g transform="rotate(-9 57 44)">
            <path
              d="M32 48C38 38.5 49 35 60 35C71 35 82 38.5 88 48H32Z"
              fill="#FAF9F7"
              stroke="#5A4E38"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
            <path d="M36 45.5C42 39 51 37 60 37" stroke="#C7B39A" strokeWidth="0.9" strokeLinecap="round" />
            <circle cx="60" cy="32" r="2.8" fill="#C98A6A" stroke="#5A4E38" strokeWidth="1.25" />
          </g>

          <g transform="translate(65, 43)">
            <path d="M0 9C4 2 12 -2 20 -4" stroke="#40563D" strokeWidth="1.35" strokeLinecap="round" />
            <path
              d="M7 3.5C5 -2 11 -5.5 14 -1.5C16.5 -5 21 -0.5 17 3.5C13.5 6 9 5 7 3.5Z"
              fill="#40563D"
              fillOpacity="0.85"
              stroke="#5A4E38"
              strokeWidth="1.1"
            />
            <path
              d="M15 -1.5C15 -6.5 21 -8 23 -4C25.5 -6.5 28 -1.5 24 1.8C20.5 3.5 16 1.8 15 -1.5Z"
              fill="#DCE7C9"
              stroke="#40563D"
              strokeWidth="1.15"
            />
          </g>
          <line x1="44" y1="50" x2="54" y2="46.5" stroke="#5A4E38" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="48" y1="51.5" x2="58" y2="48.5" stroke="#C98A6A" strokeWidth="1.3" strokeLinecap="round" />

          <path
            d="M43 31C40.5 26 45 22 42.5 17"
            stroke="#5A4E38"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
          <path
            d="M55 27C52.5 22 57 18 54.5 13"
            stroke="#5A4E38"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
        </g>
      )}

      {/* =====================================================================
          4. LENTIL STEP 1: Boil Pot with Lentils/Chickpeas & Water
          ===================================================================== */}
      {variant === 'lentil-step-1' && (
        <g>
          <path
            d="M31 58H91L87 90C86 95 81 98 74 98H48C41 98 36 95 35 90L31 58Z"
            fill="#E9F390"
            fillOpacity="0.38"
          />
          <ellipse cx="60" cy="88" rx="22" ry="6" fill="#C98A6A" fillOpacity="0.38" />

          <path
            d="M29 57H91L87 89C86 94 81 97 74 97H46C39 97 34 94 33 89L29 57Z"
            fill="#FAF9F7"
            fillOpacity="0.65"
            stroke="#5A4E38"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <rect
            x="26"
            y="52.5"
            width="68"
            height="4.8"
            rx="2.4"
            fill="#F9F5E9"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />

          <path
            d="M35 68C41 65.5 46 70.5 52 68C58 65.5 63 70.5 69 68C75 65.5 80 70 85 68"
            stroke="#5A4E38"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeOpacity="0.55"
          />
          <path
            d="M37 76C43 73.5 48 78.5 54 76C60 73.5 65 78.5 71 76C77 73.5 81 78 83 76"
            stroke="#C7B39A"
            strokeWidth="1.1"
            strokeLinecap="round"
          />

          {[
            { cx: 44, cy: 89, fill: '#C98A6A' },
            { cx: 51, cy: 91, fill: '#9B6A73' },
            { cx: 58, cy: 88.5, fill: '#C98A6A' },
            { cx: 65, cy: 91, fill: '#C7B39A' },
            { cx: 72, cy: 89, fill: '#C98A6A' },
            { cx: 48, cy: 85, fill: '#FAF9F7' },
            { cx: 61, cy: 85, fill: '#E9F390' },
            { cx: 68, cy: 85.5, fill: '#9B6A73' },
          ].map((grain, i) => (
            <ellipse
              key={i}
              cx={grain.cx}
              cy={grain.cy}
              rx="2.8"
              ry="1.7"
              fill={grain.fill}
              stroke="#5A4E38"
              strokeWidth="1"
            />
          ))}

          <path d="M84 20L60 33" stroke="#5A4E38" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M44 36C43 32.5 49 29.5 55.5 31C60 32 60.5 35.8 56.5 38C51.5 40.2 44.8 39 44 36Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <path
            d="M45.5 34.8C47.5 29.5 53 28.8 57 32.8C58.5 34.2 55.5 37 50 37C46.5 37 45 36 45.5 34.8Z"
            fill="#C98A6A"
            stroke="#5A4E38"
            strokeWidth="1.15"
          />
          <circle cx="52" cy="43" r="1.2" fill="#C98A6A" />
          <circle cx="56" cy="46.5" r="1.1" fill="#9B6A73" />
          <circle cx="50" cy="48.5" r="1" fill="#40563D" />
        </g>
      )}

      {/* =====================================================================
          5. LENTIL STEP 2: Slow-Simmered Velvety Daal with Raised Lid & Steam
          ===================================================================== */}
      {variant === 'lentil-step-2' && (
        <g>
          <path
            d="M31 59H91L86 89C85 94 80 97 73 97H49C42 97 37 94 36 89L31 59Z"
            fill="#C7B39A"
            fillOpacity="0.32"
          />
          <ellipse cx="60" cy="57" rx="28" ry="5.5" fill="#E9F390" fillOpacity="0.6" />

          <path
            d="M29 58H91L86 88C85 93 80 96 73 96H47C40 96 35 93 34 88L29 58Z"
            fill="#FAF9F7"
            fillOpacity="0.65"
            stroke="#5A4E38"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M29 64C23 64 22 71 30 72" stroke="#5A4E38" strokeWidth="1.35" strokeLinecap="round" />
          <path d="M91 64C97 64 98 71 90 72" stroke="#5A4E38" strokeWidth="1.35" strokeLinecap="round" />

          <ellipse
            cx="60"
            cy="57.5"
            rx="31"
            ry="5.5"
            fill="#C98A6A"
            fillOpacity="0.45"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <circle cx="48" cy="57" r="2.3" fill="#FAF9F7" stroke="#5A4E38" strokeWidth="1" />
          <circle cx="56" cy="58.5" r="1.7" fill="#FAF9F7" stroke="#5A4E38" strokeWidth="0.9" />
          <circle cx="67" cy="57" r="2.1" fill="#FAF9F7" stroke="#5A4E38" strokeWidth="1" />

          <g transform="translate(0, -5) rotate(-4 60 46)">
            <path
              d="M30 49C36 40.5 48 38 60 38C72 38 84 40.5 90 49H30Z"
              fill="#FAF9F7"
              stroke="#5A4E38"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
            <rect
              x="54"
              y="34"
              width="12"
              height="4"
              rx="2"
              fill="#C7B39A"
              stroke="#5A4E38"
              strokeWidth="1.2"
            />
          </g>

          <path
            d="M45 33C42.5 27.5 47 23 44.5 17"
            stroke="#5A4E38"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
          <path
            d="M60 30C57.5 24.5 62 20 59.5 14"
            stroke="#5A4E38"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
          <path
            d="M75 33C72.5 27.5 77 23 74.5 17"
            stroke="#5A4E38"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
        </g>
      )}

      {/* =====================================================================
          6. LENTIL STEP 3: Artisanal Tadka Pan with SpiceMix, Onion/Tomato & Green Chilies
          ===================================================================== */}
      {variant === 'lentil-step-3' && (
        <g>
          <ellipse cx="54" cy="84" rx="26" ry="12" fill="#E9F390" fillOpacity="0.45" />
          <circle cx="55" cy="40" r="18" fill="#DCE7C9" fillOpacity="0.65" />

          <path
            d="M27 77H81C79 91 70 98 54 98C38 98 29 91 27 77Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <ellipse
            cx="54"
            cy="77"
            rx="27"
            ry="5.2"
            fill="#C98A6A"
            fillOpacity="0.5"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />

          <g transform="rotate(16 56 41)">
            <path d="M73 36L103 23" stroke="#5A4E38" strokeWidth="2.4" strokeLinecap="round" />
            <path
              d="M35 37H75C73 49 65 54 55 54C45 54 37 49 35 37Z"
              fill="#FAF9F7"
              stroke="#5A4E38"
              strokeWidth="1.4"
            />
            <ellipse
              cx="55"
              cy="37"
              rx="20"
              ry="5"
              fill="#C98A6A"
              fillOpacity="0.6"
              stroke="#5A4E38"
              strokeWidth="1.35"
            />

            <path
              d="M45 35.5C48.5 31.5 57 31.5 61.5 35.5C57 39 49.5 39 45 35.5Z"
              fill="#40563D"
              stroke="#5A4E38"
              strokeWidth="1.15"
            />
            <path d="M61.5 35.5L66 33" stroke="#40563D" strokeWidth="1.25" strokeLinecap="round" />
          </g>

          <path d="M43 52C41 59 43.5 67 47 75" stroke="#C98A6A" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="39" cy="48" rx="1.8" ry="0.8" transform="rotate(-25 39 48)" fill="#5A4E38" />
          <ellipse cx="48" cy="59" rx="1.8" ry="0.8" transform="rotate(15 48 59)" fill="#5A4E38" />
          <ellipse cx="44" cy="66" rx="1.8" ry="0.8" transform="rotate(-12 44 66)" fill="#5A4E38" />
          <ellipse cx="52" cy="74" rx="1.8" ry="0.8" fill="#5A4E38" />
          <ellipse cx="59" cy="76" rx="1.8" ry="0.8" transform="rotate(18 59 76)" fill="#5A4E38" />
        </g>
      )}

      {/* =====================================================================
          7. RICE STEP 1: Biryani / Pulao Degchi with Aromatics & SpiceMix
          ===================================================================== */}
      {variant === 'rice-step-1' && (
        <g>
          <path
            d="M34 57H88L93 69C94 81 83 91 61 91C39 91 28 81 29 69L34 57Z"
            fill="#C7B39A"
            fillOpacity="0.35"
          />
          <circle cx="53" cy="34" r="11" fill="#E9F390" fillOpacity="0.6" />

          <path
            d="M32 56H88L93 68C94 80 83 90 60 90C37 90 26 80 27 68L32 56Z"
            fill="#FAF9F7"
            fillOpacity="0.65"
            stroke="#5A4E38"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <ellipse
            cx="60"
            cy="56"
            rx="28"
            ry="5.8"
            fill="#C98A6A"
            fillOpacity="0.5"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />

          <path
            d="M44 55.5C46.5 52 52 52 54.5 55.5"
            stroke="#9B6A73"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="60" cy="55.5" r="3.6" fill="#C98A6A" stroke="#5A4E38" strokeWidth="1.15" />
          <rect
            x="67"
            y="52"
            width="6.8"
            height="5.5"
            rx="1.6"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.15"
          />

          <path d="M83 20L60 33" stroke="#5A4E38" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M44 36C43 32.5 49 29.5 55.5 31C60 32 60.5 35.8 56.5 38C51.5 40.2 44.8 39 44 36Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <path
            d="M45.5 34.8C47.5 29.5 53 28.8 57 32.8C58.5 34.2 55.5 37 50 37C46.5 37 45 36 45.5 34.8Z"
            fill="#C98A6A"
            stroke="#5A4E38"
            strokeWidth="1.15"
          />
          <circle cx="52" cy="43.5" r="1.2" fill="#C98A6A" />
          <circle cx="56" cy="47" r="1.1" fill="#40563D" />
          <circle cx="49.5" cy="48.5" r="1.1" fill="#9B6A73" />
        </g>
      )}

      {/* =====================================================================
          8. RICE STEP 2: Ceramic Bowl Cascading Slender Basmati Rice Grains
          ===================================================================== */}
      {variant === 'rice-step-2' && (
        <g>
          <path
            d="M31 65H91L87 91C86 95 81 98 73 98H49C41 98 36 95 35 91L31 65Z"
            fill="#E1E9D7"
            fillOpacity="0.7"
          />
          <circle cx="46" cy="28" r="14" fill="#E9F390" fillOpacity="0.5" />

          <path
            d="M29 64H91L87 90C86 94 81 97 73 97H47C39 97 34 94 33 90L29 64Z"
            fill="#FAF9F7"
            fillOpacity="0.65"
            stroke="#5A4E38"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <ellipse
            cx="60"
            cy="64"
            rx="31"
            ry="5.8"
            fill="#E1E9D7"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />

          <g transform="rotate(26 45 28)">
            <path
              d="M27 20H63C61 32 54 38 45 38C36 38 29 32 27 20Z"
              fill="#FAF9F7"
              stroke="#5A4E38"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
            <path d="M29 25H61" stroke="#40563D" strokeWidth="1" strokeDasharray="2.5 2" />
            <path
              d="M29 20C34 13 56 13 61 20H29Z"
              fill="#FAF9F7"
              stroke="#5A4E38"
              strokeWidth="1.25"
            />
          </g>

          {[
            { x: 54, y: 41, rot: 14 },
            { x: 59, y: 45, rot: -12 },
            { x: 52, y: 49, rot: 18 },
            { x: 61, y: 51, rot: 6 },
            { x: 56, y: 55, rot: -14 },
            { x: 51, y: 59, rot: 10 },
            { x: 60, y: 60, rot: -8 },
            { x: 55, y: 63, rot: 16 },
          ].map((g, idx) => (
            <rect
              key={idx}
              x={g.x}
              y={g.y}
              width="2"
              height="5.5"
              rx="1"
              transform={`rotate(${g.rot} ${g.x} ${g.y})`}
              fill="#FAF9F7"
              stroke="#5A4E38"
              strokeWidth="0.95"
            />
          ))}
        </g>
      )}

      {/* =====================================================================
          9. RICE STEP 3: Cloth-Sealed Dum Degchi with Cardamom & Aroma Plumes
          ===================================================================== */}
      {variant === 'rice-step-3' && (
        <g>
          <path
            d="M32 58H90L94 71C95 83 83 92 61 92C39 92 27 83 28 71L32 58Z"
            fill="#C7B39A"
            fillOpacity="0.35"
          />
          <ellipse cx="60" cy="42" rx="26" ry="8" fill="#DCE7C9" fillOpacity="0.6" />

          <path
            d="M30 57H90L94 70C95 82 83 91 60 91C37 91 25 82 26 70L30 57Z"
            fill="#FAF9F7"
            fillOpacity="0.65"
            stroke="#5A4E38"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M27 54C27 50.5 38 49 60 49C82 49 93 50.5 93 54C93 57.5 83 58.5 60 58.5C37 58.5 27 57.5 27 54Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <path d="M38 50.5L41 57.5" stroke="#C7B39A" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M60 49V58.5" stroke="#C7B39A" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M82 50.5L79 57.5" stroke="#C7B39A" strokeWidth="1.1" strokeLinecap="round" />

          <path
            d="M33 49C38 40 48 37 60 37C72 37 82 40 87 49H33Z"
            fill="#C98A6A"
            fillOpacity="0.45"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <circle cx="60" cy="34.5" r="2.8" fill="#FAF9F7" stroke="#5A4E38" strokeWidth="1.25" />

          <path
            d="M44 31C41.5 25.5 46 21 43.5 15"
            stroke="#5A4E38"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
          <path
            d="M60 28C57.5 22.5 62 18 59.5 12"
            stroke="#5A4E38"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
          <path
            d="M76 31C73.5 25.5 78 21 75.5 15"
            stroke="#5A4E38"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
          <ellipse
            cx="33"
            cy="28"
            rx="3.5"
            ry="1.8"
            transform="rotate(-28 33 28)"
            fill="#40563D"
            stroke="#5A4E38"
            strokeWidth="1.1"
          />
          <ellipse
            cx="87"
            cy="28"
            rx="3.5"
            ry="1.8"
            transform="rotate(28 87 28)"
            fill="#40563D"
            stroke="#5A4E38"
            strokeWidth="1.1"
          />
        </g>
      )}

      {/* =====================================================================
          10. FRY & ROAST STEP 1: Scored Fillet/Cut, Citrus Wedge & Spice Rub
          ===================================================================== */}
      {variant === 'fry-roast-step-1' && (
        <g>
          <ellipse cx="61" cy="72" rx="38" ry="19" fill="#E1E9D7" fillOpacity="0.7" />
          <circle cx="46" cy="28" r="12" fill="#E9F390" fillOpacity="0.65" />

          <ellipse
            cx="60"
            cy="71"
            rx="39"
            ry="19"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.4"
          />
          <ellipse
            cx="60"
            cy="71"
            rx="33"
            ry="14"
            stroke="#C7B39A"
            strokeWidth="0.9"
            strokeDasharray="3 2"
          />

          <path
            d="M35 69.5C38.5 59.5 55 58 73 63C80.5 65.5 84.5 70.5 80 75.5C73 81.5 52 82 38.5 76C34 74.2 33.5 72 35 69.5Z"
            fill="#C98A6A"
            fillOpacity="0.55"
            stroke="#5A4E38"
            strokeWidth="1.35"
            strokeLinejoin="round"
          />
          <path d="M47 62.5L43.5 74" stroke="#5A4E38" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M58 61.5L54.5 75.5" stroke="#5A4E38" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M69 63.5L65.5 76" stroke="#5A4E38" strokeWidth="1.2" strokeLinecap="round" />

          <g transform="rotate(-16 45 29)">
            <path
              d="M31 29C31 20.5 38.5 17 48 17C57.5 17 64 21.5 64 29H31Z"
              fill="#E9F390"
              stroke="#5A4E38"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <line x1="48" y1="19" x2="48" y2="28" stroke="#5A4E38" strokeWidth="0.95" />
            <line x1="48" y1="28" x2="39" y2="22" stroke="#5A4E38" strokeWidth="0.95" />
            <line x1="48" y1="28" x2="56" y2="22" stroke="#5A4E38" strokeWidth="0.95" />
          </g>

          <path
            d="M48 39C48 39 45.5 43.2 45.5 45C45.5 46.5 46.6 47.5 48 47.5C49.4 47.5 50.5 46.5 50.5 45C50.5 43.2 48 39 48 39Z"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.15"
          />
          <circle cx="61" cy="45" r="1.3" fill="#C98A6A" />
          <circle cx="66" cy="49.5" r="1.1" fill="#40563D" />
          <circle cx="56" cy="51.5" r="1.2" fill="#C98A6A" />
        </g>
      )}

      {/* =====================================================================
          11. FRY & ROAST STEP 2: Cast-Iron Skillet with Golden Sear
          ===================================================================== */}
      {variant === 'fry-roast-step-2' && (
        <g>
          <ellipse cx="56" cy="72" rx="33" ry="14" fill="#C7B39A" fillOpacity="0.35" />
          <ellipse cx="55" cy="60" rx="22" ry="7" fill="#C98A6A" fillOpacity="0.45" />

          <path
            d="M84 63L106 53C108 52 109.5 54.5 107 56L85 67.5"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
            strokeLinecap="round"
          />
          <path
            d="M22 61H88L83 79C81 83.5 75 85.5 55 85.5C35 85.5 29 83.5 27 79L22 61Z"
            fill="#FAF9F7"
            fillOpacity="0.7"
            stroke="#5A4E38"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <ellipse
            cx="55"
            cy="61"
            rx="33"
            ry="7.5"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />

          <path
            d="M32 59.5C35.5 52 52 50.5 69 54.5C76 56.5 78.5 60.5 74 64C68 68.5 47 68.5 35.5 64C32 62.5 31 61 32 59.5Z"
            fill="#C98A6A"
            fillOpacity="0.65"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <line x1="44" y1="54" x2="40.5" y2="63" stroke="#5A4E38" strokeWidth="1.25" strokeLinecap="round" />
          <line x1="54" y1="53.5" x2="50.5" y2="64" stroke="#5A4E38" strokeWidth="1.25" strokeLinecap="round" />
          <line x1="64" y1="55" x2="60.5" y2="64" stroke="#5A4E38" strokeWidth="1.25" strokeLinecap="round" />

          <circle cx="30" cy="62" r="1.6" fill="#E9F390" stroke="#5A4E38" strokeWidth="0.95" />
          <circle cx="77" cy="62.5" r="1.6" fill="#E9F390" stroke="#5A4E38" strokeWidth="0.95" />
          <path
            d="M40 43C38 37.5 42 33 39.5 27.5"
            stroke="#5A4E38"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
          <path
            d="M55 40C53 34.5 57 30 54.5 24.5"
            stroke="#5A4E38"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
          <path
            d="M70 43C68 37.5 72 33 69.5 27.5"
            stroke="#5A4E38"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
        </g>
      )}

      {/* =====================================================================
          12. FRY & ROAST STEP 3: Serving Platter, Mint Chutney Katori & Lemon
          ===================================================================== */}
      {variant === 'fry-roast-step-3' && (
        <g>
          <ellipse cx="61" cy="70" rx="41" ry="22" fill="#DCE7C9" fillOpacity="0.55" />
          <circle cx="81" cy="56" r="9" fill="#E9F390" fillOpacity="0.65" />

          <ellipse
            cx="60"
            cy="69"
            rx="42"
            ry="22"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.4"
          />
          <ellipse
            cx="60"
            cy="69"
            rx="36"
            ry="17"
            stroke="#C7B39A"
            strokeWidth="0.9"
            strokeDasharray="3 2.5"
          />

          <path
            d="M29 68C32.5 57 50 54.5 68 59.5C76 62 78.5 68 73 73.5C66 79.5 45 80 32.5 74C29 72.5 28 70 29 68Z"
            fill="#C98A6A"
            fillOpacity="0.65"
            stroke="#5A4E38"
            strokeWidth="1.35"
          />
          <path d="M41 59.5L36.5 72.5" stroke="#5A4E38" strokeWidth="1.15" strokeLinecap="round" />
          <path d="M51 58.5L46 74.5" stroke="#5A4E38" strokeWidth="1.15" strokeLinecap="round" />
          <path d="M61 60L56 74.5" stroke="#5A4E38" strokeWidth="1.15" strokeLinecap="round" />

          <circle
            cx="81"
            cy="56"
            r="8.8"
            fill="#FAF9F7"
            stroke="#5A4E38"
            strokeWidth="1.3"
          />
          <circle
            cx="81"
            cy="56"
            r="6.2"
            fill="#40563D"
            fillOpacity="0.8"
            stroke="#5A4E38"
            strokeWidth="1"
          />

          <path
            d="M67 79.5C67 74.5 72.5 72 78.5 73C83.5 73.8 86 77 85 80.5L67 79.5Z"
            fill="#E9F390"
            stroke="#5A4E38"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="41" cy="78.5" r="2.6" fill="#40563D" stroke="#5A4E38" strokeWidth="1" />
          <circle cx="46" cy="80" r="2.2" fill="#DCE7C9" stroke="#40563D" strokeWidth="1" />
        </g>
      )}
    </svg>
  );
};
