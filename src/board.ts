import { Canvas } from './canvas'
import { Panel, PanelState } from './panel'
import { Setting } from './setting'

export class Board {
    private panels: Panel[][] = []
	// 描画先
	private cvs: Canvas;

	constructor(cvs: Canvas) {
        this.cvs = cvs
    }

	setBoard() {
		const s = this.getSetting()
        this.cvs.setWidth(s.panelWidth * s.num_w)
        this.cvs.setHeight(s.panelHeight * s.num_h)
        const gameConsole = document.getElementById('game_console') as HTMLElement
		gameConsole.style.cssText = 'width:' + (s.panelWidth * s.num_w) + 'px;';
		this.setPanels()
	}

	setPanels() {
		const s = this.getSetting()
		this.panels = [];
		const mineArray = [];
		const total = s.num_w * s.num_h;
		for (let k = 0; k < total; k++) {
			if (k < s.num_mine) {
				mineArray.push(true);
			}else{
				mineArray.push(false);
			}
		}
		// randomize
		let tmp;
		for (let i = total-1; i > 0; i--) {
			const r = Math.floor(Math.random() * (i));
			tmp = mineArray[i];
			mineArray[i] = mineArray[r];
			mineArray[r] = tmp;
		}
		let mineIdx = 0;
		for (let i = 0; i < s.num_w; i++) {
			this.panels.push([]);
			for (let j = 0; j < s.num_h; j++) {
				const p = new Panel(this.cvs.getCtx(), {
					xOffset: i * s.panelWidth, // 左上基準点
					yOffset: j * s.panelHeight, // 左上基準点
					width: s.panelWidth,
					height: s.panelHeight,
				});
				p.state = PanelState.close;
				p.isMine = (mineArray[mineIdx]);
				this.panels[i][j] = p;
				this.cvs.addObject(p)
				mineIdx += 1;
			}
		}
		// 周囲の値をセット
		for (let a = 0; a < s.num_w; a++) {
			for (let b = 0; b < s.num_h; b++) {
				const p = this.panels[a][b];
				if (p.isMine) {
					const neighbors = this.getNeighbors(a, b);
					const nLen = neighbors.length;
					for(let k=0; k<nLen; k++){
						this.panels[neighbors[k].x][neighbors[k].y].hint += 1;
					}
				}
			}
		}
	}

	// 初回地雷回避に使う
	isMineOrNeighbor(x: number, y: number): boolean {
		// 座標からパネル割り出し
		const pIdx = this.getPanelIdxFromMatrix(x, y)
		const p = this.panels[pIdx.x][pIdx.y];
		return p.isMine || p.hint !== 0
	}

	// 右クリック時
	mark(x: number, y: number) {
		// 座標からパネル割り出し
		const pIdx = this.getPanelIdxFromMatrix(x, y)
		const p = this.panels[pIdx.x][pIdx.y];
		switch(p.state){
			case PanelState.close:
				p.state = PanelState.flag;
				break;
			case PanelState.flag:
				p.state = PanelState.question;
				break;
			case PanelState.question:
				p.state = PanelState.close;
				break;
		}
	}

	// 左クリック時
    open(x: number, y: number) {
		// 座標からパネル割り出し
		const pIdx = this.getPanelIdxFromMatrix(x, y)
		const p = this.panels[pIdx.x][pIdx.y];
		if (p.isMine) {
			p.state = PanelState.losed;
			// console.log('bomb!!')
		}else{
			this.openPanel(pIdx.x, pIdx.y)
		}
    }

	private openPanel(x_idx: number, y_idx: number) {
		const p = this.panels[x_idx][y_idx];
		p.state = PanelState.open
		if (p.hint == 0) {
			let neighbors = this.getNeighbors(x_idx, y_idx);
			const nLen = neighbors.length;
			for(let k=0; k<nLen; k++){
				if (this.panels[neighbors[k].x][neighbors[k].y].state !== PanelState.open) {
					this.openPanel(neighbors[k].x, neighbors[k].y)
				}
			}
		}
	}

	isWin() {
		let win = true;
		const s = this.getSetting()
		const panelHorizontal = s.num_w
		const panelVertical = s.num_h
		for (let i = 0; i < panelHorizontal; i++) {
			for (let j = 0; j < panelVertical; j++) {
				const p = this.panels[i][j];
				if(!p.isMine && p.state !== PanelState.open){
					win = false;
					break;
				}
			}
			if (!win) {
				break;
			}
		}
		return win;
	}

	isLose() {
		let lose = false;
		const s = this.getSetting()
		const panelHorizontal = s.num_w
		const panelVertical = s.num_h
		for (let i = 0; i < panelHorizontal; i++) {
			for (let j = 0; j < panelVertical; j++) {
				const p = this.panels[i][j];
				if(p.state === PanelState.losed){
					lose = true;
					break;
				}
			}
			if (lose) {
				break;
			}
		}
		return lose;
	}


	// this.panelsがセット済みである前提
    private getNeighbors(x_idx: number, y_idx: number) {
		const s = this.getSetting()
		const panelHorizontal = s.num_w
		const panelVertical = s.num_h
		const xOffsetList = [-1, 0, 1];
		const yOffsetList = [-1, 0, 1];
		let ret = [];
		for(const x_offset of xOffsetList){
			for(const y_offset of yOffsetList){
				if (
                    (x_offset===0 && y_offset===0) || // 自身か
                    x_idx+x_offset < 0 || // panelsの範囲外の場合
                    y_idx+y_offset < 0 ||
                    x_idx+x_offset == panelHorizontal ||
                    y_idx+y_offset == panelVertical
                ) {
					continue;
				}
				ret.push({
					x: x_idx+x_offset,
					y: y_idx+y_offset,
				})
			}
		}
		return ret;
    }

	private getPanelIdxFromMatrix(x: number, y: number) {
		const s = this.getSetting()
		const panelWidth = s.panelWidth
		const panelHeight = s.panelHeight
		const px = Math.floor(x / panelWidth);
		const py = Math.floor(y / panelHeight);
		return {
			x: px,
			y: py,
		}
	}

	private getSetting() {
		return Setting.getInstance().get()
	}
}