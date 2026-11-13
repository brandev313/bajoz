/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * BAJOZ Self-Hosted Full-Stack Database, Authentication & File Storage Engine
 * 100% independent of Firebase, Supabase, or any external BaaS provider.
 * Designed for Hostinger Unlimited Plan (Node.js / Phusion Passenger / PM2).
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface AuthorizedStaffMember {
  email: string;
  name: string;
  role: 'Store Director' | 'Operations Manager' | 'Inventory Coordinator';
  passwordHash: string;
  addedAt: string;
}

export interface StoredSessionRecord {
  token: string;
  userId?: string;
  email: string;
  name: string;
  role: string;
  type: 'customer' | 'admin';
  createdAt: number;
  expiresAt: number;
}

export interface StoredMediaAsset {
  id: string;
  filename: string;
  category: 'products' | 'pages' | 'brand' | 'general';
  mimeType: string;
  sizeBytes: number;
  url: string;
  uploadedAt: string;
}

export interface ServerStoreState {
  products: any[];
  orders: any[];
  reviews: any[];
  profiles: any[];
  settings: any | null;
  authorizedPersonnel: AuthorizedStaffMember[];
  sessions: Record<string, StoredSessionRecord>;
  media: StoredMediaAsset[];
}

const ROOT_DIR = process.cwd();
const STORAGE_DB_DIR = path.resolve(ROOT_DIR, 'storage/db');
const PRIMARY_DB_FILE = path.resolve(STORAGE_DB_DIR, 'bajoz-database.json');
const BACKUP_DB_FILE = path.resolve(STORAGE_DB_DIR, 'bajoz-database.backup.json');
const LEGACY_DB_FILE = path.resolve(ROOT_DIR, '.dtcss-store-db.json');
const UPLOADS_ROOT_DIR = path.resolve(ROOT_DIR, 'public/uploads');

const AUTH_SECRET =
  process.env.BAJOZ_AUTH_SECRET ||
  process.env.DTCSS_ADMIN_PASSWORD ||
  'bajoz-house-of-naturals-self-hosted-secret-2026';

// ============================================================================
// Cryptographic Password Hashing & Token Utilities (Zero External Dependencies)
// ============================================================================

export function hashPassword(plainPassword: string): string {
  const clean = String(plainPassword || '');
  if (!clean) return '';
  if (clean.startsWith('scrypt$')) return clean;
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(clean, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(plainPassword: string, storedHash: string): boolean {
  const candidate = String(plainPassword || '');
  const stored = String(storedHash || '');
  if (!stored) return true;
  if (stored.startsWith('scrypt$')) {
    const parts = stored.split('$');
    if (parts.length !== 3) return false;
    const [, salt, hashHex] = parts;
    try {
      const derived = crypto.scryptSync(candidate, salt, 64);
      const expected = Buffer.from(hashHex, 'hex');
      if (derived.length !== expected.length) return false;
      return crypto.timingSafeEqual(derived, expected);
    } catch {
      return false;
    }
  }
  return candidate === stored;
}

export function generateSignedSessionToken(prefix: 'bj_usr' | 'bj_adm'): string {
  const nonce = crypto.randomBytes(18).toString('hex');
  const timestamp = Date.now().toString(36);
  const payload = `${prefix}_${timestamp}_${nonce}`;
  const sig = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payload)
    .digest('hex')
    .slice(0, 16);
  return `${payload}_${sig}`;
}

export const DEFAULT_AUTHORIZED_PERSONNEL: AuthorizedStaffMember[] = [
  {
    email: (process.env.BAJOZ_ADMIN_EMAIL || process.env.DTCSS_ADMIN_EMAIL || 'admin@dtcss.pk')
      .trim()
      .toLowerCase(),
    name: 'BAJOZ Store Director',
    role: 'Store Director',
    passwordHash: hashPassword(
      process.env.BAJOZ_ADMIN_PASSWORD || process.env.DTCSS_ADMIN_PASSWORD || 'DTCSS-Admin-2026'
    ),
    addedAt: '2026-09-01',
  },
  {
    email: 'admin@bajoz.pk',
    name: 'BAJOZ Executive Director',
    role: 'Store Director',
    passwordHash: hashPassword(
      process.env.BAJOZ_ADMIN_PASSWORD || process.env.DTCSS_ADMIN_PASSWORD || 'DTCSS-Admin-2026'
    ),
    addedAt: '2026-09-01',
  },
  {
    email: 'ops@dtcss.pk',
    name: 'Lahore Fulfillment Lead',
    role: 'Operations Manager',
    passwordHash: hashPassword('DTCSS-Ops-2026'),
    addedAt: '2026-09-10',
  },
];

// ============================================================================
// Data Sanitization & Atomic Self-Hosted Database Persistence
// ============================================================================

export function sanitizeStoreJson(raw: string): string {
  return raw
    .replace(
      /\/assets\/aistudio\/image_f0df8d35_7481a296\.png/g,
      '/assets/aistudio/image_46d9bf55_06e518ca.jpg'
    )
    .replace(/cork-stoppered\s+glass\s+jar/gi, 'fresh-sealed jar')
    .replace(/cork-stoppered\s+apothecary\s+jar/gi, 'fresh-sealed jar')
    .replace(
      /apothecary\s+glass\s+jar\s+sealed\s+with\s+natural\s+cork\s+stopper/gi,
      'fresh-sealed jar'
    )
    .replace(/apothecary\s+cork-stoppered\s+glass\s+jar/gi, 'fresh-sealed jar')
    .replace(/cork-stoppered\s+jar/gi, 'fresh-sealed jar')
    .replace(/Apothecary\s+Cork\s+Jar/gi, 'Fresh-Sealed Jar')
    .replace(/Cork\s+Jar/gi, 'Jar')
    .replace(
      /clear\s+glass\s+jar\s+with\s+brushed\s+gold\s+threaded\s+lid/gi,
      'airtight jar with fresh-lock lid'
    )
    .replace(/brushed-gold\s+glass\s+jar/gi, 'airtight jar')
    .replace(
      /reusable\s+glass\s+jars?\s+with\s+a\s+brushed\s+gold\s+lid/gi,
      'airtight jars'
    )
    .replace(/reusable\s+glass\s+jars?/gi, 'airtight jars')
    .replace(/wide-mouth\s+glass\s+jar/gi, 'wide-mouth jar')
    .replace(/500g\s+Glass\s+Jar/gi, '500g Jar')
    .replace(/1kg\s+Twin\s+Glass\s+Jars/gi, '1kg Twin Jars')
    .replace(/350g\s+glass\s+jar/gi, '350g jar')
    .replace(/glass\s+jars?/gi, 'jars')
    .replace(/microplastics/gi, 'synthetic additives');
}

export function ensureStorageDirectories() {
  try {
    fs.mkdirSync(STORAGE_DB_DIR, { recursive: true });
    fs.mkdirSync(path.join(UPLOADS_ROOT_DIR, 'products'), { recursive: true });
    fs.mkdirSync(path.join(UPLOADS_ROOT_DIR, 'pages'), { recursive: true });
    fs.mkdirSync(path.join(UPLOADS_ROOT_DIR, 'brand'), { recursive: true });
    fs.mkdirSync(path.join(UPLOADS_ROOT_DIR, 'general'), { recursive: true });
  } catch {
    // ignore filesystem permission issues on read-only mounts
  }
}

export function loadSelfHostedDatabase(): ServerStoreState {
  ensureStorageDirectories();

  const candidateFiles = [PRIMARY_DB_FILE, LEGACY_DB_FILE, BACKUP_DB_FILE];

  for (const filePath of candidateFiles) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const cleaned = sanitizeStoreJson(raw);
        const parsed = JSON.parse(cleaned);

        const personnel: AuthorizedStaffMember[] =
          Array.isArray(parsed.authorizedPersonnel) &&
          parsed.authorizedPersonnel.length > 0
            ? parsed.authorizedPersonnel
            : [...DEFAULT_AUTHORIZED_PERSONNEL];

        // Ensure admin@bajoz.pk and admin@dtcss.pk both exist in personnel
        for (const defStaff of DEFAULT_AUTHORIZED_PERSONNEL) {
          if (
            !personnel.some(
              (p) => p.email.toLowerCase() === defStaff.email.toLowerCase()
            )
          ) {
            personnel.push(defStaff);
          }
        }

        const state: ServerStoreState = {
          products: Array.isArray(parsed.products) ? parsed.products : [],
          orders: Array.isArray(parsed.orders) ? parsed.orders : [],
          reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
          profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [],
          settings: parsed.settings || null,
          authorizedPersonnel: personnel,
          sessions:
            parsed.sessions && typeof parsed.sessions === 'object'
              ? parsed.sessions
              : {},
          media: Array.isArray(parsed.media) ? parsed.media : [],
        };

        // Prune expired sessions on load
        const now = Date.now();
        for (const [token, sess] of Object.entries(state.sessions)) {
          if (!sess || sess.expiresAt < now) {
            delete state.sessions[token];
          }
        }

        if (!fs.existsSync(PRIMARY_DB_FILE)) {
          saveSelfHostedDatabase(state);
        }

        return state;
      }
    } catch {
      // try next candidate file
    }
  }

  const initial: ServerStoreState = {
    products: [],
    orders: [],
    reviews: [],
    profiles: [],
    settings: null,
    authorizedPersonnel: [...DEFAULT_AUTHORIZED_PERSONNEL],
    sessions: {},
    media: [],
  };
  saveSelfHostedDatabase(initial);
  return initial;
}

export function saveSelfHostedDatabase(state: ServerStoreState): void {
  ensureStorageDirectories();
  const serialized = JSON.stringify(state, null, 2);

  try {
    if (fs.existsSync(PRIMARY_DB_FILE)) {
      fs.copyFileSync(PRIMARY_DB_FILE, BACKUP_DB_FILE);
    }
  } catch {
    // ignore backup copy errors
  }

  try {
    const tempFile = `${PRIMARY_DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, serialized, 'utf-8');
    fs.renameSync(tempFile, PRIMARY_DB_FILE);
  } catch {
    try {
      fs.writeFileSync(PRIMARY_DB_FILE, serialized, 'utf-8');
    } catch {
      // ignore
    }
  }

  try {
    fs.writeFileSync(LEGACY_DB_FILE, serialized, 'utf-8');
  } catch {
    // ignore
  }
}

// ============================================================================
// Self-Hosted File & Media Storage Service (/public/uploads/*)
// ============================================================================

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
};

export function saveUploadedFileToDisk(
  state: ServerStoreState,
  params: {
    dataUrl: string;
    filename?: string;
    category?: 'products' | 'pages' | 'brand' | 'general';
  }
): StoredMediaAsset | null {
  ensureStorageDirectories();
  const rawDataUrl = String(params.dataUrl || '').trim();
  const match = rawDataUrl.match(/^data:([a-zA-Z0-9/+.-]+);base64,(.+)$/);
  if (!match) return null;

  const mimeType = match[1].toLowerCase();
  const base64Data = match[2];
  const ext = MIME_TO_EXT[mimeType] || 'bin';
  const category = params.category || 'general';

  const cleanBaseName = String(params.filename || `bajoz_${category}`)
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'asset';

  const uniqueId = `${Date.now().toString(36)}_${crypto
    .randomBytes(4)
    .toString('hex')}`;
  const finalFilename = `${cleanBaseName}_${uniqueId}.${ext}`;
  const targetDir = path.join(UPLOADS_ROOT_DIR, category);
  fs.mkdirSync(targetDir, { recursive: true });

  const filePath = path.join(targetDir, finalFilename);
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);

  const asset: StoredMediaAsset = {
    id: `media_${uniqueId}`,
    filename: finalFilename,
    category,
    mimeType,
    sizeBytes: buffer.length,
    url: `/uploads/${category}/${finalFilename}`,
    uploadedAt: new Date().toISOString(),
  };

  state.media = [asset, ...(state.media || []).filter((m) => m.url !== asset.url)];
  saveSelfHostedDatabase(state);
  return asset;
}

export function deleteUploadedFileFromDisk(
  state: ServerStoreState,
  idOrFilename: string
): boolean {
  const target = String(idOrFilename || '').trim();
  if (!target) return false;

  const found = (state.media || []).find(
    (m) => m.id === target || m.filename === target || m.url === target
  );

  if (found) {
    const diskPath = path.join(
      UPLOADS_ROOT_DIR,
      found.category,
      path.basename(found.filename)
    );
    try {
      if (fs.existsSync(diskPath)) {
        fs.unlinkSync(diskPath);
      }
    } catch {
      // ignore
    }
    state.media = (state.media || []).filter((m) => m.id !== found.id);
    saveSelfHostedDatabase(state);
    return true;
  }

  return false;
}
