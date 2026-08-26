import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, ArrowLeft, Music, MessageSquare, Ticket, RotateCcw, Check, X, Image, Heart, Download, Upload, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { StoreData, MessageResult, SongResult, CouponResult, CatResult, RandomImageResult } from '../types';
import { loadStoreData, saveStoreData, resetStoreToDefaults, extractSpotifyTrackId } from '../hooks/useAdminData';

const PASTEL_COLORS = ['#FFB3C6', '#E8D5FF', '#B8E4FF', '#FFE5A0', '#B8F0D0', '#FFD6B8', '#F0B8D4'];

type Tab = 'messages' | 'cats' | 'randomImages' | 'songs' | 'coupons';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('messages');
  const [store, setStore] = useState<StoreData>({ messages: [], songs: [], coupons: [], cats: [], randomImages: [] });
  const [savedNotice, setSavedNotice] = useState(false);

  // Edit Modal states
  const [editingItem, setEditingItem] = useState<MessageResult | SongResult | CouponResult | CatResult | RandomImageResult | null>(null);

  // New item form states
  const [newMessageText, setNewMessageText] = useState('');
  const [newMessageColor, setNewMessageColor] = useState('#FFB3C6');

  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatUrl, setNewCatUrl] = useState('');
  const [newCatCaption, setNewCatCaption] = useState('');

  const [newRandomTitle, setNewRandomTitle] = useState('');
  const [newRandomUrl, setNewRandomUrl] = useState('');
  const [newRandomCaption, setNewRandomCaption] = useState('');

  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongSpotify, setNewSongSpotify] = useState('');
  const [newSongEmoji, setNewSongEmoji] = useState('🎵');

  const [newCouponTitle, setNewCouponTitle] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponValid, setNewCouponValid] = useState('');
  const [newCouponEmoji, setNewCouponEmoji] = useState('🎟️');

  useEffect(() => {
    setStore(loadStoreData());
  }, []);

  const persist = (updated: StoreData) => {
    setStore(updated);
    saveStoreData(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan semua data ke pengaturan awal (default)?')) {
      const defs = resetStoreToDefaults();
      setStore(defs);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    }
  };

  // ── DATABASE EXPORT / IMPORT ──
  const handleExportDB = () => {
    const jsonStr = JSON.stringify(store, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gachapon-database-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDB = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          const updatedStore: StoreData = {
            messages: Array.isArray(parsed.messages) ? parsed.messages : store.messages,
            songs: Array.isArray(parsed.songs) ? parsed.songs : store.songs,
            coupons: Array.isArray(parsed.coupons) ? parsed.coupons : store.coupons,
            cats: Array.isArray(parsed.cats) ? parsed.cats : store.cats,
            randomImages: Array.isArray(parsed.randomImages) ? parsed.randomImages : store.randomImages,
          };
          persist(updatedStore);
          alert('Database JSON berhasil di-import & disinkronkan!');
        }
      } catch (err) {
        alert('Format file JSON database tidak valid!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── MESSAGES CRUD ──
  const addMessage = () => {
    if (!newMessageText.trim()) return;
    const newItem: MessageResult = {
      type: 'message',
      id: `msg-${Date.now()}`,
      text: newMessageText.trim(),
      color: newMessageColor,
    };
    persist({ ...store, messages: [newItem, ...(store.messages || [])] });
    setNewMessageText('');
  };

  const deleteMessage = (id: string) => {
    persist({ ...store, messages: store.messages.filter((m) => m.id !== id) });
  };

  // ── CATS CRUD ──
  const addCat = () => {
    if (!newCatTitle.trim() || !newCatUrl.trim()) return;
    const newItem: CatResult = {
      type: 'cat',
      id: `cat-${Date.now()}`,
      title: newCatTitle.trim(),
      imageUrl: newCatUrl.trim(),
      caption: newCatCaption.trim() || 'Kucing cute buat kamu! ♡',
      tag: 'Cute Cat',
    };
    persist({ ...store, cats: [newItem, ...(store.cats || [])] });
    setNewCatTitle(''); setNewCatUrl(''); setNewCatCaption('');
  };

  const deleteCat = (id: string) => {
    persist({ ...store, cats: store.cats.filter((c) => c.id !== id) });
  };

  // ── RANDOM IMAGES CRUD ──
  const addRandomImage = () => {
    if (!newRandomTitle.trim() || !newRandomUrl.trim()) return;
    const newItem: RandomImageResult = {
      type: 'random_image',
      id: `rnd-${Date.now()}`,
      title: newRandomTitle.trim(),
      imageUrl: newRandomUrl.trim(),
      caption: newRandomCaption.trim() || 'Gambar aesthetic spesial untukmu ✨',
      tag: 'Aesthetic',
    };
    persist({ ...store, randomImages: [newItem, ...(store.randomImages || [])] });
    setNewRandomTitle(''); setNewRandomUrl(''); setNewRandomCaption('');
  };

  const deleteRandomImage = (id: string) => {
    persist({ ...store, randomImages: store.randomImages.filter((r) => r.id !== id) });
  };

  // ── SONGS CRUD ──
  const addSong = () => {
    if (!newSongSpotify.trim()) return;
    const trackId = extractSpotifyTrackId(newSongSpotify) || undefined;
    const newItem: SongResult = {
      type: 'song',
      id: `song-${Date.now()}`,
      title: newSongTitle.trim() || 'Lagu Spotify Spesial',
      artist: 'Spotify',
      album: 'Spotify',
      coverEmoji: newSongEmoji,
      coverColor: '#E8D5FF',
      duration: 180,
      spotifyUrl: newSongSpotify.trim(),
      spotifyTrackId: trackId,
    };
    persist({ ...store, songs: [newItem, ...(store.songs || [])] });
    setNewSongTitle(''); setNewSongSpotify('');
  };

  const deleteSong = (id: string) => {
    persist({ ...store, songs: store.songs.filter((s) => s.id !== id) });
  };

  // ── COUPONS CRUD ──
  const addCoupon = () => {
    if (!newCouponTitle.trim() || !newCouponDesc.trim()) return;
    const code = newCouponTitle.trim().toUpperCase().replace(/\s+/g, '-').slice(0, 10) + '-' + Math.floor(Math.random() * 900 + 100);
    const newItem: CouponResult = {
      type: 'coupon',
      id: `coupon-${Date.now()}`,
      title: newCouponTitle.trim().toUpperCase(),
      description: newCouponDesc.trim(),
      emoji: newCouponEmoji,
      color: '#E84B7E',
      bgColor: '#FFD6E0',
      validText: newCouponValid.trim() || 'Berlaku kapan saja',
      code,
    };
    persist({ ...store, coupons: [newItem, ...(store.coupons || [])] });
    setNewCouponTitle(''); setNewCouponDesc(''); setNewCouponValid('');
  };

  const deleteCoupon = (id: string) => {
    persist({ ...store, coupons: store.coupons.filter((c) => c.id !== id) });
  };

  // ── UPDATE ITEM ──
  const handleSaveEdit = () => {
    if (!editingItem) return;
    if (editingItem.type === 'message') {
      persist({
        ...store,
        messages: store.messages.map((m) => (m.id === editingItem.id ? (editingItem as MessageResult) : m)),
      });
    } else if (editingItem.type === 'cat') {
      persist({
        ...store,
        cats: store.cats.map((c) => (c.id === editingItem.id ? (editingItem as CatResult) : c)),
      });
    } else if (editingItem.type === 'random_image') {
      persist({
        ...store,
        randomImages: store.randomImages.map((r) => (r.id === editingItem.id ? (editingItem as RandomImageResult) : r)),
      });
    } else if (editingItem.type === 'song') {
      const song = editingItem as SongResult;
      song.spotifyTrackId = song.spotifyUrl ? extractSpotifyTrackId(song.spotifyUrl) || undefined : undefined;
      persist({
        ...store,
        songs: store.songs.map((s) => (s.id === editingItem.id ? song : s)),
      });
    } else if (editingItem.type === 'coupon') {
      persist({
        ...store,
        coupons: store.coupons.map((c) => (c.id === editingItem.id ? (editingItem as CouponResult) : c)),
      });
    }
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: 'linear-gradient(160deg,#fff0f5 0%,#fde8ee 40%,#f3e6ff 80%,#fff0f5 100%)' }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-pink-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-nunito text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 transition-all"
            >
              <ArrowLeft size={16} /> Ke Website Utama
            </button>
            <div>
              <h1 className="font-pacifico text-lg text-pink-600">Admin Secret Gate 🔐</h1>
              <p className="font-quicksand text-xs text-pink-400">Database & Master Control</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportDB}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-nunito text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 transition-all"
              title="Export Database JSON"
            >
              <Download size={14} /> Export DB
            </button>
            <label className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-nunito text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-all cursor-pointer">
              <Upload size={14} /> Import DB
              <input type="file" accept=".json" onChange={handleImportDB} className="hidden" />
            </label>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-nunito text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
              title="Reset ke Default"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        {/* Saved Toast Notification */}
        <AnimatePresence>
          {savedNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-xl bg-emerald-500 text-white font-nunito font-bold text-sm flex items-center gap-2 shadow-lg"
            >
              <Check size={18} /> Database Berhasil Disimpan & Disinkronkan!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Database Status Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-white/80 border border-pink-200 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600">
              <Database size={20} />
            </div>
            <div>
              <p className="font-nunito font-bold text-sm text-pink-950">Database Status: AKTIF (Deploy-Ready ✅)</p>
              <p className="font-quicksand text-xs text-pink-700 opacity-80">
                Data tersimpan otomatis di browser database local storage & siap untuk di-deploy ke Vercel / Netlify / Cloudflare.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 mb-6 p-1.5 rounded-2xl bg-pink-100/60 flex-wrap">
          {[
            { key: 'messages' as Tab, label: 'Pesan', icon: <MessageSquare size={15} />, count: (store.messages || []).length, color: '#E84B7E' },
            { key: 'cats' as Tab, label: 'Kucing', icon: <Heart size={15} />, count: (store.cats || []).length, color: '#FF7B54' },
            { key: 'randomImages' as Tab, label: 'Gambar', icon: <Image size={15} />, count: (store.randomImages || []).length, color: '#38BDF8' },
            { key: 'songs' as Tab, label: 'Lagu', icon: <Music size={15} />, count: (store.songs || []).length, color: '#9A56F5' },
            { key: 'coupons' as Tab, label: 'Kupon', icon: <Ticket size={15} />, count: (store.coupons || []).length, color: '#E84B7E' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-nunito text-xs sm:text-sm transition-all"
              style={{
                fontWeight: 800,
                background: activeTab === tab.key ? `linear-gradient(135deg, ${tab.color}, ${tab.color}DD)` : 'transparent',
                color: activeTab === tab.key ? 'white' : '#9C6B7F',
                boxShadow: activeTab === tab.key ? `0 4px 14px ${tab.color}44` : 'none',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── MESSAGES TAB ── */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-200">
              <h3 className="font-nunito font-bold text-sm text-pink-600 mb-2 flex items-center gap-1.5">
                <Plus size={16} /> Tambah Pesan Baru
              </h3>
              <textarea
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Tulis pesan manis di sini..."
                className="w-full rounded-xl p-3 border border-pink-200 font-quicksand text-sm focus:outline-pink-400 mb-3"
                rows={2}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-quicksand text-gray-500">Warna:</span>
                  {PASTEL_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewMessageColor(c)}
                      className={`w-6 h-6 rounded-full border-2 ${newMessageColor === c ? 'border-pink-600 scale-110' : 'border-transparent'}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <button
                  onClick={addMessage}
                  disabled={!newMessageText.trim()}
                  className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-nunito font-bold text-xs transition-all flex items-center gap-1 shadow-md"
                >
                  <Plus size={14} /> Simpan Pesan
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {(store.messages || []).map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-4 h-4 rounded-full mt-1 flex-shrink-0" style={{ background: m.color }} />
                    <p className="font-quicksand text-sm text-gray-800 leading-relaxed">"{m.text}"</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem({ ...m })}
                      className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => deleteMessage(m.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CATS TAB ── */}
        {activeTab === 'cats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-200">
              <h3 className="font-nunito font-bold text-sm text-orange-600 mb-3 flex items-center gap-1.5">
                <Plus size={16} /> Tambah Gambar Kucing Cute Baru
              </h3>
              <div className="space-y-3 mb-3">
                <input
                  type="text"
                  value={newCatTitle}
                  onChange={(e) => setNewCatTitle(e.target.value)}
                  placeholder="Judul / Nama Kucing *"
                  className="w-full rounded-xl p-3 border border-orange-200 font-quicksand text-sm focus:outline-orange-400"
                />
                <input
                  type="text"
                  value={newCatUrl}
                  onChange={(e) => setNewCatUrl(e.target.value)}
                  placeholder="URL Gambar Kucing (https://...) *"
                  className="w-full rounded-xl p-3 border border-orange-200 font-quicksand text-sm focus:outline-orange-400"
                />
                <input
                  type="text"
                  value={newCatCaption}
                  onChange={(e) => setNewCatCaption(e.target.value)}
                  placeholder="Pesan / Caption Manis untuk Kucing ini"
                  className="w-full rounded-xl p-3 border border-orange-200 font-quicksand text-sm focus:outline-orange-400"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={addCat}
                  disabled={!newCatTitle.trim() || !newCatUrl.trim()}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-nunito font-bold text-xs transition-all flex items-center gap-1 shadow-md"
                >
                  <Plus size={14} /> Simpan Gambar Kucing
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {(store.cats || []).map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-orange-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={c.imageUrl} alt={c.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-orange-50" />
                    <div className="min-w-0">
                      <p className="font-nunito font-bold text-sm text-gray-800 truncate">{c.title}</p>
                      <p className="font-quicksand text-xs text-gray-500 truncate">"{c.caption}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem({ ...c })}
                      className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => deleteCat(c.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RANDOM IMAGES TAB ── */}
        {activeTab === 'randomImages' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-sky-200">
              <h3 className="font-nunito font-bold text-sm text-sky-600 mb-3 flex items-center gap-1.5">
                <Plus size={16} /> Tambah Gambar Random Aesthetic Baru
              </h3>
              <div className="space-y-3 mb-3">
                <input
                  type="text"
                  value={newRandomTitle}
                  onChange={(e) => setNewRandomTitle(e.target.value)}
                  placeholder="Judul Gambar *"
                  className="w-full rounded-xl p-3 border border-sky-200 font-quicksand text-sm focus:outline-sky-400"
                />
                <input
                  type="text"
                  value={newRandomUrl}
                  onChange={(e) => setNewRandomUrl(e.target.value)}
                  placeholder="URL Gambar (https://...) *"
                  className="w-full rounded-xl p-3 border border-sky-200 font-quicksand text-sm focus:outline-sky-400"
                />
                <input
                  type="text"
                  value={newRandomCaption}
                  onChange={(e) => setNewRandomCaption(e.target.value)}
                  placeholder="Pesan / Caption Manis"
                  className="w-full rounded-xl p-3 border border-sky-200 font-quicksand text-sm focus:outline-sky-400"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={addRandomImage}
                  disabled={!newRandomTitle.trim() || !newRandomUrl.trim()}
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-nunito font-bold text-xs transition-all flex items-center gap-1 shadow-md"
                >
                  <Plus size={14} /> Simpan Gambar Aesthetic
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {(store.randomImages || []).map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-sky-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={r.imageUrl} alt={r.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-sky-50" />
                    <div className="min-w-0">
                      <p className="font-nunito font-bold text-sm text-gray-800 truncate">{r.title}</p>
                      <p className="font-quicksand text-xs text-gray-500 truncate">"{r.caption}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem({ ...r })}
                      className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => deleteRandomImage(r.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SONGS TAB ── */}
        {activeTab === 'songs' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-200">
              <h3 className="font-nunito font-bold text-sm text-purple-600 mb-3 flex items-center gap-1.5">
                <Plus size={16} /> Tambah Lagu Spotify Baru
              </h3>
              <div className="space-y-3 mb-3">
                <input
                  type="text"
                  value={newSongTitle}
                  onChange={(e) => setNewSongTitle(e.target.value)}
                  placeholder="Nama / Judul Lagu (misal: Lover - Taylor Swift)"
                  className="w-full rounded-xl p-3 border border-purple-200 font-quicksand text-sm focus:outline-purple-400"
                />
                <input
                  type="text"
                  value={newSongSpotify}
                  onChange={(e) => setNewSongSpotify(e.target.value)}
                  placeholder="Link Spotify (misal: https://open.spotify.com/track/...) *"
                  className="w-full rounded-xl p-3 border border-purple-200 font-quicksand text-sm focus:outline-purple-400"
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-quicksand text-gray-500">Ikon Cover:</span>
                  {['🎵', '🌸', '💖', '✨', '⭐', '🌙'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewSongEmoji(emoji)}
                      className={`text-lg p-1.5 rounded-xl ${newSongEmoji === emoji ? 'bg-purple-100 scale-110' : ''}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <button
                  onClick={addSong}
                  disabled={!newSongSpotify.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-nunito font-bold text-xs transition-all flex items-center gap-1 shadow-md"
                >
                  <Plus size={14} /> Simpan Lagu
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {(store.songs || []).map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: s.coverColor || '#E8D5FF' }}
                    >
                      {s.coverEmoji || '🎵'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-nunito font-bold text-sm text-gray-800 truncate">{s.title || 'Lagu Spotify'}</p>
                      <p className="font-quicksand text-xs text-emerald-600 truncate">
                        {s.spotifyUrl}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem({ ...s })}
                      className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => deleteSong(s.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COUPONS TAB ── */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-200">
              <h3 className="font-nunito font-bold text-sm text-orange-600 mb-3 flex items-center gap-1.5">
                <Plus size={16} /> Tambah Kupon Baru
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={newCouponTitle}
                  onChange={(e) => setNewCouponTitle(e.target.value)}
                  placeholder="Judul Kupon (mis: MAKAN GRATIS) *"
                  className="rounded-xl p-2.5 border border-orange-200 font-quicksand text-sm"
                />
                <input
                  type="text"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  placeholder="Deskripsi Kupon *"
                  className="rounded-xl p-2.5 border border-orange-200 font-quicksand text-sm"
                />
              </div>
              <input
                type="text"
                value={newCouponValid}
                onChange={(e) => setNewCouponValid(e.target.value)}
                placeholder="Catatan / Syarat Berlaku (opsional)"
                className="w-full rounded-xl p-2.5 border border-orange-200 font-quicksand text-sm mb-3"
              />

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-quicksand text-gray-500">Ikon Emoji:</span>
                  {['🎟️', '🍽️', '🎬', '☕', '🎁', '🤗'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewCouponEmoji(emoji)}
                      className={`text-lg p-1 rounded-lg ${newCouponEmoji === emoji ? 'bg-orange-100' : ''}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <button
                  onClick={addCoupon}
                  disabled={!newCouponTitle.trim() || !newCouponDesc.trim()}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-nunito font-bold text-xs transition-all flex items-center gap-1 shadow-md"
                >
                  <Plus size={14} /> Simpan Kupon
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {(store.coupons || []).map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-2xl">{c.emoji}</div>
                    <div className="min-w-0">
                      <p className="font-nunito font-bold text-sm text-gray-800 truncate" style={{ color: c.color }}>
                        {c.title}
                      </p>
                      <p className="font-quicksand text-xs text-gray-500 truncate">{c.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem({ ...c })}
                      className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => deleteCoupon(c.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL EDIT ITEM ── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-nunito font-bold text-lg text-gray-800">Edit {editingItem.type.toUpperCase()}</h3>
              <button onClick={() => setEditingItem(null)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            {/* MESSAGE EDIT */}
            {editingItem.type === 'message' && (
              <div className="space-y-3">
                <textarea
                  value={(editingItem as MessageResult).text}
                  onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                  className="w-full p-3 border rounded-xl font-quicksand text-sm"
                  rows={3}
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Warna:</span>
                  {PASTEL_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditingItem({ ...editingItem, color })}
                      className="w-6 h-6 rounded-full border"
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CAT EDIT */}
            {editingItem.type === 'cat' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={(editingItem as CatResult).title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Judul"
                  className="w-full p-2.5 border rounded-xl font-quicksand text-sm"
                />
                <input
                  type="text"
                  value={(editingItem as CatResult).imageUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  placeholder="URL Gambar Kucing"
                  className="w-full p-2.5 border rounded-xl font-quicksand text-sm"
                />
                <input
                  type="text"
                  value={(editingItem as CatResult).caption}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  placeholder="Caption"
                  className="w-full p-2.5 border rounded-xl font-quicksand text-sm"
                />
              </div>
            )}

            {/* RANDOM IMAGE EDIT */}
            {editingItem.type === 'random_image' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={(editingItem as RandomImageResult).title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Judul"
                  className="w-full p-2.5 border rounded-xl font-quicksand text-sm"
                />
                <input
                  type="text"
                  value={(editingItem as RandomImageResult).imageUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  placeholder="URL Gambar"
                  className="w-full p-2.5 border rounded-xl font-quicksand text-sm"
                />
                <input
                  type="text"
                  value={(editingItem as RandomImageResult).caption}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  placeholder="Caption"
                  className="w-full p-2.5 border rounded-xl font-quicksand text-sm"
                />
              </div>
            )}

            {/* SONG EDIT */}
            {editingItem.type === 'song' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-quicksand text-gray-500 block mb-1">Judul Lagu:</label>
                  <input
                    type="text"
                    value={(editingItem as SongResult).title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="Nama / Judul Lagu"
                    className="w-full p-2.5 border rounded-xl font-quicksand text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-quicksand text-gray-500 block mb-1">Link Spotify:</label>
                  <input
                    type="text"
                    value={(editingItem as SongResult).spotifyUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, spotifyUrl: e.target.value })}
                    placeholder="https://open.spotify.com/track/..."
                    className="w-full p-2.5 border rounded-xl font-quicksand text-sm"
                  />
                </div>
              </div>
            )}

            {/* COUPON EDIT */}
            {editingItem.type === 'coupon' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={(editingItem as CouponResult).title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Judul Kupon"
                  className="w-full p-2.5 border rounded-xl font-quicksand text-sm"
                />
                <input
                  type="text"
                  value={(editingItem as CouponResult).description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Deskripsi"
                  className="w-full p-2.5 border rounded-xl font-quicksand text-sm"
                />
                <input
                  type="text"
                  value={(editingItem as CouponResult).validText}
                  onChange={(e) => setEditingItem({ ...editingItem, validText: e.target.value })}
                  placeholder="Syarat Berlaku"
                  className="w-full p-2.5 border rounded-xl font-quicksand text-sm"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 font-nunito font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl text-white bg-pink-500 hover:bg-pink-600 font-nunito font-bold text-xs flex items-center gap-1 shadow-md"
              >
                <Save size={14} /> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
