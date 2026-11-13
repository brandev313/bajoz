/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * BAJOZ – The House of Naturals (`https://bajoz.pk/guide`)
 * Interactive SpiceMix Kitchen Recipe & Dosage Guide
 *
 * Designed to match the exact visual language, spacing, typography, color palette,
 * flat 1.5px #7A5C38 borders, WaveDivider transitions, and signature pill + circular
 * arrow CTAs of the BAJOZ homepage.
 */

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Check,
  Share2,
  Sun,
  RotateCcw,
  ArrowUpRight,
} from 'lucide-react';
import {
  RecipeStepDoodle,
  RecipeDoodleVariant,
  IngredientSpotDoodle,
  IngredientDoodleType,
} from './RecipeGuideDoodles';
import { useShop } from '../context/ShopContext';
import { WaveDivider } from './WaveDivider';

export type SpiceLevelId = 'low-moderate' | 'moderate-spicy' | 'spicy-sizzling';
export type LanguageMode = 'en' | 'ur';

export type CategoryId =
  | 'chicken'
  | 'mutton'
  | 'beef'
  | 'lentils'
  | 'vegetables'
  | 'rice'
  | 'fish-roast';

export interface SpiceLevelOption {
  id: SpiceLevelId;
  label: string;
  labelUr: string;
  shortTag: string;
  tbspAmount: string;
  tbspAmountUr: string;
  daalTbspAmount: string;
  daalTbspAmountUr: string;
  flames: number;
}

export interface IngredientItem {
  id: string;
  doodle: IngredientDoodleType;
  nameEn: string;
  nameUr: string;
  getAmountEn: (tbsp: string, daalTbsp: string) => string;
  getAmountUr: (tbspUr: string, daalTbspUr: string) => string;
  isSpiceMix?: boolean;
}

export interface StepBullet {
  en: string;
  ur: string;
}

export interface RecipeStepData {
  stepNumber: 1 | 2 | 3;
  titleEn: string;
  titleUr: string;
  timeEn: string;
  timeUr: string;
  doodleVariant: RecipeDoodleVariant;
  getBullets: (
    tbspEn: string,
    tbspUr: string,
    daalTbspEn: string,
    daalTbspUr: string
  ) => StepBullet[];
}

export interface DishOption {
  id: string;
  nameEn: string;
  nameUr: string;
  cookTime: string;
  cookTimeUr: string;
  servings: string;
  servingsUr: string;
  baseWeight: string;
  baseWeightUr: string;
  isDaalDosage?: boolean;
  oneLineSummaryEn: string;
  oneLineSummaryUr: string;
  ingredients: IngredientItem[];
  steps: [RecipeStepData, RecipeStepData, RecipeStepData];
}

export interface CategoryData {
  id: CategoryId;
  labelEn: string;
  labelUr: string;
  waterRuleEn: string;
  waterRuleUr: string;
  dishes: DishOption[];
}

export const SPICE_LEVELS: SpiceLevelOption[] = [
  {
    id: 'low-moderate',
    label: 'Low-to-Moderate Spicy',
    labelUr: 'ہلکا مصالحہ (Mild)',
    shortTag: 'Mild',
    tbspAmount: '1 to 1.5 tbsp',
    tbspAmountUr: '1 سے 1.5 کھانے کے چمچ',
    daalTbspAmount: '1 tbsp',
    daalTbspAmountUr: '1 کھانے کا چمچ',
    flames: 1,
  },
  {
    id: 'moderate-spicy',
    label: 'Moderate-to-Spicy',
    labelUr: 'روایتی مصالحہ (Signature)',
    shortTag: 'Signature',
    tbspAmount: '1.5 to 2 tbsp',
    tbspAmountUr: '1.5 سے 2 کھانے کے چمچ',
    daalTbspAmount: '1 to 1.5 tbsp',
    daalTbspAmountUr: '1 سے 1.5 کھانے کے چمچ',
    flames: 2,
  },
  {
    id: 'spicy-sizzling',
    label: 'Spicy-to-Sizzling Hot',
    labelUr: 'تیز چٹخارے دار (Sizzling)',
    shortTag: 'Hot',
    tbspAmount: '2 to 2.5 tbsp',
    tbspAmountUr: '2 سے 2.5 کھانے کے چمچ',
    daalTbspAmount: '1.5 to 2 tbsp',
    daalTbspAmountUr: '1.5 سے 2 کھانے کے چمچ',
    flames: 3,
  },
];

// ============================================================================
// STANDARD HOUSEHOLD RECIPE BUILDERS (ONE-GLANCE i, ii, iii BULLET FORMAT)
// ============================================================================

function buildStandardCurryDish(params: {
  id: string;
  nameEn: string;
  nameUr: string;
  meatOrVegEn: string;
  meatOrVegUr: string;
  baseWeightEn: string;
  baseWeightUr: string;
  cookTimeEn: string;
  cookTimeUr: string;
  oilAmountEn: string;
  oilAmountUr: string;
  baseIngs: IngredientItem[];
  step1BaseActionEn: string;
  step1BaseActionUr: string;
  waterGlassesEn: string;
  waterGlassesUr: string;
  simmerTimeEn: string;
  simmerTimeUr: string;
  step3BhunaiNoteEn?: string;
  step3BhunaiNoteUr?: string;
  oneLineSummaryEn: string;
  oneLineSummaryUr: string;
  meatDoodle?: IngredientDoodleType;
}): DishOption {
  return {
    id: params.id,
    nameEn: params.nameEn,
    nameUr: params.nameUr,
    cookTime: params.cookTimeEn,
    cookTimeUr: params.cookTimeUr,
    servings: '4–6 Servings',
    servingsUr: '4–6 افراد',
    baseWeight: params.baseWeightEn,
    baseWeightUr: params.baseWeightUr,
    oneLineSummaryEn: params.oneLineSummaryEn,
    oneLineSummaryUr: params.oneLineSummaryUr,
    ingredients: [
      {
        id: 'spicemix',
        doodle: 'spicemix-jar',
        nameEn: 'BAJOZ SpiceMix',
        nameUr: 'باجوز اسپائس مکس',
        getAmountEn: (tbsp) => tbsp,
        getAmountUr: (tbspUr) => tbspUr,
        isSpiceMix: true,
      },
      {
        id: 'main-item',
        doodle: params.meatDoodle || 'meat-cuts',
        nameEn: params.meatOrVegEn,
        nameUr: params.meatOrVegUr,
        getAmountEn: () =>
          params.baseWeightEn.split(' ')[0] +
          ' ' +
          (params.baseWeightEn.split(' ')[1] || ''),
        getAmountUr: () => params.baseWeightUr,
      },
      ...params.baseIngs,
      {
        id: 'oil',
        doodle: 'cooking-oil',
        nameEn: 'Cooking Oil / Ghee',
        nameUr: 'تیل یا گھی',
        getAmountEn: () => params.oilAmountEn,
        getAmountUr: () => params.oilAmountUr,
      },
      {
        id: 'water',
        doodle: 'water-glasses',
        nameEn: 'Water',
        nameUr: 'پانی',
        getAmountEn: () => params.waterGlassesEn,
        getAmountUr: () => params.waterGlassesUr,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prep the Base',
        titleUr: 'مصالحے کی بیس تیار کریں',
        timeEn: '6–8 mins',
        timeUr: '6–8 منٹ',
        doodleVariant: 'curry-step-1',
        getBullets: () => [
          {
            en: `Heat up ${params.oilAmountEn} oil or ghee in your cooking pot.`,
            ur: `پتیلی یا کڑاہی میں ${params.oilAmountUr} تیل یا گھی گرم کریں۔`,
          },
          {
            en: params.step1BaseActionEn,
            ur: params.step1BaseActionUr,
          },
        ],
      },
      {
        stepNumber: 2,
        titleEn: `Add SpiceMix & ${params.meatOrVegEn}`,
        titleUr: `باجوز اسپائس مکس، ${params.meatOrVegUr} اور پانی ڈالیں`,
        timeEn: '5 mins',
        timeUr: '5 منٹ',
        doodleVariant: 'curry-step-2',
        getBullets: (tbspEn, tbspUr) => [
          {
            en: `Add ${tbspEn} of BAJOZ SpiceMix (no extra ginger, garlic, salt, or dry spices needed).`,
            ur: `${tbspUr} باجوز اسپائس مکس شامل کریں (الگ ادرک، لہسن یا نمک مرچ نہ ڈالیں)۔`,
          },
          {
            en: `Add your ${params.baseWeightEn.toLowerCase()} and stir-fry for 2–3 mins.`,
            ur: `${params.baseWeightUr} ڈال کر 2 سے 3 منٹ فرائی کریں۔`,
          },
          {
            en: `Add ${params.waterGlassesEn} of water.`,
            ur: `اب اس میں ${params.waterGlassesUr} پانی شامل کریں۔`,
          },
        ],
      },
      {
        stepNumber: 3,
        titleEn: 'Simmer, Bhunai & Serve Hot',
        titleUr: 'گلائیں، بھنائی کریں اور گرما گرم پیش کریں',
        timeEn: params.simmerTimeEn,
        timeUr: params.simmerTimeUr,
        doodleVariant: 'curry-step-3',
        getBullets: () => [
          {
            en: `Let it simmer on medium-to-high flame (${params.simmerTimeEn}) until tender.`,
            ur: `درمیانی سے تیز آنچ پر (${params.simmerTimeUr}) گلنے تک پکنے دیں۔`,
          },
          {
            en:
              params.step3BhunaiNoteEn ||
              `When the water level decreases, do your magic with Bhunai until the oil separates.`,
            ur:
              params.step3BhunaiNoteUr ||
              `جب پانی کم ہو جائے تو اچھی طرح بھنائی کریں یہاں تک کہ تیل (روغن) الگ ہو جائے۔`,
          },
          {
            en: `Your dish is ready — garnish and serve hot with your loved ones!`,
            ur: `آپ کا مزیدار کھانا تیار ہے — گرما گرم اپنے پیاروں کے ساتھ پیش کریں!`,
          },
        ],
      },
    ],
  };
}

function buildStandardDaalDish(params: {
  id: string;
  nameEn: string;
  nameUr: string;
  waterGlassesEn: string;
  waterGlassesUr: string;
  cookTimeEn: string;
  cookTimeUr: string;
  simmerTimeEn: string;
  simmerTimeUr: string;
}): DishOption {
  return {
    id: params.id,
    nameEn: params.nameEn,
    nameUr: params.nameUr,
    cookTime: params.cookTimeEn,
    cookTimeUr: params.cookTimeUr,
    servings: '4 Servings',
    servingsUr: '4 افراد',
    baseWeight: `250g ${params.nameEn}`,
    baseWeightUr: `250 گرام ${params.nameUr}`,
    isDaalDosage: true,
    oneLineSummaryEn:
      'Deghchi Simmer with SpiceMix + Sizzling Onion, Green Chilli & Zeera Tadka',
    oneLineSummaryUr:
      'دیگچی میں اسپائس مکس کے ساتھ ابالیں + پیاز، ہری مرچ اور زیرے کا تڑکہ لگائیں',
    ingredients: [
      {
        id: 'spicemix',
        doodle: 'spicemix-jar',
        nameEn: 'BAJOZ SpiceMix',
        nameUr: 'باجوز اسپائس مکس',
        getAmountEn: (_tbsp, daalTbsp) => daalTbsp,
        getAmountUr: (_tbspUr, daalTbspUr) => daalTbspUr,
        isSpiceMix: true,
      },
      {
        id: 'lentils',
        doodle: 'lentils-bowl',
        nameEn: `Washed ${params.nameEn}`,
        nameUr: `دھلی ہوئی ${params.nameUr}`,
        getAmountEn: () => '250g',
        getAmountUr: () => '250 گرام',
      },
      {
        id: 'water',
        doodle: 'water-glasses',
        nameEn: 'Water',
        nameUr: 'پانی',
        getAmountEn: () => params.waterGlassesEn,
        getAmountUr: () => params.waterGlassesUr,
      },
      {
        id: 'onions',
        doodle: 'onions',
        nameEn: 'Sliced Onion (Tadka)',
        nameUr: 'باریک پیاز (تڑکہ)',
        getAmountEn: () => '1 Small',
        getAmountUr: () => '1 چھوٹی پیاز',
      },
      {
        id: 'garnish',
        doodle: 'fresh-garnish',
        nameEn: 'Green Chillies & Zeera',
        nameUr: 'ہری مرچ اور زیرہ',
        getAmountEn: () => '3 Chillies + 1 tsp Zeera',
        getAmountUr: () => '3 ہری مرچ + 1 چمچ زیرہ',
      },
      {
        id: 'oil',
        doodle: 'cooking-oil',
        nameEn: 'Desi Ghee / Oil',
        nameUr: 'دیسی گھی یا تیل',
        getAmountEn: () => '⅓ Cup (Tadka)',
        getAmountUr: () => '⅓ کپ (تڑکے کے لیے)',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Add Daal, Water & SpiceMix in Deghchi',
        titleUr: 'دیگچی میں دال، پانی اور اسپائس مکس ڈالیں',
        timeEn: '2 mins',
        timeUr: '2 منٹ',
        doodleVariant: 'lentil-step-1',
        getBullets: (_tbspEn, _tbspUr, daalTbspEn, daalTbspUr) => [
          {
            en: `Add 250g washed ${params.nameEn} into your deghchi (cooking pot).`,
            ur: `اپنی دیگچی میں 250 گرام دھلی ہوئی ${params.nameUr} ڈالیں۔`,
          },
          {
            en: `Add ${params.waterGlassesEn} of water.`,
            ur: `اس میں ${params.waterGlassesUr} پانی شامل کریں۔`,
          },
          {
            en: `Add ${daalTbspEn} of BAJOZ SpiceMix according to your spice level.`,
            ur: `اپنے ذائقے کے مطابق ${daalTbspUr} باجوز اسپائس مکس ڈالیں۔`,
          },
        ],
      },
      {
        stepNumber: 2,
        titleEn: 'Simmer Until Soft & Creamy',
        titleUr: 'دال گلنے اور گاڑھا ہونے تک پکائیں',
        timeEn: params.simmerTimeEn,
        timeUr: params.simmerTimeUr,
        doodleVariant: 'lentil-step-2',
        getBullets: () => [
          {
            en: `Let it simmer on high-to-medium flame (${params.simmerTimeEn}) until the ${params.nameEn} is completely tender and creamy.`,
            ur: `تیز سے درمیانی آنچ پر (${params.simmerTimeUr}) پکائیں یہاں تک کہ ${params.nameUr} بالکل نرم اور یکجان ہو جائے۔`,
          },
        ],
      },
      {
        stepNumber: 3,
        titleEn: 'Sizzling Tadka & Serve Hot',
        titleUr: 'پیاز، ہری مرچ اور زیرے کا تڑکہ لگائیں',
        timeEn: '5 mins',
        timeUr: '5 منٹ',
        doodleVariant: 'lentil-step-3',
        getBullets: () => [
          {
            en: `Heat ⅓ cup ghee/oil in a frying pan and do your magic with a sizzling Tadka of sliced onion, green chillies, and zeera.`,
            ur: `فرائی پین میں ⅓ کپ دیسی گھی یا تیل گرم کر کے باریک پیاز، ہری مرچ اور زیرے کا خوشبودار تڑکہ تیار کریں۔`,
          },
          {
            en: `Pour the sizzling Tadka over the Daal, serve hot, and enjoy with your loved ones!`,
            ur: `گرم تڑکہ دال پر ڈالیں اور گرما گرم اپنے پیاروں کے ساتھ پیش کریں!`,
          },
        ],
      },
    ],
  };
}

export const CATEGORIES_DATA: CategoryData[] = [
  {
    id: 'chicken',
    labelEn: 'Chicken',
    labelUr: 'چکن',
    waterRuleEn: '1 to 1.5 glasses of water',
    waterRuleUr: '1 سے 1.5 گلاس پانی',
    dishes: [
      buildStandardCurryDish({
        id: 'chicken-salan',
        nameEn: 'Chicken Salan (Homestyle Curry)',
        nameUr: 'چکن سالن (گھریلو شوربہ)',
        meatOrVegEn: 'Chicken',
        meatOrVegUr: 'چکن',
        baseWeightEn: '1 kg Chicken',
        baseWeightUr: '1 کلو چکن',
        cookTimeEn: '25–30 mins',
        cookTimeUr: '25–30 منٹ',
        oilAmountEn: '½ Cup',
        oilAmountUr: 'آدھا کپ',
        oneLineSummaryEn:
          'Everyday Pakistani household Chicken Salan with onions, tomatoes & 1–1.5 glasses water.',
        oneLineSummaryUr:
          'روزمرہ کا گھریلو چکن سالن — پیاز، ٹماٹر اور 1 سے 1.5 گلاس پانی کے ساتھ۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onions',
            nameUr: 'کٹی پیاز',
            getAmountEn: () => '2 Medium',
            getAmountUr: () => '2 درمیانی',
          },
          {
            id: 'tomatoes',
            doodle: 'tomatoes',
            nameEn: 'Chopped Tomatoes',
            nameUr: 'کٹے ٹماٹر',
            getAmountEn: () => '2 Medium',
            getAmountUr: () => '2 درمیانے',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 2 sliced onions until golden, then add 2 chopped tomatoes and fry until soft.',
        step1BaseActionUr:
          '2 کٹی پیاز سنہری کریں، پھر 2 کٹے ٹماٹر ڈال کر نرم ہونے تک فرائی کریں۔',
        waterGlassesEn: '1 to 1.5 Glasses',
        waterGlassesUr: '1 سے 1.5 گلاس',
        simmerTimeEn: '12–15 mins',
        simmerTimeUr: '12–15 منٹ',
      }),
      buildStandardCurryDish({
        id: 'chicken-karahi',
        nameEn: 'Chicken Karahi',
        nameUr: 'چکن کڑاہی',
        meatOrVegEn: 'Chicken',
        meatOrVegUr: 'چکن',
        baseWeightEn: '1 kg Chicken',
        baseWeightUr: '1 کلو چکن',
        cookTimeEn: '25 mins',
        cookTimeUr: '25 منٹ',
        oilAmountEn: '¾ Cup',
        oilAmountUr: '¾ کپ',
        oneLineSummaryEn:
          'Wok-seared Chicken Karahi with 5–6 ripe tomatoes, green chillies & high-flame Bhunai.',
        oneLineSummaryUr:
          'تازہ ٹماٹروں اور باجوز اسپائس مکس کے ساتھ تیز آنچ پر بھنی ہوئی چکن کڑاہی۔',
        baseIngs: [
          {
            id: 'tomatoes',
            doodle: 'tomatoes',
            nameEn: 'Ripe Tomatoes',
            nameUr: 'سرخ ٹماٹر',
            getAmountEn: () => '5–6 Medium (500g)',
            getAmountUr: () => '5–6 عدد (آدھا کلو)',
          },
          {
            id: 'garnish',
            doodle: 'fresh-garnish',
            nameEn: 'Green Chillies & Coriander',
            nameUr: 'ہری مرچ اور دھنیا',
            getAmountEn: () => 'For Garnish',
            getAmountUr: () => 'گارنش کے لیے',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 5–6 chopped/halved tomatoes (Karahi uses ripe tomatoes only; no onions needed).',
        step1BaseActionUr:
          '5 سے 6 ٹماٹر شامل کریں (کڑاہی میں پیاز کی ضرورت نہیں ہوتی)۔',
        waterGlassesEn: '1 Glass (or Tomato Juices)',
        waterGlassesUr: '1 گلاس پانی',
        simmerTimeEn: '10–12 mins',
        simmerTimeUr: '10–12 منٹ',
      }),
      buildStandardCurryDish({
        id: 'chicken-qorma',
        nameEn: 'Chicken Qorma',
        nameUr: 'چکن قورمہ',
        meatOrVegEn: 'Chicken',
        meatOrVegUr: 'چکن',
        baseWeightEn: '1 kg Chicken',
        baseWeightUr: '1 کلو چکن',
        cookTimeEn: '30–35 mins',
        cookTimeUr: '30–35 منٹ',
        oilAmountEn: '¾ Cup',
        oilAmountUr: '¾ کپ',
        oneLineSummaryEn:
          'Rich danedar Qorma with golden onions, whipped yogurt & 1–1.5 glasses water.',
        oneLineSummaryUr:
          'تلی ہوئی پیاز، پھینٹے ہوئے دہی اور باجوز اسپائس مکس سے تیار کردہ شاہی قورمہ۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onions',
            nameUr: 'باریک پیاز',
            getAmountEn: () => '3 Medium (Golden)',
            getAmountUr: () => '3 درمیانی پیاز',
          },
          {
            id: 'yogurt',
            doodle: 'yogurt',
            nameEn: 'Whipped Yogurt',
            nameUr: 'پھینٹا ہوا دہی',
            getAmountEn: () => '1.5 Cups',
            getAmountUr: () => '1.5 کپ دہی',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 3 sliced onions until golden-brown and whisk in 1.5 cups yogurt.',
        step1BaseActionUr:
          '3 باریک کٹی پیاز سنہری فرائی کریں اور 1.5 کپ پھینٹا ہوا دہی ملائیں۔',
        waterGlassesEn: '1 to 1.5 Glasses',
        waterGlassesUr: '1 سے 1.5 گلاس',
        simmerTimeEn: '15 mins',
        simmerTimeUr: '15 منٹ',
      }),
      buildStandardCurryDish({
        id: 'chicken-nihari',
        nameEn: 'Chicken Nihari',
        nameUr: 'چکن نہاری',
        meatOrVegEn: 'Chicken',
        meatOrVegUr: 'چکن',
        baseWeightEn: '1 kg Chicken',
        baseWeightUr: '1 کلو چکن',
        cookTimeEn: '40 mins',
        cookTimeUr: '40 منٹ',
        oilAmountEn: '¾ Cup',
        oilAmountUr: '¾ کپ',
        oneLineSummaryEn:
          'Velvety Chicken Nihari simmered with SpiceMix and thickened with wheat flour slurry.',
        oneLineSummaryUr:
          'باجوز اسپائس مکس اور آٹے کے گھول سے تیار کردہ لذیذ چکن نہاری۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onion',
            nameUr: 'باریک پیاز',
            getAmountEn: () => '1 Large',
            getAmountUr: () => '1 بڑی پیاز',
          },
          {
            id: 'slurry',
            doodle: 'flour-slurry',
            nameEn: 'Atta (Flour) Slurry',
            nameUr: 'آٹے کا گھول',
            getAmountEn: () => '3 tbsp in ½ Cup Water',
            getAmountUr: () => '3 چمچ آٹا پانی میں گھلا',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 1 sliced onion until golden-brown with ½ cup yogurt.',
        step1BaseActionUr:
          '1 باریک کٹی پیاز سنہری فرائی کریں اور آدھا کپ دہی ملائیں۔',
        waterGlassesEn: '3 to 4 Glasses (Shorba)',
        waterGlassesUr: '3 سے 4 گلاس پانی',
        simmerTimeEn: '20 mins',
        simmerTimeUr: '20 منٹ',
        step3BhunaiNoteEn:
          'Do your Bhunai until oil separates, simmer in water, then thicken with 3 tbsp wheat flour slurry.',
        step3BhunaiNoteUr:
          'بھنائی کر کے پانی میں گلائیں، پھر 3 چمچ آٹے کا گھول ملا کر گاڑھا کر لیں۔',
      }),
      buildStandardCurryDish({
        id: 'chicken-gurday-kapooray',
        nameEn: 'Gurday Kapooray',
        nameUr: 'گردے کپورے',
        meatOrVegEn: 'Gurday Kapooray',
        meatOrVegUr: 'گردے کپورے',
        baseWeightEn: '1 kg Organ Cuts',
        baseWeightUr: '1 کلو گردے کپورے',
        cookTimeEn: '25 mins',
        cookTimeUr: '25 منٹ',
        oilAmountEn: '½ Cup',
        oilAmountUr: 'آدھا کپ',
        oneLineSummaryEn:
          'Tawa-style Gurday Kapooray stir-fried with onions, tomatoes & high-heat Bhunai.',
        oneLineSummaryUr:
          'پیاز، ٹماٹر اور باجوز اسپائس مکس میں بھنے ہوئے توا گردے کپورے۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Chopped Onions',
            nameUr: 'باریک پیاز',
            getAmountEn: () => '2 Medium',
            getAmountUr: () => '2 درمیانی',
          },
          {
            id: 'tomatoes',
            doodle: 'tomatoes',
            nameEn: 'Chopped Tomatoes',
            nameUr: 'باریک ٹماٹر',
            getAmountEn: () => '3 Medium',
            getAmountUr: () => '3 درمیانے',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 2 finely chopped onions and 3 chopped tomatoes until soft.',
        step1BaseActionUr: '2 باریک پیاز اور 3 ٹماٹر نرم ہونے تک فرائی کریں۔',
        waterGlassesEn: '1 Glass',
        waterGlassesUr: '1 گلاس پانی',
        simmerTimeEn: '10–12 mins',
        simmerTimeUr: '10–12 منٹ',
      }),
    ],
  },
  {
    id: 'mutton',
    labelEn: 'Mutton',
    labelUr: 'مٹن',
    waterRuleEn: '2 to 2.5 glasses of water',
    waterRuleUr: '2 سے 2.5 گلاس پانی',
    dishes: [
      buildStandardCurryDish({
        id: 'mutton-salan',
        nameEn: 'Mutton Salan (Shorba)',
        nameUr: 'مٹن سالن (شوربہ)',
        meatOrVegEn: 'Mutton',
        meatOrVegUr: 'مٹن',
        baseWeightEn: '1 kg Mutton',
        baseWeightUr: '1 کلو مٹن',
        cookTimeEn: '45 mins',
        cookTimeUr: '45 منٹ',
        oilAmountEn: '½ Cup',
        oilAmountUr: 'آدھا کپ',
        oneLineSummaryEn:
          'Traditional household Mutton Shorba Salan with onions, tomatoes & 2–2.5 glasses water.',
        oneLineSummaryUr:
          'روایتی گھریلو مٹن شوربہ سالن — پیاز، ٹماٹر اور 2 سے 2.5 گلاس پانی کے ساتھ۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onions',
            nameUr: 'کٹی پیاز',
            getAmountEn: () => '2 Medium',
            getAmountUr: () => '2 درمیانی',
          },
          {
            id: 'tomatoes',
            doodle: 'tomatoes',
            nameEn: 'Chopped Tomatoes',
            nameUr: 'کٹے ٹماٹر',
            getAmountEn: () => '2 Medium',
            getAmountUr: () => '2 درمیانے',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 2 sliced onions until golden, then add 2 chopped tomatoes until soft.',
        step1BaseActionUr:
          '2 کٹی پیاز سنہری کریں اور 2 ٹماٹر ڈال کر نرم ہونے تک بھونیں۔',
        waterGlassesEn: '2 to 2.5 Glasses',
        waterGlassesUr: '2 سے 2.5 گلاس',
        simmerTimeEn: '30–35 mins (or 12m Pressure)',
        simmerTimeUr: '30–35 منٹ (یا ککر 12 منٹ)',
      }),
      buildStandardCurryDish({
        id: 'mutton-karahi',
        nameEn: 'Mutton Karahi',
        nameUr: 'مٹن کڑاہی',
        meatOrVegEn: 'Mutton',
        meatOrVegUr: 'مٹن',
        baseWeightEn: '1 kg Mutton',
        baseWeightUr: '1 کلو مٹن',
        cookTimeEn: '45 mins',
        cookTimeUr: '45 منٹ',
        oilAmountEn: '¾ Cup',
        oilAmountUr: '¾ کپ',
        oneLineSummaryEn:
          'Authentic Mutton Karahi simmered in 2–2.5 glasses water and finished with high-flame Bhunai.',
        oneLineSummaryUr:
          'تازہ ٹماٹروں اور باجوز اسپائس مکس میں بنی اصلی مٹن کڑاہی۔',
        baseIngs: [
          {
            id: 'tomatoes',
            doodle: 'tomatoes',
            nameEn: 'Ripe Tomatoes',
            nameUr: 'سرخ ٹماٹر',
            getAmountEn: () => '5–6 Medium (500g)',
            getAmountUr: () => '5–6 عدد (آدھا کلو)',
          },
          {
            id: 'garnish',
            doodle: 'fresh-garnish',
            nameEn: 'Green Chillies & Coriander',
            nameUr: 'ہری مرچ اور دھنیا',
            getAmountEn: () => 'For Garnish',
            getAmountUr: () => 'گارنش کے لیے',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 1 small onion (optional) and 5–6 ripe chopped tomatoes.',
        step1BaseActionUr: '5 سے 6 سرخ کٹے ٹماٹر تیل میں فرائی کریں۔',
        waterGlassesEn: '2 to 2.5 Glasses',
        waterGlassesUr: '2 سے 2.5 گلاس',
        simmerTimeEn: '30–35 mins (or 12m Pressure)',
        simmerTimeUr: '30–35 منٹ (یا ککر 12 منٹ)',
      }),
      buildStandardCurryDish({
        id: 'mutton-qorma',
        nameEn: 'Mutton Qorma',
        nameUr: 'مٹن قورمہ',
        meatOrVegEn: 'Mutton',
        meatOrVegUr: 'مٹن',
        baseWeightEn: '1 kg Mutton',
        baseWeightUr: '1 کلو مٹن',
        cookTimeEn: '50 mins',
        cookTimeUr: '50 منٹ',
        oilAmountEn: '¾ Cup',
        oilAmountUr: '¾ کپ',
        oneLineSummaryEn:
          'Royal danedar Mutton Qorma with golden onions, yogurt & 2–2.5 glasses water.',
        oneLineSummaryUr:
          'تلی پیاز، دہی اور باجوز اسپائس مکس سے تیار کردہ شاہی مٹن قورمہ۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onions',
            nameUr: 'باریک پیاز',
            getAmountEn: () => '3 Medium (Golden)',
            getAmountUr: () => '3 درمیانی پیاز',
          },
          {
            id: 'yogurt',
            doodle: 'yogurt',
            nameEn: 'Whipped Yogurt',
            nameUr: 'پھینٹا ہوا دہی',
            getAmountEn: () => '1.5 Cups',
            getAmountUr: () => '1.5 کپ دہی',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 3 sliced onions until golden-brown and add 1.5 cups whipped yogurt.',
        step1BaseActionUr:
          '3 باریک پیاز سنہری کریں اور 1.5 کپ پھینٹا ہوا دہی شامل کریں۔',
        waterGlassesEn: '2 to 2.5 Glasses',
        waterGlassesUr: '2 سے 2.5 گلاس',
        simmerTimeEn: '35 mins (or 12m Pressure)',
        simmerTimeUr: '35 منٹ (یا ککر 12 منٹ)',
      }),
      buildStandardCurryDish({
        id: 'mutton-paya',
        nameEn: 'Mutton Paya',
        nameUr: 'مٹن پائے',
        meatOrVegEn: 'Mutton Trotters (Paya)',
        meatOrVegUr: 'مٹن پائے',
        baseWeightEn: '4–6 Mutton Paya',
        baseWeightUr: '4–6 عدد مٹن پائے',
        cookTimeEn: '2.5 hrs (or 40m Pressure)',
        cookTimeUr: '2.5 گھنٹے (یا ککر 40 منٹ)',
        oilAmountEn: '½ Cup',
        oilAmountUr: 'آدھا کپ',
        oneLineSummaryEn:
          'Slow-simmered Mutton Paya with onions, tomatoes/yogurt & rich Bhunai.',
        oneLineSummaryUr:
          'باجوز اسپائس مکس میں بھنے اور دھیمی آنچ پر پکے ہوئے لذیذ مٹن پائے۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onions',
            nameUr: 'کٹی پیاز',
            getAmountEn: () => '2 Medium',
            getAmountUr: () => '2 درمیانی پیاز',
          },
          {
            id: 'yogurt',
            doodle: 'yogurt',
            nameEn: 'Yogurt / Tomatoes',
            nameUr: 'دہی یا ٹماٹر',
            getAmountEn: () => '½ Cup Yogurt',
            getAmountUr: () => 'آدھا کپ دہی',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 2 sliced onions until golden with ½ cup yogurt.',
        step1BaseActionUr:
          '2 کٹی پیاز سنہری کریں اور آدھا کپ دہی ملا کر بھونیں۔',
        waterGlassesEn: '6 to 8 Glasses (For Broth)',
        waterGlassesUr: '6 سے 8 گلاس پانی',
        simmerTimeEn: '40m Pressure / 2.5h Slow',
        simmerTimeUr: '40 منٹ ککر / ڈھائی گھنٹے',
      }),
      buildStandardCurryDish({
        id: 'mutton-nihari',
        nameEn: 'Mutton Nihari',
        nameUr: 'مٹن نہاری',
        meatOrVegEn: 'Mutton Shank',
        meatOrVegUr: 'مٹن بونگ/نلی',
        baseWeightEn: '1 kg Mutton Shank',
        baseWeightUr: '1 کلو مٹن بونگ',
        cookTimeEn: '1.5 hrs (or 30m Pressure)',
        cookTimeUr: 'ڈیڑھ گھنٹہ (یا ککر 30 منٹ)',
        oilAmountEn: '¾ Cup',
        oilAmountUr: '¾ کپ',
        oneLineSummaryEn:
          'Slow-cooked Mutton Nihari finished with Bhunai and wheat flour slurry.',
        oneLineSummaryUr:
          'باجوز اسپائس مکس اور آٹے کے گھول سے تیار کردہ ریشے دار مٹن نہاری۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onion',
            nameUr: 'باریک پیاز',
            getAmountEn: () => '1 Large',
            getAmountUr: () => '1 بڑی پیاز',
          },
          {
            id: 'slurry',
            doodle: 'flour-slurry',
            nameEn: 'Atta Slurry',
            nameUr: 'آٹے کا گھول',
            getAmountEn: () => '4 tbsp in 1 Cup Water',
            getAmountUr: () => '4 چمچ آٹا پانی میں',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 1 sliced onion until golden with ½ cup yogurt.',
        step1BaseActionUr: '1 کٹی پیاز سنہری کریں اور آدھا کپ دہی ملائیں۔',
        waterGlassesEn: '5 to 6 Glasses',
        waterGlassesUr: '5 سے 6 گلاس پانی',
        simmerTimeEn: '30m Pressure / 1.5h Slow',
        simmerTimeUr: '30 منٹ ککر / ڈیڑھ گھنٹہ',
        step3BhunaiNoteEn:
          'Do your Bhunai so red oil (tari) separates, simmer until tender, and thicken with 4 tbsp flour slurry.',
        step3BhunaiNoteUr:
          'اچھی طرح بھنائی کر کے گوشت گلائیں اور آخر میں 4 چمچ آٹے کا گھول ملا کر گاڑھا کر لیں۔',
      }),
    ],
  },
  {
    id: 'beef',
    labelEn: 'Beef',
    labelUr: 'بیف',
    waterRuleEn: '2 to 2.5 glasses of water',
    waterRuleUr: '2 سے 2.5 گلاس پانی',
    dishes: [
      buildStandardCurryDish({
        id: 'beef-nihari',
        nameEn: 'Beef Nihari',
        nameUr: 'بیف نہاری',
        meatOrVegEn: 'Beef Bong',
        meatOrVegUr: 'بیف بونگ',
        baseWeightEn: '1 kg Beef Bong',
        baseWeightUr: '1 کلو بیف بونگ',
        cookTimeEn: '35m Pressure / 2h Slow',
        cookTimeUr: '35 منٹ ککر / 2 گھنٹے',
        oilAmountEn: '1 Cup',
        oilAmountUr: '1 کپ گھی/تیل',
        oneLineSummaryEn:
          'Old-city Beef Bong Nihari seared with SpiceMix and thickened with wheat flour slurry.',
        oneLineSummaryUr:
          'باجوز اسپائس مکس اور آٹے کے گھول سے تیار کردہ لاہوری و کراچی بیف نہاری۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onion',
            nameUr: 'باریک پیاز',
            getAmountEn: () => '1 Large',
            getAmountUr: () => '1 بڑی پیاز',
          },
          {
            id: 'slurry',
            doodle: 'flour-slurry',
            nameEn: 'Atta Slurry',
            nameUr: 'آٹے کا گھول',
            getAmountEn: () => '4 tbsp in 1 Cup Water',
            getAmountUr: () => '4 چمچ آٹا پانی میں',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 1 sliced onion until golden with ½ cup whipped yogurt.',
        step1BaseActionUr: '1 کٹی پیاز سنہری کریں اور آدھا کپ دہی ملائیں۔',
        waterGlassesEn: '6 Glasses',
        waterGlassesUr: '6 گلاس پانی',
        simmerTimeEn: '35m Pressure / 2h Slow',
        simmerTimeUr: '35 منٹ ککر / 2 گھنٹے',
        step3BhunaiNoteEn:
          'Do your Bhunai so red oil (tari) separates, simmer until tender, and thicken with 4 tbsp flour slurry.',
        step3BhunaiNoteUr:
          'بھنائی کر کے گوشت گلائیں اور آخر میں 4 چمچ آٹے کا گھول ملا کر گاڑھا کر لیں۔',
      }),
      buildStandardCurryDish({
        id: 'beef-qorma',
        nameEn: 'Beef Qorma',
        nameUr: 'بیف قورمہ',
        meatOrVegEn: 'Beef',
        meatOrVegUr: 'بیف',
        baseWeightEn: '1 kg Beef',
        baseWeightUr: '1 کلو بیف',
        cookTimeEn: '50 mins',
        cookTimeUr: '50 منٹ',
        oilAmountEn: '¾ Cup',
        oilAmountUr: '¾ کپ',
        oneLineSummaryEn:
          'Aromatic danedar Beef Qorma with golden onions, yogurt & 2–2.5 glasses water.',
        oneLineSummaryUr:
          'تلی پیاز، دہی اور 2 سے 2.5 گلاس پانی کے ساتھ تیار کردہ دانے دار بیف قورمہ۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onions',
            nameUr: 'باریک پیاز',
            getAmountEn: () => '3 Medium (Golden)',
            getAmountUr: () => '3 درمیانی پیاز',
          },
          {
            id: 'yogurt',
            doodle: 'yogurt',
            nameEn: 'Whipped Yogurt',
            nameUr: 'پھینٹا ہوا دہی',
            getAmountEn: () => '1.5 Cups',
            getAmountUr: () => '1.5 کپ دہی',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 3 sliced onions until golden-brown and add 1.5 cups whipped yogurt.',
        step1BaseActionUr:
          '3 باریک پیاز سنہری کریں اور 1.5 کپ دہی شامل کریں۔',
        waterGlassesEn: '2 to 2.5 Glasses',
        waterGlassesUr: '2 سے 2.5 گلاس',
        simmerTimeEn: '40 mins (or 15m Pressure)',
        simmerTimeUr: '40 منٹ (یا ککر 15 منٹ)',
      }),
      buildStandardCurryDish({
        id: 'beef-karahi',
        nameEn: 'Beef Karahi',
        nameUr: 'بیف کڑاہی',
        meatOrVegEn: 'Beef',
        meatOrVegUr: 'بیف',
        baseWeightEn: '1 kg Beef',
        baseWeightUr: '1 کلو بیف',
        cookTimeEn: '50 mins',
        cookTimeUr: '50 منٹ',
        oilAmountEn: '¾ Cup',
        oilAmountUr: '¾ کپ',
        oneLineSummaryEn:
          'Tender Beef Karahi cooked with 2–2.5 glasses water and high-flame tomato Bhunai.',
        oneLineSummaryUr:
          'ٹماٹروں، 2 سے 2.5 گلاس پانی اور باجوز اسپائس مکس میں بھنی ہوئی بیف کڑاہی۔',
        baseIngs: [
          {
            id: 'tomatoes',
            doodle: 'tomatoes',
            nameEn: 'Ripe Tomatoes',
            nameUr: 'سرخ ٹماٹر',
            getAmountEn: () => '5–6 Medium (500g)',
            getAmountUr: () => '5–6 عدد (آدھا کلو)',
          },
          {
            id: 'garnish',
            doodle: 'fresh-garnish',
            nameEn: 'Green Chillies & Coriander',
            nameUr: 'ہری مرچ اور دھنیا',
            getAmountEn: () => 'For Garnish',
            getAmountUr: () => 'گارنش کے لیے',
          },
        ],
        step1BaseActionEn: 'Stir-fry 5–6 ripe chopped tomatoes in hot oil.',
        step1BaseActionUr: '5 سے 6 کٹے ہوئے ٹماٹر تیل میں فرائی کریں۔',
        waterGlassesEn: '2 to 2.5 Glasses',
        waterGlassesUr: '2 سے 2.5 گلاس',
        simmerTimeEn: '35–40 mins (or 15m Pressure)',
        simmerTimeUr: '35–40 منٹ (یا ککر 15 منٹ)',
      }),
      buildStandardCurryDish({
        id: 'beef-paya',
        nameEn: 'Beef Paya',
        nameUr: 'بیف پائے',
        meatOrVegEn: 'Beef Paya',
        meatOrVegUr: 'بیف پائے',
        baseWeightEn: '1 Large Beef Paya',
        baseWeightUr: '1 بڑا بیف پایا',
        cookTimeEn: '50m Pressure / 3.5h Slow',
        cookTimeUr: '50 منٹ ککر / ساڑھے 3 گھنٹے',
        oilAmountEn: '½ Cup',
        oilAmountUr: 'آدھا کپ',
        oneLineSummaryEn:
          'Rich, gelatinous Beef Paya seared with onions, SpiceMix & slow-simmered broth.',
        oneLineSummaryUr:
          'پیاز اور باجوز اسپائس مکس میں بھنے ہوئے لذیذ لاہوری بیف پائے۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onions',
            nameUr: 'کٹی پیاز',
            getAmountEn: () => '2 Medium',
            getAmountUr: () => '2 درمیانی پیاز',
          },
          {
            id: 'yogurt',
            doodle: 'yogurt',
            nameEn: 'Whipped Yogurt',
            nameUr: 'پھینٹا دہی',
            getAmountEn: () => '½ Cup',
            getAmountUr: () => 'آدھا کپ دہی',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 2 sliced onions until golden with ½ cup whipped yogurt.',
        step1BaseActionUr: '2 کٹی پیاز سنہری کریں اور آدھا کپ دہی شامل کریں۔',
        waterGlassesEn: '8 Glasses (For Broth)',
        waterGlassesUr: '8 گلاس پانی',
        simmerTimeEn: '50m Pressure / 3.5h Slow',
        simmerTimeUr: '50 منٹ ککر / ساڑھے 3 گھنٹے',
      }),
    ],
  },
  {
    id: 'lentils',
    labelEn: 'Lentils (Daal)',
    labelUr: 'دالیں',
    waterRuleEn: '2 to 4 glasses of water',
    waterRuleUr: '2 سے 4 گلاس پانی',
    dishes: [
      buildStandardDaalDish({
        id: 'moong-daal',
        nameEn: 'Moong Daal',
        nameUr: 'مونگ دال',
        waterGlassesEn: '2.5 to 3 Glasses',
        waterGlassesUr: '2.5 سے 3 گلاس',
        cookTimeEn: '20–25 mins',
        cookTimeUr: '20–25 منٹ',
        simmerTimeEn: '15 mins',
        simmerTimeUr: '15 منٹ',
      }),
      buildStandardDaalDish({
        id: 'masoor-daal',
        nameEn: 'Masoor Daal',
        nameUr: 'مسور دال',
        waterGlassesEn: '2.5 to 3 Glasses',
        waterGlassesUr: '2.5 سے 3 گلاس',
        cookTimeEn: '20–25 mins',
        cookTimeUr: '20–25 منٹ',
        simmerTimeEn: '15 mins',
        simmerTimeUr: '15 منٹ',
      }),
      buildStandardDaalDish({
        id: 'chana-daal',
        nameEn: 'Chana Daal',
        nameUr: 'چنا دال',
        waterGlassesEn: '3 to 4 Glasses',
        waterGlassesUr: '3 سے 4 گلاس',
        cookTimeEn: '30–35 mins',
        cookTimeUr: '30–35 منٹ',
        simmerTimeEn: '25 mins (or 8m Pressure)',
        simmerTimeUr: '25 منٹ (یا ککر 8 منٹ)',
      }),
      buildStandardDaalDish({
        id: 'kalay-masar',
        nameEn: 'Kalay Masar',
        nameUr: 'کالے مسر',
        waterGlassesEn: '3.5 to 4 Glasses',
        waterGlassesUr: '3.5 سے 4 گلاس',
        cookTimeEn: '35 mins',
        cookTimeUr: '35 منٹ',
        simmerTimeEn: '25 mins (or 10m Pressure)',
        simmerTimeUr: '25 منٹ (یا ککر 10 منٹ)',
      }),
      buildStandardDaalDish({
        id: 'white-chana',
        nameEn: 'White Chana',
        nameUr: 'سفید چنے',
        waterGlassesEn: '3.5 to 4 Glasses',
        waterGlassesUr: '3.5 سے 4 گلاس',
        cookTimeEn: '35–40 mins',
        cookTimeUr: '35–40 منٹ',
        simmerTimeEn: '30m (or 15m Pressure)',
        simmerTimeUr: '30 منٹ (یا ککر 15 منٹ)',
      }),
      buildStandardDaalDish({
        id: 'black-chana',
        nameEn: 'Black Chana',
        nameUr: 'کالے چنے',
        waterGlassesEn: '3.5 to 4 Glasses',
        waterGlassesUr: '3.5 سے 4 گلاس',
        cookTimeEn: '35–40 mins',
        cookTimeUr: '35–40 منٹ',
        simmerTimeEn: '30m (or 15m Pressure)',
        simmerTimeUr: '30 منٹ (یا ککر 15 منٹ)',
      }),
      buildStandardDaalDish({
        id: 'raaj-maa',
        nameEn: 'Raaj Maa (Kidney Beans)',
        nameUr: 'راجماں (سرخ لوبیا)',
        waterGlassesEn: '3.5 to 4 Glasses',
        waterGlassesUr: '3.5 سے 4 گلاس',
        cookTimeEn: '35–40 mins',
        cookTimeUr: '35–40 منٹ',
        simmerTimeEn: '30m (or 15m Pressure)',
        simmerTimeUr: '30 منٹ (یا ککر 15 منٹ)',
      }),
    ],
  },
  {
    id: 'vegetables',
    labelEn: 'Vegetables (Sabzi)',
    labelUr: 'سبزیاں',
    waterRuleEn: '1 to 1.5 glasses of water',
    waterRuleUr: '1 سے 1.5 گلاس پانی',
    dishes: [
      buildStandardCurryDish({
        id: 'mix-sabzi',
        nameEn: 'Mix Sabzi / Aloo Matar Gajar',
        nameUr: 'مکس سبزی / آلو مٹر گاجر',
        meatOrVegEn: 'Fresh Vegetables',
        meatOrVegUr: 'مکس سبزی',
        baseWeightEn: '500g–1kg Vegetables',
        baseWeightUr: 'آدھا سے 1 کلو سبزی',
        cookTimeEn: '20–25 mins',
        cookTimeUr: '20–25 منٹ',
        oilAmountEn: '½ Cup',
        oilAmountUr: 'آدھا کپ',
        meatDoodle: 'fresh-garnish',
        oneLineSummaryEn:
          'Everyday household Sabzi with onions, tomatoes, BAJOZ SpiceMix & 1–1.5 glasses water.',
        oneLineSummaryUr:
          'پیاز، ٹماٹر، باجوز اسپائس مکس اور 1 سے 1.5 گلاس پانی میں تیار کردہ گھریلو سبزی۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onion',
            nameUr: 'کٹی پیاز',
            getAmountEn: () => '1 Medium',
            getAmountUr: () => '1 درمیانی',
          },
          {
            id: 'tomatoes',
            doodle: 'tomatoes',
            nameEn: 'Chopped Tomatoes',
            nameUr: 'کٹے ٹماٹر',
            getAmountEn: () => '2 Medium',
            getAmountUr: () => '2 درمیانے',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 1 sliced onion and 2 chopped tomatoes until soft.',
        step1BaseActionUr: '1 کٹی پیاز اور 2 کٹے ٹماٹر نرم ہونے تک فرائی کریں۔',
        waterGlassesEn: '1 to 1.5 Glasses',
        waterGlassesUr: '1 سے 1.5 گلاس',
        simmerTimeEn: '12–15 mins',
        simmerTimeUr: '12–15 منٹ',
      }),
      buildStandardCurryDish({
        id: 'aloo-shorba',
        nameEn: 'Aloo Palak / Aloo Gobhi',
        nameUr: 'آلو پالک / آلو گوبھی',
        meatOrVegEn: 'Cut Vegetables',
        meatOrVegUr: 'کٹی سبزی',
        baseWeightEn: '750g Vegetables',
        baseWeightUr: '750 گرام سبزی',
        cookTimeEn: '25 mins',
        cookTimeUr: '25 منٹ',
        oilAmountEn: '½ Cup',
        oilAmountUr: 'آدھا کپ',
        meatDoodle: 'fresh-garnish',
        oneLineSummaryEn:
          'Homestyle Aloo Gobhi or Aloo Palak with BAJOZ SpiceMix and fragrant Bhunai.',
        oneLineSummaryUr:
          'باجوز اسپائس مکس میں بھنی ہوئی مزیدار آلو گوبھی یا آلو پالک۔',
        baseIngs: [
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onion',
            nameUr: 'کٹی پیاز',
            getAmountEn: () => '1 Medium',
            getAmountUr: () => '1 درمیانی',
          },
          {
            id: 'tomatoes',
            doodle: 'tomatoes',
            nameEn: 'Chopped Tomatoes',
            nameUr: 'کٹے ٹماٹر',
            getAmountEn: () => '2 Medium',
            getAmountUr: () => '2 درمیانے',
          },
        ],
        step1BaseActionEn:
          'Stir-fry 1 sliced onion until golden, then add 2 chopped tomatoes.',
        step1BaseActionUr: '1 پیاز سنہری کریں اور 2 کٹے ٹماٹر شامل کریں۔',
        waterGlassesEn: '1 to 1.5 Glasses',
        waterGlassesUr: '1 سے 1.5 گلاس',
        simmerTimeEn: '12–15 mins',
        simmerTimeUr: '12–15 منٹ',
      }),
    ],
  },
  {
    id: 'rice',
    labelEn: 'Rice',
    labelUr: 'چاول / بریانی',
    waterRuleEn: '1–2.5 glasses for meat + ¾ boiled rice',
    waterRuleUr: 'گوشت کے مطابق پانی + ¾ ابلے چاول',
    dishes: [
      {
        id: 'biryani',
        nameEn: 'Chicken / Meat Biryani',
        nameUr: 'دم بریانی',
        cookTime: '45 mins',
        cookTimeUr: '45 منٹ',
        servings: '6 Servings',
        servingsUr: '6 افراد',
        baseWeight: '750g Rice + 750g Meat',
        baseWeightUr: '750 گرام چاول + 750 گرام گوشت',
        oneLineSummaryEn:
          'Prep onion-tomato-yogurt base, cook meat with SpiceMix, layer ¾ boiled rice & steam (Dum).',
        oneLineSummaryUr:
          'پیاز ٹماٹر دہی کی بیس بنائیں، اسپائس مکس میں گوشت بھونیں اور ¾ ابلے چاولوں کی تہہ لگا کر دم دیں۔',
        ingredients: [
          {
            id: 'spicemix',
            doodle: 'spicemix-jar',
            nameEn: 'BAJOZ SpiceMix',
            nameUr: 'باجوز اسپائس مکس',
            getAmountEn: (tbsp) => tbsp,
            getAmountUr: (tbspUr) => tbspUr,
            isSpiceMix: true,
          },
          {
            id: 'rice',
            doodle: 'basmati-rice',
            nameEn: '¾ Boiled Basmati Rice',
            nameUr: '¾ ابلے باسمتی چاول',
            getAmountEn: () => '750g',
            getAmountUr: () => '750 گرام',
          },
          {
            id: 'meat',
            doodle: 'meat-cuts',
            nameEn: 'Chicken / Meat',
            nameUr: 'چکن یا گوشت',
            getAmountEn: () => '750g–1 kg',
            getAmountUr: () => '750 گرام–1 کلو',
          },
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onions',
            nameUr: 'کٹی پیاز',
            getAmountEn: () => '3 Medium',
            getAmountUr: () => '3 درمیانی',
          },
          {
            id: 'tomatoes',
            doodle: 'tomatoes',
            nameEn: 'Tomatoes + Yogurt',
            nameUr: 'ٹماٹر + دہی',
            getAmountEn: () => '3 Med + 1 Cup Yogurt',
            getAmountUr: () => '3 ٹماٹر + 1 کپ دہی',
          },
          {
            id: 'garnish',
            doodle: 'fresh-garnish',
            nameEn: 'Mint & Coriander',
            nameUr: 'پودینہ اور ہرا دھنیا',
            getAmountEn: () => '½ Bunch',
            getAmountUr: () => 'آدھی گٹھی',
          },
        ],
        steps: [
          {
            stepNumber: 1,
            titleEn: 'Prep the Base',
            titleUr: 'مصالحے کی بیس تیار کریں',
            timeEn: '8 mins',
            timeUr: '8 منٹ',
            doodleVariant: 'rice-step-1',
            getBullets: () => [
              {
                en: 'Heat ¾ cup oil in a pot.',
                ur: 'پتیلی میں ¾ کپ تیل گرم کریں۔',
              },
              {
                en: 'Stir-fry 3 sliced onions until golden, then add 3 chopped tomatoes and 1 cup yogurt.',
                ur: '3 کٹی پیاز سنہری کریں، پھر 3 ٹماٹر اور 1 کپ دہی شامل کریں۔',
              },
            ],
          },
          {
            stepNumber: 2,
            titleEn: 'Add SpiceMix, Meat & Water',
            titleUr: 'اسپائس مکس، گوشت اور پانی ڈالیں',
            timeEn: '15–20 mins',
            timeUr: '15–20 منٹ',
            doodleVariant: 'rice-step-2',
            getBullets: (tbspEn, tbspUr) => [
              {
                en: `Add ${tbspEn} of BAJOZ SpiceMix according to your spice level.`,
                ur: `اپنے ذائقے کے مطابق ${tbspUr} باجوز اسپائس مکس ڈالیں۔`,
              },
              {
                en: 'Add your Chicken/Meat with 1 glass water (Chicken) or 2 glasses water (Mutton/Beef).',
                ur: 'چکن کے لیے 1 گلاس یا مٹن/بیف کے لیے 2 گلاس پانی ڈال کر گوشت گلائیں۔',
              },
            ],
          },
          {
            stepNumber: 3,
            titleEn: 'Bhunai, Layer Rice & Steam (Dum)',
            titleUr: 'بھنائی کریں، چاولوں کی تہہ لگائیں اور دم دیں',
            timeEn: '10 mins',
            timeUr: '10 منٹ',
            doodleVariant: 'rice-step-3',
            getBullets: () => [
              {
                en: 'When water decreases, do your Bhunai until oil separates.',
                ur: 'پانی کم ہونے پر اچھی طرح بھنائی کریں یہاں تک کہ تیل الگ ہو جائے۔',
              },
              {
                en: 'Layer ¾ boiled Basmati rice, mint & coriander on top, steam (Dum) 10 mins, and serve hot!',
                ur: 'اوپر ¾ ابلے چاول، پودینہ اور ہرا دھنیا کی تہہ لگا کر 10 منٹ دم دیں اور گرما گرم پیش کریں!',
              },
            ],
          },
        ],
      },
      {
        id: 'masala-rice',
        nameEn: 'Masala Rice / Pulao',
        nameUr: 'مصالحہ رائس / پلاؤ',
        cookTime: '35 mins',
        cookTimeUr: '35 منٹ',
        servings: '5–6 Servings',
        servingsUr: '5–6 افراد',
        baseWeight: '750g Rice + 500g Meat/Veg',
        baseWeightUr: '750 گرام چاول + آدھا کلو گوشت/سبزی',
        oneLineSummaryEn:
          'One-pot aromatic Masala Rice / Pulao with onions, tomatoes, BAJOZ SpiceMix & Basmati rice.',
        oneLineSummaryUr:
          'پیاز، ٹماٹر اور باجوز اسپائس مکس سے تیار کردہ خوشبودار مصالحہ پلاؤ۔',
        ingredients: [
          {
            id: 'spicemix',
            doodle: 'spicemix-jar',
            nameEn: 'BAJOZ SpiceMix',
            nameUr: 'باجوز اسپائس مکس',
            getAmountEn: (tbsp) => tbsp,
            getAmountUr: (tbspUr) => tbspUr,
            isSpiceMix: true,
          },
          {
            id: 'rice',
            doodle: 'basmati-rice',
            nameEn: 'Soaked Basmati Rice',
            nameUr: 'بھیگے باسمتی چاول',
            getAmountEn: () => '750g',
            getAmountUr: () => '750 گرام',
          },
          {
            id: 'meat',
            doodle: 'meat-cuts',
            nameEn: 'Meat or Potatoes',
            nameUr: 'گوشت یا آلو',
            getAmountEn: () => '500g',
            getAmountUr: () => 'آدھا کلو',
          },
          {
            id: 'onions',
            doodle: 'onions',
            nameEn: 'Sliced Onions',
            nameUr: 'کٹی پیاز',
            getAmountEn: () => '2 Large',
            getAmountUr: () => '2 بڑی پیاز',
          },
          {
            id: 'tomatoes',
            doodle: 'tomatoes',
            nameEn: 'Chopped Tomatoes',
            nameUr: 'کٹے ٹماٹر',
            getAmountEn: () => '2 Medium',
            getAmountUr: () => '2 درمیانے',
          },
          {
            id: 'oil',
            doodle: 'cooking-oil',
            nameEn: 'Cooking Oil',
            nameUr: 'تیل',
            getAmountEn: () => '½ Cup',
            getAmountUr: () => 'آدھا کپ',
          },
        ],
        steps: [
          {
            stepNumber: 1,
            titleEn: 'Prep the Base',
            titleUr: 'پیاز اور ٹماٹر کی بیس تیار کریں',
            timeEn: '6–8 mins',
            timeUr: '6–8 منٹ',
            doodleVariant: 'rice-step-1',
            getBullets: () => [
              {
                en: 'Heat ½ cup oil in your pot.',
                ur: 'پتیلی میں آدھا کپ تیل گرم کریں۔',
              },
              {
                en: 'Stir-fry 2 sliced onions until golden-brown, then stir-fry 2 chopped tomatoes.',
                ur: '2 پیاز سنہری کریں اور 2 کٹے ٹماٹر ڈال کر فرائی کریں۔',
              },
            ],
          },
          {
            stepNumber: 2,
            titleEn: 'Add SpiceMix, Meat/Veg & Water',
            titleUr: 'اسپائس مکس، گوشت/سبزی اور پانی ڈالیں',
            timeEn: '12 mins',
            timeUr: '12 منٹ',
            doodleVariant: 'rice-step-2',
            getBullets: (tbspEn, tbspUr) => [
              {
                en: `Add ${tbspEn} of BAJOZ SpiceMix and 500g meat or potatoes; do quick Bhunai.`,
                ur: `${tbspUr} باجوز اسپائس مکس اور گوشت/آلو ڈال کر بھنائی کریں۔`,
              },
              {
                en: 'Add water (1.5 glasses for Chicken/Potatoes, 2.5 glasses for Mutton/Beef) and cook until tender.',
                ur: '1.5 سے 2.5 گلاس پانی ڈال کر گلنے تک پکائیں۔',
              },
            ],
          },
          {
            stepNumber: 3,
            titleEn: 'Simmer Rice, Dum & Serve Hot',
            titleUr: 'چاول ڈال کر پکائیں اور دم دے کر پیش کریں',
            timeEn: '15 mins',
            timeUr: '15 منٹ',
            doodleVariant: 'rice-step-3',
            getBullets: () => [
              {
                en: 'Add 750g soaked Basmati rice (with 3–4 glasses broth/water) and cook on medium-high flame until water absorbs.',
                ur: '750 گرام بھیگے چاول شامل کریں اور پانی خشک ہونے تک درمیانی تیز آنچ پر پکائیں۔',
              },
              {
                en: 'Cover on low flame (Dum) for 10 mins, fluff gently, and serve hot with your loved ones!',
                ur: 'ہلکی آنچ پر 10 منٹ دم دیں اور گرما گرم اپنے پیاروں کے ساتھ پیش کریں!',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'fish-roast',
    labelEn: 'Fish & Roast',
    labelUr: 'مچھلی اور روسٹ',
    waterRuleEn: 'Direct Marinade with Lemon & Oil',
    waterRuleUr: 'لیموں اور تیل کے ساتھ براہِ راست میرینیشن',
    dishes: [
      {
        id: 'crispy-fish-fry',
        nameEn: 'Crispy Fish Fry',
        nameUr: 'کرسپی فش فرائی',
        cookTime: '20 mins',
        cookTimeUr: '20 منٹ',
        servings: '4–5 Servings',
        servingsUr: '4–5 افراد',
        baseWeight: '1 kg Fish Fillets',
        baseWeightUr: '1 کلو مچھلی',
        oneLineSummaryEn:
          'Rub 1 kg Fish with BAJOZ SpiceMix, lemon juice & 1 tbsp oil — marinate and shallow fry.',
        oneLineSummaryUr:
          '1 کلو مچھلی پر باجوز اسپائس مکس، لیموں اور 1 چمچ تیل لگا کر فرائی کریں۔',
        ingredients: [
          {
            id: 'spicemix',
            doodle: 'spicemix-jar',
            nameEn: 'BAJOZ SpiceMix',
            nameUr: 'باجوز اسپائس مکس',
            getAmountEn: (tbsp) => tbsp,
            getAmountUr: (tbspUr) => tbspUr,
            isSpiceMix: true,
          },
          {
            id: 'fish',
            doodle: 'fish-fillets',
            nameEn: 'Fish Fillets',
            nameUr: 'مچھلی کے قتلے',
            getAmountEn: () => '1 kg (Dry)',
            getAmountUr: () => '1 کلو',
          },
          {
            id: 'garnish',
            doodle: 'fresh-garnish',
            nameEn: 'Lemon Juice',
            nameUr: 'لیموں کا رس',
            getAmountEn: () => '2 to 3 tbsp',
            getAmountUr: () => '2 سے 3 چمچ',
          },
          {
            id: 'oil',
            doodle: 'cooking-oil',
            nameEn: 'Cooking Oil',
            nameUr: 'پکانے کا تیل',
            getAmountEn: () => '1 tbsp + Frying',
            getAmountUr: () => '1 چمچ + تلنے کے لیے',
          },
        ],
        steps: [
          {
            stepNumber: 1,
            titleEn: 'Prep the Marinade Base',
            titleUr: 'میرینیشن تیار کریں',
            timeEn: '3 mins',
            timeUr: '3 منٹ',
            doodleVariant: 'fry-roast-step-1',
            getBullets: (tbspEn, tbspUr) => [
              {
                en: `Mix ${tbspEn} of BAJOZ SpiceMix with 2–3 tbsp fresh lemon juice and 1 tbsp oil.`,
                ur: `${tbspUr} باجوز اسپائس مکس میں 2 سے 3 چمچ لیموں کا رس اور 1 چمچ تیل ملائیں۔`,
              },
            ],
          },
          {
            stepNumber: 2,
            titleEn: 'Coat Fish & Rest',
            titleUr: 'مچھلی پر مصالحہ لگائیں',
            timeEn: '1–2 hrs',
            timeUr: '1–2 گھنٹے',
            doodleVariant: 'fry-roast-step-2',
            getBullets: () => [
              {
                en: 'Rub the SpiceMix marinade evenly over 1 kg dry fish fillets and rest for 1–2 hours.',
                ur: '1 کلو خشک مچھلی کے قتلوں پر مصالحہ اچھی طرح لگا کر 1 سے 2 گھنٹے رکھیں۔',
              },
            ],
          },
          {
            stepNumber: 3,
            titleEn: 'Shallow Fry & Serve Hot',
            titleUr: 'سنہری فرائی کریں اور پیش کریں',
            timeEn: '8–10 mins',
            timeUr: '8–10 منٹ',
            doodleVariant: 'fry-roast-step-3',
            getBullets: () => [
              {
                en: 'Shallow-fry on medium-high flame for 4–5 mins per side until crisp and golden.',
                ur: 'درمیانی آنچ پر دونوں طرف سے 4 سے 5 منٹ سنہری اور خستہ ہونے تک تلیں۔',
              },
              {
                en: 'Your Crispy Fish Fry is ready — serve hot and enjoy with your loved ones!',
                ur: 'آپ کی کرسپی فش فرائی تیار ہے — گرما گرم اپنے پیاروں کے ساتھ پیش کریں!',
              },
            ],
          },
        ],
      },
      {
        id: 'chargha-roast',
        nameEn: 'Chargha / Chicken Roast',
        nameUr: 'لاہوری چرغہ / چکن روسٹ',
        cookTime: '25–30 mins',
        cookTimeUr: '25–30 منٹ',
        servings: '4–5 Servings',
        servingsUr: '4–5 افراد',
        baseWeight: '1 kg Whole Chicken / Cuts',
        baseWeightUr: '1 کلو سالم چکن یا پیس',
        oneLineSummaryEn:
          'Rub scored Chicken with BAJOZ SpiceMix, lemon, yogurt & oil — steam-fry or bake at 180°C.',
        oneLineSummaryUr:
          'کٹ لگے چکن پر باجوز اسپائس مکس، لیموں اور دہی لگا کر اسٹیم فرائی یا بیک کریں۔',
        ingredients: [
          {
            id: 'spicemix',
            doodle: 'spicemix-jar',
            nameEn: 'BAJOZ SpiceMix',
            nameUr: 'باجوز اسپائس مکس',
            getAmountEn: (tbsp) => tbsp,
            getAmountUr: (tbspUr) => tbspUr,
            isSpiceMix: true,
          },
          {
            id: 'meat',
            doodle: 'meat-cuts',
            nameEn: 'Scored Chicken',
            nameUr: 'کٹ لگا چکن',
            getAmountEn: () => '1 kg',
            getAmountUr: () => '1 کلو',
          },
          {
            id: 'yogurt',
            doodle: 'yogurt',
            nameEn: 'Thick Yogurt',
            nameUr: 'گاڑھا دہی',
            getAmountEn: () => '2 tbsp',
            getAmountUr: () => '2 چمچ',
          },
          {
            id: 'garnish',
            doodle: 'fresh-garnish',
            nameEn: 'Lemon Juice + Oil',
            nameUr: 'لیموں کا رس + تیل',
            getAmountEn: () => '2 tbsp + 1 tbsp Oil',
            getAmountUr: () => '2 چمچ لیموں + 1 چمچ تیل',
          },
        ],
        steps: [
          {
            stepNumber: 1,
            titleEn: 'Prep the Marinade Base',
            titleUr: 'روسٹ میرینیشن تیار کریں',
            timeEn: '5 mins',
            timeUr: '5 منٹ',
            doodleVariant: 'fry-roast-step-1',
            getBullets: (tbspEn, tbspUr) => [
              {
                en: `Whisk ${tbspEn} of BAJOZ SpiceMix with 2 tbsp lemon juice, 2 tbsp thick yogurt, and 1 tbsp oil.`,
                ur: `${tbspUr} باجوز اسپائس مکس میں 2 چمچ لیموں کا رس، 2 چمچ گاڑھا دہی اور 1 چمچ تیل ملائیں۔`,
              },
            ],
          },
          {
            stepNumber: 2,
            titleEn: 'Rub Chicken & Marinate',
            titleUr: 'چکن پر مصالحہ لگا کر میرینیٹ کریں',
            timeEn: '1–2 hrs',
            timeUr: '1–2 گھنٹے',
            doodleVariant: 'fry-roast-step-2',
            getBullets: () => [
              {
                en: 'Make deep cuts on 1 kg chicken, massage the SpiceMix marinade inside every cut, and rest 1–2 hours.',
                ur: '1 کلو چکن پر گہرے کٹ لگا کر مصالحہ اچھی طرح مساج کریں اور 1 سے 2 گھنٹے رکھیں۔',
              },
            ],
          },
          {
            stepNumber: 3,
            titleEn: 'Roast / Steam-Fry & Serve Hot',
            titleUr: 'روسٹ یا اسٹیم فرائی کریں اور پیش کریں',
            timeEn: '25–30 mins',
            timeUr: '25–30 منٹ',
            doodleVariant: 'fry-roast-step-3',
            getBullets: () => [
              {
                en: 'Bake/air-fry at 180°C for 25–30 mins (or cover & steam in a pan with ½ glass water for 20 mins, then pan-sear until golden).',
                ur: '180°C پر 25–30 منٹ بیک کریں (یا پتیلی میں آدھا گلاس پانی ڈال کر 20 منٹ اسٹیم دیں اور سنہری فرائی کر لیں)۔',
              },
              {
                en: 'Your Roast is ready — serve hot and enjoy with your loved ones!',
                ur: 'آپ کا گرما گرم چرغہ روسٹ تیار ہے — اپنے پیاروں کے ساتھ پیش کریں!',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const RecipeGuidePage: React.FC = () => {
  const [selectedSpiceId, setSelectedSpiceId] = useState<SpiceLevelId>('moderate-spicy');
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>('chicken');
  const [selectedDishId, setSelectedDishId] = useState<string>('chicken-salan');
  const [lang, setLang] = useState<LanguageMode>('en');
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [shareCopied, setShareCopied] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);

  const {
    products,
    addToCart,
    setActivePageSlug,
    setActiveProductId,
    setIsCheckoutOpen,
  } = useShop();

  const activeSpice =
    SPICE_LEVELS.find((s) => s.id === selectedSpiceId) || SPICE_LEVELS[1];
  const activeCategory =
    CATEGORIES_DATA.find((c) => c.id === selectedCategoryId) || CATEGORIES_DATA[0];
  const activeDish =
    activeCategory.dishes.find((d) => d.id === selectedDishId) ||
    activeCategory.dishes[0];

  const isUr = lang === 'ur';

  const activeTbsp = activeDish.isDaalDosage
    ? isUr
      ? activeSpice.daalTbspAmountUr
      : activeSpice.daalTbspAmount
    : isUr
      ? activeSpice.tbspAmountUr
      : activeSpice.tbspAmount;

  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  useEffect(() => {
    setCompletedSteps({});
  }, [selectedCategoryId, selectedDishId, selectedSpiceId]);

  const handleCategoryChange = (catId: CategoryId) => {
    setSelectedCategoryId(catId);
    const cat = CATEGORIES_DATA.find((c) => c.id === catId);
    if (cat && cat.dishes.length > 0) {
      setSelectedDishId(cat.dishes[0].id);
    }
  };

  const toggleStepComplete = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const handleShareGuide = async () => {
    const shareUrl = `${window.location.origin}/guide`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BAJOZ SpiceMix – ${activeDish.nameEn}`,
          text: `Cook ${activeDish.nameEn} in 3 easy steps with BAJOZ SpiceMix!`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const toggleKitchenWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        if (!wakeLockActive) {
          await (
            navigator as unknown as {
              wakeLock: { request: (t: string) => Promise<unknown> };
            }
          ).wakeLock.request('screen');
          setWakeLockActive(true);
        } else {
          setWakeLockActive(false);
        }
      } catch {
        setWakeLockActive(!wakeLockActive);
      }
    } else {
      setWakeLockActive(!wakeLockActive);
    }
  };

  const handleOrderSpiceMixNow = () => {
    const spiceMixProduct =
      products.find((p) => p.id === 'spicemix') || products[0];
    if (spiceMixProduct) {
      const defaultPack = spiceMixProduct.packSizes?.[0]?.id || 'default';
      addToCart(spiceMixProduct, 'default', defaultPack, 1);
      setIsCheckoutOpen(true);
    } else {
      setActivePageSlug(null);
      setActiveProductId('spicemix');
    }
  };

  const handleViewAllProducts = () => {
    setActiveProductId(null);
    setActivePageSlug('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      dir={isUr ? 'rtl' : 'ltr'}
      className="min-h-screen w-full bg-[#F5EBC8] text-[#2C221E] font-sans selection:bg-[#E9F399] selection:text-[#4A2E1B] overflow-x-hidden"
    >
      {/* ===================================================================
          1. HERO & SPICE LEVEL DOSAGE SECTION (#F5EBC8 Heritage Cream — Matches Homepage Hero)
         =================================================================== */}
      <section className="relative pt-6 pb-10 sm:pt-8 sm:pb-14 lg:pb-16 bg-[#F5EBC8]">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-6 sm:space-y-8">
          {/* Top Utility Bar: Eyebrow Pill + Language Switch + Keep Screen On */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-[#E9F399] border-[1.5px] border-[#7A5C38] text-xs sm:text-sm font-extrabold text-[#40563D] tracking-tight">
              {isUr
                ? 'باجوز اسپائس مکس — جار کیو آر کچن گائیڈ'
                : "Pakistan's 1st All-in-One Cooking Paste · Jar QR Guide"}
            </div>

            <div className="flex items-center gap-2">
              <div
                className="inline-flex items-center bg-[#F9F5E9] border-[1.5px] border-[#7A5C38] rounded-full p-0.5"
                role="group"
                aria-label="Language switch"
              >
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-3.5 py-1 rounded-full text-xs sm:text-sm font-serif font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    lang === 'en'
                      ? 'bg-[#40563D] text-[#F9F5E9]'
                      : 'text-[#4A2E1B] hover:bg-[#E9F399]'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang('ur')}
                  className={`px-3.5 py-1 rounded-full text-xs sm:text-sm font-serif font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    lang === 'ur'
                      ? 'bg-[#40563D] text-[#F9F5E9]'
                      : 'text-[#4A2E1B] hover:bg-[#E9F399]'
                  }`}
                >
                  اردو
                </button>
              </div>

              <button
                type="button"
                onClick={toggleKitchenWakeLock}
                aria-pressed={wakeLockActive}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-serif font-bold border-[1.5px] border-[#7A5C38] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  wakeLockActive
                    ? 'bg-[#E9F399] text-[#40563D]'
                    : 'bg-[#F9F5E9] text-[#2C221E] hover:bg-[#E9F399]'
                }`}
              >
                <Sun className="w-4 h-4 text-[#40563D] shrink-0" />
                <span className="hidden sm:inline">
                  {wakeLockActive
                    ? isUr
                      ? 'اسکرین آن ہے'
                      : 'Screen On'
                    : isUr
                      ? 'اسکرین آن رکھیں'
                      : 'Keep Screen On'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleShareGuide}
                aria-label="Share recipe"
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-serif font-bold bg-[#F9F5E9] hover:bg-[#E9F399] text-[#2C221E] border-[1.5px] border-[#7A5C38] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Share2 className="w-4 h-4 text-[#40563D] shrink-0" />
                <span className="hidden md:inline">
                  {shareCopied ? (isUr ? 'کاپی ہو گیا' : 'Copied') : isUr ? 'شیئر' : 'Share'}
                </span>
              </button>
            </div>
          </div>

          {/* Centered Kicker, Display Heading & Formula Subheading — Matches FeaturedProducts.tsx */}
          <div className="text-center max-w-5xl mx-auto space-y-2.5 sm:space-y-3">
            <p className="bajoz-script-kicker text-xl sm:text-2xl lg:text-3xl text-[#40563D]">
              {isUr
                ? 'باجوز — دی ہاؤس آف نیچرلز'
                : 'One SpiceMix Jar Makes All Pakistani Dishes'}
            </p>
            <h1 className="bajoz-poster-display text-3xl sm:text-5xl lg:text-6xl text-[#4A2E1B]">
              {isUr ? 'اسپائس مکس کچن ریسیپی گائیڈ' : 'SPICEMIX RECIPE GUIDE'}
            </h1>
            <p className="font-serif italic text-base sm:text-xl lg:text-2xl font-semibold text-[#40563D]">
              {isUr
                ? 'تمام بنیادی مصالحے + گرم مصالحہ + تازہ ادرک + لہسن = باجوز اسپائس مکس'
                : 'All Basic Spices + Garam Masala + Ginger + Garlic = SPICEMIX'}
            </p>
          </div>

          {/* SPICE LEVEL SELECTOR + CLEAN FLAT BAJOZ SPICEMIX QUANTITY CARD (NO RETRO OFFSET BORDERS) */}
          <div className="max-w-5xl mx-auto space-y-4">
            {/* 3 Spice Level Cards */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
              role="radiogroup"
              aria-label="Select spice level"
            >
              {SPICE_LEVELS.map((level) => {
                const isSelected = level.id === selectedSpiceId;
                const displayTbsp = activeDish.isDaalDosage
                  ? isUr
                    ? level.daalTbspAmountUr
                    : level.daalTbspAmount
                  : isUr
                    ? level.tbspAmountUr
                    : level.tbspAmount;

                return (
                  <button
                    key={level.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedSpiceId(level.id)}
                    className={`rounded-[1.5rem] p-4 sm:p-5 text-left transition-colors border-[1.5px] border-[#7A5C38] cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#40563D] text-[#F9F5E9]'
                        : 'bg-[#F9F5E9] text-[#2C221E] hover:bg-[#E9F399]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif font-bold text-sm sm:text-base leading-tight">
                        {isUr ? level.labelUr : level.label}
                      </span>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: level.flames }).map((_, idx) => (
                          <Flame
                            key={idx}
                            className={`w-4 h-4 ${
                              isSelected
                                ? 'text-[#E9F399] fill-[#E9F399]'
                                : 'text-[#C98A6A] fill-[#C98A6A]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div
                      className={`mt-2 font-serif font-extrabold text-base sm:text-lg tabular-nums ${
                        isSelected ? 'text-[#E9F399]' : 'text-[#40563D]'
                      }`}
                    >
                      {displayTbsp}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Clean Flat BAJOZ SpiceMix Required Quantity Card (Zero Retro Offset Borders) */}
            <div
              aria-live="polite"
              className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-[#FFFDF9] border border-[#7A5C38]/40 flex items-center justify-center shrink-0">
                  <IngredientSpotDoodle type="spicemix-jar" className="w-11 h-11" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-[#5A4E38] font-semibold">
                    {isUr
                      ? `${activeDish.nameUr} (${activeDish.baseWeightUr}) کے لیے باجوز اسپائس مکس کی مقدار:`
                      : `BAJOZ SpiceMix Required for ${activeDish.baseWeight}:`}
                  </p>
                  <p className="font-serif font-extrabold text-xl sm:text-2xl text-[#40563D] tabular-nums leading-tight mt-0.5">
                    {activeTbsp}{' '}
                    <span className="text-xs sm:text-sm font-medium text-[#5A4E38]">
                      ({isUr ? activeSpice.labelUr : activeSpice.label})
                    </span>
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#E9F399] border-[1.5px] border-[#7A5C38] text-xs sm:text-sm font-extrabold text-[#40563D] shrink-0">
                {isUr ? 'پانی کا تناسب: ' : 'Water Ratio: '}
                <span className="ml-1">
                  {isUr ? activeCategory.waterRuleUr : activeCategory.waterRuleEn}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seamless Wave Transition from #F5EBC8 into #F9F5E9 Recipe Section */}
      <WaveDivider fromColor="#F5EBC8" toColor="#F9F5E9" compact />

      {/* ===================================================================
          2. INTERACTIVE RECIPE GUIDE SECTION (#F9F5E9 Soft Ivory — Matches SpiceMix Showcase)
         =================================================================== */}
      <section className="py-8 sm:py-14 lg:py-18 bg-[#F9F5E9]">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-6 sm:space-y-8">
          {/* Category & Dish Selector Bar */}
          <div className="max-w-5xl mx-auto space-y-3">
            {/* 7 Category Pills */}
            <div
              className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
              role="tablist"
              aria-label="Select category"
            >
              {CATEGORIES_DATA.map((cat) => {
                const isActive = cat.id === selectedCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-5 py-2.5 rounded-full font-serif font-bold text-sm sm:text-base transition-colors border-[1.5px] border-[#7A5C38] cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#40563D] text-[#F9F5E9]'
                        : 'bg-[#FFFDF9] text-[#2C221E] hover:bg-[#E9F399]'
                    }`}
                  >
                    {isUr ? cat.labelUr : cat.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Dish Sub-Selector Pills */}
            <div
              className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
              role="tablist"
              aria-label="Select dish"
            >
              {activeCategory.dishes.map((dish) => {
                const isDishActive = dish.id === activeDish.id;
                return (
                  <button
                    key={dish.id}
                    type="button"
                    role="tab"
                    aria-selected={isDishActive}
                    onClick={() => setSelectedDishId(dish.id)}
                    className={`px-4 py-2 rounded-full font-serif font-bold text-xs sm:text-sm transition-colors border-[1.5px] border-[#7A5C38] cursor-pointer whitespace-nowrap shrink-0 ${
                      isDishActive
                        ? 'bg-[#E9F399] text-[#40563D] font-extrabold'
                        : 'bg-[#F5EBC8]/70 text-[#2C221E] hover:bg-[#E9F399]'
                    }`}
                  >
                    {isUr ? dish.nameUr : dish.nameEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE RECIPE CARD (Clean Flat 1.5px #7A5C38 Border — Matches Homepage Feature Boxes) */}
          <article className="max-w-5xl mx-auto rounded-[2rem] border-[1.5px] border-[#7A5C38] bg-[#FFFDF9] overflow-hidden">
            {/* Dish Title & Metadata Header */}
            <div className="px-5 py-5 sm:px-8 sm:py-6 bg-[#F5EBC8]/55 border-b-[1.5px] border-[#7A5C38]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="bajoz-poster-display text-2xl sm:text-4xl text-[#4A2E1B]">
                  {isUr ? activeDish.nameUr : activeDish.nameEn}
                </h2>
                <p className="mt-1 text-sm sm:text-base text-[#2C221E] font-medium">
                  {isUr ? activeDish.oneLineSummaryUr : activeDish.oneLineSummaryEn}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-serif font-bold text-[#40563D] tabular-nums shrink-0">
                <span>{isUr ? activeDish.baseWeightUr : activeDish.baseWeight}</span>
                <span aria-hidden="true">·</span>
                <span>{isUr ? activeDish.cookTimeUr : activeDish.cookTime}</span>
                <span aria-hidden="true">·</span>
                <span>{isUr ? activeDish.servingsUr : activeDish.servings}</span>
              </div>
            </div>

            {/* Symmetrical Ingredient Visual Grid */}
            <div className="p-5 sm:p-8 border-b-[1.5px] border-[#7A5C38]/25">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h3 className="font-serif font-extrabold text-base sm:text-lg text-[#40563D]">
                  {isUr ? 'مطلوبہ اجزاء (Ingredients):' : 'Ingredients You Need:'}
                </h3>
                <span className="text-xs sm:text-sm text-[#5A4E38] font-semibold">
                  {isUr
                    ? 'ادرک، لہسن، نمک یا خشک مصالحے الگ سے نہ ڈالیں'
                    : 'No extra ginger, garlic, salt, or dry spices needed'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {activeDish.ingredients.map((ing) => {
                  const amount = isUr
                    ? ing.getAmountUr(activeSpice.tbspAmountUr, activeSpice.daalTbspAmountUr)
                    : ing.getAmountEn(activeSpice.tbspAmount, activeSpice.daalTbspAmount);

                  return (
                    <div
                      key={ing.id}
                      className={`rounded-[1.25rem] p-3 sm:p-4 flex flex-col items-center text-center justify-between border-[1.5px] border-[#7A5C38] ${
                        ing.isSpiceMix ? 'bg-[#E9F399]/55' : 'bg-[#F9F5E9]'
                      }`}
                    >
                      <IngredientSpotDoodle
                        type={ing.doodle}
                        className="w-12 h-12 sm:w-14 sm:h-14"
                      />
                      <div className="mt-2 w-full">
                        <div className="font-serif font-bold text-xs sm:text-sm text-[#4A2E1B] leading-tight line-clamp-1">
                          {isUr ? ing.nameUr : ing.nameEn}
                        </div>
                        <div
                          className={`mt-0.5 text-xs sm:text-sm font-extrabold tabular-nums leading-tight ${
                            ing.isSpiceMix ? 'text-[#40563D]' : 'text-[#5A4E38]'
                          }`}
                        >
                          {amount}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-Step One-Glance Kitchen Workflow */}
            <div className="p-5 sm:p-8 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-extrabold text-base sm:text-lg text-[#40563D]">
                    {isUr
                      ? 'پکانے کے 3 آسان مراحل (مکمل ہونے پر ٹیپ کریں):'
                      : '3 Easy Cooking Steps (Tap Any Step to Mark Done):'}
                  </h3>
                  <span className="text-xs sm:text-sm font-serif font-bold text-[#4A2E1B] tabular-nums">
                    ({completedCount}/3)
                  </span>
                </div>

                {completedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setCompletedSteps({})}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-serif font-bold text-[#5A4E38] hover:text-[#40563D] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isUr ? 'ری سیٹ' : 'Reset'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                {activeDish.steps.map((step) => {
                  const isDone = !!completedSteps[step.stepNumber];
                  const bullets = step.getBullets(
                    activeSpice.tbspAmount,
                    activeSpice.tbspAmountUr,
                    activeSpice.daalTbspAmount,
                    activeSpice.daalTbspAmountUr
                  );

                  return (
                    <div
                      key={step.stepNumber}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleStepComplete(step.stepNumber)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleStepComplete(step.stepNumber);
                        }
                      }}
                      className={`rounded-[1.5rem] p-5 border-[1.5px] border-[#7A5C38] transition-colors cursor-pointer flex flex-col justify-between ${
                        isDone ? 'bg-[#DCE7C9]/65' : 'bg-[#F9F5E9] hover:bg-[#F5EBC8]/60'
                      }`}
                    >
                      <div className="space-y-3.5">
                        {/* Step Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-7 h-7 rounded-full bg-[#40563D] text-[#F9F5E9] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                              {step.stepNumber}
                            </span>
                            <div className="min-w-0">
                              <h4
                                className={`font-serif font-extrabold text-base sm:text-lg text-[#4A2E1B] leading-tight truncate ${
                                  isDone ? 'line-through opacity-75' : ''
                                }`}
                              >
                                {isUr ? step.titleUr : step.titleEn}
                              </h4>
                              <span className="text-xs font-serif font-semibold text-[#40563D] tabular-nums">
                                {isUr ? step.timeUr : step.timeEn}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center border border-[#7A5C38] transition-colors shrink-0 ${
                              isDone
                                ? 'bg-[#E9F399] text-[#40563D]'
                                : 'bg-[#FFFDF9] text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </span>
                        </div>

                        {/* Step Illustration */}
                        <div className="w-full h-28 rounded-2xl bg-[#FFFDF9] border border-[#7A5C38]/35 flex items-center justify-center">
                          <RecipeStepDoodle
                            variant={step.doodleVariant}
                            className="w-24 h-24"
                          />
                        </div>

                        {/* Bullets Styled Like FeaturedProducts.tsx Check List */}
                        <ul className="space-y-2.5 pt-1">
                          {bullets.map((b, idx) => (
                            <li
                              key={idx}
                              className={`flex items-start gap-2.5 text-sm sm:text-base font-medium leading-relaxed text-[#2C221E] ${
                                isDone ? 'opacity-70' : ''
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-serif font-extrabold">
                                {idx + 1}
                              </span>
                              <span>{isUr ? b.ur : b.en}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Seamless Wave Transition from #F9F5E9 into #FFFDF9 Section */}
      <WaveDivider fromColor="#F9F5E9" toColor="#FFFDF9" flip compact />

      {/* ===================================================================
          3. HOUSEHOLD WATER FORMULA & HOMEPAGE-STYLE CTA SECTION (#FFFDF9 Pure White Cream)
         =================================================================== */}
      <section className="py-10 sm:py-16 bg-[#FFFDF9]">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="max-w-5xl mx-auto rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="bajoz-script-kicker text-xl sm:text-2xl text-[#40563D]">
                  {isUr ? 'باجوز کچن فارمولا' : 'Quick Kitchen Reference'}
                </p>
                <h2 className="bajoz-poster-display text-2xl sm:text-3xl text-[#4A2E1B]">
                  {isUr
                    ? 'پانی اور باجوز اسپائس مکس کا گھریلو تناسب'
                    : 'Standard Household Water & SpiceMix Ratio'}
                </h2>
              </div>
              <span className="text-xs sm:text-sm font-serif italic font-semibold text-[#40563D]">
                {isUr
                  ? 'ہمیشہ صاف اور خشک چمچ استعمال کریں'
                  : 'Always scoop with a clean, dry spoon'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border-[1.5px] border-[#7A5C38] bg-[#FFFDF9] p-3.5 sm:p-4">
                <div className="font-serif font-bold text-xs sm:text-sm text-[#40563D]">
                  {isUr ? 'چکن (1 کلو)' : 'Chicken (1 kg)'}
                </div>
                <div className="font-serif font-extrabold text-sm sm:text-base text-[#4A2E1B] mt-1 tabular-nums">
                  {isUr ? '1 سے 1.5 گلاس پانی' : '1–1.5 Glasses Water'}
                </div>
              </div>

              <div className="rounded-2xl border-[1.5px] border-[#7A5C38] bg-[#FFFDF9] p-3.5 sm:p-4">
                <div className="font-serif font-bold text-xs sm:text-sm text-[#40563D]">
                  {isUr ? 'مٹن / بیف (1 کلو)' : 'Mutton / Beef (1 kg)'}
                </div>
                <div className="font-serif font-extrabold text-sm sm:text-base text-[#4A2E1B] mt-1 tabular-nums">
                  {isUr ? '2 سے 2.5 گلاس پانی' : '2–2.5 Glasses Water'}
                </div>
              </div>

              <div className="rounded-2xl border-[1.5px] border-[#7A5C38] bg-[#FFFDF9] p-3.5 sm:p-4">
                <div className="font-serif font-bold text-xs sm:text-sm text-[#40563D]">
                  {isUr ? 'سبزیاں (Sabzi)' : 'Vegetables (Sabzi)'}
                </div>
                <div className="font-serif font-extrabold text-sm sm:text-base text-[#4A2E1B] mt-1 tabular-nums">
                  {isUr ? '1 سے 1.5 گلاس پانی' : '1–1.5 Glasses Water'}
                </div>
              </div>

              <div className="rounded-2xl border-[1.5px] border-[#7A5C38] bg-[#FFFDF9] p-3.5 sm:p-4">
                <div className="font-serif font-bold text-xs sm:text-sm text-[#40563D]">
                  {isUr ? 'دالیں (250 گرام)' : 'Daal (250g)'}
                </div>
                <div className="font-serif font-extrabold text-sm sm:text-base text-[#4A2E1B] mt-1 tabular-nums">
                  {isUr ? '2 سے 4 گلاس پانی' : '2–4 Glasses Water'}
                </div>
              </div>
            </div>

            {/* Homepage Signature CTA Buttons: Order Now Pill + Circular Arrow | View All Products */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#7A5C38]/25">
              <p className="text-sm sm:text-base font-semibold text-[#2C221E]">
                {isUr
                  ? 'کیا آپ کا باجوز اسپائس مکس جار ختم ہونے والا ہے؟ تازہ جار ابھی آرڈر کریں۔'
                  : 'Running low on your BAJOZ SpiceMix jar? Order a fresh homemade jar now.'}
              </p>

              <div className="flex flex-wrap items-center gap-3.5">
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleOrderSpiceMixNow}
                    className="px-7 sm:px-9 py-3.5 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base sm:text-lg font-extrabold tracking-tight transition-colors duration-150 cursor-pointer whitespace-nowrap"
                  >
                    {isUr ? 'نیا جار آرڈر کریں' : 'Order SpiceMix Now'}
                  </button>
                  <button
                    type="button"
                    onClick={handleOrderSpiceMixNow}
                    aria-label="Order SpiceMix Now"
                    className="w-12 h-12 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-transform duration-150 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleViewAllProducts}
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full bg-[#FFFDF9] hover:bg-[#E9F399]/60 text-[#2C221E] border-[1.5px] border-[#7A5C38] font-serif text-base sm:text-lg font-bold tracking-tight transition-colors duration-150 cursor-pointer whitespace-nowrap"
                >
                  <span>{isUr ? 'تمام مصنوعات دیکھیں' : 'View All Products'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#FFFDF9" toColor="#F5EBC8" compact />
    </div>
  );
};

export default RecipeGuidePage;
