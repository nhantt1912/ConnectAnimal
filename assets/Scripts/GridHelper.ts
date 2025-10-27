import { _decorator, Component, Node, Vec3 } from 'cc';
import { Tile } from './Tile';
import { OnetManager } from './OnetManager';
const { ccclass, property } = _decorator;

@ccclass('GridHelper')
export class GridHelper extends Component {
    
    onetManager: OnetManager | null = null;

    protected onLoad() {
        this.onetManager = this.node.getComponent(OnetManager);
    }

    private isEmpty(row: number, col: number): boolean {
        const onetManager = this.node.getComponent(OnetManager);
        if (row < 0 || row >= onetManager.getRows() || col < 0 || col >= onetManager.getCols()) return true;
        if(!onetManager) return true;
        const grid = onetManager.getGrid();
        return grid[row][col] === null;
    }

    private gridToWorld(pos: { row: number, col: number }): Vec3 {
        const x = -(this.onetManager.getCols() - 1) * this.onetManager.getTileSpacing() / 2 + pos.col * this.onetManager.getTileSpacing();
        const y = (this.onetManager.getRows() - 1) * this.onetManager.getTileSpacing() / 2 - pos.row * this.onetManager.getTileSpacing();
        return new Vec3(x, y, 0).add(this.node.worldPosition);
    }

    private clearLineRow(a: { row: number, col: number }, b: { row: number, col: number }): boolean {
        if (a.row !== b.row) return false;
        const row = a.row;
        const min = Math.min(a.col, b.col);
        const max = Math.max(a.col, b.col);
        for (let c = min + 1; c < max; c++) if (!this.isEmpty(row, c)) return false;
        return true;
    }

    private clearLineCol(a: { row: number, col: number }, b: { row: number, col: number }): boolean {
        if (a.col !== b.col) return false;
        const col = a.col;
        const min = Math.min(a.row, b.row);
        const max = Math.max(a.row, b.row);
        for (let r = min + 1; r < max; r++) if (!this.isEmpty(r, col)) return false;
        return true;
    }

     checkRule0(a: Tile, b: Tile): Vec3[] | null {
        if (a.row === b.row && this.clearLineRow(a, b))
            return [a.node.worldPosition, b.node.worldPosition];
        if (a.col === b.col && this.clearLineCol(a, b))
            return [a.node.worldPosition, b.node.worldPosition];
        return null;
    }

     checkRule1(a: Tile, b: Tile): Vec3[] | null {
        const p1 = { row: a.row, col: b.col };
        const p2 = { row: b.row, col: a.col };

        if (this.isEmpty(p1.row, p1.col) &&
            this.clearLineRow(a, { row: a.row, col: p1.col }) &&
            this.clearLineCol(p1, b))
            return [a.node.worldPosition, this.gridToWorld(p1), b.node.worldPosition];

        if (this.isEmpty(p2.row, p2.col) &&
            this.clearLineCol(a, { row: p2.row, col: a.col }) &&
            this.clearLineRow(p2, b))
            return [a.node.worldPosition, this.gridToWorld(p2), b.node.worldPosition];

        return null;
    }

     checkRule2(a: Tile, b: Tile): Vec3[] | null {

        for (let r = 0; r < this.onetManager.getRows(); r++) {
            if (this.isEmpty(r, a.col) && this.isEmpty(r, b.col)) {
                if (this.clearLineCol(a, { row: r, col: a.col }) &&
                    this.clearLineRow({ row: r, col: a.col }, { row: r, col: b.col }) &&
                    this.clearLineCol({ row: r, col: b.col }, b)) {
                    return [
                        a.node.worldPosition,
                        this.gridToWorld({ row: r, col: a.col }),
                        this.gridToWorld({ row: r, col: b.col }),
                        b.node.worldPosition
                    ];
                }
            }
        }

        for (let c = 0; c < this.onetManager.getCols(); c++) {
            if (this.isEmpty(a.row, c) && this.isEmpty(b.row, c)) {
                if (this.clearLineRow(a, { row: a.row, col: c }) &&
                    this.clearLineCol({ row: a.row, col: c }, { row: b.row, col: c }) &&
                    this.clearLineRow({ row: b.row, col: c }, b)) {
                    return [
                        a.node.worldPosition,
                        this.gridToWorld({ row: a.row, col: c }),
                        this.gridToWorld({ row: b.row, col: c }),
                        b.node.worldPosition
                    ];
                }
            }
        }

        return null;
    }
}


