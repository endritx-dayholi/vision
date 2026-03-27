import { useState, useEffect, useRef } from "react";

// ── Gradient-based image placeholders (no external images needed) ──
const GRADIENTS = {
  nyc: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #e94560 100%)",
  maldives: "linear-gradient(135deg, #0077b6 0%, #00b4d8 40%, #90e0ef 100%)",
  paris: "linear-gradient(135deg, #2d1b69 0%, #8b5cf6 50%, #f0abfc 100%)",
  mykonos: "linear-gradient(135deg, #0369a1 0%, #38bdf8 50%, #ffffff 100%)",
  bali: "linear-gradient(135deg, #065f46 0%, #10b981 50%, #fbbf24 100%)",
  dubai: "linear-gradient(135deg, #78350f 0%, #f59e0b 50%, #fef3c7 100%)",
  iceland: "linear-gradient(135deg, #1e3a5f 0%, #67e8f9 50%, #e0f2fe 100%)",
  safari: "linear-gradient(135deg, #713f12 0%, #ca8a04 50%, #fef08a 100%)",
};

const CLIP_GRADIENTS = {
  "nyc-1": "linear-gradient(135deg, #e94560, #1a1a2e)", "nyc-2": "linear-gradient(135deg, #22c55e, #064e3b)",
  "nyc-3": "linear-gradient(135deg, #6366f1, #1e1b4b)", "nyc-4": "linear-gradient(135deg, #f97316, #1a1a2e)",
  "nyc-5": "linear-gradient(135deg, #ec4899, #581c87)",
  "mal-1": "linear-gradient(135deg, #06b6d4, #0e7490)", "mal-2": "linear-gradient(135deg, #0ea5e9, #075985)",
  "mal-3": "linear-gradient(135deg, #14b8a6, #134e4a)", "mal-4": "linear-gradient(135deg, #f97316, #0077b6)",
  "mal-5": "linear-gradient(135deg, #1e1b4b, #6366f1)",
  "par-1": "linear-gradient(135deg, #f0abfc, #2d1b69)", "par-2": "linear-gradient(135deg, #60a5fa, #1e3a8a)",
  "par-3": "linear-gradient(135deg, #fbbf24, #78350f)", "par-4": "linear-gradient(135deg, #a78bfa, #1e1b4b)",
  "par-5": "linear-gradient(135deg, #34d399, #065f46)",
  "myk-1": "linear-gradient(135deg, #ffffff, #0369a1)", "myk-2": "linear-gradient(135deg, #0ea5e9, #0c4a6e)",
  "myk-3": "linear-gradient(135deg, #f97316, #38bdf8)", "myk-4": "linear-gradient(135deg, #6366f1, #0369a1)",
  "myk-5": "linear-gradient(135deg, #e0f2fe, #0284c7)",
  "bal-1": "linear-gradient(135deg, #22c55e, #065f46)", "bal-2": "linear-gradient(135deg, #fbbf24, #92400e)",
  "bal-3": "linear-gradient(135deg, #06b6d4, #065f46)", "bal-4": "linear-gradient(135deg, #f97316, #10b981)",
  "bal-5": "linear-gradient(135deg, #713f12, #22c55e)",
  "dub-1": "linear-gradient(135deg, #fbbf24, #78350f)", "dub-2": "linear-gradient(135deg, #fef3c7, #92400e)",
  "dub-3": "linear-gradient(135deg, #1e1b4b, #f59e0b)", "dub-4": "linear-gradient(135deg, #0ea5e9, #f59e0b)",
  "dub-5": "linear-gradient(135deg, #f59e0b, #451a03)",
  "ice-1": "linear-gradient(135deg, #22d3ee, #1e3a5f)", "ice-2": "linear-gradient(135deg, #60a5fa, #e0f2fe)",
  "ice-3": "linear-gradient(135deg, #e2e8f0, #1e3a5f)", "ice-4": "linear-gradient(135deg, #1e293b, #67e8f9)",
  "ice-5": "linear-gradient(135deg, #06b6d4, #f0f9ff)",
  "saf-1": "linear-gradient(135deg, #ca8a04, #451a03)", "saf-2": "linear-gradient(135deg, #78716c, #ca8a04)",
  "saf-3": "linear-gradient(135deg, #f97316, #713f12)", "saf-4": "linear-gradient(135deg, #fbbf24, #365314)",
  "saf-5": "linear-gradient(135deg, #1c1917, #ca8a04)",
};

const LIVE_GRADIENTS = {
  l1: "linear-gradient(135deg, #7c3aed, #ec4899)",
  l2: "linear-gradient(135deg, #06b6d4, #0e7490)",
  l3: "linear-gradient(135deg, #dc2626, #1e1b4b)",
  l4: "linear-gradient(135deg, #8b5cf6, #c084fc)",
  l5: "linear-gradient(135deg, #22d3ee, #1e3a5f)",
  l6: "linear-gradient(135deg, #f97316, #1a1a2e)",
};

// ── Placeholder image component ──
const PlaceholderImg = ({ gradient, label, icon, style, small }) => (
  <div style={{
    background: gradient || "linear-gradient(135deg, #333, #555)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    color: "rgba(255,255,255,0.9)", position: "relative", overflow: "hidden",
    ...style
  }}>
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)" }} />
    {icon && <div style={{ fontSize: small ? 24 : 36, marginBottom: small ? 2 : 6, position: "relative", zIndex: 1 }}>{icon}</div>}
    {label && <div style={{ fontSize: small ? 10 : 13, fontWeight: 600, textAlign: "center", padding: "0 8px",
      position: "relative", zIndex: 1, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{label}</div>}
  </div>
);

// ── Data ──
const LOCATIONS = [
  { id: "nyc", name: "New York City", category: ["luxury", "nature"], clips: 5, icon: "🏙️" },
  { id: "maldives", name: "Maldives", category: ["nature", "luxury"], clips: 5, icon: "🏝️" },
  { id: "paris", name: "Paris", category: ["luxury"], clips: 5, icon: "🗼" },
  { id: "mykonos", name: "Mykonos", category: ["nature", "luxury"], clips: 5, icon: "🏛️" },
  { id: "bali", name: "Bali", category: ["nature", "animals"], clips: 5, icon: "🌴" },
  { id: "dubai", name: "Dubai", category: ["luxury"], clips: 5, icon: "🌇" },
  { id: "iceland", name: "Iceland", category: ["nature"], clips: 5, icon: "🧊" },
  { id: "safari", name: "Kenya Safari", category: ["nature", "animals"], clips: 5, icon: "🦁" },
];

const CLIPS_DATA = {
  nyc: [
    { id: "nyc-1", name: "Times Square Night", duration: 10, icon: "🌃" },
    { id: "nyc-2", name: "Central Park Sunrise", duration: 10, icon: "🌿" },
    { id: "nyc-3", name: "Brooklyn Bridge", duration: 10, icon: "🌉" },
    { id: "nyc-4", name: "Manhattan Skyline", duration: 10, icon: "🏙️" },
    { id: "nyc-5", name: "Hudson River Sunset", duration: 10, icon: "🌅" },
  ],
  maldives: [
    { id: "mal-1", name: "Crystal Lagoon", duration: 10, icon: "💎" },
    { id: "mal-2", name: "Overwater Villa", duration: 10, icon: "🏠" },
    { id: "mal-3", name: "Coral Reef", duration: 10, icon: "🐠" },
    { id: "mal-4", name: "Sunset Beach", duration: 10, icon: "🌅" },
    { id: "mal-5", name: "Starry Night", duration: 10, icon: "✨" },
  ],
  paris: [
    { id: "par-1", name: "Eiffel Tower Dawn", duration: 10, icon: "🗼" },
    { id: "par-2", name: "Seine River", duration: 10, icon: "🚣" },
    { id: "par-3", name: "Montmartre Streets", duration: 10, icon: "🎨" },
    { id: "par-4", name: "Louvre at Night", duration: 10, icon: "🖼️" },
    { id: "par-5", name: "Garden Bloom", duration: 10, icon: "🌸" },
  ],
  mykonos: [
    { id: "myk-1", name: "White Houses", duration: 10, icon: "🏘️" },
    { id: "myk-2", name: "Blue Ocean", duration: 10, icon: "🌊" },
    { id: "myk-3", name: "Windmills Sunset", duration: 10, icon: "🌅" },
    { id: "myk-4", name: "Harbor View", duration: 10, icon: "⛵" },
    { id: "myk-5", name: "Cliffside Path", duration: 10, icon: "🏖️" },
  ],
  bali: [
    { id: "bal-1", name: "Rice Terraces", duration: 10, icon: "🌾" },
    { id: "bal-2", name: "Temple Gate", duration: 10, icon: "⛩️" },
    { id: "bal-3", name: "Jungle Waterfall", duration: 10, icon: "🌊" },
    { id: "bal-4", name: "Beach Sunset", duration: 10, icon: "🌅" },
    { id: "bal-5", name: "Monkey Forest", duration: 10, icon: "🐒" },
  ],
  dubai: [
    { id: "dub-1", name: "Burj Khalifa", duration: 10, icon: "🏗️" },
    { id: "dub-2", name: "Desert Dunes", duration: 10, icon: "🏜️" },
    { id: "dub-3", name: "Marina Night", duration: 10, icon: "🌃" },
    { id: "dub-4", name: "Palm Island", duration: 10, icon: "🌴" },
    { id: "dub-5", name: "Gold Souk", duration: 10, icon: "✨" },
  ],
  iceland: [
    { id: "ice-1", name: "Northern Lights", duration: 10, icon: "🌌" },
    { id: "ice-2", name: "Blue Lagoon", duration: 10, icon: "♨️" },
    { id: "ice-3", name: "Glacier Walk", duration: 10, icon: "🏔️" },
    { id: "ice-4", name: "Volcanic Beach", duration: 10, icon: "🖤" },
    { id: "ice-5", name: "Waterfall Mist", duration: 10, icon: "💨" },
  ],
  safari: [
    { id: "saf-1", name: "Lion Pride", duration: 10, icon: "🦁" },
    { id: "saf-2", name: "Elephant March", duration: 10, icon: "🐘" },
    { id: "saf-3", name: "Savanna Sunset", duration: 10, icon: "🌅" },
    { id: "saf-4", name: "Giraffe Crossing", duration: 10, icon: "🦒" },
    { id: "saf-5", name: "Night Safari", duration: 10, icon: "🌙" },
  ],
};

const MUSIC_TRACKS = [
  { id: "m1", name: "Ambient Dreams", artist: "Solaris", genre: "Ambient", duration: "3:42", bpm: 72 },
  { id: "m2", name: "Ocean Waves", artist: "NatureSound", genre: "Nature", duration: "5:10", bpm: 60 },
  { id: "m3", name: "Ethereal Piano", artist: "Luna Keys", genre: "Classical", duration: "4:28", bpm: 80 },
  { id: "m4", name: "Zen Garden", artist: "Koto Master", genre: "World", duration: "6:15", bpm: 65 },
  { id: "m5", name: "Deep Space", artist: "Cosmos", genre: "Electronic", duration: "4:55", bpm: 90 },
  { id: "m6", name: "Forest Rain", artist: "EarthTones", genre: "Nature", duration: "7:30", bpm: 55 },
  { id: "m7", name: "Sacred Chants", artist: "Dharma Collective", genre: "Spiritual", duration: "8:00", bpm: 50 },
  { id: "m8", name: "Midnight Jazz", artist: "Blue Note", genre: "Jazz", duration: "5:45", bpm: 95 },
];

const CONTENT_TYPES = [
  { id: "meditation", name: "Guided Meditation", icon: "🧘", desc: "Calming guided meditation voiceover" },
  { id: "frequency", name: "High Frequency", icon: "〰️", desc: "Healing frequencies (432Hz, 528Hz, 741Hz)" },
  { id: "travel", name: "Travel Info", icon: "✈️", desc: "AI-generated travel facts & cultural insights" },
  { id: "spiritual", name: "Spiritual", icon: "✨", desc: "Spiritual teachings & mindfulness guidance" },
  { id: "none", name: "No Overlay", icon: "🔇", desc: "Just the scenes and music" },
];

const FREQUENCIES = ["174 Hz", "285 Hz", "396 Hz", "417 Hz", "432 Hz", "528 Hz", "639 Hz", "741 Hz", "852 Hz", "963 Hz"];
const LANGUAGES = ["English", "Spanish", "French", "German", "Japanese", "Arabic", "Hindi", "Mandarin", "Portuguese", "Italian"];
const DURATIONS = [1, 5, 7, 10, 15, 30, 60];

const LIVE_STREAMS = [
  { id: "l1", type: "artist", name: "DJ Aurora", title: "Sunset Ambient Set", viewers: 1243, icon: "🎧", live: true },
  { id: "l2", type: "nature", name: "Maldives Reef Cam", title: "24/7 Underwater", viewers: 892, icon: "🐠", live: true },
  { id: "l3", type: "city", name: "Tokyo Night", title: "Shibuya Crossing", viewers: 2105, icon: "🏙️", live: true },
  { id: "l4", type: "artist", name: "Healing Sounds", title: "Crystal Bowl Session", viewers: 567, icon: "🔮", live: true },
  { id: "l5", type: "nature", name: "Aurora Borealis", title: "Live from Iceland", viewers: 3401, icon: "🌌", live: true },
  { id: "l6", type: "city", name: "NYC Rooftop", title: "Manhattan Skyline", viewers: 1890, icon: "🌃", live: true },
];

const SAVED_EXPERIENCES = [
  { id: "s1", name: "Morning Zen", clips: 6, duration: "10 min", gradient: GRADIENTS.bali, icon: "🧘", date: "Mar 24" },
  { id: "s2", name: "Night City Vibes", clips: 4, duration: "5 min", gradient: GRADIENTS.nyc, icon: "🌃", date: "Mar 22" },
  { id: "s3", name: "Ocean Healing", clips: 8, duration: "15 min", gradient: GRADIENTS.maldives, icon: "🌊", date: "Mar 20", fav: true },
];

// ── Main App ──
export default function App() {
  const [screen, setScreen] = useState("home");
  const [createStep, setCreateStep] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [timelineClips, setTimelineClips] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [selectedContent, setSelectedContent] = useState("none");
  const [selectedFreq, setSelectedFreq] = useState("528 Hz");
  const [selectedLang, setSelectedLang] = useState("English");
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [musicVolume, setMusicVolume] = useState(70);
  const [contentVolume, setContentVolume] = useState(50);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [previewClipIdx, setPreviewClipIdx] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saved, setSaved] = useState(false);
  const [liveFilter, setLiveFilter] = useState("all");
  const [musicGenreFilter, setMusicGenreFilter] = useState("all");
  const [addedFlash, setAddedFlash] = useState(null);
  const timerRef = useRef(null);
  const clipsRef = useRef(null);

  const filteredLocations = LOCATIONS.filter(l => categoryFilter === "all" || l.category.includes(categoryFilter));
  const filteredLive = LIVE_STREAMS.filter(l => liveFilter === "all" || l.type === liveFilter);
  const musicGenres = ["all", ...new Set(MUSIC_TRACKS.map(m => m.genre))];
  const filteredMusic = MUSIC_TRACKS.filter(m => musicGenreFilter === "all" || m.genre === musicGenreFilter);

  const addClip = (clip) => {
    if (!timelineClips.find(c => c.id === clip.id)) {
      setTimelineClips(prev => [...prev, clip]);
      setAddedFlash(clip.id);
      setTimeout(() => setAddedFlash(null), 600);
    }
  };
  const removeClip = (id) => setTimelineClips(prev => prev.filter(c => c.id !== id));
  const totalClipTime = timelineClips.reduce((a, c) => a + c.duration, 0);

  const handleLocationClick = (locId) => {
    setSelectedLocation(locId);
    setTimeout(() => {
      clipsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  useEffect(() => {
    if (previewPlaying) {
      timerRef.current = setInterval(() => {
        setPreviewProgress(p => {
          if (p >= 100) { setPreviewPlaying(false); return 100; }
          const newP = p + 0.3;
          if (timelineClips.length > 0) {
            const seg = 100 / timelineClips.length;
            setPreviewClipIdx(Math.min(Math.floor(newP / seg), timelineClips.length - 1));
          }
          return newP;
        });
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [previewPlaying, timelineClips.length]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setShowSaveModal(false); setSaved(false); setScreen("library"); }, 1500);
  };

  // ── Shared styles ──
  const gold = "#f0d68a";
  const goldDark = "#c9a040";
  const bg = "#0a0a1a";

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: `linear-gradient(135deg, ${bg} 0%, #0d1117 50%, ${bg} 100%)`, color: "#e0e0e0", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:3px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes flashGold { 0%{box-shadow:0 0 0 0 rgba(240,214,138,0.6)} 100%{box-shadow:0 0 0 12px rgba(240,214,138,0)} }
        .fade-in { animation:fadeIn 0.4s ease }
        .slide-up { animation:slideUp 0.4s ease }
        .flash-add { animation:flashGold 0.6s ease }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 32px",
        borderBottom:"1px solid rgba(255,255,255,0.06)", backdropFilter:"blur(20px)",
        background:"rgba(10,10,26,0.85)", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}
          onClick={() => { setScreen("home"); setCreateStep(0); }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg, ${goldDark}, ${gold})`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:bg }}>V</div>
          <span style={{ fontSize:20, fontWeight:700, background:`linear-gradient(90deg, ${gold}, ${goldDark})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>VISIONSCAPE</span>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[["home","Explore"],["create","Create"],["library","My Library"],["live","Live"]].map(([k,v]) => (
            <button key={k} onClick={() => { setScreen(k); if(k==="create") setCreateStep(0); }}
              style={{ padding:"8px 18px", borderRadius:8, background: screen===k ? "rgba(201,160,64,0.15)" : "transparent",
                color: screen===k ? gold : "#888", fontSize:14, fontWeight:500, cursor:"pointer", border:"none",
                transition:"all 0.2s" }}>
              {v} {k==="live" && <span style={{ width:6, height:6, borderRadius:"50%", background:"#ff4444",
                display:"inline-block", marginLeft:6, animation:"pulse 1.5s infinite" }} />}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button style={{ padding:"8px 12px", borderRadius:8, background:"rgba(255,255,255,0.04)", color:"#888",
            fontSize:14, border:"1px solid rgba(255,255,255,0.06)", cursor:"pointer" }}>🔔</button>
          <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg, ${goldDark}, ${gold})`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:600, color:bg }}>E</div>
        </div>
      </nav>

      {/* ── PAGES ── */}
      <div style={{ padding:"32px 32px 100px", maxWidth:1400, margin:"0 auto" }}>

        {/* ════ HOME ════ */}
        {screen === "home" && (
          <div className="fade-in">
            {/* Hero */}
            <div style={{ borderRadius:20, padding:"80px 60px", marginBottom:40,
              background:`linear-gradient(135deg, rgba(201,160,64,0.08) 0%, rgba(10,10,26,0.95) 100%)`,
              border:"1px solid rgba(201,160,64,0.12)" }}>
              <div style={{ fontSize:48, fontWeight:700, lineHeight:1.1, marginBottom:12,
                background:`linear-gradient(90deg, #fff, ${gold})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Create Your Own<br/>Immersive Experience
              </div>
              <div style={{ fontSize:18, color:"#999", marginBottom:32, maxWidth:500, lineHeight:1.6 }}>
                Craft personalized 360° journeys from our premium VR library. Mix stunning locations, ambient music, and wellness content.
              </div>
              <button onClick={() => { setScreen("create"); setCreateStep(0); }}
                style={{ padding:"14px 36px", borderRadius:12, background:`linear-gradient(135deg, ${goldDark}, ${gold})`,
                  color:bg, fontSize:16, fontWeight:600, border:"none", cursor:"pointer",
                  boxShadow:"0 4px 24px rgba(201,160,64,0.3)" }}>
                + Create New Experience
              </button>
              <div style={{ display:"flex", gap:40, marginTop:40 }}>
                {[["100+","360° 8K Videos"],["8","Destinations"],["40+","Clips"],["24/7","Live Streams"]].map(([n,l]) => (
                  <div key={l}><div style={{ fontSize:28, fontWeight:700, color:gold }}>{n}</div>
                    <div style={{ fontSize:13, color:"#666", marginTop:2 }}>{l}</div></div>
                ))}
              </div>
            </div>

            {/* Destinations */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ fontSize:22, fontWeight:600, color:"#fff" }}>Popular Destinations</div>
              <div style={{ display:"flex", gap:8 }}>
                {["all","nature","luxury","animals"].map(f => (
                  <button key={f} onClick={() => setCategoryFilter(f)}
                    style={{ padding:"8px 18px", borderRadius:20, fontSize:13, fontWeight:500, cursor:"pointer",
                      background: categoryFilter===f ? "rgba(201,160,64,0.2)" : "rgba(255,255,255,0.04)",
                      color: categoryFilter===f ? gold : "#888",
                      border: categoryFilter===f ? "1px solid rgba(201,160,64,0.3)" : "1px solid rgba(255,255,255,0.06)",
                      transition:"all 0.2s" }}>
                    {f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }}>
              {filteredLocations.map(loc => (
                <div key={loc.id} onClick={() => { setSelectedLocation(loc.id); setScreen("create"); setCreateStep(0); }}
                  style={{ borderRadius:14, overflow:"hidden", background:"rgba(255,255,255,0.03)",
                    border:"1px solid rgba(255,255,255,0.06)", cursor:"pointer", transition:"all 0.3s" }}>
                  <PlaceholderImg gradient={GRADIENTS[loc.id]} label={loc.name} icon={loc.icon}
                    style={{ width:"100%", height:180 }} />
                  <div style={{ padding:"14px 16px" }}>
                    <div style={{ fontSize:15, fontWeight:600, color:"#fff", marginBottom:4 }}>{loc.name}</div>
                    <div style={{ fontSize:12, color:"#666" }}>
                      {loc.clips} clips · {loc.category.map(c => (
                        <span key={c} style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11,
                          fontWeight:500, marginRight:6,
                          background: c==="nature"?"rgba(74,222,128,0.13)":c==="luxury"?"rgba(240,214,138,0.13)":"rgba(96,165,250,0.13)",
                          color: c==="nature"?"#4ade80":c==="luxury"?gold:"#60a5fa" }}>{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live preview */}
            <div style={{ marginTop:48 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <div style={{ fontSize:22, fontWeight:600, color:"#fff" }}>🔴 Live Now</div>
                <button onClick={() => setScreen("live")} style={{ padding:"8px 18px", borderRadius:8, background:"transparent",
                  color:gold, fontSize:14, fontWeight:500, cursor:"pointer", border:"none" }}>View all →</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
                {LIVE_STREAMS.slice(0,3).map(s => (
                  <div key={s.id} style={{ borderRadius:14, overflow:"hidden", background:"rgba(255,255,255,0.03)",
                    border:"1px solid rgba(255,255,255,0.06)", cursor:"pointer" }}>
                    <div style={{ position:"relative" }}>
                      <PlaceholderImg gradient={LIVE_GRADIENTS[s.id]} label={s.title} icon={s.icon}
                        style={{ width:"100%", height:180 }} />
                      <div style={{ position:"absolute", top:10, left:10, display:"inline-flex", alignItems:"center", gap:4,
                        padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:"rgba(255,50,50,0.15)", color:"#ff4444" }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:"#ff4444", animation:"pulse 1.5s infinite" }} /> LIVE
                      </div>
                      <div style={{ position:"absolute", bottom:10, right:10, padding:"3px 10px", borderRadius:20, fontSize:11,
                        background:"rgba(255,255,255,0.13)", color:"#fff" }}>{s.viewers.toLocaleString()} watching</div>
                    </div>
                    <div style={{ padding:"14px 16px" }}>
                      <div style={{ fontSize:15, fontWeight:600, color:"#fff", marginBottom:2 }}>{s.title}</div>
                      <div style={{ fontSize:12, color:"#666" }}>{s.name} · {s.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ CREATE ════ */}
        {screen === "create" && (
          <div className="fade-in">
            {/* Steps indicator */}
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
              {["Select Scenes","Customize","Preview & Save"].map((label, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%",
                    background: createStep >= i ? `linear-gradient(135deg, ${goldDark}, ${gold})` : "rgba(255,255,255,0.05)",
                    color: createStep >= i ? bg : "#666", display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:13, fontWeight:600, border: createStep >= i ? "none" : "1px solid rgba(255,255,255,0.1)" }}>{i+1}</div>
                  <span style={{ fontSize:14, fontWeight: createStep===i ? 600 : 400, color: createStep===i ? gold : "#666" }}>{label}</span>
                  {i < 2 && <span style={{ color:"#333", margin:"0 4px" }}>—</span>}
                </div>
              ))}
            </div>

            {/* Step 0: Select scenes */}
            {createStep === 0 && (
              <div className="slide-up">
                <div style={{ fontSize:22, fontWeight:600, color:"#fff", marginBottom:6 }}>Choose Your Destinations</div>
                <p style={{ color:"#666", marginBottom:20, fontSize:14 }}>Click a location to see its 360° clips, then add clips to your timeline.</p>

                <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
                  {["all","nature","luxury","animals"].map(f => (
                    <button key={f} onClick={() => setCategoryFilter(f)}
                      style={{ padding:"8px 18px", borderRadius:20, fontSize:13, fontWeight:500, cursor:"pointer",
                        background: categoryFilter===f ? "rgba(201,160,64,0.2)" : "rgba(255,255,255,0.04)",
                        color: categoryFilter===f ? gold : "#888",
                        border: categoryFilter===f ? "1px solid rgba(201,160,64,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                      {f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)}
                    </button>
                  ))}
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }}>
                  {filteredLocations.map(loc => (
                    <div key={loc.id} onClick={() => handleLocationClick(loc.id)}
                      style={{ borderRadius:14, overflow:"hidden", cursor:"pointer", transition:"all 0.3s",
                        background:"rgba(255,255,255,0.03)",
                        border: selectedLocation===loc.id ? `2px solid ${gold}` : "2px solid rgba(255,255,255,0.06)",
                        boxShadow: selectedLocation===loc.id ? `0 0 20px rgba(201,160,64,0.15)` : "none",
                        transform: selectedLocation===loc.id ? "scale(1.02)" : "scale(1)" }}>
                      <PlaceholderImg gradient={GRADIENTS[loc.id]} label={loc.name} icon={loc.icon}
                        style={{ width:"100%", height:160 }} />
                      <div style={{ padding:"12px 14px" }}>
                        <div style={{ fontSize:14, fontWeight:600, color: selectedLocation===loc.id ? gold : "#fff" }}>{loc.name}</div>
                        <div style={{ fontSize:12, color:"#666" }}>{loc.clips} clips available</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clips for selected location */}
                {selectedLocation && (
                  <div ref={clipsRef} style={{ marginTop:28, padding:24, borderRadius:16,
                    background:"rgba(255,255,255,0.02)", border:"1px solid rgba(201,160,64,0.15)" }} className="slide-up">
                    <div style={{ fontSize:18, fontWeight:600, color:"#fff", marginBottom:4 }}>
                      {LOCATIONS.find(l => l.id === selectedLocation)?.icon}{" "}
                      {LOCATIONS.find(l => l.id === selectedLocation)?.name} — Clips
                    </div>
                    <p style={{ color:"#888", marginBottom:16, fontSize:13 }}>Click a clip to add it to your timeline below</p>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:12 }}>
                      {(CLIPS_DATA[selectedLocation] || []).map(clip => {
                        const inTimeline = timelineClips.find(c => c.id === clip.id);
                        return (
                          <div key={clip.id} onClick={() => addClip(clip)}
                            className={addedFlash === clip.id ? "flash-add" : ""}
                            style={{ borderRadius:12, overflow:"hidden", cursor: inTimeline ? "default" : "pointer",
                              border: inTimeline ? `2px solid ${gold}` : "2px solid rgba(255,255,255,0.06)",
                              opacity: inTimeline ? 0.5 : 1, transition:"all 0.2s", position:"relative" }}>
                            <PlaceholderImg gradient={CLIP_GRADIENTS[clip.id]} icon={clip.icon} label={clip.name}
                              style={{ width:"100%", height:100 }} small />
                            {inTimeline && (
                              <div style={{ position:"absolute", top:6, right:6, width:22, height:22, borderRadius:"50%",
                                background:gold, color:bg, fontSize:13, display:"flex", alignItems:"center",
                                justifyContent:"center", fontWeight:700 }}>✓</div>
                            )}
                            <div style={{ padding:"6px 10px", fontSize:11, fontWeight:500, color:"#ccc",
                              background:"rgba(0,0,0,0.3)" }}>
                              {clip.name} · {clip.duration}s
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div style={{ marginTop:24, padding:20, borderRadius:16, background:"rgba(255,255,255,0.02)",
                  border:"1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>
                      🎬 Timeline <span style={{ color:"#666", fontWeight:400 }}>({timelineClips.length} clips · {totalClipTime}s)</span>
                    </div>
                    {timelineClips.length > 0 && (
                      <button onClick={() => setTimelineClips([])}
                        style={{ padding:"6px 14px", borderRadius:8, background:"rgba(255,80,80,0.1)", color:"#ff6666",
                          fontSize:12, border:"1px solid rgba(255,80,80,0.2)", cursor:"pointer" }}>Clear All</button>
                    )}
                  </div>
                  <div style={{ display:"flex", gap:8, overflowX:"auto", padding:"12px 0", minHeight:100, alignItems:"center" }}>
                    {timelineClips.length === 0 && (
                      <div style={{ color:"#444", fontSize:14, padding:"20px 0", width:"100%", textAlign:"center" }}>
                        Select a destination above and click clips to build your timeline
                      </div>
                    )}
                    {timelineClips.map(clip => (
                      <div key={clip.id} style={{ minWidth:130, height:85, borderRadius:10, overflow:"hidden",
                        position:"relative", flexShrink:0, border:`2px solid rgba(201,160,64,0.3)` }}>
                        <PlaceholderImg gradient={CLIP_GRADIENTS[clip.id]} icon={clip.icon}
                          style={{ width:"100%", height:"100%" }} small />
                        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"4px 8px",
                          background:"linear-gradient(transparent, rgba(0,0,0,0.8))", fontSize:10, fontWeight:500, color:"#fff" }}>
                          {clip.name}
                        </div>
                        <div style={{ position:"absolute", top:4, right:4, padding:"2px 6px", borderRadius:4,
                          background:"rgba(0,0,0,0.7)", fontSize:9, color:gold, fontWeight:600 }}>{clip.duration}s</div>
                        <button onClick={(e) => { e.stopPropagation(); removeClip(clip.id); }}
                          style={{ position:"absolute", top:4, left:4, width:18, height:18, borderRadius:"50%",
                            background:"rgba(255,50,50,0.8)", color:"#fff", fontSize:11, display:"flex",
                            alignItems:"center", justifyContent:"center", cursor:"pointer", border:"none", lineHeight:1 }}>×</button>
                      </div>
                    ))}
                    {timelineClips.length > 0 && (
                      <div onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
                        style={{ minWidth:100, height:85, borderRadius:10, border:"2px dashed rgba(255,255,255,0.1)",
                          display:"flex", alignItems:"center", justifyContent:"center", color:"#555", fontSize:28,
                          cursor:"pointer", flexShrink:0 }}>+</div>
                    )}
                  </div>
                </div>

                <div style={{ display:"flex", justifyContent:"flex-end", marginTop:20, gap:12 }}>
                  <button onClick={() => setScreen("home")}
                    style={{ padding:"12px 24px", borderRadius:10, background:"rgba(255,255,255,0.05)", color:"#e0e0e0",
                      fontSize:14, fontWeight:500, border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer" }}>
                    ← Back
                  </button>
                  <button onClick={() => { if(timelineClips.length > 0) setCreateStep(1); }}
                    style={{ padding:"14px 36px", borderRadius:12, background:`linear-gradient(135deg, ${goldDark}, ${gold})`,
                      color:bg, fontSize:16, fontWeight:600, border:"none", cursor:"pointer",
                      opacity: timelineClips.length === 0 ? 0.4 : 1,
                      boxShadow: timelineClips.length > 0 ? "0 4px 24px rgba(201,160,64,0.3)" : "none" }}>
                    Next: Customize →
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Customize */}
            {createStep === 1 && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:24 }} className="slide-up">
                <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                  {/* Timeline recap */}
                  <div style={{ padding:20, borderRadius:16, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:14, fontWeight:600, color:"#fff", marginBottom:10 }}>
                      🎬 Your Scenes <span style={{ color:"#666", fontWeight:400 }}>({timelineClips.length} clips · {totalClipTime}s)</span>
                    </div>
                    <div style={{ display:"flex", gap:8, overflowX:"auto", padding:"8px 0" }}>
                      {timelineClips.map(clip => (
                        <div key={clip.id} style={{ minWidth:120, height:75, borderRadius:10, overflow:"hidden",
                          position:"relative", flexShrink:0, border:"2px solid rgba(201,160,64,0.3)" }}>
                          <PlaceholderImg gradient={CLIP_GRADIENTS[clip.id]} icon={clip.icon}
                            style={{ width:"100%", height:"100%" }} small />
                          <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"3px 6px",
                            background:"linear-gradient(transparent, rgba(0,0,0,0.8))", fontSize:9, color:"#fff" }}>{clip.name}</div>
                          <div style={{ position:"absolute", top:3, right:3, padding:"1px 5px", borderRadius:3,
                            background:"rgba(0,0,0,0.7)", fontSize:8, color:gold, fontWeight:600 }}>{clip.duration}s</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Music */}
                  <div style={{ padding:20, borderRadius:16, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>🎵 Music</div>
                      <div style={{ display:"flex", gap:6 }}>
                        {musicGenres.map(g => (
                          <button key={g} onClick={() => setMusicGenreFilter(g)}
                            style={{ padding:"5px 12px", borderRadius:12, fontSize:11, cursor:"pointer",
                              background: musicGenreFilter===g ? "rgba(201,160,64,0.2)" : "rgba(255,255,255,0.04)",
                              color: musicGenreFilter===g ? gold : "#888",
                              border: musicGenreFilter===g ? "1px solid rgba(201,160,64,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                            {g==="all"?"All":g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:220, overflowY:"auto" }}>
                      {filteredMusic.map(track => (
                        <div key={track.id} onClick={() => setSelectedMusic(track.id)}
                          style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10,
                            background: selectedMusic===track.id ? "rgba(201,160,64,0.1)" : "rgba(255,255,255,0.02)",
                            border: selectedMusic===track.id ? "1px solid rgba(201,160,64,0.2)" : "1px solid rgba(255,255,255,0.04)",
                            cursor:"pointer", transition:"all 0.2s" }}>
                          <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(201,160,64,0.2)",
                            display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:gold, flexShrink:0 }}>
                            {selectedMusic===track.id ? "⏸" : "▶"}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:500, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{track.name}</div>
                            <div style={{ fontSize:11, color:"#666" }}>{track.artist} · {track.genre}</div>
                          </div>
                          <div style={{ fontSize:11, color:"#555", flexShrink:0 }}>{track.duration}</div>
                          <div style={{ fontSize:11, color:"#555", flexShrink:0 }}>{track.bpm} BPM</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:14 }}>
                      <span style={{ fontSize:12, color:"#666" }}>🔊</span>
                      <input type="range" min="0" max="100" value={musicVolume}
                        onChange={e => setMusicVolume(Number(e.target.value))}
                        style={{ flex:1, accentColor:goldDark, cursor:"pointer" }} />
                      <span style={{ fontSize:12, color:gold, minWidth:30 }}>{musicVolume}%</span>
                    </div>
                  </div>

                  {/* Content type */}
                  <div style={{ padding:20, borderRadius:16, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:14, fontWeight:600, color:"#fff", marginBottom:14 }}>Content Layer</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {CONTENT_TYPES.map(ct => (
                        <div key={ct.id} onClick={() => setSelectedContent(ct.id)}
                          style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10,
                            background: selectedContent===ct.id ? "rgba(201,160,64,0.1)" : "rgba(255,255,255,0.02)",
                            border: selectedContent===ct.id ? "1px solid rgba(201,160,64,0.25)" : "1px solid rgba(255,255,255,0.04)",
                            cursor:"pointer", transition:"all 0.2s" }}>
                          <div style={{ fontSize:22, width:36, textAlign:"center", flexShrink:0 }}>{ct.icon}</div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:500, color:"#fff" }}>{ct.name}</div>
                            <div style={{ fontSize:11, color:"#666" }}>{ct.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedContent === "frequency" && (
                      <div style={{ marginTop:14 }}>
                        <div style={{ fontSize:12, fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Select Frequency</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {FREQUENCIES.map(f => (
                            <button key={f} onClick={() => setSelectedFreq(f)}
                              style={{ padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer",
                                background: selectedFreq===f ? "rgba(130,90,255,0.15)" : "rgba(255,255,255,0.03)",
                                color: selectedFreq===f ? "#b090ff" : "#666",
                                border: selectedFreq===f ? "1px solid rgba(130,90,255,0.25)" : "1px solid rgba(255,255,255,0.05)" }}>
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {["meditation","spiritual","travel"].includes(selectedContent) && (
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:14 }}>
                        <span style={{ fontSize:12, color:"#666" }}>🎙</span>
                        <input type="range" min="0" max="100" value={contentVolume}
                          onChange={e => setContentVolume(Number(e.target.value))}
                          style={{ flex:1, accentColor:goldDark, cursor:"pointer" }} />
                        <span style={{ fontSize:12, color:gold, minWidth:30 }}>{contentVolume}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)",
                  borderRadius:16, padding:20, display:"flex", flexDirection:"column", gap:20, height:"fit-content", position:"sticky", top:80 }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Duration</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {DURATIONS.map(d => (
                        <button key={d} onClick={() => setSelectedDuration(d)}
                          style={{ padding:"8px 14px", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer",
                            background: selectedDuration===d ? "rgba(201,160,64,0.2)" : "rgba(255,255,255,0.03)",
                            color: selectedDuration===d ? gold : "#888",
                            border: selectedDuration===d ? "1px solid rgba(201,160,64,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                          {d}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Language</div>
                    <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)}
                      style={{ width:"100%", padding:"10px 14px", borderRadius:10, background:"rgba(255,255,255,0.05)",
                        border:"1px solid rgba(255,255,255,0.1)", color:"#e0e0e0", fontSize:14, outline:"none", cursor:"pointer" }}>
                      {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  <div style={{ height:1, background:"rgba(255,255,255,0.06)" }} />

                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Summary</div>
                    {[
                      ["Scenes", `${timelineClips.length} clips`],
                      ["Scene Time", `${totalClipTime}s raw`],
                      ["Duration", `${selectedDuration} min`],
                      ["Music", selectedMusic ? MUSIC_TRACKS.find(m=>m.id===selectedMusic)?.name : "None"],
                      ["Content", CONTENT_TYPES.find(c=>c.id===selectedContent)?.name],
                      ...(selectedContent==="frequency" ? [["Frequency", selectedFreq]] : []),
                      ["Language", selectedLang],
                    ].map(([k,v]) => (
                      <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0",
                        borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:13 }}>
                        <span style={{ color:"#666" }}>{k}</span>
                        <span style={{ color:"#fff", fontWeight:500 }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => { setCreateStep(2); setPreviewPlaying(true); setPreviewProgress(0); setPreviewClipIdx(0); }}
                    style={{ padding:"12px 24px", borderRadius:10, background:`linear-gradient(135deg, ${goldDark}, ${gold})`,
                      color:bg, fontSize:14, fontWeight:600, border:"none", cursor:"pointer", width:"100%",
                      boxShadow:"0 4px 20px rgba(201,160,64,0.2)" }}>
                    ▶ Preview Experience
                  </button>
                  <button onClick={() => setCreateStep(0)}
                    style={{ padding:"10px 20px", borderRadius:10, background:"rgba(255,255,255,0.05)", color:"#e0e0e0",
                      fontSize:14, fontWeight:500, border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", width:"100%" }}>
                    ← Back to Scenes
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Preview */}
            {createStep === 2 && (
              <div className="slide-up" style={{ textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:600, color:"#fff", marginBottom:8 }}>Your Experience is Ready</div>
                <p style={{ color:"#666", marginBottom:24, fontSize:14 }}>Preview your creation, then save it to your library.</p>

                <div style={{ maxWidth:900, margin:"0 auto", borderRadius:16, overflow:"hidden", position:"relative",
                  aspectRatio:"16/9", border:"1px solid rgba(201,160,64,0.15)" }}>
                  {timelineClips.length > 0 && (
                    <PlaceholderImg
                      gradient={CLIP_GRADIENTS[timelineClips[previewClipIdx % timelineClips.length]?.id]}
                      icon={timelineClips[previewClipIdx % timelineClips.length]?.icon}
                      style={{ width:"100%", height:"100%", position:"absolute", inset:0, transition:"background 1s ease" }} />
                  )}
                  <div style={{ position:"absolute", bottom:20, left:20, zIndex:1, display:"flex", flexDirection:"column", gap:4 }}>
                    {selectedContent !== "none" && (
                      <div style={{ padding:"4px 12px", borderRadius:6, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)",
                        fontSize:12, color:gold, fontWeight:500, width:"fit-content" }}>
                        {CONTENT_TYPES.find(c=>c.id===selectedContent)?.name}
                        {selectedContent==="frequency" ? ` · ${selectedFreq}` : ""}
                      </div>
                    )}
                    <div style={{ padding:"6px 14px", borderRadius:8, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)",
                      fontSize:18, fontWeight:600, color:"#fff", width:"fit-content" }}>
                      {timelineClips[previewClipIdx % timelineClips.length]?.name}
                    </div>
                  </div>
                  <div style={{ position:"absolute", top:16, left:16, padding:"6px 14px", borderRadius:8,
                    background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", fontSize:13, fontWeight:600, color:gold }}>
                    360° 8K
                  </div>
                  {selectedMusic && (
                    <div style={{ position:"absolute", top:16, right:16, padding:"8px 14px", borderRadius:8,
                      background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:14 }}>🎵</span>
                      <span style={{ fontSize:12, color:"#fff" }}>{MUSIC_TRACKS.find(m=>m.id===selectedMusic)?.name}</span>
                    </div>
                  )}
                </div>

                {/* Playback bar */}
                <div style={{ display:"flex", alignItems:"center", gap:16, maxWidth:900, margin:"16px auto 0",
                  padding:"12px 24px", borderRadius:12, background:"rgba(255,255,255,0.05)", justifyContent:"center" }}>
                  <button onClick={() => { if(!previewPlaying) { setPreviewPlaying(true); if(previewProgress>=100) setPreviewProgress(0); } else setPreviewPlaying(false); }}
                    style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg, ${goldDark}, ${gold})`,
                      color:bg, fontSize:16, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {previewPlaying ? "⏸" : "▶"}
                  </button>
                  <div style={{ fontSize:13, color:"#888", minWidth:50 }}>
                    0:{String(Math.floor(previewProgress / 100 * selectedDuration * 60)).padStart(2,"0")}
                  </div>
                  <div style={{ flex:1, height:4, borderRadius:2, background:"rgba(255,255,255,0.1)", position:"relative",
                    maxWidth:500, cursor:"pointer" }}
                    onClick={e => { const rect = e.currentTarget.getBoundingClientRect(); setPreviewProgress((e.clientX - rect.left)/rect.width*100); }}>
                    <div style={{ position:"absolute", left:0, top:0, height:"100%", borderRadius:2,
                      background:`linear-gradient(90deg, ${goldDark}, ${gold})`, width:`${previewProgress}%`, transition:"width 0.1s" }} />
                  </div>
                  <div style={{ fontSize:13, color:"#888", minWidth:50 }}>{selectedDuration}:00</div>
                </div>

                <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:28 }}>
                  <button onClick={() => setShowSaveModal(true)}
                    style={{ padding:"14px 32px", borderRadius:12, background:`linear-gradient(135deg, ${goldDark}, ${gold})`,
                      color:bg, fontSize:16, fontWeight:600, border:"none", cursor:"pointer",
                      boxShadow:"0 4px 24px rgba(201,160,64,0.3)" }}>
                    💾 Save to Library
                  </button>
                  <button onClick={() => setCreateStep(1)}
                    style={{ padding:"14px 24px", borderRadius:10, background:"rgba(255,255,255,0.05)", color:"#e0e0e0",
                      fontSize:14, fontWeight:500, border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer" }}>
                    ← Edit
                  </button>
                  <button style={{ padding:"14px 24px", borderRadius:10, background:"rgba(255,255,255,0.05)", color:"#e0e0e0",
                    fontSize:14, fontWeight:500, border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer" }}>
                    📤 Share
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ LIBRARY ════ */}
        {screen === "library" && (
          <div className="fade-in">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:22, fontWeight:600, color:"#fff" }}>My Library</div>
                <p style={{ color:"#666", fontSize:14 }}>Your saved experiences and favorites</p>
              </div>
              <button onClick={() => { setScreen("create"); setCreateStep(0); }}
                style={{ padding:"14px 36px", borderRadius:12, background:`linear-gradient(135deg, ${goldDark}, ${gold})`,
                  color:bg, fontSize:16, fontWeight:600, border:"none", cursor:"pointer",
                  boxShadow:"0 4px 24px rgba(201,160,64,0.3)" }}>
                + Create New
              </button>
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:24 }}>
              {["All","Recent","Favorites"].map(f => (
                <button key={f} style={{ padding:"8px 18px", borderRadius:20, fontSize:13, fontWeight:500, cursor:"pointer",
                  background: f==="All" ? "rgba(201,160,64,0.2)" : "rgba(255,255,255,0.04)",
                  color: f==="All" ? gold : "#888",
                  border: f==="All" ? "1px solid rgba(201,160,64,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>{f}</button>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
              {SAVED_EXPERIENCES.map(exp => (
                <div key={exp.id} style={{ borderRadius:14, overflow:"hidden", background:"rgba(255,255,255,0.03)",
                  border:"1px solid rgba(255,255,255,0.06)", cursor:"pointer" }}>
                  <div style={{ position:"relative" }}>
                    <PlaceholderImg gradient={exp.gradient} label={exp.name} icon={exp.icon}
                      style={{ width:"100%", height:180 }} />
                    {exp.fav && <div style={{ position:"absolute", top:10, right:10, fontSize:18 }}>❤️</div>}
                    <div style={{ position:"absolute", bottom:10, left:10, padding:"3px 10px", borderRadius:20, fontSize:11,
                      background:"rgba(240,214,138,0.13)", color:gold }}>360° 8K</div>
                  </div>
                  <div style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:15, fontWeight:600, color:"#fff", marginBottom:2 }}>{exp.name}</div>
                        <div style={{ fontSize:12, color:"#666" }}>{exp.clips} clips · {exp.duration} · {exp.date}</div>
                      </div>
                      <div style={{ display:"flex", gap:6 }}>
                        {["✏️","📤","🗑️"].map(ic => (
                          <button key={ic} style={{ padding:"6px 10px", borderRadius:8, background:"rgba(255,255,255,0.04)",
                            color:"#888", fontSize:13, border:"1px solid rgba(255,255,255,0.06)", cursor:"pointer" }}>{ic}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ LIVE ════ */}
        {screen === "live" && (
          <div className="fade-in">
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:22, fontWeight:600, color:"#fff" }}>🔴 Live Experiences</div>
              <p style={{ color:"#666", fontSize:14 }}>Join live 360° streams from artists, nature cams, and cities</p>
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:24 }}>
              {[["all","All"],["artist","Music Artists"],["nature","Nature"],["city","Cities"]].map(([k,v]) => (
                <button key={k} onClick={() => setLiveFilter(k)}
                  style={{ padding:"8px 18px", borderRadius:20, fontSize:13, fontWeight:500, cursor:"pointer",
                    background: liveFilter===k ? "rgba(201,160,64,0.2)" : "rgba(255,255,255,0.04)",
                    color: liveFilter===k ? gold : "#888",
                    border: liveFilter===k ? "1px solid rgba(201,160,64,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                  {v}
                </button>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
              {filteredLive.map(s => (
                <div key={s.id} style={{ borderRadius:14, overflow:"hidden", background:"rgba(255,255,255,0.03)",
                  border:"1px solid rgba(255,255,255,0.06)", cursor:"pointer" }}>
                  <div style={{ position:"relative" }}>
                    <PlaceholderImg gradient={LIVE_GRADIENTS[s.id]} label={s.title} icon={s.icon}
                      style={{ width:"100%", height:220 }} />
                    <div style={{ position:"absolute", top:10, left:10, display:"inline-flex", alignItems:"center", gap:4,
                      padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:"rgba(255,50,50,0.15)", color:"#ff4444" }}>
                      <span style={{ width:6, height:6, borderRadius:"50%", background:"#ff4444", animation:"pulse 1.5s infinite" }} /> LIVE
                    </div>
                    <div style={{ position:"absolute", top:10, right:10, padding:"3px 10px", borderRadius:20, fontSize:11,
                      background:"rgba(255,255,255,0.13)", color:"#fff" }}>👁 {s.viewers.toLocaleString()}</div>
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"24px 16px 16px",
                      background:"linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
                      <div style={{ fontSize:16, fontWeight:600, color:"#fff" }}>{s.title}</div>
                      <div style={{ fontSize:13, color:"#aaa", marginTop:2 }}>{s.name}</div>
                    </div>
                  </div>
                  <div style={{ padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:500,
                      background: s.type==="artist"?"rgba(240,214,138,0.13)":s.type==="nature"?"rgba(74,222,128,0.13)":"rgba(96,165,250,0.13)",
                      color: s.type==="artist"?gold:s.type==="nature"?"#4ade80":"#60a5fa" }}>{s.type}</span>
                    <button style={{ padding:"8px 20px", borderRadius:12, background:`linear-gradient(135deg, ${goldDark}, ${gold})`,
                      color:bg, fontSize:13, fontWeight:600, border:"none", cursor:"pointer" }}>Join Stream</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── SAVE MODAL ── */}
      {showSaveModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(8px)", zIndex:300,
          display:"flex", alignItems:"center", justifyContent:"center" }} onClick={() => setShowSaveModal(false)}>
          <div style={{ background:"#151520", borderRadius:20, padding:32, width:420,
            border:"1px solid rgba(255,255,255,0.06)" }} onClick={e => e.stopPropagation()} className="slide-up">
            {saved ? (
              <div style={{ textAlign:"center", padding:20 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                <div style={{ fontSize:20, fontWeight:600, color:"#fff" }}>Saved!</div>
                <div style={{ fontSize:14, color:"#666", marginTop:4 }}>Your experience is now in your library</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize:20, fontWeight:600, color:"#fff", marginBottom:20 }}>Save Experience</div>
                <input placeholder="Experience name..." value={saveName}
                  onChange={e => setSaveName(e.target.value)} autoFocus
                  style={{ width:"100%", padding:"12px 16px", borderRadius:10, background:"rgba(255,255,255,0.05)",
                    border:"1px solid rgba(255,255,255,0.1)", color:"#e0e0e0", fontSize:14, outline:"none",
                    marginBottom:12, boxSizing:"border-box" }} />
                <label style={{ fontSize:13, color:"#888", display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
                  <input type="checkbox" style={{ accentColor:goldDark }} /> Add to Favorites
                </label>
                <div style={{ display:"flex", gap:10, marginTop:20 }}>
                  <button onClick={handleSave}
                    style={{ flex:1, padding:"12px 24px", borderRadius:10, background:`linear-gradient(135deg, ${goldDark}, ${gold})`,
                      color:bg, fontSize:14, fontWeight:600, border:"none", cursor:"pointer" }}>Save</button>
                  <button onClick={() => setShowSaveModal(false)}
                    style={{ flex:1, padding:"10px 20px", borderRadius:10, background:"rgba(255,255,255,0.05)", color:"#e0e0e0",
                      fontSize:14, fontWeight:500, border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer" }}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
