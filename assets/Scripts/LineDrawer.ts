import { _decorator, Component, Graphics, Vec3, Color, tween, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LineDrawer')
export class LineDrawer extends Component {
    @property(Graphics)
    private graphics: Graphics = null;

    onLoad() {
        if (!this.graphics) {
            this.graphics = this.getComponent(Graphics);
        }
    }

    /**
     * Draws a connection line between multiple points
     */
    public drawConnection(points: Vec3[]) {
        if (!this.graphics || points.length < 2) return;

        const uiTrans = this.node.getComponent(UITransform)!;
        const localPoints = points.map(p => uiTrans.convertToNodeSpaceAR(p));

        this.graphics.clear();
        this.graphics.lineWidth = 6;
        this.graphics.strokeColor = Color.YELLOW.clone();

        this.graphics.moveTo(localPoints[0].x, localPoints[0].y);
        for (let i = 1; i < localPoints.length; i++) {
            const prev = localPoints[i - 1];
            const curr = localPoints[i];

            if (Math.abs(curr.x - prev.x) > Math.abs(curr.y - prev.y)) {
                this.graphics.lineTo(curr.x, prev.y);
            } else {
                this.graphics.lineTo(prev.x, curr.y);
            }

            this.graphics.lineTo(curr.x, curr.y);
        }

        this.graphics.stroke();

        tween(this.node)
            .delay(0.3) // Wait before clearing
            .call(() => this.graphics.clear())
            .start();
    }
}
