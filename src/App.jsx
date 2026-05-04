import { useState, useMemo } from "react";
import { vendors, categories, industries } from "./data/vendors";

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

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  // Layout
  app: { fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh", background: "#0b1220", color: "#e8edf5" },
  // Nav
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 60, background: "#0d1526", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 },
  logo: { fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", cursor: "pointer" },
  logoAccent: { color: "#f59e0b" },
  navLinks: { display: "flex", gap: 28, fontSize: 13, color: "#94a3b8" },
  navLink: { cursor: "pointer", transition: "color 0.15s" },
  navCta: { padding: "8px 18px", background: "#f59e0b", color: "#0b1220", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" },
  // Hero
  hero: { padding: "72px 32px 56px", textAlign: "center", background: "linear-gradient(180deg, #0d1a35 0%, #0b1220 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  heroEyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", color: "#f59e0b", textTransform: "uppercase", marginBottom: 16 },
  heroH1: { fontSize: 48, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 16, background: "linear-gradient(135deg, #e8edf5 0%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { fontSize: 17, color: "#64748b", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 },
  searchWrap: { maxWidth: 620, margin: "0 auto 20px", display: "flex", background: "#131f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden" },
  searchInput: { flex: 1, background: "transparent", border: "none", padding: "14px 18px", fontSize: 14, color: "#e8edf5", outline: "none" },
  searchSelect: { background: "#1a2a45", border: "none", borderLeft: "1px solid rgba(255,255,255,0.08)", padding: "0 14px", fontSize: 13, color: "#94a3b8", outline: "none", cursor: "pointer" },
  searchBtn: { padding: "0 24px", background: "#f59e0b", border: "none", color: "#0b1220", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  chips: { display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" },
  chip: { padding: "6px 14px", borderRadius: 20, fontSize: 12, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "#94a3b8", background: "transparent", transition: "all 0.15s" },
  chipActive: { background: "#f59e0b", color: "#0b1220", border: "1px solid #f59e0b", fontWeight: 600 },
  // Stats bar
  statsBar: { display: "flex", justifyContent: "center", gap: 48, padding: "20px 32px", background: "#0d1526", borderBottom: "1px solid rgba(255,255,255,0.06)" },
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
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
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
  detailWrap: { maxWidth: 1100, margin: "0 auto", padding: "32px 28px" },
  backBtn: { display: "inline-flex", alignItems: "center", gap: 6, color: "#f59e0b", fontSize: 13, cursor: "pointer", marginBottom: 28, background: "none", border: "none", fontFamily: "inherit" },
  detailHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, gap: 20 },
  detailName: { fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6, color: "#e8edf5" },
  detailSub: { fontSize: 14, color: "#475569", marginBottom: 14 },
  detailBody: { display: "grid", gridTemplateColumns: "1fr 300px", gap: 28 },
  detailMain: { background: "#0f1c30", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" },
  detailSide: { display: "flex", flexDirection: "column", gap: 16 },
  tabs: { display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)" },
  tab: { padding: "14px 20px", fontSize: 13, cursor: "pointer", color: "#475569", borderBottom: "2px solid transparent", transition: "all 0.15s" },
  tabActive: { color: "#f59e0b", borderBottomColor: "#f59e0b", fontWeight: 600 },
  tabContent: { padding: 24 },
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
  section: { maxWidth: 1100, margin: "0 auto", padding: "56px 32px" },
  sectionTitle: { fontSize: 24, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 8, color: "#e8edf5" },
  sectionSub: { fontSize: 14, color: "#475569", marginBottom: 32 },
  // List vendor page
  listWrap: { maxWidth: 680, margin: "0 auto", padding: "48px 28px" },
  listTitle: { fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 8, color: "#e8edf5" },
  listSub: { fontSize: 14, color: "#475569", marginBottom: 32, lineHeight: 1.7 },
  pricingGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 },
  pricingCard: { background: "#0f1c30", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", padding: 20, textAlign: "center" },
  pricingCardFeatured: { borderColor: "rgba(245,158,11,0.4)", background: "#151f35" },
  pricingTier: { fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 },
  pricingPrice: { fontSize: 22, fontWeight: 800, color: "#e8edf5", marginBottom: 4 },
  pricingDesc: { fontSize: 12, color: "#475569" },
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span style={S.rating}>
      <StarIcon /> {rating.toFixed(1)}
    </span>
  );
}

function VendorCard({ vendor, selected, onSelect, onClick, compareCount }) {
  return (
    <div
      style={{ ...S.card, ...(vendor.featured ? S.cardFeatured : {}), ...(selected ? S.cardSelected : {}), boxShadow: selected ? "0 0 0 2px #f59e0b" : "none" }}
      onClick={onClick}
    >
      {vendor.featured && <div style={S.featuredBadge}>FEATURED</div>}
      <div style={{ ...S.logoCircle, background: vendor.color }}>{vendor.logo}</div>
      <div style={S.cardName}>{vendor.name}</div>
      <div style={S.cardTagline}>{vendor.tagline}</div>
      <div style={S.tags}>
        {vendor.tags.slice(0, 3).map(t => <span key={t} style={S.tag}>{t}</span>)}
      </div>
      <div style={S.cardFooter}>
        <Stars rating={vendor.rating} />
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
  return (
    <nav style={S.nav}>
      <div style={S.logo} onClick={() => setPage("home")}>
        OpEx<span style={S.logoAccent}>Scout</span>
      </div>
      <div style={S.navLinks}>
        {[["directory", "Directory"], ["compare", "Compare Tools"], ["about", "For Vendors"]].map(([p, label]) => (
          <span key={p} style={{ ...S.navLink, color: page === p ? "#e8edf5" : "#64748b" }} onClick={() => setPage(p)}>{label}</span>
        ))}
      </div>
      <button style={S.navCta} onClick={() => setPage("list")}>List Your Company</button>
    </nav>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────
function HomePage({ setPage, setCategoryFilter }) {
  const catCounts = categories.map(c => ({ name: c, count: vendors.filter(v => v.category === c).length }));
  const featured = vendors.filter(v => v.featured);

  const catIcons = ["🤖", "📦", "🔄", "🚛", "💻", "📡", "👷", "🏗️", "⚙️", "🏭"];

  return (
    <div>
      <div style={S.hero}>
        <div style={S.heroEyebrow}>The Independent Resource for Automation Professionals</div>
        <h1 style={S.heroH1}>Find the right automation<br />vendor for your operation</h1>
        <p style={S.heroSub}>Search, compare, and connect with vendors across warehouse, DC, and manufacturing automation — built by practitioners, for practitioners.</p>
        <div style={S.searchWrap}>
          <input style={S.searchInput} placeholder="Search vendors, technologies, applications..." onKeyDown={e => { if (e.key === "Enter") setPage("directory"); }} />
          <select style={S.searchSelect}>
            <option>All categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <button style={S.searchBtn} onClick={() => setPage("directory")}>Search</button>
        </div>
        <div style={S.chips}>
          {["AMR", "Depalletizing", "WMS", "Controls", "Manufacturing"].map(c => (
            <div key={c} style={S.chip} onClick={() => { setCategoryFilter(c); setPage("directory"); }}>{c}</div>
          ))}
        </div>
      </div>

      <div style={S.statsBar}>
        {[["20+", "Vendors Listed"], ["10", "Categories"], ["12", "Industries"], ["Free", "To Search"]].map(([n, l]) => (
          <div key={l} style={S.statItem}><div style={S.statN}>{n}</div><div style={S.statL}>{l}</div></div>
        ))}
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Browse by category</div>
        <div style={{ ...S.sectionSub }}>From AMRs to WMS platforms, find vendors across every automation discipline</div>
        <div style={S.catGrid}>
          {catCounts.map((c, i) => (
            <div key={c.name} style={S.catCard} onClick={() => { setCategoryFilter(c.name); setPage("directory"); }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; e.currentTarget.style.background = "#131f35"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "#0f1c30"; }}>
              <div style={{ fontSize: 28 }}>{catIcons[i]}</div>
              <div style={S.catName}>{c.name}</div>
              <div style={S.catCount}>{c.count} vendor{c.count !== 1 ? "s" : ""}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#0d1526", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.section}>
          <div style={S.sectionTitle}>Featured vendors</div>
          <div style={S.sectionSub}>Verified profiles with full specs, reviews, and direct contact</div>
          <div style={S.grid}>
            {featured.map(v => (
              <VendorCard key={v.id} vendor={v} selected={false} onSelect={() => {}} onClick={() => {}} compareCount={0} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button style={{ ...S.btnSecondary, width: "auto", padding: "10px 28px" }} onClick={() => setPage("directory")}>View all vendors →</button>
          </div>
        </div>
      </div>

      <div style={S.section}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <div style={S.heroEyebrow}>For Vendors</div>
            <div style={S.sectionTitle}>Reach the buyers who matter</div>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 24 }}>
              OpEx Scout's audience is operations engineers, IEs, and supply chain leaders actively evaluating automation investments. Get your product in front of the right people at the right time.
            </p>
            <button style={{ ...S.navCta, fontFamily: "inherit" }} onClick={() => setPage("list")}>List your company →</button>
          </div>
          <div style={S.pricingGrid}>
            {[["Free", "Basic profile", "Basic listing"], ["$999/mo", "Featured listing", "Featured"], ["$1,999/mo", "Verified + leads", "Verified"]].map(([price, desc, tier], i) => (
              <div key={tier} style={{ ...S.pricingCard, ...(i === 1 ? S.pricingCardFeatured : {}) }}>
                <div style={S.pricingTier}>{tier}</div>
                <div style={S.pricingPrice}>{price}</div>
                <div style={S.pricingDesc}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#0d1526", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px 32px", textAlign: "center", fontSize: 12, color: "#334155" }}>
        © 2026 OpEx Scout · Built by practitioners, for practitioners · opexscout.com
      </div>
    </div>
  );
}

function DirectoryPage({ setPage, setDetailVendor, selected, setSelected, categoryFilter, setCategoryFilter }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState(categoryFilter || "");
  const [indFilter, setIndFilter] = useState("");
  const [view, setView] = useState("grid");

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

  const openDetail = (v) => { setDetailVendor(v); setPage("detail"); };

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

      <div style={{ padding: "20px 28px" }}>
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
              <VendorCard key={v.id} vendor={v} selected={selected.includes(v.id)} onSelect={toggleSelect} onClick={() => openDetail(v)} compareCount={selected.length} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(v => (
              <div key={v.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 16 }} onClick={() => openDetail(v)}>
                <div style={{ ...S.logoCircle, background: v.color, marginBottom: 0, flexShrink: 0 }}>{v.logo}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={S.cardName}>{v.name}</span>
                    {v.featured && <span style={{ ...S.featuredBadge, position: "static" }}>FEATURED</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{v.category} · {v.hq}</div>
                </div>
                <Stars rating={v.rating} />
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

function DetailPage({ vendor, setPage, selected, setSelected }) {
  const [tab, setTab] = useState("overview");
  const [rfiSent, setRfiSent] = useState(false);

  if (!vendor) return null;

  const isSelected = selected.includes(vendor.id);
  const toggleCompare = () => {
    if (isSelected) setSelected(s => s.filter(x => x !== vendor.id));
    else if (selected.length < 4) setSelected(s => [...s, vendor.id]);
  };

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div style={S.detailWrap}>
        <button style={S.backBtn} onClick={() => setPage("directory")}><ArrowLeft /> Back to directory</button>

        <div style={S.detailHeader}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ ...S.logoCircle, background: vendor.color, width: 56, height: 56, fontSize: 16, marginBottom: 0 }}>{vendor.logo}</div>
            <div>
              <div style={S.detailName}>{vendor.name}</div>
              <div style={S.detailSub}>{vendor.category} · {vendor.hq} · Founded {vendor.founded}</div>
              <div style={S.tags}>{vendor.tags.map(t => <span key={t} style={S.tag}>{t}</span>)}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <button style={{ ...S.btnSecondary, width: "auto", padding: "9px 18px" }} onClick={toggleCompare}>
              {isSelected ? "✓ Added" : "+ Compare"}
            </button>
            <button style={{ ...S.btnPrimary, width: "auto", padding: "9px 18px" }} onClick={() => document.getElementById("rfi-form")?.scrollIntoView({ behavior: "smooth" })}>
              Request Info
            </button>
          </div>
        </div>

        <div style={S.detailBody}>
          <div style={S.detailMain}>
            <div style={S.tabs}>
              {[["overview", "Overview"], ["specs", "Specs & Capabilities"], ["reviews", "Reviews"], ["cases", "Case Studies"]].map(([t, label]) => (
                <div key={t} style={{ ...S.tab, ...(tab === t ? S.tabActive : {}) }} onClick={() => setTab(t)}>{label}</div>
              ))}
            </div>
            <div style={S.tabContent}>
              {tab === "overview" && (
                <>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 24 }}>{vendor.desc}</p>
                  <div style={S.metricRow}>
                    {[["Founded", vendor.founded], ["Installs", vendor.installs], ["Employees", vendor.employees], ["Rating", `${vendor.rating}/5`]].map(([l, n]) => (
                      <div key={l} style={S.metric}><div style={S.metricN}>{n}</div><div style={S.metricL}>{l}</div></div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Industries Served</div>
                  <div style={{ ...S.tags, marginBottom: 20 }}>{vendor.industry.map(i => <span key={i} style={S.tag}>{i}</span>)}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>WMS / System Integrations</div>
                  <div style={S.tags}>{vendor.integrations.map(i => <span key={i} style={S.tag}>{i}</span>)}</div>
                </>
              )}
              {tab === "specs" && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Technical Specifications</div>
                  <div style={S.specGrid}>
                    {vendor.specs.map(s => (
                      <div key={s.l} style={S.specItem}>
                        <div style={S.specLabel}>{s.l}</div>
                        <div style={S.specVal}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {tab === "reviews" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ fontSize: 40, fontWeight: 800, color: "#f59e0b" }}>{vendor.rating.toFixed(1)}</div>
                    <div>
                      <Stars rating={vendor.rating} />
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{vendor.reviews} verified reviews</div>
                    </div>
                  </div>
                  {vendor.reviews_data.map((r, i) => (
                    <div key={i} style={S.review}>
                      <div style={S.reviewHead}>
                        <span style={S.reviewAuthor}>{r.author}</span>
                        <span style={S.reviewRating}><StarIcon /> {r.rating.toFixed(1)}</span>
                      </div>
                      <div style={S.reviewText}>{r.text}</div>
                    </div>
                  ))}
                </>
              )}
              {tab === "cases" && (
                <>
                  {[
                    { title: "Fortune 500 Retailer — RDC Automation", badge: "Verified", body: `Deployed ${vendor.name} solution across 4 DCs in a brownfield environment. Achieved target throughput with 99%+ uptime over 18 months. Integration with existing WMS completed within 8 weeks of go-live.` },
                    { title: "Regional 3PL — Fulfillment Operation", badge: "", body: `Replaced manual processes with ${vendor.name} technology. Labor productivity improvement tracked to 28% in the first operating year. Payback period trending ahead of business case projections.` },
                  ].map((c, i) => (
                    <div key={i} style={{ ...S.review, borderLeft: i === 0 ? "3px solid #f59e0b" : "none", borderRadius: i === 0 ? "0 10px 10px 0" : 10 }}>
                      <div style={S.reviewHead}>
                        <span style={S.reviewAuthor}>{c.title}</span>
                        {c.badge && <span style={{ ...S.featuredBadge, position: "static" }}>{c.badge}</span>}
                      </div>
                      <div style={S.reviewText}>{c.body}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div style={S.detailSide}>
            <div style={S.sideCard}>
              <div style={S.sideCardTitle}>Contact</div>
              <div style={S.contactRow}><GlobeIcon /><span style={{ color: "#f59e0b" }}>{vendor.website}</span></div>
              <div style={S.contactRow}><PhoneIcon />{vendor.phone}</div>
              <div style={S.contactRow}><BuildingIcon />{vendor.hq}</div>
            </div>

            <div style={{ ...S.sideCard }} id="rfi-form">
              <div style={S.sideCardTitle}>Submit RFI to {vendor.name}</div>
              {rfiSent ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "#f59e0b" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>RFI Submitted</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>Expect a response within 1–2 business days</div>
                </div>
              ) : (
                <>
                  <label style={S.rfiLabel}>Name</label>
                  <input style={S.rfiInput} placeholder="Jane Smith" />
                  <label style={S.rfiLabel}>Company</label>
                  <input style={S.rfiInput} placeholder="Acme Logistics" />
                  <label style={S.rfiLabel}>Email</label>
                  <input style={S.rfiInput} placeholder="jane@acme.com" type="email" />
                  <label style={S.rfiLabel}>Project type</label>
                  <select style={S.rfiInput}>
                    <option>New DC / greenfield build</option>
                    <option>Brownfield retrofit</option>
                    <option>Capacity expansion</option>
                    <option>Vendor replacement</option>
                    <option>Feasibility study</option>
                    <option>Manufacturing automation</option>
                  </select>
                  <label style={S.rfiLabel}>Brief description</label>
                  <textarea style={{ ...S.rfiInput, minHeight: 80, resize: "vertical" }} placeholder="Describe your application, throughput needs, timeline..." />
                  <button style={S.btnPrimary} onClick={() => setRfiSent(true)}>Submit RFI</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparePage({ selected, setPage, setDetailVendor }) {
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
    { label: "Rating", fn: v => `${v.rating}/5 (${v.reviews} reviews)` },
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
                <th key={v.id} style={{ ...S.compareTh, cursor: "pointer" }} onClick={() => { setDetailVendor(v); setPage("detail"); }}>
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
              <td style={S.compareTd} />
              {sel.map(v => (
                <td key={v.id} style={S.compareTd}>
                  <button style={{ ...S.btnPrimary, fontSize: 12, padding: "7px 14px" }} onClick={() => { setDetailVendor(v); setPage("detail"); }}>View full profile</button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ListPage({ setPage }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={S.listWrap}>
      <button style={S.backBtn} onClick={() => setPage("home")}><ArrowLeft /> Back</button>
      <div style={S.heroEyebrow}>For Vendors</div>
      <div style={S.listTitle}>List your company on OpEx Scout</div>
      <p style={S.listSub}>Get your product in front of IEs, operations engineers, and supply chain leaders actively evaluating automation solutions. Our audience makes capital investment decisions — not interns doing research.</p>

      <div style={S.pricingGrid}>
        {[
          { tier: "Free", price: "Free", desc: "Basic vendor profile, directory listing, contact info", featured: false },
          { tier: "Featured", price: "$999/mo", desc: "Priority placement, enhanced profile, case studies, video", featured: true },
          { tier: "Verified", price: "$1,999/mo", desc: "All featured benefits + qualified RFI lead gen", featured: false },
        ].map(p => (
          <div key={p.tier} style={{ ...S.pricingCard, ...(p.featured ? S.pricingCardFeatured : {}) }}>
            {p.featured && <div style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700, marginBottom: 6 }}>MOST POPULAR</div>}
            <div style={S.pricingTier}>{p.tier}</div>
            <div style={S.pricingPrice}>{p.price}</div>
            <div style={S.pricingDesc}>{p.desc}</div>
          </div>
        ))}
      </div>

      {submitted ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#f59e0b" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Request received</div>
          <div style={{ fontSize: 13, color: "#475569" }}>We'll be in touch within 1–2 business days to get you listed.</div>
        </div>
      ) : (
        <>
          <label style={S.rfiLabel}>Company name *</label>
          <input style={S.rfiInput} placeholder="Acme Robotics" />
          <label style={S.rfiLabel}>Primary category *</label>
          <select style={S.rfiInput}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <label style={S.rfiLabel}>Industries served</label>
          <select multiple style={{ ...S.rfiInput, minHeight: 80 }}>
            {industries.map(i => <option key={i}>{i}</option>)}
          </select>
          <label style={S.rfiLabel}>Website *</label>
          <input style={S.rfiInput} placeholder="https://acmerobotics.com" />
          <label style={S.rfiLabel}>Contact email *</label>
          <input style={S.rfiInput} placeholder="sales@acmerobotics.com" type="email" />
          <label style={S.rfiLabel}>Listing tier</label>
          <select style={S.rfiInput}>
            <option>Free — basic profile</option>
            <option>Featured — $999/month</option>
            <option>Verified — $1,999/month</option>
          </select>
          <label style={S.rfiLabel}>Tell us about your product</label>
          <textarea style={{ ...S.rfiInput, minHeight: 100, resize: "vertical" }} placeholder="What does your product do? Who is the ideal customer? Key differentiators vs. competition..." />
          <button style={S.btnPrimary} onClick={() => setSubmitted(true)}>Submit listing request</button>
        </>
      )}
    </div>
  );
}

function AboutPage({ setPage }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 28px" }}>
      <div style={S.heroEyebrow}>About</div>
      <div style={S.listTitle}>Built by practitioners, for practitioners</div>
      <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9, marginBottom: 20 }}>
        OpEx Scout is the independent resource for warehouse, DC, and manufacturing automation professionals. We aggregate vendor information, real user reviews, and technical specs so operations engineers and supply chain leaders can make better capital decisions.
      </p>
      <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9, marginBottom: 32 }}>
        Built by an Industrial Engineer with hands-on experience implementing AMRs, depalletizers, and controls systems across brownfield distribution environments. We speak the language because we've lived it.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button style={{ ...S.navCta, fontFamily: "inherit" }} onClick={() => setPage("list")}>List your company</button>
        <button style={{ ...S.btnSecondary, width: "auto" }} onClick={() => setPage("directory")}>Browse directory</button>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [detailVendor, setDetailVendor] = useState(null);
  const [selected, setSelected] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <NavBar page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} setCategoryFilter={setCategoryFilter} />}
      {page === "directory" && <DirectoryPage setPage={setPage} setDetailVendor={setDetailVendor} selected={selected} setSelected={setSelected} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />}
      {page === "detail" && <DetailPage vendor={detailVendor} setPage={setPage} selected={selected} setSelected={setSelected} />}
      {page === "compare" && <ComparePage selected={selected} setPage={setPage} setDetailVendor={setDetailVendor} />}
      {page === "list" && <ListPage setPage={setPage} />}
      {page === "about" && <AboutPage setPage={setPage} />}
    </div>
  );
}
