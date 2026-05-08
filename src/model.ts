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
  purple: 'Core SCA',
  teal:   'Software SCA',
  coral:  'Solution SCA',
  green:  'Architecture practice',
  gray:   'Recurring',
  amber:  'External standard',
};

export const PHASE_STYLES: Record<string, { bg: string; band: string; text: string }> = {
  innovation:     { bg: '#FFF8F0', band: '#FFDEAA', text: '#92400E' },
  strategy:       { bg: '#F0FAF4', band: '#86EFAC', text: '#14532D' },
  planning:       { bg: '#EFF6FF', band: '#93C5FD', text: '#1E3A8A' },
  transformation: { bg: '#FFF0F4', band: '#FDA4AF', text: '#881337' },
  utilize:        { bg: '#F5F3FF', band: '#C4B5FD', text: '#4C1D95' },
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
  badge: string; badgeColor: string;
  note?: string; recurring?: boolean; external?: boolean;
  link?: string;
  x: number; y: number;
}
export interface EdgeData {
  id: string; from: string; to: string; label: string;
  tag?: 'input';
}

// ─── node data ────────────────────────────────────────────────────────────────
export const NODES: NodeData[] = [
  { id:'n01', phase:'innovation',     num:'01', title:'Business Model Canvas',                subtitle:'Value proposition, customers, revenue streams',                link:'https://iasa-global.github.io/btabok/business_model_canvas.html',                badge:'Core SCA',           badgeColor:'purple', x:50,   y:60   },
  { id:'n02', phase:'strategy',       num:'02', title:'Business Capability Canvas',           subtitle:'What the business does, capability hierarchy',                 link:'https://iasa-global.github.io/btabok/business_capability_canvas.html',  badge:'Core SCA',           badgeColor:'purple', x:310,  y:60  },
  { id:'n03', phase:'strategy',       num:'03', title:'Architect Stakeholder Canvas',         subtitle:'All parties, engagement levels, governance',                   link:'https://iasa-global.github.io/btabok/architect_stakeholder_canvas.html',   badge:'Core SCA',           badgeColor:'purple', x:310,  y:220  },
  { id:'n04', phase:'strategy',       num:'04', title:'Power-Interest Grid',                  subtitle:'2×2 prioritisation by power and interest',                    link:'https://iasa-global.github.io/btabok/power_interest_grid.html',                                                               badge:'Core SCA',           badgeColor:'purple', x:310,  y:380  },
  { id:'n05', phase:'strategy',       num:'05', title:'Business Case (NABC Card)',            subtitle:'Need, approach, benefit, competition',                         link:'https://iasa-global.github.io/btabok/nabc_card.html',                                                                badge:'Core SCA',           badgeColor:'purple', x:310,  y:540  },
  { id:'n06', phase:'strategy',       num:'06', title:'Architecture Principles Register',     subtitle:'Principles from capabilities and constraints, linked to ADRs', link:'https://iasa-global.github.io/btabok/architecture_principles_canvas.html',  badge:'Architecture practice', badgeColor:'green', note:'BTABoK Principles topic — no SCA canvas; maintain as a structured register', x:310,  y:700 },
  { id:'n07', phase:'strategy',       num:'07', title:'Layered Roadmap Canvas',               subtitle:'Current → target state, phased investment gates',              link:'https://iasa-global.github.io/btabok/layered_roadmap_canvas.html',        badge:'Core SCA',           badgeColor:'purple', x:310,  y:860  },
  { id:'n08', phase:'planning',       num:'08', title:'Context View Card',                    subtitle:'System boundary, external actors, interfaces',                 link:'https://iasa-global.github.io/btabok/context_view_card.html',           badge:'Core SCA',           badgeColor:'purple', x:570,  y:60  },
  { id:'n09', phase:'planning',       num:'09', title:'ASR Card',                             subtitle:'Architecturally significant requirements',                     link:'https://iasa-global.github.io/btabok/asr_card.html',                     badge:'Core SCA',           badgeColor:'purple', x:570,  y:220  },
  { id:'n10', phase:'planning',       num:'10', title:'Architecture Hypothesis Canvas',       subtitle:'Assumption → experiment → success metric',                    link:'https://iasa-global.github.io/btabok/architecture_hypothesis_canvas.html', badge:'Core SCA',           badgeColor:'purple', x:570,  y:380  },
  { id:'n11', phase:'planning',       num:'11', title:'QATT Card',                            subtitle:'Stimulus–response quality attribute scenarios',                link:'https://iasa-global.github.io/btabok/qatt_card.html',                    badge:'Software SCA',       badgeColor:'teal',   x:570,  y:540  },
  { id:'n12', phase:'planning',       num:'12', title:'Architecture Definition Canvas',       subtitle:'Scope, principles, key decisions on one page',                 link:'https://iasa-global.github.io/btabok/architecture_definition_canvas.html', badge:'Core SCA',           badgeColor:'purple', x:570,  y:700  },
  { id:'n13', phase:'planning',       num:'13', title:'Solution Design Canvas',               subtitle:'Problem → options → hypotheses',                              link:'https://iasa-global.github.io/btabok/solution_design_canvas.html',        badge:'Solution SCA',       badgeColor:'coral',  note:'Spans Planning → Transformation continuously', x:570,  y:860 },
  { id:'n14', phase:'planning',       num:'14', title:'Architecture Decision Record',         subtitle:'Options scored, chosen decision, trade-offs',                  link:'https://iasa-global.github.io/btabok/architecture_decision_record.html',                                                                                             badge:'Recurring',          badgeColor:'gray',   note:'Core SCA — new ADR for every significant decision in Planning and Transformation', recurring:true, x:570,  y:1020 },
  { id:'n15', phase:'planning',       num:'15', title:'Architecture Decision Cascade Card',   subtitle:'Downstream ripple effects of each decision',                   link:'https://iasa-global.github.io/btabok/architecture_decision_cascade_card.html', badge:'Recurring',      badgeColor:'gray',   note:'Core SCA — one Cascade Card per ADR, in both phases', recurring:true, x:570,  y:1180 },
  { id:'n16', phase:'transformation', num:'16', title:'Bounded Context Canvas',               subtitle:'DDD boundaries, language, dependencies',                      link:'https://github.com/ddd-crew/bounded-context-canvas',                                                                 badge:'Core SCA',           badgeColor:'purple', x:830,  y:60  },
  { id:'n17', phase:'transformation', num:'17', title:'Service Interface Design Canvas',      subtitle:'Operations, contracts, SLAs, consumers',                      link:'https://iasa-global.github.io/btabok/service_interface_canvas.html',     badge:'Software SCA',       badgeColor:'teal',   x:830,  y:220  },
  { id:'n18', phase:'transformation', num:'18', title:'Deployment / Infrastructure View',     subtitle:'Components mapped to nodes, networks, environments',           link:'https://c4model.com/#DeploymentDiagram',                                                                             badge:'External standard',  badgeColor:'amber',  note:'BTABoK gap: physical view (Views & Viewpoints) — use C4 Deployment or UML Deployment Diagram', external:true, x:830,  y:380 },
  { id:'n19', phase:'transformation', num:'19', title:'Data / Information Architecture View', subtitle:'Entities, ownership, flows, persistence boundaries',           link:'https://iasa-global.github.io/btabok/information_architecture_view.html', badge:'External standard',  badgeColor:'amber',  note:'BTABoK gap: Information Architecture tag — use ERD or Data Flow Diagram', external:true, x:830,  y:540 },
  { id:'n20', phase:'transformation', num:'20', title:'Sequence / Scenario View',             subtitle:'Time-ordered message flow for key use cases',                  link:'https://c4model.com/#DynamicDiagram',                                                                                badge:'External standard',  badgeColor:'amber',  note:'BTABoK gap: scenario view (Views & Viewpoints) — use UML Sequence or C4 Dynamic Diagram', external:true, x:830,  y:700 },
  { id:'n21', phase:'transformation', num:'21', title:'Technical Loan Request Card',          subtitle:'Debt as a loan: principal, interest, repayment plan',          link:'https://iasa-global.github.io/btabok/technical_loan_request_card.html',  badge:'Software SCA',       badgeColor:'teal',   x:830,  y:860 },
  { id:'n22', phase:'utilize',        num:'22', title:'Benefits Realization View Canvas',     subtitle:'Decisions → enablers → measurable business benefits',         link:'https://iasa-global.github.io/btabok/benefits_realization_view_canvas.html', badge:'Software SCA',     badgeColor:'teal',   x:1090, y:60 },
];

// ─── edge data ────────────────────────────────────────────────────────────────
export const EDGES: EdgeData[] = [
  { id:'e01', from:'n01', to:'n02', label:'seeds capability hierarchy',     tag:'input' },
  { id:'e02', from:'n01', to:'n07', label:'sets investment gates' },
  { id:'e03', from:'n02', to:'n06', label:'source for principles',           tag:'input' },
  { id:'e04', from:'n02', to:'n07', label:'capability gaps drive phases' },
  { id:'e05', from:'n02', to:'n08', label:'capabilities in scope → boundary' },
  { id:'e06', from:'n03', to:'n04', label:'populates grid',                  tag:'input' },
  { id:'e07', from:'n03', to:'n06', label:'constraints feed principles' },
  { id:'e08', from:'n03', to:'n08', label:'stakeholders → context actors' },
  { id:'e09', from:'n04', to:'n14', label:'approvers named in ADR' },
  { id:'e10', from:'n05', to:'n07', label:'scope constrains roadmap' },
  { id:'e11', from:'n05', to:'n12', label:'success criteria → definition',  tag:'input' },
  { id:'e12', from:'n06', to:'n12', label:'principles populate definition',  tag:'input' },
  { id:'e13', from:'n06', to:'n14', label:'principles referenced in ADR' },
  { id:'e14', from:'n07', to:'n12', label:'phase scope constrains definition' },
  { id:'e15', from:'n08', to:'n09', label:'interactions trigger ASRs',       tag:'input' },
  { id:'e16', from:'n08', to:'n18', label:'external nodes → deployment',    tag:'input' },
  { id:'e17', from:'n08', to:'n20', label:'actors → sequence lifelines' },
  { id:'e18', from:'n09', to:'n14', label:'ASR IDs referenced in ADR',       tag:'input' },
  { id:'e19', from:'n10', to:'n11', label:'evidence sets QATT thresholds',  tag:'input' },
  { id:'e20', from:'n10', to:'n14', label:'results confirm ADR assumption' },
  { id:'e21', from:'n11', to:'n12', label:'thresholds → acceptance criteria', tag:'input' },
  { id:'e22', from:'n12', to:'n13', label:'scope constrains design options',  tag:'input' },
  { id:'e23', from:'n12', to:'n16', label:'boundary → context partitioning' },
  { id:'e24', from:'n12', to:'n22', label:'objectives baseline benefits' },
  { id:'e25', from:'n13', to:'n14', label:'options → ADR scored columns',    tag:'input' },
  { id:'e26', from:'n13', to:'n16', label:'options → bounded contexts' },
  { id:'e27', from:'n14', to:'n15', label:'spawns cascade card',             tag:'input' },
  { id:'e28', from:'n14', to:'n21', label:'shortcuts → loan card',           tag:'input' },
  { id:'e29', from:'n15', to:'n12', label:'cascade invalidation → revise' },
  { id:'e30', from:'n16', to:'n17', label:'language → service operations',   tag:'input' },
  { id:'e31', from:'n16', to:'n19', label:'ownership → data entities',       tag:'input' },
  { id:'e32', from:'n17', to:'n14', label:'tech choices trigger ADR' },
  { id:'e33', from:'n17', to:'n20', label:'operations → sequence messages',  tag:'input' },
  { id:'e34', from:'n18', to:'n20', label:'nodes constrain call topology' },
  { id:'e35', from:'n19', to:'n20', label:'data flows → sequence arrows',     tag:'input' },
  { id:'e36', from:'n21', to:'n22', label:'debt reduces realised benefits',  tag:'input' },
  { id:'e37', from:'n22', to:'n07', label:'outcomes reprioritise roadmap',   tag:'input' },
  { id:'e38', from:'n22', to:'n14', label:'shortfall → revisit ADR' },
  { id:'e39', from:'n22', to:'n21', label:'unrealised benefits → renegotiate' },
  { id:'e40', from:'n22', to:'n01', label:'lessons open new innovation cycle', tag:'input' },
  { id:'e41', from:'n02', to:'n03', label:'capabilities frame stakeholder scope', tag:'input' },
  { id:'e42', from:'n04', to:'n05', label:'priority stakeholders → NABC audience', tag:'input' },
  { id:'e43', from:'n05', to:'n06', label:'business constraints → principles',     tag:'input' },
  { id:'e44', from:'n06', to:'n07', label:'principles constrain roadmap phases',   tag:'input' },
  { id:'e45', from:'n07', to:'n08', label:'roadmap scope → system boundary',       tag:'input' },
  { id:'e46', from:'n09', to:'n10', label:'ASRs generate hypotheses',              tag:'input' },
  { id:'e47', from:'n15', to:'n16', label:'cascade effects → context boundaries',  tag:'input' },
  { id:'e48', from:'n17', to:'n18', label:'service contracts → deployment topology', tag:'input' },
  { id:'e49', from:'n18', to:'n19', label:'component boundaries → data ownership', tag:'input' },
  { id:'e50', from:'n20', to:'n21', label:'complexity revealed → debt identified', tag:'input' },
];
