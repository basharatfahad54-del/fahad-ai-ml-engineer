export type RobotState = "walking" | "idle" | "talking" | "hovering"

export type RobotDefinition = {
  id: number
  name: string
  role: string
  accent: string
  accentSoft: string
  shell: string
  trim: string
  greeting: string
  scale: number
  speed: number
  path: ReadonlyArray<readonly [number, number]>
  closed: boolean
}

export type RobotRuntime = {
  x: number
  z: number
  yaw: number
  targetYaw: number
  state: RobotState
  previousState: RobotState
  waypoint: number
  direction: 1 | -1
  walkPhase: number
  idleUntil: number
  partner: number | null
  seed: number
  speed: number
  path: ReadonlyArray<readonly [number, number]>
}

export const PRIMARY_ROBOT_INDEX = 0

export const PRIMARY_GREETING = "Hey, I'm Fahad! How may I help you?"

export const ROBOTS: RobotDefinition[] = [
  {
    id: 0,
    name: "Fahad",
    role: "AI Engineer",
    accent: "#55D6FF",
    accentSoft: "#9BE9FF",
    shell: "#182337",
    trim: "#D8F6FF",
    greeting: PRIMARY_GREETING,
    scale: 0.56,
    speed: 0.62,
    path: [
      [-3.2, 2.65],
      [3.2, 2.65],
    ],
    closed: false,
  },
  {
    id: 1,
    name: "Nova",
    role: "Research Unit",
    accent: "#9366FF",
    accentSoft: "#C9B4FF",
    shell: "#1B1B33",
    trim: "#E6DCFF",
    greeting: "Welcome to Fahad's AI lab!",
    scale: 0.52,
    speed: 0.54,
    path: [
      [-4.0, 0.9],
      [-3.25, 1.35],
      [-3.3, 1.9],
      [-4.05, 1.55],
    ],
    closed: true,
  },
  {
    id: 2,
    name: "Circuit",
    role: "Systems Unit",
    accent: "#F4C46B",
    accentSoft: "#FFE3AD",
    shell: "#221D16",
    trim: "#FFF1D2",
    greeting: "Systems online. Need a quick tour?",
    scale: 0.5,
    speed: 0.5,
    path: [
      [4.0, 0.9],
      [3.25, 1.35],
      [3.3, 1.9],
      [4.05, 1.55],
    ],
    closed: true,
  },
  {
    id: 3,
    name: "Mint",
    role: "Data Unit",
    accent: "#6CFFD8",
    accentSoft: "#B7FFEF",
    shell: "#12251F",
    trim: "#D5FFF6",
    greeting: "Ask me about intelligent systems.",
    scale: 0.48,
    speed: 0.46,
    path: [
      [-1.5, 0.5],
      [1.5, 0.5],
    ],
    closed: false,
  },
]

export const CONVERSATIONS: ReadonlyArray<readonly [string, string]> = [
  ["Telemetry looks stable.", "Running final checks now."],
  ["The visitor is exploring.", "Keeping the lab ready."],
  ["Neural sync complete.", "Copy that. Standing by."],
  ["Model latency is low.", "Excellent. Continue patrol."],
]

export function createRuntime(
  definition: RobotDefinition,
  index: number,
  spatialScale: number,
): RobotRuntime {
  const path = definition.path.map(
    ([x, z]) => [x * spatialScale, z] as const,
  )
  const [x, z] = path[0]
  const [nextX, nextZ] = path[1 % path.length]
  const yaw = Math.atan2(nextX - x, nextZ - z)

  return {
    x,
    z,
    yaw,
    targetYaw: yaw,
    state: "walking",
    previousState: "walking",
    waypoint: 1 % path.length,
    direction: 1,
    walkPhase: index * 1.7,
    idleUntil: 0,
    partner: null,
    seed: index * 2.31 + 0.6,
    speed: definition.speed,
    path,
  }
}
