type rankingList = {
    easy: number[],
    regular: number[],
    hard: number[],
}

export class Ranking {
    private list: rankingList = {
        easy: [],
        regular: [],
        hard: [],
    }
    constructor() {}

    push(key: keyof rankingList, sec: number) {
        this.list[key].push(sec)
        this.list[key] = this.list[key].sort((a: number, b: number) => {
            return a - b;
        })
        this.list[key] = this.list[key].slice(0, 5);
        this.updateHtml()
    }

    private updateHtml() {
        const easyRanking = document.getElementById('ranking_easy') as HTMLElement;
        easyRanking.innerHTML = this.formatListToHtmlText(this.list.easy);

        const regularRanking = document.getElementById('ranking_regular') as HTMLElement;
        regularRanking.innerHTML = this.formatListToHtmlText(this.list.regular);

        const hardRanking = document.getElementById('ranking_hard') as HTMLElement;
        hardRanking.innerHTML = this.formatListToHtmlText(this.list.hard);
    }

    private formatListToHtmlText(list: number[]) {
        let html = '';
        for (let i = 0; i < list.length; i++) {
            html += '<li>' + (i+1) + '.  ' + this.formatSec(list[i]) + '</li>'
        }
        return html
    }

    private formatSec(sec: number) {
        return ('00' + Math.floor(sec / 60)).slice(-2) + ':' + ('00' + (sec % 60)).slice(-2)
    }
}