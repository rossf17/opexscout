export const categoryLandscape = {
  "AMR / Mobile Robots": {
    mature: "Goods-to-person and cart-following AMRs for order picking, replenishment, and inter-zone transport are proven at scale — hundreds of facilities run fleets of 20-200+ units with sub-12-month paybacks in high-volume DCs. Fleet orchestration, dynamic traffic management, and charging automation are all commodity capabilities now, not differentiators.",
    emerging: "AMRs handling unstructured, high-mix piece picking (as opposed to case/tote transport) are improving fast but still need engineered environments and curated SKU sets to hit throughput targets. Mixed human/robot aisle-sharing at high density is workable but requires real layout and safety engineering, not just a vendor demo.",
    gaps: "Fully autonomous, unstructured piece-pick-and-place across arbitrary SKU geometries — the 'robot that replaces a picker entirely, anywhere' — does not exist in production at scale despite marketing claims. Robots handling irregular, deformable, or poly-bagged items reliably without human backup remain a research problem, not a buyable product.",
  },
  "Depalletizing & Palletizing": {
    mature: "Robotic case palletizing and depalletizing with vision-guided pick, for regular case geometries (cartons, totes, trays) at fixed or semi-fixed SKUs, is a mature, well-understood category with dozens of proven integrators and OEM cells. Mixed-case palletizing with known SKU masters and layer-pattern software is standard equipment.",
    emerging: "True mixed-SKU, mixed-size depalletizing straight off a truck or from an unsorted pallet — with no prior layer plan — is advancing quickly with better bin-picking vision but still runs at lower cycle rates and needs fallback exception handling for damaged or unusual packaging.",
    gaps: "Fully general depalletizing of arbitrary, unknown, non-rigid, or heavily damaged loads with zero human intervention and full-speed throughput is not commercially available. Vendors demoing this on a curated set of boxes at a trade show are not showing you what happens with shrink-wrap failures, crushed cartons, or SKU mix outside the training set.",
  },
  "Conveyor & Sortation": {
    mature: "Fixed conveyor, cross-belt and tilt-tray sortation, and high-speed sliding-shoe sorters are decades-mature technology with well-known throughput, footprint, and reliability characteristics. Integration with WMS/WCS for zone routing and induction is standard, well-documented engineering.",
    emerging: "Modular, reconfigurable conveyor and mobile sortation systems that can be redeployed as SKU mix or facility layout changes are gaining real traction, trading some throughput ceiling for flexibility — a legitimate option for facilities expecting to change footprint within a few years.",
    gaps: "'Self-reconfiguring' or software-defined conveyor that adapts its physical layout without manual reinstallation is marketing language, not a shipping product — every reconfigurable system still requires a physical rebuild event, just a faster one than legacy fixed conveyor.",
  },
  "Dock Automation": {
    mature: "Automated trailer loading/unloading for regular case and tote freight, dock scheduling software, and yard management systems are proven, with real ROI data from multi-site deployments. Telescopic conveyor and extendable belt systems for manual-assist loading are mature and widely deployed.",
    emerging: "Fully automated trailer loading that handles mixed-size, mixed-weight freight without pre-sorted staging is improving but still typically needs a curated freight profile and a fallback manual lane for exceptions — evaluate real customer references, not pilot-site numbers.",
    gaps: "Universal automated loading/unloading that handles arbitrary floor-loaded, non-conveyable, or irregularly stacked freight with no human on the dock does not exist in production. Any vendor claiming 'works with any trailer, any freight' has not actually deployed that claim at a reference site — ask for the site and call them.",
  },
  "WMS Platforms": {
    mature: "Tier-1 WMS platforms (Manhattan, Blue Yonder, SAP EWM, and comparable) are mature, proven at massive scale, and handle standard inbound/outbound, wave planning, and inventory accuracy workflows reliably. Mid-market and cloud-native WMS options are equally mature for facilities under a few hundred thousand SKU-locations.",
    emerging: "AI-assisted slotting, dynamic wave optimization, and native robotics/AMR orchestration built into the WMS core (rather than bolted on via middleware) are real but vary widely in maturity by vendor — test the specific module against your SKU velocity distribution, not the vendor's generic case study.",
    gaps: "A WMS that fully self-optimizes labor, slotting, and equipment allocation with no human tuning — 'autonomous warehouse operations' as a complete replacement for an industrial engineer — is not a real, deployed capability. Every mature WMS deployment still requires ongoing IE and ops tuning to hold performance.",
  },
  "Controls & Sensing": {
    mature: "PLC-based controls, industrial sensors (photoeyes, barcode/RFID readers, weight scales), and SCADA/HMI layers for material handling equipment are extremely mature — this is the most standardized layer of the automation stack, with well-known integrators and long equipment lifecycles.",
    emerging: "Edge-computing controllers that fuse multiple sensor types (vision + weight + barcode) for real-time exception detection and predictive maintenance are increasingly viable, but integration complexity and total cost of ownership vary a lot by vendor — pilot before committing plant-wide.",
    gaps: "Fully self-diagnosing, self-healing controls systems that eliminate the need for a controls engineer on staff or on retainer are not real. Predictive maintenance claims should be validated against actual failure-prediction accuracy at a reference site, not a vendor's internal lab data.",
  },
  "Labor Management": {
    mature: "Engineered labor standards, time-and-attendance, and labor management systems (LMS) with individual and team productivity tracking against pre-built or custom standards are mature and widely deployed, including UKG and comparable platforms with deep WMS integration.",
    emerging: "AI-driven dynamic labor standards that adjust in near-real-time to conditions (congestion, SKU mix, fatigue modeling) are emerging with credible data from early adopters, but the underlying engineered-standard methodology still needs a real industrial engineer to validate, not just software output.",
    gaps: "'Fully automated labor optimization' that removes the need for engineered standards, floor supervision, or IE oversight is not a real product — every credible LMS vendor will tell you it augments, not replaces, labor management practice.",
  },
  "AS/RS & Storage": {
    mature: "Unit-load and mini-load AS/RS (crane-based, shuttle-based) for structured, high-density storage with known SKU dimensions is a decades-mature category with strong reliability and throughput data. Vertical lift modules and carousels for small-parts storage are equally mature and widely proven.",
    emerging: "Cube-based, grid-and-robot storage systems (shuttle-in-a-grid architectures) are proving out well for high-SKU-count, medium-velocity fulfillment operations, though total installed base and long-term reliability data is thinner than crane-based AS/RS — ask for 5+ year uptime data, not just year-one numbers.",
    gaps: "AS/RS that stores and retrieves arbitrary, non-uniform, or poorly packaged items without any bin/tote standardization does not exist — every AS/RS architecture on the market requires some degree of unit-load standardization to function, regardless of vendor claims about 'handling anything.'",
  },
  "Industrial Robotics": {
    mature: "Six-axis and SCARA industrial arms for welding, machine tending, assembly, and pick-and-place with fixed or lightly-varying part presentation are the most mature category in this entire market — decades of installed base, well-known integrators, and predictable ROI models.",
    emerging: "Force-controlled and vision-guided arms for higher-variance assembly and finishing tasks, and collaborative robots (cobots) working alongside people without full guarding, are increasingly viable for lower-volume, higher-mix production, though cycle times still trail dedicated hard automation.",
    gaps: "General-purpose robotic manipulation that adapts to arbitrary part variation without task-specific programming or fixturing — 'the robot that can do any job on the line' — is not a shipping industrial product. Every real deployment still requires part-specific engineering, tooling, and programming.",
  },
  "Manufacturing Automation": {
    mature: "Dedicated hard automation (indexing tables, transfer lines, fixed tooling) and MES/production-tracking software for high-volume, low-mix manufacturing are mature and well-proven across automotive, CPG, and industrial sectors with decades of reliability data.",
    emerging: "Flexible manufacturing cells that reconfigure for mixed-model production with reduced changeover time are real and improving, but total changeover time and the engineering effort to add a new variant still vary a lot by vendor — get changeover time data from a reference customer running your actual product mix.",
    gaps: "Fully flexible, 'lights-out' manufacturing that adapts to arbitrary new product introductions with zero re-engineering is not a real, deployed capability outside narrow, well-funded showcase lines. Assume real engineering effort for every new SKU or product variant, regardless of vendor claims.",
  },
  "AGV Systems": {
    mature: "Wire-guided, magnetic-tape, and laser-guided AGVs for fixed, repeatable tow, tugger, and unit-load transport routes are extremely mature with decades of reliability data — this is a well-understood, low-risk category for repetitive point-to-point material movement.",
    emerging: "Vision- and SLAM-guided AGVs that navigate without fixed infrastructure (blending into AMR territory) are increasingly capable for semi-structured routes, offering easier redeployment than wire-guided systems at a moderate cost premium.",
    gaps: "AGVs that safely operate in fully dynamic, unstructured environments shared with unrestricted pedestrian and vehicle traffic at industrial-line speed without dedicated pathways or safety zoning do not exist as a certifiable, insurable product — every real deployment still requires defined pathways or speed/zone controls.",
  },
  "Simulation & Digital Twin": {
    mature: "Discrete-event simulation for throughput validation, layout testing, and equipment sizing before capital commitment is mature, well-proven software with decades of use in facility design — this is standard practice for any project above a few million dollars in capex.",
    emerging: "Live digital twins that ingest real-time WMS/WCS/sensor data to continuously validate against the simulated model (rather than a one-time pre-build simulation) are gaining adoption, but the data-integration effort to keep a twin synced with live operations is nontrivial and vendor-dependent.",
    gaps: "A digital twin that autonomously re-optimizes physical operations in real time with no human review — closing the loop from simulation to floor changes automatically — is not a real, deployed capability. Every credible digital twin today is a decision-support tool, not an autonomous controller.",
  },
  "Vision & AI": {
    mature: "Machine vision for barcode/label reading, dimensioning, quality inspection against known defect classes, and fixed-position part verification is mature, reliable, and widely deployed across warehousing and manufacturing.",
    emerging: "AI-based vision for bin-picking, damage detection on varied packaging, and open-vocabulary object recognition is advancing quickly and usable in production for many applications, but accuracy still depends heavily on training data coverage — pilot against your actual SKU photos, not the vendor's demo set.",
    gaps: "Vision/AI systems that reliably generalize to entirely novel object classes or conditions with no retraining or tuning — 'true zero-shot' recognition at production accuracy — is not yet a dependable, buyable capability. Budget for an ongoing model-tuning relationship with any vision vendor, not a one-time install.",
  },
  "Systems Integration": {
    mature: "Turnkey integration of conveyor, robotics, WMS/WCS, and controls into a single commissioned system is a mature service capability with many established, bondable integrators who have delivered multi-million-dollar projects on comparable timelines and budgets.",
    emerging: "Integrators offering software-first, modular integration layers (standardized APIs/middleware across multiple equipment OEMs, rather than fully custom point-to-point controls code) are reducing vendor lock-in and speeding up future changes, though the middleware layer itself adds a component to maintain.",
    gaps: "An integrator that can guarantee a fully automated, self-commissioning system with no on-site engineering, tuning, or ramp period is not a realistic claim — every real large-scale integration project includes a commissioning and ramp phase measured in weeks to months, regardless of what the SOW summary says.",
  },
};
