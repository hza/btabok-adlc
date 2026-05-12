// ─── colour tokens ────────────────────────────────────────────────────────────
export const IMP_COLOR: Record<1 | 2 | 3, string> = {
  1: '#cfd3d8',
  2: '#5c80b4',
  3: '#F5A44A',
};

export const BADGE_COLORS: Record<string, string> = {
  purple: '#7F77DD',
  teal:   '#1D9E75',
  coral:  '#D85A30',
  green:  '#639922',
  gray:   '#888780',
  amber:  '#BA7517',
};

// ─── importance ───────────────────────────────────────────────────────────────
export const IMPORTANCE_STYLES: Record<string, { label: string; color: string; bg: string; rationale: string }> = {
  ultra: { label: 'Max',       color: '#B91C1C', bg: '#FEE2E2', rationale: 'Non-negotiable core. Without it the architecture lacks justification, scope, requirements, decisions, or structural verifiability.' },
  extra: { label: 'High',      color: '#C2410C', bg: '#FFEDD5', rationale: 'Strongly recommended; skipping it leaves a significant blind spot in strategy, traceability, or governance.' },
  high:  { label: 'Normal',    color: '#166534', bg: '#DCFCE7', rationale: 'Valuable and recommended; gaps are felt but the engagement can proceed without it.' },
};

export const BADGE_TYPES: { badge: string; color: string; description: string }[] = [
  { badge: 'BTABoK', color: '#7F77DD', description: 'BTABoK native artifact' },
  { badge: 'DDD',    color: '#B5451B', description: 'Domain-Driven Design artifact' },
  { badge: 'OWASP',  color: '#2E7D32', description: 'OWASP artifact' },
];

export const PHASE_STYLES: Record<string, { bg: string; band: string; text: string }> = {
  innovation:     { bg: '#F9FAFB', band: '#D1D5DB', text: '#111827' },
  strategy:       { bg: '#F3F4F6', band: '#9CA3AF', text: '#111827' },
  planning:       { bg: '#F9FAFB', band: '#D1D5DB', text: '#111827' },
  transformation: { bg: '#F3F4F6', band: '#9CA3AF', text: '#111827' },
  utilize:        { bg: '#F9FAFB', band: '#D1D5DB', text: '#111827' },
  decommission:   { bg: '#F3F4F6', band: '#9CA3AF', text: '#111827' },
};

export const PHASES = ['innovation', 'strategy', 'planning', 'transformation', 'utilize', 'decommission'] as const;

export type Phase = typeof PHASES[number];

export const PHASE_LABEL: Record<Phase, string> = {
  innovation:     'Innovation',
  strategy:       'Strategy',
  planning:       'Planning',
  transformation: 'Transformation',
  utilize:        'Utilize and Measure',
  decommission:   'Decommission',
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
  decommission:
    'The deliberate end-of-life stage. Systems are retired safely by resolving outstanding technical debt, migrating or archiving data, severing dependencies, transferring knowledge, and ensuring no business capability is left uncovered.',
};

export const PHASE_GOAL: Record<Phase, string> = {
  innovation:     'Establish a shared understanding of value, customers, and business model',
  strategy:       'Prioritise capability investment and set measurable architectural objectives',
  planning:       'Define, trace, and formally decide the architecture before build',
  transformation: 'Implement, decompose, and verify the architecture across all key viewpoints',
  utilize:        'Measure outcomes, close the loop, and seed the next cycle',
  decommission:   'Retire safely, preserve knowledge, and ensure no capability gap is left behind',
};

export const PHASE_KEY_QUESTIONS: Record<Phase, string[]> = {
  innovation:     ['What problem are we solving?', 'Who are our customers and what do they value?', 'How does this create sustainable business value?'],
  strategy:       ['What capabilities must improve?', 'Who are the key stakeholders and what do they need?', 'What are the measurable outcomes we commit to?'],
  planning:       ['What is the system boundary?', 'What quality attributes are non-negotiable?', 'What decisions must be made and documented before build begins?'],
  transformation: ['How do bounded contexts map to services?', 'What are the explicit contracts between components?', 'Are all architectural viewpoints covered and verified?'],
  utilize:        ['Did the architecture deliver the promised business outcomes?', 'What debt was incurred and how will it be repaid?', 'What should the next innovation cycle learn from this one?'],
  decommission:   ['Is every dependent system and consumer accounted for?', 'Where does the data go and is it accessible after shutdown?', 'What capabilities must survive and how will they be covered?'],
};

// ─── data types ───────────────────────────────────────────────────────────────
export interface NodeData {
  id: string; phase: Phase; num: string; title: string; subtitle: string;
  badge: string;
  descr?: string; note?: string; recurring?: boolean; external?: boolean;
  link?: string;
  importance?: 1 | 2 | 3;
}

export function badgeColor(badge: string): string {
  return BADGE_TYPES.find(b => b.badge === badge)?.color ?? BADGE_COLORS.gray;
}
export interface EdgeData {
  id: string; from: string; to: string; label: string;
  tag?: 'input';
  importance: 1 | 2 | 3;
  btabok?: true;
}

// ─── node data ────────────────────────────────────────────────────────────────
export const NODES: NodeData[] = (([
  // BTABoK Innovation phase artifacts
  { id:'n01', phase:'innovation', title:'Business Model Canvas',              subtitle:'One-page visual of how the organization creates, delivers, and captures value',                link:'https://iasa-global.github.io/btabok/business_model_canvas.html',                badge:'BTABoK', importance:2},
  { id:'n02', phase:'innovation', title:'Business Capability Canvas',         subtitle:'Hierarchical capability map within value streams; identifies bottlenecks and guides strategic investment',                 link:'https://iasa-global.github.io/btabok/business_capability_canvas.html',  badge:'BTABoK', importance:2},
  { id:'n24', phase:'innovation', title:'Capability Card',                    subtitle:'Maturity assessment per capability: outcomes, KPIs, people/process/technology, strategic impact, and gaps',          link:'https://iasa-global.github.io/btabok/capability_card.html',  badge:'BTABoK', recurring:true, importance:1},
  { id:'n25', phase:'innovation', title:'Risk Methods Cards',                 subtitle:'SWOT analysis, Risk Register, Risk Matrix, and Controls Testing — identify, rate, and govern risks',     link:'https://iasa-global.github.io/btabok/risk_methods.html',             badge:'BTABoK', note:'Risk must be identified and re-assessed at every lifecycle stage!', recurring:true, importance:2},
  { id:'n31', phase:'innovation', title:'Value Stream Map',                   subtitle:'End-to-end steps, handoffs, and wait times in value delivery; exposes waste and bottlenecks capability maps miss',                      link:'https://iasa-global.github.io/btabok/value_stream.html',             badge:'BTABoK', importance:2},
  { id:'n32', phase:'innovation', title:'Customer Journey Map',               subtitle:'Customer experience across touchpoints, channels, and emotions; surfaces pain points and unmet needs that drive architecture requirements',                      link:'https://iasa-global.github.io/btabok/customer_journey_map.html',    badge:'BTABoK', importance:1},
  { id:'n34', phase:'innovation', title:'Customer Persona',                   subtitle:'Named profile of a customer segment covering goals, frustrations, behaviours, and context to ground architecture decisions in real people', link:'https://iasa-global.github.io/btabok/persona_card.html',             badge:'BTABoK', note:'One persona per distinct customer segment or user type', recurring:true, importance:1},
  { id:'n35', phase:'innovation', title:'Stakeholder Empathy Map',            subtitle:'Six-quadrant map of what a stakeholder thinks, feels, says, does, hears, and fears — sharpens persona and journey decisions', link:'https://iasa-global.github.io/btabok/stakeholder_empathy_map.html', badge:'BTABoK', note:'One map per persona or key stakeholder type', recurring:true, importance:1},
  { id:'n33', phase:'innovation', title:'JTBD Card',                          subtitle:'Functional, emotional, and social jobs customers want done — solution-independent — anchoring architecture to real needs rather than assumed features',  link:'https://iasa-global.github.io/btabok/strategyn_jtbd_canvas.html',               badge:'BTABoK', note:'One card per distinct customer job', recurring:true, importance:1},

  // BTABoK Strategy phase artifacts
  { id:'n03', phase:'strategy', title:'Architect Stakeholder Canvas',         subtitle:'Business and technology stakeholders mapped across external, consumer, provider, and partner roles relative to the architect team',                   link:'https://iasa-global.github.io/btabok/architect_stakeholder_canvas.html',   badge:'BTABoK', importance:2},
  { id:'n04', phase:'strategy', title:'Power-Interest Grid',                  subtitle:'2×2 grid of stakeholders by influence and interest to prioritize engagement and ensure critical sign-offs',                     link:'https://iasa-global.github.io/btabok/power_interest_grid.html',                                                               badge:'BTABoK', importance:1},
  { id:'n05', phase:'strategy', title:'Business Case (NABC Card)',            subtitle:'Business case structured around need, approach, benefits, costs, ROI, and risks',                         link:'https://iasa-global.github.io/btabok/business_case_nabc_card.html',                                                                badge:'BTABoK', importance:3},
  { id:'n23', phase:'strategy', title:'OKR Card',                             subtitle:'Strategic goal defined through measurable key results traceable to architecture decisions',      link:'https://iasa-global.github.io/btabok/okr_card.html',                      badge:'BTABoK', recurring:true, importance:2},
  { id:'n06', phase:'strategy', title:'Architecture Principles',              subtitle:'Guiding rules linking business goals to architectural choices, each with rationale, testable criteria, and implications', link:'https://iasa-global.github.io/btabok/principles.html',  badge:'BTABoK', note:'BTABoK Principles topic — no canvas; maintain as a structured registry', importance:3},
  { id:'n30', phase:'strategy', title:'Strategic Roadmap Canvas',             subtitle:'Portfolio IT direction: vision, initiatives, timelines, value/complexity/compliance, and cross-stream dependencies', link:'https://iasa-global.github.io/btabok/strategic_roadmap_canvas.html',      badge:'BTABoK', importance:2},
  { id:'n12', phase:'strategy', title:'Architecture Definition Canvas',       subtitle:'Defines what architecture means for the engagement and its value to each stakeholder group',                 link:'https://iasa-global.github.io/btabok/architecture_definition_canvas.html', badge:'BTABoK', importance:1},

  // BTABoK Planning phase artifacts
  { id:'n08', phase:'planning', title:'Context View Card',                    subtitle:'Solution boundary and relationships with external systems, user groups, and stakeholders; aligns scope before design begins',                 link:'https://iasa-global.github.io/btabok/context_view_card.html',           badge:'BTABoK', descr:'Describes the solution by illustrating how it interacts within its broader environment. Defines boundaries relative to external entities (systems, user groups, stakeholders), maps integration points and dependencies, and fosters stakeholder alignment through a shared visualization of the solution ecosystem. Links to ASRs, ADRs, and downstream architectural views.', note:'Use UML or ArchiMate; document each external connection and data flow', importance:3},
  { id:'n09', phase:'planning', title:'ASR Card',                             subtitle:'Requirements that fundamentally shape system design, bridging business goals to technical implementation; every ADR traces to an ASR',                     link:'https://iasa-global.github.io/btabok/asr_card.html',                     badge:'BTABoK', note:'One card per architecturally significant requirement', recurring:true, importance:3},
  { id:'n11', phase:'planning', title:'QATT Card',                            subtitle:'Quality attribute scenario: stimulus, environment, measurable response, trade-offs, and architectural tactics',                link:'https://iasa-global.github.io/btabok/qatt_card.html',                    badge:'BTABoK', note:'One card per scenario', recurring:true, importance:2},
  { id:'n26', phase:'planning', title:'Service Blueprint Canvas',             subtitle:'Customer actions, frontstage interactions, backstage processes, supporting technology, and failure points across the service delivery chain',   link:'https://iasa-global.github.io/btabok/service_blueprint_canvas.html',      badge:'BTABoK', note:'One canvas per customer journey or service scenario', recurring:true, importance:1},
  { id:'n10', phase:'planning', title:'Architecture Hypothesis Canvas',       subtitle:'Validates uncertain decisions through situation, hypothesis, experiment design, success measures, and value impact',                     link:'https://iasa-global.github.io/btabok/architecture_hypothesis_card.html', badge:'BTABoK', importance:1},
  { id:'n13', phase:'planning', title:'Solution Design Canvas',               subtitle:'Solution exploration across business problem, outcomes, options, success metrics, and key assumptions',                               link:'https://iasa-global.github.io/btabok/solution_design_canvas.html',        badge:'BTABoK', note:'Spans Planning → Transformation continuously', importance:2},
  { id:'n37', phase:'planning', title:'Transition Roadmap Canvas',               subtitle:'Migration path from current to target state: transition milestones, workstreams, dependencies, and risk mitigations per capability or system',  link:'https://iasa-global.github.io/btabok/transition_roadmap_canvas.html',     badge:'BTABoK', importance:2},
  { id:'n07', phase:'planning', title:'Layered Roadmap Canvas',               subtitle:'Four-lane timeline of capability, technology, and people evolution from current to target state',              link:'https://iasa-global.github.io/btabok/layered_roadmap_canvas.html',        badge:'BTABoK', importance:1},

  // BTABoK Transformation phase artifacts
  { id:'n14', phase:'transformation', title:'ADR Card',                             subtitle:'Architectural decision record: context, options considered, rationale, consequences, status, and ASR traceability',                  link:'https://iasa-global.github.io/btabok/architecture_decision_record.html',                                                                                             badge:'BTABoK', note:'Core — new ADR for every significant decision in Planning and Transformation', recurring:true, importance:3},
  { id:'n15', phase:'transformation', title:'Architecture Decision Cascade Card',   subtitle:'Secondary decisions and downstream consequences flowing from a primary ADR',                   link:'https://iasa-global.github.io/btabok/architecture_decision_cascade_card.html', badge:'BTABoK', note:'Core — one Cascade Card per ADR, in both phases', recurring:true, importance:2},
  { id:'n16', phase:'transformation', title:'Bounded Context Canvas',               subtitle:'Inside-out domain partition within the system boundary: ubiquitous language, upstream/downstream dependencies, and team ownership — one per subdomain, defined after the Context View',                       link:'https://github.com/ddd-crew/bounded-context-canvas',                                                                 badge:'DDD', note:'One per bounded context', recurring:true, importance:2},
  { id:'n28', phase:'transformation', title:'Application View Card',                subtitle:'System decomposed into containers and components - use C4 L2/L3 Diagram', link:'https://c4model.com/#ContainerDiagram',                               badge:'BTABoK', descr:'Decomposes the solution into containers and components using C4 Level 2 and Level 3 diagrams. Maps bounded contexts to containers, defines service interfaces, and links containers to deployment nodes. Bridges the high-level context view and the infrastructure deployment view.', note:'Rename Context View Card to Application View Card', recurring:true, importance:3},
  { id:'n17', phase:'transformation', title:'Service Interface Design Canvas',      subtitle:'Outside-in service spec: value proposition, consumers, interactions, SLAs, dependencies, quality attributes, and consumption economics',                       link:'https://iasa-global.github.io/btabok/service_interface_design_canvas.html',     badge:'BTABoK', note:'One canvas per service, API, or product delivered by a team', recurring:true, importance:2},
  { id:'n18', phase:'transformation', title:'Physical View Card',                   subtitle:'Components mapped to nodes, networks, environments — use C4 Deployment or UML Deployment Diagram',           link:'https://c4model.com/#DeploymentDiagram',                                                                             badge:'BTABoK', note:'Rename Context View Card to Deployment View Card', recurring:true, importance:2},
  { id:'n29', phase:'transformation', title:'Security Architecture View',           subtitle:'Threat model, trust zones, security controls, attack surface', link:'https://owasp.org/www-community/Threat_Modeling',                        badge:'OWASP', note:'BTABoK gap: security viewpoint — use STRIDE + security zone diagram; critical for compliance', external:true, importance:3},
  { id:'n20', phase:'transformation', title:'Process View Card',                    subtitle:'Time-ordered message flow for key use cases. For sequence / scenario view use UML Sequence or C4 Dynamic Diagram',                  link:'https://c4model.com/#DynamicDiagram',                                                                                badge:'BTABoK', note:'Rename Context View Card to Process View Card.', recurring:true, importance:1},
  { id:'n21', phase:'transformation', title:'Technical Loan Request Card',          subtitle:'Technical debt treated as a deliberate loan: justification, impact, repayment schedule, and approval trail',          link:'https://iasa-global.github.io/btabok/technical_loan_request_card.html',  badge:'BTABoK', note:'One card per technical debt item', recurring:true, importance:1},

  // BTABoK Utilize phase artifacts
  { id:'n22', phase:'utilize', title:'Benefits Realization View Canvas',     subtitle:'Architecture investments mapped to measurable business benefits, costs, and technical debt',          link:'https://iasa-global.github.io/btabok/benefits_realization_view_canvas.html', badge:'BTABoK', importance:2 },

  // Decommission phase artifacts
  { id:'n36', phase:'decommission', title:'Lifecycle Planning Canvas',         subtitle:'End-of-life planning for systems and capabilities: retirement triggers, transition timelines, dependency resolution, data archival, and knowledge transfer',  link:'https://iasa-global.github.io/btabok/lifecycle_planning_canvas.html',        badge:'BTABoK', importance:3 },
] as Omit<NodeData,'num'>[]).map((n, i) => ({ ...n, num: String(i + 1).padStart(2, '0') } as NodeData)));

// ─── edge data ────────────────────────────────────────────────────────────────
// importance: 1=extra high  2=ultra high  3=non-negotiable
export const EDGES: EdgeData[] = [
  // ── Business Model Canvas (n01) ───────────────────────────────────────────
  { id:'e01',  from:'n01', to:'n02', label:'seeds capability hierarchy',                     importance:3, btabok:true },

  // ── Architect Stakeholder Canvas (n03) ───────────────────────────────────
  { id:'e06',  from:'n03', to:'n04', label:'stakeholders populate grid',                     importance:2, btabok:true },

  // ── Business Case / NABC Card (n05) ──────────────────────────────────────
  { id:'e43',  from:'n05', to:'n06', label:'business constraints → principles',              importance:2, btabok:true },
  { id:'e11',  from:'n05', to:'n12', label:'success criteria inform architecture definition', importance:2, btabok:true },

  // ── Architecture Principles (n06) ────────────────────────────────────────
  { id:'e12',  from:'n06', to:'n12', label:'principles populate definition',                 importance:3, btabok:true },
  // ── Context View Card (n08) ───────────────────────────────────────────────
  { id:'e118', from:'n05', to:'n08', label:'business case defines solution scope for context view', importance:3, btabok:true },
  { id:'e15',  from:'n08', to:'n09', label:'external interactions trigger ASRs',             importance:3, btabok:true },
  { id:'e23',  from:'n08', to:'n16', label:'system boundary scopes bounded contexts',        importance:2 },

  // ── ASR Card (n09) ────────────────────────────────────────────────────────
  { id:'e18',  from:'n09', to:'n14', label:'ASR IDs referenced in ADR',                     importance:3, btabok:true },

  // ── Architecture Hypothesis Canvas (n10) ─────────────────────────────────
  { id:'e20',  from:'n10', to:'n14', label:'validated hypothesis informs ADR',               importance:2, btabok:true },

  // ── Architecture Definition Canvas (n12) ─────────────────────────────────
  { id:'e22',  from:'n12', to:'n13', label:'scope constrains design options',                importance:2, btabok:true },

  // ── Solution Design Canvas (n13) ─────────────────────────────────────────
  { id:'e25',  from:'n13', to:'n14', label:'design options trigger ADR decisions',            importance:3, btabok:true },

  // ── ADR Card (n14) ────────────────────────────────────────────────────────
  { id:'e27',  from:'n14', to:'n15', label:'spawns cascade card',                            importance:3, btabok:true },
  { id:'e28',  from:'n14', to:'n21', label:'technical debt formalized as loan request',       importance:2, btabok:true },

  // ── Bounded Context Canvas (n16) ─────────────────────────────────────────
  { id:'e30',  from:'n16', to:'n17', label:'domain model drives service interface',           importance:2 },

  // ── Service Interface Design Canvas (n17) ────────────────────────────────
  { id:'e33',  from:'n17', to:'n20', label:'operations → sequence messages',                 importance:1 },

  // ── Technical Loan Request Card (n21) ────────────────────────────────────
  { id:'e36',  from:'n21', to:'n22', label:'debt reduces realised benefits',                 importance:2, btabok:true },
  { id:'e38',  from:'n22', to:'n21', label:'benefits analysis surfaces new technical debt',  importance:2, btabok:true },

  // ── Benefits Realization View Canvas (n22) ───────────────────────────────
  { id:'e37',  from:'n22', to:'n07', label:'outcomes reprioritise roadmap',                  importance:3, btabok:true },
  { id:'e40',  from:'n22', to:'n01', label:'realized value informs business model refresh',   importance:3, btabok:true },

  // ── QATT Card (n11) ───────────────────────────────────────────────────────
  { id:'e48',  from:'n09', to:'n11', label:'ASRs define quality scenarios',                  importance:3, btabok:true },
  { id:'e49',  from:'n08', to:'n11', label:'context sets stimulus environment',              importance:2, btabok:true },
  { id:'e50',  from:'n11', to:'n14', label:'QA tactics inform ADR decisions',                importance:3, btabok:true },

  // ── Strategic Roadmap Canvas (n30) ───────────────────────────────────────
  { id:'e82',  from:'n02', to:'n30', label:'capabilities anchor strategic IT initiatives',   importance:2, btabok:true },
  { id:'e83',  from:'n05', to:'n30', label:'business case defines initiative scope',         importance:2, btabok:true },
  { id:'e84',  from:'n06', to:'n30', label:'principles constrain strategic initiatives',     importance:3, btabok:true },
  { id:'e85',  from:'n23', to:'n30', label:'OKRs align strategic IT direction',              importance:3, btabok:true },
  { id:'e86',  from:'n30', to:'n07', label:'strategic IT direction → phased delivery',       importance:3, btabok:true },

  // ── OKR Card (n23) ────────────────────────────────────────────────────────
  { id:'e51',  from:'n05', to:'n23', label:'business case seeds OKR objectives',             importance:3, btabok:true },
  { id:'e53',  from:'n23', to:'n07', label:'objectives set roadmap goals',                   importance:3, btabok:true },
  { id:'e54',  from:'n22', to:'n23', label:'realized benefits validate OKRs',               importance:2, btabok:true },

  // ── Capability Card (n24) ─────────────────────────────────────────────────
  { id:'e55',  from:'n02', to:'n24', label:'capabilities assessed for maturity',             importance:3, btabok:true },
  { id:'e56',  from:'n24', to:'n07', label:'capability gaps drive roadmap priorities',       importance:3, btabok:true },
  { id:'e58',  from:'n24', to:'n25', label:'weak capabilities expose risks',                 importance:2, btabok:true },

  // ── Risk Methods Cards (n25) ──────────────────────────────────────────────
  { id:'e61',  from:'n25', to:'n14', label:'risks trigger ADRs',                             importance:3, btabok:true },
  { id:'e62',  from:'n25', to:'n09', label:'risks become ASRs',                              importance:3, btabok:true },
  { id:'e63',  from:'n25', to:'n29', label:'risk exposure → security requirements',          importance:2 },

  // ── Service Blueprint (n26) ───────────────────────────────────────────────
  { id:'e67',  from:'n08', to:'n26', label:'context boundary scopes service blueprint',      importance:2, btabok:true },
  { id:'e68',  from:'n26', to:'n17', label:'front-stage operations → service interface',     importance:2, btabok:true },

  // ── Application View Card (n28) ──────────────────────────────────────────
  { id:'e74',  from:'n08', to:'n28', label:'context boundary decomposed to containers',      importance:3 },
  { id:'e75',  from:'n16', to:'n28', label:'bounded contexts map to containers',             importance:3 },
  { id:'e76',  from:'n28', to:'n17', label:'containers expose service interfaces',           importance:2 },
  { id:'e77',  from:'n28', to:'n18', label:'containers mapped to deployment nodes',          importance:2 },
  { id:'e78',  from:'n28', to:'n09', label:'structural decomposition surfaces ASRs',         importance:2 },
  { id:'e106', from:'n28', to:'n14', label:'container decomposition decisions → ADRs',       importance:2 },

  // ── Security Architecture View (n29) ──────────────────────────────────────
  { id:'e80',  from:'n29', to:'n14', label:'security decisions → ADRs',                      importance:3 },
  { id:'e81',  from:'n29', to:'n18', label:'security zones constrain deployment',            importance:2 },

  // ── Physical View Card (n18) ──────────────────────────────────────────────
  { id:'e107', from:'n18', to:'n09', label:'deployment topology surfaces availability ASRs', importance:2 },
  { id:'e108', from:'n18', to:'n14', label:'infrastructure decisions → ADRs',                importance:2 },

  // ── Process View Card (n20) ───────────────────────────────────────────────
  { id:'e109', from:'n20', to:'n09', label:'scenario flows validate ASR fulfillment',        importance:1 },
  { id:'e110', from:'n20', to:'n14', label:'interaction patterns trigger ADR decisions',     importance:1 },

  // ── Value Stream Map (n31) ────────────────────────────────────────────────
  { id:'e87',  from:'n02', to:'n31', label:'capabilities are building blocks of value streams', importance:3, btabok:true },
  { id:'e88',  from:'n31', to:'n26', label:'value stream steps surface in service blueprint',    importance:3, btabok:true },
  { id:'e89',  from:'n31', to:'n16', label:'value stream analysis drives bounded context boundaries', importance:2 },
  { id:'e91',  from:'n23', to:'n31', label:'OKRs set value stream performance targets',         importance:2, btabok:true },

  // ── Customer Journey Map (n32) ────────────────────────────────────────────
  { id:'e92',  from:'n32', to:'n26', label:'customer actions align with service blueprint',  importance:3, btabok:true },
  { id:'e93',  from:'n32', to:'n23', label:'journey pain points feed OKR goal-setting',      importance:2, btabok:true },
  { id:'e94',  from:'n32', to:'n05', label:'journey improvements justify business case',     importance:2, btabok:true },
  { id:'e95',  from:'n32', to:'n31', label:'customer journey insights inform value stream',  importance:2, btabok:true },

  // ── JTBD Card (n33) ───────────────────────────────────────────────────────
  { id:'e96',  from:'n34', to:'n33', label:'persona defines who holds the job',              importance:3, btabok:true },
  { id:'e97',  from:'n33', to:'n32', label:'jobs frame customer journey touchpoints',        importance:3, btabok:true },
  { id:'e98',  from:'n33', to:'n05', label:'unmet jobs justify business case investment',    importance:2, btabok:true },
  { id:'e99',  from:'n33', to:'n23', label:'customer jobs define OKR success metrics',       importance:2, btabok:true },

  // ── Customer Persona (n34) ────────────────────────────────────────────────
  { id:'e100', from:'n01', to:'n34', label:'customer segment in BMC grounds persona',        importance:3, btabok:true },
  { id:'e101', from:'n34', to:'n32', label:'persona behaviour shapes journey mapping',       importance:3, btabok:true },
  { id:'e103', from:'n34', to:'n35', label:'persona deepened by stakeholder empathy map',   importance:2, btabok:true },

  // ── Stakeholder Empathy Map (n35) ─────────────────────────────────────────
  { id:'e104', from:'n35', to:'n32', label:'empathy insights enrich journey touchpoints',   importance:2, btabok:true },

  // ── Lifecycle Planning Canvas (n36) ──────────────────────────────────────
  { id:'e105', from:'n22', to:'n36', label:'low/negative benefits trigger lifecycle planning',    importance:3, btabok:true },

  // ── Transition Roadmap Canvas (n37) ──────────────────────────────────────
  { id:'e111', from:'n30', to:'n37', label:'strategic IT initiatives → transition scope',         importance:3, btabok:true },
  { id:'e112', from:'n37', to:'n07', label:'transition steps populate layered roadmap lanes',      importance:2, btabok:true },
  { id:'e113', from:'n24', to:'n37', label:'capability maturity gaps drive transition priorities',importance:2, btabok:true },
  { id:'e114', from:'n08', to:'n37', label:'current-state context scopes transition boundary',    importance:2, btabok:true },
  { id:'e115', from:'n37', to:'n14', label:'transition decisions captured as ADRs',               importance:2, btabok:true },
  { id:'e116', from:'n37', to:'n28', label:'transition milestones drive application decomposition',importance:2, btabok:true },
  { id:'e117', from:'n37', to:'n09', label:'transition constraints surface new ASRs',             importance:2, btabok:true },

];
