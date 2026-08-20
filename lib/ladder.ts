/**
 * The escalation ladder is the product (§1).
 *
 * Hard rule: the internal tier name NEVER appears in the email the client
 * receives. The humour lives entirely in our interface; the emails are
 * impeccably professional (§1, §6a).
 */

export type TierId = 1 | 2 | 3 | 4 | 5;

export interface Tier {
  id: TierId;
  /** Internal name — user-facing in our UI only. */
  name: string;
  /** Default offset in days from the invoice due date. */
  defaultOffset: number;
  /** What the client sees, described for our own marketing copy. */
  clientSees: string;
  /** CSS custom property carrying this tier's colour. */
  colorVar: `--t${TierId}-${string}`;
  /** Pale chip background for this tier. */
  washVar: `--t${TierId}-wash`;
  /** Deep ink that passes contrast on `washVar`. */
  deepVar: `--t${TierId}-deep`;
}

export const TIERS: readonly Tier[] = [
  {
    id: 1,
    name: "Friendly",
    defaultOffset: 3,
    clientSees: "Warm, assumes it slipped through",
    colorVar: "--t1-friendly",
    washVar: "--t1-wash",
    deepVar: "--t1-deep",
  },
  {
    id: 2,
    name: "Gentle",
    defaultOffset: 10,
    clientSees: "Brief, factual, restates the link",
    colorVar: "--t2-gentle",
    washVar: "--t2-wash",
    deepVar: "--t2-deep",
  },
  {
    id: 3,
    name: "Concerned",
    defaultOffset: 21,
    clientSees: "Names the delay, asks for a date",
    colorVar: "--t3-concerned",
    washVar: "--t3-wash",
    deepVar: "--t3-deep",
  },
  {
    id: 4,
    name: "Disappointed",
    defaultOffset: 30,
    clientSees: "Formal, references the agreement",
    colorVar: "--t4-disappointed",
    washVar: "--t4-wash",
    deepVar: "--t4-deep",
  },
  {
    id: 5,
    name: "Final Notice",
    defaultOffset: 45,
    clientSees: "Cold, states what happens next",
    colorVar: "--t5-final",
    washVar: "--t5-wash",
    deepVar: "--t5-deep",
  },
] as const;

export function getTier(id: TierId): Tier {
  const tier = TIERS.find((t) => t.id === id);
  if (!tier) throw new Error(`Unknown tier: ${id}`);
  return tier;
}

/** Three presets and nothing else (§3b). */
export type CadenceId = "gentle" | "standard" | "relentless";

export interface Cadence {
  id: CadenceId;
  name: string;
  /** [dayOffsetFromDue, tier] pairs, in send order. */
  steps: readonly (readonly [offset: number, tier: TierId])[];
}

export const CADENCES: Record<CadenceId, Cadence> = {
  gentle: {
    id: "gentle",
    name: "Gentle",
    steps: [
      [7, 1],
      [21, 2],
      [45, 3],
    ],
  },
  standard: {
    id: "standard",
    name: "Standard",
    steps: [
      [3, 1],
      [10, 2],
      [21, 3],
      [30, 4],
    ],
  },
  relentless: {
    id: "relentless",
    name: "Relentless",
    steps: [
      [2, 1],
      [7, 2],
      [14, 3],
      [21, 4],
      [30, 5],
      [45, 5], // reuses tier 5
    ],
  },
};

export const DEFAULT_CADENCE: CadenceId = "standard";

/** Invoice lifecycle (§3d). */
export type InvoiceStatus =
  | "draft"
  | "scheduled"
  | "chasing"
  | "paused"
  | "paid"
  | "written_off"
  | "exhausted";

export type StepStatus = "pending" | "sent" | "failed" | "cancelled" | "skipped";
