import React from 'react';
import { ZONES } from '../../../config/layout';
import { IslandZone } from './IslandZone';

export const IslandZones: React.FC = () => (
  <group>
    {ZONES.map((z) => (
      <IslandZone key={z.id} layout={z} />
    ))}
  </group>
);
