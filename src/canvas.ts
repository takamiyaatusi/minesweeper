import EventEmitter from "events"
import moment from "moment"

export type Frame = {
    startTimeMs: number
    drawAt: number
}

export interface Drawable {
    draw(f: Frame): void
}

export class Canvas extends EventEmitter {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    private drawObjects: Drawable[] = []
    private animationId: number | null = null

    constructor(canvasId: string) {
        super()
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
        // クリック時
        this.canvas.addEventListener('click', (e) => {
            e.preventDefault();
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            this.emit("leftClick", {
                x: e.clientX - Math.floor(rect.left),
                y: e.clientY - Math.floor(rect.top),
            })
        })
        // 右クリック時
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            this.emit("rightClick", {
                x: e.clientX - Math.floor(rect.left),
                y: e.clientY - Math.floor(rect.top),
            })
        })

    }

    getCtx() {
        return this.ctx
    }

    setWidth(w: number) {
        this.canvas.width = w
    }

    setHeight(h: number) {
        this.canvas.height = h
    }

    addObject(obj: Drawable | Drawable[]) {
        if (Array.isArray(obj)) {
            this.drawObjects.push(...obj)
        } else {
            this.drawObjects.push(obj)
        }
    }

    clearObjects() {
        this.drawObjects = [];
    }

    startAnimation() {
        const startTime = moment().unix()
        const callback = (ms: number) => {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            for (const obj of this.drawObjects) {
                obj.draw({
                    startTimeMs: startTime,
                    drawAt: ms,
                })
            }
            window.requestAnimationFrame(callback)
        }
        this.animationId = window.requestAnimationFrame(callback)
    }

    stopAnimation() {
        if (this.animationId !== null) {
            window.cancelAnimationFrame(this.animationId)
            this.animationId = null
        }

    }

    show() {
        this.canvas.classList.remove("hide")
        this.canvas.classList.add("show")
    }

    hide() {
        this.canvas.classList.remove("show")
        this.canvas.classList.add("hide")
    }
}

