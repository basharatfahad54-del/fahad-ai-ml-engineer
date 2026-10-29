import { useEffect, useMemo, useRef, type MutableRefObject } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import RobotCharacter from "./RobotCharacter"
import {
  CONVERSATIONS,
  ROBOTS,
  createRuntime,
  type RobotRuntime,
} from "./robotConfig"

type RobotSceneProps = {
  hoveredIndex: number | null
  reducedMotion: boolean
  paused: boolean
  mobile: boolean
  onConversationChange: (lines: Record<number, string>) => void
  hotspotRefs: MutableRefObject<Array<HTMLButtonElement | null>>
  bubbleRefs: MutableRefObject<Array<HTMLDivElement | null>>
}

const cameraSpace = new THREE.Vector3()
const projected = new THREE.Vector3()

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

let glowTexture: THREE.CanvasTexture | null = null

function getGlowTexture() {
  if (glowTexture) return glowTexture

  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256
  const context = canvas.getContext("2d")

  if (context) {
    const gradient = context.createRadialGradient(128, 128, 4, 128, 128, 126)
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
    gradient.addColorStop(0.35, "rgba(255, 255, 255, 0.28)")
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
    context.fillStyle = gradient
    context.fillRect(0, 0, 256, 256)
  }

  glowTexture = new THREE.CanvasTexture(canvas)
  glowTexture.needsUpdate = true
  return glowTexture
}

function buildLineGeometry(points: number[]) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3),
  )
  return geometry
}

function LabEnvironment({
  narrow,
  reducedMotion,
  paused,
}: {
  narrow: boolean
  reducedMotion: boolean
  paused: boolean
}) {
  const wallCyan = useMemo(() => {
    const points: number[] = []
    const add = (x1: number, y1: number, x2: number, y2: number) => {
      points.push(x1, y1, -4.9, x2, y2, -4.9)
    }

    add(-7.6, 1.55, -2.9, 1.55)
    add(-2.9, 1.55, -2.9, 2.95)
    add(-2.9, 2.95, 0.5, 2.95)
    add(2.1, 2.05, 6.8, 2.05)
    add(-6.3, 0.85, -6.3, 2.75)
    add(-6.3, 2.75, -4.7, 2.75)
    add(1.15, 0.95, 1.15, 1.5)
    add(-0.9, 3.8, -0.9, 5.15)
    add(-0.9, 5.15, 1.5, 5.15)
    add(2.7, 4.85, 5.9, 4.85)
    add(5.9, 4.15, 5.9, 4.85)
    add(-5.4, 4.2, -5.4, 5.35)
    add(-5.4, 5.35, -3.2, 5.35)
    return buildLineGeometry(points)
  }, [])

  const wallViolet = useMemo(() => {
    const points: number[] = []
    const add = (x1: number, y1: number, x2: number, y2: number) => {
      points.push(x1, y1, -4.9, x2, y2, -4.9)
    }

    add(4.85, 2.05, 4.85, 4.2)
    add(4.85, 4.2, 6.4, 4.2)
    add(-1.55, 2.35, -0.35, 2.35)
    add(-0.35, 2.35, -0.35, 3.35)
    add(3.1, 3.3, 4.4, 3.3)
    add(-4.1, 3.45, -3.2, 3.45)
    add(-3.2, 3.45, -3.2, 4.1)
    return buildLineGeometry(points)
  }, [])

  const wallNodes = useMemo(() => {
    const positions = [
      -2.9, 1.55, -4.88, -2.9, 2.95, -4.88, 0.5, 2.95, -4.88, 2.1, 2.05,
      -4.88, 4.85, 4.2, -4.88, 6.4, 4.2, -4.88, -0.35, 2.35, -4.88, -0.9, 5.15,
      -4.88, 5.9, 4.85, -4.88,
    ]
    return buildLineGeometry(positions)
  }, [])

  const floorCyan = useMemo(() => {
    const points: number[] = []
    const add = (x1: number, z1: number, x2: number, z2: number) => {
      points.push(x1, 0.014, z1, x2, 0.014, z2)
    }

    add(-6.5, -0.4, 6.5, -0.4)
    add(-6.5, 1.4, 6.5, 1.4)
    add(-6.5, 3.6, 6.5, 3.6)
    add(-4.8, -2.2, -4.8, 4.6)
    add(-2.4, -2.2, -2.4, 4.6)
    add(0, -2.2, 0, 4.6)
    add(2.4, -2.2, 2.4, 4.6)
    add(4.8, -2.2, 4.8, 4.6)
    return buildLineGeometry(points)
  }, [])

  useEffect(() => {
    return () => {
      wallCyan.dispose()
      wallViolet.dispose()
      wallNodes.dispose()
      floorCyan.dispose()
    }
  }, [floorCyan, wallCyan, wallNodes, wallViolet])

  return (
    <group>
      <mesh position={[0, 3.5, -5]} receiveShadow={false}>
        <planeGeometry args={[26, 11]} />
        <meshStandardMaterial color="#090f1c" metalness={0.1} roughness={0.92} />
      </mesh>

      <mesh position={[-7.2, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color="#070c17" metalness={0.05} roughness={0.96} />
      </mesh>
      <mesh position={[7.2, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color="#070c17" metalness={0.05} roughness={0.96} />
      </mesh>

      <mesh position={[0, 0, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 22]} />
        <meshStandardMaterial color="#060a13" metalness={0.52} roughness={0.46} />
      </mesh>

      <lineSegments geometry={wallCyan}>
        <lineBasicMaterial
          color="#55D6FF"
          transparent
          opacity={0.26}
          toneMapped={false}
        />
      </lineSegments>
      <lineSegments geometry={wallViolet}>
        <lineBasicMaterial
          color="#9366FF"
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </lineSegments>
      <points geometry={wallNodes}>
        <pointsMaterial
          color="#8CEAFF"
          size={0.065}
          transparent
          opacity={0.75}
          toneMapped={false}
          sizeAttenuation
        />
      </points>

      <lineSegments geometry={floorCyan}>
        <lineBasicMaterial
          color="#2D7CA8"
          transparent
          opacity={0.18}
          toneMapped={false}
        />
      </lineSegments>

      <mesh position={[0, 0.008, 1.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 11]} />
        <meshBasicMaterial
          map={getGlowTexture()}
          color="#2C6CFF"
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[5.1, 0.006, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 6]} />
        <meshBasicMaterial
          map={getGlowTexture()}
          color="#9366FF"
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh position={[0, 0.02, -3.7]}>
        <boxGeometry args={[12.4, 0.025, 0.045]} />
        <meshBasicMaterial
          color="#55D6FF"
          transparent
          opacity={0.48}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-5.9, 0.02, -0.8]}>
        <boxGeometry args={[0.045, 0.025, 5.6]} />
        <meshBasicMaterial
          color="#9366FF"
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>

      <HoloPanels
        narrow={narrow}
        reducedMotion={reducedMotion}
        paused={paused}
      />
      <Particles
        count={narrow ? 42 : 86}
        reducedMotion={reducedMotion}
        paused={paused}
      />
    </group>
  )
}

type HoloPanelDefinition = {
  position: [number, number, number]
  rotationY: number
  width: number
  height: number
  color: string
  phase: number
}

const HOLO_PANELS: HoloPanelDefinition[] = [
  {
    position: [-5.25, 2.65, -3.25],
    rotationY: 0.28,
    width: 1.75,
    height: 1.05,
    color: "#55D6FF",
    phase: 0.4,
  },
  {
    position: [5.15, 2.35, -3.45],
    rotationY: -0.3,
    width: 1.5,
    height: 0.95,
    color: "#9366FF",
    phase: 2.1,
  },
  {
    position: [0.2, 4.2, -4.35],
    rotationY: 0,
    width: 2.1,
    height: 0.8,
    color: "#6CFFD8",
    phase: 4.2,
  },
]

function HoloPanels({
  narrow,
  reducedMotion,
  paused,
}: {
  narrow: boolean
  reducedMotion: boolean
  paused: boolean
}) {
  const groupRefs = useRef<Array<THREE.Group | null>>([])
  const panels = narrow ? HOLO_PANELS.slice(0, 2) : HOLO_PANELS

  useFrame((state) => {
    if (reducedMotion || paused) return
    const time = state.clock.elapsedTime

    groupRefs.current.forEach((group, index) => {
      if (!group) return
      const panel = panels[index]
      group.position.y = panel.position[1] + Math.sin(time * 0.35 + panel.phase) * 0.06
      group.rotation.y =
        panel.rotationY + Math.sin(time * 0.18 + panel.phase) * 0.035
    })
  })

  return (
    <group>
      {panels.map((panel, index) => {
        const halfWidth = panel.width / 2
        const halfHeight = panel.height / 2

        return (
          <group
            key={panel.position.join("-")}
            ref={(element) => {
              groupRefs.current[index] = element
            }}
            position={panel.position}
            rotation={[0, panel.rotationY, 0]}
          >
            <mesh>
              <planeGeometry args={[panel.width, panel.height]} />
              <meshBasicMaterial
                color={panel.color}
                transparent
                opacity={0.055}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {[
              [0, halfHeight, panel.width, 0.012],
              [0, -halfHeight, panel.width, 0.012],
              [-halfWidth, 0, 0.012, panel.height],
              [halfWidth, 0, 0.012, panel.height],
            ].map(([x, y, width, height], borderIndex) => (
              <mesh key={borderIndex} position={[x, y, 0.006]}>
                <boxGeometry args={[width, height, 0.006]} />
                <meshBasicMaterial
                  color={panel.color}
                  transparent
                  opacity={0.34}
                  toneMapped={false}
                />
              </mesh>
            ))}

            {[-0.22, 0, 0.22].map((y, barIndex) => (
              <mesh
                key={barIndex}
                position={[
                  -halfWidth + 0.18 + (barIndex % 2) * 0.06,
                  y,
                  0.008,
                ]}
              >
                <boxGeometry
                  args={[panel.width * (0.55 + barIndex * 0.12), 0.028, 0.004]}
                />
                <meshBasicMaterial
                  color={panel.color}
                  transparent
                  opacity={0.22}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}

function Particles({
  count,
  reducedMotion,
  paused,
}: {
  count: number
  reducedMotion: boolean
  paused: boolean
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 15
      values[index * 3 + 1] = 0.35 + Math.random() * 4.9
      values[index * 3 + 2] = -3.8 + Math.random() * 7.4
    }

    return values
  }, [count])

  useFrame((state, delta) => {
    if (!pointsRef.current || reducedMotion || paused) return
    pointsRef.current.rotation.y += delta * 0.012
    pointsRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.18) * 0.08
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#8ADFFF"
        size={0.032}
        transparent
        opacity={0.52}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

function CameraRig() {
  const { camera, size } = useThree()

  useEffect(() => {
    const narrow = size.width < 720 || size.width / size.height < 1.1

    camera.position.set(0, narrow ? 3.05 : 2.4, narrow ? 10.8 : 8.2)
    camera.lookAt(0, narrow ? 1.02 : 1.05, narrow ? 0.45 : 0.6)

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = narrow ? 52 : 40
      camera.near = 0.1
      camera.far = 60
      camera.updateProjectionMatrix()
    }
  }, [camera, size.height, size.width])

  return null
}

function ConversationDirector({
  runtimes,
  activeIndex,
  reducedMotion,
  paused,
  onConversationChange,
}: {
  runtimes: RobotRuntime[]
  activeIndex: number | null
  reducedMotion: boolean
  paused: boolean
  onConversationChange: (lines: Record<number, string>) => void
}) {
  const schedule = useRef({
    nextAt: 8 + Math.random() * 5,
    pair: null as [number, number] | null,
    until: 0,
  })

  useEffect(() => {
    onConversationChange({})
    return () => onConversationChange({})
  }, [onConversationChange, runtimes])

  useFrame((state) => {
    if (paused) return

    const now = state.clock.elapsedTime
    const current = schedule.current

    if (current.pair) {
      const [first, second] = current.pair
      const interrupted =
        activeIndex === first ||
        activeIndex === second ||
        reducedMotion ||
        now >= current.until

      if (interrupted) {
        runtimes[first].state = "walking"
        runtimes[second].state = "walking"
        runtimes[first].partner = null
        runtimes[second].partner = null
        current.pair = null
        current.nextAt = now + 18 + Math.random() * 14
        onConversationChange({})
      }

      return
    }

    if (reducedMotion || activeIndex !== null || now < current.nextAt) {
      return
    }

    let bestPair: [number, number] | null = null
    let bestDistance = Number.POSITIVE_INFINITY

    for (let first = 0; first < runtimes.length; first += 1) {
      for (let second = first + 1; second < runtimes.length; second += 1) {
        const distance = Math.hypot(
          runtimes[first].x - runtimes[second].x,
          runtimes[first].z - runtimes[second].z,
        )

        if (distance > 1.25 && distance < bestDistance) {
          bestDistance = distance
          bestPair = [first, second]
        }
      }
    }

    if (!bestPair || bestDistance > 5.2) {
      current.nextAt = now + 2.5
      return
    }

    const dialogue =
      CONVERSATIONS[Math.floor(Math.random() * CONVERSATIONS.length)]
    const [first, second] = bestPair

    runtimes[first].state = "talking"
    runtimes[first].partner = second
    runtimes[second].state = "talking"
    runtimes[second].partner = first

    current.pair = bestPair
    current.until = now + 4.4
    onConversationChange({
      [first]: dialogue[0],
      [second]: dialogue[1],
    })
  })

  return null
}

function ScreenSync({
  runtimes,
  hotspotRefs,
  bubbleRefs,
}: {
  runtimes: RobotRuntime[]
  hotspotRefs: MutableRefObject<Array<HTMLButtonElement | null>>
  bubbleRefs: MutableRefObject<Array<HTMLDivElement | null>>
}) {
  const { camera, size } = useThree()

  useFrame(() => {
    const narrow = size.width < 640
    const bubbleMinX = narrow ? 126 : 142
    const bubbleMinTop = narrow ? 122 : 142

    runtimes.forEach((runtime, index) => {
      const definition = ROBOTS[index]
      const bodyHeight = 1.02 * definition.scale
      const headHeight = 1.93 * definition.scale

      const updatePoint = (height: number) => {
        projected.set(runtime.x, height, runtime.z)
        cameraSpace.copy(projected).applyMatrix4(camera.matrixWorldInverse)

        const inFront = cameraSpace.z < -0.05
        projected.project(camera)

        return {
          inFront,
          depth: cameraSpace.z,
          x: (projected.x * 0.5 + 0.5) * size.width,
          y: (-projected.y * 0.5 + 0.5) * size.height,
        }
      }

      const body = updatePoint(bodyHeight)
      const head = updatePoint(headHeight)
      const visible =
        body.inFront &&
        head.inFront &&
        body.x > -120 &&
        body.x < size.width + 120 &&
        body.y > -80 &&
        body.y < size.height + 80

      const hotspot = hotspotRefs.current[index]
      if (hotspot) {
        hotspot.style.visibility = visible ? "visible" : "hidden"
        hotspot.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) translate(-50%, -50%)`
        hotspot.dataset.depth = String(body.depth)
      }

      const bubble = bubbleRefs.current[index]
      if (bubble) {
        bubble.style.visibility = visible ? "visible" : "hidden"

        if (visible) {
          const bubbleX = clamp(head.x, bubbleMinX, size.width - bubbleMinX)
          const bubbleY = clamp(
            head.y - 18,
            bubbleMinTop,
            size.height - 24,
          )
          bubble.style.transform = `translate3d(${bubbleX}px, ${bubbleY}px, 0) translate(-50%, -100%)`
        }
      }
    })
  })

  return null
}

function SceneContents({
  hoveredIndex,
  reducedMotion,
  paused,
  mobile,
  onConversationChange,
  hotspotRefs,
  bubbleRefs,
}: RobotSceneProps) {
  const { size } = useThree()
  const narrow = size.width < 720 || size.width / size.height < 1.1
  const spatialScale = narrow ? 0.46 : 1
  const runtimes = useMemo(
    () => ROBOTS.map((robot, index) => createRuntime(robot, index, spatialScale)),
    [spatialScale],
  )

  return (
    <>
      <CameraRig />
      <fog attach="fog" args={["#080b12", 10, 25]} />

      <ambientLight intensity={0.42} color="#8EADFF" />
      <hemisphereLight args={["#315CFF", "#050810", 0.55]} />
      <directionalLight position={[4, 7, 4]} intensity={1.25} color="#C8DBFF" />
      <pointLight
        position={[-5.2, 2.6, 0.6]}
        intensity={18}
        distance={15}
        decay={2}
        color="#55D6FF"
      />
      <pointLight
        position={[5.2, 2.4, 0.2]}
        intensity={16}
        distance={15}
        decay={2}
        color="#9366FF"
      />
      <pointLight
        position={[0, 1.3, 4.5]}
        intensity={9}
        distance={10}
        decay={2}
        color="#F4C46B"
      />

      <LabEnvironment
        narrow={narrow}
        reducedMotion={reducedMotion}
        paused={paused}
      />

      {ROBOTS.map((definition, index) => (
        <RobotCharacter
          key={definition.id}
          definition={definition}
          runtime={runtimes[index]}
          runtimes={runtimes}
          hovered={hoveredIndex === index}
          reducedMotion={reducedMotion}
          paused={paused}
        />
      ))}

      <ConversationDirector
        runtimes={runtimes}
        activeIndex={hoveredIndex}
        reducedMotion={reducedMotion}
        paused={paused}
        onConversationChange={onConversationChange}
      />

      <ScreenSync
        runtimes={runtimes}
        hotspotRefs={hotspotRefs}
        bubbleRefs={bubbleRefs}
      />
    </>
  )
}

export default function RobotScene(props: RobotSceneProps) {
  const { mobile, paused } = props

  return (
    <Canvas
      dpr={mobile ? [1, 1.4] : [1, 2]}
      gl={{
        alpha: true,
        antialias: !mobile,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 2.4, 8.2], fov: 40, near: 0.1, far: 60 }}
      frameloop={paused ? "never" : "always"}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <SceneContents {...props} />
    </Canvas>
  )
}
