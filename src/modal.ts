export class Modal {
    modalArea;
    modalBack;
    constructor() {
        this.modalArea = document.getElementById('modal_area') as HTMLElement;
        this.modalBack = document.getElementById('modal_back') as HTMLElement;
        this.modalBack.addEventListener('click', (e) => {
            this.hide()
        });
    }

    show() {
        this.modalArea.classList.remove("hide")
        this.modalArea.classList.add("show")
        // this.modalArea.style.cssText = 'display: flex;'
    }
    hide() {
        this.modalArea.classList.remove("show")
        this.modalArea.classList.add("hide")
        // this.modalArea.style.cssText = 'display: none;'
    }

}