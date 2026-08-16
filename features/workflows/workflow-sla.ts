/** SLA helpers shared by the 360 progression and the guichet work queue. */

/** Milliseconds for an SLA `duration_unit`, tolerant of FR/EN singular/plural. */
const UNIT_MS: Record<string, number> = {
  minute: 60_000,
  minutes: 60_000,
  min: 60_000,
  heure: 3_600_000,
  heures: 3_600_000,
  hour: 3_600_000,
  hours: 3_600_000,
  h: 3_600_000,
  jour: 86_400_000,
  jours: 86_400_000,
  day: 86_400_000,
  days: 86_400_000,
  j: 86_400_000,
  semaine: 604_800_000,
  semaines: 604_800_000,
  week: 604_800_000,
  weeks: 604_800_000,
  mois: 2_592_000_000,
  month: 2_592_000_000,
  months: 2_592_000_000,
};

interface SlaLike {
  duration_value: number;
  duration_unit: string;
}

/** SLA duration in ms, or null when the unit is unrecognized. */
export function slaDurationMs(sla: SlaLike): number | null {
  const unit = UNIT_MS[sla.duration_unit?.toLowerCase()?.trim()] ?? 0;
  return unit ? sla.duration_value * unit : null;
}

/** `now − deadline` (positive = overdue) for a step started at `startISO`, or null. */
export function slaOverdueMs(
  startISO: string | null | undefined,
  sla: SlaLike | undefined,
): number | null {
  if (!startISO || !sla) return null;
  const dur = slaDurationMs(sla);
  if (dur == null) return null;
  return Date.now() - (new Date(startISO).getTime() + dur);
}

/** Coarse human duration: "3 j" / "5 h" / "12 min". */
export function humanDuration(ms: number): string {
  const abs = Math.abs(ms);
  const d = Math.floor(abs / 86_400_000);
  if (d >= 1) return `${d} j`;
  const h = Math.floor(abs / 3_600_000);
  if (h >= 1) return `${h} h`;
  return `${Math.max(1, Math.floor(abs / 60_000))} min`;
}
