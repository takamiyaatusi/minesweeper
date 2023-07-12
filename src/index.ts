// webpackを設定したので、srcフォルダにて、 npm run dev を実行していれば、自動でコンパイルされる
import { Canvas } from './canvas'
import { Board } from './board';
import { Modal } from './modal';
import { Setting, DifficultyList } from './setting';
import { ClearEffect } from './clearEffect';
import { LoseEffect } from './loseEffect';
import { Timer } from "./timer"
import { Ranking } from './ranking';

class App {
    // プレイ可能エリアの描画
    private mainCvs: Canvas
    // 視覚効果用canvas
    private animationCvs: Canvas
    // イベント処理・各パネルの状態管理
    private board: Board
    // 設定
    private setting = Setting.getInstance()
    // ゲーム全体の状態
    private playFlg = false;
    private endFlg = false;
    private timer = new Timer();
    private ranking = new Ranking()

    constructor() {
        this.mainCvs = new Canvas("main_canvas");
        this.animationCvs = new Canvas("animation_canvas")
        this.board = new Board(this.mainCvs);
        this.mainCvs.on("leftClick", (args) => {
            if (!this.endFlg) {
                if (!this.playFlg) {
                    // 初回地雷回避
                    while(this.board.isMineOrNeighbor(args.x, args.y)){
                        this.board.setBoard()
                    }
                    this.playFlg = true;
                    this.timer.start();
                }
                this.board.open(args.x, args.y)
                // クリア判定
                if (this.board.isWin()) {
                    this.timer.stop()
                    this.playFlg = false;
                    this.endFlg = true;
                    this.clearEffect();
                    this.setRanking();
                }else if(this.board.isLose()){
                    this.timer.stop()
                    this.playFlg = false;
                    this.endFlg = true;
                    this.loseEffect(args.x, args.y)
                }
            }
        })
        this.mainCvs.on("rightClick", (args) => {
            if (this.playFlg) {
                this.board.mark(args.x, args.y)
            }
        })
        const modal = new Modal();
        // new game
        const newGameBtn = document.getElementById('new_game') as HTMLButtonElement;
        newGameBtn.addEventListener('click', () => {
            this.initGame();
        })
        // setting
        const settingBtn = document.getElementById('setting') as HTMLButtonElement;
        settingBtn.addEventListener('click', () => {
            modal.show()
        })
        // 難易度選択
        const applyBtn = document.getElementById('apply') as HTMLButtonElement;
        applyBtn.addEventListener('click', () => {
            const difficulty_select = document.getElementById('difficulty_select') as HTMLButtonElement;
            switch(difficulty_select.value){
                case DifficultyList.easy.toString():
                    this.setting.select("easy")
                    break;
                case DifficultyList.regular.toString():
                    this.setting.select("regular")
                    break;
                case DifficultyList.hard.toString():
                    this.setting.select("hard")
                    break;
            }
            this.initGame();
            modal.hide()
        })
        this.initGame()
        this.mainCvs.startAnimation()
    }

    private initGame(){
        this.animationCvs.stopAnimation();
        this.animationCvs.hide()
        this.animationCvs.setWidth(this.setting.getBoardWidth())
        this.animationCvs.setHeight(this.setting.getBoardHeight())
        this.board.setBoard()
		this.playFlg = false;
		this.endFlg = false;
		this.timer.reset()
	}

    private clearEffect(){
        this.animationCvs.stopAnimation();
        this.animationCvs.clearObjects();
        this.animationCvs.show()
        const effect = new ClearEffect(this.animationCvs.getCtx())
        effect.setWidth(this.setting.getBoardWidth())
        effect.setHeight(this.setting.getBoardHeight())
        this.animationCvs.addObject(effect)
        this.animationCvs.startAnimation()
	}
    private loseEffect(x: number, y: number){
        this.animationCvs.stopAnimation();
        this.animationCvs.clearObjects();
        this.animationCvs.show()
        const effect = new LoseEffect(this.animationCvs.getCtx())
        effect.setWidth(this.setting.getBoardWidth())
        effect.setHeight(this.setting.getBoardHeight())
        effect.setStartPos(x, y)
        this.animationCvs.addObject(effect)
        this.animationCvs.startAnimation()
    }

    private setRanking(){
        const sec = this.timer.sec
		if (sec === 0) {
			return;
		}
		switch(this.setting.get().name){
			case 'easy':
				this.ranking.push('easy', sec)
				break;
			case 'regular':
				this.ranking.push('regular', sec)
				break;
			case 'hard':
				this.ranking.push('hard', sec)
				break;
		}
	}
}

const app = new App();
