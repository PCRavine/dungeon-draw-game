import React from 'react';
import { Kin } from '../types/game';
import './KinSelectionScreen.css';

interface KinSelectionScreenProps {
  onSelectKin: (kin: Kin) => void;
}

export const KinSelectionScreen: React.FC<KinSelectionScreenProps> = ({ onSelectKin }) => {
  return (
    <div className="kin-selection-screen">
      <div className="kin-selection-header">
        <h1>Choose Your Kin</h1>
        <p>Your choice will determine your starting stats and unique talent.</p>
      </div>
      <div className="kin-options">
        <div className="kin-option-card">
          <h2>Human</h2>
          <p className="kin-description">The resilient survivors of the Fractured Frontier. Adaptable and tenacious.</p>
          <div className="kin-details">
            <p><strong>Stats:</strong> Balanced</p>
            <p><strong>Talent - Adaptive Resilience:</strong> Once per floor, you can re-roll the outcome of a Trap card.</p>
          </div>
          <button className="btn btn-primary" onClick={() => onSelectKin('human')}>
            Choose Human
          </button>
        </div>

        <div className="kin-option-card">
          <h2>Shifter</h2>
          <p className="kin-description">Descendants of those altered by the Fracture, you move with a feral grace.</p>
          <div className="kin-details">
            <p><strong>Stats:</strong> Higher Defense, Lower HP</p>
            <p><strong>Talent - Evolved Senses:</strong> You are warned before drawing a Boss card, giving you a chance to prepare.</p>
          </div>
          <button className="btn btn-primary" onClick={() => onSelectKin('shifter')}>
            Choose Shifter
          </button>
        </div>

        <div className="kin-option-card">
          <h2>Void-Touched</h2>
          <p className="kin-description">Anomalies infused with chaotic energy, you walk a knife's edge between power and annihilation.</p>
          <div className="kin-details">
            <p><strong>Stats:</strong> Higher Attack, Lower Defense</p>
            <p><strong>Talent - Chaotic Resonance:</strong> Once per combat, spend 5 HP to make your next attack a guaranteed Critical Hit.</p>
          </div>
          <button className="btn btn-primary" onClick={() => onSelectKin('void-touched')}>
            Choose Void-Touched
          </button>
        </div>
      </div>
    </div>
  );
};
