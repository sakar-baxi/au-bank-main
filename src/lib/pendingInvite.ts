/** localStorage key written by RM Invite / employee journey launchers. */
export const PENDING_INVITE_KEY = "pendingInvite";

/**
 * sessionStorage backup so React Strict Mode remounts (or a fast refresh) still
 * have HRMS prefill after pendingInvite is consumed from localStorage.
 */
export const ACTIVE_INVITE_KEY = "activeSalaryInvite";

export function stashPendingInvite(invite: unknown) {
  const raw = JSON.stringify(invite);
  try {
    localStorage.setItem(PENDING_INVITE_KEY, raw);
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.setItem(ACTIVE_INVITE_KEY, raw);
  } catch {
    /* ignore */
  }
}

/** Read invite payload; prefer fresh pendingInvite, fall back to tab-scoped backup. */
export function readStashedInvite(): string | null {
  try {
    return localStorage.getItem(PENDING_INVITE_KEY) || sessionStorage.getItem(ACTIVE_INVITE_KEY);
  } catch {
    return null;
  }
}

export function consumePendingInviteFromLocalStorage() {
  try {
    localStorage.removeItem(PENDING_INVITE_KEY);
  } catch {
    /* ignore */
  }
}
