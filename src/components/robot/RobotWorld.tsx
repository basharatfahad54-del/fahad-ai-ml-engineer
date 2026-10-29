import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
} from "react"
import RobotAssistantPanel from "./RobotAssistantPanel"
import RobotSpeechBubble from "./RobotSpeechBubble"
import { ROBOTS } from "./robotConfig"

const RobotScene = lazy(() => import("./RobotScene"))

function LabAmbient({ withRobots }: { withRobots?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_82%,rgba(29,58,104,0.34),transparent_62%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#050912] via-[#07101d]/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-[31%] h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-[19%] h-px bg-gradient-to-r from-transparent via-violet/15 to-transparent" />
      <div className="absolute left-[9%] top-[27%] h-24 w-px bg-gradient-to-b from-cyan/25 to-transparent" />
      <div className="absolute left-[9%] top-[38%] h-px w-24 bg-gradient-to-r from-cyan/25 to-transparent" />
      <div className="absolute right-[12%] top-[22%] h-32 w-px bg-gradient-to-b from-violet/25 to-transparent" />
      <div className="absolute right-[6%] top-[34%] h-px w-28 bg-gradient-to-l from-violet/20 to-transparent" />

      {withRobots && (
        <>
          <div className="absolute bottom-[17%] left-[13%] h-20 w-12 opacity-80">
            <div className="mx-auto h-6 w-6 rounded-full border border-cyan/45 bg-bg2 shadow-[0_0_18px_rgba(85,214,255,0.3)]">
              <div className="flex justify-center gap-1.5 pt-2.5">
                <span className="h-1 w-1 rounded-full bg-cyan" />
                <span className="h-1 w-1 rounded-full bg-cyan" />
              </div>
            </div>
            <div className="mx-auto mt-1 h-8 w-9 rounded-lg border border-cyan/25 bg-card/70" />
            <div className="mx-auto mt-1 flex justify-center gap-3">
              <span className="h-4 w-1.5 rounded bg-cyan/20" />
              <span className="h-4 w-1.5 rounded bg-cyan/20" />
            </div>
          </div>

          <div className="absolute bottom-[13%] right-[16%] h-16 w-10 opacity-70">
            <div className="mx-auto h-5 w-5 rounded-full border border-violet/45 bg-bg2 shadow-[0_0_16px_rgba(147,102,255,0.28)]">
              <div className="flex justify-center gap-1 pt-2">
                <span className="h-1 w-1 rounded-full bg-violet" />
                <span className="h-1 w-1 rounded-full bg-violet" />
              </div>
            </div>
            <div className="mx-auto mt-1 h-6 w-7 rounded-lg border border-violet/25 bg-card/70" />
            <div className="mx-auto mt-1 flex justify-center gap-2.5">
              <span className="h-3 w-1.5 rounded bg-violet/20" />
              <span className="h-3 w-1.5 rounded bg-violet/20" />
            </div>
          </div>

          <div className="absolute bottom-[22%] left-[52%] h-14 w-9 opacity-60">
            <div className="mx-auto h-4 w-4 rounded-full border border-accent/30 bg-bg2 shadow-[0_0_14px_rgba(244,196,107,0.2)]">
              <div className="flex justify-center gap-1 pt-1.5">
                <span className="h-0.5 w-0.5 rounded-full bg-[#F4C46B]" />
                <span className="h-0.5 w-0.5 rounded-full bg-[#F4C46B]" />
              </div>
            </div>
            <div className="mx-auto mt-1 h-5 w-6 rounded-md border border-accent/20 bg-card/70" />
            <div className="mx-auto mt-1 flex justify-center gap-2">
              <span className="h-2.5 w-1 rounded bg-[#F4C46B]/20" />
              <span className="h-2.5 w-1 rounded bg-[#F4C46B]/20" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function RobotWorld() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [touchGreeting, setTouchGreeting] = useState<number | null>(null)
  const [conversationLines, setConversationLines] = useState<
    Record<number, string>
  >({})
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantRobot, setAssistantRobot] = useState(0)
  const [ready, setReady] = useState(false)
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [pageHidden, setPageHidden] = useState(false)

  const hotspotRefs = useRef<Array<HTMLButtonElement | null>>([])
  const bubbleRefs = useRef<Array<HTMLDivElement | null>>([])
  const leaveTimer = useRef<number | null>(null)
  const touchGreetingRef = useRef<number | null>(null)

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
  }, [])

  const setTouchGreetingSafe = useCallback((index: number | null) => {
    touchGreetingRef.current = index
    setTouchGreeting(index)
  }, [])

  const scheduleHide = useCallback(
    (index: number) => {
      clearLeaveTimer()
      leaveTimer.current = window.setTimeout(() => {
        setHoveredIndex((current) => (current === index ? null : current))
      }, 240)
    },
    [clearLeaveTimer],
  )

  const scheduleHideAll = useCallback(() => {
    clearLeaveTimer()
    leaveTimer.current = window.setTimeout(() => {
      setHoveredIndex(null)
    }, 220)
  }, [clearLeaveTimer])

  const findRobotAtPoint = useCallback((clientX: number, clientY: number) => {
    let hit: number | null = null
    let closestDepth = Number.NEGATIVE_INFINITY

    hotspotRefs.current.forEach((element, index) => {
      if (!element || element.style.visibility === "hidden") return

      const rect = element.getBoundingClientRect()
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return
      }

      const depth = Number(element.dataset.depth ?? Number.NEGATIVE_INFINITY)
      if (depth > closestDepth) {
        closestDepth = depth
        hit = index
      }
    })

    return hit
  }, [])

  const keepAlive = useCallback(
    (index: number) => {
      clearLeaveTimer()
      setHoveredIndex(index)
    },
    [clearLeaveTimer],
  )

  const openAssistant = useCallback(
    (index: number) => {
      clearLeaveTimer()
      setHoveredIndex(null)
      setTouchGreetingSafe(null)
      setAssistantRobot(index)
      setAssistantOpen(true)
    },
    [clearLeaveTimer, setTouchGreetingSafe],
  )

  const closeAssistant = useCallback(() => {
    setAssistantOpen(false)
    const target = hotspotRefs.current[assistantRobot]
    window.setTimeout(() => {
      target?.focus({ preventScroll: true })
    }, 0)
  }, [assistantRobot])

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const mobileQuery = window.matchMedia("(max-width: 767px)")

    const update = () => {
      setReducedMotion(motionQuery.matches)
      setMobile(mobileQuery.matches)
    }

    update()
    motionQuery.addEventListener("change", update)
    mobileQuery.addEventListener("change", update)

    return () => {
      motionQuery.removeEventListener("change", update)
      mobileQuery.removeEventListener("change", update)
    }
  }, [])

  useEffect(() => {
    const handleVisibility = () => setPageHidden(document.hidden)
    handleVisibility()
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  useEffect(() => {
    let supported = false

    try {
      const canvas = document.createElement("canvas")
      const context =
        canvas.getContext("webgl2") || canvas.getContext("webgl")
      supported = Boolean(context)
      context?.getExtension("WEBGL_lose_context")?.loseContext()
    } catch {
      supported = false
    }

    setWebglSupported(supported)
  }, [])

  useEffect(() => {
    let cancelled = false

    const start = () => {
      if (!cancelled) setReady(true)
    }

    const handleIntroComplete = () => start()
    window.addEventListener("fahad:lamp-intro-complete", handleIntroComplete)
    const timer = window.setTimeout(start, 1200)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.removeEventListener(
        "fahad:lamp-intro-complete",
        handleIntroComplete,
      )
    }
  }, [])

  useEffect(() => {
    const dismissOnScroll = () => {
      if (touchGreetingRef.current !== null) setTouchGreetingSafe(null)
    }

    window.addEventListener("scroll", dismissOnScroll, { passive: true })
    return () => window.removeEventListener("scroll", dismissOnScroll)
  }, [setTouchGreetingSafe])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return

      const target = event.target as Element | null
      if (target?.closest("[data-robot-ui]")) return

      const hit = findRobotAtPoint(event.clientX, event.clientY)

      if (hit !== null) {
        clearLeaveTimer()
        setTouchGreetingSafe(null)
        setHoveredIndex(hit)
        document.body.style.cursor = "pointer"
      } else {
        scheduleHideAll()
        document.body.style.cursor = ""
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (target?.closest("[data-robot-ui]")) return

      const hit = findRobotAtPoint(event.clientX, event.clientY)
      if (hit === null) {
        if (event.pointerType === "touch" || event.pointerType === "pen") {
          setTouchGreetingSafe(null)
        }
        return
      }

      event.preventDefault()
      event.stopPropagation()

      if (event.pointerType === "mouse") {
        openAssistant(hit)
        return
      }

      if (touchGreetingRef.current === hit) {
        openAssistant(hit)
      } else {
        clearLeaveTimer()
        setHoveredIndex(null)
        setTouchGreetingSafe(hit)
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    document.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("blur", scheduleHideAll)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("blur", scheduleHideAll)
      document.body.style.cursor = ""
    }
  }, [
    clearLeaveTimer,
    findRobotAtPoint,
    openAssistant,
    scheduleHideAll,
    setTouchGreetingSafe,
  ])

  useEffect(() => {
    return () => clearLeaveTimer()
  }, [clearLeaveTimer])

  const handleFocus = (
    index: number,
    event: ReactFocusEvent<HTMLButtonElement>,
  ) => {
    if (!event.currentTarget.matches(":focus-visible")) return
    clearLeaveTimer()
    setHoveredIndex(index)
  }

  const handleBlur = (
    index: number,
    event: ReactFocusEvent<HTMLButtonElement>,
  ) => {
    if (!event.currentTarget.matches(":focus-visible")) return
    scheduleHide(index)
  }

  const handleClick = (
    index: number,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    if (event.detail === 0) openAssistant(index)
  }

  const activeIndex = hoveredIndex ?? touchGreeting
  const showScene =
    webglSupported === true && ready && !mobile && !reducedMotion

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <LabAmbient withRobots={!showScene} />

        {showScene && (
          <Suspense fallback={null}>
            <RobotScene
              hoveredIndex={activeIndex}
              reducedMotion={reducedMotion}
              paused={pageHidden}
              mobile={mobile}
              onConversationChange={setConversationLines}
              hotspotRefs={hotspotRefs}
              bubbleRefs={bubbleRefs}
            />
          </Suspense>
        )}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(8,11,18,0.42)_76%,rgba(8,11,18,0.86)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg/80 to-transparent" />
      </div>

      {showScene && (
        <div className="pointer-events-none fixed inset-0 z-20">
          {ROBOTS.map((robot, index) => (
            <button
              key={robot.id}
              ref={(element) => {
                hotspotRefs.current[index] = element
              }}
              type="button"
              data-robot-ui="true"
              aria-label={`Meet ${robot.name}, ${robot.role}. Open Fahad's AI assistant.`}
              aria-haspopup="dialog"
              aria-expanded={assistantOpen && assistantRobot === index}
              className="robot-hotspot"
              style={{ visibility: "hidden" }}
              onFocus={(event) => handleFocus(index, event)}
              onBlur={(event) => handleBlur(index, event)}
              onClick={(event) => handleClick(index, event)}
            >
              <span className="sr-only">
                Talk to {robot.name}. Press Enter to open the assistant panel.
              </span>
            </button>
          ))}

          {ROBOTS.map((robot, index) => {
            const isHovering = activeIndex === index
            const conversation = conversationLines[index]
            const text = isHovering ? robot.greeting : conversation

            if (!text) return null

            return (
              <RobotSpeechBubble
                key={`${robot.id}-${isHovering ? "greeting" : "conversation"}`}
                ref={(element) => {
                  bubbleRefs.current[index] = element
                }}
                robotName={robot.name}
                text={text}
                accent={robot.accent}
                compact={!isHovering}
                onOpenAssistant={
                  isHovering ? () => openAssistant(index) : undefined
                }
                onKeepAlive={() => keepAlive(index)}
                onRelease={() => scheduleHide(index)}
              />
            )
          })}
        </div>
      )}

      {!showScene && !assistantOpen && (
        <button
          type="button"
          data-robot-ui="true"
          onClick={() => openAssistant(0)}
          aria-haspopup="dialog"
          className="fixed bottom-5 right-5 z-30 rounded-full border border-cyan/30 bg-bg/90 px-4 py-2.5 text-sm font-medium text-accent shadow-[0_18px_50px_-24px_rgba(85,214,255,0.8)] backdrop-blur transition hover:border-cyan/60 hover:text-cyan"
        >
          Ask the AI lab
        </button>
      )}

      <div className="pointer-events-none fixed inset-0 z-40">
        <RobotAssistantPanel open={assistantOpen} onClose={closeAssistant} />
      </div>
    </>
  )
}

