import React from 'react';
import { PlayerStats } from '../types/game';

interface GameOverProps {
  won: boolean;
  player: PlayerStats;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ won, player, onRestart }) => {
  return (
    <div className="game-over">
      <div className="game-over-content">
        <h1 className="game-over-title">
          {won ? '🎉 Victory! 🎉' : '💀 Game Over 💀'}
        </h1>

        <div className="game-over-stats">
          <h2>Final Stats:</h2>
          <div className="final-stat">
            <span>Floor Reached:</span>
            <span className="final-stat-value">{player.floor}</span>
          </div>
          <div className="final-stat">
            <span>Gold Collected:</span>
            <span className="final-stat-value gold">{player.gold}</span>
          </div>
          <div className="final-stat">
            <span>Final HP:</span>
            <span className="final-stat-value">{player.hp} / {player.maxHp}</span>
          </div>
        </div>

        {won && (
          <div className="victory-message">
            <p>You have conquered the dungeon and emerged victorious!</p>
            <p>The realm owes you a great debt.</p>
          </div>
        )}

        {!won && (
          <div className="defeat-message">
            <p>Your journey ends here, but the dungeon awaits another hero...</p>
          </div>
        )}

        <button className="btn btn-restart" onClick={onRestart}>
          🔄 Play Again
        </button>
      </div>
    </div>
  );
};
