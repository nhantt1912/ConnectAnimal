# Connect Animal Prototype (Cocos Creator 3.8)

## Overview
Connect Animal (also known as Onet Connect) is a simple puzzle prototype built with Cocos Creator 3.8.  
Players need to match and connect two identical tiles. If a valid path exists between them, a line is drawn and both tiles are removed.

---

## Scene
**Start Scene:** `GamePlay.scene`  
This is the main gameplay scene where all logic and visuals are handled.

---

## Main Scripts

| File | Description |
|------|--------------|
| **OnetManager.ts** | Core game controller. Handles grid generation, tile selection, connection validation, and line drawing. |
| **Tile.ts** | Represents an individual tile. Stores its type, position, and handles click events. |
| **GridHelper.ts** | Provides helper functions for grid operations, such as checking valid paths and empty cells. |
| **LineDrawer.ts** | Draws the connection line between matching tiles using the Graphics component. |

---

## Gameplay Logic
1. **Grid Generation**  
   - Creates a 6×8 grid of tiles at startup.  
   - Each tile is assigned a random type in pairs.

2. **Tile Selection**  
   - Player selects two tiles.  
   - If both tiles have the same type, the game checks if a valid path exists.

3. **Connection and Removal**  
   - If a valid path is found, `LineDrawer` draws a line, and both tiles are removed.  
   - Otherwise, the selection resets.

---

## Notes
- This project is a gameplay prototype only.  
- Additional UI, effects, and audio can be added for a complete game experience.
