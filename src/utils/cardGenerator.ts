import { Card, CardType, Monster } from '../types/game';

// Weighted random selection
function weightedRandom<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

// Monster templates by floor difficulty
const monsterTemplates = [
  // Floor 1-2: Easy enemies
  { name: 'Goblin', baseHp: 8, baseAttack: 2, baseDefense: 0, gold: 5 },
  { name: 'Giant Rat', baseHp: 6, baseAttack: 3, baseDefense: 0, gold: 3 },
  { name: 'Skeleton', baseHp: 10, baseAttack: 2, baseDefense: 1, gold: 6 },

  // Floor 3-5: Medium enemies
  { name: 'Orc Warrior', baseHp: 15, baseAttack: 4, baseDefense: 2, gold: 10 },
  { name: 'Dark Mage', baseHp: 12, baseAttack: 5, baseDefense: 1, gold: 12 },
  { name: 'Cursed Knight', baseHp: 18, baseAttack: 3, baseDefense: 3, gold: 15 },

  // Floor 6-9: Hard enemies
  { name: 'Demon', baseHp: 25, baseAttack: 6, baseDefense: 3, gold: 20 },
  { name: 'Wraith', baseHp: 20, baseAttack: 7, baseDefense: 2, gold: 18 },
  { name: 'Gargoyle', baseHp: 30, baseAttack: 5, baseDefense: 5, gold: 22 },
];

function generateMonster(floor: number): Monster {
  // Select appropriate monsters for current floor
  let validMonsters = monsterTemplates;

  if (floor <= 2) {
    validMonsters = monsterTemplates.slice(0, 3);
  } else if (floor <= 5) {
    validMonsters = monsterTemplates.slice(0, 6);
  }

  const template = validMonsters[Math.floor(Math.random() * validMonsters.length)];

  // Scale stats based on floor
  const floorMultiplier = 1 + (floor - 1) * 0.15;

  return {
    name: template.name,
    hp: Math.floor(template.baseHp * floorMultiplier),
    attack: Math.floor(template.baseAttack * floorMultiplier),
    defense: Math.floor(template.baseDefense * floorMultiplier),
    goldReward: Math.floor(template.gold * floorMultiplier),
    isBoss: false,
  };
}

function generateBoss(floor: number): Monster {
  const bossTemplates = [
    { name: 'Goblin King', baseHp: 40, baseAttack: 8, baseDefense: 4 },
    { name: 'Lich Lord', baseHp: 50, baseAttack: 10, baseDefense: 5 },
    { name: 'Ancient Dragon', baseHp: 75, baseAttack: 12, baseDefense: 7 },
  ];

  const template = bossTemplates[Math.min(Math.floor(floor / 3), bossTemplates.length - 1)];
  const floorMultiplier = 1 + (floor - 1) * 0.1;

  return {
    name: template.name,
    hp: Math.floor(template.baseHp * floorMultiplier),
    attack: Math.floor(template.baseAttack * floorMultiplier),
    defense: Math.floor(template.baseDefense * floorMultiplier),
    goldReward: floor * 50,
    isBoss: true,
  };
}

export function generateCard(floor: number, cardNumber: number, totalCards: number): Card {
  const id = `${floor}-${cardNumber}-${Date.now()}-${Math.random()}`;

  // Boss appears at the end of floors 5 and 10
  if ((floor === 5 || floor === 10) && cardNumber === totalCards - 1) {
    const boss = generateBoss(floor);
    return {
      id,
      type: 'boss',
      title: `Boss: ${boss.name}`,
      description: `Face the fearsome ${boss.name}!`,
      monster: boss,
    };
  }

  // Weighted card distribution
  const cardTypes: CardType[] = ['monster', 'treasure', 'trap', 'rest', 'merchant', 'altar', 'fountain'];
  const weights = [45, 20, 15, 10, 5, 7, 8]; // Monster encounters most common

  const type = weightedRandom(cardTypes, weights);

  switch (type) {
    case 'monster': {
      const monster = generateMonster(floor);
      return {
        id,
        type: 'monster',
        title: `Monster: ${monster.name}`,
        description: `A wild ${monster.name} appears!`,
        monster,
      };
    }

    case 'treasure': {
      const goldAmount = Math.floor((10 + Math.random() * 20) * (1 + floor * 0.3));
      return {
        id,
        type: 'treasure',
        title: 'Treasure Chest',
        description: `You found a chest!`,
        goldAmount,
      };
    }

    case 'trap': {
      const damage = Math.floor((3 + Math.random() * 7) * (1 + floor * 0.2));
      return {
        id,
        type: 'trap',
        title: 'Trap!',
        description: `A trap springs!`,
        damage,
      };
    }

    case 'rest': {
      const healAmount = Math.floor(5 + Math.random() * 10);
      return {
        id,
        type: 'rest',
        title: 'Rest Area',
        description: `A safe place to rest.`,
        healAmount,
      };
    }

    case 'fountain': {
        const healAmount = 25;
        return {
            id,
            type: 'fountain',
            title: 'Healing Fountain',
            description: 'You drink from a magical fountain.',
            healAmount,
        };
    }

    case 'merchant': {
      return {
        id,
        type: 'merchant',
        title: 'Merchant',
        description: `A traveling merchant appears.`,
      };
    }

    case 'altar': {
        return {
            id,
            type: 'altar',
            title: 'Mysterious Altar',
            description: 'A strange altar beckons. Do you pray?',
        };
    }

    default:
      return generateCard(floor, cardNumber, totalCards); // Fallback
  }
}

export function generateDeck(floor: number, deckSize: number = 10): Card[] {
  const deck: Card[] = [];

  for (let i = 0; i < deckSize; i++) {
    deck.push(generateCard(floor, i, deckSize));
  }

  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}
