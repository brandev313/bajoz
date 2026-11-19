/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Video,
  Upload,
  Sparkles,
  Check,
  X,
  Film,
  Eye,
  EyeOff,
  Sliders,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ManagedRecipe, QuickRecipeVideoConfig } from '../types/shop';
import { uploadMediaToServer } from '../lib/supabase';

interface AdminRecipesTabProps {
  showToast: (msg: string) => void;
}

const RECIPE_CATEGORIES: Array<{ value: ManagedRecipe['category']; label: string }> = [
  { value: 'chicken', label: 'Chicken' },
  { value: 'mutton', label: 'Mutton' },
  { value: 'beef', label: 'Beef' },
  { value: 'lentils', label: 'Daal / Lentils' },
  { value: 'vegetables', label: 'Vegetables / Sabzi' },
  { value: 'rice', label: 'Biryani / Rice' },
  { value: 'fish-roast', label: 'Fish & Roast' },
];

function formatMB(bytes?: number): string {
  if (!bytes || bytes <= 0) return '—';
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read selected file.'));
    reader.readAsDataURL(file);
  });
}

export const AdminRecipesTab: React.FC<AdminRecipesTabProps> = ({ showToast }) => {
  const {
    managedRecipes,
    upsertManagedRecipe,
    deleteManagedRecipe,
    quickRecipeVideo,
    updateQuickRecipeVideo,
    videoOptimization,
    updateVideoOptimization,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingRecipe, setEditingRecipe] = useState<ManagedRecipe | null>(null);
  const [isNewRecipe, setIsNewRecipe] = useState(false);

  const [quickVideoDraft, setQuickVideoDraft] =
    useState<QuickRecipeVideoConfig>(quickRecipeVideo);
  const [isUploadingQuickVideo, setIsUploadingQuickVideo] = useState(false);
  const [isUploadingQuickPoster, setIsUploadingQuickPoster] = useState(false);
  const [isUploadingRecipeVideo, setIsUploadingRecipeVideo] = useState(false);
  const [isUploadingRecipePoster, setIsUploadingRecipePoster] = useState(false);

  const [newIngredientLine, setNewIngredientLine] = useState('');
  const [newStepLine, setNewStepLine] = useState('');

  const uploadAndOptimizeVideo = async (file: File) => {
    const dataUrl = await readFileAsDataUrl(file);
    const resp = await fetch('/api/storage/upload-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl,
        filename: file.name,
        autoOptimize: videoOptimization.autoOptimizeOnUpload,
        maxResolution: videoOptimization.maxResolution,
        crfQuality: videoOptimization.crfQuality,
        fastStartStreaming: videoOptimization.fastStartStreaming,
        autoGeneratePoster: videoOptimization.autoGeneratePoster,
      }),
    });
    const json = await resp.json();
    if (!resp.ok || !json.ok) {
      throw new Error(json?.message || 'Video upload failed.');
    }
    return json as {
      ok: true;
      url: string;
      posterUrl?: string;
      optimized: boolean;
      originalBytes: number;
      optimizedBytes: number;
      savingsPercent: number;
    };
  };

  const reOptimizeExistingVideo = async (videoUrl: string) => {
    const resp = await fetch('/api/storage/optimize-existing-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoUrl,
        maxResolution: videoOptimization.maxResolution,
        crfQuality: videoOptimization.crfQuality,
        fastStartStreaming: videoOptimization.fastStartStreaming,
        autoGeneratePoster: videoOptimization.autoGeneratePoster,
      }),
    });
    const json = await resp.json();
    if (!resp.ok || !json.ok) {
      throw new Error(json?.message || 'Could not optimize video.');
    }
    return json as {
      ok: true;
      url: string;
      posterUrl?: string;
      optimized: boolean;
      originalBytes: number;
      optimizedBytes: number;
      savingsPercent: number;
    };
  };

  const handleQuickVideoFileUpload = async (file?: File) => {
    if (!file) return;
    setIsUploadingQuickVideo(true);
    try {
      const result = await uploadAndOptimizeVideo(file);
      const next: QuickRecipeVideoConfig = {
        ...quickVideoDraft,
        videoUrl: result.url,
        posterUrl: result.posterUrl || quickVideoDraft.posterUrl,
        optimized: result.optimized,
        originalBytes: result.originalBytes,
        optimizedBytes: result.optimizedBytes,
        savingsPercent: result.savingsPercent,
      };
      setQuickVideoDraft(next);
      updateQuickRecipeVideo(next);
      showToast(
        result.optimized
          ? `Uploaded & auto-optimized video (${formatMB(result.originalBytes)} → ${formatMB(result.optimizedBytes)}, saved ${result.savingsPercent}%).`
          : 'Uploaded Quick Recipe Video.'
      );
    } catch (err: any) {
      showToast(err?.message || 'Video upload failed.');
    } finally {
      setIsUploadingQuickVideo(false);
    }
  };

  const handleQuickPosterUpload = async (file?: File) => {
    if (!file) return;
    setIsUploadingQuickPoster(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const uploadedUrl = await uploadMediaToServer({
        dataUrl,
        filename: `spicemix-poster-${Date.now()}`,
        category: 'pages',
      });
      const finalPoster = uploadedUrl || dataUrl;
      const next = { ...quickVideoDraft, posterUrl: finalPoster };
      setQuickVideoDraft(next);
      updateQuickRecipeVideo(next);
      showToast('Updated custom video poster image.');
    } catch {
      showToast('Failed to upload poster image.');
    } finally {
      setIsUploadingQuickPoster(false);
    }
  };

  const handleOptimizeQuickVideoNow = async () => {
    if (!quickVideoDraft.videoUrl) return;
    setIsUploadingQuickVideo(true);
    try {
      const result = await reOptimizeExistingVideo(quickVideoDraft.videoUrl);
      const next: QuickRecipeVideoConfig = {
        ...quickVideoDraft,
        videoUrl: result.url,
        posterUrl:
          videoOptimization.autoGeneratePoster && result.posterUrl
            ? quickVideoDraft.posterUrl || result.posterUrl
            : quickVideoDraft.posterUrl,
        optimized: true,
        originalBytes: result.originalBytes,
        optimizedBytes: result.optimizedBytes,
        savingsPercent: result.savingsPercent,
      };
      setQuickVideoDraft(next);
      updateQuickRecipeVideo(next);
      showToast(
        `Optimized video for fast web streaming (${formatMB(result.originalBytes)} → ${formatMB(result.optimizedBytes)}, saved ${result.savingsPercent}%).`
      );
    } catch (err: any) {
      showToast(err?.message || 'Could not optimize video.');
    } finally {
      setIsUploadingQuickVideo(false);
    }
  };

  const handleRecipeVideoUpload = async (file?: File) => {
    if (!file || !editingRecipe) return;
    setIsUploadingRecipeVideo(true);
    try {
      const result = await uploadAndOptimizeVideo(file);
      setEditingRecipe({
        ...editingRecipe,
        videoUrl: result.url,
        posterUrl: editingRecipe.posterUrl || result.posterUrl,
        videoOptimized: result.optimized,
        videoOriginalBytes: result.originalBytes,
        videoOptimizedBytes: result.optimizedBytes,
        videoSavingsPercent: result.savingsPercent,
      });
      showToast(
        result.optimized
          ? `Recipe video auto-optimized (${formatMB(result.originalBytes)} → ${formatMB(result.optimizedBytes)}, saved ${result.savingsPercent}%).`
          : 'Recipe video uploaded.'
      );
    } catch (err: any) {
      showToast(err?.message || 'Recipe video upload failed.');
    } finally {
      setIsUploadingRecipeVideo(false);
    }
  };

  const handleRecipePosterUpload = async (file?: File) => {
    if (!file || !editingRecipe) return;
    setIsUploadingRecipePoster(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const uploadedUrl = await uploadMediaToServer({
        dataUrl,
        filename: `recipe-${editingRecipe.id}`,
        category: 'pages',
      });
      setEditingRecipe({
        ...editingRecipe,
        posterUrl: uploadedUrl || dataUrl,
      });
      showToast('Uploaded recipe poster image.');
    } catch {
      showToast('Could not upload recipe image.');
    } finally {
      setIsUploadingRecipePoster(false);
    }
  };

  const filteredRecipes = managedRecipes.filter((r) => {
    const matchesCat = categoryFilter === 'all' || r.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQ =
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.titleUr || '').toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  const openNewRecipeModal = () => {
    setIsNewRecipe(true);
    setNewIngredientLine('');
    setNewStepLine('');
    setEditingRecipe({
      id: `rec-${Date.now().toString(36)}`,
      title: '',
      titleUr: '',
      category: 'chicken',
      cookTime: '20 mins',
      servings: '4 people',
      baseWeight: '1 kg',
      spiceMixAmount: '2 tbsp BAJOZ SpiceMix',
      summary: '',
      ingredients: ['2 tbsp BAJOZ SpiceMix', '2 Medium Tomatoes (chopped)', '1 Medium Onion (sliced)'],
      steps: [
        'Heat oil and sauté sliced onions and chopped tomatoes until golden.',
        'Add your main ingredient with 2 tbsp BAJOZ SpiceMix and sear on medium flame.',
        'Cover and simmer until tender and aromatic. Garnish fresh and serve warm.',
      ],
      posterUrl: '/assets/spicemix-recipe-poster.jpg',
      videoUrl: '',
      videoDuration: '0:30',
      isPublished: true,
      featured: false,
      updatedAt: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-8 text-xs">
      {/* =====================================================================
          1. AUTOMATIC VIDEO OPTIMIZATION ENGINE SETTINGS
         ===================================================================== */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-[#5A4E38]/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE7C9] text-[#40563D] font-dm text-[11px] font-bold uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              <span>Performance & Fast-Load Engine</span>
            </span>
            <h2 className="text-xl sm:text-2xl text-[#40563D]">
              Automatic Recipe Video Optimization
            </h2>
            <p className="text-xs text-[#5A4E38]">
              Every uploaded recipe video is automatically compressed to web-ready H.264 MP4 with progressive fast-start streaming and poster extraction so your website loads fast and runs effortlessly.
            </p>
          </div>

          <label className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#F2EBD0] border border-[#5A4E38]/30 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={videoOptimization.autoOptimizeOnUpload}
              onChange={(e) => {
                updateVideoOptimization({
                  ...videoOptimization,
                  autoOptimizeOnUpload: e.target.checked,
                });
                showToast(
                  e.target.checked
                    ? 'Auto video optimization enabled for all future uploads.'
                    : 'Auto video optimization paused.'
                );
              }}
              className="accent-[#40563D] w-4 h-4"
            />
            <span className="font-dm font-bold text-[#40563D]">
              Auto-Optimize On Upload ({videoOptimization.autoOptimizeOnUpload ? 'ON' : 'OFF'})
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-[#F2EBD0]/70 border border-[#5A4E38]/15 space-y-1.5">
            <label className="block font-dm font-bold text-[#40563D]">Max Web Resolution</label>
            <select
              value={videoOptimization.maxResolution}
              onChange={(e) => {
                updateVideoOptimization({
                  ...videoOptimization,
                  maxResolution: e.target.value as '720p' | '480p',
                });
                showToast(`Video target resolution set to ${e.target.value}.`);
              }}
              className="w-full px-3 py-2 bg-white border border-[#5A4E38]/20 rounded-lg font-medium text-[#40563D]"
            >
              <option value="720p">720p HD Fast-Web (Recommended)</option>
              <option value="480p">480p Ultra-Light Mobile</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F2EBD0]/70 border border-[#5A4E38]/15 space-y-1.5">
            <label className="block font-dm font-bold text-[#40563D]">Compression Profile</label>
            <select
              value={videoOptimization.crfQuality}
              onChange={(e) => {
                updateVideoOptimization({
                  ...videoOptimization,
                  crfQuality: Number(e.target.value),
                });
                showToast('Updated video compression quality profile.');
              }}
              className="w-full px-3 py-2 bg-white border border-[#5A4E38]/20 rounded-lg font-medium text-[#40563D]"
            >
              <option value={23}>Crisp Studio (CRF 23)</option>
              <option value={26}>Balanced Fast-Web (CRF 26 · ~65% smaller)</option>
              <option value={28}>Max Speed / Compact (CRF 28)</option>
            </select>
          </div>

          <label className="p-3.5 rounded-xl bg-[#F2EBD0]/70 border border-[#5A4E38]/15 flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={videoOptimization.fastStartStreaming}
              onChange={(e) =>
                updateVideoOptimization({
                  ...videoOptimization,
                  fastStartStreaming: e.target.checked,
                })
              }
              className="accent-[#40563D] mt-0.5"
            />
            <div>
              <span className="font-dm font-bold text-[#40563D] block">
                Progressive +faststart
              </span>
              <span className="text-[11px] text-[#5A4E38]">
                Moves MP4 metadata to front for instant playback start.
              </span>
            </div>
          </label>

          <label className="p-3.5 rounded-xl bg-[#F2EBD0]/70 border border-[#5A4E38]/15 flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={videoOptimization.lazyLoadOnStorefront}
              onChange={(e) =>
                updateVideoOptimization({
                  ...videoOptimization,
                  lazyLoadOnStorefront: e.target.checked,
                })
              }
              className="accent-[#40563D] mt-0.5"
            />
            <div>
              <span className="font-dm font-bold text-[#40563D] block">
                Lazy Storefront Preload
              </span>
              <span className="text-[11px] text-[#5A4E38]">
                Loads poster first & streams video only when scrolled into view.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* =====================================================================
          2. SPICEMIX 30-SECOND QUICK RECIPE VIDEO MANAGER
         ===================================================================== */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-[#5A4E38]/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F390] text-[#5A4E38] font-dm text-[11px] font-bold uppercase tracking-wider">
              <Film className="w-3.5 h-3.5" />
              <span>SpiceMix Page Feature</span>
            </span>
            <h2 className="text-xl sm:text-2xl text-[#40563D] mt-1.5">
              Quick Recipe Video (30-Second Cooking Demo)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F2EBD0] border border-[#5A4E38]/25 cursor-pointer">
              <input
                type="checkbox"
                checked={quickVideoDraft.enabled}
                onChange={(e) => {
                  const next = { ...quickVideoDraft, enabled: e.target.checked };
                  setQuickVideoDraft(next);
                  updateQuickRecipeVideo(next);
                }}
                className="accent-[#40563D]"
              />
              <span className="font-semibold text-[#40563D]">Show on SpiceMix Page</span>
            </label>

            <button
              type="button"
              onClick={() => {
                updateQuickRecipeVideo(quickVideoDraft);
                showToast('Saved Quick Recipe Video settings.');
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#40563D] hover:bg-[#5A4E38] text-[#F2EBD0] font-semibold uppercase tracking-wider cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Video Settings</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 5 cols: Live Preview & Upload Controls */}
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-2xl overflow-hidden border-2 border-[#5A4E38] bg-[#243122] aspect-video">
              <video
                key={`${quickVideoDraft.videoUrl}-${quickVideoDraft.posterUrl}`}
                src={quickVideoDraft.videoUrl}
                poster={quickVideoDraft.posterUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>

            {quickVideoDraft.optimized && (
              <div className="p-3 rounded-xl bg-[#DCE7C9]/65 border border-[#40563D]/25 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#40563D]">
                <span className="inline-flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Web-Optimized MP4 (+faststart)
                </span>
                <span className="font-mono font-bold">
                  {formatMB(quickVideoDraft.originalBytes)} → {formatMB(quickVideoDraft.optimizedBytes)}
                  {quickVideoDraft.savingsPercent ? ` (-${quickVideoDraft.savingsPercent}%)` : ''}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E9F390] hover:bg-[#DCE7C9] text-[#5A4E38] border border-[#5A4E38] font-bold cursor-pointer">
                {isUploadingQuickVideo ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>
                  {isUploadingQuickVideo ? 'Optimizing Video...' : 'Upload & Auto-Optimize Video'}
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  disabled={isUploadingQuickVideo}
                  onChange={(e) => handleQuickVideoFileUpload(e.target.files?.[0])}
                  className="hidden"
                />
              </label>

              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F2EBD0] hover:bg-[#DCE7C9] text-[#40563D] border border-[#5A4E38]/40 font-semibold cursor-pointer">
                {isUploadingQuickPoster ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5" />
                )}
                <span>Upload Poster</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingQuickPoster}
                  onChange={(e) => handleQuickPosterUpload(e.target.files?.[0])}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                disabled={isUploadingQuickVideo || !quickVideoDraft.videoUrl}
                onClick={handleOptimizeQuickVideoNow}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F2EBD0] text-[#40563D] border border-[#5A4E38]/40 font-semibold cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Re-Optimize Now</span>
              </button>
            </div>
          </div>

          {/* Right 7 cols: Title, Copy, URLs & Chapters */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Sub-Headline Kicker</label>
                <input
                  type="text"
                  value={quickVideoDraft.kicker}
                  onChange={(e) =>
                    setQuickVideoDraft({ ...quickVideoDraft, kicker: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Duration Badge</label>
                <input
                  type="text"
                  value={quickVideoDraft.durationLabel}
                  onChange={(e) =>
                    setQuickVideoDraft({ ...quickVideoDraft, durationLabel: e.target.value })
                  }
                  placeholder="0:30"
                  className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Section Heading</label>
              <input
                type="text"
                value={quickVideoDraft.title}
                onChange={(e) =>
                  setQuickVideoDraft({ ...quickVideoDraft, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                rows={2}
                value={quickVideoDraft.subtitle}
                onChange={(e) =>
                  setQuickVideoDraft({ ...quickVideoDraft, subtitle: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Video File URL</label>
                <input
                  type="text"
                  value={quickVideoDraft.videoUrl}
                  onChange={(e) =>
                    setQuickVideoDraft({ ...quickVideoDraft, videoUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Custom Poster Image URL</label>
                <input
                  type="text"
                  value={quickVideoDraft.posterUrl}
                  onChange={(e) =>
                    setQuickVideoDraft({ ...quickVideoDraft, posterUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. RECIPE GUIDE PAGE FULL CRUD (CREATE, READ, UPDATE, DELETE)
         ===================================================================== */}
      <div className="space-y-5">
        <div className="bg-white p-5 rounded-2xl border-2 border-[#5A4E38]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl text-[#40563D]">
              Recipe Guide Recipes ({managedRecipes.length})
            </h2>
            <p className="text-xs text-[#5A4E38] mt-0.5">
              Add, update, publish, attach optimized recipe videos, or delete recipes displayed live on the Recipe Guide page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..."
                className="w-full pl-9 pr-3 py-2 bg-[#F2EBD0] border border-[#5A4E38]/20 rounded-full text-xs text-[#40563D]"
              />
              <Search className="w-3.5 h-3.5 text-[#5A4E38] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-[#F2EBD0] border border-[#5A4E38]/20 rounded-full text-xs font-semibold text-[#40563D]"
            >
              <option value="all">All Categories</option>
              {RECIPE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={openNewRecipeModal}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#40563D] hover:bg-[#5A4E38] text-[#F2EBD0] font-semibold uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Recipe</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((recipe) => (
            <article
              key={recipe.id}
              className="bg-white rounded-2xl border-2 border-[#5A4E38]/25 overflow-hidden flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="relative aspect-[16/10] bg-[#F2EBD0] overflow-hidden border-b border-[#5A4E38]/20">
                  {recipe.posterUrl ? (
                    <img
                      src={recipe.posterUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#5A4E38]">
                      <Video className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#40563D]/90 text-[#F2EBD0] font-dm text-[10px] font-bold uppercase tracking-wider">
                      {recipe.category}
                    </span>
                    {recipe.videoUrl && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E9F390] text-[#5A4E38] border border-[#5A4E38] font-dm text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                        <Film className="w-3 h-3" />
                        <span>{recipe.videoOptimized ? 'Optimized Video' : 'Video'}</span>
                      </span>
                    )}
                  </div>
                  <span
                    className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      recipe.isPublished
                        ? 'bg-[#DCE7C9] text-[#40563D]'
                        : 'bg-[#FEE2E2] text-[#991B1B]'
                    }`}
                  >
                    {recipe.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-lg text-[#40563D] leading-snug">{recipe.title}</h3>
                  <p className="text-xs text-[#5A4E38] line-clamp-2 leading-relaxed">
                    {recipe.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-[#40563D]">
                    <span className="px-2.5 py-1 rounded-lg bg-[#F2EBD0]">
                      {recipe.spiceMixAmount}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#F2EBD0]">
                      {recipe.cookTime}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#F2EBD0]">
                      {recipe.ingredients.length} ingredients · {recipe.steps.length} steps
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-[#F2EBD0]/45 border-t border-[#5A4E38]/15 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewRecipe(false);
                    setNewIngredientLine('');
                    setNewStepLine('');
                    setEditingRecipe({
                      ...recipe,
                      ingredients: [...recipe.ingredients],
                      steps: [...recipe.steps],
                    });
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-[#E9F390] text-[#40563D] border border-[#5A4E38]/30 font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Recipe</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    upsertManagedRecipe({
                      ...recipe,
                      isPublished: !recipe.isPublished,
                      updatedAt: new Date().toISOString().split('T')[0],
                    });
                    showToast(
                      recipe.isPublished
                        ? `Unpublished "${recipe.title}".`
                        : `Published "${recipe.title}" to Recipe Guide.`
                    );
                  }}
                  className="p-2 rounded-xl bg-white hover:bg-[#DCE7C9] text-[#40563D] border border-[#5A4E38]/30 cursor-pointer"
                  title={recipe.isPublished ? 'Unpublish Recipe' : 'Publish Recipe'}
                >
                  {recipe.isPublished ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    deleteManagedRecipe(recipe.id);
                    showToast(`Deleted recipe "${recipe.title}".`);
                  }}
                  className="p-2 rounded-xl bg-white hover:bg-[#FEE2E2] text-[#991B1B] border border-[#5A4E38]/20 cursor-pointer"
                  title="Delete Recipe"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* =====================================================================
          MODAL: CREATE / EDIT RECIPE + AUTO-OPTIMIZED VIDEO UPLOAD
         ===================================================================== */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#40563D]/70 backdrop-blur-2xs">
          <div className="bg-[#F2EBD0] text-[#40563D] w-full max-w-4xl rounded-3xl shadow-2xl border-2 border-[#5A4E38] max-h-[94vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 bg-white border-b border-[#5A4E38]/20 flex items-center justify-between gap-3">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#5A4E38] font-bold">
                  {isNewRecipe ? 'New Recipe Guide Entry' : `Editing Recipe · ${editingRecipe.id}`}
                </span>
                <h3 className="text-xl text-[#40563D]">
                  {editingRecipe.title || 'Untitled Recipe'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingRecipe(null)}
                className="p-1.5 rounded-full text-[#5A4E38] hover:text-[#40563D] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingRecipe.title.trim()) return;
                upsertManagedRecipe({
                  ...editingRecipe,
                  title: editingRecipe.title.trim(),
                  updatedAt: new Date().toISOString().split('T')[0],
                });
                showToast(
                  isNewRecipe
                    ? `Added "${editingRecipe.title}" to Recipe Guide!`
                    : `Updated recipe "${editingRecipe.title}".`
                );
                setEditingRecipe(null);
              }}
              className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs"
            >
              {/* Core Fields */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#5A4E38]/15 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1">Recipe Title (English) *</label>
                    <input
                      type="text"
                      required
                      value={editingRecipe.title}
                      onChange={(e) =>
                        setEditingRecipe({ ...editingRecipe, title: e.target.value })
                      }
                      placeholder="e.g. Lahori Chicken Karahi"
                      className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Category *</label>
                    <select
                      value={editingRecipe.category}
                      onChange={(e) =>
                        setEditingRecipe({
                          ...editingRecipe,
                          category: e.target.value as ManagedRecipe['category'],
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl"
                    >
                      {RECIPE_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Urdu Title (Optional)</label>
                    <input
                      type="text"
                      value={editingRecipe.titleUr || ''}
                      onChange={(e) =>
                        setEditingRecipe({ ...editingRecipe, titleUr: e.target.value })
                      }
                      placeholder="لاہوری کڑاہی"
                      className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">SpiceMix Dosage *</label>
                    <input
                      type="text"
                      required
                      value={editingRecipe.spiceMixAmount}
                      onChange={(e) =>
                        setEditingRecipe({
                          ...editingRecipe,
                          spiceMixAmount: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Cook Time</label>
                    <input
                      type="text"
                      value={editingRecipe.cookTime}
                      onChange={(e) =>
                        setEditingRecipe({ ...editingRecipe, cookTime: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Servings</label>
                    <input
                      type="text"
                      value={editingRecipe.servings}
                      onChange={(e) =>
                        setEditingRecipe({ ...editingRecipe, servings: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Short Summary</label>
                  <textarea
                    rows={2}
                    value={editingRecipe.summary}
                    onChange={(e) =>
                      setEditingRecipe({ ...editingRecipe, summary: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-5 pt-1">
                  <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingRecipe.isPublished}
                      onChange={(e) =>
                        setEditingRecipe({
                          ...editingRecipe,
                          isPublished: e.target.checked,
                        })
                      }
                      className="accent-[#40563D]"
                    />
                    <span>Published on Recipe Guide</span>
                  </label>
                  <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingRecipe.featured)}
                      onChange={(e) =>
                        setEditingRecipe({
                          ...editingRecipe,
                          featured: e.target.checked,
                        })
                      }
                      className="accent-[#40563D]"
                    />
                    <span>Featured Recipe</span>
                  </label>
                </div>
              </div>

              {/* Recipe Video & Poster Upload (with Auto-Optimization) */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#5A4E38]/15 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base text-[#40563D]">
                    Recipe Video & Poster Image (Auto-Optimization:{' '}
                    {videoOptimization.autoOptimizeOnUpload ? 'ON' : 'OFF'})
                  </h4>
                  {editingRecipe.videoOptimized && (
                    <span className="px-2.5 py-1 rounded-full bg-[#DCE7C9] text-[#40563D] font-mono text-[10px] font-bold">
                      Optimized {formatMB(editingRecipe.videoOriginalBytes)} →{' '}
                      {formatMB(editingRecipe.videoOptimizedBytes)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block font-semibold">Recipe Video URL</label>
                    <input
                      type="text"
                      value={editingRecipe.videoUrl || ''}
                      onChange={(e) =>
                        setEditingRecipe({ ...editingRecipe, videoUrl: e.target.value })
                      }
                      placeholder="/uploads/videos/... or https://..."
                      className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl font-mono text-[11px]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E9F390] hover:bg-[#DCE7C9] text-[#5A4E38] border border-[#5A4E38] font-bold cursor-pointer">
                      {isUploadingRecipeVideo ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isUploadingRecipeVideo
                          ? 'Uploading & Optimizing...'
                          : 'Upload Recipe Video (Auto-Optimize)'}
                      </span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        disabled={isUploadingRecipeVideo}
                        onChange={(e) => handleRecipeVideoUpload(e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-semibold">Custom Poster Image URL</label>
                    <input
                      type="text"
                      value={editingRecipe.posterUrl || ''}
                      onChange={(e) =>
                        setEditingRecipe({ ...editingRecipe, posterUrl: e.target.value })
                      }
                      placeholder="/assets/..."
                      className="w-full px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl font-mono text-[11px]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F2EBD0] hover:bg-[#DCE7C9] text-[#40563D] border border-[#5A4E38]/40 font-semibold cursor-pointer">
                      {isUploadingRecipePoster ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5" />
                      )}
                      <span>Upload Poster Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingRecipePoster}
                        onChange={(e) => handleRecipePosterUpload(e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Ingredients CRUD */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#5A4E38]/15 space-y-3">
                <h4 className="text-base text-[#40563D]">
                  Ingredients ({editingRecipe.ingredients.length})
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIngredientLine}
                    onChange={(e) => setNewIngredientLine(e.target.value)}
                    placeholder="Add an ingredient (e.g. 1 kg Bone-in Chicken)..."
                    className="flex-1 px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newIngredientLine.trim()) return;
                      setEditingRecipe({
                        ...editingRecipe,
                        ingredients: [...editingRecipe.ingredients, newIngredientLine.trim()],
                      });
                      setNewIngredientLine('');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#40563D] text-white font-semibold cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {editingRecipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ing}
                        onChange={(e) => {
                          const next = [...editingRecipe.ingredients];
                          next[idx] = e.target.value;
                          setEditingRecipe({ ...editingRecipe, ingredients: next });
                        }}
                        className="flex-1 px-3 py-1.5 bg-[#F2EBD0]/60 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingRecipe({
                            ...editingRecipe,
                            ingredients: editingRecipe.ingredients.filter((_, i) => i !== idx),
                          })
                        }
                        className="p-1.5 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking Steps CRUD */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#5A4E38]/15 space-y-3">
                <h4 className="text-base text-[#40563D]">
                  Cooking Steps ({editingRecipe.steps.length})
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newStepLine}
                    onChange={(e) => setNewStepLine(e.target.value)}
                    placeholder="Add next cooking step..."
                    className="flex-1 px-3 py-2 bg-[#F2EBD0]/70 border border-[#5A4E38]/20 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newStepLine.trim()) return;
                      setEditingRecipe({
                        ...editingRecipe,
                        steps: [...editingRecipe.steps, newStepLine.trim()],
                      });
                      setNewStepLine('');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#40563D] text-white font-semibold cursor-pointer"
                  >
                    + Add Step
                  </button>
                </div>
                <div className="space-y-2">
                  {editingRecipe.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#DCE7C9] text-[#40563D] font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-1">
                        {idx + 1}
                      </span>
                      <textarea
                        rows={2}
                        value={step}
                        onChange={(e) => {
                          const next = [...editingRecipe.steps];
                          next[idx] = e.target.value;
                          setEditingRecipe({ ...editingRecipe, steps: next });
                        }}
                        className="flex-1 px-3 py-1.5 bg-[#F2EBD0]/60 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingRecipe({
                            ...editingRecipe,
                            steps: editingRecipe.steps.filter((_, i) => i !== idx),
                          })
                        }
                        className="p-1.5 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg cursor-pointer mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecipe(null)}
                  className="px-5 py-2.5 rounded-full bg-white border border-[#5A4E38]/25 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#40563D] hover:bg-[#5A4E38] text-[#F2EBD0] font-semibold uppercase tracking-wider cursor-pointer"
                >
                  {isNewRecipe ? 'Create Recipe' : 'Save Recipe Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
