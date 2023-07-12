import { Frame } from "./canvas"


export class LoseEffect {
    private ctx: CanvasRenderingContext2D
    private width: number = 0;
    private height: number = 0;
    private x: number = 0;
    private y: number = 0;
    private centerR: number = 2;
    // private gradientHeight: number = 60;
    private startTime: number = 0;
    private fontStartTime: number = 0;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }

    setWidth(w: number) {
        this.width = w
    }
    setHeight(h: number) {
        this.height = h
    }

    setStartPos(x: number, y: number) {
        this.x = x
        this.y = y
    }

    draw(f: Frame) {
        const effectMs = 500
        const textMs = 100
        if (this.startTime === 0) {
            this.startTime = f.drawAt
        }
        const elapsed = f.drawAt - this.startTime
        let fontElapsed = 0
        const maxR = Math.hypot(this.width, this.height) + 100
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (this.centerR >= maxR) {
            if (this.fontStartTime === 0) {
                this.fontStartTime = f.drawAt
            }
            fontElapsed = f.drawAt - this.fontStartTime
            if (fontElapsed < textMs) {
                const fontSize = 48 + (-10) * (1 - this.ease(fontElapsed, textMs))
                this.ctx.font = `bold ${fontSize}px sanserif`;
            }
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = 'red';
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 10;
            var x_center = this.width / 2
            var y_center = this.height / 2
            this.ctx.strokeText('LOSE!', x_center, y_center);
            this.ctx.fillText('LOSE!', x_center, y_center);
        } else {
            const unit = (maxR - 2) / effectMs
            this.centerR = elapsed * unit * this.ease(elapsed, effectMs)
            const gradient = this.ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, 100);
            gradient.addColorStop(0, 'yellow');
            gradient.addColorStop(1, 'red');
            this.ctx.strokeStyle = gradient
            this.ctx.lineWidth = 50
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.centerR, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
    }

    /**
     * https://easings.net/ja
     * @param elapsed 
     * @param total 
     * @returns 
     */
    private ease(elapsed: number, total: number) {
        const x = (elapsed/total)
        return 1 - Math.cos((x * Math.PI) / 2);
    }

}
