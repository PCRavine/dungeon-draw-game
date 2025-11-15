import React from 'react';
import { CombatState, PlayerStats } from '../types/game';

interface CombatScreenProps {
  combatState: CombatState;
  player: PlayerStats;
  onAttack: () => void;
  onDefend: () => void;
  onFlee: () => void;
  onUseAbility: () => void;
  onActivateChaoticResonance: () => void;
}

export const CombatScreen: React.FC<CombatScreenProps> = ({
  combatState,
  player,
  onAttack,
  onDefend,
  onFlee,
  onUseAbility,
  onActivateChaoticResonance,
}) => {
  const { monster, combatLog, effects } = combatState;

  const monsterHpPercentage = Math.max(0, (monster.hp / (monster.hp + 20)) * 100); // Approximation

  const getAbilityName = () => {
    switch (player.archetype) {
      case 'bastion':
        return 'Hold the Line';
      case 'gambit':
        return 'Double Down';
      case 'seeker':
        return 'Find Weakness';
      default:
        return 'Ability';
    }
  };

  return (
    <div className="combat-screen">
      <div className="combat-header">
        <h2>{monster.isBoss ? '⚡ BOSS FIGHT ⚡' : 'Combat'}</h2>
      </div>

      {effects && effects.length > 0 && (
        <div className="combat-effects">
          {effects.map((effect, index) => (
            <span key={index} className="effect-badge">
              {effect}
            </span>
          ))}
        </div>
      )}

      <div className="combat-monster">
        <h3 className="monster-name">{monster.name}</h3>
        <div className="monster-hp-bar">
          <div
            className="monster-hp-fill"
            style={{ width: `${monsterHpPercentage}%` }}
          />
          <span className="monster-hp-text">HP: {monster.hp}</span>
        </div>
        <div className="monster-stats">
          <span>ATK: {monster.attack}</span>
          <span>DEF: {monster.defense}</span>
        </div>
      </div>

      <div className="combat-actions">
        <button className="btn btn-attack" onClick={onAttack}>
          ⚔️ Attack
        </button>
        <button className="btn btn-defend" onClick={onDefend}>
          🛡️ Defend
        </button>
        <button
          className="btn btn-ability"
          onClick={onUseAbility}
          disabled={player.abilityCooldown > 0}
        >
          {getAbilityName()} (
          {player.abilityCooldown > 0 ? `${player.abilityCooldown} Turns` : 'Ready'}
          )
        </button>
        {player.kin === 'void-touched' && (
          <button
            className="btn btn-void-ability"
            onClick={onActivateChaoticResonance}
            disabled={player.chaoticResonanceUsed || player.hp < 5}
          >
            🌀 Chaotic Resonance (5 HP)
          </button>
        )}
        {!monster.isBoss && (
          <button className="btn btn-flee" onClick={onFlee}>
            🏃 Flee (50%)
          </button>
        )}
      </div>

      <div className="combat-log">
        <h4>Combat Log:</h4>
        <div className="combat-log-entries">
          {combatLog.map((entry, index) => (
            <div key={index} className="combat-log-entry">
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
