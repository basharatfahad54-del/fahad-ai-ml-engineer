import { useEffect, useState } from "react"

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-20 hidden md:block"
      aria-hidden
    >
      <div
        className="absolute h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/20 via-violet/15 to-cyan/10 blur-3xl transition-transform duration-300"
        style={{ left: pos.x, top: pos.y }}
      />
    </div>
  )
}
