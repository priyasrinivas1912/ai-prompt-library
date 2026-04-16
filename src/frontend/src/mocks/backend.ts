import type { backendInterface } from "../backend";

const samplePrompts = [
  {
    id: BigInt(1),
    title: "Epic Fantasy Landscape",
    content:
      "A breathtaking fantasy landscape featuring towering mountains draped in mist, ancient forests glowing with bioluminescent light, and a medieval castle perched on a cliff above a silver river. Golden hour lighting, ultra-detailed, cinematic composition.",
    complexity: BigInt(3),
    view_count: BigInt(42),
    created_at: BigInt(Date.now() * 1_000_000 - 3 * 24 * 60 * 60 * 1_000_000_000),
  },
  {
    id: BigInt(2),
    title: "Cyberpunk Street Market",
    content:
      "Neon-soaked cyberpunk street market at night, holographic vendor signs in Japanese and Chinese, rain-slicked cobblestones reflecting colorful lights, crowds of people wearing augmented reality gear, street food stalls with glowing menus, detailed urban environment.",
    complexity: BigInt(6),
    view_count: BigInt(128),
    created_at: BigInt(Date.now() * 1_000_000 - 7 * 24 * 60 * 60 * 1_000_000_000),
  },
  {
    id: BigInt(3),
    title: "Deep Ocean Alien Ecosystem",
    content:
      "Alien deep-sea ecosystem with bioluminescent creatures of impossible shapes, towering coral structures that defy physics, transparent beings with visible internal organs, soft purple and teal lighting emanating from the seafloor, photorealistic macro photography style.",
    complexity: BigInt(9),
    view_count: BigInt(75),
    created_at: BigInt(Date.now() * 1_000_000 - 14 * 24 * 60 * 60 * 1_000_000_000),
  },
  {
    id: BigInt(4),
    title: "Minimalist Zen Garden",
    content:
      "Serene minimalist Japanese zen garden in morning fog, precisely raked white gravel patterns, single moss-covered stone, cherry blossoms falling, soft diffused light.",
    complexity: BigInt(2),
    view_count: BigInt(19),
    created_at: BigInt(Date.now() * 1_000_000 - 2 * 24 * 60 * 60 * 1_000_000_000),
  },
  {
    id: BigInt(5),
    title: "Steampunk Airship Battle",
    content:
      "Epic aerial battle between Victorian steampunk airships, massive brass propellers, billowing steam clouds, cannons firing bolts of electricity, crew members in goggles and top hats manning battle stations, stormy sunset backdrop with dramatic lighting.",
    complexity: BigInt(8),
    view_count: BigInt(94),
    created_at: BigInt(Date.now() * 1_000_000 - 5 * 24 * 60 * 60 * 1_000_000_000),
  },
];

let viewCounts = new Map<bigint, bigint>(
  samplePrompts.map((p) => [p.id, p.view_count])
);

export const mockBackend: backendInterface = {
  getPrompts: async () => {
    return samplePrompts.map((p) => ({
      ...p,
      view_count: viewCounts.get(p.id) ?? p.view_count,
    }));
  },

  getPrompt: async (id: bigint) => {
    const prompt = samplePrompts.find((p) => p.id === id);
    if (!prompt) {
      return {
        __kind__: "err" as const,
        err: { __kind__: "NotFound" as const, NotFound: null },
      };
    }
    const newCount = (viewCounts.get(id) ?? prompt.view_count) + BigInt(1);
    viewCounts.set(id, newCount);
    return {
      __kind__: "ok" as const,
      ok: { ...prompt, view_count: newCount },
    };
  },

  createPrompt: async (title: string, content: string, complexity: bigint) => {
    if (title.length < 3) {
      return {
        __kind__: "err" as const,
        err: {
          __kind__: "InvalidTitle" as const,
          InvalidTitle: "Title must be at least 3 characters",
        },
      };
    }
    if (content.length < 20) {
      return {
        __kind__: "err" as const,
        err: {
          __kind__: "InvalidContent" as const,
          InvalidContent: "Content must be at least 20 characters",
        },
      };
    }
    if (complexity < BigInt(1) || complexity > BigInt(10)) {
      return {
        __kind__: "err" as const,
        err: {
          __kind__: "InvalidComplexity" as const,
          InvalidComplexity: "Complexity must be between 1 and 10",
        },
      };
    }
    const newId = BigInt(samplePrompts.length + 1);
    const newPrompt = {
      id: newId,
      title,
      content,
      complexity,
      view_count: BigInt(0),
      created_at: BigInt(Date.now() * 1_000_000),
    };
    samplePrompts.push(newPrompt);
    viewCounts.set(newId, BigInt(0));
    return { __kind__: "ok" as const, ok: newPrompt };
  },
};
