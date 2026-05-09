// ─── colour tokens ────────────────────────────────────────────────────────────
export const BADGE_COLORS: Record<string, string> = {
  purple: '#7F77DD',
  teal:   '#1D9E75',
  coral:  '#D85A30',
  green:  '#639922',
  gray:   '#888780',
  amber:  '#BA7517',
};

export const BADGE_TYPES: { badge: string; color: string; description: string }[] = [
  { badge: 'BTABoK', color: '#7F77DD', description: 'BTABoK native artifact' },
  { badge: 'DDD',    color: '#888780', description: 'Domain-Driven Design' },
  { badge: 'C4',     color: '#BA7517', description: 'C4 model' },
  { badge: 'OWASP',  color: '#BA7517', description: 'OWASP' },
];

export const PHASE_STYLES: Record<string, { bg: string; band: string; text: string }> = {
  innovation:     { bg: '#F9FAFB', band: '#D1D5DB', text: '#111827' },
  strategy:       { bg: '#F3F4F6', band: '#9CA3AF', text: '#111827' },
  planning:       { bg: '#F9FAFB', band: '#D1D5DB', text: '#111827' },
  transformation: { bg: '#F3F4F6', band: '#9CA3AF', text: '#111827' },
  utilize:        { bg: '#F9FAFB', band: '#D1D5DB', text: '#111827' },
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

export const PHASE_DESCRIPTION: Record<Phase, string> = {
  innovation:
    'The entry point of every engagement. Teams explore new business opportunities, validate ideas against market demand, and establish the shared business model that anchors all downstream architecture to real customer outcomes.',
  strategy:
    'Translates the business model into a structured technology strategy. Capabilities are mapped, assessed for maturity, and risks are identified early. Stakeholders are aligned, objectives are measured via OKRs, and the investment roadmap is prioritised.',
  planning:
    'Architecture is shaped and constrained before any build begins. System boundaries are drawn, quality attributes are made testable, significant requirements become traceable ASRs, and every key decision is logged as an ADR with explicit trade-offs.',
  transformation:
    'Design is realised as working software and infrastructure. Bounded contexts drive service decomposition, interfaces are contractually defined, and all structural, deployment, security, and dynamic views are produced to make the architecture verifiable.',
  utilize:
    'The cycle closes here. Deployed architecture is measured against the OKRs set in Strategy, benefits are realised and attributed to decisions, technical debt is tracked, and lessons feed back into the next Innovation cycle.',
};

export const PHASE_GOAL: Record<Phase, string> = {
  innovation:     'Establish a shared understanding of value, customers, and business model',
  strategy:       'Prioritise capability investment and set measurable architectural objectives',
  planning:       'Define, trace, and formally decide the architecture before build',
  transformation: 'Implement, decompose, and verify the architecture across all key viewpoints',
  utilize:        'Measure outcomes, close the loop, and seed the next cycle',
};

export const PHASE_KEY_QUESTIONS: Record<Phase, string[]> = {
  innovation:     ['What problem are we solving?', 'Who are our customers and what do they value?', 'How does this create sustainable business value?'],
  strategy:       ['What capabilities must improve?', 'Who are the key stakeholders and what do they need?', 'What are the measurable outcomes we commit to?'],
  planning:       ['What is the system boundary?', 'What quality attributes are non-negotiable?', 'What decisions must be made and documented before build begins?'],
  transformation: ['How do bounded contexts map to services?', 'What are the explicit contracts between components?', 'Are all architectural viewpoints covered and verified?'],
  utilize:        ['Did the architecture deliver the promised business outcomes?', 'What debt was incurred and how will it be repaid?', 'What should the next innovation cycle learn from this one?'],
};

// ─── data types ───────────────────────────────────────────────────────────────
export interface NodeData {
  id: string; phase: Phase; num: string; title: string; subtitle: string;
  badge: string; importancy: 1 | 2; importancyReason: string;
  descr?: string; note?: string; recurring?: boolean; external?: boolean;
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
  btabok?: true;
}

// ─── node data ────────────────────────────────────────────────────────────────
export const NODES: NodeData[] = [
  // BTABoK Innovation phase artifacts
  { id:'n01', phase:'innovation',     num:'01', title:'Business Model Canvas',                subtitle:'One-page visual of how the organization creates, delivers, and captures value',                link:'https://iasa-global.github.io/btabok/business_model_canvas.html',                badge:'BTABoK', importancy:1, importancyReason:'Entry point for every engagement — without a shared business model, architecture has no anchor to value or customer outcomes'},
  { id:'n02', phase:'innovation',       num:'02', title:'Business Capability Canvas',           subtitle:'Hierarchical capability map within value streams; identifies bottlenecks and guides strategic investment',                 link:'https://iasa-global.github.io/btabok/business_capability_canvas.html',  badge:'BTABoK', importancy:1, importancyReason:'Defines what the business does independent of how — the foundation for all capability-driven investment and architecture decisions'},
  { id:'n24', phase:'innovation',       num:'03', title:'Capability Card',                      subtitle:'Maturity assessment per capability: outcomes, KPIs, people/process/technology, strategic impact, and gaps',          link:'https://iasa-global.github.io/btabok/capability_card.html',  badge:'BTABoK', importancy:1, importancyReason:'Operationalises the capability map — without per-capability maturity assessment the canvas stays decorative and gaps go unaddressed', recurring:true},
  { id:'n25', phase:'innovation',       num:'04', title:'Risk Methods',                         subtitle:'Risk identification with probability × consequence scoring, mitigation strategies, and treatment options across technology, financial, legal, and organizational domains',     link:'https://iasa-global.github.io/btabok/risk_methods.html',             badge:'BTABoK', importancy:1, importancyReason:'Risk identified late becomes cost; identifying it at strategy phase keeps it as a decision input rather than an emergency response', note:'Feed into ADRs and ASRs', recurring:true},
  { id:'n31', phase:'innovation',       num:'05', title:'Value Stream Map',                      subtitle:'End-to-end steps, handoffs, and wait times in value delivery; exposes waste and bottlenecks capability maps miss',                      link:'https://iasa-global.github.io/btabok/value_stream.html',             badge:'BTABoK', importancy:1, importancyReason:'Connects business capabilities to actual value flow — without mapping the stream, architectural interventions target symptoms rather than the real delays and waste'},
  { id:'n32', phase:'innovation',       num:'06', title:'Customer Journey Map',                  subtitle:'Customer experience across touchpoints, channels, and emotions; surfaces pain points and unmet needs that drive architecture requirements',                      link:'https://iasa-global.github.io/btabok/customer_journey_map.html',    badge:'BTABoK', importancy:1, importancyReason:'Architecture that ignores customer experience optimises internal plumbing while leaving user pain unsolved; the journey map keeps the architecture customer-outcome anchored'},
  { id:'n33', phase:'innovation',       num:'07', title:'JTBD Card',                              subtitle:'Functional, emotional, and social jobs customers want done — solution-independent — anchoring architecture to real needs rather than assumed features',  link:'https://iasa-global.github.io/btabok/jtbd_card.html',               badge:'BTABoK', importancy:1, importancyReason:'Architecture built around solutions rather than customer jobs optimises the wrong things; JTBD reframes every requirement as a job the customer is trying to get done', note:'One card per distinct customer job', recurring:true},
  { id:'n34', phase:'innovation',       num:'08', title:'Customer Persona',                       subtitle:'Named profile of a customer segment covering goals, frustrations, behaviours, and context to ground architecture decisions in real people', link:'https://iasa-global.github.io/btabok/persona_card.html',             badge:'BTABoK', importancy:1, importancyReason:'Architecture that abstracts away the human reduces real user goals to technical requirements; a concrete persona keeps design decisions grounded in actual behaviour patterns', note:'One persona per distinct customer segment or user type', recurring:true},

  // BTABoK Strategy phase artifacts
  { id:'n03', phase:'strategy',       num:'09', title:'Architect Stakeholder Canvas',         subtitle:'Business and technology stakeholders mapped across external, consumer, provider, and partner roles relative to the architect team',                   link:'https://iasa-global.github.io/btabok/architect_stakeholder_canvas.html',   badge:'BTABoK', importancy:1, importancyReason:'Architecture that ignores stakeholders dies in review — mapping all parties and engagement levels is a prerequisite for governance and adoption'},
  { id:'n04', phase:'strategy',       num:'10', title:'Power-Interest Grid',                  subtitle:'2×2 grid of stakeholders by influence and interest to prioritize engagement and ensure critical sign-offs',                     link:'https://iasa-global.github.io/btabok/power_interest_grid.html',                                                               badge:'BTABoK', importancy:1, importancyReason:'Without prioritising who can block or champion decisions, stakeholder effort is misallocated and critical sign-offs get missed'},
  { id:'n05', phase:'strategy',       num:'11', title:'Business Case (NABC Card)',            subtitle:'Business case structured around need, approach, benefits, costs, ROI, and risks',                         link:'https://iasa-global.github.io/btabok/business_case_nabc_card.html',                                                                badge:'BTABoK', importancy:1, importancyReason:'Architecture without a justified business case is a technology project, not a business investment — NABC forces the value argument up front'},
  { id:'n23', phase:'strategy',       num:'12', title:'OKR Card',                             subtitle:'Strategic goal defined through measurable key results traceable to architecture decisions',      link:'https://iasa-global.github.io/btabok/okr_card.html',                      badge:'BTABoK', importancy:1, importancyReason:'Value proof is a top BTABoK architect obligation — OKRs are the measurement mechanism that connects strategy to demonstrable outcomes', note:'One card per strategic objective', recurring:true},
  { id:'n06', phase:'strategy',       num:'13', title:'Architecture Principles',              subtitle:'Guiding rules linking business goals to architectural choices, each with rationale, testable criteria, and implications', link:'https://iasa-global.github.io/btabok/principles.html',  badge:'BTABoK', importancy:1, importancyReason:'Principles are the standing decisions that prevent every team from relitigating the same trade-offs — without them, governance is arbitrary', note:'BTABoK Principles topic — no canvas; maintain as a structured registry'},
  { id:'n30', phase:'strategy',       num:'14', title:'Strategic Roadmap Canvas',             subtitle:'Portfolio IT direction: vision, initiatives, timelines, value/complexity/compliance, and cross-stream dependencies', link:'https://iasa-global.github.io/btabok/strategic_roadmap_canvas.html',      badge:'BTABoK', importancy:1, importancyReason:'Bridges business vision and OKRs to a portfolio of IT initiatives — without it, the Layered Roadmap has no strategic anchor and initiatives compete without alignment' },

  // BTABoK Planning phase artifacts
  { id:'n07', phase:'planning',       num:'15', title:'Layered Roadmap Canvas',               subtitle:'Four-lane timeline of capability, technology, and people evolution from current to target state',              link:'https://iasa-global.github.io/btabok/layered_roadmap_canvas.html',        badge:'BTABoK', importancy:1, importancyReason:'Transforms architecture intent into funded, sequenced delivery — without it strategy remains aspirational and unbudgeted'},
  { id:'n08', phase:'planning',       num:'16', title:'Context View Card',                    subtitle:'Solution boundary and relationships with external systems, user groups, and stakeholders; aligns scope before design begins',                 link:'https://iasa-global.github.io/btabok/context_view_card.html',           badge:'BTABoK', importancy:1, importancyReason:'Establishes the system boundary before any design begins — misaligned scope is the most expensive planning mistake to fix later', descr:'Describes the solution by illustrating how it interacts within its broader environment. Defines boundaries relative to external entities (systems, user groups, stakeholders), maps integration points and dependencies, and fosters stakeholder alignment through a shared visualization of the solution ecosystem. Links to ASRs, ADRs, and downstream architectural views.', note:'Use UML or ArchiMate; document each external connection and data flow'},
  { id:'n26', phase:'planning',       num:'17', title:'Service Blueprint Canvas',             subtitle:'Customer actions, frontstage interactions, backstage processes, supporting technology, and failure points across the service delivery chain',   link:'https://iasa-global.github.io/btabok/service_blueprint_canvas.html',      badge:'BTABoK', importancy:1, importancyReason:'Bridges customer experience to back-stage systems — the primary artifact for aligning service architecture with actual usage and failure modes', note:'One canvas per customer journey or service scenario', recurring:true},
  { id:'n09', phase:'planning',       num:'18', title:'ASR Card',                             subtitle:'Requirements that fundamentally shape system design, bridging business goals to technical implementation; every ADR traces to an ASR',                     link:'https://iasa-global.github.io/btabok/asr_card.html',                     badge:'BTABoK', importancy:1, importancyReason:'ASRs are the contractual interface between business needs and architecture decisions — every ADR must trace back to one', note:'One card per architecturally significant requirement', recurring:true},

  // BTABoK Transformation phase artifacts
  { id:'n10', phase:'transformation', num:'19', title:'Architecture Hypothesis Canvas',       subtitle:'Validates uncertain decisions through situation, hypothesis, experiment design, success measures, and value impact',                     link:'https://iasa-global.github.io/btabok/architecture_hypothesis_card.html', badge:'BTABoK', importancy:2, importancyReason:'Valuable in lean/agile contexts for validating uncertain decisions, but conditional on methodology — not every engagement runs experiments'},
  { id:'n11', phase:'transformation', num:'20', title:'QATT Card',                            subtitle:'Quality attribute scenario: stimulus, environment, measurable response, trade-offs, and architectural tactics',                link:'https://iasa-global.github.io/btabok/qatt_card.html',                    badge:'BTABoK', importancy:1, importancyReason:'Quality attributes ARE architecture — stimulus-response scenarios make NFRs testable and prevent them from being ignored until production', note:'One card per scenario', recurring:true},
  { id:'n12', phase:'transformation', num:'21', title:'Architecture Definition Canvas',       subtitle:'Defines what architecture means for the engagement and its value to each stakeholder group',                 link:'https://iasa-global.github.io/btabok/architecture_definition_canvas.html', badge:'BTABoK', importancy:1, importancyReason:'Single-page alignment artifact that prevents scope creep and keeps all stakeholders working from the same architecture frame'},
  { id:'n13', phase:'transformation', num:'22', title:'Solution Design Canvas',               subtitle:'Solution exploration across business problem, outcomes, options, success metrics, and key assumptions',                               link:'https://iasa-global.github.io/btabok/solution_design_canvas.html',        badge:'BTABoK', importancy:1, importancyReason:'Forces structured option analysis before committing to a solution — without it, the first idea wins by default', note:'Spans Planning → Transformation continuously'},
  { id:'n14', phase:'transformation', num:'23', title:'ADR Card',                             subtitle:'Architectural decision record: context, options considered, rationale, consequences, status, and ASR traceability',                  link:'https://iasa-global.github.io/btabok/architecture_decision_record.html',                                                                                             badge:'BTABoK', importancy:1, importancyReason:'The definitive audit trail of why the architecture is the way it is — missing ADRs mean future teams reverse decisions blindly', note:'Core — new ADR for every significant decision in Planning and Transformation', recurring:true},
  { id:'n15', phase:'transformation', num:'24', title:'Architecture Decision Cascade Card',   subtitle:'Secondary decisions and downstream consequences flowing from a primary ADR',                   link:'https://iasa-global.github.io/btabok/architecture_decision_cascade_card.html', badge:'BTABoK', importancy:2, importancyReason:'Important companion to ADR for high-impact decisions, but secondary — value scales with decision complexity rather than being universally mandatory', note:'Core — one Cascade Card per ADR, in both phases', recurring:true},
  { id:'n16', phase:'transformation', num:'25', title:'Bounded Context Canvas',               subtitle:'DDD boundaries, language, dependencies',                       link:'https://github.com/ddd-crew/bounded-context-canvas',                                                                 badge:'DDD', importancy:1, importancyReason:'Service decomposition without explicit DDD boundaries produces integration spaghetti — contexts must be named and owned before interfaces are designed', note:'One per bounded context', recurring:true},
  { id:'n28', phase:'transformation', num:'26', title:'Container / Component View (C4 L2-L3)',subtitle:'System decomposed into containers and components, responsibilities', link:'https://c4model.com/#ContainerDiagram',                               badge:'C4', importancy:1, importancyReason:'Structural decomposition is a non-negotiable viewpoint — without it, Context View jumps straight to code with no intermediate accountability', note:'BTABoK gap: structural decomposition (Views & Viewpoints) — use C4 Container + Component Diagrams; bridges Context View to service interfaces', external:true},
  { id:'n17', phase:'transformation', num:'27', title:'Service Interface Design Canvas',      subtitle:'Outside-in service spec: value proposition, consumers, interactions, SLAs, dependencies, quality attributes, and consumption economics',                       link:'https://iasa-global.github.io/btabok/service_interface_design_canvas.html',     badge:'BTABoK', importancy:1, importancyReason:'Contracts between services are the hardest things to change after deployment — explicit interface design prevents accidental coupling', note:'One canvas per service, API, or product delivered by a team', recurring:true},
  { id:'n18', phase:'transformation', num:'29', title:'Deployment / Infrastructure View',     subtitle:'Components mapped to nodes, networks, environments',           link:'https://c4model.com/#DeploymentDiagram',                                                                             badge:'C4', importancy:1, importancyReason:'Architecture exists in a physical environment — without this view, operational concerns (latency, failure domains, compliance) are invisible until production', note:'BTABoK gap: physical view (Views & Viewpoints) — use C4 Deployment or UML Deployment Diagram', external:true},
  { id:'n29', phase:'transformation', num:'28', title:'Security Architecture View',           subtitle:'Threat model, trust zones, security controls, attack surface', link:'https://owasp.org/www-community/Threat_Modeling',                        badge:'OWASP', importancy:1, importancyReason:'Security bolted on after design is a compliance liability and a re-architecture event — threat modelling must happen at transformation phase', note:'BTABoK gap: security viewpoint — use STRIDE + security zone diagram; critical for compliance', external:true},
  { id:'n20', phase:'transformation', num:'30', title:'Sequence / Scenario View',             subtitle:'Time-ordered message flow for key use cases',                  link:'https://c4model.com/#DynamicDiagram',                                                                                badge:'C4', importancy:1, importancyReason:'Dynamic behaviour verification catches integration failures and timing assumptions before they reach production', note:'BTABoK gap: scenario view (Views & Viewpoints) — use UML Sequence or C4 Dynamic Diagram', external:true, recurring:true},
  { id:'n21', phase:'transformation', num:'31', title:'Technical Loan Request Card',          subtitle:'Technical debt treated as a deliberate loan: justification, impact, repayment schedule, and approval trail',          link:'https://iasa-global.github.io/btabok/technical_loan_request_card.html',  badge:'BTABoK', importancy:1, importancyReason:'Explicit debt management is a professional obligation — treating shortcuts as loans with a repayment plan keeps architectural integrity visible to business', note:'One card per technical debt item', recurring:true},

  // BTABoK Utilize phase artifacts
  { id:'n22', phase:'utilize',        num:'32', title:'Benefits Realization View Canvas',     subtitle:'Architecture investments mapped to measurable business benefits, costs, and technical debt',          link:'https://iasa-global.github.io/btabok/benefits_realization_view_canvas.html', badge:'BTABoK', importancy:1, importancyReason:'Closes the loop between architecture decisions and business outcomes — without it, architecture value is claimed but never demonstrated' },
];

// ─── edge data ────────────────────────────────────────────────────────────────
export const EDGES: EdgeData[] = [
  { id:'e01', from:'n01', to:'n02', label:'seeds capability hierarchy',          importance:5, btabok:true },
  { id:'e03', from:'n02', to:'n06', label:'source for principles',               importance:4, btabok:true },
  { id:'e06', from:'n03', to:'n04', label:'populates grid',                      importance:2 },
  { id:'e11', from:'n05', to:'n12', label:'success criteria → definition',       importance:4 },
  { id:'e12', from:'n06', to:'n12', label:'principles populate definition',       importance:4, btabok:true },
  { id:'e15', from:'n08', to:'n09', label:'interactions trigger ASRs',           importance:6 },
  { id:'e18', from:'n09', to:'n14', label:'ASR IDs referenced in ADR',           importance:6, btabok:true },
  { id:'e20', from:'n10', to:'n14', label:'validated hypothesis informs ADR',    importance:1 },
  { id:'e22', from:'n12', to:'n13', label:'scope constrains design options',      importance:4 },
  { id:'e23', from:'n12', to:'n16', label:'boundary → context partitioning',      importance:3 },
  { id:'e25', from:'n13', to:'n14', label:'options → ADR scored columns',        importance:5 },
  { id:'e27', from:'n14', to:'n15', label:'spawns cascade card',                 importance:2, btabok:true },
  { id:'e28', from:'n14', to:'n21', label:'shortcuts → loan card',               importance:2 },
  { id:'e30', from:'n16', to:'n17', label:'language → service operations',       importance:4 },
  { id:'e32', from:'n17', to:'n14', label:'service choices trigger ADR',         importance:4 },
  { id:'e33', from:'n17', to:'n20', label:'operations → sequence messages',      importance:3 },
  { id:'e36', from:'n21', to:'n22', label:'debt reduces realised benefits',      importance:2, btabok:true },
  { id:'e37', from:'n22', to:'n07', label:'outcomes reprioritise roadmap',       importance:3 },
  { id:'e40', from:'n22', to:'n01', label:'lessons open new innovation cycle',   importance:3 },
  { id:'e43', from:'n05', to:'n06', label:'business constraints → principles',   importance:4, btabok:true },
  { id:'e45', from:'n07', to:'n08', label:'roadmap scope → system boundary',     importance:4 },
  { id:'e46', from:'n09', to:'n10', label:'ASRs generate hypotheses',            importance:1 },
  { id:'e47', from:'n15', to:'n16', label:'cascade effects → context boundaries', importance:2 },

  // ── QATT Card (n11) ───────────────────────────────────────────────────────
  { id:'e48', from:'n09', to:'n11', label:'ASRs define quality scenarios',         importance:5 },
  { id:'e49', from:'n08', to:'n11', label:'context sets stimulus environment',      importance:3, btabok:true },
  { id:'e50', from:'n11', to:'n14', label:'QA tactics inform ADR decisions',        importance:4, btabok:true },

  // ── Strategic Roadmap Canvas (n30) ───────────────────────────────────────
  { id:'e82', from:'n02', to:'n30', label:'capabilities anchor strategic IT initiatives', importance:4 },
  { id:'e83', from:'n05', to:'n30', label:'business case defines initiative scope',       importance:3, btabok:true },
  { id:'e84', from:'n06', to:'n30', label:'principles constrain strategic initiatives',   importance:3, btabok:true },
  { id:'e85', from:'n23', to:'n30', label:'OKRs align strategic IT direction',            importance:4, btabok:true },
  { id:'e86', from:'n30', to:'n07', label:'strategic IT direction → phased delivery',     importance:5 },

  // ── OKR Card (n23) ────────────────────────────────────────────────────────
  { id:'e51', from:'n05', to:'n23', label:'business case seeds OKR objectives',     importance:3 },
  { id:'e53', from:'n23', to:'n07', label:'objectives set roadmap goals',           importance:4 },
  { id:'e54', from:'n22', to:'n23', label:'realized benefits validate OKRs',        importance:2 },

  // ── Capability Assessment (n24) ────────────────────────────────────────────
  { id:'e55', from:'n02', to:'n24', label:'capabilities are assessed for maturity', importance:4, btabok:true },
  { id:'e56', from:'n24', to:'n07', label:'gaps drive roadmap priorities',          importance:5 },
  { id:'e58', from:'n24', to:'n25', label:'weak capabilities expose risks',         importance:3 },

  // ── Risk Methods Card (n25) ────────────────────────────────────────────────
  { id:'e61', from:'n25', to:'n14', label:'risks trigger ADRs',                     importance:4 },
  { id:'e62', from:'n25', to:'n09', label:'risks become ASRs',                      importance:5 },
  { id:'e63', from:'n25', to:'n29', label:'risk exposure → security requirements',  importance:4 },

  // ── Service Blueprint (n26) ────────────────────────────────────────────────
  { id:'e66', from:'n07', to:'n26', label:'roadmap technology lane references service blueprints', importance:3, btabok:true },
  { id:'e67', from:'n26', to:'n08', label:'service boundary → context view',        importance:3 },
  { id:'e68', from:'n26', to:'n17', label:'front-stage ops → service interface',    importance:4 },


  // ── Container / Component View (n28) ──────────────────────────────────────
  { id:'e74', from:'n08', to:'n28', label:'context boundary decomposed to containers', importance:5 },
  { id:'e75', from:'n16', to:'n28', label:'bounded contexts map to containers',     importance:5 },
  { id:'e76', from:'n28', to:'n17', label:'containers expose service interfaces',   importance:4 },
  { id:'e77', from:'n28', to:'n18', label:'containers mapped to deployment nodes',  importance:4 },

  // ── Security Architecture View (n29) ──────────────────────────────────────
  { id:'e80', from:'n29', to:'n14', label:'security decisions → ADRs',             importance:5 },
  { id:'e81', from:'n29', to:'n18', label:'security zones constrain deployment',    importance:4 },

  // ── Value Stream Map (n31) ────────────────────────────────────────────────
  { id:'e87', from:'n02', to:'n31', label:'capabilities are building blocks of value streams',       importance:5, btabok:true },
  { id:'e88', from:'n31', to:'n26', label:'value stream steps detailed in service blueprint',        importance:4, btabok:true },
  { id:'e89', from:'n31', to:'n16', label:'value stream analysis drives bounded context boundaries', importance:3, btabok:true },
  { id:'e90', from:'n31', to:'n32', label:'value stream quotes drawn from customer journey',         importance:3, btabok:true },
  { id:'e91', from:'n23', to:'n31', label:'OKRs are key metrics for value stream performance',       importance:3, btabok:true },

  // ── Customer Journey Map (n32) ────────────────────────────────────────────
  { id:'e92', from:'n32', to:'n26', label:'customer actions align with service blueprint',   importance:5, btabok:true },
  { id:'e93', from:'n32', to:'n23', label:'journey opportunities feed OKR goal-setting',     importance:4, btabok:true },
  { id:'e94', from:'n32', to:'n05', label:'journey improvements feed business case',         importance:3, btabok:true },
  { id:'e95', from:'n32', to:'n31', label:'customer journey insights inform value stream',   importance:3, btabok:true },

  // ── JTBD Card (n33) ──────────────────────────────────────────────────────
  { id:'e96', from:'n34', to:'n33', label:'persona defines who holds the job',               importance:4, btabok:true },
  { id:'e97', from:'n33', to:'n32', label:'jobs to be done frame journey touchpoints',       importance:5, btabok:true },
  { id:'e98', from:'n33', to:'n05', label:'unmet jobs justify business case investment',     importance:3, btabok:true },
  { id:'e99', from:'n33', to:'n23', label:'customer jobs define OKR success metrics',        importance:3, btabok:true },

  // ── Customer Persona (n34) ────────────────────────────────────────────────
  { id:'e100', from:'n01', to:'n34', label:'customer segment in BMC grounds persona',        importance:4, btabok:true },
  { id:'e101', from:'n34', to:'n32', label:'persona behaviour shapes journey mapping',       importance:5, btabok:true },
  { id:'e102', from:'n34', to:'n26', label:'persona needs surface service pain points',      importance:3, btabok:true },

];
