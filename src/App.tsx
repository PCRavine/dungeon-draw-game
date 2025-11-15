import React, { useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { PlayerStats } from './components/PlayerStats';
import { Card } from './components/Card';
import { CombatScreen } from './components/CombatScreen';
import { GameOver } from './components/GameOver';
import { MerchantScreen } from './components/MerchantScreen';
import { KinSelectionScreen } from './components/KinSelectionScreen';
import { ArchetypeSelectionScreen } from './components/ArchetypeSelectionScreen';
import './App.css';
import './components/KinSelectionScreen.css';
import './components/ArchetypeSelectionScreen.css';

function App() {
  const { state, actions } = useGameState();

  // Auto-draw first card on mount
  useEffect(() => {
    if (!state.currentCard && state.gameStatus === 'playing' && !state.combatState) {
      actions.drawCard();
    }
  }, [state.currentCard, state.gameStatus, state.combatState, actions]);

  const handleCardAction = () => {
    if (!state.currentCard) return;

    switch (state.currentCard.type) {
      case 'monster':
      case 'boss':
        if (state.currentCard.monster) {
          actions.startCombat(state.currentCard.monster);
        }
        break;

      case 'treasure':
        if (state.currentCard.goldAmount) {
          actions.resolveTreasure(state.currentCard.goldAmount);
        }
        break;

      case 'trap':
        if (state.currentCard.damage) {
          actions.resolveTrap(state.currentCard.damage);
        }
        break;

      case 'rest':
      case 'fountain':
        if (state.currentCard.healAmount) {
          actions.resolveRest(state.currentCard.healAmount);
        }
        break;

      case 'merchant':
      case 'altar':
        // Do nothing, the UI will handle choices
        break;
    }
  };

  const getActionButtonText = () => {
    if (!state.currentCard) return 'Draw Card';

    switch (state.currentCard.type) {
      case 'monster':
      case 'boss':
        return 'Fight!';
      case 'treasure':
        return 'Open Chest';
      case 'trap':
        return 'Continue';
      case 'rest':
        return 'Rest';
      case 'fountain':
        return 'Drink';
      case 'merchant':
        return 'Talk';
      case 'altar':
        return 'Decide';
      default:
        return 'Continue';
    }
  };

  if (state.gameStatus === 'pre-game') {
    return <KinSelectionScreen onSelectKin={actions.selectKin} />;
  }

  if (state.gameStatus === 'selecting-archetype') {
    return <ArchetypeSelectionScreen onSelectArchetype={actions.selectArchetype} />;
  }

  if (state.gameStatus === 'won' || state.gameStatus === 'lost') {
    return (
      <GameOver
        won={state.gameStatus === 'won'}
        player={state.player}
        onRestart={actions.resetGame}
      />
    );
  }

  if (state.pendingBossWarning) {
    return (
      <div className="boss-warning-screen">
        <h2>⚠️ Evolved Senses Activated! ⚠️</h2>
        <p>You sense a powerful and dangerous presence lurking in the next card...</p>
        <p>Prepare yourself!</p>
        <button className="btn btn-primary btn-large" onClick={actions.proceedAfterWarning}>
          Proceed
        </button>
      </div>
    );
  }

  const renderCardArea = () => {
    if (!state.currentCard) {
      return (
        <div className="draw-card-prompt">
          <button className="btn btn-primary btn-large" onClick={actions.drawCard}>
            Draw Card
          </button>
        </div>
      );
    }

    if (state.currentCard.type === 'merchant') {
      return (
        <MerchantScreen
          player={state.player}
          onUpgrade={actions.buyUpgrade}
          onLeave={actions.dismissCard}
        />
      );
    }

    return (
      <div className="card-area">
        <Card card={state.currentCard} onResolve={handleCardAction} />
        {state.currentCard.type === 'altar' ? (
          <div className="choice-buttons">
            <button className="btn btn-primary" onClick={actions.prayAtAltar}>
              🙏 Pray
            </button>
            <button className="btn btn-secondary" onClick={actions.dismissCard}>
              Leave
            </button>
          </div>
        ) : state.currentCard.type === 'trap' && state.player.kin === 'human' && state.player.trapRerollsLeft > 0 ? (
          <div className="choice-buttons">
            <button className="btn btn-secondary" onClick={actions.rerollTrap}>
              🔄 Re-roll Trap ({state.player.trapRerollsLeft} left)
            </button>
            <button className="btn btn-primary" onClick={handleCardAction}>
              {getActionButtonText()}
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-large" onClick={handleCardAction}>
            {getActionButtonText()}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚔️ Dungeon Draw ⚔️</h1>
        <p className="tagline">Draw cards, fight monsters, conquer the dungeon!</p>
      </header>

      <div className="game-container">
        <aside className="sidebar">
          <PlayerStats player={state.player} />

          <div className="deck-info">
            <div className="deck-count">
              <span className="deck-label">Cards Left:</span>
              <span className="deck-value">{state.deck.length}</span>
            </div>
          </div>
        </aside>

        <main className="main-content">
          {state.combatState ? (
            <CombatScreen
              combatState={state.combatState}
              player={state.player}
              onAttack={actions.attack}
              onDefend={actions.defend}
              onFlee={actions.flee}
              onUseAbility={actions.useAbility}
              onActivateChaoticResonance={actions.activateChaoticResonance}
            />
          ) : (
            renderCardArea()
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
