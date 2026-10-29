import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { RobotDefinition, RobotRuntime } from "./robotConfig"

type RobotCharacterProps = {
  definition: RobotDefinition
  runtime: RobotRuntime
  runtimes: RobotRuntime[]
  hovered: boolean
  reducedMotion: boolean
  paused: boolean
}

let shadowTexture: THREE.CanvasTexture | null = null

function getShadowTexture() {
  if (shadowTexture) return shadowTexture

  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext("2d")

  if (context) {
    const gradient = context.createRadialGradient(64, 64, 6, 64, 64, 62)
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.55)")
    gradient.addColorStop(0.55, "rgba(0, 0, 0, 0.28)")
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)
  }

  shadowTexture = new THREE.CanvasTexture(canvas)
  shadowTexture.needsUpdate = true
  return shadowTexture
}

function damp(current: number, target: number, lambda: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * delta))
}

function dampAngle(
  current: number,
  target: number,
  lambda: number,
  delta: number,
) {
  const difference = Math.atan2(
    Math.sin(target - current),
    Math.cos(target - current),
  )
  return current + difference * (1 - Math.exp(-lambda * delta))
}

function advanceWaypoint(runtime: RobotRuntime, closed: boolean) {
  if (closed) {
    runtime.waypoint = (runtime.waypoint + 1) % runtime.path.length
    return
  }

  if (
    runtime.waypoint + runtime.direction >= runtime.path.length ||
    runtime.waypoint + runtime.direction < 0
  ) {
    runtime.direction = runtime.direction === 1 ? -1 : 1
  }

  runtime.waypoint += runtime.direction
}

export default function RobotCharacter({
  definition,
  runtime,
  runtimes,
  hovered,
  reducedMotion,
  paused,
}: RobotCharacterProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Group>(null)
  const rightLegRef = useRef<THREE.Group>(null)

  const materials = useMemo(() => {
    return {
      shell: new THREE.MeshStandardMaterial({
        color: definition.shell,
        metalness: 0.42,
        roughness: 0.46,
      }),
      limb: new THREE.MeshStandardMaterial({
        color: "#111a27",
        metalness: 0.5,
        roughness: 0.38,
      }),
      trim: new THREE.MeshStandardMaterial({
        color: definition.trim,
        metalness: 0.55,
        roughness: 0.3,
      }),
      visor: new THREE.MeshStandardMaterial({
        color: "#03070d",
        metalness: 0.88,
        roughness: 0.16,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: definition.accent,
        emissive: definition.accent,
        emissiveIntensity: 1.35,
        metalness: 0.12,
        roughness: 0.3,
        toneMapped: false,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: "#06101a",
        emissive: definition.accent,
        emissiveIntensity: 1.9,
        metalness: 0.05,
        roughness: 0.2,
        toneMapped: false,
      }),
    }
  }, [definition.accent, definition.shell, definition.trim])

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((material) => material.dispose())
    }
  }, [materials])

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group || paused) return

    const dt = Math.min(delta, 0.05)
    const time = state.clock.elapsedTime
    const camera = state.camera

    if (hovered && runtime.state !== "hovering") {
      runtime.previousState =
        runtime.state === "talking" ? "walking" : runtime.state
      runtime.state = "hovering"
    } else if (!hovered && runtime.state === "hovering") {
      runtime.state = runtime.previousState
    }

    if (!reducedMotion) {
      if (runtime.state === "hovering") {
        runtime.targetYaw = Math.atan2(
          camera.position.x - runtime.x,
          camera.position.z - runtime.z,
        )
      } else if (runtime.state === "talking") {
        const partner =
          runtime.partner === null ? null : runtimes[runtime.partner]

        if (partner) {
          runtime.targetYaw = Math.atan2(
            partner.x - runtime.x,
            partner.z - runtime.z,
          )
        }
      } else if (runtime.state === "idle") {
        if (time >= runtime.idleUntil) {
          runtime.state = "walking"
        }
      } else if (runtime.state === "walking") {
        const waypoint = runtime.path[runtime.waypoint]
        const dx = waypoint[0] - runtime.x
        const dz = waypoint[1] - runtime.z
        const distance = Math.hypot(dx, dz)

        if (distance < 0.06) {
          advanceWaypoint(runtime, definition.closed)

          if (Math.random() < 0.45) {
            runtime.state = "idle"
            runtime.idleUntil = time + 1.2 + Math.random() * 2.4
          }
        } else {
          const blocked = runtimes.some((other, index) => {
            if (index === definition.id) return false
            return Math.hypot(other.x - runtime.x, other.z - runtime.z) < 1.05
          })

          if (!blocked) {
            const step = Math.min(distance, runtime.speed * dt)
            runtime.x += (dx / distance) * step
            runtime.z += (dz / distance) * step
            runtime.walkPhase += step * 5.5
          }

          runtime.targetYaw = Math.atan2(dx, dz)
        }
      }
    }

    group.position.set(runtime.x, 0, runtime.z)
    group.rotation.y = reducedMotion
      ? runtime.targetYaw
      : dampAngle(group.rotation.y, runtime.targetYaw, 7, dt)

    const walking = runtime.state === "walking" && !reducedMotion
    const talking = runtime.state === "talking" && !reducedMotion
    const hovering = runtime.state === "hovering"
    const phase = runtime.walkPhase
    const seed = runtime.seed

    if (bodyRef.current) {
      const bob = reducedMotion
        ? 0
        : walking
          ? Math.abs(Math.sin(phase)) * 0.045
          : Math.sin(time * 1.1 + seed) * 0.012
      bodyRef.current.position.y = damp(
        bodyRef.current.position.y,
        bob,
        9,
        dt,
      )
    }

    if (leftLegRef.current && rightLegRef.current) {
      const swing = walking ? Math.sin(phase) * 0.55 : 0
      leftLegRef.current.rotation.x = damp(
        leftLegRef.current.rotation.x,
        swing,
        12,
        dt,
      )
      rightLegRef.current.rotation.x = damp(
        rightLegRef.current.rotation.x,
        -swing,
        12,
        dt,
      )
    }

    if (leftArmRef.current && rightArmRef.current) {
      let leftX = walking ? -Math.sin(phase) * 0.4 : 0
      let rightX = walking ? Math.sin(phase) * 0.4 : 0
      let leftZ = 0
      let rightZ = 0

      if (hovering) {
        leftX = 0
        rightX = 0.1
        leftZ = -0.18
        rightZ = reducedMotion
          ? 2.38
          : 2.38 + Math.sin(time * 7.5) * 0.28
        leftArmRef.current.rotation.z = damp(
          leftArmRef.current.rotation.z,
          leftZ,
          10,
          dt,
        )
      } else if (talking) {
        leftX = Math.sin(time * 3.1 + seed) * 0.2
        rightX = Math.sin(time * 3.1 + seed + 1.2) * 0.2
        leftZ = -0.24 - Math.sin(time * 2.4 + seed) * 0.08
        rightZ = 0.24 + Math.sin(time * 2.4 + seed + 0.8) * 0.08
      } else if (!walking) {
        leftX = reducedMotion ? 0 : Math.sin(time * 0.8 + seed) * 0.05
        rightX = reducedMotion
          ? 0
          : Math.sin(time * 0.8 + seed + 1.4) * 0.05
        leftZ = -0.05
        rightZ = 0.05
      }

      leftArmRef.current.rotation.x = damp(
        leftArmRef.current.rotation.x,
        leftX,
        9,
        dt,
      )
      rightArmRef.current.rotation.x = damp(
        rightArmRef.current.rotation.x,
        rightX,
        9,
        dt,
      )
      leftArmRef.current.rotation.z = damp(
        leftArmRef.current.rotation.z,
        leftZ,
        9,
        dt,
      )
      rightArmRef.current.rotation.z = damp(
        rightArmRef.current.rotation.z,
        rightZ,
        hovering ? 14 : 9,
        dt,
      )
    }

    if (headRef.current) {
      const headY = reducedMotion
        ? 0
        : hovering
          ? 0
          : talking
            ? Math.sin(time * 1.4 + seed) * 0.04
            : Math.sin(time * 0.55 + seed) * 0.28
      const headX = reducedMotion
        ? hovering
          ? -0.08
          : 0
        : hovering
          ? -0.12
          : talking
            ? Math.sin(time * 3.1 + seed) * 0.07
            : Math.sin(time * 0.7 + seed) * 0.025

      headRef.current.rotation.y = damp(
        headRef.current.rotation.y,
        headY,
        6,
        dt,
      )
      headRef.current.rotation.x = damp(
        headRef.current.rotation.x,
        headX,
        6,
        dt,
      )
    }

    const eyeTarget = hovering
      ? reducedMotion
        ? 3.2
        : 3.6 + Math.sin(time * 4.5) * 0.35
      : talking
        ? 2.5
        : 1.9
    materials.eye.emissiveIntensity = damp(
      materials.eye.emissiveIntensity,
      eyeTarget,
      6,
      dt,
    )
    materials.accent.emissiveIntensity = damp(
      materials.accent.emissiveIntensity,
      hovering ? 1.9 : 1.35,
      5,
      dt,
    )
  })

  return (
    <group
      ref={groupRef}
      position={[runtime.x, 0, runtime.z]}
      rotation={[0, runtime.yaw, 0]}
      scale={definition.scale}
    >
      <group ref={bodyRef}>
        <mesh position={[0, 0.95, 0]} material={materials.shell}>
          <capsuleGeometry args={[0.28, 0.34, 8, 16]} />
        </mesh>

        <mesh position={[0, 0.99, 0.225]} material={materials.visor}>
          <boxGeometry args={[0.32, 0.2, 0.05]} />
        </mesh>

        <mesh
          position={[0, 1.0, 0.262]}
          material={materials.accent}
          rotation={[0, 0, 0]}
        >
          <torusGeometry args={[0.075, 0.011, 8, 24]} />
        </mesh>

        <mesh position={[0, 1.0, 0.268]} material={materials.accent}>
          <sphereGeometry args={[0.026, 10, 10]} />
        </mesh>

        <mesh position={[-0.36, 1.21, 0]} material={materials.shell}>
          <sphereGeometry args={[0.105, 14, 12]} />
        </mesh>
        <mesh position={[0.36, 1.21, 0]} material={materials.shell}>
          <sphereGeometry args={[0.105, 14, 12]} />
        </mesh>

        <group ref={leftArmRef} position={[-0.36, 1.21, 0]}>
          <mesh position={[0, -0.27, 0]} material={materials.limb}>
            <capsuleGeometry args={[0.072, 0.3, 4, 10]} />
          </mesh>
          <mesh position={[0, -0.48, 0]} material={materials.accent}>
            <sphereGeometry args={[0.082, 10, 10]} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.36, 1.21, 0]}>
          <mesh position={[0, -0.27, 0]} material={materials.limb}>
            <capsuleGeometry args={[0.072, 0.3, 4, 10]} />
          </mesh>
          <mesh position={[0, -0.48, 0]} material={materials.accent}>
            <sphereGeometry args={[0.082, 10, 10]} />
          </mesh>
        </group>

        <mesh position={[0, 1.4, 0]} material={materials.limb}>
          <cylinderGeometry args={[0.062, 0.072, 0.1, 10]} />
        </mesh>

        <group ref={headRef} position={[0, 1.61, 0]}>
          <mesh material={materials.shell} scale={[1, 0.93, 0.94]}>
            <sphereGeometry args={[0.245, 18, 14]} />
          </mesh>

          <mesh
            position={[0, 0.035, 0.195]}
            material={materials.visor}
            rotation={[0, 0, Math.PI / 2]}
          >
            <capsuleGeometry args={[0.062, 0.19, 4, 14]} />
          </mesh>

          <mesh
            position={[-0.078, 0.04, 0.237]}
            material={materials.eye}
          >
            <sphereGeometry args={[0.029, 10, 10]} />
          </mesh>
          <mesh position={[0.078, 0.04, 0.237]} material={materials.eye}>
            <sphereGeometry args={[0.029, 10, 10]} />
          </mesh>

          <mesh
            position={[-0.245, 0.025, 0]}
            material={materials.trim}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.048, 0.048, 0.05, 12]} />
          </mesh>
          <mesh
            position={[0.245, 0.025, 0]}
            material={materials.trim}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.048, 0.048, 0.05, 12]} />
          </mesh>

          <mesh position={[0, 0.255, 0]} material={materials.limb}>
            <cylinderGeometry args={[0.008, 0.008, 0.14, 6]} />
          </mesh>
          <mesh position={[0, 0.33, 0]} material={materials.accent}>
            <sphereGeometry args={[0.026, 8, 8]} />
          </mesh>
        </group>
      </group>

      <group ref={leftLegRef} position={[-0.14, 0.56, 0]}>
        <mesh position={[0, -0.22, 0]} material={materials.limb}>
          <capsuleGeometry args={[0.082, 0.25, 4, 10]} />
        </mesh>
        <mesh position={[0, -0.46, 0.035]} material={materials.shell}>
          <boxGeometry args={[0.16, 0.09, 0.25]} />
        </mesh>
        <mesh position={[0, -0.455, 0.16]} material={materials.accent}>
          <boxGeometry args={[0.12, 0.032, 0.02]} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.14, 0.56, 0]}>
        <mesh position={[0, -0.22, 0]} material={materials.limb}>
          <capsuleGeometry args={[0.082, 0.25, 4, 10]} />
        </mesh>
        <mesh position={[0, -0.46, 0.035]} material={materials.shell}>
          <boxGeometry args={[0.16, 0.09, 0.25]} />
        </mesh>
        <mesh position={[0, -0.455, 0.16]} material={materials.accent}>
          <boxGeometry args={[0.12, 0.032, 0.02]} />
        </mesh>
      </group>

      <mesh
        position={[0, 0.012, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={1}
      >
        <circleGeometry args={[0.52, 24]} />
        <meshBasicMaterial
          map={getShadowTexture()}
          transparent
          opacity={0.72}
          depthWrite={false}
          color="#000000"
        />
      </mesh>
    </group>
  )
}
