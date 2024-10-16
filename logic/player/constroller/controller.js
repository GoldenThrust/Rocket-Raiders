export default class Controller {
    constructor() {
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;

        this.#addKeyBoardEventListener();
    }

    #addKeyBoardEventListener() {
        addEventListener('devicemotion', (e) => {
            const { x, y, z } = e.acceleration;

            document.querySelector('p').innerText = `${this.forward}\n${this.backward}`;
            // document.querySelector('p').innerText = `${this.forward}\n${this.backward}\n${this.left}\n${this.right}`;

            document.querySelector('p').innerText = `${x}\n${y}\n${z}`;

            if (Math.ceil(x) > 1) {
                this.forward = true;
            } else {
                this.forward = false;
            }

            if (Math.ceil(x) < -1) {
                this.backward = true;
            } else {
                this.backward = false;
            }

            if (Math.ceil(z) < -1) {
                this.left = true;
            } else {
                this.left = false;
            }

            if (Math.ceil(z) > 1) {
                this.right = true;
            } else {
                this.right = false;
            }
        });

        // document.addEventListener("keydown", (e) => {
        //     switch (e.code) {
        //         case 'ArrowUp':
        //             this.forward = true;
        //             break;
        //         case 'ArrowDown':
        //             this.backward = true;
        //             break;
        //         case 'ArrowLeft':
        //             this.left = true;
        //             break;
        //         case 'ArrowRight':
        //             this.right = true;
        //             break;
        //     }
        //     console.log(this)

        // })


        // document.addEventListener("keydown", (e) => {
        //     switch (e.code) {
        //         case 'ArrowUp':
        //             this.forward = false;
        //             break;
        //         case 'ArrowDown':
        //             this.backward = false;
        //             break;
        //         case 'ArrowLeft':
        //             this.left = false;
        //             break;
        //         case 'ArrowRight':
        //             this.right = false;
        //             break;
        //     }
        //     console.log(this)
        // })
    }
}