import React from 'react';
import { Floor } from './hall/Floor';
import { Architecture } from './hall/Architecture';
import { Dome } from './hall/Dome';
import { Plaza } from './hall/Plaza';
import { IslandZones } from './zones/IslandZones';
import { IndonesiaGlobe } from './globe/IndonesiaGlobe';

/** Komposisi seluruh museum: arsitektur aula, plaza, globe, dan lima zona pulau. */
export const MuseumScene: React.FC = () => (
  <group>
    <Floor />
    <Architecture />
    <Dome />
    <Plaza />
    <IndonesiaGlobe />
    <IslandZones />
  </group>
);
