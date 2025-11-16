import React from 'react';
import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
}

export const Card: React.FC<CardProps> = ({ card }) => {
  const getCardClass = () => {
    switch (card.type) {
      case 'monster':
        return 'card-monster';
      case 'boss':
        return 'card-boss';
      case 'treasure':
        return 'card-treasure';
      case 'trap':
        return 'card-trap';
      case 'rest':
        return 'card-rest';
      case 'merchant':
        return 'card-merchant';
      default:
        return '';
    }
  };

  const getCardIcon = () => {
    switch (card.type) {
      case 'monster':
      case 'boss':
        return '⚔️';
      case 'treasure':
        return '💰';
      case 'trap':
        return '🔥';
      case 'rest':
        return '❤️';
      case 'merchant':
        return '🛒';
      default:
        return '❓';
    }
  };

  const renderCardDetails = () => {
    switch (card.type) {
      case 'monster':
      case 'boss':
        if (card.monster) {
          return (
            <div className="card-details">
              <div className="monster-stats">
                <div>HP: {card.monster.hp}</div>
                <div>ATK: {card.monster.attack}</div>
                <div>DEF: {card.monster.defense}</div>
                <div>Reward: {card.monster.goldReward} gold</div>
              </div>
            </div>
          );
        }
        break;
      case 'treasure':
        return (
          <div className="card-details">
            <div className="treasure-amount">+{card.goldAmount} Gold</div>
          </div>
        );
      case 'trap':
        return (
          <div className="card-details">
            <div className="trap-damage">-{card.damage} HP</div>
          </div>
        );
      case 'rest':
        return (
          <div className="card-details">
            <div className="heal-amount">+{card.healAmount} HP</div>
          </div>
        );
    }
    return null;
  };

  return (
    <div className={`card ${getCardClass()}`}>
      <div className="card-icon">{getCardIcon()}</div>
      <h3 className="card-title">{card.title}</h3>
      <p className="card-description">{card.description}</p>
      {renderCardDetails()}
    </div>
  );
};
