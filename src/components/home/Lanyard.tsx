"use client";
/**
 * 3D hanging badge with rope physics (react-three-fiber + rapier).
 * Written for DID90 to reproduce the Framer "Lanyard" hero effect:
 * a card hangs from a strap, swings with gravity and can be dragged.
 */
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { LOGO_PATHS } from "./logoPaths";

extend({ MeshLineGeometry, MeshLineMaterial });
declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: Partial<ThreeElement<typeof MeshLineGeometry>>;
    meshLineMaterial: Partial<ThreeElement<typeof MeshLineMaterial>>;
  }
}

type Props = {
  cardImage?: string | null;
  strapImage?: string | null;
  strapColor?: string;
  gravity?: number;
};

export default function Lanyard({ cardImage, strapImage, strapColor = "#D6D6D6", gravity = 30 }: Props) {
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  // Pause rendering when the hero is off screen
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 25 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        frameloop={visible ? "always" : "never"}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={[0, -gravity, 0]} timeStep={1 / 60}>
          <Band cardImage={cardImage} strapImage={strapImage} strapColor={strapColor} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

type Body = React.RefObject<RapierRigidBody>;
const CARD_W = 2;
const CARD_H = 2.8;
const CARD_D = 0.018;
const HOOK = 0.62; // distance from card top edge to the top of the D-ring
const HOLE = 0.19; // punched hole distance from the card top edge

function makeFallbackTexture() {
  const c = document.createElement("canvas");
  c.width = 1000;
  c.height = 1400;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, c.height);
  g.addColorStop(0, "#1c1c1c");
  g.addColorStop(1, "#050505");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);
  // DID90° mark near the bottom, like the template badge
  ctx.save();
  const w = 300;
  ctx.translate((c.width - w) / 2, 1080);
  ctx.scale(w / 1606, w / 1606);
  ctx.fillStyle = "#ffffff";
  LOGO_PATHS.forEach((d) => ctx.fill(new Path2D(d)));
  ctx.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Flat rounded rectangle with 0..1 UVs, used for the printed faces of the card. */
function useFaceGeometry() {
  return useMemo(() => {
    const w = CARD_W, h = CARD_H, r = 0.08;
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const geo = new THREE.ShapeGeometry(shape, 12);
    const pos = geo.attributes.position;
    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uv[i * 2] = (pos.getX(i) + w / 2) / w;
      uv[i * 2 + 1] = (pos.getY(i) + h / 2) / h;
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    const body = new THREE.ExtrudeGeometry(shape, { depth: CARD_D, bevelEnabled: false, curveSegments: 12 });
    body.translate(0, 0, -CARD_D / 2);
    return { face: geo, body };
  }, []);
}

/** Swivel D-ring + snap hook that passes through the card's punched hole (metal). */
function Clasp() {
  const top = CARD_H / 2;
  const hookPath = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, top + 0.29, 0),
        new THREE.Vector3(0.035, top + 0.12, 0),
        new THREE.Vector3(0.03, top - 0.08, 0),
        new THREE.Vector3(0.01, top - HOLE - 0.05, 0),
        new THREE.Vector3(-0.035, top - HOLE - 0.03, 0),
        new THREE.Vector3(-0.045, top - HOLE + 0.04, 0),
        new THREE.Vector3(-0.03, top - HOLE + 0.11, 0),
      ]),
    [top],
  );
  const gatePath = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, top + 0.24, 0),
        new THREE.Vector3(-0.035, top + 0.06, 0),
        new THREE.Vector3(-0.03, top - HOLE + 0.11, 0),
      ]),
    [top],
  );
  const metal = <meshStandardMaterial color="#e4e4e4" metalness={1} roughness={0.22} />;
  return (
    <group>
      {/* D-ring the strap loops through */}
      <mesh position={[0, top + 0.52, 0]} scale={[1, 0.82, 1]}>
        <torusGeometry args={[0.15, 0.024, 16, 64]} />
        {metal}
      </mesh>
      {/* swivel barrel */}
      <mesh position={[0, top + 0.36, 0]}>
        <cylinderGeometry args={[0.05, 0.075, 0.11, 32]} />
        {metal}
      </mesh>
      <mesh position={[0, top + 0.42, 0]}>
        <sphereGeometry args={[0.045, 24, 16]} />
        {metal}
      </mesh>
      {/* hook body (flattened) and spring gate */}
      <mesh scale={[1, 1, 0.6]}>
        <tubeGeometry args={[hookPath, 48, 0.026, 12, false]} />
        {metal}
      </mesh>
      <mesh scale={[1, 1, 0.6]}>
        <tubeGeometry args={[gatePath, 24, 0.012, 8, false]} />
        {metal}
      </mesh>
    </group>
  );
}

function CardFace({ url }: { url?: string | null }) {
  const tex = useMemo(() => (url ? null : makeFallbackTexture()), [url]);
  if (url) return <LoadedFace url={url} />;
  return <meshBasicMaterial map={tex!} toneMapped={false} />;
}

function LoadedFace({ url }: { url: string }) {
  const map = useTexture(url, (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  });
  return <meshBasicMaterial map={map} toneMapped={false} />;
}

function Band({ cardImage, strapImage, strapColor }: Required<Pick<Props, "strapColor">> & Pick<Props, "cardImage" | "strapImage">) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
    c.curveType = "chordal";
    return c;
  }, []);
  const lerped = useRef<Record<string, THREE.Vector3>>({});

  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);
  const [isWide, setIsWide] = useState(true);
  const { face, body } = useFaceGeometry();

  const strapTexture = useMemo(() => {
    if (!strapImage) return null;
    const t = new THREE.TextureLoader().load(strapImage);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, [strapImage]);

  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const segment = { type: "dynamic" as const, canSleep: true, colliders: false as const, angularDamping: 4, linearDamping: 4 };

  useRopeJoint(fixed as Body, j1 as Body, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1 as Body, j2 as Body, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2 as Body, j3 as Body, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3 as Body, card as Body, [[0, 0, 0], [0, CARD_H / 2 + HOOK, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current || !band.current) return;

    // Smooth the two middle joints to avoid jitter
    for (const [key, ref] of [["j1", j1], ["j2", j2]] as const) {
      const t = ref.current!.translation();
      const prev = (lerped.current[key] ??= new THREE.Vector3(t.x, t.y, t.z));
      const dist = Math.max(0.1, Math.min(1, prev.distanceTo(t as THREE.Vector3)));
      prev.lerp(t as THREE.Vector3, delta * (10 + dist * 40));
    }
    curve.points[0].copy(j3.current.translation() as THREE.Vector3);
    curve.points[1].copy(lerped.current.j2);
    curve.points[2].copy(lerped.current.j1);
    curve.points[3].copy(fixed.current.translation() as THREE.Vector3);
    band.current.geometry.setPoints(curve.getPoints(isWide ? 32 : 16));

    // Keep the card facing the camera
    ang.copy(card.current.angvel() as THREE.Vector3);
    rot.copy(card.current.rotation() as unknown as THREE.Vector3);
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  return (
    <>
      <group position={[0, 4.6, 0]}>
        <RigidBody ref={fixed} {...segment} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segment} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, CARD_D]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture?.(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture?.(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation() as THREE.Vector3)));
            }}
          >
            {/* card body (thin, matte) */}
            <mesh geometry={body}>
              <meshBasicMaterial color="#0a0a0a" />
            </mesh>
            <mesh geometry={face} position={[0, 0, CARD_D / 2 + 0.001]}>
              <CardFace url={cardImage} />
            </mesh>
            <mesh geometry={face} position={[0, 0, -CARD_D / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
              <meshBasicMaterial color="#111111" />
            </mesh>
            {/* punched hole for the hook */}
            {[1, -1].map((side) => (
              <mesh key={side} position={[0, CARD_H / 2 - HOLE, (side * CARD_D) / 2 + side * 0.002]} rotation={[0, side === 1 ? 0 : Math.PI, 0]}>
                <circleGeometry args={[0.055, 32]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            ))}
            <Clasp />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color={strapTexture ? "white" : strapColor}
          depthTest={false}
          resolution={isWide ? [1000, 2000] : [1000, 1000]}
          useMap={strapTexture ? 1 : 0}
          map={strapTexture ?? undefined}
          repeat={[-4, 1]}
          lineWidth={0.42}
        />
      </mesh>
    </>
  );
}
