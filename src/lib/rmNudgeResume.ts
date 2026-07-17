/**
 * Map RM nudge journey category labels to employee portal resume behavior.
 */

export type RmNudgeResumeKind = "salary_journey" | "my_journey_status";

export function resolveRmNudgeResumeKind(journeyCategoryLabel: string): RmNudgeResumeKind {
  const cat = journeyCategoryLabel.trim().toLowerCase();
  if (!cat) return "my_journey_status";
  if (cat.includes("ntb") || cat.includes("alternate")) return "salary_journey";
  if (cat.includes("kyc") || cat.includes("etb with")) return "salary_journey";
  if (cat.includes("auto") || cat.includes("conv")) return "salary_journey";
  return "my_journey_status";
}
