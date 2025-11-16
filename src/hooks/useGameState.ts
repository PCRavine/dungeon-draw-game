import { useReducer, useCallback } from 'react';
import { GameState, GameAction, PlayerStats, Kin, Archetype } from '../types/game';
import { generateDeck } from '../utils/cardGenerator';

const INITIAL_PLAYER: PlayerStats = {
  hp: 50,
  maxHp: 50,
  gold: 0,
  attack: 5,
  defense: 2,
  floor: 1,
  kin: null,
  archetype: null,
  abilityCooldown: 0,
  maxAbilityCooldown: 0,
  isDefending: false,
  trapRerollsLeft: 0,
  maxTrapRerolls: 0,
  chaoticResonanceUsed: false,
};

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

function createInitialState(): GameState {
  return {
    player: { ...INITIAL_PLAYER },
    deck: generateDeck(1),
    discardPile: [],
    currentCard: null,
    gameStatus: 'pre-game',
    combatState: null,
    pendingBossWarning: false,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_KIN': {
      const newPlayer = { ...state.player, kin: action.kin };
      switch (action.kin) {
        case 'shifter':
          newPlayer.defense += 3;
          newPlayer.maxHp -= 10;
          newPlayer.hp -= 10;
          break;
        case 'void-touched':
          newPlayer.attack += 2;
          newPlayer.defense -= 2;
          newPlayer.chaoticResonanceUsed = false; // Reset for new game
          break;
        case 'human':
          newPlayer.maxTrapRerolls = 1;
          newPlayer.trapRerollsLeft = 1;
          break;
        default:
          break;
      }
      return {
        ...state,
        player: newPlayer,
        gameStatus: 'selecting-archetype',
      };
    }

    case 'SELECT_ARCHETYPE': {
      const newPlayer = { ...state.player, archetype: action.archetype };
      switch (action.archetype) {
        case 'bastion':
          newPlayer.maxAbilityCooldown = 4;
          break;
        case 'gambit':
          newPlayer.maxAbilityCooldown = 3;
          break;
        case 'seeker':
          newPlayer.maxAbilityCooldown = 4;
          break;
      }
      return {
        ...state,
        player: newPlayer,
        gameStatus: 'playing',
      };
    }

    case 'DRAW_CARD': {
      if (state.deck.length === 0) {
        // Deck exhausted, advance floor
        const newFloor = state.player.floor + 1;

        if (newFloor > 10) {
          return { ...state, gameStatus: 'won' };
        }

        const newPlayer = { ...state.player, floor: newFloor, trapRerollsLeft: state.player.maxTrapRerolls };

        return {
          ...state,
          player: newPlayer,
          deck: generateDeck(newFloor),
          discardPile: [],
          currentCard: null,
        };
      }

      // Shifter Evolved Senses
      if (state.player.kin === 'shifter' && state.deck[0]?.type === 'boss') {
        return {
          ...state,
          pendingBossWarning: true,
        };
      }

      const [drawnCard, ...remainingDeck] = state.deck;
      return { ...state, deck: remainingDeck, currentCard: drawnCard };
    }

    case 'PROCEED_AFTER_WARNING': {
      if (!state.pendingBossWarning) return state;

      const [drawnCard, ...remainingDeck] = state.deck;
      return {
        ...state,
        deck: remainingDeck,
        currentCard: drawnCard,
        pendingBossWarning: false,
      };
    }

    case 'REROLL_TRAP': {
      if (state.player.kin !== 'human' || state.player.trapRerollsLeft <= 0 || state.currentCard?.type !== 'trap') {
        return state;
      }

      const newPlayer = { ...state.player, trapRerollsLeft: state.player.trapRerollsLeft - 1 };
      const newDiscardPile = state.currentCard ? [...state.discardPile, state.currentCard] : state.discardPile;

      if (state.deck.length === 0) {
        // If deck is empty after rerolling, advance floor
        const newFloor = newPlayer.floor + 1;
        if (newFloor > 10) {
          return { ...state, gameStatus: 'won' };
        }
        return {
          ...state,
          player: { ...newPlayer, floor: newFloor, trapRerollsLeft: newPlayer.maxTrapRerolls },
          deck: generateDeck(newFloor),
          discardPile: newDiscardPile,
          currentCard: null,
        };
      }

      const [drawnCard, ...remainingDeck] = state.deck;

      return {
        ...state,
        player: newPlayer,
        deck: remainingDeck,
        discardPile: newDiscardPile,
        currentCard: drawnCard,
      };
    }

    case 'RESOLVE_TREASURE': {
      return {
        ...state,
        player: { ...state.player, gold: state.player.gold + action.gold },
        discardPile: state.currentCard ? [...state.discardPile, state.currentCard] : state.discardPile,
        currentCard: null,
      };
    }

    case 'RESOLVE_TRAP': {
      const newHp = Math.max(0, state.player.hp - action.damage);
      return {
        ...state,
        player: { ...state.player, hp: newHp },
        discardPile: state.currentCard ? [...state.discardPile, state.currentCard] : state.discardPile,
        currentCard: null,
        gameStatus: newHp <= 0 ? 'lost' : state.gameStatus,
      };
    }

    case 'RESOLVE_REST': {
      const newHp = Math.min(state.player.maxHp, state.player.hp + action.heal);
      return {
        ...state,
        player: { ...state.player, hp: newHp },
        discardPile: state.currentCard ? [...state.discardPile, state.currentCard] : state.discardPile,
        currentCard: null,
      };
    }

    case 'START_COMBAT': {
      return {
        ...state,
        combatState: {
          monster: { ...action.monster },
          playerTurn: true,
          combatLog: [`You encounter ${action.monster.name}!`],
          effects: [],
        },
        player: { ...state.player, chaoticResonanceUsed: false }, // Reset for new combat
      };
    }

    case 'ATTACK': {
      if (!state.combatState) return state;

      let { monster, combatLog, effects } = state.combatState;
      let newLog = [...combatLog];
      let newPlayer = { ...state.player };

      // Player attacks
      const isFindingWeakness = effects.includes('Find Weakness');
      const isGuaranteedCrit = effects.includes('Guaranteed Crit');

      let playerDamage = Math.max(1, newPlayer.attack - (isFindingWeakness ? 0 : monster.defense));

      let isCriticalHit = Math.random() < 0.1;
      if (isGuaranteedCrit) {
        isCriticalHit = true; // Force critical hit
        effects = effects.filter(e => e !== 'Guaranteed Crit'); // Remove effect after use
        newLog.push(`✨ Chaotic Resonance! Guaranteed Critical Hit!`);
      }

      if (isCriticalHit) {
        playerDamage = Math.floor(playerDamage * 1.5);
        newLog.push(`💥 Critical Hit!`);
      }
      
      if (isFindingWeakness) {
        newLog.push(`You found a weakness!`);
        effects = effects.filter(e => e !== 'Find Weakness');
      }

      const newMonsterHp = monster.hp - playerDamage;
      newLog.push(`You deal ${playerDamage} damage!`);

      if (newMonsterHp <= 0) {
        newLog.push(`${monster.name} defeated! You gain ${monster.goldReward} gold.`);
        return {
          ...state,
          player: { ...newPlayer, gold: newPlayer.gold + monster.goldReward },
          combatState: null,
          discardPile: state.currentCard ? [...state.discardPile, state.currentCard] : state.discardPile,
          currentCard: null,
          gameStatus: monster.isBoss && newPlayer.floor === 10 ? 'won' : state.gameStatus,
        };
      }

      // Monster counter-attacks
      const isHoldingTheLine = effects.includes('Hold the Line');
      let monsterDamage = Math.max(1, monster.attack - (newPlayer.isDefending ? Math.floor(newPlayer.defense * 1.5) : newPlayer.defense));
      if (isHoldingTheLine) {
        monsterDamage = Math.floor(monsterDamage * 0.25);
        newLog.push(`You hold the line, reducing damage!`);
        effects = effects.filter(e => e !== 'Hold the Line');
      }
      
      const newPlayerHp = newPlayer.hp - monsterDamage;
      newLog.push(`${monster.name} attacks for ${monsterDamage} damage!`);
      
      newPlayer.hp = newPlayerHp;
      newPlayer.isDefending = false;
      if (newPlayer.abilityCooldown > 0) {
        newPlayer.abilityCooldown -= 1;
      }

      if (newPlayerHp <= 0) {
        return { ...state, player: { ...newPlayer, hp: 0 }, gameStatus: 'lost' };
      }

      return {
        ...state,
        player: newPlayer,
        combatState: { ...state.combatState, monster: { ...monster, hp: newMonsterHp }, combatLog: newLog, effects },
      };
    }

    case 'DEFEND': {
      if (!state.combatState) return state;
      
      let newPlayer = { ...state.player, isDefending: true };
      let { monster, combatLog, effects } = state.combatState;
      let newLog = [...combatLog];

      newLog.push(`You brace for impact!`);

      const isHoldingTheLine = effects.includes('Hold the Line');
      let monsterDamage = Math.max(0, Math.floor((monster.attack - newPlayer.defense) * 0.5));
      if (isHoldingTheLine) {
        monsterDamage = Math.floor(monsterDamage * 0.25);
        newLog.push(`You hold the line, reducing damage!`);
        effects = effects.filter(e => e !== 'Hold the Line');
      }

      if (monsterDamage > 0) {
        newLog.push(`${monster.name} attacks for ${monsterDamage} damage (reduced)!`);
      } else {
        newLog.push(`${monster.name} attacks but you block it!`);
      }
      
      const newPlayerHp = newPlayer.hp - monsterDamage;
      newPlayer.hp = newPlayerHp;
      if (newPlayer.abilityCooldown > 0) {
        newPlayer.abilityCooldown -= 1;
      }

      if (newPlayerHp <= 0) {
        return { ...state, player: { ...newPlayer, hp: 0 }, gameStatus: 'lost' };
      }

      return { ...state, player: newPlayer, combatState: { ...state.combatState, combatLog: newLog, effects } };
    }

    case 'USE_ABILITY': {
      if (!state.combatState || state.player.abilityCooldown > 0) return state;

      const newPlayer = { ...state.player };
      const { combatLog, effects } = state.combatState;
      let newLog = [...combatLog];
      let newEffects = [...effects];

      switch (newPlayer.archetype) {
        case 'bastion':
          newLog.push('You prepare to Hold the Line!');
          newEffects.push('Hold the Line');
          break;
        case 'seeker':
          newLog.push('You look for a weakness!');
          newEffects.push('Find Weakness');
          break;
        case 'gambit':
          // This is a simplified version of a second attack
          newLog.push('Double Down! You attack again!');
          // Essentially a copy of the ATTACK logic, without the counter-attack
          let playerDamage = Math.max(1, newPlayer.attack - state.combatState.monster.defense);
          const isCriticalHit = Math.random() < 0.1;
          if (isCriticalHit) {
            playerDamage = Math.floor(playerDamage * 1.5);
            newLog.push(`💥 Critical Hit!`);
          }
          const newMonsterHp = state.combatState.monster.hp - playerDamage;
          newLog.push(`You deal an extra ${playerDamage} damage!`);
          state.combatState.monster.hp = newMonsterHp;
          if (newMonsterHp <= 0) {
             newLog.push(`${state.combatState.monster.name} defeated! You gain ${state.combatState.monster.goldReward} gold.`);
             return {
               ...state,
               player: { ...newPlayer, gold: newPlayer.gold + state.combatState.monster.goldReward, abilityCooldown: newPlayer.maxAbilityCooldown },
               combatState: null,
               discardPile: state.currentCard ? [...state.discardPile, state.currentCard] : state.discardPile,
               currentCard: null,
               gameStatus: state.combatState.monster.isBoss && newPlayer.floor === 10 ? 'won' : state.gameStatus,
             };
          }
          break;
      }
      
      newPlayer.abilityCooldown = newPlayer.maxAbilityCooldown;

      return {
        ...state,
        player: newPlayer,
        combatState: { ...state.combatState, combatLog: newLog, effects: newEffects },
      };
    }

    case 'ACTIVATE_CHAOTIC_RESONANCE': {
      if (state.player.kin !== 'void-touched' || state.player.chaoticResonanceUsed || state.player.hp < 5 || !state.combatState) {
        return state;
      }
      const newPlayer = { ...state.player, hp: state.player.hp - 5, chaoticResonanceUsed: true };
      const newEffects = [...state.combatState.effects, 'Guaranteed Crit'];
      const newLog = [...state.combatState.combatLog, 'You channel chaotic energy, preparing for a devastating blow! (5 HP lost)'];

      return {
        ...state,
        player: newPlayer,
        combatState: { ...state.combatState, effects: newEffects, combatLog: newLog },
      };
    }

    case 'FLEE': {
       if (!state.combatState) return state;
       const fled = Math.random() < 0.5;
       if (fled) {
         return { ...state, combatState: null, discardPile: state.currentCard ? [...state.discardPile, state.currentCard] : state.discardPile, currentCard: null };
       }

       const { monster, combatLog } = state.combatState;
       const newLog = [...combatLog, `Failed to flee!`];
       const monsterDamage = Math.max(1, monster.attack - state.player.defense);
       const newPlayerHp = state.player.hp - monsterDamage;
       newLog.push(`${monster.name} attacks for ${monsterDamage} damage!`);

       if (newPlayerHp <= 0) {
         return { ...state, player: { ...state.player, hp: 0 }, gameStatus: 'lost' };
       }
       return { ...state, player: { ...state.player, hp: newPlayerHp }, combatState: { ...state.combatState, combatLog: newLog } };
    }

    case 'BUY_UPGRADE': {
      const cost = getUpgradeCost(action.upgrade, state.player);
      if (state.player.gold < cost) return state;
      const newPlayer = { ...state.player, gold: state.player.gold - cost };
      switch (action.upgrade) {
        case 'attack': newPlayer.attack += 1; break;
        case 'defense': newPlayer.defense += 1; break;
        case 'maxHp': newPlayer.maxHp += 5; newPlayer.hp += 5; break;
      }
      return { ...state, player: newPlayer };
    }

    case 'PRAY_AT_ALTAR': {
      const blessed = Math.random() < 0.5;
      let newPlayer = { ...state.player };
      if (blessed) {
        newPlayer.attack += 1;
      } else {
        const damage = 10;
        newPlayer.hp = Math.max(0, newPlayer.hp - damage);
      }
      return {
        ...state,
        player: newPlayer,
        gameStatus: newPlayer.hp <= 0 ? 'lost' : state.gameStatus,
        discardPile: state.currentCard ? [...state.discardPile, state.currentCard] : state.discardPile,
        currentCard: null,
      };
    }

    case 'DISMISS_CARD': {
      return { ...state, discardPile: state.currentCard ? [...state.discardPile, state.currentCard] : state.discardPile, currentCard: null };
    }

    case 'RESET_GAME': {
      return createInitialState();
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  const selectKin = useCallback((kin: Kin) => dispatch({ type: 'SELECT_KIN', kin }), []);
  const selectArchetype = useCallback((archetype: Archetype) => dispatch({ type: 'SELECT_ARCHETYPE', archetype }), []);
  const drawCard = useCallback(() => dispatch({ type: 'DRAW_CARD' }), []);
  const resolveTreasure = useCallback((gold: number) => dispatch({ type: 'RESOLVE_TREASURE', gold }), []);
  const resolveTrap = useCallback((damage: number) => dispatch({ type: 'RESOLVE_TRAP', damage }), []);
  const resolveRest = useCallback((heal: number) => dispatch({ type: 'RESOLVE_REST', heal }), []);
  const startCombat = useCallback((monster: any) => dispatch({ type: 'START_COMBAT', monster }), []);
  const attack = useCallback(() => dispatch({ type: 'ATTACK' }), []);
  const defend = useCallback(() => dispatch({ type: 'DEFEND' }), []);
  const flee = useCallback(() => dispatch({ type: 'FLEE' }), []);
  const useAbility = useCallback(() => dispatch({ type: 'USE_ABILITY' }), []);
  const rerollTrap = useCallback(() => dispatch({ type: 'REROLL_TRAP' }), []);
  const proceedAfterWarning = useCallback(() => dispatch({ type: 'PROCEED_AFTER_WARNING' }), []);
  const activateChaoticResonance = useCallback(() => dispatch({ type: 'ACTIVATE_CHAOTIC_RESONANCE' }), []);
  const resetGame = useCallback(() => dispatch({ type: 'RESET_GAME' }), []);
  const buyUpgrade = useCallback((upgrade: 'attack' | 'defense' | 'maxHp') => dispatch({ type: 'BUY_UPGRADE', upgrade }), []);
  const dismissCard = useCallback(() => dispatch({ type: 'DISMISS_CARD' }), []);
  const prayAtAltar = useCallback(() => dispatch({ type: 'PRAY_AT_ALTAR' }), []);

  return {
    state,
    actions: {
      selectKin,
      selectArchetype,
      drawCard,
      resolveTreasure,
      resolveTrap,
      resolveRest,
      startCombat,
      attack,
      defend,
      flee,
      useAbility,
      rerollTrap,
      proceedAfterWarning,
      activateChaoticResonance,
      resetGame,
      buyUpgrade,
      dismissCard,
      prayAtAltar,
    },
  };
}