// Core game types for Dungeon Draw

export type CardType =
  | 'monster'
  | 'treasure'
  | 'trap'
  | 'rest'
  | 'merchant'
  | 'boss'
  | 'altar'
  | 'fountain';

export type Kin = 'human' | 'shifter' | 'void-touched' | null;
export type Archetype = 'bastion' | 'gambit' | 'seeker' | null;

export interface PlayerStats {
  hp: number;
  maxHp: number;
  gold: number;
  attack: number;
  defense: number;
  floor: number;
  kin: Kin;
  archetype: Archetype;
  abilityCooldown: number;
  maxAbilityCooldown: number;
  isDefending: boolean;
  trapRerollsLeft: number;
  maxTrapRerolls: number;
  chaoticResonanceUsed: boolean;
}

export interface Monster {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  goldReward: number;
  isBoss: boolean;
}

export interface Card {
  id: string;
  type: CardType;
  title: string;
  description: string;
  monster?: Monster;
  goldAmount?: number;
  damage?: number;
  healAmount?: number;
}

export interface GameState {
  player: PlayerStats;
  deck: Card[];
  discardPile: Card[];
  currentCard: Card | null;
  gameStatus: 'pre-game' | 'selecting-archetype' | 'playing' | 'won' | 'lost';
  combatState: CombatState | null;
  pendingBossWarning: boolean;
}

export interface CombatState {
  monster: Monster;
  playerTurn: boolean;
  combatLog: string[];
  effects: string[];
}

export type GameAction =
  | { type: 'DRAW_CARD' }
  | { type: 'RESOLVE_TREASURE'; gold: number }
  | { type: 'RESOLVE_TRAP'; damage: number }
  | { type: 'RESOLVE_REST'; heal: number }
  | { type: 'START_COMBAT'; monster: Monster }
  | { type: 'ATTACK' }
  | { type: 'DEFEND' }
  | { type: 'FLEE' }
  | { type: 'END_COMBAT'; victory: boolean }
  | { type: 'ADVANCE_FLOOR' }
  | { type: 'GAME_OVER'; won: boolean }
  | { type: 'RESET_GAME' }
  | { type: 'BUY_UPGRADE'; upgrade: 'attack' | 'defense' | 'maxHp' }
  | { type: 'PRAY_AT_ALTAR' }
  | { type: 'DISMISS_CARD' }
  | { type: 'SELECT_KIN'; kin: Kin }
  | { type: 'SELECT_ARCHETYPE'; archetype: Archetype }
  | { type: 'USE_ABILITY' }
  | { type: 'REROLL_TRAP' }
  | { type: 'PROCEED_AFTER_WARNING' }
  | { type: 'ACTIVATE_CHAOTIC_RESONANCE' };
