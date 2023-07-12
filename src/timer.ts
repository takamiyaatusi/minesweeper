import moment from "moment"

export class Timer {
    private el = document.getElementById('timer') as HTMLElement
    private timerId: NodeJS.Timer | null = null;
    sec: number = 0;

    constructor() {
    }

    start() {
        const m = moment()
        // const startTime = (new Date()).getTime();
        let curTime = m.unix();
        this.timerId = setInterval(() => {
            curTime = moment().unix();
            this.sec = (curTime - m.unix());
            this.el.textContent = ('00' + Math.floor(this.sec / 60)).slice(-2) + ':' + ('00' + (Math.floor(this.sec) % 60)).slice(-2)
        }, 100)
    }

    stop() {
        if (this.timerId !== null) {
            clearInterval(this.timerId)
            this.timerId = null;
        }
    }

    reset() {
        this.stop()
        this.el.textContent = '00:00'
        this.sec = 0
    }
}