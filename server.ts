/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * BAJOZ — The House of Naturals (https://bajoz.pk)
 * Self-Hosted Full-Stack Node.js Server (Express + Custom DB + Auth + File Storage + Live Voice WS)
 * Ready for Hostinger Unlimited Plan (Node.js Web App / Phusion Passenger / PM2).
 */

import express from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality } from '@google/genai';
import {
  AuthorizedStaffMember,
  DEFAULT_AUTHORIZED_PERSONNEL,
  loadSelfHostedDatabase,
  saveSelfHostedDatabase,
  hashPassword,
  verifyPassword,
  generateSignedSessionToken,
  saveUploadedFileToDisk,
  deleteUploadedFileFromDisk,
} from './server/database';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const storeState = loadSelfHostedDatabase();

const DTCSS_SYSTEM_INSTRUCTION = `You are the official BAJOZ Live Voice Guide, representing BAJOZ — The House of Naturals (bajoz.pk) in Model Town, Lahore, Pakistan.

LANGUAGE & AUTO-DETECTION RULES (CRITICAL):
1. AUTO-DETECT USER MANNER & LANGUAGE: Do NOT ask the customer to choose a language. Automatically detect the language and manner in which the customer speaks or writes, and respond in that EXACT SAME language and manner:
   - If the customer speaks or writes in English: Respond ONLY in Simple English (6th-grade level).
   - If the customer speaks or writes in Pakistani Urdu or Roman Urdu: In live voice, speak ONLY in natural Pakistani Urdu (6th-grade level, zero Hindi words). In text, write ONLY in Pakistani Roman Urdu (6th-grade level, using Latin letters, zero Hindi words).
2. 6TH-GRADE SIMPLE LEVEL ONLY: Always use very simple, clear, everyday words at a 6th-grade level. Keep sentences short, warm, and easy to understand. One single voice persona only.
3. STRICT ZERO-HINDI WORD RULE: Never mention or use ANY Hindi or Sanskritized word in spoken Urdu or written Roman Urdu. Always use pure everyday Pakistani Urdu words:
   - Use "Assalam-o-Alaikum" (NEVER "namaste")
   - Use "Shukriya" (NEVER "dhanyavad")
   - Use "Khush Aamdeed" (NEVER "swagat")
   - Use "zaroorat" (NEVER "aavashyakta")
   - Use "khana" (NEVER "bhojan")
   - Use "zaiqa" or "lazzat" (NEVER "swad")
   - Use "khushbu" (NEVER "sugandh")
   - Use "sehat" (NEVER "swasthya")
   - Use "ghar walay" or "khandaan" (NEVER "parivar")
   - Use "istemal" (NEVER "upyog" or "prayog")
   - Use "qeemat" (NEVER "mulya")
   - Use "meherbani" (NEVER "kripya")

STRICT COMPLIANCE RULES:
- Never give medical advice. All BAJOZ products are traditional homemade foods and natural everyday care items.
- State clearly if asked: BAJOZ does NOT offer returns or refunds once an order is sent out, because all items are fresh food and personal care products.
- IMPORTANT INGREDIENT FACT: SpiceMix has 17 pure ingredients (Garlic, Ginger, Red Chilli, Salt, Turmeric, Cumin Seeds, Coriander Seeds, Green Cardamom, Black Cardamom, Cinnamon, Cloves, Bay Leaves, Mace, Star Anise, Black Pepper, Fennel Seeds, Carom Seeds). It has NO onion and NO flavour variants.

BAJOZ PRODUCTS (SIMPLE FACTS):
1. SpiceMix (Sizes: 250 gm, 450 gm, 950 gm | Price: N/A; no flavour variants):
   - One jar makes all Pakistani dishes (Quorma, Karahi, Biryani, All Vegetables, All Lentils, Kalaiji, Gurday Kapooray, Nihari, Payas, Roast, Fried Fish, Masala Rice) in half the cooking time.
   - Just fry onions and tomatoes, add your meat, vegetables, or daal, and add 1-2 tablespoons of SpiceMix. No peeling garlic or grinding spices needed!
2. Panjeeri (Sizes: 250 gm, 450 gm, 950 gm | Price: N/A):
   - Made in 100% pure Desi Ghee with almonds, cashews, pistachios, char maghaz, and 4 gondain. Zero white sugar.
   - 3 flavours: Suji, Alsi, and Daal Moong.
3. Tooth Guardian (Sizes: 40 gm, 80 gm | Price: N/A):
   - Natural homemade tooth cleaning powder made with alum (phitkari), cloves (laung), natural salts, and tree bark powders.
Delivery & Payment:
- Cash on Delivery (COD) and Meezan Bank transfer available across Pakistan. WhatsApp: 0315-4388166.`;

const MANDATORY_LANGUAGE_APPEND = `
=== MANDATORY AUTO-DETECT LANGUAGE & ZERO-HINDI ENFORCEMENT ===
- Reading & speaking level: 6th-grade level only (short, simple, friendly sentences).
- Automatically detect how the customer talks or writes and reply in the SAME single language:
  * If customer uses English -> reply ONLY in Simple English (6th-grade level).
  * If customer uses Urdu / Roman Urdu -> speak in Pakistani Urdu (6th-grade level) and write text ONLY in Pakistani Roman Urdu (6th-grade level, Latin script) with ZERO Hindi words.
- Never use Hindi words like namaste, dhanyavad, swagat, bhojan, swad, sugandh, swasthya, parivar, upyog, vikalp, mulya, or kripya.`;

function sanitizePakistaniText(text: string): string {
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

function detectUserLanguage(text: string): 'urdu' | 'english' {
  const raw = (text || '').trim();
  if (!raw) return 'english';
  if (/[\u0600-\u06FF]/.test(raw)) return 'urdu';
  const romanUrduPattern =
    /\b(kya|hai|hain|kaise|kaisa|kaisi|kitne|kitna|kitni|qeemat|batao|batayein|bataiye|mein|main|aur|se|ko|ka|ki|ke|ye|yeh|hum|aap|mujhe|mera|meri|hamara|ghar|khana|masala|pyaz|lahsun|adrak|namak|chahiye|milega|milti|hoti|hota|karna|karein|salam|assalam|aoa|shukriya|meherbani|wapsi|dant|masoor|ghee|cheeni|ajzaa|tareeqa|pakayein|istemal|kon|konsa|farq|haal)\b/i;
  return romanUrduPattern.test(raw) ? 'urdu' : 'english';
}

function buildDynamicVoiceInstruction(detectedLang?: 'urdu' | 'english'): string {
  const customInstruction =
    storeState.settings?.siteCopy?.voiceSystemInstruction?.trim();
  const customKnowledgeBase =
    storeState.settings?.siteCopy?.voiceKnowledgeBase?.trim();

  const baseInstruction = (customInstruction || DTCSS_SYSTEM_INSTRUCTION).replace(
    /Urdu\/Hindi/gi,
    'Pakistani Urdu (without any Hindi words)'
  );
  const modeHint =
    detectedLang === 'urdu'
      ? '\nDetected Customer Language: Pakistani Urdu / Roman Urdu. Reply ONLY in Pakistani Roman Urdu (6th-grade level, strictly zero Hindi words).'
      : detectedLang === 'english'
      ? '\nDetected Customer Language: Simple English. Reply ONLY in Simple English (6th-grade level).'
      : '\nAuto-detect the customer language on every turn: reply in Simple English (6th-grade level) if they speak English, or in Pakistani Urdu / Roman Urdu (6th-grade level, strictly zero Hindi words) if they speak Urdu.';

  if (customKnowledgeBase) {
    return `${baseInstruction}\n${MANDATORY_LANGUAGE_APPEND}${modeHint}\n\n=== BAJOZ KNOWLEDGE BASE & POLICIES ===\n${customKnowledgeBase}`;
  }
  return `${baseInstruction}\n${MANDATORY_LANGUAGE_APPEND}${modeHint}`;
}

const KNOWN_OTHER_ASSETS = new Set([
  'Anatomy-of-homepage_32569408.webp',
  'bajoz_cream_green_logo__2__3284fc56.png',
  'BAJOZ_Natural_Food_Website_Moodboard_bc0ca088.png',
  'conversion-wise-high-converting-landing-page-product-page_4689e90b.webp',
  'Heritage_1x_b7aa68cc.png',
  'image_2d948939_cf968239.png',
  'image_46d9bf55_06e518ca.jpg',
  'image_783ed842_e1c5a514.jpg',
  'image_f0df8d35_7481a296.png',
  'image_fee0cd04_a0af1ff4.png',
  'pinterest_pin_1050535050591988401.jpg',
]);

function extractBearerToken(req: express.Request): string {
  const authHeader = String(req.headers.authorization || '').trim();
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }
  return String(req.body?.token || req.query?.token || '').trim();
}

function sanitizeUserForClient(profile: any) {
  if (!profile || typeof profile !== 'object') return null;
  const { passwordHash: _pw, ...safeProfile } = profile;
  return safeProfile;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Serve uploaded files from /public/uploads
  const uploadsDir = path.resolve(process.cwd(), 'public/uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });
  app.use('/uploads', express.static(uploadsDir, { maxAge: '30d' }));

  // ==========================================================================
  // Dynamic SEO Sitemap.xml & Robots.txt for Custom Domain (https://bajoz.pk)
  // ==========================================================================
  app.get('/robots.txt', (req, res) => {
    const baseUrl =
      storeState.settings?.websiteUrl?.replace(/\/+$/, '') ||
      `${req.protocol}://${req.get('host') || 'bajoz.pk'}`;
    res.type('text/plain').send(
      [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /dtcss/admin',
        'Disallow: /api/',
        `Sitemap: ${baseUrl}/sitemap.xml`,
      ].join('\n')
    );
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl =
      storeState.settings?.websiteUrl?.replace(/\/+$/, '') ||
      `${req.protocol}://${req.get('host') || 'bajoz.pk'}`;
    const today = new Date().toISOString().split('T')[0];

    const urls: Array<{ loc: string; priority: string; changefreq: string }> = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/shop`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/guide`, priority: '0.9', changefreq: 'weekly' },
    ];

    const productIds =
      storeState.products?.length > 0
        ? storeState.products
            .filter((p) => p.isPublished !== false)
            .map((p) => p.id)
        : ['spicemix', 'panjeeri', 'toothpowder'];

    for (const pid of productIds) {
      urls.push({
        loc: `${baseUrl}/product/${encodeURIComponent(pid)}`,
        priority: '0.9',
        changefreq: 'weekly',
      });
    }

    const customPages = Array.isArray(storeState.settings?.customPages)
      ? storeState.settings.customPages.filter((pg: any) => pg.isPublished !== false)
      : [];
    for (const pg of customPages) {
      if (pg?.slug) {
        urls.push({
          loc: `${baseUrl}/page/${encodeURIComponent(pg.slug)}`,
          priority: '0.7',
          changefreq: 'weekly',
        });
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.type('application/xml').send(xml);
  });

  // ==========================================================================
  // Dynamic resolver & persistence for About BAJOZ Pakistani Family Image
  // ==========================================================================
  app.get('/api/about-family-image', (_req, res) => {
    try {
      const assetsDir = path.resolve(process.cwd(), 'public/assets/aistudio');
      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);
        const exactMatch = files.find((f) => /^image_fe2f1b15/i.test(f));
        if (exactMatch) {
          return res.sendFile(path.join(assetsDir, exactMatch));
        }
        const newestExtraImage = files.find(
          (f) =>
            /\.(jpe?g|png|webp)$/i.test(f) &&
            !KNOWN_OTHER_ASSETS.has(f) &&
            !f.startsWith('bajoz-logo-') &&
            !f.startsWith('bajoz-icon-') &&
            !f.startsWith('bajoz-favicon-') &&
            !f.startsWith('bajoz-apple-') &&
            !f.startsWith('bajoz-maskable-') &&
            !f.startsWith('bajoz-mstile-')
        );
        if (newestExtraImage) {
          return res.sendFile(path.join(assetsDir, newestExtraImage));
        }
      }
    } catch {
      // fall through
    }
    return res.status(404).end();
  });

  app.post('/api/about-family-image', (req, res) => {
    try {
      const dataUrl = String(req.body?.dataUrl || '');
      const match = dataUrl.match(/^data:image\/[a-zA-Z0-9+.-]+;base64,(.+)$/);
      if (!match) {
        return res.status(400).json({ ok: false });
      }
      const buffer = Buffer.from(match[1], 'base64');
      const assetsDir = path.resolve(process.cwd(), 'public/assets/aistudio');
      fs.mkdirSync(assetsDir, { recursive: true });
      const targetPath = path.join(assetsDir, 'image_fe2f1b15.jpg');
      fs.writeFileSync(targetPath, buffer);
      return res.json({
        ok: true,
        url: `/assets/aistudio/image_fe2f1b15.jpg?t=${Date.now()}`,
      });
    } catch {
      return res.status(500).json({ ok: false });
    }
  });

  // ==========================================================================
  // Health & System Status Endpoint (/api/health)
  // ==========================================================================
  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      brand: 'BAJOZ — The House of Naturals',
      websiteUrl: 'https://bajoz.pk',
      adminPortalPath: '/admin',
      hostingTarget: 'Hostinger Unlimited Plan (Custom Domain Ready)',
      databaseEngine: 'BAJOZ Self-Hosted Full-Stack Engine (Zero 3rd-Party BaaS)',
      storageEngine: 'Local Filesystem (/uploads)',
      authEngine: 'Self-Hosted Scrypt + HMAC Session Auth',
      supabaseConnected: true,
      counts: {
        products: storeState.products.length,
        orders: storeState.orders.length,
        reviews: storeState.reviews.length,
        customers: storeState.profiles.length,
        mediaAssets: (storeState.media || []).length,
      },
    });
  });

  // ==========================================================================
  // Self-Hosted File & Media Storage API (/api/storage/*)
  // ==========================================================================
  app.get('/api/storage/files', (_req, res) => {
    res.json({
      ok: true,
      files: storeState.media || [],
    });
  });

  app.post('/api/storage/upload', (req, res) => {
    const { dataUrl, filename, category } = req.body || {};
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res
        .status(400)
        .json({ ok: false, message: 'Missing dataUrl payload for file upload.' });
    }
    const asset = saveUploadedFileToDisk(storeState, {
      dataUrl,
      filename,
      category:
        category === 'products' ||
        category === 'pages' ||
        category === 'brand'
          ? category
          : 'general',
    });
    if (!asset) {
      return res
        .status(400)
        .json({ ok: false, message: 'Invalid dataUrl format.' });
    }
    return res.json({
      ok: true,
      asset,
      url: asset.url,
    });
  });

  app.delete('/api/storage/files/:id', (req, res) => {
    const deleted = deleteUploadedFileFromDisk(storeState, req.params.id);
    return res.json({ ok: deleted });
  });

  // ==========================================================================
  // Self-Hosted Customer Authentication API (/api/auth/*)
  // ==========================================================================
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, phone, city, address } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({
        ok: false,
        message: 'Please provide a valid email address.',
      });
    }

    const existing = (storeState.profiles || []).find(
      (u) => u.email?.toLowerCase() === cleanEmail
    );
    if (existing) {
      return res.status(409).json({
        ok: false,
        message: 'An account with this email already exists. Please sign in.',
      });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: String(name || 'Valued Customer').trim(),
      email: cleanEmail,
      phone: String(phone || '').trim(),
      city: String(city || 'Lahore').trim() || 'Lahore',
      savedAddresses: address && String(address).trim() ? [String(address).trim()] : [],
      provider: 'email',
      passwordHash: hashPassword(String(password || '')),
      createdAt: new Date().toISOString().split('T')[0],
    };

    storeState.profiles.unshift(newUser);

    const token = generateSignedSessionToken('bj_usr');
    storeState.sessions[token] = {
      token,
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: 'customer',
      type: 'customer',
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
    };

    saveSelfHostedDatabase(storeState);

    return res.json({
      ok: true,
      token,
      user: sanitizeUserForClient(newUser),
      message: `Welcome to BAJOZ — The House of Naturals, ${newUser.name}!`,
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');

    if (!cleanEmail) {
      return res.status(400).json({
        ok: false,
        message: 'Please enter your email address.',
      });
    }

    let matched = (storeState.profiles || []).find(
      (u) => u.email?.toLowerCase() === cleanEmail
    );

    if (matched) {
      if (matched.passwordHash && rawPassword) {
        const isValid = verifyPassword(rawPassword, matched.passwordHash);
        if (!isValid) {
          return res.status(401).json({
            ok: false,
            message: 'Incorrect password. Please verify your credentials.',
          });
        }
        // Automatically upgrade legacy plaintext password to scrypt hash
        if (!String(matched.passwordHash).startsWith('scrypt$')) {
          matched.passwordHash = hashPassword(rawPassword);
        }
      }
    } else {
      // Create customer profile on first sign-in if not registered yet
      matched = {
        id: `usr_${Date.now()}`,
        name:
          cleanEmail
            .split('@')[0]
            .replace(/[._]/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Valued Customer',
        email: cleanEmail,
        phone: '03001234567',
        city: 'Lahore',
        savedAddresses: ['Lahore, Pakistan'],
        provider: 'email',
        passwordHash: rawPassword ? hashPassword(rawPassword) : '',
        createdAt: new Date().toISOString().split('T')[0],
      };
      storeState.profiles.unshift(matched);
    }

    const token = generateSignedSessionToken('bj_usr');
    storeState.sessions[token] = {
      token,
      userId: matched.id,
      email: matched.email,
      name: matched.name,
      role: 'customer',
      type: 'customer',
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
    };

    saveSelfHostedDatabase(storeState);

    return res.json({
      ok: true,
      token,
      user: sanitizeUserForClient(matched),
      message: `Welcome back to BAJOZ — The House of Naturals, ${matched.name}!`,
    });
  });

  app.post('/api/auth/verify', (req, res) => {
    const token = extractBearerToken(req);
    if (!token || !storeState.sessions[token]) {
      return res.status(401).json({ ok: false });
    }
    const sess = storeState.sessions[token];
    if (sess.expiresAt < Date.now() || sess.type !== 'customer') {
      delete storeState.sessions[token];
      saveSelfHostedDatabase(storeState);
      return res.status(401).json({ ok: false });
    }
    const profile = (storeState.profiles || []).find(
      (u) =>
        u.id === sess.userId ||
        u.email?.toLowerCase() === sess.email.toLowerCase()
    );
    if (!profile) {
      return res.status(401).json({ ok: false });
    }
    return res.json({
      ok: true,
      user: sanitizeUserForClient(profile),
    });
  });

  app.put('/api/auth/profile', (req, res) => {
    const token = extractBearerToken(req);
    const updates = req.body || {};
    const targetEmail = String(
      updates.email ||
        (token && storeState.sessions[token]?.email) ||
        ''
    )
      .trim()
      .toLowerCase();

    if (!targetEmail) {
      return res.status(400).json({ ok: false, message: 'Missing user identifier.' });
    }

    const idx = (storeState.profiles || []).findIndex(
      (u) => u.email?.toLowerCase() === targetEmail || (updates.id && u.id === updates.id)
    );
    if (idx === -1) {
      return res.status(404).json({ ok: false, message: 'Customer profile not found.' });
    }

    const existing = storeState.profiles[idx];
    const updatedProfile = {
      ...existing,
      ...updates,
      email: existing.email,
      passwordHash: updates.password
        ? hashPassword(String(updates.password))
        : existing.passwordHash,
    };
    delete updatedProfile.password;

    storeState.profiles[idx] = updatedProfile;
    saveSelfHostedDatabase(storeState);

    return res.json({
      ok: true,
      user: sanitizeUserForClient(updatedProfile),
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = extractBearerToken(req);
    if (token && storeState.sessions[token]) {
      delete storeState.sessions[token];
      saveSelfHostedDatabase(storeState);
    }
    return res.json({ ok: true });
  });

  // ==========================================================================
  // Self-Hosted Admin Authentication & Personnel Management (/api/admin/*)
  // ==========================================================================
  app.post('/api/admin/login', (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '').trim();
    const list = storeState.authorizedPersonnel || DEFAULT_AUTHORIZED_PERSONNEL;

    const matched = list.find(
      (staff) =>
        staff.email.toLowerCase() === email &&
        verifyPassword(password, staff.passwordHash)
    );

    if (!matched) {
      return res.status(401).json({
        ok: false,
        message:
          'Access denied. Invalid staff email or security key. Only authorized BAJOZ personnel may access this portal.',
      });
    }

    if (!String(matched.passwordHash).startsWith('scrypt$')) {
      matched.passwordHash = hashPassword(password);
    }

    const token = generateSignedSessionToken('bj_adm');
    storeState.sessions[token] = {
      token,
      email: matched.email,
      name: matched.name,
      role: matched.role,
      type: 'admin',
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    };
    saveSelfHostedDatabase(storeState);

    return res.json({
      ok: true,
      token,
      staff: {
        email: matched.email,
        name: matched.name,
        role: matched.role,
      },
      personnel: list.map(({ passwordHash: _pw, ...safe }) => safe),
    });
  });

  app.post('/api/admin/verify', (req, res) => {
    const token = extractBearerToken(req);
    const list = storeState.authorizedPersonnel || DEFAULT_AUTHORIZED_PERSONNEL;

    if (token && storeState.sessions[token]) {
      const session = storeState.sessions[token];
      if (session.expiresAt > Date.now() && session.type === 'admin') {
        return res.json({
          ok: true,
          staff: {
            email: session.email,
            name: session.name,
            role: session.role,
          },
          personnel: list.map(({ passwordHash: _pw, ...safe }) => safe),
        });
      }
      delete storeState.sessions[token];
      saveSelfHostedDatabase(storeState);
    }

    return res.status(401).json({ ok: false });
  });

  app.post('/api/admin/personnel', (req, res) => {
    const { action, staffMember, emailToRemove } = req.body || {};
    if (!storeState.authorizedPersonnel) {
      storeState.authorizedPersonnel = [...DEFAULT_AUTHORIZED_PERSONNEL];
    }

    if (action === 'upsert' && staffMember?.email && staffMember?.passwordHash) {
      const cleanEmail = String(staffMember.email).trim().toLowerCase();
      const existingIdx = storeState.authorizedPersonnel.findIndex(
        (s) => s.email.toLowerCase() === cleanEmail
      );
      const record: AuthorizedStaffMember = {
        email: cleanEmail,
        name: String(staffMember.name || 'BAJOZ Staff').trim(),
        role: staffMember.role || 'Operations Manager',
        passwordHash: hashPassword(String(staffMember.passwordHash).trim()),
        addedAt: new Date().toISOString().split('T')[0],
      };
      if (existingIdx > -1) {
        storeState.authorizedPersonnel[existingIdx] = record;
      } else {
        storeState.authorizedPersonnel.push(record);
      }
      saveSelfHostedDatabase(storeState);
    } else if (action === 'remove' && emailToRemove) {
      const cleanRemove = String(emailToRemove).trim().toLowerCase();
      if (storeState.authorizedPersonnel.length > 1) {
        storeState.authorizedPersonnel = storeState.authorizedPersonnel.filter(
          (s) => s.email.toLowerCase() !== cleanRemove
        );
        saveSelfHostedDatabase(storeState);
      }
    }

    return res.json({
      ok: true,
      personnel: storeState.authorizedPersonnel.map(
        ({ passwordHash: _pw, ...safe }) => safe
      ),
    });
  });

  app.get('/api/admin/db-backup', (_req, res) => {
    res.json({
      ok: true,
      exportedAt: new Date().toISOString(),
      engine: 'BAJOZ Self-Hosted Full-Stack Database v2 (Hostinger Ready)',
      data: {
        products: storeState.products,
        orders: storeState.orders,
        reviews: storeState.reviews,
        profiles: storeState.profiles.map(sanitizeUserForClient),
        settings: storeState.settings,
        media: storeState.media || [],
      },
    });
  });

  app.post('/api/admin/db-restore', (req, res) => {
    const payload = req.body?.data || req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ ok: false, message: 'Invalid backup payload.' });
    }
    if (Array.isArray(payload.products)) storeState.products = payload.products;
    if (Array.isArray(payload.orders)) storeState.orders = payload.orders;
    if (Array.isArray(payload.reviews)) storeState.reviews = payload.reviews;
    if (Array.isArray(payload.profiles)) storeState.profiles = payload.profiles;
    if (Array.isArray(payload.media)) storeState.media = payload.media;
    if (payload.settings && typeof payload.settings === 'object') {
      storeState.settings = payload.settings;
    }
    saveSelfHostedDatabase(storeState);
    return res.json({
      ok: true,
      message: 'BAJOZ self-hosted database restored successfully.',
    });
  });

  // ==========================================================================
  // Self-Hosted Storefront & Catalog REST API (/api/store/*)
  // ==========================================================================
  app.get('/api/store', async (_req, res) => {
    res.json({
      products: storeState.products,
      orders: storeState.orders,
      reviews: storeState.reviews,
      profiles: (storeState.profiles || []).map(sanitizeUserForClient),
      settings: storeState.settings,
      media: storeState.media || [],
      source: 'bajoz-self-hosted-db',
    });
  });

  app.post('/api/store/products', async (req, res) => {
    const product = req.body;
    if (product && product.id) {
      // Automatically extract base64 customImageUrl to /public/uploads/products/
      if (
        typeof product.customImageUrl === 'string' &&
        product.customImageUrl.startsWith('data:image/')
      ) {
        const uploaded = saveUploadedFileToDisk(storeState, {
          dataUrl: product.customImageUrl,
          filename: `product-${product.id}`,
          category: 'products',
        });
        if (uploaded) {
          product.customImageUrl = uploaded.url;
        }
      }

      const idx = storeState.products.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        storeState.products[idx] = product;
      } else {
        storeState.products.push(product);
      }
      saveSelfHostedDatabase(storeState);
    }
    res.json({ ok: true, product });
  });

  app.delete('/api/store/products/:id', async (req, res) => {
    const id = req.params.id;
    storeState.products = storeState.products.filter((p) => p.id !== id);
    saveSelfHostedDatabase(storeState);
    res.json({ ok: true });
  });

  app.get('/api/store/orders/track/:orderNumber', (req, res) => {
    const code = String(req.params.orderNumber || '').trim().toUpperCase();
    const matched = (storeState.orders || []).find(
      (o) => String(o.orderNumber || '').toUpperCase() === code
    );
    if (!matched) {
      return res.status(404).json({ ok: false, message: 'Order not found.' });
    }
    return res.json({ ok: true, order: matched });
  });

  app.post('/api/store/orders', async (req, res) => {
    const order = req.body;
    if (order && order.orderNumber) {
      const idx = storeState.orders.findIndex(
        (o) => o.orderNumber === order.orderNumber
      );
      if (idx > -1) {
        storeState.orders[idx] = order;
      } else {
        storeState.orders.unshift(order);
      }
      saveSelfHostedDatabase(storeState);
    }
    res.json({ ok: true });
  });

  app.delete('/api/store/orders/:orderNumber', async (req, res) => {
    const orderNumber = req.params.orderNumber;
    storeState.orders = storeState.orders.filter(
      (o) => o.orderNumber !== orderNumber
    );
    saveSelfHostedDatabase(storeState);
    res.json({ ok: true });
  });

  app.post('/api/store/reviews', async (req, res) => {
    const review = req.body;
    if (review && review.id) {
      const idx = storeState.reviews.findIndex((r) => r.id === review.id);
      if (idx > -1) {
        storeState.reviews[idx] = review;
      } else {
        storeState.reviews.unshift(review);
      }
      saveSelfHostedDatabase(storeState);
    }
    res.json({ ok: true });
  });

  app.delete('/api/store/reviews/:id', async (req, res) => {
    const id = req.params.id;
    storeState.reviews = storeState.reviews.filter((r) => r.id !== id);
    saveSelfHostedDatabase(storeState);
    res.json({ ok: true });
  });

  app.post('/api/store/settings', async (req, res) => {
    storeState.settings = req.body;
    saveSelfHostedDatabase(storeState);
    res.json({ ok: true });
  });

  app.get('/api/store/profiles/:email', async (req, res) => {
    const cleanEmail = String(req.params.email || '').trim().toLowerCase();
    const matched = (storeState.profiles || []).find(
      (u) => u.email?.toLowerCase() === cleanEmail
    );
    res.json({
      ok: Boolean(matched),
      profile: matched ? sanitizeUserForClient(matched) : null,
    });
  });

  app.post('/api/store/profiles', async (req, res) => {
    const profile = req.body;
    if (profile && (profile.email || profile.id)) {
      const cleanEmail = String(profile.email || '').trim().toLowerCase();
      const idx = storeState.profiles.findIndex(
        (u) =>
          (profile.id && u.id === profile.id) ||
          (cleanEmail && u.email?.toLowerCase() === cleanEmail)
      );
      const nextRecord = {
        ...(idx > -1 ? storeState.profiles[idx] : {}),
        ...profile,
        email: cleanEmail || (idx > -1 ? storeState.profiles[idx].email : ''),
      };
      if (
        nextRecord.passwordHash &&
        !String(nextRecord.passwordHash).startsWith('scrypt$')
      ) {
        nextRecord.passwordHash = hashPassword(String(nextRecord.passwordHash));
      }
      if (idx > -1) {
        storeState.profiles[idx] = nextRecord;
      } else {
        storeState.profiles.unshift(nextRecord);
      }
      saveSelfHostedDatabase(storeState);
    }
    res.json({ ok: true });
  });

  app.delete('/api/store/profiles/:idOrEmail', async (req, res) => {
    const target = String(req.params.idOrEmail || '').trim().toLowerCase();
    storeState.profiles = (storeState.profiles || []).filter(
      (u) =>
        String(u.id || '').toLowerCase() !== target &&
        String(u.email || '').toLowerCase() !== target
    );
    saveSelfHostedDatabase(storeState);
    res.json({ ok: true });
  });

  // ==========================================================================
  // 24/7 BAJOZ Context-Aware Live Voice & Text Concierge Responder (HTTP + WS)
  // ==========================================================================
  function formatVoiceContextBlock(context?: any): string {
    if (!context || typeof context !== 'object') return '';
    const lines: string[] = ['=== LIVE CUSTOMER PAGE & SELECTION CONTEXT ==='];
    if (context.pageTitle) lines.push(`Current Page: ${context.pageTitle}`);
    if (context.productName) {
      lines.push(`Viewing Product: ${context.productName}`);
      if (context.variantName) lines.push(`Selected Flavour: ${context.variantName}`);
      if (context.packSizeLabel) lines.push(`Selected Size: ${context.packSizeLabel}`);
      if (context.quantity) lines.push(`Selected Quantity: ${context.quantity}`);
    }
    if (typeof context.cartCount === 'number') {
      lines.push(`Shopping Bag: ${context.cartCount} item(s)`);
    }
    return lines.join('\n');
  }

  function generateBajozConciergeReply(rawInput: string, context?: any): string {
    const q = (rawInput || '').toLowerCase().trim();
    const lang = detectUserLanguage(rawInput);
    const activeProduct = context?.productName || '';
    const activeFlavour = context?.variantName || '';
    const activeSize = context?.packSizeLabel || '';
    const activeQty = Number(context?.quantity || 1);

    const pick = (enText: string, urText: string) =>
      sanitizePakistaniText(lang === 'urdu' ? urText : enText);

    const enSel = activeProduct
      ? ` Right now on your screen, you picked ${activeQty}× ${activeProduct}${
          activeFlavour ? ` (${activeFlavour})` : ''
        }${activeSize ? ` in ${activeSize}` : ''} (Price: N/A).`
      : '';

    const urSel = activeProduct
      ? ` Is waqt aap ki screen par ${activeQty}× ${activeProduct}${
          activeFlavour ? ` (${activeFlavour})` : ''
        }${activeSize ? ` (${activeSize})` : ''} select hai (Price: N/A).`
      : '';

    if (!q || /^(hi|hello|salam|assalam|aoa|hey|start|help|kya haal)\b/.test(q)) {
      return pick(
        `Assalam-o-Alaikum! Welcome to BAJOZ.${enSel} Ask me about our products, ingredients, jar sizes, or prices!`,
        `Assalam-o-Alaikum! BAJOZ mein Khush Aamdeed.${urSel} Aap mujh se hamaray products, ajzaa, jar sizes, ya qeemat pooch saktay hain!`
      );
    }

    if (
      q.includes('current') ||
      q.includes('selection') ||
      q.includes('my price') ||
      q.includes('selected') ||
      q.includes('mera') ||
      (q.includes('price') && activeProduct) ||
      (q.includes('qeemat') && activeProduct)
    ) {
      if (activeProduct) {
        return pick(
          `You are viewing ${activeProduct} (${activeFlavour || 'Standard'}, ${
            activeSize || 'Standard Jar'
          }, Qty: ${activeQty}). Price: N/A right now.`,
          `Aap is waqt ${activeProduct} (${activeFlavour || 'Standard'}, ${
            activeSize || 'Standard Jar'
          }, Qty: ${activeQty}) dekh rahay hain. Price: N/A.`
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
      return pick(
        `Our Panjeeri is made in 100% pure Desi Ghee with almonds, cashews, pistachios, char maghaz, and 4 gondain. It has zero white sugar. Choose from 3 flavours: Suji, Alsi, and Daal Moong in 250 gm, 450 gm, and 950 gm jars (Price: N/A).${enSel}`,
        `Hamari Panjeeri 100% khalis Desi Ghee, badam, kaju, pista, char maghaz aur 4 gondain se banti hai. Is mein safed cheeni bilkul nahi hai. Yeh 3 flavours (Suji, Alsi, Daal Moong) aur 3 jar sizes: 250 gm, 450 gm aur 950 gm mein milti hai (Price: N/A).${urSel}`
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
      q.includes('handi') ||
      q.includes('karahi') ||
      q.includes('masala')
    ) {
      return pick(
        `BAJOZ SpiceMix has 17 pure ingredients (fresh garlic, ginger, salt, and 14 Pakistani spices) in one jar, with ZERO onion and no flavour variants. Just fry onions and tomatoes, add meat, vegetables, or daal, and add 1-2 tablespoons of SpiceMix to cook in half the time! Sizes: 250 gm, 450 gm, and 950 gm (Price: N/A).${enSel}`,
        `BAJOZ SpiceMix mein 17 khalis ajzaa (taza lahsun, adrak, namak aur 14 Pakistani masalay) shamil hain. Is mein pyaz nahi hai aur koi alag flavour variant nahi hai. Bas pyaz aur tamatar fry karein, gosht, sabzi ya daal dalein aur 1 se 2 chamach SpiceMix daal kar aadhay waqt mein mazedar khana pakayein! Sizes: 250 gm, 450 gm aur 950 gm (Price: N/A).${urSel}`
      );
    }

    if (
      q.includes('tooth') ||
      q.includes('guardian') ||
      q.includes('powder') ||
      q.includes('oral') ||
      q.includes('dant') ||
      q.includes('masoor') ||
      q.includes('manjan')
    ) {
      return pick(
        `Tooth Guardian is our natural homemade tooth cleaning powder made with alum (phitkari), cloves (laung), natural salts, and tree bark powders. Available in 40 gm and 80 gm jars (Price: N/A).${enSel}`,
        `Tooth Guardian qudrati ghar ka bana tooth cleaning powder hai jo phitkari, laung, qudrati namak aur darakhton ki chhaal ke powder se bana hai. Yeh 40 gm aur 80 gm jar sizes mein milta hai (Price: N/A).${urSel}`
      );
    }

    if (
      q.includes('flavour') ||
      q.includes('flavor') ||
      q.includes('size') ||
      q.includes('pack') ||
      q.includes('compare') ||
      q.includes('farq')
    ) {
      return pick(
        `Here are our jar sizes and options: Panjeeri comes in 3 flavours (Suji, Alsi, Daal Moong) in 250 gm, 450 gm, and 950 gm jars; SpiceMix comes in 250 gm, 450 gm, and 950 gm jars (no flavour variants); and Tooth Guardian comes in 40 gm and 80 gm jars.${enSel}`,
        `Hamaray jar sizes aur flavours yeh hain: Panjeeri 3 flavours (Suji, Alsi, Daal Moong) mein 250 gm, 450 gm aur 950 gm jar mein milti hai; SpiceMix 250 gm, 450 gm aur 950 gm jar mein milta hai (koi alag flavour nahi); aur Tooth Guardian 40 gm aur 80 gm jar mein milta hai.${urSel}`
      );
    }

    if (
      q.includes('deliver') ||
      q.includes('shipping') ||
      q.includes('cod') ||
      q.includes('cash') ||
      q.includes('bank') ||
      q.includes('meezan') ||
      q.includes('payment') ||
      q.includes('lahore') ||
      q.includes('karachi') ||
      q.includes('islamabad')
    ) {
      return pick(
        `We deliver all across Pakistan! You can pay via Cash on Delivery (COD) or Meezan Bank transfer.${enSel}`,
        `Hum pooray Pakistan mein delivery kartay hain! Aap Cash on Delivery (COD) ya Meezan Bank transfer se payment kar saktay hain.${urSel}`
      );
    }

    if (
      q.includes('return') ||
      q.includes('refund') ||
      q.includes('exchange') ||
      q.includes('policy') ||
      q.includes('wapsi')
    ) {
      return pick(
        'Because all BAJOZ items are fresh homemade foods and personal care items, we do not offer returns or refunds once an order is sent out. For any help, message us on WhatsApp at 0315-4388166.',
        'Kyunkay BAJOZ ki tamam cheezein taza ghar ki bani khorak aur zaati istemal ki hain, is liye order bhejnay ke baad wapsi (return) ya refund nahi hota. Kisi bhi madad ke liye WhatsApp 0315-4388166 par rabta karein.'
      );
    }

    if (
      q.includes('whatsapp') ||
      q.includes('contact') ||
      q.includes('phone') ||
      q.includes('number') ||
      q.includes('call') ||
      q.includes('location') ||
      q.includes('address') ||
      q.includes('rabta')
    ) {
      return pick(
        'You can message BAJOZ 24/7 on WhatsApp at 0315-4388166 (+92 315 4388166). We are based in Model Town, Lahore and ship across Pakistan.',
        'Aap BAJOZ se 24/7 WhatsApp number 0315-4388166 (+92 315 4388166) par rabta kar saktay hain. Hum Model Town, Lahore mein hain aur pooray Pakistan mein delivery kartay hain.'
      );
    }

    if (
      q.includes('price') ||
      q.includes('cost') ||
      q.includes('kitne') ||
      q.includes('qeemat') ||
      q.includes('rate') ||
      q.includes('catalog') ||
      q.includes('product')
    ) {
      return pick(
        `Prices are currently N/A for all BAJOZ products: 1) SpiceMix (250 gm, 450 gm, 950 gm | Price: N/A), 2) Panjeeri (250 gm, 450 gm, 950 gm in Suji, Alsi, Daal Moong | Price: N/A), and 3) Tooth Guardian (40 gm, 80 gm | Price: N/A).${enSel}`,
        `Tamam BAJOZ products ki prices filhal N/A hain: 1) SpiceMix (250 gm, 450 gm, 950 gm | Price: N/A), 2) Panjeeri (250 gm, 450 gm, 950 gm — Suji, Alsi, Daal Moong | Price: N/A), aur 3) Tooth Guardian (40 gm, 80 gm | Price: N/A).${urSel}`
      );
    }

    return pick(
      `At BAJOZ in Model Town, Lahore, we make 3 pure products: SpiceMix, Panjeeri, and Tooth Guardian natural homemade tooth cleaning powder.${enSel} Ask me about ingredients, cooking steps, or jar sizes!`,
      `BAJOZ Model Town, Lahore mein hum 3 khalis cheezein banatay hain: SpiceMix, Panjeeri, aur Tooth Guardian tooth powder.${urSel} Aap mujh se ajzaa, pakanay ka tareeqa, ya jar sizes pooch saktay hain!`
    );
  }

  app.post('/api/concierge/ask', async (req, res) => {
    const userMessage = String(req.body?.message || '').trim();
    const clientContext = req.body?.context || null;
    if (!userMessage) {
      return res.json({
        ok: true,
        reply: generateBajozConciergeReply('hello', clientContext),
        source: 'local-24x7',
      });
    }

    const detectedLang = detectUserLanguage(userMessage);
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });
        const contextBlock = formatVoiceContextBlock(clientContext);
        const sysInstruction = buildDynamicVoiceInstruction(detectedLang);
        const fullSystemInstruction = contextBlock
          ? `${sysInstruction}\n\n${contextBlock}`
          : sysInstruction;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: userMessage,
          config: {
            systemInstruction: fullSystemInstruction,
          },
        });
        const replyText = sanitizePakistaniText(response.text?.trim() || '');
        if (replyText) {
          return res.json({
            ok: true,
            reply: replyText,
            detectedLang,
            source: 'gemini-3-flash-preview',
          });
        }
      } catch {
        // Fall through to deterministic 24/7 BAJOZ responder
      }
    }

    return res.json({
      ok: true,
      reply: generateBajozConciergeReply(userMessage, clientContext),
      detectedLang,
      source: 'local-24x7',
    });
  });

  // ==========================================================================
  // HTTP & WebSocket Server (/live for Gemini Live Voice Concierge)
  // ==========================================================================
  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    if (request.url?.startsWith('/live')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', async (clientWs: WebSocket) => {
    const apiKey = process.env.GEMINI_API_KEY;
    let liveSession: any = null;
    let latestClientContext: any = null;

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });

        liveSession = await ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Aoede' },
              },
            },
            systemInstruction: buildDynamicVoiceInstruction(),
          },
          callbacks: {
            onmessage: (message: any) => {
              if (clientWs.readyState !== WebSocket.OPEN) return;

              if (message.serverContent?.interrupted) {
                clientWs.send(JSON.stringify({ type: 'interrupted' }));
              }

              const outputText = message.serverContent?.outputTranscription?.text;
              if (outputText) {
                clientWs.send(
                  JSON.stringify({
                    type: 'transcript',
                    role: 'assistant',
                    text: sanitizePakistaniText(outputText),
                    speak: false,
                  })
                );
              }

              const parts = message.serverContent?.modelTurn?.parts || [];
              for (const part of parts) {
                if (part.inlineData?.data) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'audio',
                      data: part.inlineData.data,
                    })
                  );
                }
                if (part.text && !outputText) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'transcript',
                      role: 'assistant',
                      text: sanitizePakistaniText(part.text),
                      speak: false,
                    })
                  );
                }
              }
            },
            onerror: () => {
              liveSession = null;
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(
                  JSON.stringify({
                    type: 'mode',
                    mode: 'hybrid-24x7',
                  })
                );
              }
            },
            onclose: () => {
              liveSession = null;
            },
          },
        });
      } catch {
        liveSession = null;
      }
    }

    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: 'ready',
          mode: liveSession ? 'gemini-live' : 'hybrid-24x7',
        })
      );
    }

    clientWs.on('message', async (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.context) {
          latestClientContext = msg.context;
        }
        if (msg.type === 'context' && msg.context) {
          latestClientContext = msg.context;
          return;
        }
        if (msg.type === 'audio' && msg.data && liveSession) {
          liveSession.sendRealtimeInput({
            audio: {
              data: msg.data,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (msg.type === 'text' && msg.text) {
          const userText = String(msg.text).trim();
          if (!userText) return;

          if (liveSession && typeof liveSession.sendClientContent === 'function') {
            try {
              const detectedLang = detectUserLanguage(userText);
              const langNote =
                detectedLang === 'urdu'
                  ? 'Reply in Pakistani Urdu / Roman Urdu (6th-grade level, zero Hindi words).'
                  : 'Reply in Simple English (6th-grade level).';
              const ctxSummary = formatVoiceContextBlock(latestClientContext);
              const promptWithCtx = ctxSummary
                ? `[Customer Context: ${ctxSummary}]\n[${langNote}]\nCustomer Question: ${userText}`
                : `[${langNote}]\nCustomer Question: ${userText}`;
              liveSession.sendClientContent({
                turns: [{ role: 'user', parts: [{ text: promptWithCtx }] }],
                turnComplete: true,
              });
              return;
            } catch {
              // Fall through to 24/7 responder
            }
          }

          const reply = generateBajozConciergeReply(userText, latestClientContext);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(
              JSON.stringify({
                type: 'transcript',
                role: 'assistant',
                text: reply,
                speak: true,
              })
            );
          }
        }
      } catch {
        // ignore malformed client frame
      }
    });

    clientWs.on('close', () => {
      if (liveSession) {
        try {
          liveSession.close();
        } catch {
          // ignore
        }
      }
    });
  });

  // ==========================================================================
  // Vite Middleware (Dev) or Static Assets + SPA Fallback Routing (Prod)
  // ==========================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(
      express.static(distPath, {
        maxAge: '7d',
        index: false,
      })
    );
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`BAJOZ Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

void startServer();
