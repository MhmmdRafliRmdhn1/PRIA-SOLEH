import React from 'react';
import { CULTURAL_EXHIBITS } from '../../utils/culturalData';

export const Lighting: React.FC = () => {
  return (
    <>
      {/* Low ambient light for prestigious dark museum atmosphere */}
      <ambientLight intensity={0.4} color="#3a4254" />

      {/* Main architectural key light */}
      <directionalLight
        position={[0, 15, 0]}
        intensity={0.6}
        color="#fff5ea"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={35}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />

      {/* Secondary fill light */}
      <directionalLight position={[-10, 8, -10]} intensity={0.25} color="#c5d1e0" />
      <directionalLight position={[10, 8, 10]} intensity={0.25} color="#e6d4aa" />

      {/* Dedicated warm golden spotlights directly focused on each exhibit */}
      {CULTURAL_EXHIBITS.map((exhibit) => {
        const [x, , z] = exhibit.modelPosition;
        return (
          <group key={`light-${exhibit.id}`}>
            {/* Ceiling Spotlight source */}
            <spotLight
              position={[x, 7.5, z]}
              target-position={[x, 1.2, z]}
              angle={0.42}
              penumbra={0.65}
              intensity={2.8}
              color="#fff0cc"
              castShadow
              distance={14}
            />
            {/* Visual ceiling recessed fixture glow */}
            <mesh position={[x, 7.9, z]}>
              <cylinderGeometry args={[0.3, 0.35, 0.1, 16]} />
              <meshBasicMaterial color="#ffea9f" />
            </mesh>
            <pointLight position={[x, 7.8, z]} intensity={0.8} color="#ffd466" distance={3} />

            {/* Exhibit pedestal accent under-glow */}
            <pointLight position={[x, 0.4, z]} intensity={0.4} color="#d4af37" distance={2.5} />
          </group>
        );
      })}

      {/* Central grand hallway accent spotlights */}
      <pointLight position={[0, 4.5, -8]} intensity={0.8} color="#ffe5b4" distance={10} />
      <pointLight position={[0, 4.5, 0]} intensity={0.9} color="#ffe5b4" distance={10} />
      <pointLight position={[0, 4.5, 8]} intensity={0.8} color="#ffe5b4" distance={10} />
    </>
  );
};

