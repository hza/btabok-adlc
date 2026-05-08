// ─── colour tokens ────────────────────────────────────────────────────────────
export const BADGE_COLORS: Record<string, string> = {
  purple: '#7F77DD',
  teal:   '#1D9E75',
  coral:  '#D85A30',
  green:  '#639922',
  gray:   '#888780',
  amber:  '#BA7517',
};

export const BADGE_LABELS: Record<string, string> = {
  purple: 'Core',
  teal:   'Software',
  coral:  'Solution',
  green:  'Practice',
  gray:   'Multiple',
  amber:  'External',
};

export const PHASE_STYLES: Record<string, { bg: string; band: string; text: string }> = {
  innovation:     { bg: '#F8F9FA', band: '#FFDEAA', text: '#92400E' },
  strategy:       { bg: '#F8F9FA', band: '#86EFAC', text: '#14532D' },
  planning:       { bg: '#F8F9FA', band: '#93C5FD', text: '#1E3A8A' },
  transformation: { bg: '#F8F9FA', band: '#FDA4AF', text: '#881337' },
  utilize:        { bg: '#F8F9FA', band: '#C4B5FD', text: '#4C1D95' },
};

export const PHASES = ['innovation', 'strategy', 'planning', 'transformation', 'utilize'] as const;
export type Phase = typeof PHASES[number];

export const PHASE_LABEL: Record<Phase, string> = {
  innovation:     'Innovation',
  strategy:       'Strategy',
  planning:       'Planning',
  transformation: 'Transformation',
  utilize:        'Utilize',
};

// ─── data types ───────────────────────────────────────────────────────────────
export interface NodeData {
  id: string; phase: Phase; num: string; title: string; subtitle: string;
  badge: string; importancy: 1 | 2; importancyReason: string;
  note?: string; recurring?: boolean; external?: boolean;
  link?: string;
}

export function badgeColor(badge: string): string {
  switch (badge) {
    case 'BTABoK': return BADGE_COLORS.purple;
    case 'DDD':    return BADGE_COLORS.gray;
    case 'C4':     return BADGE_COLORS.amber;
    case 'OWASP':  return BADGE_COLORS.amber;
    default:       return BADGE_COLORS.gray;
  }
}
export interface EdgeData {
  id: string; from: string; to: string; label: string;
  tag?: 'input';
  importance: 1 | 2 | 3 | 4 | 5 | 6;
}

// ─── node data ────────────────────────────────────────────────────────────────
export const NODES: NodeData[] = [
  { id:'n01', phase:'innovation',     num:'01', title:'Business Model Canvas',                subtitle:'Value proposition, customers, revenue streams',                link:'https://iasa-global.github.io/btabok/business_model_canvas.html',                badge:'BTABoK', importancy:1, importancyReason:'Entry point for every engagement — without a shared business model, architecture has no anchor to value or customer outcomes'},
  { id:'n02', phase:'strategy',       num:'02', title:'Business Capability Canvas',           subtitle:'What the business does, capability hierarchy',                 link:'https://iasa-global.github.io/btabok/business_capability_canvas.html',  badge:'BTABoK', importancy:1, importancyReason:'Defines what the business does independent of how — the foundation for all capability-driven investment and architecture decisions'},
  { id:'n24', phase:'strategy',       num:'02a',title:'Capability Card',                      subtitle:'Current-state maturity heat map, gap identification',          link:'https://iasa-global.github.io/btabok/capability_card.html',  badge:'BTABoK', importancy:1, importancyReason:'Operationalises the capability map — without per-capability maturity assessment the canvas stays decorative and gaps go unaddressed', note:'BTABoK Capability Assessment — assess each capability for maturity and strategic gap'},
  { id:'n03', phase:'strategy',       num:'03', title:'Architect Stakeholder Canvas',         subtitle:'All parties, engagement levels, governance',                   link:'https://iasa-global.github.io/btabok/architect_stakeholder_canvas.html',   badge:'BTABoK', importancy:1, importancyReason:'Architecture that ignores stakeholders dies in review — mapping all parties and engagement levels is a prerequisite for governance and adoption'},
  { id:'n04', phase:'strategy',       num:'04', title:'Power-Interest Grid',                  subtitle:'2×2 prioritisation by power and interest',                     link:'https://iasa-global.github.io/btabok/power_interest_grid.html',                                                               badge:'BTABoK', importancy:1, importancyReason:'Without prioritising who can block or champion decisions, stakeholder effort is misallocated and critical sign-offs get missed'},
  { id:'n05', phase:'strategy',       num:'05', title:'Business Case (NABC Card)',            subtitle:'Need, approach, benefit, competition',                         link:'https://iasa-global.github.io/btabok/business_case_nabc_card.html',                                                                badge:'BTABoK', importancy:1, importancyReason:'Architecture without a justified business case is a technology project, not a business investment — NABC forces the value argument up front'},
  { id:'n23', phase:'strategy',       num:'05a',title:'OKR Card',                             subtitle:'Objectives & key results, measurable strategic outcomes',      link:'https://iasa-global.github.io/btabok/okr_card.html',                      badge:'BTABoK', importancy:1, importancyReason:'Value proof is a top BTABoK architect obligation — OKRs are the measurement mechanism that connects strategy to demonstrable outcomes', note:'One card per strategic objective', recurring:true},
  { id:'n25', phase:'strategy',       num:'05c',title:'Risk Methods',                         subtitle:'Risk identification, probability × impact per capability',     link:'https://iasa-global.github.io/btabok/risk_methods.html',             badge:'BTABoK', importancy:1, importancyReason:'Risk identified late becomes cost; identifying it at strategy phase keeps it as a decision input rather than an emergency response', note:'BTABoK Risk Methods — identify architecture risks early, feed into ADRs and ASRs'},
  { id:'n06', phase:'strategy',       num:'06', title:'Architecture Principles',              subtitle:'Principles from capabilities and constraints, linked to ADRs', link:'https://iasa-global.github.io/btabok/principles.html',  badge:'BTABoK', importancy:1, importancyReason:'Principles are the standing decisions that prevent every team from relitigating the same trade-offs — without them, governance is arbitrary', note:'BTABoK Principles topic — no canvas; maintain as a structured registry'},
  { id:'n07', phase:'strategy',       num:'07', title:'Layered Roadmap Canvas',               subtitle:'Current → target state, phased investment gates',              link:'https://iasa-global.github.io/btabok/layered_roadmap_canvas.html',        badge:'BTABoK', importancy:1, importancyReason:'Transforms architecture intent into funded, sequenced delivery — without it strategy remains aspirational and unbudgeted'},
  { id:'n08', phase:'planning',       num:'08', title:'Context View Card',                    subtitle:'System boundary, external actors, interfaces',                 link:'https://iasa-global.github.io/btabok/context_view_card.html',           badge:'BTABoK', importancy:1, importancyReason:'Establishes the system boundary before any design begins — misaligned scope is the most expensive planning mistake to fix later'},
  { id:'n26', phase:'planning',       num:'08a',title:'Service Blueprint Canvas',             subtitle:'Customer journey, front/back-stage systems, failure points',   link:'https://iasa-global.github.io/btabok/service_blueprint_canvas.html',      badge:'BTABoK', importancy:1, importancyReason:'Bridges customer experience to back-stage systems — the primary artifact for aligning service architecture with actual usage and failure modes', note:'One canvas per customer journey or service scenario', recurring:true},
  { id:'n09', phase:'planning',       num:'09', title:'ASR Card',                             subtitle:'Architecturally significant requirements',                     link:'https://iasa-global.github.io/btabok/asr_card.html',                     badge:'BTABoK', importancy:1, importancyReason:'ASRs are the contractual interface between business needs and architecture decisions — every ADR must trace back to one', note:'One card per architecturally significant requirement', recurring:true},
  { id:'n10', phase:'planning',       num:'10', title:'Architecture Hypothesis Canvas',       subtitle:'Assumption → experiment → success metric',                     link:'https://iasa-global.github.io/btabok/architecture_hypothesis_card.html', badge:'BTABoK', importancy:2, importancyReason:'Valuable in lean/agile contexts for validating uncertain decisions, but conditional on methodology — not every engagement runs experiments'},
  { id:'n11', phase:'planning',       num:'11', title:'QATT Card',                            subtitle:'Stimulus–response quality attribute scenarios',                link:'https://iasa-global.github.io/btabok/qatt_card.html',                    badge:'BTABoK', importancy:1, importancyReason:'Quality attributes ARE architecture — stimulus-response scenarios make NFRs testable and prevent them from being ignored until production', note:'One card per quality attribute scenario', recurring:true},
  { id:'n12', phase:'planning',       num:'12', title:'Architecture Definition Canvas',       subtitle:'Scope, principles, key decisions on one page',                 link:'https://iasa-global.github.io/btabok/architecture_definition_canvas.html', badge:'BTABoK', importancy:1, importancyReason:'Single-page alignment artifact that prevents scope creep and keeps all stakeholders working from the same architecture frame'},
  { id:'n13', phase:'planning',       num:'13', title:'Solution Design Canvas',               subtitle:'Problem → options → hypotheses',                               link:'https://iasa-global.github.io/btabok/solution_design_canvas.html',        badge:'BTABoK', importancy:1, importancyReason:'Forces structured option analysis before committing to a solution — without it, the first idea wins by default', note:'Spans Planning → Transformation continuously'},
  { id:'n14', phase:'planning',       num:'14', title:'Architecture Decision Record',         subtitle:'Options scored, chosen decision, trade-offs',                  link:'https://iasa-global.github.io/btabok/architecture_decision_record.html',                                                                                             badge:'BTABoK', importancy:1, importancyReason:'The definitive audit trail of why the architecture is the way it is — missing ADRs mean future teams reverse decisions blindly', note:'Core — new ADR for every significant decision in Planning and Transformation', recurring:true},
  { id:'n15', phase:'planning',       num:'15', title:'Architecture Decision Cascade Card',   subtitle:'Downstream ripple effects of each decision',                   link:'https://iasa-global.github.io/btabok/architecture_decision_cascade_card.html', badge:'BTABoK', importancy:2, importancyReason:'Important companion to ADR for high-impact decisions, but secondary — value scales with decision complexity rather than being universally mandatory', note:'Core — one Cascade Card per ADR, in both phases', recurring:true},
  { id:'n16', phase:'transformation', num:'16', title:'Bounded Context Canvas',               subtitle:'DDD boundaries, language, dependencies',                       link:'https://github.com/ddd-crew/bounded-context-canvas',                                                                 badge:'DDD', importancy:1, importancyReason:'Service decomposition without explicit DDD boundaries produces integration spaghetti — contexts must be named and owned before interfaces are designed', note:'One canvas per bounded context in the domain', recurring:true},
  { id:'n28', phase:'transformation', num:'16a',title:'Container / Component View (C4 L2-L3)',subtitle:'System decomposed into containers and components, responsibilities', link:'https://c4model.com/#ContainerDiagram',                               badge:'C4', importancy:1, importancyReason:'Structural decomposition is a non-negotiable viewpoint — without it, Context View jumps straight to code with no intermediate accountability', note:'BTABoK gap: structural decomposition (Views & Viewpoints) — use C4 Container + Component Diagrams; bridges Context View to service interfaces', external:true},
  { id:'n17', phase:'transformation', num:'17', title:'Service Interface Design Canvas',      subtitle:'Operations, contracts, SLAs, consumers',                       link:'https://iasa-global.github.io/btabok/service_interface_design_canvas.html',     badge:'BTABoK', importancy:1, importancyReason:'Contracts between services are the hardest things to change after deployment — explicit interface design prevents accidental coupling', note:'One canvas per service, API, or product delivered by a team', recurring:true},
  { id:'n18', phase:'transformation', num:'18', title:'Deployment / Infrastructure View',     subtitle:'Components mapped to nodes, networks, environments',           link:'https://c4model.com/#DeploymentDiagram',                                                                             badge:'C4', importancy:1, importancyReason:'Architecture exists in a physical environment — without this view, operational concerns (latency, failure domains, compliance) are invisible until production', note:'BTABoK gap: physical view (Views & Viewpoints) — use C4 Deployment or UML Deployment Diagram', external:true},
  { id:'n29', phase:'transformation', num:'18a',title:'Security Architecture View',           subtitle:'Threat model, trust zones, security controls, attack surface', link:'https://owasp.org/www-community/Threat_Modeling',                        badge:'OWASP', importancy:1, importancyReason:'Security bolted on after design is a compliance liability and a re-architecture event — threat modelling must happen at transformation phase', note:'BTABoK gap: security viewpoint — use STRIDE threat model + security zone diagram; critical for compliance and risk closure', external:true},
  { id:'n20', phase:'transformation', num:'20', title:'Sequence / Scenario View',             subtitle:'Time-ordered message flow for key use cases',                  link:'https://c4model.com/#DynamicDiagram',                                                                                badge:'C4', importancy:1, importancyReason:'Dynamic behaviour verification catches integration failures and timing assumptions before they reach production', note:'BTABoK gap: scenario view (Views & Viewpoints) — use UML Sequence or C4 Dynamic Diagram', external:true},
  { id:'n21', phase:'transformation', num:'21', title:'Technical Loan Request Card',          subtitle:'Debt as a loan: principal, interest, repayment plan',          link:'https://iasa-global.github.io/btabok/technical_loan_request_card.html',  badge:'BTABoK', importancy:1, importancyReason:'Explicit debt management is a professional obligation — treating shortcuts as loans with a repayment plan keeps architectural integrity visible to business', note:'One card per technical debt item', recurring:true},
  { id:'n22', phase:'utilize',        num:'22', title:'Benefits Realization View Canvas',     subtitle:'Decisions → enablers → measurable business benefits',          link:'https://iasa-global.github.io/btabok/benefits_realization_view_canvas.html', badge:'BTABoK', importancy:1, importancyReason:'Closes the loop between architecture decisions and business outcomes — without it, architecture value is claimed but never demonstrated' },
];

// ─── edge data ────────────────────────────────────────────────────────────────
export const EDGES: EdgeData[] = [
  { id:'e01', from:'n01', to:'n02', label:'seeds capability hierarchy',          tag:'input', importance:5 },
  { id:'e03', from:'n02', to:'n06', label:'source for principles',               tag:'input', importance:4 },
  { id:'e06', from:'n03', to:'n04', label:'populates grid',                      tag:'input', importance:2 },
  { id:'e11', from:'n05', to:'n12', label:'success criteria → definition',       tag:'input', importance:4 },
  { id:'e12', from:'n06', to:'n12', label:'principles populate definition',       tag:'input', importance:4 },
  { id:'e15', from:'n08', to:'n09', label:'interactions trigger ASRs',           tag:'input', importance:6 },
  { id:'e18', from:'n09', to:'n14', label:'ASR IDs referenced in ADR',           tag:'input', importance:6 },
  { id:'e20', from:'n10', to:'n14', label:'validated hypothesis informs ADR',    tag:'input', importance:1 },
  { id:'e22', from:'n12', to:'n13', label:'scope constrains design options',      tag:'input', importance:4 },
  { id:'e23', from:'n12', to:'n16', label:'boundary → context partitioning',      tag:'input', importance:3 },
  { id:'e25', from:'n13', to:'n14', label:'options → ADR scored columns',        tag:'input', importance:5 },
  { id:'e27', from:'n14', to:'n15', label:'spawns cascade card',                 tag:'input', importance:2 },
  { id:'e28', from:'n14', to:'n21', label:'shortcuts → loan card',               tag:'input', importance:2 },
  { id:'e30', from:'n16', to:'n17', label:'language → service operations',       tag:'input', importance:4 },
  { id:'e32', from:'n17', to:'n14', label:'service choices trigger ADR',         tag:'input', importance:4 },
  { id:'e33', from:'n17', to:'n20', label:'operations → sequence messages',      tag:'input', importance:3 },
  { id:'e36', from:'n21', to:'n22', label:'debt reduces realised benefits',      tag:'input', importance:2 },
  { id:'e37', from:'n22', to:'n07', label:'outcomes reprioritise roadmap',       tag:'input', importance:3 },
  { id:'e40', from:'n22', to:'n01', label:'lessons open new innovation cycle',   tag:'input', importance:3 },
  { id:'e43', from:'n05', to:'n06', label:'business constraints → principles',   tag:'input', importance:4 },
  { id:'e45', from:'n07', to:'n08', label:'roadmap scope → system boundary',     tag:'input', importance:4 },
  { id:'e46', from:'n09', to:'n10', label:'ASRs generate hypotheses',            tag:'input', importance:1 },
  { id:'e47', from:'n15', to:'n16', label:'cascade effects → context boundaries', tag:'input', importance:2 },

  // ── QATT Card (n11) ───────────────────────────────────────────────────────
  { id:'e48', from:'n09', to:'n11', label:'ASRs define quality scenarios',         tag:'input', importance:5 },
  { id:'e49', from:'n08', to:'n11', label:'context sets stimulus environment',      tag:'input', importance:3 },
  { id:'e50', from:'n11', to:'n14', label:'QA tactics inform ADR decisions',        tag:'input', importance:4 },

  // ── OKR Card (n23) ────────────────────────────────────────────────────────
  { id:'e51', from:'n05', to:'n23', label:'business case seeds OKR objectives',     tag:'input', importance:3 },
  { id:'e53', from:'n23', to:'n07', label:'objectives set roadmap goals',           tag:'input', importance:4 },
  { id:'e54', from:'n22', to:'n23', label:'realized benefits validate OKRs',        tag:'input', importance:2 },

  // ── Capability Assessment (n24) ────────────────────────────────────────────
  { id:'e55', from:'n02', to:'n24', label:'capabilities are assessed for maturity', tag:'input', importance:4 },
  { id:'e56', from:'n24', to:'n07', label:'gaps drive roadmap priorities',          tag:'input', importance:5 },
  { id:'e58', from:'n24', to:'n25', label:'weak capabilities expose risks',         tag:'input', importance:3 },

  // ── Risk Methods Card (n25) ────────────────────────────────────────────────
  { id:'e61', from:'n25', to:'n14', label:'risks trigger ADRs',                     tag:'input', importance:4 },
  { id:'e62', from:'n25', to:'n09', label:'risks become ASRs',                      tag:'input', importance:5 },
  { id:'e63', from:'n25', to:'n29', label:'risk exposure → security requirements',  tag:'input', importance:4 },

  // ── Service Blueprint (n26) ────────────────────────────────────────────────
  { id:'e67', from:'n26', to:'n08', label:'service boundary → context view',        tag:'input', importance:3 },
  { id:'e68', from:'n26', to:'n17', label:'front-stage ops → service interface',    tag:'input', importance:4 },


  // ── Container / Component View (n28) ──────────────────────────────────────
  { id:'e74', from:'n08', to:'n28', label:'context boundary decomposed to containers', tag:'input', importance:5 },
  { id:'e75', from:'n16', to:'n28', label:'bounded contexts map to containers',     tag:'input', importance:5 },
  { id:'e76', from:'n28', to:'n17', label:'containers expose service interfaces',   tag:'input', importance:4 },
  { id:'e77', from:'n28', to:'n18', label:'containers mapped to deployment nodes',  tag:'input', importance:4 },

  // ── Security Architecture View (n29) ──────────────────────────────────────
  { id:'e80', from:'n29', to:'n14', label:'security decisions → ADRs',             tag:'input', importance:5 },
  { id:'e81', from:'n29', to:'n18', label:'security zones constrain deployment',    tag:'input', importance:4 },

];
