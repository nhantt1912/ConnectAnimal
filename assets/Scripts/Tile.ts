import { _decorator, Component, Sprite, Node, EventTouch, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {

    @property(Sprite)
    sprite: Sprite = null;

    // Row, column, and ID will be assigned during initialization
    public row: number = 0;
    public col: number = 0;
    public id: number = -1;

    public onSelected: (tile: Tile) => void = null;

    private _isRemoved: boolean = false;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_END, this.handleClick, this);
    }

    /**
     * Initializes the tile with given values
     * @param id unique identifier (sprite ID)
     * @param row grid row position
     * @param col grid column position
     * @param spriteFrame sprite image for the tile
     * @param onSelected callback when the tile is clicked
     */

    public init(id: number, row: number, col: number, spriteFrame: SpriteFrame, onSelected: (tile: Tile) => void) {
        this.id = id;
        this.row = row;
        this.col = col;
        this.sprite.spriteFrame = spriteFrame;
        this.onSelected = onSelected;
        this._isRemoved = false;
        this.node.active = true;
    }

    private handleClick(event: EventTouch) {
        if (this._isRemoved) return;
        if (this.onSelected) this.onSelected(this);
    }

    // Removes the tile when matched
    public remove() {
        this._isRemoved = true;
        this.node.destroy();
    }

    // Checks whether the tile still exists
    public isRemoved(): boolean {
        return this._isRemoved;
    }
}
