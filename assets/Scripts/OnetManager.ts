import { _decorator, Component, Node, SpriteFrame, Prefab, instantiate, Vec3, UITransform } from 'cc';
import { Tile } from './Tile';
import { LineDrawer } from './LineDrawer';
import { GridHelper } from './GridHelper';  
const { ccclass, property } = _decorator;

@ccclass('OnetManager')
export class OnetManager extends Component {

    @property(Prefab) tilePrefab: Prefab = null;
    @property([SpriteFrame]) animalSprites: SpriteFrame[] = [];
    @property(LineDrawer) connectLine: LineDrawer = null;

    private grid: (Tile | null)[][] = [];
    private selectedTiles: Tile[] = [];

    @property private rows: number = 6; 
    @property private cols: number = 8;
    @property private tileSpacing: number = 80;

    private gridHelper: GridHelper = null;

    protected onLoad() {
        this.gridHelper = this.node.getComponent(GridHelper);
    }
    
    start() {
        this.generateBoard();
    }

    // BOARD GENERATION

    private generateBoard() {
        if (this.animalSprites.length === 0) {
            console.warn(" Animal sprite list is empty.");
            return;
        }

        const totalTiles = this.rows * this.cols;
        const ids: number[] = [];

        for (let i = 0; i < totalTiles / 2; i++) {
            const rand = Math.floor(Math.random() * this.animalSprites.length);
            ids.push(rand, rand);
        }

        for (let i = ids.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ids[i], ids[j]] = [ids[j], ids[i]];
        }

        const startX = -(this.cols - 1) * this.tileSpacing / 2;
        const startY = (this.rows - 1) * this.tileSpacing / 2;

        let index = 0;
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.cols; c++) {
                const id = ids[index++];
                const tileNode = instantiate(this.tilePrefab);
                tileNode.setParent(this.node);

                const tile = tileNode.getComponent(Tile);
                tile.init(id, r, c, this.animalSprites[id], this.handleSelect.bind(this));

                tileNode.setPosition(
                    startX + c * this.tileSpacing,
                    startY - r * this.tileSpacing
                );

                this.grid[r][c] = tile;
            }
        }

        console.log(` Board generated: ${this.rows} x ${this.cols}`);
    }

    // HANDLE TILE SELECTION AND MATCHING

    private handleSelect(tile: Tile) {
        if (this.selectedTiles.indexOf(tile) !== -1) return;

        this.selectedTiles.push(tile);

        if (this.selectedTiles.length === 2) {
            const [a, b] = this.selectedTiles;
            const path = this.findConnectionPath(a, b);

            if (a.id === b.id && path) {
                this.connectLine.drawConnection(path);
                this.scheduleOnce(() => {
                    this.removeTile(a);
                    this.removeTile(b);
                }, 0.3);
            } else {
                console.log("No valid path between:", a.row, a.col, b.row, b.col);
            }

            this.selectedTiles = [];
        }
    }

    private removeTile(tile: Tile) {
        this.grid[tile.row][tile.col] = null;
        tile.remove();
    }

    private findConnectionPath(a: Tile, b: Tile): Vec3[] | null {
        if (a === b) return null;
        return this.gridHelper.checkRule0(a, b)
            || this.gridHelper.checkRule1(a, b)
            || this.gridHelper.checkRule2(a, b)
            || null;
    }

    getGrid(): (Tile | null)[][] {
        return this.grid;
    }

    getRows(){
        return this.rows;
    }

    getCols(){
        return this.cols;
    }

    getTileSpacing(){
        return this.tileSpacing;
    }
}
