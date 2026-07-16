//v2
import { useState, useMemo, useEffect, useRef } from "react";
import { vendors, categories, industries } from "./data/vendors";
import { products as allProducts } from "./data/products";
import { categoryLandscape } from "./data/landscape";

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const SearchIcon = () => <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />;
const ChevronRight = () => <Icon d="M9 18l6-6-6-6" />;
const StarIcon = () => <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size={14} />;
const XIcon = () => <Icon d="M18 6L6 18M6 6l12 12" size={14} />;
const ArrowLeft = () => <Icon d="M19 12H5M12 19l-7-7 7-7" size={15} />;
const CheckIcon = () => <Icon d="M20 6L9 17l-5-5" size={13} />;
const FilterIcon = () => <Icon d="M4 6h16M7 12h10M10 18h4" />;
const GridIcon = () => <Icon d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" size={15} />;
const ListIcon = () => <Icon d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" size={15} />;
const BuildingIcon = () => <Icon d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" size={15} />;
const PhoneIcon = () => <Icon d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5 19.79 19.79 0 01.1 4.18 2 2 0 012.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.29 6.29l1.45-.87a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" size={15} />;
const GlobeIcon = () => <Icon d="M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" size={15} />;

function PriceBadge({ tier, large = false }) {
  if (!tier) return null;
  const configs = {
    "$":    { bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.25)",  color: "#22c55e", label: "$ — Under $50k typical" },
    "$$":   { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", color: "#f59e0b", label: "$$ — $50k–$200k typical" },
    "$$$":  { bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.25)", color: "#f97316", label: "$$$ — $200k–$500k typical" },
    "$$$$": { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)",  color: "#ef4444", label: "$$$$ — $500k+ typical" },
    "RaaS": { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)", color: "#818cf8", label: "RaaS — Subscription / per-robot-per-month" },
  };
  const c = configs[tier] || configs["$$$$"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: large ? 13 : 11, fontWeight: 700,
      padding: large ? "5px 12px" : "2px 8px",
      borderRadius: large ? 8 : 6,
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
    }}>
      {c.label}
    </span>
  );
}

// ─── RESPONSIVE HOOK ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}


const S = {
  // Layout
  app: { fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh", background: "#0b1220", color: "#e8edf5" },
  // Nav
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 60, background: "#0d1526", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 },
  logo: { fontSize: 17, fontWeight: 800, letterSpacing: "-0.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
  logoMark: { width: 28, height: 28, background: "#f59e0b", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#0b1220" },
  logoAccent: { color: "#f59e0b" },
  navLinks: { display: "flex", gap: 28, fontSize: 13, color: "#94a3b8" },
  navLink: { cursor: "pointer", transition: "color 0.15s" },
  navCta: { padding: "8px 18px", background: "#f59e0b", color: "#0b1220", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" },
  // Hero
  hero: { padding: "48px 20px 40px", textAlign: "center", background: "linear-gradient(180deg, #0d1a35 0%, #0b1220 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  heroEyebrow: { fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#f59e0b", textTransform: "uppercase", marginBottom: 14 },
  heroH1: { fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 16, background: "linear-gradient(135deg, #e8edf5 0%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { fontSize: 15, color: "#64748b", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.7 },
  searchWrap: { maxWidth: 620, margin: "0 auto 16px", display: "flex", background: "#131f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden" },
  searchInput: { flex: 1, background: "transparent", border: "none", padding: "13px 16px", fontSize: 14, color: "#e8edf5", outline: "none", minWidth: 0 },
  searchSelect: { background: "#1a2a45", border: "none", borderLeft: "1px solid rgba(255,255,255,0.08)", padding: "0 10px", fontSize: 12, color: "#94a3b8", outline: "none", cursor: "pointer" },
  searchBtn: { padding: "0 18px", background: "#f59e0b", border: "none", color: "#0b1220", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },
  chips: { display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" },
  chip: { padding: "6px 14px", borderRadius: 20, fontSize: 12, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "#94a3b8", background: "transparent", transition: "all 0.15s" },
  chipActive: { background: "#f59e0b", color: "#0b1220", border: "1px solid #f59e0b", fontWeight: 600 },
  // Stats bar
  statsBar: { display: "flex", justifyContent: "center", gap: 24, padding: "16px", background: "#0d1526", borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" },
  statItem: { textAlign: "center" },
  statN: { fontSize: 22, fontWeight: 700, color: "#f59e0b" },
  statL: { fontSize: 12, color: "#475569", marginTop: 2 },
  // Main layout
  main: { display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 300px)" },
  sidebar: { background: "#0d1526", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "24px 16px" },
  sideLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#475569", textTransform: "uppercase", marginBottom: 10, marginTop: 24, paddingLeft: 8 },
  filterItem: { display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 6, fontSize: 13, color: "#64748b", cursor: "pointer", transition: "all 0.12s" },
  content: { padding: "24px 28px" },
  contentHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  resultCount: { fontSize: 13, color: "#475569" },
  // Vendor cards
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 },
  card: { background: "#0f1c30", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.18s", position: "relative" },
  cardFeatured: { borderColor: "rgba(245,158,11,0.35)" },
  cardSelected: { borderColor: "#f59e0b", borderWidth: 2 },
  featuredBadge: { position: "absolute", top: 14, right: 14, background: "rgba(245,158,11,0.15)", color: "#f59e0b", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, letterSpacing: "0.06em" },
  logoCircle: { width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 14 },
  cardName: { fontSize: 16, fontWeight: 700, marginBottom: 4, color: "#e8edf5" },
  cardTagline: { fontSize: 12, color: "#475569", marginBottom: 12, lineHeight: 1.5 },
  tags: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 },
  tag: { padding: "3px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 8, fontSize: 11, color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" },
  cardFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, marginTop: 4 },
  rating: { display: "flex", alignItems: "center", gap: 4, color: "#f59e0b", fontSize: 13, fontWeight: 600 },
  ratingCount: { color: "#475569", fontWeight: 400, fontSize: 12 },
  compareCheck: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", cursor: "pointer" },
  // Compare bar
  compareBar: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1a2a45", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: "10px 18px", marginBottom: 20, fontSize: 13 },
  compareBtn: { padding: "7px 18px", background: "#f59e0b", color: "#0b1220", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" },
  compareBtnDisabled: { background: "#1e2d45", color: "#475569", cursor: "not-allowed" },
  // Detail page
  detailWrap: { maxWidth: 1100, margin: "0 auto", padding: "24px 16px" },
  backBtn: { display: "inline-flex", alignItems: "center", gap: 6, color: "#f59e0b", fontSize: 13, cursor: "pointer", marginBottom: 20, background: "none", border: "none", fontFamily: "inherit" },
  detailHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" },
  detailName: { fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6, color: "#e8edf5" },
  detailSub: { fontSize: 13, color: "#475569", marginBottom: 14 },
  detailBody: { display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 },
  detailMain: { background: "#0f1c30", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" },
  detailSide: { display: "flex", flexDirection: "column", gap: 16 },
  tabs: { display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", overflowX: "auto" },
  tab: { padding: "12px 16px", fontSize: 12, cursor: "pointer", color: "#475569", borderBottom: "2px solid transparent", transition: "all 0.15s", whiteSpace: "nowrap" },
  tabActive: { color: "#f59e0b", borderBottomColor: "#f59e0b", fontWeight: 600 },
  tabContent: { padding: 20 },
  specGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  specItem: { background: "#0d1526", borderRadius: 8, padding: "10px 14px" },
  specLabel: { fontSize: 11, color: "#475569", marginBottom: 4 },
  specVal: { fontSize: 14, fontWeight: 600, color: "#e8edf5" },
  sideCard: { background: "#0f1c30", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: 20 },
  sideCardTitle: { fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 14 },
  contactRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#64748b", marginBottom: 10 },
  btnPrimary: { padding: "10px 20px", background: "#f59e0b", color: "#0b1220", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%" },
  btnSecondary: { padding: "10px 20px", background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13, cursor: "pointer", width: "100%" },
  rfiInput: { width: "100%", background: "#0d1526", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#e8edf5", outline: "none", fontFamily: "inherit", marginBottom: 8, boxSizing: "border-box" },
  rfiLabel: { fontSize: 11, color: "#475569", display: "block", marginBottom: 4 },
  review: { background: "#0d1526", borderRadius: 10, padding: 16, marginBottom: 10 },
  reviewHead: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  reviewAuthor: { fontSize: 13, fontWeight: 600, color: "#94a3b8" },
  reviewRating: { display: "flex", alignItems: "center", gap: 4, color: "#f59e0b", fontSize: 12 },
  reviewText: { fontSize: 13, color: "#475569", lineHeight: 1.6 },
  metricRow: { display: "flex", gap: 10, marginBottom: 20 },
  metric: { flex: 1, background: "#0d1526", borderRadius: 8, padding: "12px", textAlign: "center" },
  metricN: { fontSize: 20, fontWeight: 700, color: "#f59e0b" },
  metricL: { fontSize: 11, color: "#475569", marginTop: 3 },
  // Compare table
  compareWrap: { maxWidth: 1100, margin: "0 auto", padding: "24px 16px" },
  compareTable: { width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 500 },
  compareTh: { padding: "12px 16px", textAlign: "left", background: "#0d1526", border: "1px solid rgba(255,255,255,0.07)", fontSize: 12, color: "#475569", fontWeight: 600 },
  compareTd: { padding: "12px 16px", border: "1px solid rgba(255,255,255,0.06)", color: "#94a3b8", verticalAlign: "top" },
  // Homepage cards
  catGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 },
  catCard: { background: "#0f1c30", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "20px 16px", cursor: "pointer", transition: "all 0.15s", textAlign: "center" },
  catName: { fontSize: 13, fontWeight: 600, color: "#94a3b8", marginTop: 10 },
  catCount: { fontSize: 12, color: "#475569", marginTop: 4 },
  section: { maxWidth: 1100, margin: "0 auto", padding: "40px 16px" },
  sectionTitle: { fontSize: 24, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 8, color: "#e8edf5" },
  sectionSub: { fontSize: 14, color: "#475569", marginBottom: 32 },
  // List vendor page
  listWrap: { maxWidth: 680, margin: "0 auto", padding: "32px 16px" },
  listTitle: { fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 8, color: "#e8edf5" },
  listSub: { fontSize: 14, color: "#475569", marginBottom: 32, lineHeight: 1.7 },
  pricingGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 },
  pricingCard: { background: "#0f1c30", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", padding: 20, textAlign: "center" },
  pricingCardFeatured: { borderColor: "rgba(245,158,11,0.4)", background: "#151f35" },
  pricingTier: { fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 },
  pricingPrice: { fontSize: 22, fontWeight: 800, color: "#e8edf5", marginBottom: 4 },
  pricingDesc: { fontSize: 12, color: "#475569" },
};


const FORM_ENDPOINT = "https://formspree.io/f/mgodkjpy";
const LEAD_LOG_KEY = "opexscout_local_lead_log";
const SHORTLISTS_KEY = "opexscout_shortlists";
const WORKSPACES_KEY = "opexscout_workspaces";
const RECENTLY_VIEWED_KEY = "opexscout_recently_viewed";

// ─── RECENTLY VIEWED ──────────────────────────────────────────────────────────
function addRecentlyViewed(vendorId) {
  try {
    const existing = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
    const updated = [vendorId, ...existing.filter(id => id !== vendorId)].slice(0, 8);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {}
}
function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]"); } catch { return []; }
}

// ─── SHORTLIST STORAGE ────────────────────────────────────────────────────────
function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function readShortlists() {
  try { return JSON.parse(localStorage.getItem(SHORTLISTS_KEY) || "[]"); } catch { return []; }
}
function writeShortlists(lists) {
  try { localStorage.setItem(SHORTLISTS_KEY, JSON.stringify(lists)); } catch {}
}
function saveShortlist(name, vendorIds, productIds, notes = "") {
  const lists = readShortlists();
  const id = genId();
  const entry = { id, name: name || "My Shortlist", vendorIds, productIds, notes, created: new Date().toISOString(), updated: new Date().toISOString() };
  lists.unshift(entry);
  writeShortlists(lists.slice(0, 50));
  return id;
}
function updateShortlist(id, patch) {
  const lists = readShortlists();
  const idx = lists.findIndex(l => l.id === id);
  if (idx === -1) return;
  lists[idx] = { ...lists[idx], ...patch, updated: new Date().toISOString() };
  writeShortlists(lists);
}
function deleteShortlist(id) { writeShortlists(readShortlists().filter(l => l.id !== id)); }
function getShortlistById(id) { return readShortlists().find(l => l.id === id) || null; }
function shortlistShareUrl(id) { return `${window.location.origin}${window.location.pathname}#shortlist/${id}`; }

// ─── WORKSPACE STORAGE ────────────────────────────────────────────────────────
const DEFAULT_WORKSPACE = {
  // Project context
  projectName: "",
  facilityType: "Warehouse & DC",
  facilitySqft: "",
  throughputTarget: "",
  currentWMS: "",
  projectType: "Brownfield retrofit",
  budgetRange: "$200k–$500k",
  timeline: "6–12 months",
  problemStatement: "",
  successCriteria: "",
  // Vendors in scope
  vendorIds: [],
  // Scorecard: { vendorId: { fit, implementation, support, integration, cost, notes } }
  scorecard: {},
  // ROI inputs
  roi: {
    laborHeadcount: "",
    laborRate: "",
    shiftsPerDay: "2",
    daysPerYear: "250",
    ordersPerDay: "",
    errorRatePercent: "",
    currentOvertimeHours: "",
    automationCapturePercent: "70",
  },
  // RFI tracker: { vendorId: { contacted, contactDate, contactName, contactEmail, responseStatus, demoScheduled, demoDate, notes } }
  rfis: {},
  // File links: [{ id, label, url, type, notes, added }]
  fileLinks: [],
  created: "",
  updated: "",
};

function readWorkspaces() {
  try { return JSON.parse(localStorage.getItem(WORKSPACES_KEY) || "[]"); } catch { return []; }
}
function writeWorkspaces(ws) {
  try { localStorage.setItem(WORKSPACES_KEY, JSON.stringify(ws)); } catch {}
}
function createWorkspace(name) {
  const workspaces = readWorkspaces();
  const id = genId();
  const ws = { ...DEFAULT_WORKSPACE, id, projectName: name || "New Evaluation", created: new Date().toISOString(), updated: new Date().toISOString() };
  workspaces.unshift(ws);
  writeWorkspaces(workspaces.slice(0, 20));
  return id;
}
function updateWorkspace(id, patch) {
  const workspaces = readWorkspaces();
  const idx = workspaces.findIndex(w => w.id === id);
  if (idx === -1) return;
  workspaces[idx] = { ...workspaces[idx], ...patch, updated: new Date().toISOString() };
  writeWorkspaces(workspaces);
  return workspaces[idx];
}
function deleteWorkspace(id) { writeWorkspaces(readWorkspaces().filter(w => w.id !== id)); }
function getWorkspace(id) { return readWorkspaces().find(w => w.id === id) || null; }

function makePlaceholderDataUri(label, vendorColor = "#1a3a5c", category = "", vendorLogo = "") {
  const text = String(label || "Product").slice(0, 36);
  const logo = String(vendorLogo || "").slice(0, 3);
  const catIcons = {
    "Palletizing": "📦", "Depalletizing": "📦", "AMR": "🤖", "Collaborative Robot": "🦾",
    "Cobot": "🦾", "Industrial Robot": "⚙️", "Conveyor": "🔄", "Sortation": "🔄",
    "AS/RS": "🏗️", "WMS": "💻", "Dock": "🚛", "Vision": "👁️", "Sensor": "📡",
    "Labor": "👷", "Simulation": "📊", "AGV": "🚚", "Inspection": "🔍",
  };
  const icon = Object.entries(catIcons).find(([k]) => category?.includes(k))?.[1] || "⚙️";
  const color = vendorColor || "#1a3a5c";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.25"/>
        <stop offset="50%" style="stop-color:#0d1526;stop-opacity:1"/>
        <stop offset="100%" style="stop-color:#0b1220;stop-opacity:1"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="40%" r="40%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.15"/>
        <stop offset="100%" style="stop-color:${color};stop-opacity:0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="675" fill="#0b1220"/>
    <rect width="1200" height="675" fill="url(#bgGrad)"/>
    <rect width="1200" height="675" fill="url(#glow)"/>
    <g opacity="0.04">
      <line x1="0" y1="100" x2="1200" y2="100" stroke="#ffffff" stroke-width="1"/>
      <line x1="0" y1="200" x2="1200" y2="200" stroke="#ffffff" stroke-width="1"/>
      <line x1="0" y1="300" x2="1200" y2="300" stroke="#ffffff" stroke-width="1"/>
      <line x1="0" y1="400" x2="1200" y2="400" stroke="#ffffff" stroke-width="1"/>
      <line x1="0" y1="500" x2="1200" y2="500" stroke="#ffffff" stroke-width="1"/>
      <line x1="0" y1="600" x2="1200" y2="600" stroke="#ffffff" stroke-width="1"/>
      <line x1="200" y1="0" x2="200" y2="675" stroke="#ffffff" stroke-width="1"/>
      <line x1="400" y1="0" x2="400" y2="675" stroke="#ffffff" stroke-width="1"/>
      <line x1="600" y1="0" x2="600" y2="675" stroke="#ffffff" stroke-width="1"/>
      <line x1="800" y1="0" x2="800" y2="675" stroke="#ffffff" stroke-width="1"/>
      <line x1="1000" y1="0" x2="1000" y2="675" stroke="#ffffff" stroke-width="1"/>
    </g>
    <circle cx="600" cy="290" r="100" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-width="2" stroke-opacity="0.3"/>
    <text x="600" y="320" text-anchor="middle" font-size="80" font-family="Arial">${icon}</text>
    <text x="600" y="430" text-anchor="middle" fill="#e8edf5" font-size="36" font-family="Arial, sans-serif" font-weight="700" letter-spacing="-0.5">${text}</text>
    <text x="600" y="475" text-anchor="middle" fill="#64748b" font-size="18" font-family="Arial, sans-serif" font-weight="500">${category || "Product"}</text>
    <line x1="500" y1="540" x2="700" y2="540" stroke="${color}" stroke-width="1" stroke-opacity="0.3"/>
    <text x="600" y="580" text-anchor="middle" fill="${color}" font-size="13" font-family="Arial, sans-serif" font-weight="700" letter-spacing="2" opacity="0.7">OPEX SCOUT</text>
    <text x="600" y="605" text-anchor="middle" fill="#475569" font-size="12" font-family="Arial, sans-serif">Awaiting vendor-supplied imagery</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getProductImage(product, vendor) {
  if (product?.image) return product.image;
  if (product?.gallery?.length) return product.gallery[0];
  return makePlaceholderDataUri(product?.name || "Product", vendor?.color, product?.category || "", vendor?.logo);
}

// Reusable image component with automatic fallback to placeholder
function ProductImg({ product, vendor, style, onClick }) {
  const placeholder = makePlaceholderDataUri(product?.name || "Product", vendor?.color, product?.category, vendor?.logo);
  const [src, setSrc] = useState(getProductImage(product, vendor));
  return (
    <img
      src={src}
      alt={product?.name || "Product"}
      style={style}
      onClick={onClick}
      onError={() => setSrc(placeholder)}
    />
  );
}

function getProductGallery(product) {
  const items = [];
  if (product?.image) items.push(product.image);
  if (product?.gallery?.length) items.push(...product.gallery);
  const deduped = [...new Set(items)].filter(Boolean);
  return deduped.length ? deduped : [makePlaceholderDataUri(product?.name || "Product")];
}

function getMediaStatus(product) {
  const hasOfficialImage = Boolean(product?.image || product?.gallery?.length);
  const hasVideo = Boolean(product?.youtube_id || product?.videoUrl);
  const hasSpec = Boolean(product?.specSheetUrl || product?.catalogUrl);
  if (hasOfficialImage && hasVideo && hasSpec) return { label: "Media complete", color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.24)" };
  if (hasOfficialImage && hasSpec) return { label: "Photo + specs", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.24)" };
  if (hasOfficialImage) return { label: "Official image", color: "#818cf8", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.24)" };
  if (hasVideo && hasSpec) return { label: "Video + specs", color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.22)" };
  if (hasVideo) return { label: "Video only", color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.22)" };
  return { label: "Needs official image", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" };
}

function MediaBadge({ product }) {
  const status = getMediaStatus(product);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: status.bg, border: `1px solid ${status.border}`, color: status.color, letterSpacing: "0.02em" }}>
      {status.label}
    </span>
  );
}

function readLeadLog() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LEAD_LOG_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLeadLog(items) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LEAD_LOG_KEY, JSON.stringify(items));
  } catch {}
}

function recordLead(entry) {
  const current = readLeadLog();
  current.unshift(entry);
  writeLeadLog(current.slice(0, 150));
}

async function submitLeadForm(payload, meta = {}) {
  const timestamp = new Date().toISOString();
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp,
    status: "new",
    ...meta,
    ...payload,
  };
  recordLead(entry);
  const body = {
    ...payload,
    ...meta,
    _timestamp: timestamp,
    _page_url: typeof window !== "undefined" ? window.location.href : "",
  };
  const res = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(body),
  });
  return res.ok;
}

const categoryPlaybooks = {
  "AMR / Mobile Robots": {
    deployment: "8–16 weeks pilot; 3–6 months full rollout",
    roi: "12–24 month payback is typical when travel reduction and labor redeployment are clear.",
    commercial: "Often sold as capex or RaaS, depending on fleet size and software scope.",
    questions: [
      "What WMS and order profiles has this system already integrated with?",
      "How does the fleet behave during Wi-Fi loss, congestion, and battery peaks?",
      "What throughput assumptions are required to hit the stated ROI?",
    ],
  },
  "Dock Automation": {
    deployment: "3–6 month implementation depending on dock readiness and trailer mix",
    roi: "Fastest ROI when inbound or outbound dock volume is high and labor is constrained.",
    commercial: "Usually project-based capex with installation and change-management scope.",
    questions: [
      "What trailer conditions and dock profiles are out of scope?",
      "How much floor prep or dock modification is required?",
      "What labor and cycle-time assumptions drive the business case?",
    ],
  },
  "Industrial Robotics": {
    deployment: "4–8 month project timeline including tooling, controls, and commissioning",
    roi: "Most compelling when uptime, repeatability, and safety improvements matter more than flexibility.",
    commercial: "Capex-driven with tooling, controls, and integration often exceeding robot-only cost.",
    questions: [
      "Who owns controls integration, guarding, and commissioning?",
      "What spares, support SLA, and training are included?",
      "How flexible is the cell if SKU mix changes next year?",
    ],
  },
  "Conveyor & Sortation": {
    deployment: "6–12 month project with design, controls, FAT, and phased cutover",
    roi: "Best for sustained volume growth and network-standardized operations.",
    commercial: "Large project capex with software, controls, and installation bundled.",
    questions: [
      "How are peak rates validated before go-live?",
      "What are the maintenance and spare-parts expectations?",
      "What is the fallback operating mode during controls faults?",
    ],
  },
  "WMS Platforms": {
    deployment: "6–18 month implementation depending on site count and process complexity",
    roi: "Value usually comes from process discipline, inventory accuracy, and scalability rather than labor alone.",
    commercial: "Subscription or license-based, with implementation often equal to or above first-year software cost.",
    questions: [
      "Which core workflows are native versus customized?",
      "How many sites and process variants has the team deployed recently?",
      "What reporting and integration work must the customer own?",
    ],
  },
};

function getVendorPlaybook(vendor) {
  return categoryPlaybooks[vendor?.category] || {
    deployment: "Project timing depends on solution complexity, systems integration, and site readiness.",
    roi: "ROI should be validated against labor, throughput, quality, and uptime assumptions.",
    commercial: "Commercial structure varies by equipment, software, and integration scope.",
    questions: [
      "What assumptions are built into the business case?",
      "What implementation resources are required from the customer?",
      "How is support handled after go-live?",
    ],
  };
}

function inferCommercialModel(vendor) {
  if (vendor?.price_range === "RaaS") return "RaaS / subscription";
  if (vendor?.category === "WMS Platforms" || vendor?.category === "Labor Management") return "Software subscription + implementation";
  return "Capex project + integration";
}

function inferImplementationLevel(vendor) {
  const cat = vendor?.category || "";
  if (["Conveyor & Sortation", "AS/RS & Storage", "Systems Integration"].includes(cat)) return "High";
  if (["Industrial Robotics", "Dock Automation", "WMS Platforms", "Manufacturing Automation"].includes(cat)) return "Medium to high";
  return "Medium";
}


function getVendorProducts(vendor) {
  return allProducts[vendor?.slug] || [];
}

function getProfileScore(vendor) {
  const productCount = getVendorProducts(vendor).length;
  const checks = [
    Boolean(vendor?.desc && vendor.desc.length > 120),
    Boolean(vendor?.best_for),
    Boolean(vendor?.not_for),
    Boolean(vendor?.strengths?.length >= 3),
    Boolean(vendor?.weaknesses?.length >= 2),
    Boolean(vendor?.integrations?.length >= 2),
    Boolean(vendor?.specs?.length >= 4),
    productCount >= 2,
    Boolean(vendor?.practitioner_notes),
    Boolean(vendor?.website),
  ];
  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const missing = [
    !checks[1] && "best-fit guidance",
    !checks[2] && "watch-outs",
    !checks[4] && "implementation risks",
    productCount < 2 && "product listings",
    !checks[8] && "practitioner notes",
  ].filter(Boolean);
  const level = score >= 85 ? "Research-ready" : score >= 65 ? "Enhanced" : "Basic";
  const color = score >= 85 ? "#22c55e" : score >= 65 ? "#f59e0b" : "#94a3b8";
  return { score, level, color, productCount, missing };
}

function estimateLeadQuality(lead) {
  let score = 20;
  if (lead.company) score += 15;
  if (lead.email) score += 15;
  if (lead.phone) score += 10;
  if (lead.budget && !String(lead.budget).toLowerCase().includes("explor")) score += 15;
  if (lead.timeline && !String(lead.timeline).includes("12+")) score += 10;
  if (lead.description || lead.notes) score += 10;
  if (lead.vendor || lead.product) score += 5;
  return Math.min(score, 100);
}

function ProfileScoreBadge({ vendor }) {
  const profile = getProfileScore(vendor);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 11, fontWeight: 700, padding: "4px 9px", borderRadius: 999,
      color: profile.color, background: `${profile.color}18`, border: `1px solid ${profile.color}33`
    }}>
      {profile.level} · {profile.score}%
    </span>
  );
}

function getSimilarVendors(vendor) {
  return vendors.filter(v => v.id !== vendor.id && (v.category === vendor.category || v.industry.some(i => vendor.industry.includes(i)))).slice(0, 3);
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span style={S.rating}>
      <StarIcon /> {rating.toFixed(1)}
    </span>
  );
}

function VendorCard({ vendor, selected, onSelect, onClick, compareCount }) {
  const profile = getProfileScore(vendor);
  const typeColor = { "Manufacturer": "#22c55e", "Software": "#818cf8", "Systems Integrator": "#f59e0b", "Manufacturer + SI": "#38bdf8", "Component Supplier": "#94a3b8" };
  const typeBg = { "Manufacturer": "rgba(34,197,94,0.1)", "Software": "rgba(99,102,241,0.1)", "Systems Integrator": "rgba(245,158,11,0.1)", "Manufacturer + SI": "rgba(56,189,248,0.1)", "Component Supplier": "rgba(148,163,184,0.1)" };
  const typeBorder = { "Manufacturer": "rgba(34,197,94,0.2)", "Software": "rgba(99,102,241,0.2)", "Systems Integrator": "rgba(245,158,11,0.2)", "Manufacturer + SI": "rgba(56,189,248,0.2)", "Component Supplier": "rgba(148,163,184,0.2)" };

  return (
    <div
      data-vendor-card="true"
      style={{ ...S.card, ...(vendor.featured ? S.cardFeatured : {}), ...(selected ? S.cardSelected : {}) }}
      onClick={onClick}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ ...S.logoCircle, background: vendor.color, marginBottom: 0, flexShrink: 0 }}>{vendor.logo}</div>
          <div>
            <div style={S.cardName}>{vendor.name}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>{vendor.hq} · Est. {vendor.founded}</div>
          </div>
        </div>
        {vendor.featured && <span style={{ fontSize: 9, fontWeight: 800, color: "#f59e0b", letterSpacing: "0.08em", flexShrink: 0 }}>FEATURED</span>}
      </div>

      {/* Type + Category badges */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
        {vendor.vendor_type && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: typeBg[vendor.vendor_type] || "rgba(148,163,184,0.1)", color: typeColor[vendor.vendor_type] || "#94a3b8", border: `1px solid ${typeBorder[vendor.vendor_type] || "rgba(148,163,184,0.2)"}` }}>
            {vendor.vendor_type}
          </span>
        )}
        <span style={{ ...S.tag, fontSize: 10 }}>{vendor.category}</span>
      </div>

      {/* Tagline */}
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, lineHeight: 1.5 }}>{vendor.tagline}</div>

      {/* Best for snippet */}
      {vendor.best_for && (
        <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.5, marginBottom: 10, padding: "6px 8px", background: "rgba(34,197,94,0.05)", borderRadius: 6, borderLeft: "2px solid rgba(34,197,94,0.3)" }}>
          <span style={{ color: "#22c55e", fontWeight: 600 }}>Best for: </span>{vendor.best_for.slice(0, 80)}{vendor.best_for.length > 80 ? "..." : ""}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
        <div style={{ background: "#0d1526", borderRadius: 6, padding: "6px 8px" }}>
          <div style={{ fontSize: 9, color: "#475569", marginBottom: 2 }}>Products</div>
          <div style={{ fontSize: 12, color: "#e8edf5", fontWeight: 700 }}>{profile.productCount || "—"}</div>
        </div>
        <div style={{ background: "#0d1526", borderRadius: 6, padding: "6px 8px" }}>
          <div style={{ fontSize: 9, color: "#475569", marginBottom: 2 }}>Price</div>
          <div style={{ fontSize: 12, color: vendor.price_range ? "#94a3b8" : "#334155", fontWeight: 700 }}>{vendor.price_range || "—"}</div>
        </div>
        <div style={{ background: "#0d1526", borderRadius: 6, padding: "6px 8px" }}>
          <div style={{ fontSize: 9, color: "#475569", marginBottom: 2 }}>Timeline</div>
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, lineHeight: 1.2 }}>{vendor.implementation_pilot?.split(" ")[0] || "—"}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ ...S.cardFooter }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {vendor.tags.slice(0, 2).map(t => <span key={t} style={S.tag}>{t}</span>)}
        </div>
        <label style={S.compareCheck} onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selected}
            onChange={e => onSelect(vendor.id, e.target.checked)}
            disabled={!selected && compareCount >= 4}
            style={{ accentColor: "#f59e0b" }}
          />
          Compare
        </label>
      </div>
    </div>
  );
}

function NavBar({ page, setPage }) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["directory", "Directory"],
    ["matrix", "Compare"],
    ["categories", "Categories"],
    ["solution", "Find Solution"],
    ["shortlists", "Workspace"],
  ];
  return (
    <nav style={S.nav}>
      <div style={S.logo} onClick={() => { setPage("home"); setMenuOpen(false); }}>
        <div style={S.logoMark}>O</div>
        OpEx<span style={S.logoAccent}>Scout</span>
      </div>
      {!isMobile && (
        <div style={{ ...S.navLinks, gap: 20 }}>
          {links.map(([p, label]) => (
            <span key={p} style={{ ...S.navLink, color: page === p ? "#e8edf5" : "#64748b" }} onClick={() => setPage(p)}>{label}</span>
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {!isMobile && (
          <>
            <button style={{ ...S.btnSecondary, width: "auto", padding: "7px 14px", fontSize: 12 }} onClick={() => setPage("solution")}>Find solution</button>
            <button style={{ padding: "7px 14px", background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12, cursor: "pointer" }} onClick={() => setPage("list")}>For vendors</button>
          </>
        )}
        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", color: "#94a3b8", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        )}
      </div>
      {isMobile && menuOpen && (
        <div style={{ position: "absolute", top: 60, left: 0, right: 0, background: "#0d1526", borderBottom: "1px solid rgba(255,255,255,0.08)", zIndex: 200, padding: "12px 0" }}>
          {links.map(([p, label]) => (
            <div key={p} style={{ padding: "14px 24px", fontSize: 15, color: page === p ? "#f59e0b" : "#94a3b8", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", fontWeight: page === p ? 600 : 400 }}
              onClick={() => { setPage(p); setMenuOpen(false); }}>
              {label}
            </div>
          ))}
          <div style={{ padding: "14px 24px" }}>
            <button style={{ ...S.navCta, width: "100%", fontFamily: "inherit" }} onClick={() => { setPage("list"); setMenuOpen(false); }}>Claim Listing</button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────
function HeroSearch({ setPage, setCategoryFilter, setInitialSearch, openDetail }) {
  const [heroSearch, setHeroSearch] = useState("");
  const [heroCat, setHeroCat] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const doSearch = (term) => {
    const q = term !== undefined ? term : heroSearch;
    if (q) setInitialSearch(q);
    if (heroCat) setCategoryFilter(heroCat);
    setShowSuggestions(false);
    setPage("directory");
  };

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions = useMemo(() => {
    if (!heroSearch || heroSearch.length < 2) return [];
    const q = heroSearch.toLowerCase();
    const vendorMatches = vendors
      .filter(v => v.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map(v => ({ type: "vendor", label: v.name, sub: v.category, vendor: v }));
    const categoryMatches = categories
      .filter(c => c.toLowerCase().includes(q))
      .slice(0, 3)
      .map(c => ({ type: "category", label: c, sub: `${vendors.filter(v => v.category === c).length} vendors` }));
    const tagMatches = [...new Set(vendors.flatMap(v => v.tags || []))]
      .filter(t => t.toLowerCase().includes(q))
      .slice(0, 2)
      .map(t => ({ type: "tag", label: t, sub: "Technology" }));
    return [...vendorMatches, ...categoryMatches, ...tagMatches].slice(0, 8);
  }, [heroSearch]);

  return (
    <div ref={searchRef} style={{ maxWidth: 620, margin: "0 auto 16px", position: "relative" }}>
      <div style={S.searchWrap}>
        <input
          style={S.searchInput}
          placeholder="Search vendors, products, categories, or use cases..."
          value={heroSearch}
          onChange={e => { setHeroSearch(e.target.value); setShowSuggestions(e.target.value.length >= 2); }}
          onFocus={() => heroSearch.length >= 2 && setShowSuggestions(true)}
          onKeyDown={e => { if (e.key === "Enter") doSearch(); if (e.key === "Escape") setShowSuggestions(false); }}
        />
        <select style={S.searchSelect} value={heroCat} onChange={e => setHeroCat(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button style={S.searchBtn} onClick={() => doSearch()}>Search</button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 300, background: "#131f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, marginTop: 4, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          {suggestions.map((s, i) => (
            <div key={i}
              style={{ padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, borderBottom: i < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
              onMouseDown={e => {
                e.preventDefault();
                if (s.type === "vendor") {
                  openDetail(s.vendor, "home", "home");
                  setShowSuggestions(false);
                } else if (s.type === "category") {
                  setCategoryFilter(s.label);
                  setPage("directory");
                  setShowSuggestions(false);
                } else {
                  doSearch(s.label);
                }
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
                background: s.type === "vendor" ? (s.vendor?.color || "#1a2a45") : s.type === "category" ? "rgba(245,158,11,0.15)" : "rgba(99,102,241,0.15)",
                color: s.type === "vendor" ? "#fff" : s.type === "category" ? "#f59e0b" : "#818cf8",
              }}>
                {s.type === "vendor" ? (s.vendor?.logo || s.label[0]) : s.type === "category" ? "⊞" : "#"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: "#e8edf5", fontWeight: s.type === "vendor" ? 600 : 400 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{s.sub}</div>
              </div>
              <div style={{ fontSize: 11, color: "#475569", flexShrink: 0 }}>
                {s.type === "vendor" ? "View profile →" : s.type === "category" ? "Browse category →" : "Search →"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OnboardingTour({ onDismiss }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      icon: "🏭",
      title: "121 vendors, fully profiled",
      body: "Every major automation vendor — AMR, AS/RS, WMS, conveyor, robotics, forklifts, controls — with pricing tiers, implementation timelines, strengths, and watch-outs. Written from an operator's perspective, not vendor marketing.",
    },
    {
      icon: "🔍",
      title: "Find vendors for your project",
      body: "Use the search bar to look up any vendor by name, or use Find Solution to answer 5 questions and get a scored shortlist. The Compare Matrix shows all vendors in a category side by side.",
    },
    {
      icon: "🔧",
      title: "Practitioner notes on every vendor",
      body: "Open any vendor profile and click the Practitioner Notes tab. You'll see deployment reality, what the vendor won't tell you, best environments, watch-outs, and specific questions to ask in your RFP.",
    },
    {
      icon: "📋",
      title: "Build and export a business case",
      body: "Create an Evaluation Workspace to track vendors, run ROI calculations with NPV and IRR, score vendors on category-specific criteria, and export a formatted PDF for your director.",
    },
  ];
  const s = steps[step];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={onDismiss} />
      <div style={{ position: "relative", background: "#0f1c30", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 16, padding: "32px 36px", maxWidth: 480, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ fontSize: 44, marginBottom: 16, textAlign: "center" }}>{s.icon}</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#e8edf5", marginBottom: 12, textAlign: "center", letterSpacing: "-0.3px" }}>{s.title}</div>
        <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.75, textAlign: "center", marginBottom: 28 }}>{s.body}</div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          {steps.map((_, i) => (
            <div key={i} onClick={() => setStep(i)} style={{ width: 8, height: 8, borderRadius: "50%", background: i === step ? "#f59e0b" : "rgba(255,255,255,0.15)", cursor: "pointer", transition: "background 0.2s" }} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {step < steps.length - 1 ? (
            <>
              <button onClick={onDismiss} style={{ flex: 1, padding: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#475569", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Skip</button>
              <button onClick={() => setStep(s => s + 1)} style={{ flex: 2, padding: "10px", background: "#f59e0b", border: "none", borderRadius: 8, color: "#0b1220", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Next →</button>
            </>
          ) : (
            <button onClick={onDismiss} style={{ flex: 1, padding: "12px", background: "#f59e0b", border: "none", borderRadius: 8, color: "#0b1220", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>Start researching →</button>
          )}
        </div>
      </div>
    </div>
  );
}

function HomePage({ setPage, setCategoryFilter, setCategoryPageCategory, openDetail, setInitialSearch, setMatrixCategory }) {
  const isMobile = useIsMobile();
  const recentIds = getRecentlyViewed();
  const recentVendors = recentIds.map(id => vendors.find(v => v.id === id)).filter(Boolean);
  const catIcons = { "AMR / Mobile Robots": "🤖", "AS/RS & Storage": "📦", "Conveyor & Sortation": "🔄", "AGV Systems": "🚛", "WMS Platforms": "💻", "Controls & Sensing": "📡", "Labor Management": "👷", "Systems Integration": "🏗️", "Industrial Robotics": "⚙️", "Manufacturing Automation": "🏭", "Depalletizing & Palletizing": "🦾", "Simulation & Digital Twin": "📊", "Vision & AI": "👁️", "Dock Automation": "🚚" };

  // Show tour for first-time visitors
  const [showTour, setShowTour] = useState(() => {
    try { return !localStorage.getItem("opexscout_toured"); } catch { return false; }
  });
  const dismissTour = () => {
    try { localStorage.setItem("opexscout_toured", "1"); } catch {}
    setShowTour(false);
  };

  return (
    <div>
      {showTour && <OnboardingTour onDismiss={dismissTour} />}

      {/* ── HERO: search-first, minimal copy ── */}
      <div style={{ ...S.hero, paddingBottom: 28 }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={S.heroEyebrow}>Independent automation vendor intelligence</div>
          <h1 style={{ ...S.heroH1, fontSize: isMobile ? 26 : 36, marginBottom: 10 }}>
            Research automation vendors without the sales cycle
          </h1>
          <p style={{ ...S.heroSub, marginBottom: 20, fontSize: 14 }}>
            121 vendors profiled. Practitioner notes, pricing tiers, implementation timelines. Free.
          </p>
          <HeroSearch setPage={setPage} setCategoryFilter={setCategoryFilter} setInitialSearch={setInitialSearch} openDetail={openDetail} />
        </div>
      </div>

      {/* ── QUICK-ACCESS: four tools, no fluff ── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "16px" : "24px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
          {[
            { icon: "🗂️", label: "Directory", sub: `${vendors.length} vendors`, action: () => setPage("directory") },
            { icon: "⚖️", label: "Compare", sub: "Side by side", action: () => setPage("matrix") },
            { icon: "🔍", label: "Find Solution", sub: "Guided match", action: () => setPage("solution") },
            { icon: "📋", label: "Workspace", sub: "ROI + business case", action: () => setPage("shortlists") },
          ].map(({ icon, label, sub, action }) => (
            <div key={label} onClick={action}
              style={{ background: "#0f1c30", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: isMobile ? "14px 12px" : "16px 18px", cursor: "pointer", textAlign: "center" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.35)"; e.currentTarget.style.background = "#131f35"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "#0f1c30"; }}>
              <div style={{ fontSize: isMobile ? 22 : 26, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e8edf5", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, color: "#475569" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── RECENTLY VIEWED (only if they have history) ── */}
        {recentVendors.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>Recently viewed</span>
              <button style={{ ...S.btnSecondary, width: "auto", padding: "4px 10px", fontSize: 11 }} onClick={() => setPage("directory")}>All vendors →</button>
            </div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {recentVendors.map(v => (
                <div key={v.id} onClick={() => openDetail(v, "home", "home")}
                  style={{ flexShrink: 0, background: "#0f1c30", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                  <div style={{ ...S.logoCircle, background: v.color, width: 24, height: 24, fontSize: 8, marginBottom: 0, flexShrink: 0 }}>{v.logo}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#e8edf5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.name}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{v.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CATEGORIES: compact grid, goes straight to directory ── */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Browse by category</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 8 }}>
            {categories.map(c => (
              <div key={c}
                onClick={() => { setCategoryFilter(c); setPage("directory"); }}
                style={{ background: "#0f1c30", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; e.currentTarget.style.background = "#131f35"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "#0f1c30"; }}>
                <span style={{ fontSize: 16 }}>{catIcons[c] || "⚙️"}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c}</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>{vendors.filter(v => v.category === c).length} vendors</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FIRST-TIME NUDGE (only if no history) ── */}
        {recentVendors.length === 0 && (
          <div style={{ marginTop: 28, padding: "16px 18px", background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 12, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 3 }}>New here?</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>Take a 60-second tour or jump straight to searching vendors.</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowTour(true)} style={{ padding: "8px 14px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, color: "#f59e0b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Take the tour</button>
              <button onClick={() => setPage("directory")} style={{ ...S.navCta, fontFamily: "inherit", padding: "8px 14px", fontSize: 12 }}>Browse vendors →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DirectoryPage({ setPage, openDetail, selected, setSelected, categoryFilter, setCategoryFilter, initialSearch, setInitialSearch, activeWorkspaceId, onAddToWorkspace, setMatrixCategory }) {
  const [search, setSearch] = useState(initialSearch || "");
  const [catFilter, setCatFilter] = useState(categoryFilter || "");
  const [indFilter, setIndFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [integrationFilter, setIntegrationFilter] = useState("");
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Consume initialSearch once on mount
  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
      setInitialSearch("");
    }
  }, []);

  // When user types a search query, clear category filter so results aren't double-filtered
  const handleSearchChange = (val) => {
    setSearch(val);
    if (val.length > 0 && catFilter) {
      // Only clear catFilter if the search term doesn't match the current category
      const catMatchesSearch = catFilter.toLowerCase().includes(val.toLowerCase());
      if (!catMatchesSearch) setCatFilter("");
    }
    setShowSuggestions(val.length >= 2);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Build suggestions: vendor names + categories that match the query
  const suggestions = useMemo(() => {
    if (!search || search.length < 2) return [];
    const q = search.toLowerCase();
    const vendorMatches = vendors
      .filter(v => v.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map(v => ({ type: "vendor", label: v.name, sub: v.category, vendor: v }));
    const categoryMatches = categories
      .filter(c => c.toLowerCase().includes(q) && !vendorMatches.find(v => v.sub === c))
      .slice(0, 3)
      .map(c => ({ type: "category", label: c, sub: `${vendors.filter(v => v.category === c).length} vendors` }));
    const tagMatches = [...new Set(vendors.flatMap(v => v.tags || []))]
      .filter(t => t.toLowerCase().includes(q))
      .slice(0, 2)
      .map(t => ({ type: "tag", label: t, sub: "Technology tag" }));
    return [...vendorMatches, ...categoryMatches, ...tagMatches].slice(0, 8);
  }, [search]);

  // Build a searchable text blob per vendor including product names and descriptions
  const vendorSearchIndex = useMemo(() => {
    return vendors.map(v => {
      const vendorProds = allProducts[v.slug] || [];
      const prodText = vendorProds.map(p => `${p.name} ${p.tagline} ${p.category} ${(p.applications||[]).join(" ")} ${p.description || ""}`).join(" ");
      return {
        vendor: v,
        searchText: [v.name, v.tagline, v.desc, v.category, v.best_for || "", ...(v.tags || []), ...(v.industry || []), prodText].join(" ").toLowerCase(),
      };
    });
  }, []);

  const filtered = useMemo(() => vendorSearchIndex.filter(({ vendor: v, searchText }) => {
    const q = search.toLowerCase();
    const matchQ = !q || searchText.includes(q);
    const matchCat = !catFilter || v.category === catFilter || v.tags.some(t => t.toLowerCase().includes(catFilter.toLowerCase()));
    const matchInd = !indFilter || v.industry.includes(indFilter);
    const matchType = !typeFilter || v.vendor_type === typeFilter;
    const matchIntegration = !integrationFilter || (v.integrations || []).some(i => i.toLowerCase().includes(integrationFilter.toLowerCase()));
    return matchQ && matchCat && matchInd && matchType && matchIntegration;
  }).map(x => x.vendor), [search, catFilter, indFilter, typeFilter, integrationFilter, vendorSearchIndex]);

  const priceTierOrder = { "$": 1, "$$": 2, "$$$": 3, "$$$$": 4, "RaaS": 5 };

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortBy) {
      case "az": return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "za": return arr.sort((a, b) => b.name.localeCompare(a.name));
      case "price-asc": return arr.sort((a, b) => (priceTierOrder[a.price_range] || 9) - (priceTierOrder[b.price_range] || 9));
      case "price-desc": return arr.sort((a, b) => (priceTierOrder[b.price_range] || 0) - (priceTierOrder[a.price_range] || 0));
      case "products": return arr.sort((a, b) => (allProducts[b.slug]?.length || 0) - (allProducts[a.slug]?.length || 0));
      case "featured": default: return arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filtered, sortBy]);

  const toggleSelect = (id, checked) => {
    if (checked) setSelected(s => [...s, id]);
    else setSelected(s => s.filter(x => x !== id));
  };

  const openDetailLocal = (v) => openDetail(v, "directory", "directory");

  const workspaceMode = activeWorkspaceId && onAddToWorkspace;
  const ws = workspaceMode ? getWorkspace(activeWorkspaceId) : null;

  return (
    <div>
      <div style={{ padding: "20px 28px 0", background: "#0d1526", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
          <div ref={searchRef} style={{ flex: 1, position: "relative" }}>
            <div style={{ display: "flex", background: "#0b1220", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "0 14px", display: "flex", alignItems: "center", color: "#475569" }}><SearchIcon /></div>
              <input
                style={{ flex: 1, background: "transparent", border: "none", padding: "11px 0", fontSize: 13, color: "#e8edf5", outline: "none" }}
                placeholder="Search vendors, technologies, applications..."
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                onFocus={() => search.length >= 2 && setShowSuggestions(true)}
                onKeyDown={e => { if (e.key === "Escape") setShowSuggestions(false); }}
              />
              {search && (
                <button onClick={() => { setSearch(""); setShowSuggestions(false); }} style={{ padding: "0 12px", background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16 }}>×</button>
              )}
            </div>

            {/* Autocomplete suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 300, background: "#131f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, marginTop: 4, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                {suggestions.map((s, i) => (
                  <div key={i}
                    style={{ padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, borderBottom: i < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                    onMouseDown={e => {
                      e.preventDefault();
                      if (s.type === "vendor") {
                        openDetail(s.vendor, "directory", "directory");
                        setShowSuggestions(false);
                      } else if (s.type === "category") {
                        setCatFilter(s.label);
                        setSearch("");
                        setShowSuggestions(false);
                      } else {
                        setSearch(s.label);
                        setShowSuggestions(false);
                      }
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
                      background: s.type === "vendor" ? (s.vendor?.color || "#1a2a45") : s.type === "category" ? "rgba(245,158,11,0.15)" : "rgba(99,102,241,0.15)",
                      color: s.type === "vendor" ? "#fff" : s.type === "category" ? "#f59e0b" : "#818cf8",
                      fontWeight: 700,
                    }}>
                      {s.type === "vendor" ? (s.vendor?.logo || s.label[0]) : s.type === "category" ? "⊞" : "#"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#e8edf5", fontWeight: s.type === "vendor" ? 600 : 400 }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{s.sub}</div>
                    </div>
                    <div style={{ fontSize: 10, color: "#334155", flexShrink: 0 }}>
                      {s.type === "vendor" ? "View profile" : s.type === "category" ? "Filter category" : "Search"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <select style={{ ...S.rfiInput, marginBottom: 0, width: "auto", padding: "11px 14px" }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="">All categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select style={{ ...S.rfiInput, marginBottom: 0, width: "auto", padding: "11px 14px" }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All types</option>
            <option value="Manufacturer">Manufacturer</option>
            <option value="Systems Integrator">Systems Integrator</option>
            <option value="Manufacturer + SI">Manufacturer + SI</option>
            <option value="Software">Software</option>
            <option value="Component Supplier">Component Supplier</option>
          </select>
          <select style={{ ...S.rfiInput, marginBottom: 0, width: "auto", padding: "11px 14px" }} value={indFilter} onChange={e => setIndFilter(e.target.value)}>
            <option value="">All industries</option>
            {industries.map(i => <option key={i}>{i}</option>)}
          </select>
          <select style={{ ...S.rfiInput, marginBottom: 0, width: "auto", padding: "11px 14px" }} value={integrationFilter} onChange={e => setIntegrationFilter(e.target.value)}>
            <option value="">Works with...</option>
            {["Manhattan Associates", "SAP EWM", "Blue Yonder", "Oracle WMS", "Rockwell Automation", "Siemens", "Zebra", "Körber", "Infor", "Softeon", "All major WMS"].map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div style={S.chips}>
          {["", ...categories.slice(0, 6)].map((c, i) => (
            <div key={i} style={{ ...S.chip, ...(catFilter === c ? S.chipActive : {}) }} onClick={() => setCatFilter(c)}>{c || "All"}</div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "8px 0 0" }}>
          {[["", "All types"], ["Manufacturer", "🏭 Manufacturer"], ["Systems Integrator", "🔧 Systems Integrator"], ["Manufacturer + SI", "🏭🔧 Mfr + SI"], ["Software", "💻 Software"]].map(([val, label]) => (
            <div key={val} style={{ ...S.chip, ...(typeFilter === val ? S.chipActive : {}), fontSize: 11, padding: "4px 10px" }} onClick={() => setTypeFilter(val)}>{label}</div>
          ))}
        </div>
        <div style={{ height: 16 }} />
      </div>

      <div style={{ padding: "16px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        {workspaceMode && (
          <div style={{ ...S.compareBar, marginBottom: 10, background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.25)" }}>
            <span style={{ color: "#94a3b8" }}>Adding vendors to: <strong style={{ color: "#818cf8" }}>{ws?.projectName || "Workspace"}</strong> — check vendors below then click "Add to workspace"</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.compareBtnDisabled, padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13 }} onClick={() => setPage("workspace")}>← Back to workspace</button>
              <button style={{ padding: "7px 18px", background: "#818cf8", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: selected.length === 0 ? "not-allowed" : "pointer", opacity: selected.length === 0 ? 0.5 : 1 }}
                disabled={selected.length === 0}
                onClick={() => { onAddToWorkspace(selected); setPage("workspace"); }}>
                Add {selected.length > 0 ? selected.length : ""} to workspace
              </button>
            </div>
          </div>
        )}
        {selected.length > 0 && (
          <div style={S.compareBar}>
            <span style={{ color: "#94a3b8" }}><strong style={{ color: "#e8edf5" }}>{selected.length}</strong> vendor{selected.length > 1 ? "s" : ""} selected for comparison</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.compareBtnDisabled, padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13 }} onClick={() => setSelected([])}>Clear</button>
              <button style={{ ...S.compareBtn, ...(selected.length < 2 ? S.compareBtnDisabled : {}) }} disabled={selected.length < 2} onClick={() => setPage("compare")}>Compare ({selected.length})</button>
            </div>
          </div>
        )}

        <div style={S.contentHeader}>
          <span style={S.resultCount}>
            Showing <strong style={{ color: "#94a3b8" }}>{filtered.length}</strong> vendor{filtered.length !== 1 ? "s" : ""}
            {(catFilter || typeFilter || indFilter || integrationFilter) && <span style={{ color: "#475569" }}> · {[catFilter, typeFilter, indFilter, integrationFilter && `Works with ${integrationFilter}`].filter(Boolean).join(", ")}</span>}
            {(catFilter || typeFilter || indFilter || integrationFilter) && <span style={{ color: "#f59e0b", cursor: "pointer", marginLeft: 8, fontSize: 11 }} onClick={() => { setCatFilter(""); setTypeFilter(""); setIndFilter(""); setIntegrationFilter(""); }}>Clear filters</span>}
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {catFilter && (
              <button style={{ padding: "6px 12px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, color: "#f59e0b", fontSize: 11, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}
                onClick={() => { setMatrixCategory(catFilter); setPage("matrix"); }}>
                ⊞ Compare matrix
              </button>
            )}
            <select style={{ ...S.rfiInput, marginBottom: 0, padding: "6px 10px", fontSize: 12, width: "auto" }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="featured">Featured first</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
              <option value="products">Most products</option>
            </select>
            {[["grid", <GridIcon />], ["list", <ListIcon />]].map(([v, icon]) => (
              <button key={v} style={{ padding: "6px 10px", background: view === v ? "#1a2a45" : "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, cursor: "pointer", color: view === v ? "#e8edf5" : "#475569" }} onClick={() => setView(v)}>{icon}</button>
            ))}
          </div>
        </div>

        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 32px", color: "#475569" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, color: "#94a3b8", marginBottom: 8 }}>No vendors match these filters</div>
            <div style={{ fontSize: 13, color: "#475569", marginBottom: 20 }}>
              {search && <span>No results for "<strong style={{ color: "#64748b" }}>{search}</strong>". </span>}
              Try broadening your search or clearing some filters.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button style={{ ...S.btnSecondary, width: "auto" }} onClick={() => { setSearch(""); setCatFilter(""); setTypeFilter(""); setIndFilter(""); setIntegrationFilter(""); }}>Clear all filters</button>
              <button style={{ ...S.navCta, fontFamily: "inherit" }} onClick={() => setPage("solution")}>Try Find Solution instead</button>
            </div>
          </div>
        )}

        {view === "grid" && sorted.length > 0 && (
          <div style={S.grid}>
            {sorted.map(v => (
              <VendorCard key={v.id} vendor={v} selected={selected.includes(v.id)} onSelect={toggleSelect} onClick={() => openDetailLocal(v)} compareCount={selected.length} />
            ))}
          </div>
        )}
        {view === "list" && sorted.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sorted.map(v => (
              <div key={v.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 16 }} onClick={() => openDetailLocal(v)}>
                <div style={{ ...S.logoCircle, background: v.color, marginBottom: 0, flexShrink: 0 }}>{v.logo}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={S.cardName}>{v.name}</span>
                    {v.featured && <span style={{ ...S.featuredBadge, position: "static" }}>FEATURED</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{v.category} · {v.hq}</div>
                </div>
                <div style={S.tags}>
                  {v.tags.slice(0, 2).map(t => <span key={t} style={S.tag}>{t}</span>)}
                </div>
                <label style={S.compareCheck} onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={selected.includes(v.id)} onChange={e => toggleSelect(v.id, e.target.checked)} disabled={!selected.includes(v.id) && selected.length >= 4} style={{ accentColor: "#f59e0b" }} />
                  Compare
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetail({ product, onBack, addProductToCompare, vendor, selectedProducts }) {
  const isMobile = useIsMobile();
  const isSelected = selectedProducts?.find(sp => sp.product.id === product.id);
  const gallery = getProductGallery(product);
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const similar = (allProducts[vendor.slug] || []).filter(p => p.id !== product.id).slice(0, 3);
  const [productLead, setProductLead] = useState({ name: "", company: "", email: "", budget: "Exploring", timeline: "3–6 months", notes: "" });
  const [productLeadSent, setProductLeadSent] = useState(false);
  const [productLeadLoading, setProductLeadLoading] = useState(false);

  const submitProductLead = async () => {
    if (!productLead.name || !productLead.company || !productLead.email) return;
    setProductLeadLoading(true);
    try {
      const ok = await submitLeadForm(
        { ...productLead, vendor: vendor.name, product: product.name },
        { lead_type: "Product RFI", vendor_slug: vendor.slug, product_id: product.id, category: product.category, _subject: `OpEx Scout Product RFI — ${product.name} from ${productLead.company}` }
      );
      if (ok) setProductLeadSent(true);
    } catch (e) { console.error(e); }
    setProductLeadLoading(false);
  };

  return (
    <div style={{ padding: "0 0 32px" }}>
      <button style={{ ...S.backBtn, marginBottom: 20 }} onClick={onBack}>← Back to products</button>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr", gap: 20, marginBottom: 20 }}>
        <div>
          <div style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
            <img src={activeImage} alt={product.name} style={{ width: "100%", aspectRatio: "16/9", objectFit: "contain", display: "block" }} onError={e => { e.target.onerror = null; e.target.src = makePlaceholderDataUri(product.name, vendor?.color, product.category); }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {gallery.slice(0, 4).map((img, idx) => (
              <button key={img} onClick={() => setActiveImage(img)} style={{ padding: 0, borderRadius: 8, overflow: "hidden", border: activeImage === img ? "2px solid #f59e0b" : "1px solid rgba(255,255,255,0.08)", background: "#0d1526", cursor: "pointer" }}>
                <img src={img} alt={`${product.name} media ${idx + 1}`} style={{ width: "100%", aspectRatio: "16/9", objectFit: "contain", display: "block" }} onError={e => { e.target.onerror = null; e.target.src = makePlaceholderDataUri(product.name, vendor?.color, product.category); }} />
              </button>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "#475569", lineHeight: 1.5 }}>
            Media source: {product.imageSource || "Placeholder until official product media is added"}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
            <MediaBadge product={product} />
            <span style={{ ...S.tag, background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>{product.category}</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#e8edf5", letterSpacing: "-0.3px", marginBottom: 4 }}>{product.name}</div>
          <div style={{ fontSize: 13, color: "#475569", marginBottom: 12 }}>{product.tagline}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
            {product.price_range && <PriceBadge tier={product.price_range} large={true} />}
            {product.specSheetUrl && <span style={{ ...S.tag, color: "#22c55e" }}>Spec sheet linked</span>}
            {product.catalogUrl && <span style={{ ...S.tag, color: "#22c55e" }}>Catalog linked</span>}
          </div>
          {product.price_notes && (
            <div style={{ marginBottom: 12, fontSize: 12, color: "#94a3b8", background: "#0d1526", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)", lineHeight: 1.6 }}>
              <strong style={{ color: "#e8edf5" }}>Commercial note:</strong> {product.price_notes}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {addProductToCompare && vendor && (
              <button onClick={() => !isSelected && addProductToCompare(product, vendor)} style={{ padding: "9px 16px", fontSize: 13, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: isSelected ? "rgba(245,158,11,0.15)" : "transparent", color: isSelected ? "#f59e0b" : "#94a3b8", cursor: isSelected ? "default" : "pointer", fontWeight: isSelected ? 600 : 400 }}>
                {isSelected ? "✓ Added to compare" : "+ Add to compare"}
              </button>
            )}
            <a href={product.url} target="_blank" rel="noopener noreferrer" style={{ ...S.btnPrimary, width: "auto", padding: "9px 18px", textDecoration: "none", flexShrink: 0 }}>Official product page →</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {product.specSheetUrl && <a href={product.specSheetUrl} target="_blank" rel="noopener noreferrer" style={{ ...S.btnSecondary, width: "auto", textAlign: "center", textDecoration: "none", fontSize: 12 }}>Spec sheet</a>}
            {product.catalogUrl && <a href={product.catalogUrl} target="_blank" rel="noopener noreferrer" style={{ ...S.btnSecondary, width: "auto", textAlign: "center", textDecoration: "none", fontSize: 12 }}>Catalog / brochure</a>}
            {product.videoUrl && <a href={product.videoUrl} target="_blank" rel="noopener noreferrer" style={{ ...S.btnSecondary, width: "auto", textAlign: "center", textDecoration: "none", fontSize: 12 }}>Demo video</a>}
            {product.imageSourceUrl && <a href={product.imageSourceUrl} target="_blank" rel="noopener noreferrer" style={{ ...S.btnSecondary, width: "auto", textAlign: "center", textDecoration: "none", fontSize: 12 }}>Image source</a>}
          </div>
        </div>
      </div>

      {(product.youtube_id || product.videoUrl) && (
        <div style={{ marginBottom: 24, background: "#0d1526", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 22 }}>▶</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e8edf5", marginBottom: 4 }}>Demo video available</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>Watch the official product demo on YouTube. Opens in a new tab.</div>
          </div>
          <a
            href={product.videoUrl || `https://www.youtube.com/watch?v=${product.youtube_id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...S.btnPrimary, width: "auto", padding: "10px 20px", textDecoration: "none", flexShrink: 0 }}
          >
            Watch demo →
          </a>
        </div>
      )}

      {product.description && (
        <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 24, background: "#0d1526", borderRadius: 12, padding: 20, border: "1px solid rgba(255,255,255,0.06)" }}>{product.description}</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Specifications</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, marginBottom: 20 }}>
            {product.payload && product.payload !== "N/A" && <div style={S.specItem}><div style={S.specLabel}>Payload</div><div style={S.specVal}>{product.payload}</div></div>}
            {product.reach && product.reach !== "N/A" && <div style={S.specItem}><div style={S.specLabel}>Reach</div><div style={S.specVal}>{product.reach}</div></div>}
            {product.axes && <div style={S.specItem}><div style={S.specLabel}>Axes</div><div style={S.specVal}>{product.axes}</div></div>}
            {product.repeatability && <div style={S.specItem}><div style={S.specLabel}>Repeatability</div><div style={S.specVal}>{product.repeatability}</div></div>}
            {product.speed && <div style={S.specItem}><div style={S.specLabel}>Speed / Rate</div><div style={S.specVal}>{product.speed}</div></div>}
            {product.throughput && <div style={S.specItem}><div style={S.specLabel}>Throughput</div><div style={S.specVal}>{product.throughput}</div></div>}
            {product.navigation && <div style={S.specItem}><div style={S.specLabel}>Navigation</div><div style={S.specVal}>{product.navigation}</div></div>}
            {product.battery && <div style={S.specItem}><div style={S.specLabel}>Battery</div><div style={S.specVal}>{product.battery}</div></div>}
            {product.ip_rating && <div style={S.specItem}><div style={S.specLabel}>IP Rating</div><div style={S.specVal}>{product.ip_rating}</div></div>}
            {product.weight && <div style={S.specItem}><div style={S.specLabel}>Robot weight</div><div style={S.specVal}>{product.weight}</div></div>}
            {product.mounting && <div style={S.specItem}><div style={S.specLabel}>Mounting</div><div style={S.specVal}>{product.mounting}</div></div>}
            {product.deployment && <div style={S.specItem}><div style={S.specLabel}>Deployment</div><div style={S.specVal}>{product.deployment}</div></div>}
            {product.density && <div style={S.specItem}><div style={S.specLabel}>Storage density</div><div style={S.specVal}>{product.density}</div></div>}
            {product.temp_range && <div style={S.specItem}><div style={S.specLabel}>Temp range</div><div style={S.specVal}>{product.temp_range}</div></div>}
            {product.accuracy && <div style={S.specItem}><div style={S.specLabel}>Accuracy</div><div style={S.specVal}>{product.accuracy}</div></div>}
            {product.memory && <div style={S.specItem}><div style={S.specLabel}>Memory</div><div style={S.specVal}>{product.memory}</div></div>}
            {product.io_capacity && <div style={S.specItem}><div style={S.specLabel}>I/O capacity</div><div style={S.specVal}>{product.io_capacity}</div></div>}
            {product.comms && <div style={S.specItem}><div style={S.specLabel}>Communications</div><div style={S.specVal}>{product.comms}</div></div>}
          </div>

          {product.highlights && (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Key highlights</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {product.highlights.map(h => <div key={h} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#94a3b8" }}><span style={{ color: "#f59e0b", fontWeight: 700 }}>✓</span> {h}</div>)}
              </div>
            </>
          )}

          {product.applications && (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Applications</div>
              <div style={{ ...S.tags, marginBottom: 20 }}>{product.applications.map(a => <span key={a} style={S.tag}>{a}</span>)}</div>
            </>
          )}
        </div>

        <div>
          <div style={S.sideCard}>
            <div style={S.sideCardTitle}>Request product info</div>
            {productLeadSent ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#f59e0b" }}><div style={{ fontSize: 28, marginBottom: 8 }}>✓</div><div style={{ fontSize: 14, fontWeight: 600 }}>Product inquiry submitted</div><div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>Captured with vendor, product, and category metadata.</div></div>
            ) : (
              <>
                <input style={S.rfiInput} placeholder="Name *" value={productLead.name} onChange={e => setProductLead(d => ({ ...d, name: e.target.value }))} />
                <input style={S.rfiInput} placeholder="Company *" value={productLead.company} onChange={e => setProductLead(d => ({ ...d, company: e.target.value }))} />
                <input style={S.rfiInput} placeholder="Email *" type="email" value={productLead.email} onChange={e => setProductLead(d => ({ ...d, email: e.target.value }))} />
                <select style={S.rfiInput} value={productLead.budget} onChange={e => setProductLead(d => ({ ...d, budget: e.target.value }))}><option>Exploring</option><option>Under $100k</option><option>$100k–$250k</option><option>$250k–$500k</option><option>$500k+</option></select>
                <select style={S.rfiInput} value={productLead.timeline} onChange={e => setProductLead(d => ({ ...d, timeline: e.target.value }))}><option>0–3 months</option><option>3–6 months</option><option>6–12 months</option><option>12+ months</option></select>
                <textarea style={{ ...S.rfiInput, minHeight: 80, resize: "vertical" }} placeholder="Use case, facility type, current system, timeline..." value={productLead.notes} onChange={e => setProductLead(d => ({ ...d, notes: e.target.value }))} />
                <button style={{ ...S.btnPrimary, opacity: productLeadLoading ? 0.7 : 1 }} onClick={submitProductLead} disabled={productLeadLoading}>{productLeadLoading ? "Submitting..." : "Request product info"}</button>
              </>
            )}
          </div>

          <div style={{ ...S.sideCard, marginTop: 14 }}>
            <div style={S.sideCardTitle}>Commercial fit snapshot</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.8 }}>
              <div><strong style={{ color: "#94a3b8" }}>Vendor:</strong> {vendor.name}</div>
              <div><strong style={{ color: "#94a3b8" }}>Commercial model:</strong> {inferCommercialModel(vendor)}</div>
              <div><strong style={{ color: "#94a3b8" }}>Implementation level:</strong> {inferImplementationLevel(vendor)}</div>
              <div><strong style={{ color: "#94a3b8" }}>Best fit:</strong> {vendor.best_for || vendor.ideal_operation || "Discuss with vendor"}</div>
            </div>
          </div>

          {similar.length > 0 && (
            <div style={{ ...S.sideCard, marginTop: 14 }}>
              <div style={S.sideCardTitle}>More products from {vendor.name}</div>
              {similar.map(s => (
                <div key={s.id} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, marginTop: 10 }}>
                  <div style={{ fontSize: 13, color: "#e8edf5", fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{s.category}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function ProductsTab({ slug, addProductToCompare, selectedProducts }) {
  const vendorProducts = allProducts[slug] || [];
  const vendor = vendors.find(v => v.slug === slug);
  const [activeCat, setActiveCat] = useState("All");
  const [activeProduct, setActiveProduct] = useState(null);
  const cats = ["All", ...new Set(vendorProducts.map(p => p.category))];
  const filtered = activeCat === "All" ? vendorProducts : vendorProducts.filter(p => p.category === activeCat);

  if (activeProduct) return <ProductDetail product={activeProduct} onBack={() => setActiveProduct(null)} addProductToCompare={addProductToCompare} vendor={vendor} selectedProducts={selectedProducts} />;

  if (vendorProducts.length === 0) return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
      <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Product listings coming soon</div>
      <div style={{ fontSize: 12, color: "#475569" }}>This vendor has not expanded their product listing yet.</div>
    </div>
  );

  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {cats.map(c => (<div key={c} style={{ ...S.chip, ...(activeCat === c ? S.chipActive : {}), fontSize: 11, padding: "4px 12px" }} onClick={() => setActiveCat(c)}>{c}</div>))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {filtered.map(p => {
          const isSelected = selectedProducts?.find(sp => sp.product.id === p.id);
          return (
            <div key={p.id} style={{ background: "#0d1526", borderRadius: 14, border: `1px solid ${isSelected ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.07)"}`, overflow: "hidden", cursor: "pointer" }}>
              <ProductImg product={p} vendor={vendor} style={{ width: "100%", aspectRatio: "16/9", objectFit: "contain", display: "block" }} onClick={() => setActiveProduct(p)} />
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ flex: 1 }} onClick={() => setActiveProduct(p)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#e8edf5" }}>{p.name}</div>
                      <MediaBadge product={p} />{p.youtube_id && <span style={{ fontSize: 10, background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 4, padding: "1px 6px", fontWeight: 600 }}>▶ VIDEO</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{p.tagline}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); isSelected ? null : addProductToCompare(p, vendor); }} style={{ padding: "6px 10px", fontSize: 11, borderRadius: 6, border: "none", cursor: isSelected ? "default" : "pointer", background: isSelected ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.06)", color: isSelected ? "#f59e0b" : "#64748b", fontWeight: isSelected ? 600 : 400 }}>
                    {isSelected ? "✓ Added" : "+ Compare"}
                  </button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }} onClick={() => setActiveProduct(p)}>
                  {p.price_range && <PriceBadge tier={p.price_range} />}
                  {p.payload && p.payload !== "N/A" && <span style={{ fontSize: 11, color: "#64748b" }}>Payload: <strong style={{ color: "#94a3b8" }}>{p.payload}</strong></span>}
                  {p.reach && p.reach !== "N/A" && <span style={{ fontSize: 11, color: "#64748b" }}>Reach: <strong style={{ color: "#94a3b8" }}>{p.reach}</strong></span>}
                  {p.speed && <span style={{ fontSize: 11, color: "#64748b" }}>Speed: <strong style={{ color: "#94a3b8" }}>{p.speed}</strong></span>}
                  {p.axes && <span style={{ fontSize: 11, color: "#64748b" }}>Axes: <strong style={{ color: "#94a3b8" }}>{p.axes}</strong></span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function DetailPage({ vendor, setPage, selected, setSelected, addProductToCompare, selectedProducts, detailBackPage = "directory", detailBackLabel = "directory", openDetail }) {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState("overview");
  const [rfiSent, setRfiSent] = useState(false);
  const [rfiLoading, setRfiLoading] = useState(false);
  const [rfiData, setRfiData] = useState({ name: "", company: "", email: "", phone: "", budget: "Exploring", timeline: "3–6 months", project: "New DC / greenfield build", description: "" });
  if (!vendor) return null;
  const isSelected = selected.includes(vendor.id);
  const toggleCompare = () => {
    if (isSelected) setSelected(s => s.filter(x => x !== vendor.id));
    else if (selected.length < 4) setSelected(s => [...s, vendor.id]);
  };
  const playbook = getVendorPlaybook(vendor);
  const vendorProducts = (allProducts[vendor.slug] || []).slice(0, 3);
  const similarVendors = getSimilarVendors(vendor);

  const submitRfi = async () => {
    if (!rfiData.name || !rfiData.email || !rfiData.company) return;
    setRfiLoading(true);
    try {
      const ok = await submitLeadForm(
        { ...rfiData, vendor: vendor.name },
        { lead_type: "Vendor RFI", vendor_slug: vendor.slug, category: vendor.category, _subject: `OpEx Scout RFI — ${vendor.name} from ${rfiData.company}` }
      );
      if (ok) setRfiSent(true);
    } catch (e) { console.error(e); }
    setRfiLoading(false);
  };

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div style={S.detailWrap}>
        <button style={S.backBtn} onClick={() => setPage(detailBackPage || "directory")}><ArrowLeft /> Back to {detailBackLabel || "directory"}</button>

        <div style={{ background: "linear-gradient(180deg, #111d31 0%, #0f1c30 100%)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 24, marginBottom: 24 }}>
          <div style={{ ...S.detailHeader, flexDirection: isMobile ? "column" : "row" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ ...S.logoCircle, background: vendor.color, width: 64, height: 64, fontSize: 16, marginBottom: 0 }}>{vendor.logo}</div>
              <div>
                <div style={S.detailName}>{vendor.name}</div>
                <div style={S.detailSub}>{vendor.category} · {vendor.hq} · Founded {vendor.founded}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 4 }}>
                  {vendor.vendor_type && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
                      background: vendor.vendor_type === "Manufacturer" ? "rgba(34,197,94,0.1)" : vendor.vendor_type === "Software" ? "rgba(99,102,241,0.1)" : vendor.vendor_type === "Systems Integrator" ? "rgba(245,158,11,0.1)" : "rgba(56,189,248,0.1)",
                      color: vendor.vendor_type === "Manufacturer" ? "#22c55e" : vendor.vendor_type === "Software" ? "#818cf8" : vendor.vendor_type === "Systems Integrator" ? "#f59e0b" : "#38bdf8",
                      border: `1px solid ${vendor.vendor_type === "Manufacturer" ? "rgba(34,197,94,0.2)" : vendor.vendor_type === "Software" ? "rgba(99,102,241,0.2)" : vendor.vendor_type === "Systems Integrator" ? "rgba(245,158,11,0.2)" : "rgba(56,189,248,0.2)"}`,
                    }}>{vendor.vendor_type}</span>
                  )}
                  {vendor.tags.map(t => <span key={t} style={S.tag}>{t}</span>)}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                  <PriceBadge tier={vendor.price_range} large={true} />
                  <span style={{ ...S.tag, color: "#94a3b8" }}>Commercial model: {inferCommercialModel(vendor)}</span>
                  <span style={{ ...S.tag, color: "#94a3b8" }}>Implementation: {inferImplementationLevel(vendor)}</span>
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 8 }}>Pricing tiers are estimates based on industry research. Get exact pricing from {vendor.name}.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
              <button style={{ ...S.btnSecondary, width: "auto", padding: "9px 18px" }} onClick={toggleCompare}>{isSelected ? "✓ Added" : "+ Compare"}</button>
              <a href={`https://${vendor.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" style={{ ...S.btnSecondary, width: "auto", padding: "9px 18px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Visit site</a>
              <button style={{ ...S.btnPrimary, width: "auto", padding: "9px 18px" }} onClick={() => document.getElementById("rfi-form")?.scrollIntoView({ behavior: "smooth" })}>Request Info</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
            {[['Installs', vendor.installs], ['Employees', vendor.employees], ['HQ', vendor.hq], ['Primary fit', vendor.ideal_operation || vendor.best_for || 'Research in progress']].map(([l, n]) => (
              <div key={l} style={{ background: "#0d1526", borderRadius: 10, padding: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 5 }}>{l}</div>
                <div style={{ fontSize: 13, color: "#e8edf5", fontWeight: 700, lineHeight: 1.4 }}>{n}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...S.detailBody, gridTemplateColumns: isMobile ? "1fr" : "1fr 300px" }}>
          <div style={S.detailMain}>
            <div style={S.tabs}>
              {[['overview', 'Overview'], ['products', 'Products'], ['specs', 'Specs & Capabilities'], ['reviews', 'Practitioner notes'], ['cases', 'Case Studies']].map(([t, label]) => (
                <div key={t} style={{ ...S.tab, ...(tab === t ? S.tabActive : {}) }} onClick={() => setTab(t)}>{label}</div>
              ))}
            </div>
            <div style={S.tabContent}>
              {tab === 'products' && <ProductsTab slug={vendor.slug} addProductToCompare={addProductToCompare} selectedProducts={selectedProducts} />}
              {tab === 'overview' && (
                <>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, marginBottom: 24 }}>{vendor.desc}</p>
                  {vendorProducts.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Featured products</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {vendorProducts.map(p => (
                          <div key={p.id} onClick={() => setTab('products')} style={{ background: '#0d1526', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                            <ProductImg product={p} vendor={vendor} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'contain', display: 'block' }} />
                            <div style={{ padding: 12 }}>
                              <div style={{ fontSize: 13, color: '#e8edf5', fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{p.category}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                    <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>✓ Best fit</div>
                      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{vendor.best_for || vendor.ideal_operation || 'Buyer-fit profile being expanded.'}</div>
                    </div>
                    <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Watch-outs</div>
                      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{vendor.not_for || 'Validate implementation assumptions, support coverage, and integration ownership during evaluation.'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                    <div style={{ background: '#0d1526', borderRadius: 10, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Commercial snapshot</div>
                      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8 }}>
                        <div><strong style={{ color: '#e8edf5' }}>Commercial model:</strong> {playbook.commercial}</div>
                        <div><strong style={{ color: '#e8edf5' }}>Vendor type:</strong> {vendor.vendor_type || "—"}</div>
                        {vendor.implementation_pilot && <div><strong style={{ color: '#e8edf5' }}>Pilot timeline:</strong> {vendor.implementation_pilot}</div>}
                        {vendor.implementation_rollout && <div><strong style={{ color: '#e8edf5' }}>Full rollout:</strong> {vendor.implementation_rollout}</div>}
                        {!vendor.implementation_pilot && <div><strong style={{ color: '#e8edf5' }}>Typical deployment:</strong> {playbook.deployment}</div>}
                        <div><strong style={{ color: '#e8edf5' }}>ROI pattern:</strong> {playbook.roi}</div>
                        {vendor.implementation_risks && <div style={{ marginTop: 6, padding: '8px 10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 6, fontSize: 12 }}><strong style={{ color: '#ef4444' }}>Key risks:</strong> {vendor.implementation_risks}</div>}
                      </div>
                    </div>
                    <div style={{ background: '#0d1526', borderRadius: 10, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Buyer questions</div>
                      {playbook.questions.map((q, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}><span style={{ color: '#f59e0b' }}>•</span>{q}</div>
                      ))}
                    </div>
                  </div>
                  {vendor.strengths && vendor.weaknesses && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div style={{ background: '#0d1526', borderRadius: 10, padding: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Strengths</div>
                          {vendor.strengths.map((s, i) => (<div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12, color: '#64748b', lineHeight: 1.5 }}><span style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }}>+</span>{s}</div>))}
                        </div>
                        <div style={{ background: '#0d1526', borderRadius: 10, padding: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Watch-outs</div>
                          {vendor.weaknesses.map((w, i) => (<div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12, color: '#64748b', lineHeight: 1.5 }}><span style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }}>−</span>{w}</div>))}
                        </div>
                      </div>
                      <div style={{ marginBottom: 24, padding: '8px 12px', fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.04)', lineHeight: 1.5 }}>
                        <strong style={{ color: '#64748b' }}>Note:</strong> Strengths and watch-outs are based on industry research, public sources, and practitioner observations. Validate against your specific use case during evaluation.
                      </div>
                    </>
                  )}
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Industries served</div>
                  <div style={{ ...S.tags, marginBottom: 20 }}>{vendor.industry.map(i => <span key={i} style={S.tag}>{i}</span>)}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Integrations</div>
                  <div style={S.tags}>{vendor.integrations.map(i => <span key={i} style={S.tag}>{i}</span>)}</div>
                </>
              )}
              {tab === 'specs' && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Technical specifications</div>
                  <div style={S.specGrid}>{vendor.specs.map(s => (<div key={s.l} style={S.specItem}><div style={S.specLabel}>{s.l}</div><div style={S.specVal}>{s.v}</div></div>))}</div>
                </>
              )}
              {tab === 'reviews' && (
                <>
                  {vendor.practitioner_notes ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10 }}>
                        <span style={{ fontSize: 18 }}>🔧</span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>OpEx Scout Practitioner Analysis</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>Based on industry research, MODEX observations, and practitioner conversations. Not vendor-supplied.</div>
                        </div>
                      </div>

                      {[
                        { icon: '📋', title: 'Deployment reality', key: 'deployment_reality', color: '#38bdf8' },
                        { icon: '🔍', title: "What the vendor won't tell you", key: 'what_vendors_wont_tell_you', color: '#f97316' },
                        { icon: '✅', title: 'Best environments', key: 'best_environments', color: '#22c55e' },
                        { icon: '⚠️', title: 'Watch-outs', key: 'watch_outs', color: '#ef4444' },
                      ].map(({ icon, title, key, color }) => (
                        <div key={key} style={{ marginBottom: 16, background: '#0d1526', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px', borderLeft: `3px solid ${color}` }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>{icon}</span> {title.toUpperCase()}
                          </div>
                          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8 }}>{vendor.practitioner_notes[key]}</div>
                        </div>
                      ))}

                      <div style={{ background: '#0d1526', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 12, padding: '16px 18px' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>❓</span> QUESTIONS TO ASK IN YOUR RFP / DEMO
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {vendor.practitioner_notes.questions_to_ask.map((q, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                              <span style={{ color: '#f59e0b', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                              <span>{q}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, fontSize: 11, color: '#475569', lineHeight: 1.6 }}>
                        Have you deployed {vendor.name}? Help other operators with your experience. <button onClick={() => setPage('reviews')} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', fontSize: 11, padding: 0, fontFamily: 'inherit' }}>Submit a practitioner note →</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ background: '#0d1526', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                        <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#e8edf5', marginBottom: 8 }}>Practitioner analysis coming soon</div>
                        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 16, maxWidth: 460, margin: '0 auto 20px' }}>
                          OpEx Scout publishes independent practitioner analysis for every vendor — deployment reality, what the vendor won't tell you, and questions to ask. This vendor's analysis is in progress.
                        </div>
                        <button style={{ ...S.btnPrimary, width: 'auto', padding: '10px 22px' }} onClick={() => setPage('reviews')}>Share your experience</button>
                      </div>
                    </>
                  )}
                </>
              )}
              {tab === 'cases' && (
                <>
                  <div style={{ background: '#0d1526', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#e8edf5', marginBottom: 8 }}>Case studies coming soon</div>
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 16, maxWidth: 460, margin: '0 auto 20px' }}>
                      Verified case studies from {vendor.name} deployments will appear here. Until they're added, view official case studies on the vendor's website.
                    </div>
                    <a href={`https://${vendor.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" style={{ ...S.btnSecondary, width: 'auto', padding: '10px 22px', textDecoration: 'none', display: 'inline-block' }}>Visit {vendor.name} →</a>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={S.detailSide}>
            <div style={S.sideCard}>
              <div style={S.sideCardTitle}>Company snapshot</div>
              <div style={S.contactRow}><GlobeIcon /><a href={`https://${vendor.website?.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b', textDecoration: 'none' }}>{vendor.website}</a></div>
              <div style={S.contactRow}><BuildingIcon />{vendor.hq}</div>
              <div style={S.contactRow}><span style={{ fontSize: 11, color: "#475569" }}>Founded</span><span style={{ fontSize: 12, color: "#64748b", marginLeft: 6 }}>{vendor.founded}</span></div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7, marginTop: 8 }}>Use the RFI form to route a structured inquiry. Listing quality and routing can be upgraded through the vendor program.</div>
            </div>

            <div style={S.sideCard}>
              <div style={S.sideCardTitle}>Profile quality</div>
              {(() => {
                const profile = getProfileScore(vendor);
                return (
                  <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <ProfileScoreBadge vendor={vendor} />
                      <span style={{ fontSize: 12, color: "#64748b" }}>{profile.productCount} product{profile.productCount === 1 ? "" : "s"}</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 99, background: "#0b1220", overflow: "hidden", marginBottom: 10 }}>
                      <div style={{ height: "100%", width: `${profile.score}%`, background: profile.color }} />
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, marginBottom: 10 }}>
                      {profile.missing.length ? `Next profile upgrades: ${profile.missing.join(", ")}.` : "This profile has the core buyer-research fields needed for evaluation."}
                    </div>
                    <div style={{ fontSize: 11, color: "#475569", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ cursor: "pointer", color: "#f59e0b" }} onClick={() => setPage("methodology")}>How we build vendor profiles →</span>
                    </div>
                  </>
                );
              })()}
            </div>

            {similarVendors.length > 0 && (
              <div style={S.sideCard}>
                <div style={S.sideCardTitle}>Similar vendors</div>
                {similarVendors.map(v => (
                  <div key={v.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ ...S.logoCircle, background: v.color, width: 26, height: 26, fontSize: 10, marginBottom: 0 }}>{v.logo}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: '#e8edf5', fontWeight: 600 }}>{v.name}</div>
                        <div style={{ fontSize: 11, color: '#475569' }}>{v.category}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      {v.vendor_type && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>{v.vendor_type}</span>}
                      {v.price_range && <PriceBadge tier={v.price_range} />}
                    </div>
                    {v.best_for && <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5, marginBottom: 8 }}>{v.best_for.slice(0, 80)}...</div>}
                    <button style={{ ...S.btnSecondary, fontSize: 11, padding: '6px 10px' }} onClick={(e) => { e.stopPropagation(); openDetail(v, 'detail', vendor.name); }}>View profile →</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ ...S.sideCard }} id="rfi-form">
              <div style={S.sideCardTitle}>Contact {vendor.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12, lineHeight: 1.6 }}>
                OpEx Scout will forward your request to {vendor.name} on your behalf. You may not receive a reply if the vendor hasn't claimed their listing — in that case, contact them directly at <a href={`https://${vendor.website?.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: "#f59e0b" }}>{vendor.website}</a>.
              </div>
              {rfiSent ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#e8edf5", marginBottom: 6 }}>Request logged</div>
                  <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
                    Your inquiry has been recorded. Since {vendor.name} hasn't claimed their listing yet, we recommend also reaching out directly at{' '}
                    <a href={`https://${vendor.website?.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: "#f59e0b" }}>{vendor.website}</a>.
                  </div>
                </div>
              ) : (
                <>
                  <label style={S.rfiLabel}>Name *</label>
                  <input style={S.rfiInput} placeholder="Jane Smith" value={rfiData.name} onChange={e => setRfiData(d => ({ ...d, name: e.target.value }))} />
                  <label style={S.rfiLabel}>Work email *</label>
                  <input style={S.rfiInput} placeholder="jane@company.com" type="email" value={rfiData.email} onChange={e => setRfiData(d => ({ ...d, email: e.target.value }))} />
                  <label style={S.rfiLabel}>Company *</label>
                  <input style={S.rfiInput} placeholder="Company name" value={rfiData.company} onChange={e => setRfiData(d => ({ ...d, company: e.target.value }))} />
                  <label style={S.rfiLabel}>What do you want to know?</label>
                  <textarea style={{ ...S.rfiInput, minHeight: 80, resize: 'vertical' }} placeholder="e.g. Pricing for 3 dock doors, brownfield retrofit, 200k sqft DC..." value={rfiData.description} onChange={e => setRfiData(d => ({ ...d, description: e.target.value }))} />
                  <details style={{ marginBottom: 8 }}>
                    <summary style={{ fontSize: 12, color: "#475569", cursor: "pointer", marginBottom: 8 }}>Add project details (optional)</summary>
                    <label style={S.rfiLabel}>Budget range</label>
                    <select style={S.rfiInput} value={rfiData.budget} onChange={e => setRfiData(d => ({ ...d, budget: e.target.value }))}><option>Exploring</option><option>Under $100k</option><option>$100k–$250k</option><option>$250k–$500k</option><option>$500k+</option></select>
                    <label style={S.rfiLabel}>Timeline</label>
                    <select style={S.rfiInput} value={rfiData.timeline} onChange={e => setRfiData(d => ({ ...d, timeline: e.target.value }))}><option>0–3 months</option><option>3–6 months</option><option>6–12 months</option><option>12+ months</option></select>
                    <label style={S.rfiLabel}>Project type</label>
                    <select style={S.rfiInput} value={rfiData.project} onChange={e => setRfiData(d => ({ ...d, project: e.target.value }))}><option>New DC / greenfield build</option><option>Brownfield retrofit</option><option>Capacity expansion</option><option>Vendor replacement</option><option>Feasibility study</option><option>Manufacturing automation</option></select>
                  </details>
                  <button style={{ ...S.btnPrimary, opacity: rfiLoading ? 0.7 : 1 }} onClick={submitRfi} disabled={rfiLoading}>{rfiLoading ? 'Logging...' : 'Log this inquiry'}</button>
                  <div style={{ marginTop: 8, textAlign: "center" }}>
                    <a href={`https://${vendor.website?.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#f59e0b", textDecoration: "none" }}>
                      Go directly to {vendor.name} →
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareVendorSearch({ sel, setSelected, openDetail, setPage }) {
  const [q, setQ] = useState("");
  const results = q.length > 1 ? vendors.filter(v =>
    v.name.toLowerCase().includes(q.toLowerCase()) ||
    v.category.toLowerCase().includes(q.toLowerCase()) ||
    (v.tags || []).some(t => t.toLowerCase().includes(q.toLowerCase()))
  ).slice(0, 8) : vendors.filter(v => v.featured).slice(0, 6);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#e8edf5", marginBottom: 8 }}>Compare vendors side by side</div>
        <div style={{ fontSize: 14, color: "#64748b" }}>Search and select 2–4 vendors below to start comparing</div>
      </div>

      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{ display: "flex", background: "#131f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "0 14px", display: "flex", alignItems: "center", color: "#475569" }}><SearchIcon /></div>
          <input
            autoFocus
            style={{ flex: 1, background: "transparent", border: "none", padding: "13px 0", fontSize: 14, color: "#e8edf5", outline: "none" }}
            placeholder="Search vendors by name, category, or technology..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
      </div>

      {sel.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, padding: "10px 14px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 10 }}>
          <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600, alignSelf: "center" }}>Selected ({sel.length}/4):</span>
          {sel.map(id => {
            const v = vendors.find(x => x.id === id);
            return v ? (
              <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0d1526", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#e8edf5" }}>
                {v.name}
                <button onClick={() => setSelected(s => s.filter(x => x !== id))} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
              </span>
            ) : null;
          })}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {!q && <div style={{ fontSize: 11, color: "#475569", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Featured vendors — or search above</div>}
        {results.map(v => {
          const isSelected = sel.includes(v.id);
          return (
            <div key={v.id}
              onClick={() => isSelected ? setSelected(s => s.filter(x => x !== v.id)) : sel.length < 4 ? setSelected(s => [...s, v.id]) : null}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: isSelected ? "rgba(245,158,11,0.06)" : "#0f1c30", border: `1px solid ${isSelected ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, cursor: sel.length >= 4 && !isSelected ? "not-allowed" : "pointer", opacity: sel.length >= 4 && !isSelected ? 0.5 : 1 }}>
              <div style={{ ...S.logoCircle, background: v.color, width: 32, height: 32, fontSize: 10, marginBottom: 0, flexShrink: 0 }}>{v.logo}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e8edf5" }}>{v.name}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{v.category} · {v.vendor_type || ""} · {v.price_range || "Pricing varies"}</div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${isSelected ? "#f59e0b" : "rgba(255,255,255,0.2)"}`, background: isSelected ? "#f59e0b" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {isSelected && <span style={{ color: "#0b1220", fontSize: 13, fontWeight: 800 }}>✓</span>}
              </div>
            </div>
          );
        })}
      </div>

      {sel.length >= 2 && (
        <button style={{ ...S.navCta, width: "100%", fontFamily: "inherit", padding: "14px", fontSize: 15 }} onClick={() => window.scrollTo(0, 0)}>
          Compare {sel.length} vendors →
        </button>
      )}
    </div>
  );
}

function ComparePage({ selected, setSelected, setPage, openDetail }) {
  const isMobile = useIsMobile();
  const sel = vendors.filter(v => selected.includes(v.id));
  const [saved, setSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [listName, setListName] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    const name = listName || `${sel.map(v => v.name).join(" vs ")}`;
    const id = saveShortlist(name, selected, [], "");
    const url = shortlistShareUrl(id);
    setShareUrl(url);
    setSaved(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (sel.length < 2) return <CompareVendorSearch sel={sel} setSelected={setSelected} openDetail={openDetail} setPage={setPage} />;

  const rows = [
    { label: "Type", fn: v => v.vendor_type || "—" },
    { label: "Category", fn: v => v.category },
    { label: "HQ", fn: v => v.hq },
    { label: "Founded", fn: v => v.founded },
    { label: "Installations", fn: v => v.installs },
    { label: "Employees", fn: v => v.employees },
    { label: "Price range", fn: v => v.price_range || "—" },
    { label: "Industries", fn: v => v.industry.slice(0, 3).join(", ") },
    { label: "Integrations", fn: v => v.integrations.slice(0, 3).join(", ") },
  ];

  return (
    <div style={S.compareWrap}>
      <button style={S.backBtn} onClick={() => setPage("directory")}><ArrowLeft /> Back to directory</button>

      {/* Header with save/share */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, color: "#e8edf5" }}>Vendor comparison</div>
          <div style={{ fontSize: 13, color: "#475569" }}>{sel.length} vendors · Click any vendor to view full profile</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {!saved ? (
            <>
              <input
                style={{ ...S.rfiInput, marginBottom: 0, width: 200, padding: "8px 12px" }}
                placeholder="Name this shortlist..."
                value={listName}
                onChange={e => setListName(e.target.value)}
              />
              <button style={{ ...S.navCta, fontFamily: "inherit", whiteSpace: "nowrap" }} onClick={handleSave}>
                💾 Save & share
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, padding: "8px 14px" }}>
              <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>✓ Saved</span>
              <input
                readOnly
                value={shareUrl}
                style={{ ...S.rfiInput, marginBottom: 0, width: 260, padding: "6px 10px", fontSize: 11, background: "#0d1526" }}
              />
              <button style={{ ...S.navCta, fontFamily: "inherit", padding: "6px 14px", fontSize: 12 }} onClick={handleCopy}>
                {copied ? "Copied!" : "Copy link"}
              </button>
              <button style={{ ...S.btnSecondary, width: "auto", padding: "6px 12px", fontSize: 12 }} onClick={() => setPage("shortlists")}>
                My lists
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={S.compareTable}>
          <thead>
            <tr>
              <th style={S.compareTh}>Attribute</th>
              {sel.map(v => (
                <th key={v.id} style={{ ...S.compareTh, cursor: "pointer" }} onClick={() => { openDetail(v, "compare", "compare"); }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ ...S.logoCircle, background: v.color, width: 28, height: 28, fontSize: 10, marginBottom: 0 }}>{v.logo}</div>
                    {v.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.label}>
                <td style={{ ...S.compareTd, fontWeight: 600, color: "#64748b", fontSize: 12 }}>{r.label}</td>
                {sel.map(v => <td key={v.id} style={S.compareTd}>{r.fn(v)}</td>)}
              </tr>
            ))}
            <tr>
              <td style={{ ...S.compareTd, fontWeight: 600, color: "#64748b", fontSize: 12 }}>Tags</td>
              {sel.map(v => (
                <td key={v.id} style={S.compareTd}>
                  <div style={S.tags}>{v.tags.slice(0, 3).map(t => <span key={t} style={S.tag}>{t}</span>)}</div>
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ ...S.compareTd, fontWeight: 600, color: "#22c55e", fontSize: 12 }}>✓ Best for</td>
              {sel.map(v => (
                <td key={v.id} style={{ ...S.compareTd, background: "rgba(34,197,94,0.03)" }}>
                  <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{v.best_for || "—"}</span>
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ ...S.compareTd, fontWeight: 600, color: "#ef4444", fontSize: 12 }}>✗ Not ideal for</td>
              {sel.map(v => (
                <td key={v.id} style={{ ...S.compareTd, background: "rgba(239,68,68,0.03)" }}>
                  <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{v.not_for || "—"}</span>
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ ...S.compareTd, fontWeight: 600, color: "#22c55e", fontSize: 12 }}>Strengths</td>
              {sel.map(v => (
                <td key={v.id} style={{ ...S.compareTd, background: "rgba(34,197,94,0.03)" }}>
                  {v.strengths ? v.strengths.slice(0, 3).map((s, i) => (
                    <div key={i} style={{ fontSize: 11, color: "#64748b", marginBottom: 5, lineHeight: 1.5 }}>
                      <span style={{ color: "#22c55e" }}>+ </span>{s}
                    </div>
                  )) : "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ ...S.compareTd, fontWeight: 600, color: "#ef4444", fontSize: 12 }}>Weaknesses</td>
              {sel.map(v => (
                <td key={v.id} style={{ ...S.compareTd, background: "rgba(239,68,68,0.03)" }}>
                  {v.weaknesses ? v.weaknesses.slice(0, 3).map((w, i) => (
                    <div key={i} style={{ fontSize: 11, color: "#64748b", marginBottom: 5, lineHeight: 1.5 }}>
                      <span style={{ color: "#ef4444" }}>− </span>{w}
                    </div>
                  )) : "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td style={S.compareTd} />
              {sel.map(v => (
                <td key={v.id} style={S.compareTd}>
                  <button style={{ ...S.btnPrimary, fontSize: 12, padding: "7px 14px" }} onClick={() => { openDetail(v, "compare", "compare"); }}>View full profile</button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryHubPage({ setPage, setCategoryFilter, openDetail, categoryPageCategory, setCategoryPageCategory, addProductToCompare, selectedProducts, setMatrixCategory }) {
  const isMobile = useIsMobile();
  const activeCategory = categoryPageCategory || categories[0];
  const categoryVendors = vendors.filter(v => v.category === activeCategory || v.tags.some(t => t.toLowerCase().includes(activeCategory.toLowerCase().split(" ")[0])));
  const allProductRows = Object.entries(allProducts).flatMap(([slug, items]) => {
    const vendor = vendors.find(v => v.slug === slug);
    return (items || []).map(product => ({ product, vendor })).filter(row => row.vendor);
  });
  const categoryProducts = allProductRows.filter(({ product, vendor }) => {
    const text = [product.category, product.name, product.tagline, ...(product.applications || []), vendor.category, ...(vendor.tags || [])].join(" ").toLowerCase();
    return text.includes(activeCategory.toLowerCase().split(" ")[0]) || vendor.category === activeCategory;
  }).slice(0, 8);

  const categoryCopy = {
    "AMR / Mobile Robots": "Autonomous mobile robots for goods-to-person, person-to-goods, cart movement, pallet movement, and warehouse transport workflows.",
    "Depalletizing & Palletizing": "Robotic palletizing and depalletizing systems for case handling, mixed pallets, layer picking, and end-of-line automation.",
    "Conveyor & Sortation": "Conveyor, sortation, accumulation, merge, and controls solutions for high-throughput distribution operations.",
    "Dock Automation": "Dock and trailer automation for loading, unloading, yard flow, and labor-heavy inbound/outbound workflows.",
    "WMS Platforms": "Warehouse management and execution platforms that coordinate inventory, labor, tasks, automation, and order flow.",
    "Controls & Sensing": "PLC, controls, sensing, scanning, dimensioning, and industrial automation infrastructure.",
    "Industrial Robotics": "Industrial robots and cobots for palletizing, picking, welding, machine tending, packaging, and material handling.",
    "Manufacturing Automation": "Automation systems for manufacturing throughput, quality, machine tending, inspection, packaging, and line balancing.",
  };

  return (
    <div style={S.detailWrap}>
      <button style={S.backBtn} onClick={() => setPage("home")}><ArrowLeft /> Back</button>
      <div style={S.heroEyebrow}>Automation Categories</div>
      <div style={S.detailName}>Research vendors by application</div>
      <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, maxWidth: 760, marginBottom: 28 }}>
        Use these category pages as buyer guides. Each page groups vendors, products, fit notes, and evaluation criteria around a specific automation problem.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "260px 1fr", gap: 20 }}>
        {isMobile ? (
          <div style={{ overflowX: "auto", display: "flex", gap: 8, paddingBottom: 4, marginBottom: 4 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCategoryPageCategory(c)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: `1px solid ${activeCategory === c ? "#f59e0b" : "rgba(255,255,255,0.1)"}`, background: activeCategory === c ? "rgba(245,158,11,0.1)" : "transparent", color: activeCategory === c ? "#f59e0b" : "#64748b", fontSize: 12, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                {c} <span style={{ opacity: 0.6 }}>({vendors.filter(v => v.category === c).length})</span>
              </button>
            ))}
          </div>
        ) : (
          <div style={S.sideCard}>
            <div style={S.sideCardTitle}>Categories</div>
            {categories.map(c => (
              <div key={c} style={{ ...S.filterItem, color: activeCategory === c ? "#f59e0b" : "#64748b", background: activeCategory === c ? "rgba(245,158,11,0.08)" : "transparent" }} onClick={() => setCategoryPageCategory(c)}>
                <span>{c}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#475569" }}>{vendors.filter(v => v.category === c).length}</span>
              </div>
            ))}
          </div>
        )}

        <div>
          <div style={{ ...S.sideCard, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start" }}>
              <div>
                <div style={S.sectionTitle}>{activeCategory}</div>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 18 }}>{categoryCopy[activeCategory] || "Vendor and product research for this automation category."}</p>
                <div style={S.tags}>{["Vendor shortlist", "Product specs", "Buyer questions", "RFI-ready"].map(t => <span key={t} style={S.tag}>{t}</span>)}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={{ padding: "8px 14px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, color: "#f59e0b", fontSize: 12, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap", fontFamily: "inherit" }}
                  onClick={() => { setMatrixCategory(activeCategory); setPage("matrix"); }}>⊞ Compare matrix</button>
                <button style={{ ...S.navCta, fontFamily: "inherit", whiteSpace: "nowrap" }} onClick={() => { setCategoryFilter(activeCategory); setPage("directory"); }}>All vendors →</button>
              </div>
            </div>
          </div>

          {categoryLandscape[activeCategory] && (
            <div style={{ ...S.sideCard, marginBottom: 16 }}>
              <div style={S.sideCardTitle}>Technology landscape — what you can actually buy</div>
              {[
                { label: "PROVEN & BUYABLE TODAY", key: "mature", color: "#22c55e" },
                { label: "EMERGING — PILOT, DON'T BET THE NETWORK", key: "emerging", color: "#f59e0b" },
                { label: "DOESN'T EXIST YET (DESPITE THE MARKETING)", key: "gaps", color: "#ef4444" },
              ].map(({ label, key, color }) => (
                <div key={key} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: `3px solid ${color}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.4px", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{categoryLandscape[activeCategory][key]}</div>
                </div>
              ))}
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>OpEx Scout editorial assessment · reviewed July 2026</div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={S.sideCard}>
              <div style={S.sideCardTitle}>How to evaluate</div>
              {["What process constraint are you solving?", "What system integration is required?", "Can it fit brownfield layout and traffic constraints?", "What support model exists after go-live?", "What metric proves ROI: labor, throughput, accuracy, safety, or uptime?"].map(x => (
                <div key={x} style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 9 }}><span style={{ color: "#f59e0b" }}>• </span>{x}</div>
              ))}
            </div>
            <div style={S.sideCard}>
              <div style={S.sideCardTitle}>Common buyer questions</div>
              {["What does implementation require from IT/controls?", "What does a failed install usually look like?", "Who owns maintenance and uptime response?", "Can the system scale without major layout changes?", "What data is needed before a vendor can quote accurately?"].map(x => (
                <div key={x} style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 9 }}><span style={{ color: "#f59e0b" }}>• </span>{x}</div>
              ))}
            </div>
          </div>

          <div style={{ ...S.sideCard, marginBottom: 16 }}>
            <div style={S.sideCardTitle}>Vendors in this category</div>
            {categoryVendors.length ? (
              <div style={S.grid}>{categoryVendors.map(v => <VendorCard key={v.id} vendor={v} selected={false} onSelect={() => {}} onClick={() => openDetail(v, "categories", "category")} compareCount={0} />)}</div>
            ) : <div style={{ fontSize: 13, color: "#475569" }}>No vendors listed yet. Use the directory to browse adjacent categories.</div>}
          </div>

          <div style={S.sideCard}>
            <div style={S.sideCardTitle}>Related products</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12 }}>
              {categoryProducts.map(({ product, vendor }) => {
                const selected = selectedProducts.some(x => x.product.id === product.id);
                return (
                  <div key={product.id} style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ ...S.logoCircle, background: vendor.color, width: 28, height: 28, fontSize: 9, marginBottom: 0 }}>{vendor.logo}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>{vendor.name}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e8edf5", marginBottom: 5 }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, minHeight: 36 }}>{product.tagline || product.category}</div>
                    <button style={{ ...S.btnSecondary, marginTop: 12, fontSize: 12, padding: "8px 10px", color: selected ? "#22c55e" : "#94a3b8" }} onClick={() => addProductToCompare(product, vendor)}>{selected ? "✓ Added to compare" : "+ Compare product"}</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SolutionPage({ setPage, openDetail, setCategoryFilter, addProductToCompare, selectedProducts }) {
  const isMobile = useIsMobile();
  const [form, setForm] = useState({
    useCase: "AMR / mobile robots",
    facility: "Warehouse & DC",
    environment: "Brownfield retrofit",
    budget: "$200k–$500k",
    timeline: "3–6 months",
    throughput: "",
    sqft: "",
    systems: "",
    notes: "",
    name: "",
    company: "",
    email: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const useCases = [
    { label: "AMR / mobile robots", terms: ["amr", "goods-to-person", "mobile", "cart", "pallet", "autonomous"], categories: ["AMR / Mobile Robots", "AGV Systems"], budgetMin: 1 },
    { label: "Robotic palletizing / depalletizing", terms: ["pallet", "depallet", "case handling", "robot arm", "end of line"], categories: ["Depalletizing & Palletizing", "Industrial Robotics"], budgetMin: 2 },
    { label: "Conveyor / sortation", terms: ["conveyor", "sortation", "sort", "wcs", "accumulation"], categories: ["Conveyor & Sortation"], budgetMin: 3 },
    { label: "Dock / trailer automation", terms: ["dock", "trailer", "loading", "unloading", "slip"], categories: ["Dock Automation"], budgetMin: 2 },
    { label: "WMS / WES / WCS software", terms: ["wms", "wes", "wcs", "warehouse management", "software"], categories: ["WMS Platforms", "Labor Management"], budgetMin: 1 },
    { label: "Machine vision / AI inspection", terms: ["vision", "ai", "inspection", "camera", "barcode", "sensing"], categories: ["Vision & AI", "Controls & Sensing"], budgetMin: 1 },
    { label: "Manufacturing automation / cobots", terms: ["manufacturing", "cobot", "collaborative", "cnc", "welding", "machine tending"], categories: ["Manufacturing Automation", "Industrial Robotics"], budgetMin: 1 },
    { label: "AS/RS / automated storage", terms: ["as/rs", "storage", "shuttle", "autostore", "vertical lift", "vlm", "high density"], categories: ["AS/RS & Storage"], budgetMin: 3 },
    { label: "Labor management / LMS", terms: ["labor", "lms", "productivity", "standards", "engineered", "voice"], categories: ["Labor Management"], budgetMin: 1 },
    { label: "Simulation / digital twin", terms: ["simulation", "digital twin", "flexsim", "emulate", "model"], categories: ["Simulation & Digital Twin"], budgetMin: 1 },
  ];

  const budgetTiers = {
    "Under $50k": 1, "$50k–$200k": 2, "$200k–$500k": 3, "$500k–$1M": 4, "$1M+": 5, "Unknown": 3,
  };

  const priceTiers = { "$": 1, "$$": 2, "$$$": 3, "$$$$": 4 };

  const selectedUse = useCases.find(u => u.label === form.useCase) || useCases[0];
  const budgetTier = budgetTiers[form.budget] || 3;

  const scoreVendor = (v) => {
    const text = [v.name, v.category, v.tagline, v.desc, ...(v.tags || []), ...(v.industry || []), v.best_for || ""].join(" ").toLowerCase();
    let score = 0;

    // Vendor type filter — hard exclude if buyer specified a preference
    if (form.vendorType && v.vendor_type && v.vendor_type !== form.vendorType) return -1;

    // Category match — strongest signal
    if (selectedUse.categories.includes(v.category)) score += 8;
    else return -1; // Must be in right category to appear at all

    // Industry match
    if ((v.industry || []).includes(form.facility)) score += 4;

    // Keyword match in description/tags
    selectedUse.terms.forEach(t => { if (text.includes(t)) score += 2; });

    // Brownfield bonus
    if (form.environment.toLowerCase().includes("brownfield")) {
      const specText = (v.specs || []).map(s => s.v).join(" ").toLowerCase();
      if (text.includes("brownfield") || specText.includes("yes")) score += 3;
    }

    // Budget — hard penalty if clearly out of range
    const vTier = priceTiers[v.price_range] || 3;
    if (form.budget !== "Unknown") {
      const diff = vTier - budgetTier;
      if (diff === 0) score += 3;
      else if (diff === 1) score += 1;
      else if (diff === -1) score += 1;
      else if (diff >= 2) score -= 6; // Too expensive — strong penalty
      else if (diff <= -2) score -= 2; // Too cheap — mild penalty
    }

    // Featured vendors get slight boost
    if (v.featured) score += 1;

    return score;
  };

  const vendorMatches = vendors
    .map(v => ({ v, score: scoreVendor(v) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(x => x.v);

  const productMatches = Object.entries(allProducts).flatMap(([slug, items]) => {
    const vendor = vendors.find(v => v.slug === slug);
    return (items || []).map(product => ({ product, vendor })).filter(r => r.vendor);
  }).map(row => {
    // Must be in right vendor category
    if (!selectedUse.categories.includes(row.vendor.category)) return { ...row, score: -1 };
    const text = [row.product.name, row.product.tagline, row.product.category, ...(row.product.applications || []), row.vendor.name, row.vendor.category].join(" ").toLowerCase();
    let score = 4; // Base score for category match
    selectedUse.terms.forEach(t => { if (text.includes(t)) score += 2; });
    if ((row.vendor.industry || []).includes(form.facility)) score += 2;
    // Budget fit on product price — hard penalty
    if (form.budget !== "Unknown" && row.product.price_range) {
      const pTier = priceTiers[row.product.price_range] || 3;
      const diff = pTier - budgetTier;
      if (diff === 0) score += 3;
      else if (Math.abs(diff) === 1) score += 1;
      else if (diff >= 2) score -= 5; // Too expensive
    }
    return { ...row, score };
  }).filter(x => x.score > 2).sort((a, b) => b.score - a.score).slice(0, 6);

  // Why these vendors — generate explanation text
  const getMatchReason = (v) => {
    const reasons = [];
    if (selectedUse.categories.includes(v.category)) reasons.push(`Primary category match (${v.category})`);
    if ((v.industry || []).includes(form.facility)) reasons.push(`Serves ${form.facility}`);
    if (form.environment.includes("brownfield") && v.best_for?.toLowerCase().includes("brownfield")) reasons.push("Brownfield experience noted");
    if (v.price_range === form.budget?.split("–")[0]?.trim()) reasons.push("Price range aligns");
    return reasons.slice(0, 2).join(" · ") || "Category and keyword match";
  };

  const submit = async () => {
    if (!form.name || !form.company || !form.email) return;
    setLoading(true);
    try {
      const ok = await submitLeadForm(form, { lead_type: "Shortlist Request", matched_vendors: vendorMatches.map(v => v.name).join(", "), _subject: `OpEx Scout Shortlist — ${form.company}` });
      if (ok) setSent(true);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div style={S.detailWrap}>
      <button style={S.backBtn} onClick={() => setPage("home")}><ArrowLeft /> Back</button>
      <div style={S.heroEyebrow}>Find a Solution</div>
      <div style={S.detailName}>Build a vendor shortlist for your operation</div>
      <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, maxWidth: 760, marginBottom: 28 }}>Tell us about your operation and we'll match vendors and products by use case, industry, budget, and fit. Results update instantly as you change your answers.</p>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "340px 1fr", gap: 20 }}>
        <div>
          <div style={S.sideCard}>
            <div style={S.sideCardTitle}>Your operation</div>
            <label style={S.rfiLabel}>Primary use case *</label>
            <select style={S.rfiInput} value={form.useCase} onChange={e => setForm(f => ({ ...f, useCase: e.target.value }))}>{useCases.map(u => <option key={u.label}>{u.label}</option>)}</select>
            <label style={S.rfiLabel}>Facility type</label>
            <select style={S.rfiInput} value={form.facility} onChange={e => setForm(f => ({ ...f, facility: e.target.value }))}>{industries.map(i => <option key={i}>{i}</option>)}</select>
            <label style={S.rfiLabel}>Project type</label>
            <select style={S.rfiInput} value={form.environment} onChange={e => setForm(f => ({ ...f, environment: e.target.value }))}>{["Brownfield retrofit", "Greenfield / new build", "Capacity expansion", "Vendor replacement", "Feasibility study"].map(x => <option key={x}>{x}</option>)}</select>
            <label style={S.rfiLabel}>Budget range</label>
            <select style={S.rfiInput} value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}>{["Under $50k", "$50k–$200k", "$200k–$500k", "$500k–$1M", "$1M+", "Unknown"].map(x => <option key={x}>{x}</option>)}</select>
            <label style={S.rfiLabel}>Timeline</label>
            <select style={S.rfiInput} value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}>{["0–3 months", "3–6 months", "6–12 months", "12+ months", "Researching only"].map(x => <option key={x}>{x}</option>)}</select>
            <label style={S.rfiLabel}>Vendor type preference</label>
            <select style={S.rfiInput} value={form.vendorType || ""} onChange={e => setForm(f => ({ ...f, vendorType: e.target.value }))}>
              <option value="">Any (manufacturer, SI, software)</option>
              <option value="Manufacturer">OEM / Manufacturer only</option>
              <option value="Systems Integrator">Systems integrators only</option>
              <option value="Manufacturer + SI">Manufacturer + SI</option>
              <option value="Software">Software only</option>
            </select>
            <label style={S.rfiLabel}>Throughput target (optional)</label>
            <input style={S.rfiInput} value={form.throughput} onChange={e => setForm(f => ({ ...f, throughput: e.target.value }))} placeholder="e.g. 500 cases/hr, 1,000 orders/day" />
            <label style={S.rfiLabel}>Facility size (optional)</label>
            <input style={S.rfiInput} value={form.sqft} onChange={e => setForm(f => ({ ...f, sqft: e.target.value }))} placeholder="e.g. 250,000 sqft" />
            <label style={S.rfiLabel}>Current WMS / ERP / controls</label>
            <input style={S.rfiInput} value={form.systems} onChange={e => setForm(f => ({ ...f, systems: e.target.value }))} placeholder="Manhattan, SAP, Oracle, Rockwell..." />
            <label style={S.rfiLabel}>Notes</label>
            <textarea style={{ ...S.rfiInput, minHeight: 72, resize: "vertical" }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Labor issue, layout constraint, key goal..." />
          </div>
        </div>

        <div>
          {/* Match summary */}
          <div style={{ ...S.sideCard, marginBottom: 16, background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>
                  {vendorMatches.length} vendors · {productMatches.length} products matched
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Based on: {form.useCase} · {form.facility} · {form.environment} · {form.budget}
                </div>
              </div>
              <div style={S.tags}>{selectedUse.categories.map(c => <span key={c} style={{ ...S.tag, color: "#f59e0b", borderColor: "rgba(245,158,11,0.2)" }}>{c}</span>)}</div>
            </div>
          </div>

          {/* Vendor shortlist */}
          <div style={{ ...S.sideCard, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={S.sideCardTitle}>Vendor shortlist</div>
              <span style={{ fontSize: 11, color: "#475569" }}>Ranked by fit score</span>
            </div>
            {vendorMatches.length === 0 ? (
              <div style={{ fontSize: 13, color: "#475569", padding: "20px 0" }}>
                <div style={{ color: "#f59e0b", fontWeight: 600, marginBottom: 6 }}>No strong matches for this combination.</div>
                <div>Most {form.useCase} vendors are priced above {form.budget}. Try increasing your budget range or changing the use case to see results.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {vendorMatches.map((v, i) => (
                  <div key={v.id} style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}
                    onClick={() => openDetail(v, "solution", "solution results")}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", width: 20, flexShrink: 0 }}>#{i + 1}</div>
                    <div style={{ ...S.logoCircle, background: v.color, width: 36, height: 36, fontSize: 11, marginBottom: 0, flexShrink: 0 }}>{v.logo}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#e8edf5" }}>{v.name}</span>
                        <PriceBadge tier={v.price_range} />
                      </div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{getMatchReason(v)}</div>
                    </div>
                    <div style={{ fontSize: 12, color: "#f59e0b" }}>View →</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product shortlist */}
          {productMatches.length > 0 && (
            <div style={{ ...S.sideCard, marginBottom: 16 }}>
              <div style={S.sideCardTitle}>Matched products</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {productMatches.map(({ product, vendor }) => {
                  const isSelected = selectedProducts.some(x => x.product.id === product.id);
                  return (
                    <div key={product.id} style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <div style={{ ...S.logoCircle, background: vendor.color, width: 22, height: 22, fontSize: 8, marginBottom: 0 }}>{vendor.logo}</div>
                        <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>{vendor.name}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#e8edf5", marginBottom: 4 }}>{product.name}</div>
                      <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.5, marginBottom: 8 }}>{product.category}</div>
                      {product.price_range && <PriceBadge tier={product.price_range} />}
                      <button style={{ ...S.btnSecondary, marginTop: 10, fontSize: 11, padding: "6px 10px", color: isSelected ? "#22c55e" : "#94a3b8", display: "block", width: "100%", textAlign: "center" }}
                        onClick={() => addProductToCompare(product, vendor)}>
                        {isSelected ? "✓ Added to compare" : "+ Compare product"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lead capture */}
          <div style={S.sideCard}>
            <div style={S.sideCardTitle}>Save and share this shortlist</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12, lineHeight: 1.6 }}>
              Enter your email to get this vendor shortlist sent to you — useful for sharing with a manager or coming back to later. No sales calls.
            </div>
            {sent ? (
              <div style={{ textAlign: "center", padding: 20, color: "#f59e0b" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
                <div style={{ fontWeight: 700 }}>Shortlist sent</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>Check your inbox — matched vendors: {vendorMatches.map(v => v.name).join(", ")}</div>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 8 }}>
                  <input style={{ ...S.rfiInput, marginBottom: 0 }} placeholder="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  <input style={{ ...S.rfiInput, marginBottom: 0 }} placeholder="Company *" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                  <input style={{ ...S.rfiInput, marginBottom: 0 }} placeholder="Email *" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <button style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
                  {loading ? "Sending..." : `Send shortlist (${vendorMatches.length} vendors matched)`}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewPage({ setPage }) {
  const [form, setForm] = useState({ vendor: vendors[0]?.name || "", product: "", role: "", facility: "Warehouse & DC", rating: "4", implementation: "", support: "", notes: "", name: "", email: "", anonymous: "Yes" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!form.vendor || !form.notes) return;
    setLoading(true);
    try {
      const ok = await submitLeadForm(form, { lead_type: "Review Submission", _subject: `OpEx Scout Review Submission — ${form.vendor}` });
      if (ok) setSent(true);
    } catch (e) { console.error(e); }
    setLoading(false);
  };
  return (
    <div style={S.listWrap}>
      <button style={S.backBtn} onClick={() => setPage("home")}><ArrowLeft /> Back</button>
      <div style={S.heroEyebrow}>Submit a Review</div>
      <div style={S.listTitle}>Share a practitioner review</div>
      <p style={S.listSub}>Help operations teams understand what vendor implementation really looks like. Reviews are reviewed before publishing and can be anonymous on the public site.</p>
      {sent ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#f59e0b" }}><div style={{ fontSize: 40, marginBottom: 12 }}>✓</div><div style={{ fontSize: 18, fontWeight: 700 }}>Review submitted</div><div style={{ fontSize: 13, color: "#475569", marginTop: 8 }}>It will be reviewed before appearing publicly.</div></div>
      ) : (
        <>
          <label style={S.rfiLabel}>Vendor *</label>
          <select style={S.rfiInput} value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))}>{vendors.map(v => <option key={v.id}>{v.name}</option>)}</select>
          <label style={S.rfiLabel}>Product used</label>
          <input style={S.rfiInput} value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} placeholder="LocusBot, FANUC M-410iC, Manhattan Active..." />
          <label style={S.rfiLabel}>Your role / perspective</label>
          <input style={S.rfiInput} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="IE, DC Manager, Controls Engineer, Ops Director..." />
          <label style={S.rfiLabel}>Facility type</label>
          <select style={S.rfiInput} value={form.facility} onChange={e => setForm(f => ({ ...f, facility: e.target.value }))}>{industries.map(i => <option key={i}>{i}</option>)}</select>
          <label style={S.rfiLabel}>Overall rating</label>
          <select style={S.rfiInput} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}>{["5", "4", "3", "2", "1"].map(x => <option key={x}>{x}</option>)}</select>
          <label style={S.rfiLabel}>Implementation difficulty</label>
          <input style={S.rfiInput} value={form.implementation} onChange={e => setForm(f => ({ ...f, implementation: e.target.value }))} placeholder="Easy, moderate, difficult, explain why..." />
          <label style={S.rfiLabel}>Support quality</label>
          <input style={S.rfiInput} value={form.support} onChange={e => setForm(f => ({ ...f, support: e.target.value }))} placeholder="Response time, escalation, parts/service, vendor support..." />
          <label style={S.rfiLabel}>What should buyers know? *</label>
          <textarea style={{ ...S.rfiInput, minHeight: 120, resize: "vertical" }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="What went well? What was painful? What would you ask before buying again?" />
          <label style={S.rfiLabel}>Public display preference</label>
          <select style={S.rfiInput} value={form.anonymous} onChange={e => setForm(f => ({ ...f, anonymous: e.target.value }))}><option>Yes</option><option>No</option></select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input style={S.rfiInput} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name optional" />
            <input style={S.rfiInput} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email optional" type="email" />
          </div>
          <button style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>{loading ? "Submitting..." : "Submit review"}</button>
        </>
      )}
    </div>
  );
}


function ListPage({ setPage }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ company: "", category: categories[0], industries: "", website: "", email: "", contact: "", tier: "Free — basic profile", products: "", productImages: "", specSheets: "", videos: "", catalogs: "", notes: "" });
  const submit = async () => {
    if (!form.company || !form.website || !form.email) return;
    setLoading(true);
    try {
      const ok = await submitLeadForm(form, { lead_type: "Vendor Claim", _subject: `OpEx Scout Listing Claim — ${form.company}` });
      if (ok) setSubmitted(true);
    } catch (e) { console.error(e); }
    setLoading(false);
  };
  return (
    <div style={S.listWrap}>
      <button style={S.backBtn} onClick={() => setPage("home")}><ArrowLeft /> Back</button>
      <div style={S.heroEyebrow}>For vendors</div>
      <div style={S.listTitle}>Claim or upgrade your company profile</div>
      <p style={S.listSub}>OpEx Scout helps automation vendors get discovered by operations, engineering, and supply chain teams who are actively researching solutions. Start with a free listing, then move into richer product pages, better placement, and qualified lead routing.</p>

      <div style={S.pricingGrid}>
        {[
          { tier: "Free", price: "Free", desc: "Basic company profile, category placement, website link, and contact routing." },
          { tier: "Verified", price: "$149/mo", desc: "Enhanced profile, product pages, videos, case studies, and a verified badge." , featured: true},
          { tier: "Featured", price: "$399/mo", desc: "Priority placement, shortlist visibility, and stronger lead capture support." },
        ].map(p => (
          <div key={p.tier} style={{ ...S.pricingCard, ...(p.featured ? S.pricingCardFeatured : {}) }}>
            {p.featured && <div style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700, marginBottom: 6 }}>MOST PRACTICAL START</div>}
            <div style={S.pricingTier}>{p.tier}</div>
            <div style={S.pricingPrice}>{p.price}</div>
            <div style={S.pricingDesc}>{p.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ ...S.sideCard, marginBottom: 24 }}>
        <div style={S.sideCardTitle}>What verified and featured listings include</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {['Expanded vendor profile', 'Product gallery and photos', 'Demo videos', 'Category placement', 'Case-study section', 'Qualified RFI routing', 'Lead metadata', 'Claimed listing badge'].map(x => <div key={x} style={{ fontSize: 13, color: '#64748b' }}><span style={{ color: '#f59e0b' }}>✓ </span>{x}</div>)}
        </div>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#f59e0b' }}><div style={{ fontSize: 40, marginBottom: 12 }}>✓</div><div style={{ fontSize: 18, fontWeight: 700 }}>Listing request submitted</div><div style={{ fontSize: 13, color: '#475569', marginTop: 8 }}>We captured your request and routing details.</div></div>
      ) : (
        <>
          <label style={S.rfiLabel}>Company *</label>
          <input style={S.rfiInput} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company name" />
          <label style={S.rfiLabel}>Primary category *</label>
          <select style={S.rfiInput} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>{categories.map(c => <option key={c}>{c}</option>)}</select>
          <label style={S.rfiLabel}>Industries served</label>
          <input style={S.rfiInput} value={form.industries} onChange={e => setForm(f => ({ ...f, industries: e.target.value }))} placeholder="Warehouse & DC, Manufacturing, Food & Beverage..." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={S.rfiLabel}>Website *</label>
              <input style={S.rfiInput} value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://company.com" />
            </div>
            <div>
              <label style={S.rfiLabel}>Contact email *</label>
              <input style={S.rfiInput} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="name@company.com" type="email" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={S.rfiLabel}>Primary contact</label>
              <input style={S.rfiInput} value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="Name / title" />
            </div>
            <div>
              <label style={S.rfiLabel}>Interested plan</label>
              <select style={S.rfiInput} value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}><option>Free — basic profile</option><option>Verified — enhanced profile</option><option>Featured — sponsored placement</option></select>
            </div>
          </div>
          <label style={S.rfiLabel}>Products to include</label>
          <textarea style={{ ...S.rfiInput, minHeight: 90, resize: 'vertical' }} value={form.products} onChange={e => setForm(f => ({ ...f, products: e.target.value }))} placeholder="List key products, model names, or product families" />
          <label style={S.rfiLabel}>Product image URLs</label>
          <textarea style={{ ...S.rfiInput, minHeight: 80, resize: 'vertical' }} value={form.productImages} onChange={e => setForm(f => ({ ...f, productImages: e.target.value }))} placeholder="Paste official product image, gallery, or media kit URLs" />
          <label style={S.rfiLabel}>Spec sheet / catalog URLs</label>
          <textarea style={{ ...S.rfiInput, minHeight: 80, resize: 'vertical' }} value={form.specSheets} onChange={e => setForm(f => ({ ...f, specSheets: e.target.value }))} placeholder="Paste spec sheets, catalogs, brochures, PDFs, or product literature URLs" />
          <label style={S.rfiLabel}>Demo video URLs</label>
          <textarea style={{ ...S.rfiInput, minHeight: 70, resize: 'vertical' }} value={form.videos} onChange={e => setForm(f => ({ ...f, videos: e.target.value }))} placeholder="Paste YouTube, Vimeo, or official demo video links" />
          <label style={S.rfiLabel}>Additional notes</label>
          <textarea style={{ ...S.rfiInput, minHeight: 90, resize: 'vertical' }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Anything else you want included in the profile or lead-routing setup" />
          <button style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>{loading ? 'Submitting...' : 'Submit listing request'}</button>
        </>
      )}
    </div>
  );
}

function CategoryMatrixPage({ setPage, openDetail, initialCategory }) {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "AMR / Mobile Robots");

  const categoryVendors = vendors.filter(v => v.category === selectedCategory);

  // Matrix columns vary by category type
  const getMatrixColumns = (cat) => {
    const common = [
      { key: "vendor_type", label: "Type" },
      { key: "price_range", label: "Price tier" },
      { key: "implementation_pilot", label: "Pilot timeline" },
      { key: "installs", label: "Installations" },
      { key: "hq", label: "HQ" },
    ];
    const byCategory = {
      "AMR / Mobile Robots": [
        { key: "payload_spec", label: "Max payload", fn: v => (allProducts[v.slug]||[]).find(p => p.payload)?.payload || "—" },
        { key: "nav_spec", label: "Navigation", fn: v => (allProducts[v.slug]||[]).find(p => p.navigation)?.navigation || "—" },
        { key: "speed_spec", label: "Speed", fn: v => (allProducts[v.slug]||[]).find(p => p.speed)?.speed || "—" },
        ...common,
        { key: "best_for_short", label: "Best for", fn: v => (v.best_for || "").slice(0, 60) + (v.best_for?.length > 60 ? "…" : "") },
        { key: "not_for_short", label: "Watch-out", fn: v => (v.not_for || "").slice(0, 60) + (v.not_for?.length > 60 ? "…" : "") },
      ],
      "Industrial Robotics": [
        { key: "payload_spec", label: "Max payload", fn: v => (allProducts[v.slug]||[]).find(p => p.payload)?.payload || "—" },
        { key: "reach_spec", label: "Reach", fn: v => (allProducts[v.slug]||[]).find(p => p.reach)?.reach || "—" },
        { key: "axes_spec", label: "Axes", fn: v => (allProducts[v.slug]||[]).find(p => p.axes)?.axes || "—" },
        ...common,
        { key: "best_for_short", label: "Best for", fn: v => (v.best_for || "").slice(0, 60) + (v.best_for?.length > 60 ? "…" : "") },
      ],
      "WMS Platforms": [
        { key: "deployment_spec", label: "Deployment", fn: v => (allProducts[v.slug]||[]).find(p => p.deployment)?.deployment || v.implementation_pilot || "—" },
        ...common,
        { key: "integrations_short", label: "Key integrations", fn: v => (v.integrations || []).slice(0, 3).join(", ") },
        { key: "best_for_short", label: "Best for", fn: v => (v.best_for || "").slice(0, 60) + (v.best_for?.length > 60 ? "…" : "") },
        { key: "not_for_short", label: "Watch-out", fn: v => (v.not_for || "").slice(0, 60) + (v.not_for?.length > 60 ? "…" : "") },
      ],
    };
    return byCategory[cat] || [
      ...common,
      { key: "best_for_short", label: "Best for", fn: v => (v.best_for || "").slice(0, 60) + (v.best_for?.length > 60 ? "…" : "") },
      { key: "not_for_short", label: "Watch-out", fn: v => (v.not_for || "").slice(0, 60) + (v.not_for?.length > 60 ? "…" : "") },
    ];
  };

  const columns = getMatrixColumns(selectedCategory);

  const getCellValue = (vendor, col) => {
    if (col.fn) return col.fn(vendor);
    return vendor[col.key] || "—";
  };

  const priceTierColor = { "$": "#22c55e", "$$": "#f59e0b", "$$$": "#f97316", "$$$$": "#ef4444", "RaaS": "#818cf8" };
  const typeColor = { "Manufacturer": "#22c55e", "Software": "#818cf8", "Systems Integrator": "#f59e0b", "Manufacturer + SI": "#38bdf8" };

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: isMobile ? "16px" : "28px" }}>
        <button style={S.backBtn} onClick={() => setPage("directory")}><ArrowLeft /> Back to directory</button>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={S.heroEyebrow}>Comparison Matrix</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#e8edf5", letterSpacing: "-0.3px" }}>{selectedCategory}</div>
            <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{categoryVendors.length} vendors · side-by-side comparison</div>
          </div>
          <button style={{ ...S.navCta, fontFamily: "inherit" }} onClick={() => setPage("solution")}>Find vendors for my project →</button>
        </div>

        {/* Category switcher */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setSelectedCategory(c)}
              style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${selectedCategory === c ? "#f59e0b" : "rgba(255,255,255,0.1)"}`, background: selectedCategory === c ? "rgba(245,158,11,0.1)" : "transparent", color: selectedCategory === c ? "#f59e0b" : "#64748b", fontSize: 11, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              {c} ({vendors.filter(v => v.category === c).length})
            </button>
          ))}
        </div>

        {/* Matrix table */}
        <div style={{ overflowX: "auto", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 700 }}>
            <thead>
              <tr style={{ background: "#0d1526" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "#475569", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", minWidth: 160, position: "sticky", left: 0, background: "#0d1526", borderRight: "1px solid rgba(255,255,255,0.07)" }}>Vendor</th>
                {columns.map(col => (
                  <th key={col.key} style={{ padding: "12px 14px", textAlign: "left", color: "#475569", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{col.label}</th>
                ))}
                <th style={{ padding: "12px 14px", color: "#475569", fontWeight: 600, fontSize: 11, textTransform: "uppercase", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {categoryVendors.map((v, idx) => (
                <tr key={v.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: idx % 2 === 0 ? "#0f1c30" : "#0d1a2e", cursor: "pointer" }}
                  onClick={e => { e.stopPropagation(); openDetail(v, "matrix", "matrix"); }}>
                  <td style={{ padding: "12px 16px", position: "sticky", left: 0, background: idx % 2 === 0 ? "#0f1c30" : "#0d1a2e", borderRight: "1px solid rgba(255,255,255,0.07)", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ ...S.logoCircle, background: v.color, width: 28, height: 28, fontSize: 9, marginBottom: 0, flexShrink: 0 }}>{v.logo}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#e8edf5" }}>{v.name}</div>
                        {v.featured && <span style={{ fontSize: 9, color: "#f59e0b", fontWeight: 700 }}>FEATURED</span>}
                      </div>
                    </div>
                  </td>
                  {columns.map(col => {
                    const val = getCellValue(v, col);
                    return (
                      <td key={col.key} style={{ padding: "12px 14px", borderLeft: "1px solid rgba(255,255,255,0.04)", verticalAlign: "top", maxWidth: 220 }}>
                        {col.key === "price_range" || col.key === "price_tier" ? (
                          <span style={{ fontSize: 11, fontWeight: 700, color: priceTierColor[val] || "#94a3b8" }}>{val}</span>
                        ) : col.key === "vendor_type" ? (
                          <span style={{ fontSize: 10, fontWeight: 700, color: typeColor[val] || "#94a3b8" }}>{val}</span>
                        ) : col.key === "best_for_short" ? (
                          <span style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{val}</span>
                        ) : col.key === "not_for_short" ? (
                          <span style={{ fontSize: 11, color: "#ef4444", opacity: 0.8, lineHeight: 1.5 }}>{val}</span>
                        ) : (
                          <span style={{ fontSize: 12, color: val === "—" ? "#334155" : "#94a3b8" }}>{val}</span>
                        )}
                      </td>
                    );
                  })}
                  <td style={{ padding: "12px 14px", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>
                    <button
                      onClick={e => { e.stopPropagation(); openDetail(v, "matrix", `${selectedCategory} matrix`); }}
                      style={{ padding: "5px 10px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, color: "#f59e0b", fontSize: 11, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                      Full profile →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Explanation */}
        <div style={{ marginTop: 16, padding: "12px 16px", background: "#0d1526", borderRadius: 8, fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
          <strong style={{ color: "#64748b" }}>How to use this matrix:</strong> Click any vendor row to open their full profile. Use the category buttons above to switch categories. Pricing tiers, implementation timelines, and best-fit notes are based on industry research — validate specific numbers with vendor proposals. <button onClick={() => setPage("methodology")} style={{ background: "none", border: "none", color: "#f59e0b", cursor: "pointer", fontSize: 12, padding: 0, fontFamily: "inherit" }}>Methodology →</button>
        </div>
      </div>
    </div>
  );
}

function AboutPage({ setPage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 28px" }}>
      <div style={S.heroEyebrow}>About</div>
      <div style={S.listTitle}>Automation research without the trade show fluff</div>
      <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9, marginBottom: 20 }}>
        OpEx Scout helps warehouse, distribution, and manufacturing teams find automation vendors by application, facility type, product capability, and implementation fit. The goal is simple: make vendor discovery more useful than a static exhibitor directory.
      </p>
      <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9, marginBottom: 28 }}>
        The site is built from an operations-first perspective. Instead of only listing what a vendor sells, OpEx Scout focuses on where the technology fits, what questions buyers should ask, what systems need to integrate, and what implementation risks matter in real facilities.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 30 }}>
        {[
          ["For buyers", "Shortlist vendors, compare products, and route RFIs from one place."],
          ["For vendors", "Claim listings, add product data, and reach buyers actively researching automation."],
          ["For practitioners", "Submit reviews and implementation notes that help others avoid bad decisions."],
        ].map(([h,b]) => (
          <div key={h} style={S.sideCard}><div style={S.sideCardTitle}>{h}</div><div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{b}</div></div>
        ))}
      </div>
      <div style={{ ...S.sideCard, marginBottom: 28 }}>
        <div style={S.sideCardTitle}>Data transparency</div>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8, margin: 0 }}>
          Early vendor profiles combine publicly available company/product information, vendor marketing materials, and OpEx Scout research notes. Practitioner reviews are labeled as notes until verified. Vendors can claim listings to correct, expand, or add product data.
        </p>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button style={{ ...S.navCta, fontFamily: "inherit" }} onClick={() => setPage("solution")}>Find a solution</button>
        <button style={{ ...S.btnSecondary, width: "auto" }} onClick={() => setPage("directory")}>Browse directory</button>
        <button style={{ ...S.btnSecondary, width: "auto" }} onClick={() => setPage("list")}>Claim listing</button>
        <button style={{ ...S.btnSecondary, width: "auto" }} onClick={() => setPage("reviews")}>Submit review</button>
      </div>
    </div>
  );
}

function ShortlistsPage({ setPage, setSelected, selectedProducts, setSelectedProducts, openDetail, setActiveWorkspaceId }) {
  const isMobile = useIsMobile();
  const [lists, setLists] = useState(readShortlists());
  const [workspaces, setWorkspaces] = useState(readWorkspaces());
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [copied, setCopied] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newWsName, setNewWsName] = useState("");
  const [activeTab, setActiveTab] = useState("evaluations");

  const refresh = () => { setLists(readShortlists()); setWorkspaces(readWorkspaces()); };

  const handleCreateWorkspace = () => {
    const name = newWsName.trim() || "New Evaluation";
    const id = createWorkspace(name);
    setActiveWorkspaceId(id);
    setNewWsName("");
    setPage("workspace");
  };

  const handleOpenWorkspace = (id) => {
    setActiveWorkspaceId(id);
    setPage("workspace");
  };


  const handleDelete = (id) => {
    deleteShortlist(id);
    refresh();
  };

  const handleSaveEdit = (id) => {
    updateShortlist(id, { name: editName, notes: editNotes });
    setEditingId(null);
    refresh();
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(shortlistShareUrl(id)).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleLoad = (list) => {
    // Load vendor IDs into compare state
    setSelected(list.vendorIds || []);
    setPage("compare");
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const vendorIds = selectedProducts.map(p => p.vendorSlug)
      .filter((s, i, a) => a.indexOf(s) === i)
      .map(slug => vendors.find(v => v.slug === slug)?.id)
      .filter(Boolean);
    saveShortlist(newName, vendorIds, selectedProducts.map(p => p.product.id), newNotes);
    setNewName("");
    setNewNotes("");
    refresh();
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 28px" }}>
      <button style={S.backBtn} onClick={() => setPage("home")}><ArrowLeft /> Back</button>
      <div style={S.heroEyebrow}>Workspace</div>
      <div style={S.listTitle}>Your evaluation workspace</div>
      <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24, lineHeight: 1.7 }}>
        Build a structured evaluation with scorecard, ROI calculator, and business case — or save a quick vendor shortlist to share with your team.
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "#0d1526", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {[["evaluations", "📊 Evaluations"], ["shortlists", "📋 Shortlists"]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: activeTab === id ? 700 : 400, background: activeTab === id ? "#1a2a45" : "transparent", color: activeTab === id ? "#e8edf5" : "#64748b", fontFamily: "inherit" }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── EVALUATIONS TAB ── */}
      {activeTab === "evaluations" && (
        <div>
          {/* Create new evaluation */}
          <div style={{ ...S.sideCard, marginBottom: 20, background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.15)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", marginBottom: 4 }}>New evaluation workspace</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>Full evaluation with project context, vendor scorecard, ROI calculator, and business case export.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...S.rfiInput, marginBottom: 0, flex: 1 }}
                placeholder="e.g. Inbound dock automation Q3 2026"
                value={newWsName}
                onChange={e => setNewWsName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreateWorkspace()}
              />
              <button style={{ ...S.navCta, fontFamily: "inherit", whiteSpace: "nowrap" }} onClick={handleCreateWorkspace}>
                + New evaluation
              </button>
            </div>
          </div>

          {workspaces.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#475569" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>No evaluations yet</div>
              <div style={{ fontSize: 12, color: "#475569" }}>Create your first evaluation workspace above to start building a business case.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {workspaces.map(w => {
                const wVendors = vendors.filter(v => (w.vendorIds || []).includes(v.id));
                const hasROI = w.roi?.laborHeadcount && w.roi?.laborRate;
                const hasScorecard = Object.keys(w.scorecard || {}).length > 0;
                const pct = Math.round(([w.problemStatement, w.facilitySqft, w.vendorIds?.length > 0, hasScorecard, hasROI, Object.keys(w.rfis || {}).length > 0].filter(Boolean).length / 6) * 100);
                return (
                  <div key={w.id} style={{ background: "#0f1c30", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, cursor: "pointer" }} onClick={() => handleOpenWorkspace(w.id)}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#e8edf5", marginBottom: 4 }}>{w.projectName}</div>
                        <div style={{ fontSize: 12, color: "#475569", marginBottom: 10 }}>
                          {w.facilityType} · {w.projectType} · {w.budgetRange} · Updated {new Date(w.updated).toLocaleDateString()}
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {wVendors.slice(0, 4).map(v => (
                            <span key={v.id} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#0d1526", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#64748b" }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: v.color, display: "inline-block" }} />{v.name}
                            </span>
                          ))}
                          {wVendors.length > 4 && <span style={{ fontSize: 11, color: "#475569" }}>+{wVendors.length - 4} more</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#475569" }}>{pct}%</div>
                        <div style={{ fontSize: 10, color: "#475569" }}>complete</div>
                        <button onClick={e => { e.stopPropagation(); deleteWorkspace(w.id); refresh(); }} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 11 }}>Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SHORTLISTS TAB ── */}
      {activeTab === "shortlists" && (<div>
      {/* Create new shortlist */}
      <div style={{ ...S.sideCard, marginBottom: 20, background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.15)" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", marginBottom: 4 }}>
          {selectedProducts.length > 0 ? `Save current selection (${selectedProducts.length} products)` : "Save a quick shortlist"}
        </div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>Name and save a list of vendors with a shareable link.</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input style={{ ...S.rfiInput, marginBottom: 0, flex: 1, minWidth: 160 }} placeholder="Shortlist name (e.g. AMR vendors to evaluate)" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreate()} />
          <input style={{ ...S.rfiInput, marginBottom: 0, flex: 2, minWidth: 200 }} placeholder="Notes (optional)" value={newNotes} onChange={e => setNewNotes(e.target.value)} />
          <button style={{ ...S.navCta, fontFamily: "inherit", whiteSpace: "nowrap" }} onClick={handleCreate}>+ Save shortlist</button>
        </div>
      </div>

      {/* Saved lists */}
      {lists.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#475569" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 15, color: "#64748b", marginBottom: 8 }}>No shortlists saved yet</div>
          <div style={{ fontSize: 13, color: "#475569" }}>Select vendors in the directory or compare page, then save them here to build a shareable shortlist.</div>
          <button style={{ ...S.btnSecondary, width: "auto", marginTop: 20 }} onClick={() => setPage("directory")}>Browse vendors</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {lists.map(list => {
            const listVendors = vendors.filter(v => (list.vendorIds || []).includes(v.id));

            const isEditing = editingId === list.id;
            return (
              <div key={list.id} style={{ ...S.sideCard, padding: 0, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    {isEditing ? (
                      <input
                        autoFocus
                        style={{ ...S.rfiInput, marginBottom: 6, fontSize: 15, fontWeight: 700 }}
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                      />
                    ) : (
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#e8edf5", marginBottom: 4 }}>{list.name}</div>
                    )}
                    <div style={{ fontSize: 11, color: "#475569" }}>
                      Created {new Date(list.created).toLocaleDateString()} · {listVendors.length} vendor{listVendors.length !== 1 ? "s" : ""}
                      {(list.productIds || []).length > 0 && ` · ${list.productIds.length} product${list.productIds.length !== 1 ? "s" : ""}`}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {isEditing ? (
                      <>
                        <button style={{ ...S.navCta, fontFamily: "inherit", padding: "6px 12px", fontSize: 12 }} onClick={() => handleSaveEdit(list.id)}>Save</button>
                        <button style={{ ...S.btnSecondary, width: "auto", padding: "6px 12px", fontSize: 12 }} onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button style={{ ...S.btnSecondary, width: "auto", padding: "6px 12px", fontSize: 12 }}
                          onClick={() => { setEditingId(list.id); setEditName(list.name); setEditNotes(list.notes || ""); }}>
                          Edit
                        </button>
                        <button
                          style={{ ...S.btnSecondary, width: "auto", padding: "6px 12px", fontSize: 12, color: copied === list.id ? "#22c55e" : "#94a3b8", borderColor: copied === list.id ? "rgba(34,197,94,0.3)" : undefined }}
                          onClick={() => handleCopy(list.id)}>
                          {copied === list.id ? "✓ Copied" : "Share link"}
                        </button>
                        {listVendors.length >= 2 && (
                          <button style={{ ...S.navCta, fontFamily: "inherit", padding: "6px 12px", fontSize: 12 }} onClick={() => handleLoad(list)}>
                            Compare
                          </button>
                        )}
                        <button style={{ ...S.btnSecondary, width: "auto", padding: "6px 12px", fontSize: 12, color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}
                          onClick={() => handleDelete(list.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {isEditing ? (
                  <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <textarea
                      style={{ ...S.rfiInput, marginBottom: 0, minHeight: 60, resize: "vertical" }}
                      placeholder="Add notes about this shortlist..."
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                    />
                  </div>
                ) : list.notes ? (
                  <div style={{ padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{list.notes}</div>
                ) : null}

                {/* Share URL */}
                <div style={{ padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#475569", flexShrink: 0 }}>Share:</span>
                  <code style={{ fontSize: 11, color: "#64748b", background: "#0d1526", padding: "3px 8px", borderRadius: 4, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {shortlistShareUrl(list.id)}
                  </code>
                </div>

                {/* Vendors in list */}
                {listVendors.length > 0 && (
                  <div style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {listVendors.map(v => (
                        <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#0d1526", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}
                          onClick={() => openDetail(v, "shortlists", "shortlists")}>
                          <div style={{ ...S.logoCircle, background: v.color, width: 22, height: 22, fontSize: 8, marginBottom: 0 }}>{v.logo}</div>
                          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{v.name}</span>
                          <span style={{ fontSize: 10, color: "#475569" }}>→</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>)}
    </div>
  );
}

function WorkspaceFilesTab({ ws, wsVendors, save, isMobile, labelStyle, inputStyle }) {
  const links = ws.fileLinks || [];
  const FILE_TYPES = ["Quote", "Proposal", "Spec sheet", "RFP / RFI", "Site layout", "Org chart", "Contract", "Case study", "Demo recording", "Other"];
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("Quote");
  const [newNotes, setNewNotes] = useState("");

  const addLink = () => {
    if (!newUrl.trim() || !newLabel.trim()) return;
    const entry = { id: genId(), label: newLabel, url: newUrl, type: newType, notes: newNotes, added: new Date().toISOString() };
    save({ fileLinks: [entry, ...links] });
    setNewUrl(""); setNewLabel(""); setNewNotes(""); setNewType("Quote");
  };

  const removeLink = (id) => save({ fileLinks: links.filter(l => l.id !== id) });

  const typeColors = {
    "Quote": "#f59e0b", "Proposal": "#22c55e", "Spec sheet": "#38bdf8",
    "RFP / RFI": "#818cf8", "Contract": "#ef4444", "Demo recording": "#f87171",
    "Site layout": "#a78bfa", "Org chart": "#fb923c", "Case study": "#34d399", "Other": "#94a3b8",
  };
  const typeEmoji = { "Quote": "💰", "Proposal": "📝", "Spec sheet": "📋", "RFP / RFI": "📄", "Contract": "⚖️", "Demo recording": "▶️", "Site layout": "🏗️", "Org chart": "👥", "Case study": "📊", "Other": "📎" };

  return (
    <div>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.6 }}>
        Paste links to project files stored in Google Drive, SharePoint, Dropbox, or anywhere else. Label each link so your team knows what it is.
      </div>
      <div style={{ ...S.sideCard, marginBottom: 20, background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.15)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 12 }}>Add a file link</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
          <div>
            <label style={labelStyle}>Label *</label>
            <input style={inputStyle} placeholder="e.g. Slip Robotics — Q2 quote" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>File type</label>
            <select style={inputStyle} value={newType} onChange={e => setNewType(e.target.value)}>
              {FILE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Quick label from vendor</label>
            <select style={inputStyle} value="" onChange={e => { if (e.target.value) setNewLabel(`${e.target.value} — ${newType}`); }}>
              <option value="">Select vendor...</option>
              {wsVendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
            </select>
          </div>
        </div>
        <label style={labelStyle}>URL *</label>
        <input style={inputStyle} placeholder="https://drive.google.com/... or any URL" value={newUrl} onChange={e => setNewUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && addLink()} />
        <label style={labelStyle}>Notes (optional)</label>
        <input style={inputStyle} placeholder="e.g. Received 5/12, expires 6/30. Includes installation." value={newNotes} onChange={e => setNewNotes(e.target.value)} />
        <button style={{ ...S.navCta, fontFamily: "inherit" }} onClick={addLink} disabled={!newUrl || !newLabel}>+ Add link</button>
      </div>
      {links.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>📁</div>
          <div style={{ fontSize: 14, color: "#64748b", marginBottom: 6 }}>No files linked yet</div>
          <div style={{ fontSize: 12, color: "#475569" }}>Add links to quotes, proposals, spec sheets, and other project documents above.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {links.map(link => (
            <div key={link.id} style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${typeColors[link.type] || "#94a3b8"}18`, border: `1px solid ${typeColors[link.type] || "#94a3b8"}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                {typeEmoji[link.type] || "📎"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#e8edf5" }}>{link.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: `${typeColors[link.type] || "#94a3b8"}18`, color: typeColors[link.type] || "#94a3b8", border: `1px solid ${typeColors[link.type] || "#94a3b8"}33` }}>{link.type}</span>
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.url}</div>
                {link.notes && <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{link.notes}</div>}
                <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>Added {new Date(link.added).toLocaleDateString()}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ ...S.navCta, padding: "6px 12px", fontSize: 11, textDecoration: "none", display: "inline-block" }}>Open →</a>
                <button onClick={() => removeLink(link.id)} style={{ ...S.btnSecondary, width: "auto", padding: "6px 10px", fontSize: 11, color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkspacePage({ setPage, openDetail, wsId }) {
  const isMobile = useIsMobile();
  const [ws, setWs] = useState(() => getWorkspace(wsId));
  const [tab, setTab] = useState("context");
  const [copied, setCopied] = useState(false);

  if (!ws) return (
    <div style={{ textAlign: "center", padding: "80px 32px" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontSize: 16, color: "#94a3b8", marginBottom: 16 }}>Workspace not found</div>
      <button style={{ ...S.btnSecondary, width: "auto" }} onClick={() => setPage("shortlists")}>Back to shortlists</button>
    </div>
  );

  const save = (patch) => {
    const updated = updateWorkspace(wsId, patch);
    setWs(getWorkspace(wsId));
  };

  const setField = (field, val) => save({ [field]: val });
  const setRoiField = (field, val) => save({ roi: { ...ws.roi, [field]: val } });
  const setScorecardField = (vendorId, field, val) => {
    const scorecard = { ...ws.scorecard, [vendorId]: { ...(ws.scorecard[vendorId] || {}), [field]: val } };
    save({ scorecard });
  };
  const setRfiField = (vendorId, field, val) => {
    const rfis = { ...ws.rfis, [vendorId]: { ...(ws.rfis[vendorId] || {}), [field]: val } };
    save({ rfis });
  };
  const toggleVendor = (vendorId) => {
    const ids = ws.vendorIds.includes(vendorId) ? ws.vendorIds.filter(id => id !== vendorId) : [...ws.vendorIds, vendorId];
    save({ vendorIds: ids });
  };

  const wsVendors = vendors.filter(v => ws.vendorIds.includes(v.id));

  // ── ROI CALCULATIONS ──────────────────────────────────────────────────────
  const r = ws.roi;
  const annualLaborCost = (parseFloat(r.laborHeadcount) || 0) * (parseFloat(r.laborRate) || 0) * (parseFloat(r.shiftsPerDay) || 2) * (parseFloat(r.daysPerYear) || 250) * 8;
  const captureRate = (parseFloat(r.automationCapturePercent) || 70) / 100;
  const annualSavings = annualLaborCost * captureRate;
  const budgetMid = { "Under $50k": 50000, "$50k–$200k": 125000, "$200k–$500k": 350000, "$500k–$1M": 750000, "$1M+": 1500000, "Unknown": 500000 }[ws.budgetRange] || 500000;
  const paybackMonths = annualSavings > 0 ? Math.round((budgetMid / annualSavings) * 12) : null;
  const npv3yr = annualSavings > 0 ? Math.round(annualSavings * 3 - budgetMid) : null;

  // ── SCORECARD ──────────────────────────────────────────────────────────────
  // Category-specific scorecard criteria
  const primaryCategory = wsVendors.length > 0
    ? wsVendors[0].category
    : ws.projectType?.toLowerCase().includes('amr') ? 'AMR / Mobile Robots' : null;

  const CRITERIA_BY_CATEGORY = {
    "AMR / Mobile Robots": [
      { key: "throughput_fit", label: "Throughput / payload fit", weight: 3, hint: "Does the robot's payload, speed, and throughput match your requirement?" },
      { key: "nav_reliability", label: "Navigation reliability", weight: 3, hint: "How well does the navigation handle your facility's dynamics — forklifts, pedestrians, layout changes?" },
      { key: "wms_integration", label: "WMS integration depth", weight: 2, hint: "Quality of pre-built connector or integration path with your WMS" },
      { key: "implementation_risk", label: "Implementation risk", weight: 2, hint: "Track record in brownfield deployments at your scale. Timeline reliability." },
      { key: "support_model", label: "Support & uptime SLA", weight: 2, hint: "Local service response time, uptime SLA, and escalation path" },
      { key: "tco", label: "Total cost of ownership", weight: 1, hint: "All-in cost vs. alternatives: capex + software + maintenance vs. RaaS" },
    ],
    "WMS Platforms": [
      { key: "functional_fit", label: "Functional fit", weight: 3, hint: "Does the WMS handle your specific processes without heavy customization?" },
      { key: "automation_integration", label: "Automation integration", weight: 3, hint: "Depth of pre-built connectors for AMR, AS/RS, conveyor, voice systems" },
      { key: "implementation_risk", label: "Implementation risk", weight: 2, hint: "Track record at your scale. Timeline reliability. SI partner quality." },
      { key: "support_model", label: "Ongoing support quality", weight: 2, hint: "P1 response time, support org size, post-go-live customer satisfaction" },
      { key: "scalability", label: "Scalability", weight: 2, hint: "Can the platform grow to 2x-5x your current volume without re-platforming?" },
      { key: "tco", label: "Total cost of ownership", weight: 1, hint: "Software + implementation + ongoing support vs. alternatives" },
    ],
    "AS/RS": [
      { key: "density_fit", label: "Storage density fit", weight: 3, hint: "Does the system achieve the density improvement you need in your footprint?" },
      { key: "throughput_fit", label: "Throughput capacity", weight: 3, hint: "Can the system handle your peak throughput with adequate headroom?" },
      { key: "reliability_uptime", label: "Reliability & uptime", weight: 3, hint: "Vendor's uptime record at comparable installations. Redundancy model." },
      { key: "implementation_risk", label: "Implementation complexity", weight: 2, hint: "Civil scope, controls integration risk, WCS quality, go-live history" },
      { key: "service_support", label: "Service & parts", weight: 2, hint: "Local service org, spare parts availability, escalation response time" },
      { key: "tco", label: "Total cost of ownership", weight: 1, hint: "Capital cost per unit of throughput vs. alternatives" },
    ],
    "Conveyor & Sortation": [
      { key: "throughput_fit", label: "Throughput capacity", weight: 3, hint: "Can the system handle your peak sort rate with adequate headroom?" },
      { key: "sort_accuracy", label: "Sort accuracy / reliability", weight: 3, hint: "Sort error rate at peak throughput. Downtime record at comparable sites." },
      { key: "integration_risk", label: "Integration & controls", weight: 2, hint: "WCS quality, integration with your WMS, controls engineering depth" },
      { key: "implementation_risk", label: "Implementation risk", weight: 2, hint: "Track record for on-time, on-budget delivery. Brownfield experience." },
      { key: "service_support", label: "Service & maintenance", weight: 2, hint: "24/7 support availability, local tech response, planned maintenance program" },
      { key: "tco", label: "Total cost of ownership", weight: 1, hint: "Capital + 10-year maintenance vs. alternatives" },
    ],
    "Systems Integration": [
      { key: "relevant_experience", label: "Relevant experience", weight: 3, hint: "Number of comparable projects (scale, complexity, industry). Reference quality." },
      { key: "controls_capability", label: "Controls & WCS capability", weight: 3, hint: "In-house controls team depth. WCS platform quality and integration track record." },
      { key: "project_management", label: "Project management", weight: 2, hint: "On-time, on-budget track record. Specific PM and controls lead assigned to your project." },
      { key: "brownfield_exp", label: "Brownfield experience", weight: 2, hint: "Active-DC retrofit track record. Safety record during construction." },
      { key: "vendor_relationships", label: "Vendor relationships", weight: 2, hint: "Access to best-fit equipment. Not locked to proprietary hardware." },
      { key: "tco", label: "Cost competitiveness", weight: 1, hint: "Project cost vs. comparable SI bids. Change order history." },
    ],
  };

  const CRITERIA = CRITERIA_BY_CATEGORY[primaryCategory] || [
    { key: "fit", label: "Use case fit", weight: 3, hint: "How well does this vendor address your specific application?" },
    { key: "implementation", label: "Implementation risk", weight: 2, hint: "Timeline reliability, brownfield track record, project management quality" },
    { key: "support", label: "Vendor support", weight: 2, hint: "Service response time, uptime SLA, local support capability" },
    { key: "integration", label: "Integration ease", weight: 2, hint: "WMS/ERP integration depth and pre-built connector quality" },
    { key: "cost", label: "Cost / value", weight: 1, hint: "Total cost of ownership vs. alternatives at your scale" },
  ];
  const totalWeight = CRITERIA.reduce((s, c) => s + c.weight, 0);
  const vendorScores = wsVendors.map(v => {
    const sc = ws.scorecard[v.id] || {};
    const weighted = CRITERIA.reduce((sum, c) => sum + (parseFloat(sc[c.key]) || 0) * c.weight, 0);
    const total = Math.round((weighted / (totalWeight * 5)) * 100);
    return { vendor: v, scores: sc, total };
  }).sort((a, b) => b.total - a.total);

  // ── BUSINESS CASE EXPORT ──────────────────────────────────────────────────
  const exportBusinessCase = () => {
    const scoreRows = vendorScores.filter(vs => vs.total > 0).map((vs, i) => `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:8px 12px;font-weight:600;">#${i+1} ${vs.vendor.name}</td>
        <td style="padding:8px 12px;">${vs.vendor.category}</td>
        <td style="padding:8px 12px;">${vs.vendor.price_range || '—'}</td>
        <td style="padding:8px 12px;">${vs.vendor.vendor_type || '—'}</td>
        <td style="padding:8px 12px;font-weight:700;color:${vs.total >= 70 ? '#16a34a' : vs.total >= 50 ? '#d97706' : '#6b7280'};">${vs.total}%</td>
        <td style="padding:8px 12px;font-size:12px;color:#6b7280;">${(ws.scorecard[vs.vendor.id]?.notes || '—').slice(0,60)}</td>
      </tr>`).join('');

    const rfiRows = wsVendors.map(v => {
      const rfi = ws.rfis[v.id] || {};
      return `<tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:8px 12px;font-weight:600;">${v.name}</td>
        <td style="padding:8px 12px;">${rfi.contactName || '—'}</td>
        <td style="padding:8px 12px;">${rfi.contactEmail || '—'}</td>
        <td style="padding:8px 12px;">${rfi.responseStatus || 'Not contacted'}</td>
        <td style="padding:8px 12px;">${rfi.demoDate || '—'}</td>
        <td style="padding:8px 12px;font-size:12px;color:#6b7280;">${(rfi.notes || '—').slice(0,80)}</td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${ws.projectName} — Automation Evaluation</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; background: #fff; font-size: 13px; line-height: 1.5; }
  .page { max-width: 900px; margin: 0 auto; padding: 48px 48px; }
  .header { border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 28px; }
  .logo { font-size: 13px; font-weight: 700; color: #f59e0b; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px; }
  h1 { font-size: 28px; font-weight: 800; color: #111; letter-spacing: -0.5px; margin-bottom: 4px; }
  .meta { font-size: 12px; color: #6b7280; }
  .section { margin-bottom: 28px; }
  .section-title { font-size: 11px; font-weight: 700; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #f3f4f6; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 14px; }
  .box-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
  .box-value { font-size: 14px; font-weight: 600; color: #111; }
  .prose { font-size: 13px; color: #374151; line-height: 1.7; background: #f9fafb; border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 0 6px 6px 0; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { padding: 8px 12px; background: #f3f4f6; text-align: left; font-weight: 600; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; }
  .highlight { background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 14px 16px; margin-bottom: 16px; }
  .highlight-title { font-size: 11px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
  .roi-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
  .roi-label { color: #6b7280; }
  .roi-value { font-weight: 700; color: #111; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; display: flex; justify-content: space-between; }
  .tag { display: inline-block; background: #f3f4f6; border-radius: 4px; padding: 2px 8px; font-size: 11px; color: #6b7280; margin: 2px; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { padding: 32px; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo">OpEx Scout — Automation Evaluation</div>
    <h1>${ws.projectName || 'Automation Evaluation'}</h1>
    <div class="meta">Generated ${new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})} · Confidential</div>
  </div>

  <div class="section">
    <div class="section-title">Project Context</div>
    <div class="grid">
      <div class="box"><div class="box-label">Facility Type</div><div class="box-value">${ws.facilityType}</div></div>
      <div class="box"><div class="box-label">Facility Size</div><div class="box-value">${ws.facilitySqft ? ws.facilitySqft + ' sqft' : 'TBD'}</div></div>
      <div class="box"><div class="box-label">Project Type</div><div class="box-value">${ws.projectType}</div></div>
      <div class="box"><div class="box-label">Budget Range</div><div class="box-value">${ws.budgetRange}</div></div>
      <div class="box"><div class="box-label">Timeline</div><div class="box-value">${ws.timeline}</div></div>
      <div class="box"><div class="box-label">Current Systems</div><div class="box-value">${ws.currentWMS || 'TBD'}</div></div>
    </div>
    ${ws.problemStatement ? `<div class="box-label" style="margin-bottom:6px">Problem Statement</div><div class="prose">${ws.problemStatement}</div>` : ''}
    ${ws.successCriteria ? `<div class="box-label" style="margin-top:12px;margin-bottom:6px">Success Criteria</div><div class="prose">${ws.successCriteria}</div>` : ''}
  </div>

  ${annualSavings > 0 ? `
  <div class="section">
    <div class="section-title">ROI Analysis</div>
    <div class="highlight">
      <div class="highlight-title">Financial Summary</div>
      <div class="roi-row"><span class="roi-label">Annual labor cost (current)</span><span class="roi-value">$${Math.round(annualLaborCost).toLocaleString()}</span></div>
      <div class="roi-row"><span class="roi-label">Automation capture rate</span><span class="roi-value">${r.automationCapturePercent || 70}%</span></div>
      <div class="roi-row"><span class="roi-label">Estimated annual savings</span><span class="roi-value">$${Math.round(annualSavings).toLocaleString()}</span></div>
      <div class="roi-row"><span class="roi-label">Estimated investment (${ws.budgetRange})</span><span class="roi-value">$${budgetMid.toLocaleString()}</span></div>
      ${paybackMonths ? `<div class="roi-row"><span class="roi-label">Payback period</span><span class="roi-value" style="color:#16a34a;">~${paybackMonths} months</span></div>` : ''}
      ${npv3yr ? `<div class="roi-row"><span class="roi-label">3-year net savings</span><span class="roi-value" style="color:#16a34a;">$${npv3yr.toLocaleString()}</span></div>` : ''}
    </div>
    <p style="font-size:11px;color:#9ca3af;margin-top:8px;">Note: ROI estimates are directional and based on labor displacement only. Implementation costs, training, maintenance, and throughput improvement value should be validated with vendor proposals before capital approval.</p>
  </div>` : ''}

  ${wsVendors.length > 0 ? `
  <div class="section">
    <div class="section-title">Vendors Evaluated (${wsVendors.length})</div>
    <table>
      <thead><tr>
        <th>Vendor</th><th>Category</th><th>Type</th><th>Price Tier</th><th>Implementation</th>
      </tr></thead>
      <tbody>
        ${wsVendors.map(v => `<tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:8px 12px;font-weight:600;">${v.name}</td>
          <td style="padding:8px 12px;">${v.category}</td>
          <td style="padding:8px 12px;">${v.vendor_type || '—'}</td>
          <td style="padding:8px 12px;">${v.price_range || '—'}</td>
          <td style="padding:8px 12px;font-size:11px;">${v.implementation_pilot || '—'}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>` : ''}

  ${vendorScores.some(vs => vs.total > 0) ? `
  <div class="section">
    <div class="section-title">Scorecard Rankings</div>
    <table>
      <thead><tr><th>Rank</th><th>Category</th><th>Price</th><th>Type</th><th>Score</th><th>Notes</th></tr></thead>
      <tbody>${scoreRows}</tbody>
    </table>
    <p style="font-size:11px;color:#9ca3af;margin-top:8px;">Weighted scoring: Use case fit ×3, Implementation risk ×2, Vendor support ×2, Integration ease ×2, Cost/value ×1</p>
  </div>` : ''}

  ${wsVendors.length > 0 && Object.keys(ws.rfis).length > 0 ? `
  <div class="section">
    <div class="section-title">RFI & Outreach Status</div>
    <table>
      <thead><tr><th>Vendor</th><th>Contact</th><th>Email</th><th>Status</th><th>Demo Date</th><th>Notes</th></tr></thead>
      <tbody>${rfiRows}</tbody>
    </table>
  </div>` : ''}

  ${vendorScores[0]?.total > 0 ? `
  <div class="section">
    <div class="section-title">Recommendation</div>
    <div class="highlight">
      <div class="highlight-title">Top Recommendation (Based on Scorecard)</div>
      <div style="font-size:16px;font-weight:700;margin-bottom:6px;">${vendorScores[0].vendor.name}</div>
      <div style="font-size:13px;color:#374151;">${vendorScores[0].vendor.best_for || vendorScores[0].vendor.tagline || ''}</div>
      <div style="font-size:12px;color:#6b7280;margin-top:6px;">Weighted score: ${vendorScores[0].total}% · ${vendorScores[0].vendor.vendor_type || ''} · ${vendorScores[0].vendor.price_range || ''}</div>
    </div>
  </div>` : ''}

  <div class="section">
    <div class="section-title">Recommended Next Steps</div>
    <ol style="padding-left:20px;color:#374151;line-height:2;">
      <li>Schedule demos with top 2–3 vendors based on scorecard rankings</li>
      <li>Request formal proposals including full scope, integration cost, and implementation timeline</li>
      <li>Conduct reference calls with existing customers at comparable operations</li>
      <li>Validate ROI assumptions with vendor-provided throughput and uptime data</li>
      <li>Present final shortlist and business case to leadership for capital approval</li>
    </ol>
  </div>

  <div class="footer">
    <span>Generated by OpEx Scout — opexscout.com</span>
    <span>${ws.projectName} · ${new Date().toLocaleDateString()}</span>
  </div>
</div>
<script>window.onload = () => window.print();</script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) {
      // Fallback if popup blocked
      const a = document.createElement("a");
      a.href = url;
      a.download = `${ws.projectName.replace(/[^a-z0-9]/gi, "-").toLowerCase() || "evaluation"}-business-case.html`;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const tabs = [
    { id: "context", label: "📋 Project context" },
    { id: "vendors", label: "🏭 Vendors" },
    { id: "scorecard", label: "⭐ Scorecard" },
    { id: "roi", label: "💰 ROI calculator" },
    { id: "rfi", label: "📞 RFI tracker" },
    { id: "files", label: "📁 Files & links" },
    { id: "case", label: "📄 Business case" },
  ];

  const inputStyle = { ...S.rfiInput, marginBottom: 10 };
  const labelStyle = { ...S.rfiLabel, marginBottom: 4 };

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh", paddingBottom: 60 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "16px" : "28px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <button style={S.backBtn} onClick={() => setPage("shortlists")}><ArrowLeft /> My shortlists</button>
            <input
              style={{ fontSize: isMobile ? 20 : 26, fontWeight: 800, color: "#e8edf5", background: "none", border: "none", outline: "none", fontFamily: "inherit", width: "100%", letterSpacing: "-0.3px" }}
              value={ws.projectName}
              onChange={e => setField("projectName", e.target.value)}
              placeholder="Project name..."
            />
            <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
              Last updated {new Date(ws.updated).toLocaleDateString()} · {wsVendors.length} vendor{wsVendors.length !== 1 ? "s" : ""} in scope
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={{ ...S.navCta, fontFamily: "inherit" }} onClick={exportBusinessCase}>📄 Export PDF</button>
          </div>
        </div>

        {/* Progress bar */}
        {(() => {
          const checks = [ws.problemStatement, ws.facilitySqft || ws.throughputTarget, ws.vendorIds.length > 0, Object.keys(ws.scorecard).length > 0, ws.roi.laborHeadcount && ws.roi.laborRate, Object.keys(ws.rfis).length > 0];
          const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
          return (
            <div style={{ marginBottom: 20, background: "#0f1c30", borderRadius: 10, padding: "12px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Evaluation completeness</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#94a3b8" }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: "#0d1526", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#475569", borderRadius: 99, transition: "width 0.4s" }} />
              </div>
            </div>
          );
        })()}

        {/* Tabs */}
        <div style={{ ...S.tabs, marginBottom: 0, borderRadius: "10px 10px 0 0", background: "#0d1526" }}>
          {tabs.map(t => (
            <div key={t.id} style={{ ...S.tab, ...(tab === t.id ? S.tabActive : {}), fontSize: isMobile ? 11 : 12 }} onClick={() => setTab(t.id)}>{t.label}</div>
          ))}
        </div>

        <div style={{ background: "#0f1c30", border: "1px solid rgba(255,255,255,0.07)", borderTop: "none", borderRadius: "0 0 14px 14px", padding: isMobile ? 16 : 28 }}>

          {/* ── TAB: PROJECT CONTEXT ── */}
          {tab === "context" && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>Facility details</div>
                <label style={labelStyle}>Facility type</label>
                <select style={inputStyle} value={ws.facilityType} onChange={e => setField("facilityType", e.target.value)}>
                  {industries.map(i => <option key={i}>{i}</option>)}
                </select>
                <label style={labelStyle}>Facility size (sqft)</label>
                <input style={inputStyle} placeholder="e.g. 450,000" value={ws.facilitySqft} onChange={e => setField("facilitySqft", e.target.value)} />
                <label style={labelStyle}>Throughput target</label>
                <input style={inputStyle} placeholder="e.g. 1,200 orders/day, 500 cases/hr" value={ws.throughputTarget} onChange={e => setField("throughputTarget", e.target.value)} />
                <label style={labelStyle}>Current WMS / ERP / controls</label>
                <input style={inputStyle} placeholder="e.g. Manhattan Active WM, SAP EWM" value={ws.currentWMS} onChange={e => setField("currentWMS", e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>Project details</div>
                <label style={labelStyle}>Project type</label>
                <select style={inputStyle} value={ws.projectType} onChange={e => setField("projectType", e.target.value)}>
                  {["Brownfield retrofit", "Greenfield / new build", "Capacity expansion", "Vendor replacement", "Feasibility study"].map(x => <option key={x}>{x}</option>)}
                </select>
                <label style={labelStyle}>Budget range</label>
                <select style={inputStyle} value={ws.budgetRange} onChange={e => setField("budgetRange", e.target.value)}>
                  {["Under $50k", "$50k–$200k", "$200k–$500k", "$500k–$1M", "$1M+", "Unknown"].map(x => <option key={x}>{x}</option>)}
                </select>
                <label style={labelStyle}>Target go-live timeline</label>
                <select style={inputStyle} value={ws.timeline} onChange={e => setField("timeline", e.target.value)}>
                  {["0–3 months", "3–6 months", "6–12 months", "12–18 months", "18+ months", "TBD"].map(x => <option key={x}>{x}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
                <label style={labelStyle}>Problem statement — what operational problem are you solving?</label>
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} placeholder="e.g. High dock labor cost and injury rate on inbound. 3 doors × 2 shifts of unload labor. Volume growing 20% YoY with no room to add headcount." value={ws.problemStatement} onChange={e => setField("problemStatement", e.target.value)} />
                <label style={labelStyle}>Success criteria — how will you measure a successful outcome?</label>
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} placeholder="e.g. Reduce dock labor by 40%, achieve 99.5% unit accuracy on inbound, payback within 24 months." value={ws.successCriteria} onChange={e => setField("successCriteria", e.target.value)} />
              </div>
            </div>
          )}

          {/* ── TAB: VENDORS ── */}
          {tab === "vendors" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>{wsVendors.length} vendor{wsVendors.length !== 1 ? "s" : ""} in scope</div>
                <button style={{ ...S.btnSecondary, width: "auto", padding: "7px 14px", fontSize: 12 }} onClick={() => {
                setPage("directory");
              }}>+ Add vendors from directory</button>
              </div>
              {wsVendors.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>🏭</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginBottom: 12 }}>No vendors added yet</div>
                  <div style={{ fontSize: 12, color: "#475569", marginBottom: 16 }}>Go to the directory, select vendors with the Compare checkbox, then come back and add them here.</div>
                  <button style={{ ...S.navCta, fontFamily: "inherit" }} onClick={() => setPage("directory")}>Browse directory</button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                  {wsVendors.map(v => (
                    <div key={v.id} style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ ...S.logoCircle, background: v.color, width: 32, height: 32, fontSize: 10, marginBottom: 0 }}>{v.logo}</div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#e8edf5" }}>{v.name}</div>
                            <div style={{ fontSize: 11, color: "#475569" }}>{v.category}</div>
                          </div>
                        </div>
                        <button onClick={() => toggleVendor(v.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
                      </div>
                      <PriceBadge tier={v.price_range} />
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 8, lineHeight: 1.5 }}>{v.best_for?.slice(0, 80)}...</div>
                      <button style={{ ...S.btnSecondary, marginTop: 10, fontSize: 11, padding: "6px 10px" }} onClick={() => openDetail(v, "workspace", "workspace")}>View profile →</button>
                    </div>
                  ))}
                </div>
              )}
              {/* Add vendors by searching */}
              <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Quick add by category</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {categories.slice(0, 8).map(cat => {
                    const catVendors = vendors.filter(v => v.category === cat);
                    return (
                      <button key={cat} style={{ ...S.chip, fontSize: 11, padding: "4px 10px" }} onClick={() => {
                        const toAdd = catVendors.slice(0, 3).map(v => v.id).filter(id => !ws.vendorIds.includes(id));
                        if (toAdd.length) save({ vendorIds: [...ws.vendorIds, ...toAdd] });
                      }}>+ {cat.split(" ")[0]} ({catVendors.length})</button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: SCORECARD ── */}
          {tab === "scorecard" && (
            <div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12, lineHeight: 1.6 }}>
                Score each vendor 1–5 on each criterion (1 = poor, 3 = acceptable, 5 = excellent). Hover criteria names for scoring guidance. Weighted total drives your business case ranking.
              </div>
              {primaryCategory && CRITERIA_BY_CATEGORY[primaryCategory] && (
                <div style={{ marginBottom: 16, padding: "8px 12px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 8, fontSize: 11, color: "#f59e0b" }}>
                  Using <strong>{primaryCategory}</strong> scorecard criteria — criteria and weights are optimized for this vendor category.
                </div>
              )}
              {wsVendors.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>Add vendors first to score them.</div>
              ) : (
                <>
                  {/* Ranking summary */}
                  {vendorScores.some(vs => vs.total > 0) && (
                    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                      {vendorScores.filter(vs => vs.total > 0).map((vs, i) => (
                        <div key={vs.vendor.id} style={{ background: i === 0 ? "rgba(245,158,11,0.1)" : "#0d1526", border: `1px solid ${i === 0 ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? "#f59e0b" : "#475569" }}>#{i + 1}</span>
                          <div style={{ ...S.logoCircle, background: vs.vendor.color, width: 22, height: 22, fontSize: 8, marginBottom: 0 }}>{vs.vendor.logo}</div>
                          <span style={{ fontSize: 12, color: "#e8edf5", fontWeight: 600 }}>{vs.vendor.name}</span>
                          <span style={{ fontSize: 12, color: i === 0 ? "#f59e0b" : "#64748b", fontWeight: 700 }}>{vs.total}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr>
                          <th style={{ ...S.compareTh, width: 160 }}>Vendor</th>
                          {CRITERIA.map(c => <th key={c.key} style={{ ...S.compareTh, textAlign: "center", minWidth: 100 }} title={c.hint}>{c.label}<br /><span style={{ color: "#475569", fontWeight: 400 }}>×{c.weight}</span></th>)}
                          <th style={{ ...S.compareTh, textAlign: "center" }}>Score</th>
                          <th style={{ ...S.compareTh }}>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wsVendors.map(v => {
                          const sc = ws.scorecard[v.id] || {};
                          const vs = vendorScores.find(x => x.vendor.id === v.id);
                          return (
                            <tr key={v.id}>
                              <td style={{ ...S.compareTd, fontWeight: 600, color: "#e8edf5" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <div style={{ ...S.logoCircle, background: v.color, width: 22, height: 22, fontSize: 8, marginBottom: 0 }}>{v.logo}</div>
                                  {v.name}
                                </div>
                              </td>
                              {CRITERIA.map(c => (
                                <td key={c.key} style={{ ...S.compareTd, textAlign: "center", padding: 8 }}>
                                  <select
                                    style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: sc[c.key] ? "#f59e0b" : "#475569", padding: "4px 8px", fontSize: 13, cursor: "pointer", fontWeight: sc[c.key] ? 700 : 400 }}
                                    value={sc[c.key] || ""}
                                    onChange={e => setScorecardField(v.id, c.key, e.target.value)}
                                  >
                                    <option value="">—</option>
                                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                  </select>
                                </td>
                              ))}
                              <td style={{ ...S.compareTd, textAlign: "center" }}>
                                <span style={{ fontSize: 16, fontWeight: 800, color: vs?.total >= 70 ? "#22c55e" : vs?.total >= 50 ? "#f59e0b" : "#475569" }}>
                                  {vs?.total > 0 ? `${vs.total}%` : "—"}
                                </span>
                              </td>
                              <td style={{ ...S.compareTd }}>
                                <input
                                  style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, color: "#64748b", padding: "4px 8px", fontSize: 11, width: "100%" }}
                                  placeholder="Notes..."
                                  value={sc.notes || ""}
                                  onChange={e => setScorecardField(v.id, "notes", e.target.value)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── TAB: ROI CALCULATOR ── */}
          {tab === "roi" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>
                {/* LEFT: Inputs */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Labor savings</div>
                  <label style={labelStyle}>Headcount to automate (FTEs)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 8" value={r.laborHeadcount} onChange={e => setRoiField("laborHeadcount", e.target.value)} />
                  <label style={labelStyle}>Fully-loaded hourly rate ($/hr incl. benefits)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 28" value={r.laborRate} onChange={e => setRoiField("laborRate", e.target.value)} />
                  <label style={labelStyle}>Shifts per day</label>
                  <select style={inputStyle} value={r.shiftsPerDay} onChange={e => setRoiField("shiftsPerDay", e.target.value)}>
                    {["1", "2", "3"].map(x => <option key={x}>{x}</option>)}
                  </select>
                  <label style={labelStyle}>Operating days per year</label>
                  <input style={inputStyle} type="number" placeholder="250" value={r.daysPerYear} onChange={e => setRoiField("daysPerYear", e.target.value)} />
                  <label style={labelStyle}>Automation capture rate (%)</label>
                  <input style={inputStyle} type="number" placeholder="70" value={r.automationCapturePercent} onChange={e => setRoiField("automationCapturePercent", e.target.value)} />
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 20, lineHeight: 1.6 }}>Capture rate = % of labor hours displaced. Typical: AMR pick-assist 40–60%, goods-to-person 70–85%, full dock automation 85–95%.</div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Total cost of ownership</div>
                  <label style={labelStyle}>System / equipment cost ($)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 500000" value={r.equipmentCost || ""} onChange={e => setRoiField("equipmentCost", e.target.value)} />
                  <label style={labelStyle}>Implementation / integration cost ($)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 150000" value={r.implementationCost || ""} onChange={e => setRoiField("implementationCost", e.target.value)} />
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 8, lineHeight: 1.6 }}>Typically 20–50% of equipment cost. Covers SI labor, controls, WMS integration, training, and commissioning.</div>
                  <label style={labelStyle}>Annual software / licensing cost ($)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 36000" value={r.softwareCost || ""} onChange={e => setRoiField("softwareCost", e.target.value)} />
                  <label style={labelStyle}>Annual maintenance / service cost ($)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 25000" value={r.maintenanceCost || ""} onChange={e => setRoiField("maintenanceCost", e.target.value)} />
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 20, lineHeight: 1.6 }}>Typically 5–10% of equipment cost per year for robotics; 15–20% for complex conveyor/sortation.</div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Financial assumptions</div>
                  <label style={labelStyle}>Discount rate / hurdle rate (%)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 10" value={r.discountRate || ""} onChange={e => setRoiField("discountRate", e.target.value)} />
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 8, lineHeight: 1.6 }}>Your company's required rate of return for capital projects. Typical range: 8–15%.</div>
                  <label style={labelStyle}>Analysis period (years)</label>
                  <select style={inputStyle} value={r.analysisPeriod || "5"} onChange={e => setRoiField("analysisPeriod", e.target.value)}>
                    {["3", "5", "7", "10"].map(x => <option key={x}>{x}</option>)}
                  </select>
                </div>

                {/* RIGHT: Results */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Financial summary</div>

                  {/* Key metrics cards */}
                  {(() => {
                    const headcount = parseFloat(r.laborHeadcount) || 0;
                    const rate = parseFloat(r.laborRate) || 0;
                    const shifts = parseFloat(r.shiftsPerDay) || 2;
                    const days = parseFloat(r.daysPerYear) || 250;
                    const capture = (parseFloat(r.automationCapturePercent) || 70) / 100;
                    const annualLabor = headcount * rate * shifts * days * 8;
                    const annualSavingsCalc = annualLabor * capture;

                    const equipment = parseFloat(r.equipmentCost) || budgetMid;
                    const implementation = parseFloat(r.implementationCost) || 0;
                    const software = parseFloat(r.softwareCost) || 0;
                    const maintenance = parseFloat(r.maintenanceCost) || 0;
                    const totalCapex = equipment + implementation;
                    const annualOpex = software + maintenance;
                    const netAnnualBenefit = annualSavingsCalc - annualOpex;

                    const discountRate = (parseFloat(r.discountRate) || 10) / 100;
                    const period = parseInt(r.analysisPeriod) || 5;
                    const payback = netAnnualBenefit > 0 ? (totalCapex / netAnnualBenefit) * 12 : null;

                    // NPV calculation
                    let npv = -totalCapex;
                    for (let yr = 1; yr <= period; yr++) {
                      npv += netAnnualBenefit / Math.pow(1 + discountRate, yr);
                    }

                    // IRR approximation
                    let irr = null;
                    if (netAnnualBenefit > 0 && totalCapex > 0) {
                      let lo = 0, hi = 5;
                      for (let i = 0; i < 50; i++) {
                        const mid = (lo + hi) / 2;
                        let npvTest = -totalCapex;
                        for (let yr = 1; yr <= period; yr++) npvTest += netAnnualBenefit / Math.pow(1 + mid, yr);
                        if (npvTest > 0) lo = mid; else hi = mid;
                      }
                      irr = Math.round(lo * 100);
                    }

                    const metrics = [
                      ["Annual labor cost (current)", annualLabor > 0 ? `$${Math.round(annualLabor).toLocaleString()}` : "—", false],
                      ["Annual labor savings", annualSavingsCalc > 0 ? `$${Math.round(annualSavingsCalc).toLocaleString()}` : "—", annualSavingsCalc > 0],
                      ["Annual operating cost (software + maintenance)", annualOpex > 0 ? `$${Math.round(annualOpex).toLocaleString()}` : "—", false],
                      ["Net annual benefit", netAnnualBenefit > 0 ? `$${Math.round(netAnnualBenefit).toLocaleString()}` : "—", netAnnualBenefit > 0],
                      ["Total capital investment", totalCapex > 0 ? `$${Math.round(totalCapex).toLocaleString()}` : "—", false],
                      ["Simple payback period", payback ? `${payback < 1 ? "<1" : Math.round(payback)} months` : "—", payback !== null && payback <= 36],
                      [`NPV (${period}-yr @ ${r.discountRate || 10}% discount)`, npv && netAnnualBenefit > 0 ? `$${Math.round(npv).toLocaleString()}` : "—", npv > 0],
                      ["IRR", irr !== null ? `${irr}%` : "—", irr !== null && irr > 15],
                    ];

                    return (
                      <div>
                        {metrics.map(([label, value, isGood]) => (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            <span style={{ fontSize: 12, color: "#64748b", maxWidth: "60%" }}>{label}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: value === "—" ? "#334155" : isGood ? "#22c55e" : "#94a3b8" }}>{value}</span>
                          </div>
                        ))}

                        {npv > 0 && netAnnualBenefit > 0 && (
                          <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", marginBottom: 6 }}>✓ Positive NPV — project meets hurdle rate</div>
                            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
                              At a {r.discountRate || 10}% discount rate, this project generates ${Math.round(npv).toLocaleString()} of net present value over {period} years. IRR of {irr}% {irr > 20 ? "comfortably exceeds" : "meets"} typical capital hurdle rates.
                            </div>
                          </div>
                        )}

                        {npv < 0 && netAnnualBenefit > 0 && (
                          <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 6 }}>⚠ Negative NPV at current assumptions</div>
                            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
                              Try reducing implementation cost, increasing capture rate, or extending the analysis period. Or check if throughput improvements (not modeled here) close the gap.
                            </div>
                          </div>
                        )}

                        <div style={{ marginTop: 16, padding: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, fontSize: 11, color: "#475569", lineHeight: 1.7 }}>
                          <strong style={{ color: "#64748b" }}>Note:</strong> This model captures labor cost displacement only. Throughput improvement, error reduction, space savings, and safety benefits are not included — these often add 15–40% to the business case. Use vendor-provided throughput data to model these separately.
                        </div>

                        {/* Per-vendor payback comparison */}
                        {wsVendors.filter(v => v.price_range).length > 0 && netAnnualBenefit > 0 && (
                          <div style={{ marginTop: 20 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Payback by vendor price tier</div>
                            {wsVendors.filter(v => v.price_range).map(v => {
                              const tierEquip = { "$": 40000, "$$": 125000, "$$$": 350000, "$$$$": 900000, "RaaS": 0 }[v.price_range] || equipment;
                              const tierImpl = tierEquip * 0.3;
                              const tierTotal = tierEquip + tierImpl;
                              const pb = tierTotal > 0 && netAnnualBenefit > 0 ? Math.round((tierTotal / netAnnualBenefit) * 12) : null;
                              return (
                                <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ ...S.logoCircle, background: v.color, width: 18, height: 18, fontSize: 7, marginBottom: 0 }}>{v.logo}</div>
                                    <span style={{ color: "#94a3b8" }}>{v.name}</span>
                                    <PriceBadge tier={v.price_range} />
                                  </div>
                                  <span style={{ color: pb && pb <= 24 ? "#22c55e" : pb && pb <= 36 ? "#f59e0b" : "#ef4444", fontWeight: 600 }}>
                                    {v.price_range === "RaaS" ? "Compare vs labor $/pick" : pb ? `~${pb}mo payback` : "—"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: RFI TRACKER ── */}
          {tab === "rfi" && (
            <div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.6 }}>
                Track your outreach to each vendor. Log contacts, demo dates, and notes from calls so nothing falls through the cracks.
              </div>
              {wsVendors.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>Add vendors to the workspace first.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {wsVendors.map(v => {
                    const rfi = ws.rfis[v.id] || {};
                    return (
                      <div key={v.id} style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
                        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ ...S.logoCircle, background: v.color, width: 28, height: 28, fontSize: 9, marginBottom: 0 }}>{v.logo}</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#e8edf5" }}>{v.name}</div>
                              <div style={{ fontSize: 11, color: "#475569" }}>{v.category}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            {[
                              ["Not contacted", "#475569", "rgba(255,255,255,0.05)"],
                              ["RFI sent", "#f59e0b", "rgba(245,158,11,0.1)"],
                              ["Responded", "#38bdf8", "rgba(56,189,248,0.1)"],
                              ["Demo scheduled", "#818cf8", "rgba(99,102,241,0.1)"],
                              ["Proposal received", "#22c55e", "rgba(34,197,94,0.1)"],
                              ["Eliminated", "#ef4444", "rgba(239,68,68,0.1)"],
                            ].map(([status, color, bg]) => (
                              <button key={status} onClick={() => setRfiField(v.id, "responseStatus", status)}
                                style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, border: `1px solid ${rfi.responseStatus === status ? color : "rgba(255,255,255,0.07)"}`, background: rfi.responseStatus === status ? bg : "transparent", color: rfi.responseStatus === status ? color : "#475569", cursor: "pointer", fontWeight: rfi.responseStatus === status ? 700 : 400, whiteSpace: "nowrap" }}>
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 10 }}>
                          <div>
                            <label style={labelStyle}>Contact name</label>
                            <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="e.g. Jane Smith" value={rfi.contactName || ""} onChange={e => setRfiField(v.id, "contactName", e.target.value)} />
                          </div>
                          <div>
                            <label style={labelStyle}>Contact email</label>
                            <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="jane@vendor.com" type="email" value={rfi.contactEmail || ""} onChange={e => setRfiField(v.id, "contactEmail", e.target.value)} />
                          </div>
                          <div>
                            <label style={labelStyle}>Demo / next meeting date</label>
                            <input style={{ ...inputStyle, marginBottom: 0 }} type="date" value={rfi.demoDate || ""} onChange={e => setRfiField(v.id, "demoDate", e.target.value)} />
                          </div>
                          <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
                            <label style={labelStyle}>Notes from conversations</label>
                            <textarea style={{ ...inputStyle, marginBottom: 0, minHeight: 70, resize: "vertical" }} placeholder="Key things discussed, concerns raised, pricing mentioned, implementation timeline quoted..." value={rfi.notes || ""} onChange={e => setRfiField(v.id, "notes", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: FILES & LINKS ── */}
          {tab === "files" && <WorkspaceFilesTab ws={ws} wsVendors={wsVendors} save={save} isMobile={isMobile} labelStyle={labelStyle} inputStyle={inputStyle} />}

          {/* ── TAB: BUSINESS CASE ── */}
          {tab === "case" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                  Auto-generated from your project context, scorecard, and ROI inputs. Export as a text file to paste into a PowerPoint or email.
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                <button style={{ ...S.navCta, fontFamily: "inherit" }} onClick={exportBusinessCase}>📄 Export PDF</button>
              </div>
              </div>

              {/* Summary cards */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
                {[
                  ["Vendors evaluated", wsVendors.length || "—"],
                  ["Est. annual savings", annualSavings > 0 ? `$${Math.round(annualSavings / 1000)}k` : "—"],
                  ["Payback period", paybackMonths ? `${paybackMonths}mo` : "—"],
                  ["Top vendor", vendorScores[0]?.total > 0 ? vendorScores[0].vendor.name : "—"],
                ].map(([l, v]) => (
                  <div key={l} style={{ background: "#0d1526", borderRadius: 10, padding: 14, border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b", marginBottom: 4 }}>{v}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Business case preview */}
              <div style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 20, fontFamily: "monospace", fontSize: 12, color: "#64748b", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
{`AUTOMATION EVALUATION — BUSINESS CASE
Project: ${ws.projectName || "(name your project)"}
Generated: ${new Date().toLocaleDateString()}

── PROJECT CONTEXT ───────────────────
Facility: ${ws.facilityType} · ${ws.facilitySqft ? ws.facilitySqft + " sqft" : "size TBD"}
Throughput: ${ws.throughputTarget || "TBD"}
Systems: ${ws.currentWMS || "TBD"}
Type: ${ws.projectType} · Budget: ${ws.budgetRange} · Timeline: ${ws.timeline}

Problem:
${ws.problemStatement || "(add in Project Context tab)"}

Success criteria:
${ws.successCriteria || "(add in Project Context tab)"}

── VENDORS EVALUATED ─────────────────
${wsVendors.length ? wsVendors.map(v => `• ${v.name} (${v.category}) — ${v.price_range || "pricing TBD"}`).join("\n") : "(add vendors in Vendors tab)"}

── SCORECARD RANKINGS ────────────────
${vendorScores.some(v => v.total > 0) ? vendorScores.filter(v => v.total > 0).map((vs, i) => `#${i + 1} ${vs.vendor.name} — ${vs.total}% score`).join("\n") : "(score vendors in Scorecard tab)"}

── ROI ANALYSIS ──────────────────────
Annual labor cost: $${Math.round(annualLaborCost).toLocaleString() || "—"}
Est. annual savings: $${Math.round(annualSavings).toLocaleString() || "—"}
Investment: $${budgetMid.toLocaleString()} (midpoint of ${ws.budgetRange})
Payback: ${paybackMonths ? "~" + paybackMonths + " months" : "complete ROI inputs"}
3-yr NPV: ${npv3yr ? "$" + npv3yr.toLocaleString() : "—"}

── RFI STATUS ────────────────────────
${wsVendors.length ? wsVendors.map(v => { const rfi = ws.rfis[v.id] || {}; return `• ${v.name}: ${rfi.responseStatus || "Not contacted"}${rfi.demoDate ? " | Demo: " + rfi.demoDate : ""}`; }).join("\n") : "(track outreach in RFI Tracker tab)"}

── RECOMMENDATION ────────────────────
${vendorScores[0]?.total > 0 ? `Based on scorecard: ${vendorScores[0].vendor.name} (${vendorScores[0].total}%)` : "Complete scorecard to generate"}

Generated by OpEx Scout — opexscout.com`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MethodologyPage({ setPage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 28px" }}>
      <button style={S.backBtn} onClick={() => setPage('home')}><ArrowLeft /> Back</button>
      <div style={S.heroEyebrow}>Methodology</div>
      <div style={S.listTitle}>How OpEx Scout builds vendor profiles</div>
      <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9, marginBottom: 28 }}>
        OpEx Scout is independent — we don't take payment from vendors to influence rankings, hide weaknesses, or manufacture reviews. Here's exactly how the data on this site is created and where it comes from.
      </p>

      <div style={{ ...S.sideCard, marginBottom: 16 }}>
        <div style={S.sideCardTitle}>Where vendor data comes from</div>
        <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>
          Profiles are built from a combination of public-source research, vendor websites, MODEX and ProMat exhibitor materials, customer case studies published by the vendor, public earnings calls and product launches, and direct practitioner observations from automation deployments. When a vendor claims their listing, they can correct, expand, or add additional product detail.
        </div>
      </div>

      <div style={{ ...S.sideCard, marginBottom: 16 }}>
        <div style={S.sideCardTitle}>How pricing tiers are determined</div>
        <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>
          Pricing tiers ($, $$, $$$, $$$$, RaaS) are estimates based on industry research, RFP responses we've reviewed, and conversations with practitioners. They're meant as directional guidance for budget planning — not vendor quotes. Always validate exact pricing directly with the vendor based on your specific scope, integration requirements, and volume.
        </div>
      </div>

      <div style={{ ...S.sideCard, marginBottom: 16 }}>
        <div style={S.sideCardTitle}>How strengths and weaknesses are written</div>
        <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>
          Strengths and watch-outs reflect what we've seen in industry research, deployment patterns, and public practitioner discussions. They're directional — meaning the right starting points for evaluation, not absolute truths. Every operation is different. A weakness for one buyer may be irrelevant for another. Use the watch-outs to build better RFI questions, not to disqualify vendors.
        </div>
      </div>

      <div style={{ ...S.sideCard, marginBottom: 16 }}>
        <div style={S.sideCardTitle}>How reviews work</div>
        <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>
          OpEx Scout does not fabricate reviews. Until verified practitioner reviews are submitted for a vendor, that vendor's review tab will show "Be the first to review." When practitioners do submit reviews, we verify the submitter has relevant operational experience before publishing. Reviewers can choose to remain anonymous on the public site.
        </div>
      </div>

      <div style={{ ...S.sideCard, marginBottom: 16 }}>
        <div style={S.sideCardTitle}>How the Find Solution wizard ranks vendors</div>
        <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>
          The wizard scores vendors against your inputs using: category fit (must match your use case), industry served, keyword overlap with the vendor's positioning, brownfield/greenfield experience, and budget alignment. Vendors clearly outside your stated budget range are penalized heavily. The ranking is meant to surface a starting shortlist — not replace deeper qualification.
        </div>
      </div>

      <div style={{ ...S.sideCard, marginBottom: 16 }}>
        <div style={S.sideCardTitle}>What's coming next</div>
        <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>
          Verified practitioner reviews, official vendor product imagery, real case study summaries linked from vendor sites, integration matrix between WMS/ERP/automation platforms, and editorial articles written by working IEs and operations leaders. As content expands, we'll continue making it clear what's research-based and what's verified.
        </div>
      </div>

      <div style={{ ...S.sideCard, background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.15)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b', marginBottom: 8 }}>Found something wrong?</div>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 12 }}>
          If you spot inaccurate information, missing context, or outdated details on any vendor profile, let us know. Vendors can claim and correct their listings directly. Buyers and practitioners can flag issues anytime.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ ...S.navCta, fontFamily: 'inherit' }} onClick={() => setPage('contact')}>Report an issue</button>
          <button style={{ ...S.btnSecondary, width: 'auto' }} onClick={() => setPage('list')}>Claim a vendor listing</button>
        </div>
      </div>
    </div>
  );
}

function VendorsPage({ setPage }) {
  return (
    <div style={S.listWrap}>
      <button style={S.backBtn} onClick={() => setPage('home')}><ArrowLeft /> Back</button>
      <div style={S.heroEyebrow}>Vendor program</div>
      <div style={S.listTitle}>How OpEx Scout helps automation vendors generate demand</div>
      <p style={S.listSub}>OpEx Scout is built around buyer research. Vendors can use the platform to improve discovery, enrich product pages, and capture structured RFIs from operations teams actively evaluating automation.</p>
      <div style={{ display: 'grid', gap: 14 }}>
        {[
          ['Free listing', 'Basic profile, category placement, website link, and contact routing.'],
          ['Verified listing', 'Enhanced profile with product pages, photos, videos, case studies, and stronger conversion paths.'],
          ['Featured placement', 'Priority visibility in category pages, shortlist surfacing, and premium profile presentation.'],
          ['Lead routing', 'Structured RFIs with lead metadata, source information, and vendor-specific routing.'],
        ].map(([title, desc]) => (
          <div key={title} style={S.sideCard}><div style={S.sideCardTitle}>{title}</div><div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>{desc}</div></div>
        ))}
      </div>
      <button style={{ ...S.navCta, fontFamily: 'inherit', marginTop: 20 }} onClick={() => setPage('list')}>Claim or upgrade listing</button>
    </div>
  );
}

function LeadOpsPage({ setPage }) {
  const [leads, setLeads] = useState(readLeadLog());
  const refresh = () => setLeads(readLeadLog());
  const exportCsv = () => {
    const rows = readLeadLog();
    if (!rows.length) return;
    const keys = Array.from(new Set(rows.flatMap(r => Object.keys(r))));
    const csv = [keys.join(','), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opexscout-leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  const total = leads.length;
  const rfis = leads.filter(l => l.lead_type === 'Vendor RFI').length;
  const shortlists = leads.filter(l => l.lead_type === 'Shortlist Request').length;
  const reviews = leads.filter(l => l.lead_type === 'Review Submission').length;
  return (
    <div style={S.listWrap}>
      <button style={S.backBtn} onClick={() => setPage('home')}><ArrowLeft /> Back</button>
      <div style={S.heroEyebrow}>Lead operations</div>
      <div style={S.listTitle}>Lead tracking snapshot</div>
      <p style={S.listSub}>This lightweight lead log captures structured submissions from this browser for testing. Formspree remains the primary delivery path until a full backend CRM is added.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        {[["Total submissions", total], ["Vendor RFIs", rfis], ["Shortlist requests", shortlists], ["Review submissions", reviews]].map(([l, n]) => <div key={l} style={S.metric}><div style={S.metricN}>{n}</div><div style={S.metricL}>{l}</div></div>)}
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <button style={{ ...S.btnSecondary, width: 'auto' }} onClick={refresh}>Refresh</button>
        <button style={{ ...S.navCta, fontFamily: 'inherit' }} onClick={exportCsv}>Export CSV</button>
      </div>
      <div style={S.sideCard}>
        <div style={S.sideCardTitle}>Recent submissions</div>
        {leads.length === 0 ? <div style={{ fontSize: 13, color: '#64748b' }}>No local submissions captured yet.</div> : leads.slice(0, 20).map(item => (
          <div key={item.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <div style={{ fontSize: 13, color: '#e8edf5', fontWeight: 700 }}>{item.lead_type || 'Submission'}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{item.company || item.vendor || 'Unknown company'} · {item.email || 'No email'}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{item.vendor || item.company || ''} {item.product ? `· ${item.product}` : ''}</div>
              </div>
              <div style={{ fontSize: 11, color: '#475569', textAlign: 'right' }}>{new Date(item.timestamp).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPage({ setPage }) {
  return (
    <div style={S.listWrap}>
      <button style={S.backBtn} onClick={() => setPage('home')}><ArrowLeft /> Back</button>
      <div style={S.heroEyebrow}>Contact</div>
      <div style={S.listTitle}>Get in touch</div>
      <p style={S.listSub}>Use the forms throughout the site for vendor RFIs, listing requests, and review submissions. For general inquiries, create a domain inbox such as info@opexscout.com or vendors@opexscout.com.</p>
      <div style={S.sideCard}>
        <div style={S.sideCardTitle}>Recommended inboxes</div>
        <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>info@opexscout.com<br/>vendors@opexscout.com<br/>reviews@opexscout.com</div>
      </div>
    </div>
  );
}

function LegalPage({ setPage, type }) {
  const map = {
    privacy: { title: 'Privacy Policy', body: 'OpEx Scout collects form-submission data for routing requests, responding to inquiries, and improving the platform. During the MVP stage, submissions may be delivered through third-party tools such as Formspree and stored in a lightweight lead log for testing.' },
    terms: { title: 'Terms of Use', body: 'Vendor profiles, product details, and practitioner notes are provided for informational purposes only. Buyers should validate all technical, commercial, and operational claims directly with the vendor before making a purchasing decision.' },
  };
  const content = map[type] || map.privacy;
  return (
    <div style={S.listWrap}>
      <button style={S.backBtn} onClick={() => setPage('home')}><ArrowLeft /> Back</button>
      <div style={S.heroEyebrow}>Legal</div>
      <div style={S.listTitle}>{content.title}</div>
      <div style={S.sideCard}><div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.9 }}>{content.body}</div></div>
    </div>
  );
}

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    try {
      await submitLeadForm({ email }, { lead_type: "Email Signup", _subject: `OpEx Scout Email Signup — ${email}` });
      setSent(true);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #0d1a35 0%, #0f1c30 100%)", borderTop: "1px solid rgba(245,158,11,0.15)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "36px 32px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Stay current</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#e8edf5", letterSpacing: "-0.3px", marginBottom: 8 }}>New vendor profiles, weekly</div>
        <div style={{ fontSize: 14, color: "#64748b", marginBottom: 20, lineHeight: 1.6 }}>
          We add new vendor profiles, product specs, and practitioner notes every week. Get the update in your inbox.
        </div>
        {sent ? (
          <div style={{ fontSize: 15, color: "#22c55e", fontWeight: 600 }}>✓ You're on the list. We'll send updates as profiles expand.</div>
        ) : (
          <div style={{ display: "flex", gap: 0, maxWidth: 440, margin: "0 auto", background: "#131f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
            <input
              style={{ flex: 1, background: "transparent", border: "none", padding: "13px 16px", fontSize: 14, color: "#e8edf5", outline: "none" }}
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
            />
            <button
              style={{ padding: "0 22px", background: "#f59e0b", border: "none", color: "#0b1220", fontWeight: 700, fontSize: 13, cursor: loading ? "wait" : "pointer", whiteSpace: "nowrap" }}
              onClick={submit}
              disabled={loading}
            >
              {loading ? "..." : "Get updates"}
            </button>
          </div>
        )}
        <div style={{ fontSize: 11, color: "#334155", marginTop: 10 }}>No spam. Unsubscribe anytime.</div>
      </div>
    </div>
  );
}

function SiteFooter({ setPage }) {
  return (
    <div style={{ background: '#0d1526', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 32px', marginTop: 36 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#e8edf5' }}>OpEx<span style={{ color: '#f59e0b' }}>Scout</span></div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 8, maxWidth: 420 }}>Automation vendor intelligence for warehouse, manufacturing, and industrial teams.</div>
        </div>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 12, color: '#94a3b8' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => setPage('shortlists')}>Workspace</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setPage('methodology')}>Methodology</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setPage('reviews')}>Submit review</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setPage('vendors')}>Vendor program</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setPage('contact')}>Contact</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setPage('privacy')}>Privacy</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setPage('terms')}>Terms</span>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
function MediaOpsPage({ setPage }) {
  const all = Object.entries(allProducts).flatMap(([slug, items]) => {
    const vendor = vendors.find(v => v.slug === slug);
    return items.map(product => ({ product, vendor }));
  });
  const missing = all.filter(({ product }) => getMediaStatus(product).label !== "Media complete");
  const complete = all.length - missing.length;
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px" }}>
      <button style={S.backBtn} onClick={() => setPage("home")}><ArrowLeft /> Back</button>
      <div style={S.heroEyebrow}>Media operations</div>
      <div style={S.listTitle}>Product media tracker</div>
      <p style={S.listSub}>Use this page to see which product profiles still need official images, catalogs, spec sheets, or vendor-submitted media. This is the practical checklist for making OpEx Scout look production-grade.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[["Products", all.length], ["Media complete", complete], ["Needs work", missing.length], ["With video", all.filter(x => x.product.youtube_id).length]].map(([l, n]) => (
          <div key={l} style={S.metric}><div style={S.metricN}>{n}</div><div style={S.metricL}>{l}</div></div>
        ))}
      </div>
      <div style={S.sideCard}>
        <div style={S.sideCardTitle}>Priority media queue</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {missing.slice(0, 60).map(({ product, vendor }) => (
            <div key={product.id} style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
              <ProductImg product={product} style={{ width: "100%", aspectRatio: "16/9", objectFit: "contain", display: "block" }} />
              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#e8edf5", fontWeight: 700 }}>{product.name}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{vendor?.name || "Unknown vendor"} · {product.category}</div>
                  </div>
                  <MediaBadge product={product} />
                </div>
                <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
                  {!product.image && !product.gallery?.length && <div>• Add official image/gallery</div>}
                  {!product.specSheetUrl && !product.catalogUrl && <div>• Add spec sheet or catalog URL</div>}
                  {!product.imageSourceUrl && <div>• Add media/source attribution link</div>}
                </div>
                <a href={product.url} target="_blank" rel="noopener noreferrer" style={{ ...S.btnSecondary, display: "block", textAlign: "center", textDecoration: "none", fontSize: 12, marginTop: 12 }}>Open official page</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function ProductCompareBar({ selectedProducts, removeProduct, onCompare, onClear }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
      background: "#0d1526", borderTop: "1px solid rgba(245,158,11,0.3)",
      padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 -4px 24px rgba(0,0,0,0.4)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 13, color: "#f59e0b", fontWeight: 600 }}>Comparing {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""}</span>
        <div style={{ display: "flex", gap: 8 }}>
          {selectedProducts.map(({ product, vendorName, vendorColor, vendorLogo, product: p }) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6, background: "#131f35", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 10px" }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: vendorColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#fff" }}>{vendorLogo}</div>
              <span style={{ fontSize: 12, color: "#94a3b8", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
              <button onClick={() => removeProduct(p.id)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: "0 0 0 4px" }}>×</button>
            </div>
          ))}
          {[...Array(Math.max(0, 4 - selectedProducts.length))].map((_, i) => (
            <div key={i} style={{ width: 120, height: 32, borderRadius: 8, border: "1px dashed rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: "#334155" }}>+ add product</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onClear} style={{ padding: "8px 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#64748b", fontSize: 13, cursor: "pointer" }}>Clear</button>
        <button onClick={onCompare} disabled={selectedProducts.length < 2} style={{ padding: "8px 20px", background: selectedProducts.length < 2 ? "#1e2d45" : "#f59e0b", border: "none", borderRadius: 8, color: selectedProducts.length < 2 ? "#475569" : "#0b1220", fontSize: 13, fontWeight: 700, cursor: selectedProducts.length < 2 ? "not-allowed" : "pointer" }}>
          Compare Products ({selectedProducts.length})
        </button>
      </div>
    </div>
  );
}

function ProductComparePage({ selectedProducts, setPage, removeProduct, openDetail }) {
  if (selectedProducts.length < 2) return (
    <div style={{ textAlign: "center", padding: "80px 32px", color: "#475569" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
      <div style={{ fontSize: 16, color: "#94a3b8", marginBottom: 8 }}>Select at least 2 products to compare</div>
      <button style={{ ...S.btnSecondary, width: "auto", marginTop: 16 }} onClick={() => setPage("directory")}>Browse vendors</button>
    </div>
  );

  // Collect all spec keys across selected products
  const specKeys = [
    { label: "Vendor", fn: p => p.vendorName },
    { label: "Category", fn: p => p.product.category },
    { label: "Price range", fn: p => p.product.price_range },
    { label: "Payload", fn: p => p.product.payload },
    { label: "Reach", fn: p => p.product.reach },
    { label: "Axes", fn: p => p.product.axes },
    { label: "Speed / Rate", fn: p => p.product.speed },
    { label: "Throughput", fn: p => p.product.throughput },
    { label: "Repeatability", fn: p => p.product.repeatability },
    { label: "Navigation", fn: p => p.product.navigation },
    { label: "Battery", fn: p => p.product.battery },
    { label: "IP Rating", fn: p => p.product.ip_rating },
    { label: "Mounting", fn: p => p.product.mounting },
    { label: "Deployment", fn: p => p.product.deployment },
    { label: "Temp range", fn: p => p.product.temp_range },
    { label: "Accuracy", fn: p => p.product.accuracy },
    { label: "Storage height", fn: p => p.product.height },
    { label: "Density", fn: p => p.product.density },
    { label: "Memory", fn: p => p.product.memory },
    { label: "I/O Capacity", fn: p => p.product.io_capacity },
  ].filter(row => selectedProducts.some(p => row.fn(p) && row.fn(p) !== "N/A" && row.fn(p) !== null));

  const highlightBest = (key, values) => {
    // For payload/reach/throughput/speed — higher is usually better
    const higherBetter = ["Payload", "Reach", "Throughput", "Speed / Rate"];
    if (!higherBetter.includes(key)) return values.map(() => false);
    const nums = values.map(v => {
      if (!v) return -1;
      const m = String(v).match(/[\d,.]+/);
      return m ? parseFloat(m[0].replace(",", "")) : -1;
    });
    const max = Math.max(...nums);
    return nums.map(n => n === max && max > -1);
  };

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px" }}>
        <button style={S.backBtn} onClick={() => setPage("directory")}><ArrowLeft /> Back to directory</button>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#e8edf5", letterSpacing: "-0.3px", marginBottom: 6 }}>Product comparison</div>
        <div style={{ fontSize: 13, color: "#475569", marginBottom: 28 }}>{selectedProducts.length} products selected · Click any product to view full detail</div>

        {/* Product headers */}
        <div style={{ display: "grid", gridTemplateColumns: `180px repeat(${selectedProducts.length}, 1fr)`, gap: 0, marginBottom: 0 }}>
          <div />
          {selectedProducts.map(({ product: p, vendorName, vendorColor, vendorLogo, vendorSlug }) => (
            <div key={p.id} style={{ background: "#0f1c30", border: "1px solid rgba(255,255,255,0.07)", borderBottom: "none", borderRadius: "12px 12px 0 0", padding: "16px", margin: "0 4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: vendorColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{vendorLogo}</div>
                <span style={{ fontSize: 11, color: "#475569" }}>{vendorName}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e8edf5", marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 10 }}>{p.category}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => removeProduct(p.id)} style={{ flex: 1, padding: "5px 0", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#475569", fontSize: 11, cursor: "pointer" }}>Remove</button>
                <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "5px 0", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, color: "#f59e0b", fontSize: 11, cursor: "pointer", textAlign: "center", textDecoration: "none" }}>Vendor site</a>
              </div>
            </div>
          ))}
        </div>

        {/* Spec rows */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ ...S.compareTable, borderCollapse: "separate", borderSpacing: "4px 0" }}>
            <tbody>
              {specKeys.map(row => {
                const values = selectedProducts.map(p => row.fn(p));
                const best = highlightBest(row.label, values);
                return (
                  <tr key={row.label}>
                    <td style={{ ...S.compareTd, fontWeight: 600, color: "#475569", fontSize: 12, width: 180, background: "#0d1526", borderRadius: 0 }}>{row.label}</td>
                    {values.map((v, i) => (
                      <td key={i} style={{ ...S.compareTd, background: best[i] ? "rgba(34,197,94,0.06)" : "#0f1c30", border: "1px solid rgba(255,255,255,0.06)" }}>
                        {row.label === "Price range" ? (
                          <PriceBadge tier={v} />
                        ) : (
                          <>
                            <span style={{ fontSize: 13, color: best[i] ? "#22c55e" : "#94a3b8", fontWeight: best[i] ? 600 : 400 }}>
                              {v && v !== "N/A" && v !== null ? String(v) : <span style={{ color: "#334155" }}>—</span>}
                            </span>
                            {best[i] && <span style={{ fontSize: 10, color: "#22c55e", marginLeft: 6, fontWeight: 600 }}>▲ highest</span>}
                          </>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Highlights row */}
              <tr>
                <td style={{ ...S.compareTd, fontWeight: 600, color: "#475569", fontSize: 12, background: "#0d1526" }}>Key highlights</td>
                {selectedProducts.map(({ product: p }, i) => (
                  <td key={i} style={{ ...S.compareTd, background: "#0f1c30", verticalAlign: "top" }}>
                    {p.highlights ? p.highlights.map((h, j) => (
                      <div key={j} style={{ fontSize: 11, color: "#64748b", marginBottom: 5 }}>
                        <span style={{ color: "#f59e0b" }}>✓ </span>{h}
                      </div>
                    )) : <span style={{ color: "#334155" }}>—</span>}
                  </td>
                ))}
              </tr>

              {/* Applications row */}
              <tr>
                <td style={{ ...S.compareTd, fontWeight: 600, color: "#475569", fontSize: 12, background: "#0d1526" }}>Applications</td>
                {selectedProducts.map(({ product: p }, i) => (
                  <td key={i} style={{ ...S.compareTd, background: "#0f1c30" }}>
                    <div style={S.tags}>
                      {p.applications ? p.applications.map(a => <span key={a} style={S.tag}>{a}</span>) : <span style={{ color: "#334155" }}>—</span>}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Variants row */}
              <tr>
                <td style={{ ...S.compareTd, fontWeight: 600, color: "#475569", fontSize: 12, background: "#0d1526" }}>Variants</td>
                {selectedProducts.map(({ product: p }, i) => (
                  <td key={i} style={{ ...S.compareTd, background: "#0f1c30" }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>{p.variants ? p.variants.join(" · ") : "—"}</span>
                  </td>
                ))}
              </tr>

              {/* Video row */}
              <tr>
                <td style={{ ...S.compareTd, fontWeight: 600, color: "#475569", fontSize: 12, background: "#0d1526", verticalAlign: "top", paddingTop: 20 }}>Product video</td>
                {selectedProducts.map(({ product: p }, i) => (
                  <td key={i} style={{ ...S.compareTd, background: "#0f1c30", padding: 12 }}>
                    {(p.youtube_id || p.videoUrl) ? (
                      <a href={p.videoUrl || `https://www.youtube.com/watch?v=${p.youtube_id}`} target="_blank" rel="noopener noreferrer" style={{ ...S.btnSecondary, display: "block", textAlign: "center", textDecoration: "none", fontSize: 12 }}>▶ Watch demo</a>
                    ) : <span style={{ fontSize: 12, color: "#334155" }}>No video available</span>}
                  </td>
                ))}
              </tr>

              {/* CTA row */}
              <tr>
                <td style={{ ...S.compareTd, background: "#0d1526" }} />
                {selectedProducts.map(({ product: p }, i) => (
                  <td key={i} style={{ ...S.compareTd, background: "#0f1c30" }}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ ...S.btnPrimary, display: "block", textAlign: "center", textDecoration: "none", fontSize: 12, padding: "8px 12px" }}>
                      View on vendor site →
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, rawSetPage] = useState("home");
  const [detailVendor, setDetailVendor] = useState(null);
  const [detailBack, setDetailBack] = useState({ page: "directory", label: "directory" });
  const [selected, setSelected] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categoryPageCategory, setCategoryPageCategory] = useState(categories[0]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [initialSearch, setInitialSearch] = useState("");
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);
  const [matrixCategory, setMatrixCategory] = useState("AMR / Mobile Robots");

  const pageTitles = {
    home: "OpEx Scout — Automation Vendor Intelligence",
    directory: "Vendor Directory — OpEx Scout",
    categories: "Browse by Category — OpEx Scout",
    solution: "Find a Solution — OpEx Scout",
    compare: "Compare Vendors — OpEx Scout",
    "product-compare": "Compare Products — OpEx Scout",
    reviews: "Submit a Review — OpEx Scout",
    matrix: "Compare Matrix — OpEx Scout",
    shortlists: "My Shortlists — OpEx Scout",
    workspace: "Evaluation Workspace — OpEx Scout",
    list: "List Your Company — OpEx Scout",
    about: "About — OpEx Scout",
    methodology: "Methodology — OpEx Scout",
  };

  // Navigate with scroll-to-top and browser history
  const navigate = (nextPage) => {
    rawSetPage(nextPage);
    window.scrollTo({ top: 0, behavior: "auto" });
    window.history.pushState({ page: nextPage }, "", `#${nextPage}`);
    document.title = pageTitles[nextPage] || "OpEx Scout";
  };

  // Browser back/forward button support + deep-link URL detection
  useEffect(() => {
    const hash = window.location.hash;
    const shortlistMatch = hash.match(/^#shortlist\/([a-z0-9]+)$/);
    const vendorMatch = hash.match(/^#vendor\/([a-z0-9-]+)$/);
    const knownPages = Object.keys(pageTitles).concat(["vendors", "lead-ops", "media-ops", "contact", "privacy", "terms"]);
    const plainPage = hash.replace(/^#/, "");

    if (shortlistMatch) {
      const id = shortlistMatch[1];
      const list = getShortlistById(id);
      if (list) {
        setSelected(list.vendorIds || []);
        rawSetPage("compare");
        window.history.replaceState({ page: "compare" }, "", hash);
      } else {
        rawSetPage("shortlists");
        window.history.replaceState({ page: "shortlists" }, "", "#shortlists");
      }
    } else if (vendorMatch) {
      const v = vendors.find(x => x.slug === vendorMatch[1]);
      if (v) {
        setDetailVendor(v);
        setDetailBack({ page: "directory", label: "directory" });
        rawSetPage("detail");
        window.history.replaceState({ page: "detail", slug: v.slug }, "", hash);
        document.title = `${v.name} — OpEx Scout`;
        addRecentlyViewed(v.id);
      } else {
        rawSetPage("directory");
        window.history.replaceState({ page: "directory" }, "", "#directory");
      }
    } else if (plainPage && knownPages.includes(plainPage)) {
      rawSetPage(plainPage);
      window.history.replaceState({ page: plainPage }, "", hash);
      document.title = pageTitles[plainPage] || "OpEx Scout";
    } else {
      window.history.replaceState({ page: "home" }, "", "#home");
    }

    const onPop = (e) => {
      const state = e.state || {};
      const nextPage = state.page || "home";
      if (nextPage === "detail" && state.slug) {
        const v = vendors.find(x => x.slug === state.slug);
        if (v) setDetailVendor(v);
      }
      rawSetPage(nextPage);
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const addProductToCompare = (product, vendor) => {
    if (selectedProducts.length >= 4) return;
    if (selectedProducts.find(p => p.product.id === product.id)) return;
    setSelectedProducts(prev => [...prev, { product, vendorName: vendor.name, vendorSlug: vendor.slug, vendorColor: vendor.color, vendorLogo: vendor.logo }]);
  };
  const removeProductFromCompare = (productId) => setSelectedProducts(prev => prev.filter(p => p.product.id !== productId));

  // Open vendor detail with back context + slug URL
  const openDetail = (vendor, fromPage, fromLabel) => {
    setDetailVendor(vendor);
    setDetailBack({ page: fromPage || "directory", label: fromLabel || "directory" });
    rawSetPage("detail");
    window.scrollTo({ top: 0, behavior: "auto" });
    window.history.pushState({ page: "detail", slug: vendor.slug }, "", `#vendor/${vendor.slug}`);
    document.title = `${vendor.name} — OpEx Scout`;
    addRecentlyViewed(vendor.id);
  };

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <NavBar page={page} setPage={navigate} />
      {page === "home" && <HomePage setPage={navigate} setCategoryFilter={setCategoryFilter} setCategoryPageCategory={setCategoryPageCategory} openDetail={openDetail} setInitialSearch={setInitialSearch} setMatrixCategory={setMatrixCategory} />}
      {page === "directory" && <DirectoryPage setPage={navigate} openDetail={openDetail} selected={selected} setSelected={setSelected} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} initialSearch={initialSearch} setInitialSearch={setInitialSearch} activeWorkspaceId={activeWorkspaceId} onAddToWorkspace={activeWorkspaceId ? (ids) => { const ws = getWorkspace(activeWorkspaceId); updateWorkspace(activeWorkspaceId, { vendorIds: [...new Set([...(ws?.vendorIds || []), ...ids])] }); setSelected([]); } : null} setMatrixCategory={setMatrixCategory} />}
      {page === "categories" && <CategoryHubPage setPage={navigate} setCategoryFilter={setCategoryFilter} openDetail={openDetail} categoryPageCategory={categoryPageCategory} setCategoryPageCategory={setCategoryPageCategory} addProductToCompare={addProductToCompare} selectedProducts={selectedProducts} setMatrixCategory={setMatrixCategory} />}
      {page === "solution" && <SolutionPage setPage={navigate} openDetail={openDetail} setCategoryFilter={setCategoryFilter} addProductToCompare={addProductToCompare} selectedProducts={selectedProducts} />}
      {page === "detail" && <DetailPage vendor={detailVendor} setPage={navigate} selected={selected} setSelected={setSelected} addProductToCompare={addProductToCompare} selectedProducts={selectedProducts} detailBackPage={detailBack.page} detailBackLabel={detailBack.label} openDetail={openDetail} />}
      {page === "compare" && <ComparePage selected={selected} setPage={navigate} openDetail={openDetail} />}
      {page === "product-compare" && <ProductComparePage selectedProducts={selectedProducts} setPage={navigate} removeProduct={removeProductFromCompare} openDetail={openDetail} />}
      {page === "list" && <ListPage setPage={navigate} />}
      {page === "shortlists" && <ShortlistsPage setPage={navigate} setSelected={setSelected} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} openDetail={openDetail} setActiveWorkspaceId={setActiveWorkspaceId} />}
      {page === "workspace" && <WorkspacePage setPage={navigate} openDetail={openDetail} wsId={activeWorkspaceId} />}
      {page === "vendors" && <VendorsPage setPage={navigate} />}
      {page === "matrix" && <CategoryMatrixPage setPage={navigate} openDetail={openDetail} initialCategory={matrixCategory} />}
      {page === "methodology" && <MethodologyPage setPage={navigate} />}
      {page === "about" && <AboutPage setPage={navigate} />}
      {page === "reviews" && <ReviewPage setPage={navigate} />}
      {page === "lead-ops" && <LeadOpsPage setPage={navigate} />}
      {page === "media-ops" && <MediaOpsPage setPage={navigate} />}
      {page === "contact" && <ContactPage setPage={navigate} />}
      {page === "privacy" && <LegalPage setPage={navigate} type="privacy" />}
      {page === "terms" && <LegalPage setPage={navigate} type="terms" />}
      {selectedProducts.length > 0 && page !== "product-compare" && (
        <ProductCompareBar selectedProducts={selectedProducts} removeProduct={removeProductFromCompare} onCompare={() => navigate("product-compare")} onClear={() => setSelectedProducts([])} />
      )}
      <EmailCapture />
      <SiteFooter setPage={navigate} />
    </div>
  );
}
