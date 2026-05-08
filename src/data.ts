export const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  // innovation
  n01: { x:40,   y:60  },
  // strategy
  n02: { x:330,  y:540 },
  n24: { x:540,  y:700 },   // Capability Assessment — below / right of Capability Canvas
  n03: { x:440,  y:180 },
  n04: { x:800,  y:140 },
  n05: { x:1280, y:140 },
  n23: { x:1280, y:360 },   // OKR Card — right of NABC, bridges strategy to measurable outcomes
  n25: { x:1040, y:360 },   // Risk Methods Card — mid-strategy, feeds ADRs + ASRs
  n26: { x:310,  y:340 },   // Service Blueprint Canvas — left-strategy, bridges stakeholders → context
  n06: { x:780,  y:580 },
  n07: { x:1220, y:500 },
  // planning
  n08: { x:1570, y:360 },
  n27: { x:1800, y:580 },   // Event Storming — below Context View, feeds Bounded Contexts
  n09: { x:2020, y:160 },
  n10: { x:2420, y:80  },
  n11: { x:2420, y:340 },
  n12: { x:2410, y:700 },
  n13: { x:2730, y:700 },
  n14: { x:2750, y:160 },
  n15: { x:2930, y:420 },
  // transformation
  n16: { x:3220, y:60  },
  n28: { x:3460, y:360 },   // Container/Component View — between Context and Service Interface
  n17: { x:3740, y:80  },
  n18: { x:3300, y:580 },
  n29: { x:4080, y:580 },   // Security Architecture — below Data View, beside Sequence View
  n19: { x:4020, y:400 },
  n20: { x:4318, y:300 },
  n21: { x:4440, y:660 },
  // utilize
  n22: { x:4730, y:60  },
  n30: { x:4960, y:280 },   // Architecture Health Scorecard — right of Benefits Realization
};
