import React from 'react';
import { PlayerStats } from '../types/game';

interface MerchantScreenProps {
  player: PlayerStats;
  onUpgrade: (upgrade: 'attack' | 'defense' | 'maxHp') => void;
  onLeave: () => void;
}

const getUpgradeCost = (upgrade: 'attack' | 'defense' | 'maxHp', player: PlayerStats) => {
  // Base cost + scaling cost
  switch (upgrade) {
    case 'attack':
      return 10 + (player.attack - 5) * 5;
    case 'defense':
      return 10 + (player.defense - 2) * 5;
    case 'maxHp':
      return 15 + ((player.maxHp - 50) / 5) * 5;
    default:
      return 999;
  }
};

export const MerchantScreen: React.FC<MerchantScreenProps> = ({ player, onUpgrade, onLeave }) => {
  const attackCost = getUpgradeCost('attack', player);
  const defenseCost = getUpgradeCost('defense', player);
  const maxHpCost = getUpgradeCost('maxHp', player);

  return (
    <div className="merchant-screen">
      <div className="merchant-header">
        <h2>💰 Merchant 💰</h2>
        <p>Spend your gold to get stronger!</p>
        <p className="player-gold">Your Gold: {player.gold}</p>
      </div>

      <div className="merchant-wares">
        <div className="merchant-item">
          <h3>Upgrade Attack (+1)</h3>
          <p>Current: {player.attack}</p>
          <button
            className="btn btn-primary"
            onClick={() => onUpgrade('attack')}
            disabled={player.gold < attackCost}
          >
            Cost: {attackCost} Gold
          </button>
        </div>

        <div className="merchant-item">
          <h3>Upgrade Defense (+1)</h3>
          <p>Current: {player.defense}</p>
          <button
            className="btn btn-primary"
            onClick={() => onUpgrade('defense')}
            disabled={player.gold < defenseCost}
          >
            Cost: {defenseCost} Gold
          </button>
        </div>

        <div className="merchant-item">
          <h3>Increase Max HP (+5)</h3>
          <p>Current: {player.maxHp}</p>
          <button
            className="btn btn-primary"
            onClick={() => onUpgrade('maxHp')}
            disabled={player.gold < maxHpCost}
          >
            Cost: {maxHpCost} Gold
          </button>
        </div>
      </div>

      <div className="merchant-footer">
        <button className="btn btn-secondary" onClick={onLeave}>
          Leave Merchant
        </button>
      </div>
    </div>
  );
};
