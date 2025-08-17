import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Mesh, Group } from 'three';

// ลูกบอลสีสวยที่ลอยอยู่
const CuteOrbs = () => {
  const groupRef = useRef<Group | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const orbs = useMemo(() => {
    const arr: {
      position: [number, number, number];
      scale: number;
      color: string;
    }[] = [];
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const radius = 6 + Math.sin(i) * 2;
      arr.push({
        position: [
          Math.cos(angle) * radius,
          Math.sin(i * 0.5) * 3,
          Math.sin(angle) * radius
        ],
        scale: 0.3 + Math.sin(i) * 0.2,
        color: `hsl(${(i * 25) % 360}, 70%, 60%)`
      });
    }
    return arr;
  }, []);

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.5} floatIntensity={0.8}>
          <mesh position={orb.position}>
            <sphereGeometry args={[orb.scale, 16, 16]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// หัวใจกลางที่หมุน
const CentralHeart = () => {
  const meshRef = useRef<Mesh | null>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // หมุนรอบแกน Y ต่อไป (เดิม) และยังคง scale pulse อยู่
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  const heartGeometry = useMemo(() => {
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
    heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
    heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
    heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

    const settings = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.1 };
    return new THREE.ExtrudeGeometry(heartShape, settings);
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      {/* หมุนรอบ Z 180 องศา เพื่อหงายหัวใจ */}
      <mesh ref={meshRef} geometry={heartGeometry} rotation={[0, 0, Math.PI]}>
        <meshStandardMaterial
          color="#ff69b4"
          emissive="#ff1493"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
};


// ดาวน่ารักๆ
const CuteStars = () => {
  const groupRef = useRef<Group | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  const stars = useMemo(() => {
    const arr: {
      position: [number, number, number];
      rotation: [number, number, number];
      color: string;
    }[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 4 + Math.cos(i) * 1.5;
      arr.push({
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle + Math.PI / 4) * 2,
          Math.sin(angle) * radius
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        color: `hsl(${45 + i * 15}, 80%, 70%)`
      });
    }
    return arr;
  }, []);

  return (
    <group ref={groupRef}>
      {stars.map((star, i) => (
        <Float key={i} speed={0.8 + i * 0.3} rotationIntensity={1} floatIntensity={0.6}>
          <mesh position={star.position} rotation={star.rotation}>
            <coneGeometry args={[0.3, 0.8, 5]} />
            <meshStandardMaterial
              color={star.color}
              emissive={star.color}
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// ฉาก 3D
const Scene = ({ enableControls }: { enableControls: boolean }) => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffd700" />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color="#ff69b4" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />

      <Stars radius={40} depth={40} count={2000} factor={3} saturation={0.5} fade speed={2} />

      <CentralHeart />
      <CuteOrbs />
      <CuteStars />


      <Text
        position={[0, 4, 0]}
        color="#ffffff"
        fontSize={0.8}
        maxWidth={10}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        สวัสดีครับ ^_^
      </Text>

      <Text
        position={[0, 3, 0]}
        color="#ffffff"
        fontSize={0.8}
        maxWidth={10}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        ผมชื่อมอส
      </Text>

      <Text
        position={[0, 2, 0]}
        color="#ffffff"
        fontSize={0.8}
        maxWidth={10}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        ยินดีที่ได้รู้จักครับ
      </Text>

      <Text
        position={[0, -4, 0]}
        color="#ffffff"
        fontSize={0.8}
        maxWidth={10}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        สัมผัสหน้าจอเพื่อหมุนดู 360°
      </Text>

      <OrbitControls
        // คุมการ enable ของ controls และ autoRotate ผ่าน prop
        enabled={enableControls}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={25}
        autoRotate={enableControls}
        autoRotateSpeed={3}
        // touches อาจมีปัญหากับ types — cast เป็น any เพื่อหลีกเลี่ยง error
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        touches={(THREE as any).TOUCH ? { ONE: (THREE as any).TOUCH.ROTATE, TWO: (THREE as any).TOUCH.DOLLY_PAN } : undefined}
      />
    </>
  );
};

// คอมโพเนนต์หลัก
const Hero3D = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExploring, setIsExploring] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 overflow-hidden">
      {/* Canvas 3D */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 12], fov: 60 }}
          onCreated={() => setIsLoaded(true)}
          dpr={[1, 2]}
        >
          <Scene enableControls={isExploring} />
        </Canvas>
      </div>

      {/* เนื้อหาหลัก — ซ่อนเมื่อเริ่มสำรวจ */}
      {!isExploring && (
        <div className={`relative z-10 min-h-screen flex items-center justify-center p-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-2xl text-center">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                โลก 3D
              </h1>

              <p className="text-xl text-pink-100 mb-8 leading-relaxed">
                สำรวจโลกของมอสในแบบ 360 องศา!<br />
                สัมผัสหน้าจอเพื่อหมุนดู ใช้นิ้วหยิกเพื่อซูม ✨
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <button
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={() => setIsExploring(true)}
                >
                  🚀 เริ่มสำรวจ
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { emoji: '🎮', title: 'โต้ตอบได้', desc: 'ลากหมุน 360°' },
                  { emoji: '✨', title: 'สีสันสดใส', desc: 'กราฟิก 3D' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 transform transition-all hover:scale-105">
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <div className="text-pink-200 font-semibold">{item.title}</div>
                    <div className="text-pink-300 text-sm">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-500/50 flex items-center justify-center">👆</div>
                  <span className="text-pink-200 text-sm">สัมผัสหมุน</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/50 flex items-center justify-center">🤏</div>
                  <span className="text-purple-200 text-sm">หยิกซูม</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* อนิเมชั่นพื้นหลัง */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-bounce"
            style={{
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#ff69b4', '#9d4edd', '#06ffa5', '#ffbe0b'][i % 4],
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>

      {/* แสงพื้นหลัง */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* สถานะ */}
      <div className="absolute top-4 left-4 text-pink-200 text-sm flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>{isLoaded ? (isExploring ? 'กำลังสำรวจ 360° ✨' : '3D โหลดเสร็จแล้ว ✨') : 'กำลังโหลด 3D...'}</span>
      </div>
    </div>
  );
};

export default Hero3D;
