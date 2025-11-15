import React from 'react';
import { Archetype } from '../types/game';
import './ArchetypeSelectionScreen.css';

interface ArchetypeSelectionScreenProps {
  onSelectArchetype: (archetype: Archetype) => void;
}

export const ArchetypeSelectionScreen: React.FC<ArchetypeSelectionScreenProps> = ({ onSelectArchetype }) => {
  return (
    <div className="archetype-selection-screen">
      <div className="archetype-selection-header">
        <h1>Choose Your Archetype</h1>
        <p>This choice grants you a powerful activated ability for combat.</p>
      </div>
      <div className="archetype-options">
        <div className="archetype-option-card">
          <h2>The Bastion</h2>
          <p className="archetype-description">An immovable object against the chaos, you protect your companions from the horrors of the Fractured Frontier.</p>
          <div className="archetype-details">
            <p><strong>Ability - Hold the Line:</strong> For your next turn, all damage you take is reduced by 75%.</p>
            <p><em>(4-turn cooldown)</em></p>
          </div>
          <button className="btn btn-primary" onClick={() => onSelectArchetype('bastion')}>
            Choose Bastion
          </button>
        </div>

        <div className="archetype-option-card">
          <h2>The Gambit</h2>
          <p className="archetype-description">A master of opportunity, you turn disadvantage into profit and danger into advantage, always playing the odds.</p>
          <div className="archetype-details">
            <p><strong>Ability - Double Down:</strong> Perform a second attack this turn. You cannot use the Defend action on your next turn.</p>
            <p><em>(3-turn cooldown)</em></p>
          </div>
          <button className="btn btn-primary" onClick={() => onSelectArchetype('gambit')}>
            Choose Gambit
          </button>
        </div>

        <div className="archetype-option-card">
          <h2>The Seeker</h2>
          <p className="archetype-description">Driven by an insatiable hunger for understanding, your mind is your sharpest tool against the unknown.</p>
          <div className="archetype-details">
            <p><strong>Ability - Find Weakness:</strong> Your next attack this turn completely ignores the enemy's defense value.</p>
            <p><em>(4-turn cooldown)</em></p>
          </div>
          <button className="btn btn-primary" onClick={() => onSelectArchetype('seeker')}>
            Choose Seeker
          </button>
        </div>
      </div>
    </div>
  );
};
