//v2
import { useState, useMemo, useEffect } from "react";
import { vendors, categories, industries } from "./data/vendors";
import { products as allProducts } from "./data/products";

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
  logo: { fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", cursor: "pointer" },
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
  compareWrap: { maxWidth: 1100, margin: "0 auto", padding: "32px 28px" },
  compareTable: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
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
    Boolean(vendor?.reviews_data?.length >= 1),
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
  return (
    <div
      data-vendor-card
      style={{ ...S.card, ...(vendor.featured ? S.cardFeatured : {}), ...(selected ? S.cardSelected : {}), boxShadow: selected ? "0 0 0 2px #f59e0b" : "none", transition: "all 0.18s ease" }}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div style={{ ...S.logoCircle, background: vendor.color, marginBottom: 0 }}>{vendor.logo}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
          {vendor.featured && <span style={{ fontSize: 10, fontWeight: 800, color: "#f59e0b", letterSpacing: "0.08em" }}>FEATURED</span>}
          <ProfileScoreBadge vendor={vendor} />
        </div>
      </div>
      <div style={S.cardName}>{vendor.name}</div>
      <div style={S.cardTagline}>{vendor.tagline}</div>
      <div style={S.tags}>
        {vendor.tags.slice(0, 3).map(t => <span key={t} style={S.tag}>{t}</span>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div style={{ background: "#0d1526", borderRadius: 8, padding: "8px 10px" }}>
          <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>Products</div>
          <div style={{ fontSize: 13, color: "#e8edf5", fontWeight: 700 }}>{profile.productCount || "Pending"}</div>
        </div>
        <div style={{ background: "#0d1526", borderRadius: 8, padding: "8px 10px" }}>
          <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>Price range</div>
          <div style={{ fontSize: 12, color: vendor.price_range ? "#94a3b8" : "#334155", fontWeight: 700 }}>{vendor.price_range || "—"}</div>
        </div>
      </div>
      <div style={S.cardFooter}>
        <span style={{ fontSize: 12, color: "#475569" }}>{vendor.category}</span>
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
    ["categories", "Categories"],
    ["solution", "Find Solution"],
    ["compare", "Compare"],
    ["reviews", "Reviews"],
    ["about", "About"],
  ];
  return (
    <nav style={S.nav}>
      <div style={S.logo} onClick={() => { setPage("home"); setMenuOpen(false); }}>
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
        {!isMobile && <button style={S.navCta} onClick={() => setPage("list")}>Claim Listing</button>}
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
function HomePage({ setPage, setCategoryFilter, setCategoryPageCategory, openDetail, setInitialSearch }) {
  const isMobile = useIsMobile();
  const catCounts = categories.map(c => ({ name: c, count: vendors.filter(v => v.category === c).length }));
  const featured = vendors.filter(v => v.featured).slice(0, 3);
  const catIcons = ["🤖", "📦", "🔄", "🚛", "💻", "📡", "👷", "🏗️", "⚙️", "🏭", "🚚", "📊", "👁️", "🧩"];

  return (
    <div>
      <div style={S.hero}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 999, padding: "8px 14px", marginBottom: 18, fontSize: 12, color: "#f8c56a", fontWeight: 600 }}>
            Early-access buyer platform · profiles are expanding weekly
          </div>
          <div style={S.heroEyebrow}>Independent automation vendor intelligence</div>
          <h1 style={S.heroH1}>Compare automation vendors like a buyer, not a booth visitor</h1>
          <p style={S.heroSub}>OpEx Scout helps warehouse, manufacturing, and industrial teams research vendors, review products, compare fit, and submit qualified RFIs from one place.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20, flexWrap: "wrap", padding: "0 16px" }}>
            <button style={{ ...S.navCta, padding: "12px 22px", fontFamily: "inherit" }} onClick={() => setPage("solution")}>Find a solution</button>
            <button style={{ ...S.btnSecondary, width: "auto", padding: "12px 22px" }} onClick={() => setPage("directory")}>Browse directory</button>
            <button style={{ ...S.btnSecondary, width: "auto", padding: "12px 22px" }} onClick={() => setPage("list")}>List your company</button>
          </div>
          <div style={S.searchWrap}>
            <input
              style={S.searchInput}
              placeholder="Search vendors, products, categories, or use cases..."
              id="hero-search"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  setInitialSearch(e.target.value);
                  setPage("directory");
                }
              }}
            />
            <select style={S.searchSelect}>
              <option>All categories</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <button style={S.searchBtn} onClick={() => {
              const val = document.getElementById("hero-search")?.value || "";
              setInitialSearch(val);
              setPage("directory");
            }}>Search</button>
          </div>
          <div style={S.chips}>
            {['AMR / Mobile Robots', 'Depalletizing & Palletizing', 'WMS Platforms', 'Conveyor & Sortation', 'Industrial Robotics'].map(c => (
              <div key={c} style={S.chip} onClick={() => { setCategoryFilter(c); setPage("directory"); }}>{c}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={S.statsBar}>
        {[[`${vendors.length}+`, "Vendors listed"], [`${categories.length}`, "Categories"], [`${industries.length}`, "Industries"], ["Live", "RFI routing"]].map(([n, l]) => (
          <div key={l} style={S.statItem}><div style={S.statN}>{n}</div><div style={S.statL}>{l}</div></div>
        ))}
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>How OpEx Scout helps buyers</div>
        <div style={S.sectionSub}>Built to help engineering and operations teams screen vendors faster before engaging a sales cycle.</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
          {[
            ["Browse by category", "Filter vendors by technology, industry, and use case."],
            ["Review products", "See product pages, videos, specs, and practical fit notes."],
            ["Generate a shortlist", "Use the solution wizard to build a buyer-ready shortlist."],
          ].map(([title, desc]) => (
            <div key={title} style={{ background: "#0f1c30", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e8edf5", marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Browse by category</div>
        <div style={{ ...S.sectionSub }}>Research the solutions most relevant to your operation.</div>
        <div style={S.catGrid}>
          {catCounts.map((c, i) => (
            <div key={c.name} style={S.catCard} onClick={() => { setCategoryPageCategory(c.name); setCategoryFilter(c.name); setPage("categories"); }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; e.currentTarget.style.background = "#131f35"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "#0f1c30"; }}>
              <div style={{ fontSize: 28 }}>{catIcons[i] || '⚙️'}</div>
              <div style={S.catName}>{c.name}</div>
              <div style={S.catCount}>{c.count} vendor{c.count !== 1 ? "s" : ""}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#0d1526", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.section}>
          <div style={S.sectionTitle}>Featured vendor profiles</div>
          <div style={S.sectionSub}>Profiles include buyer-fit notes, product pages, videos, and direct RFI routing.</div>
          <div style={S.grid}>
            {featured.map(v => (
              <VendorCard key={v.id} vendor={v} selected={false} onSelect={() => {}} onClick={() => openDetail(v, "home", "home")} compareCount={0} />
            ))}
          </div>
        </div>
      </div>

      <div style={S.section}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr", gap: 28, alignItems: "start" }}>
          <div>
            <div style={S.heroEyebrow}>For vendors</div>
            <div style={S.sectionTitle}>Sponsor visibility and capture qualified buyer intent</div>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 18 }}>
              Vendors can claim listings, enrich product pages, route RFIs, and participate in featured category placements. OpEx Scout is designed to help buyers research first — then convert that research into qualified introductions.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={{ ...S.navCta, fontFamily: "inherit" }} onClick={() => setPage("list")}>Claim your listing</button>
              <button style={{ ...S.btnSecondary, width: "auto" }} onClick={() => setPage("vendors")}>Vendor program</button>
            </div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              ["Free profile", "Basic company page, category listing, website link, and contact routing."],
              ["Verified plan", "Enhanced profile, product pages, videos, case studies, and better conversion."],
              ["Featured visibility", "Category placement, shortlist visibility, and higher-intent lead flow."],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: "#0f1c30", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e8edf5", marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectoryPage({ setPage, openDetail, selected, setSelected, categoryFilter, setCategoryFilter, initialSearch, setInitialSearch }) {
  const [search, setSearch] = useState(initialSearch || "");
  const [catFilter, setCatFilter] = useState(categoryFilter || "");
  const [indFilter, setIndFilter] = useState("");
  const [view, setView] = useState("grid");

  // Consume initialSearch once on mount
  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
      setInitialSearch("");
    }
  }, []);

  const filtered = useMemo(() => vendors.filter(v => {
    const q = search.toLowerCase();
    const matchQ = !q || v.name.toLowerCase().includes(q) || v.tagline.toLowerCase().includes(q) || v.tags.some(t => t.toLowerCase().includes(q));
    const matchCat = !catFilter || v.category === catFilter || v.tags.some(t => t.toLowerCase().includes(catFilter.toLowerCase()));
    const matchInd = !indFilter || v.industry.includes(indFilter);
    return matchQ && matchCat && matchInd;
  }), [search, catFilter, indFilter]);

  const toggleSelect = (id, checked) => {
    if (checked) setSelected(s => [...s, id]);
    else setSelected(s => s.filter(x => x !== id));
  };

  const openDetailLocal = (v) => openDetail(v, "directory", "directory");

  return (
    <div>
      <div style={{ padding: "20px 28px 0", background: "#0d1526", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", background: "#0b1220", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "0 14px", display: "flex", alignItems: "center", color: "#475569" }}><SearchIcon /></div>
            <input style={{ flex: 1, background: "transparent", border: "none", padding: "11px 0", fontSize: 13, color: "#e8edf5", outline: "none" }} placeholder="Search vendors, technologies, applications..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select style={{ ...S.rfiInput, marginBottom: 0, width: "auto", padding: "11px 14px" }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="">All categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select style={{ ...S.rfiInput, marginBottom: 0, width: "auto", padding: "11px 14px" }} value={indFilter} onChange={e => setIndFilter(e.target.value)}>
            <option value="">All industries</option>
            {industries.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div style={S.chips}>
          {["", ...categories.slice(0, 6)].map((c, i) => (
            <div key={i} style={{ ...S.chip, ...(catFilter === c ? S.chipActive : {}) }} onClick={() => setCatFilter(c)}>{c || "All"}</div>
          ))}
        </div>
        <div style={{ height: 16 }} />
      </div>

      <div style={{ padding: "16px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
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
          <span style={S.resultCount}>Showing <strong style={{ color: "#94a3b8" }}>{filtered.length}</strong> vendor{filtered.length !== 1 ? "s" : ""}</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[["grid", <GridIcon />], ["list", <ListIcon />]].map(([v, icon]) => (
              <button key={v} style={{ padding: "6px 10px", background: view === v ? "#1a2a45" : "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, cursor: "pointer", color: view === v ? "#e8edf5" : "#475569" }} onClick={() => setView(v)}>{icon}</button>
            ))}
          </div>
        </div>

        {view === "grid" ? (
          <div style={S.grid}>
            {filtered.map(v => (
              <VendorCard key={v.id} vendor={v} selected={selected.includes(v.id)} onSelect={toggleSelect} onClick={() => openDetailLocal(v)} compareCount={selected.length} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(v => (
              <div key={v.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 16 }} onClick={() => openDetailLocal(v)}>
                <div style={{ ...S.logoCircle, background: v.color, marginBottom: 0, flexShrink: 0 }}>{v.logo}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={S.cardName}>{v.name}</span>
                    {v.featured && <span style={{ ...S.featuredBadge, position: "static" }}>FEATURED</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{v.category} · {v.hq}</div>
                </div>
                <div style={{ fontSize: 12, color: "#475569" }}>{v.category} · {v.hq}</div>
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
                <div style={S.tags}>{vendor.tags.map(t => <span key={t} style={S.tag}>{t}</span>)}</div>
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
                        <div><strong style={{ color: '#e8edf5' }}>Typical deployment:</strong> {playbook.deployment}</div>
                        <div><strong style={{ color: '#e8edf5' }}>ROI pattern:</strong> {playbook.roi}</div>
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
                  <div style={{ background: '#0d1526', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#e8edf5', marginBottom: 8 }}>Be the first to review {vendor.name}</div>
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 16, maxWidth: 460, margin: '0 auto 20px' }}>
                      OpEx Scout publishes practitioner reviews from operations professionals who have actually deployed and worked with vendor solutions. We don't fabricate ratings — every review is from a verified practitioner with relevant experience.
                    </div>
                    <button style={{ ...S.btnPrimary, width: 'auto', padding: '10px 22px' }} onClick={() => setPage('reviews')}>Submit a review</button>
                  </div>
                  <div style={{ marginTop: 20, padding: 14, background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: 10, fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>
                    <strong style={{ color: '#f59e0b' }}>Why no reviews yet?</strong> OpEx Scout is in early access. Rather than synthesize fake reviews, we're building a verified practitioner review program. If you've deployed a {vendor.name} solution, sharing your experience helps other operators make better decisions.
                  </div>
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
              <div style={S.contactRow}><GlobeIcon /><span style={{ color: '#f59e0b' }}>{vendor.website}</span></div>
              <div style={S.contactRow}><PhoneIcon />{vendor.phone}</div>
              <div style={S.contactRow}><BuildingIcon />{vendor.hq}</div>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ ...S.logoCircle, background: v.color, width: 26, height: 26, fontSize: 10, marginBottom: 0 }}>{v.logo}</div>
                      <div>
                        <div style={{ fontSize: 13, color: '#e8edf5', fontWeight: 600 }}>{v.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{v.category}</div>
                      </div>
                    </div>
                    <button style={{ ...S.btnSecondary, marginTop: 10, fontSize: 11, padding: '6px 10px' }} onClick={(e) => { e.stopPropagation(); openDetail(v, 'detail', vendor.name); }}>View profile</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ ...S.sideCard }} id="rfi-form">
              <div style={S.sideCardTitle}>Submit RFI to {vendor.name}</div>
              {rfiSent ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#f59e0b' }}><div style={{ fontSize: 28, marginBottom: 8 }}>✓</div><div style={{ fontSize: 14, fontWeight: 600 }}>RFI submitted</div><div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>Formspree and lead log captured this inquiry.</div></div>
              ) : (
                <>
                  <label style={S.rfiLabel}>Name *</label>
                  <input style={S.rfiInput} placeholder="Jane Smith" value={rfiData.name} onChange={e => setRfiData(d => ({ ...d, name: e.target.value }))} />
                  <label style={S.rfiLabel}>Company *</label>
                  <input style={S.rfiInput} placeholder="Acme Logistics" value={rfiData.company} onChange={e => setRfiData(d => ({ ...d, company: e.target.value }))} />
                  <label style={S.rfiLabel}>Email *</label>
                  <input style={S.rfiInput} placeholder="jane@acme.com" type="email" value={rfiData.email} onChange={e => setRfiData(d => ({ ...d, email: e.target.value }))} />
                  <label style={S.rfiLabel}>Phone</label>
                  <input style={S.rfiInput} placeholder="Optional" value={rfiData.phone} onChange={e => setRfiData(d => ({ ...d, phone: e.target.value }))} />
                  <label style={S.rfiLabel}>Budget range</label>
                  <select style={S.rfiInput} value={rfiData.budget} onChange={e => setRfiData(d => ({ ...d, budget: e.target.value }))}><option>Exploring</option><option>Under $100k</option><option>$100k–$250k</option><option>$250k–$500k</option><option>$500k+</option></select>
                  <label style={S.rfiLabel}>Timeline</label>
                  <select style={S.rfiInput} value={rfiData.timeline} onChange={e => setRfiData(d => ({ ...d, timeline: e.target.value }))}><option>0–3 months</option><option>3–6 months</option><option>6–12 months</option><option>12+ months</option></select>
                  <label style={S.rfiLabel}>Project type</label>
                  <select style={S.rfiInput} value={rfiData.project} onChange={e => setRfiData(d => ({ ...d, project: e.target.value }))}><option>New DC / greenfield build</option><option>Brownfield retrofit</option><option>Capacity expansion</option><option>Vendor replacement</option><option>Feasibility study</option><option>Manufacturing automation</option></select>
                  <label style={S.rfiLabel}>Brief description</label>
                  <textarea style={{ ...S.rfiInput, minHeight: 90, resize: 'vertical' }} placeholder="Describe your application, throughput needs, systems, and goals..." value={rfiData.description} onChange={e => setRfiData(d => ({ ...d, description: e.target.value }))} />
                  <button style={{ ...S.btnPrimary, opacity: rfiLoading ? 0.7 : 1 }} onClick={submitRfi} disabled={rfiLoading}>{rfiLoading ? 'Submitting...' : 'Submit RFI'}</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparePage({ selected, setPage, openDetail }) {
  const sel = vendors.filter(v => selected.includes(v.id));
  if (sel.length < 2) return (
    <div style={{ textAlign: "center", padding: "80px 32px", color: "#475569" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
      <div style={{ fontSize: 16, marginBottom: 8, color: "#94a3b8" }}>Select at least 2 vendors to compare</div>
      <button style={{ ...S.btnSecondary, width: "auto", marginTop: 16 }} onClick={() => setPage("directory")}>Go to directory</button>
    </div>
  );

  const rows = [
    { label: "Category", fn: v => v.category },
    { label: "HQ", fn: v => v.hq },
    { label: "Founded", fn: v => v.founded },
    { label: "Installations", fn: v => v.installs },
    { label: "Employees", fn: v => v.employees },
    { label: "Price range", fn: v => v.price_range || "N/A" },
    { label: "Industries", fn: v => v.industry.slice(0, 3).join(", ") },
    { label: "Integrations", fn: v => v.integrations.slice(0, 3).join(", ") },
  ];

  return (
    <div style={S.compareWrap}>
      <button style={S.backBtn} onClick={() => setPage("directory")}><ArrowLeft /> Back to directory</button>
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: "#e8edf5" }}>Vendor comparison</div>
      <div style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>Side-by-side view · {sel.length} vendors selected</div>

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

function CategoryHubPage({ setPage, setCategoryFilter, openDetail, categoryPageCategory, setCategoryPageCategory, addProductToCompare, selectedProducts }) {
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
        <div style={S.sideCard}>
          <div style={S.sideCardTitle}>Categories</div>
          {categories.map(c => (
            <div key={c} style={{ ...S.filterItem, color: activeCategory === c ? "#f59e0b" : "#64748b", background: activeCategory === c ? "rgba(245,158,11,0.08)" : "transparent" }} onClick={() => setCategoryPageCategory(c)}>
              <span>{c}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#475569" }}>{vendors.filter(v => v.category === c).length}</span>
            </div>
          ))}
        </div>

        <div>
          <div style={{ ...S.sideCard, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start" }}>
              <div>
                <div style={S.sectionTitle}>{activeCategory}</div>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 18 }}>{categoryCopy[activeCategory] || "Vendor and product research for this automation category."}</p>
                <div style={S.tags}>{["Vendor shortlist", "Product specs", "Buyer questions", "RFI-ready"].map(t => <span key={t} style={S.tag}>{t}</span>)}</div>
              </div>
              <button style={{ ...S.navCta, fontFamily: "inherit", whiteSpace: "nowrap" }} onClick={() => { setCategoryFilter(activeCategory); setPage("directory"); }}>Open directory</button>
            </div>
          </div>

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
            <div style={S.sideCardTitle}>Get this shortlist emailed to you</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12, lineHeight: 1.6 }}>
              We'll send you the matched vendors, fit notes, and suggested next steps for your evaluation.
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
          <span style={{ cursor: 'pointer' }} onClick={() => setPage('methodology')}>Methodology</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setPage('contact')}>Contact</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setPage('vendors')}>Vendor program</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setPage('lead-ops')}>Lead ops</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setPage('media-ops')}>Media ops</span>
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

  const pageTitles = {
    home: "OpEx Scout — Automation Vendor Intelligence",
    directory: "Vendor Directory — OpEx Scout",
    categories: "Browse by Category — OpEx Scout",
    solution: "Find a Solution — OpEx Scout",
    compare: "Compare Vendors — OpEx Scout",
    "product-compare": "Compare Products — OpEx Scout",
    reviews: "Submit a Review — OpEx Scout",
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

  // Browser back/forward button support
  useEffect(() => {
    window.history.replaceState({ page: "home" }, "", "#home");
    const onPop = (e) => {
      const state = e.state || {};
      const nextPage = state.page || "home";
      // If going back to a vendor detail, restore the vendor
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
  };

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <NavBar page={page} setPage={navigate} />
      {page === "home" && <HomePage setPage={navigate} setCategoryFilter={setCategoryFilter} setCategoryPageCategory={setCategoryPageCategory} openDetail={openDetail} setInitialSearch={setInitialSearch} />}
      {page === "directory" && <DirectoryPage setPage={navigate} openDetail={openDetail} selected={selected} setSelected={setSelected} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} initialSearch={initialSearch} setInitialSearch={setInitialSearch} />}
      {page === "categories" && <CategoryHubPage setPage={navigate} setCategoryFilter={setCategoryFilter} openDetail={openDetail} categoryPageCategory={categoryPageCategory} setCategoryPageCategory={setCategoryPageCategory} addProductToCompare={addProductToCompare} selectedProducts={selectedProducts} />}
      {page === "solution" && <SolutionPage setPage={navigate} openDetail={openDetail} setCategoryFilter={setCategoryFilter} addProductToCompare={addProductToCompare} selectedProducts={selectedProducts} />}
      {page === "detail" && <DetailPage vendor={detailVendor} setPage={navigate} selected={selected} setSelected={setSelected} addProductToCompare={addProductToCompare} selectedProducts={selectedProducts} detailBackPage={detailBack.page} detailBackLabel={detailBack.label} openDetail={openDetail} />}
      {page === "compare" && <ComparePage selected={selected} setPage={navigate} openDetail={openDetail} />}
      {page === "product-compare" && <ProductComparePage selectedProducts={selectedProducts} setPage={navigate} removeProduct={removeProductFromCompare} openDetail={openDetail} />}
      {page === "list" && <ListPage setPage={navigate} />}
      {page === "vendors" && <VendorsPage setPage={navigate} />}
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
