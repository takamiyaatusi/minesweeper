type SettingItem = {
    panelWidth: number,
    panelHeight: number,
    name: string,
    num_w: number,
    num_h: number,
    num_mine: number,
}

type DifficultyList = {
    easy: number,
    regular: number,
    hard: number,
}
export const DifficultyList = {
    easy: 1,
    regular: 2,
    hard: 3,

}

export class Setting {

    private static instance: Setting | null = null;
    private selectable: Map<keyof DifficultyList, SettingItem> = new Map([
        ["easy", {
            panelWidth: 30,
            panelHeight: 30,
            name: 'easy',
            num_w: 10,
            num_h: 10,
            num_mine: 5,
        }],
        ["regular", {
            panelWidth: 30,
            panelHeight: 30,
            name: 'regular',
            num_w: 20,
            num_h: 15,
            num_mine: 40,
        }],
        ["hard", {
            panelWidth: 30,
            panelHeight: 30,
            name: 'hard',
            num_w: 30,
            num_h: 20,
            num_mine: 100,
        }],
    ])
    private current: keyof DifficultyList;

    private constructor(difficulty: keyof DifficultyList) {
        this.current = difficulty
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new Setting("easy");
        }
        return this.instance
    }

    select(difficulty: keyof DifficultyList) {
        this.current = difficulty
        return this.selectable.get(this.current)
    }

    get(): SettingItem {
        return this.selectable.get(this.current) as SettingItem
    }

    getBoardWidth(): number {
        const s = this.get()
        return s.num_w * s.panelWidth
    }

    getBoardHeight(): number {
        const s = this.get()
        return s.num_h * s.panelHeight
    }
}