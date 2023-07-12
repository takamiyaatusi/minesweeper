import { Frame } from "./canvas"

export const PanelState = {
    close: 1, // 隠蔽＝初期状態
    flag: 2, // 地雷としてマーク
    question: 3, // 候補地としてマーク
    open: 4, // 安全に解放済み
    losed: 5, // 地雷だが開けてしまった
}

const HintColors = [
    '#000', // 0
    'rgba(0,0,0, 1)',
    'rgba(0,0,255, 1)',
    'rgba(100,0,255, 1)',
    'rgba(180,0,255, 1)',
    'rgba(240,0,240, 1)',
    'rgba(255,50,180, 1)',
    'rgba(255,100,0, 1)',
    'rgba(255,0,0, 1)',
]

type PanelConfig = {
    xOffset: number, // 左上基準点
    yOffset: number, // 左上基準点
    width: number,
    height: number,
}

export class Panel {
    private ctx: CanvasRenderingContext2D
    // 描画位置
    private x: number;
    private y: number;
    private w: number;
    private h: number;
    // 地雷であるかどうか
    isMine: boolean = false
    // 状態
    state: number = PanelState.close
    // 周囲の地雷情報
    hint: number = 0

    constructor(
        ctx: CanvasRenderingContext2D,
        config: PanelConfig
    ) {
        this.ctx = ctx
        this.w = config.width
        this.h = config.height
        this.x = config.xOffset
        this.y = config.yOffset
    }

    draw(f: Frame) {
        // ぬりつぶし基調色
        let c;
        let top = 'rgba(255,255,255, 0.5)';
        let left = 'rgba(200,200,200, 0.5)';
        let right = 'rgba(100,100,100, 0.5)';
        let bottom = 'rgba(30,30,30, 0.5)';
        let border = 2;
        let hintTxt = '';
        let fontColor = 'black';
        switch(this.state){
            case PanelState.close:
                c = 'rgba(220,220,220, 1)';
                break;
            case PanelState.flag:
                c = 'rgba(220,220,220, 1)';
                fontColor = 'red'
                hintTxt = '!'
                break;
            case PanelState.question:
                hintTxt = '?';
                c = 'rgba(255,255,200, 1)';
                break;
            case PanelState.open:
                hintTxt = (this.hint > 0) ? this.hint.toString() : '';
                if (this.hint > 0) {
                    fontColor = HintColors[this.hint];
                }
                c = 'rgba(220,220,255, 1)';
                break;
            case PanelState.losed:
                c = 'rgba(255,0,0, 1)';
                break;
            default: 
                c = 'black';
                break;
        }
        this.ctx.fillStyle = c;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
        // 枠
        if (this.state === PanelState.open) {
            this.ctx.fillStyle = top;
            border = 1;
            this.ctx.fillRect(this.x, this.y+border, border, this.h-border);
            this.ctx.fillRect(this.x+(this.w-border), this.y, border, this.h-border);
            this.ctx.fillRect(this.x, this.y, this.w-border, border);
            this.ctx.fillRect(this.x+border, this.y+(this.h-border), this.w-border, border);
        }else{
            this.ctx.fillStyle = left;
            this.ctx.fillRect(this.x, this.y+border, border, this.h-border);
            this.ctx.fillStyle = right;
            this.ctx.fillRect(this.x+(this.w-border), this.y, border, this.h-border);
            this.ctx.fillStyle = top;
            this.ctx.fillRect(this.x, this.y, this.w-border, border);
            this.ctx.fillStyle = bottom;
            this.ctx.fillRect(this.x+border, this.y+(this.h-border), this.w-border, border);
        }
        // 文字
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.font = 'bold 18px serif';
        this.ctx.fillStyle = fontColor;
        this.ctx.fillText(hintTxt, this.x+this.w/2, this.y+this.h/2);
    }

}