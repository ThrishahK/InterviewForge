/**
 * AmbientBackground
 *
 * Purely decorative, fixed behind page content. Kept out of BareLayout
 * intentionally - the interview screen should stay distraction-free per the
 * brief ("the user should stay focused"). Opacity is intentionally very low
 * and movement very slow; this should read as "premium texture", not as
 * something a user consciously notices.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -top-40 -left-32 h-[32rem] w-[32rem] animate-drift rounded-full bg-indigo-400 opacity-[0.06] blur-3xl dark:bg-indigo-500 dark:opacity-[0.10]"
      />
      <div
        className="absolute top-1/3 -right-40 h-[36rem] w-[36rem] animate-drift-slow rounded-full bg-zinc-400 opacity-[0.05] blur-3xl dark:bg-indigo-400 dark:opacity-[0.07]"
      />
      <div
        className="absolute bottom-0 left-1/4 h-[28rem] w-[28rem] animate-drift rounded-full bg-indigo-300 opacity-[0.04] blur-3xl dark:bg-zinc-500 dark:opacity-[0.06]"
        style={{ animationDelay: '-8s' }}
      />
    </div>
  );
}
