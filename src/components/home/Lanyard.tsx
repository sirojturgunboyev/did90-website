"use client";
/**
 * 3D hanging badge with rope physics (react-three-fiber + rapier).
 * Written for DID90 to reproduce the Framer "Lanyard" hero effect:
 * a card hangs from a strap, swings with gravity and can be dragged.
 */
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
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
        camera={{ position: [0, 0, 15], fov: 20 }}
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

/** Badge model (card, clip, clamp) from the template's Lanyard component, hosted on Sanity CDN. */
const CARD_GLB_URL = "https://cdn.sanity.io/files/qeffq8u8/production/9afde76381bf1035ea3930954af70350d05f14e2.glb";
const CARD_IMAGE_HEIGHT_SCALE = 0.757;
useGLTF.preload(CARD_GLB_URL);

/** Cover-fit an image into a w×h box. */
function fit(iw: number, ih: number, w: number, h: number) {
  const ia = iw / ih;
  if (ia > w / h) {
    const width = h * ia;
    return { x: (w - width) / 2, y: 0, width, height: h };
  }
  const height = w / ia;
  return { x: 0, y: (h - height) / 2, width: w, height };
}

/** Default DID90° front: dark gradient with the logo near the bottom. */
function paintDefaultFront(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#1c1c1c");
  g.addColorStop(1, "#030303");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const lw = w * 0.3;
  ctx.save();
  ctx.translate((w - lw) / 2, h * 0.78);
  ctx.scale(lw / 1606, lw / 1606);
  ctx.fillStyle = "#ffffff";
  LOGO_PATHS.forEach((d) => ctx.fill(new Path2D(d)));
  ctx.restore();
}

/**
 * The model's UVs use a square texture: left half = front face, right half = back.
 * Front shows the uploaded image (or the default DID90° design).
 */
function useCardTexture(frontUrl?: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!frontUrl) return;
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => setImg(i);
    i.src = frontUrl.includes("cdn.sanity.io") ? `${frontUrl}?w=1024&auto=format` : frontUrl;
  }, [frontUrl]);

  return useMemo(() => {
    const res = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = res;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, res, res);
    const fw = res / 2;
    const fh = res * CARD_IMAGE_HEIGHT_SCALE;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, fw, fh);
    ctx.clip();
    if (img) {
      const d = fit(img.naturalWidth, img.naturalHeight, fw, fh);
      ctx.drawImage(img, d.x, d.y, d.width, d.height);
    } else {
      paintDefaultFront(ctx, fw, fh);
    }
    ctx.restore();
    // back: plain dark with small logo
    ctx.save();
    ctx.translate(fw, 0);
    paintDefaultFront(ctx, fw, fh);
    ctx.restore();
    const t = new THREE.CanvasTexture(canvas);
    t.flipY = false;
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 16;
    return t;
  }, [img]);
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
  const { nodes } = useGLTF(CARD_GLB_URL) as unknown as { nodes: Record<string, THREE.Mesh> };
  const cardTexture = useCardTexture(cardImage);

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
  useSphericalJoint(j3 as Body, card as Body, [[0, 0, 0], [0, 1.5, 0]]);

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
      <group position={[0, 4, 0]}>
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
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
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
            <group scale={2.25} position={[0, -1.2, -0.05]}>
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial map={cardTexture} clearcoat={1} clearcoatRoughness={0.15} roughness={0.9} metalness={0.8} />
              </mesh>
              <mesh geometry={nodes.clip.geometry}>
                <meshPhysicalMaterial color="#f2f2f2" roughness={0.3} metalness={0.8} />
              </mesh>
              <mesh geometry={nodes.clamp.geometry}>
                <meshPhysicalMaterial color="#f2f2f2" roughness={0.3} metalness={0.8} />
              </mesh>
            </group>
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
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
