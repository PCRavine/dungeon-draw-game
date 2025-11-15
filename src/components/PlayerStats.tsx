import React from 'react';
import { PlayerStats as PlayerStatsType } from '../types/game';

interface PlayerStatsProps {
  player: PlayerStatsType;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  const hpPercentage = (player.hp / player.maxHp) * 100;

  return (
    <div className="player-stats">
      <div className="stat-row">
        <span className="stat-label">Floor:</span>
        <span className="stat-value">{player.floor}</span>
      </div>

      <div className="stat-row hp-row">
        <span className="stat-label">HP:</span>
        <div className="hp-bar-container">
          <div
            className="hp-bar"
            style={{
              width: `${hpPercentage}%`,
              backgroundColor: hpPercentage > 50 ? '#4ade80' : hpPercentage > 25 ? '#fbbf24' : '#ef4444',
            }}
          />
          <span className="hp-text">
            {player.hp} / {player.maxHp}
          </span>
        </div>
      </div>

      <div className="stat-row">
        <span className="stat-label">Gold:</span>
        <span className="stat-value gold">{player.gold}</span>
      </div>

      <div className="stat-row">
        <span className="stat-label">Attack:</span>
        <span className="stat-value">{player.attack}</span>
      </div>

      <div className="stat-row">
        <span className="stat-label">Defense:</span>
        <span className="stat-value">{player.defense}</span>
      </div>
    </div>
  );
};
