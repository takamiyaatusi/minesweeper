import { Frame } from "./canvas"


export class ClearEffect {
    private ctx: CanvasRenderingContext2D
    private width: number = 0;
    private height: number = 0;
    private leftTopY: number = -60;
    private gradientHeight: number = 60;
    private startTime: number = 0;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }

    setWidth(w: number) {
        this.width = w
    }
    setHeight(h: number) {
        this.height = h
    }

    draw(f: Frame) {
        // effectMsミリ秒で完了してほしい
        const effectMs = 1000
        const textMs = 100
        if (this.startTime === 0) {
            this.startTime = f.drawAt
        }
        const elapsed = f.drawAt - this.startTime
        if (elapsed > effectMs) {
            // 文字表示
            if (elapsed - effectMs < textMs) {
                const fontSize = 48 + (-10) * (1 - this.ease(elapsed - effectMs, textMs))
                this.ctx.font = `bold ${fontSize}px sanserif`;
            }
            this.ctx.textAlign = 'center';
            const x_center = this.width / 2
            const y_center = this.height / 2
            this.ctx.fillStyle = 'yellow';
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 10;
            this.ctx.strokeText('CLEAR!', x_center, y_center);
            this.ctx.fillText('CLEAR!', x_center, y_center);
        } else {
            this.ctx.clearRect(0, 0, this.width, this.height);
            // 経過秒で割る
            this.leftTopY = this.height  * this.ease(elapsed, effectMs) - this.gradientHeight;
            const gradient = this.ctx.createLinearGradient(0, this.leftTopY, 0, this.leftTopY+this.gradientHeight);
            gradient.addColorStop(0, 'rgba(240, 240, 255, 0)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, this.leftTopY, this.width, this.gradientHeight);
    
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
