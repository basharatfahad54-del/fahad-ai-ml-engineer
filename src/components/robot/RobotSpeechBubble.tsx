import { forwardRef } from "react"

type RobotSpeechBubbleProps = {
  robotName: string
  text: string
  accent: string
  compact?: boolean
  onOpenAssistant?: () => void
  onKeepAlive?: () => void
  onRelease?: () => void
}

const RobotSpeechBubble = forwardRef<
  HTMLDivElement,
  RobotSpeechBubbleProps
>(function RobotSpeechBubble(
  {
    robotName,
    text,
    accent,
    compact = false,
    onOpenAssistant,
    onKeepAlive,
    onRelease,
  },
  ref,
) {
  return (
    <div
      ref={ref}
      data-robot-ui="true"
      className="pointer-events-auto absolute left-0 top-0 z-30 will-change-transform"
      style={{ visibility: "hidden" }}
      onPointerEnter={onKeepAlive}
      onPointerLeave={onRelease}
      onFocusCapture={onKeepAlive}
      onBlurCapture={onRelease}
    >
      <div
        key={`${text}-${compact ? "compact" : "greeting"}`}
        className="robot-bubble-enter relative rounded-2xl border bg-bg/95 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.95)] backdrop-blur-md"
        style={{
          width: compact ? "min(72vw, 224px)" : "min(84vw, 260px)",
          borderColor: `${accent}66`,
          boxShadow: `0 0 38px -18px ${accent}, 0 24px 70px -30px rgba(0,0,0,0.95)`,
        }}
      >
        <div className={compact ? "px-3 py-2.5" : "px-3.5 py-3"}>
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{
                background: accent,
                boxShadow: `0 0 10px ${accent}`,
              }}
            />
            <span
              className="truncate font-mono text-[9px] uppercase tracking-[0.22em]"
              style={{ color: accent }}
            >
              {robotName} · AI Lab
            </span>
          </div>

          <p
            className={
              "mt-1.5 leading-relaxed text-accent " +
              (compact ? "text-xs" : "text-sm")
            }
            aria-live="polite"
          >
            {text}
          </p>

          {!compact && onOpenAssistant && (
            <button
              type="button"
              onClick={onOpenAssistant}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-2.5 py-1.5 text-[11px] font-medium text-accent transition hover:bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Open assistant
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>

        <span
          aria-hidden="true"
          className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r bg-bg"
          style={{ borderColor: `${accent}66` }}
        />
      </div>
    </div>
  )
})

export default RobotSpeechBubble
