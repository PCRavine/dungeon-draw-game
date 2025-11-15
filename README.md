# Dungeon Draw

A card-based dungeon crawler game where you draw cards to explore procedurally generated dungeons, fight monsters, collect treasure, and defeat bosses!

## Features

- **Card-based Gameplay**: Draw cards to reveal rooms, encounters, and challenges
- **Turn-based Combat**: Strategic combat with Attack, Defend, and Flee options
- **RPG Mechanics**: HP, Gold, Attack, and Defense stats
- **Procedural Generation**: Each floor offers unique challenges
- **Boss Battles**: Epic boss fights on floors 5 and 10
- **Progressive Difficulty**: Enemies scale in difficulty as you advance
- **PWA Support**: Install and play offline on mobile devices

## How to Play

1. **Draw Cards**: Click "Draw Card" to explore the dungeon
2. **Encounter Types**:
   - **Monster**: Fight enemies for gold rewards
   - **Boss**: Face powerful bosses at the end of certain floors
   - **Treasure**: Find gold to improve your character
   - **Trap**: Avoid or survive dangerous traps
   - **Rest**: Heal your HP at safe areas
   - **Merchant**: (Coming soon) Buy upgrades and items

3. **Combat**:
   - **Attack**: Deal damage to the monster
   - **Defend**: Reduce incoming damage by 50%
   - **Flee**: 50% chance to escape (not available for bosses)

4. **Win Condition**: Defeat the final boss on floor 10
5. **Lose Condition**: HP reaches 0

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to play the game.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## PWA/Mobile Deployment

The game is configured as a Progressive Web App (PWA) and can be:
- Installed on mobile devices
- Played offline
- Converted to a Trusted Web Activity (TWA) for Play Store deployment

### Building for Mobile

1. Build the production version: `npm run build`
2. The `dist` folder contains all necessary files
3. Deploy to a hosting service (Netlify, Vercel, etc.)
4. Users can install the PWA from their browser

### TWA for Play Store (Optional)

To publish on Google Play Store as a TWA:
1. Use [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) to convert the PWA to TWA
2. Follow the TWA setup guide
3. Submit to Play Store

## Technology Stack

- **React**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **vite-plugin-pwa**: PWA support
- **CSS3**: Styling with custom properties

## Game Balance

- **Starting Stats**: 50 HP, 5 Attack, 2 Defense
- **10 Floors** to complete
- **Boss fights** on floors 5 and 10
- **Progressive difficulty** scaling
- **Weighted card distribution** for balanced gameplay

## Future Enhancements

- [ ] Character classes with unique abilities
- [ ] Equipment system
- [ ] More enemy types
- [ ] Merchant functionality for buying upgrades
- [ ] Daily challenge mode with fixed seeds
- [ ] Leaderboards
- [ ] Sound effects and music
- [ ] More card types and events

## License

MIT License - Feel free to use and modify for your own projects!

---

Made with Claude Code
