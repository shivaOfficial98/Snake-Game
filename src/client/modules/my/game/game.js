import { LightningElement, track } from 'lwc';

export default class Game extends LightningElement {
    score = 0;
    blockSize = 20;
    @track gameBlocks = [];
    renderedComplete = false;
    xSpeed = 1;
    ySpeed = 0;
    xHead = 0;
    yHead = 0;
    xMax;
    yMax;
    showOverlay = false;
    gameOver = false;
    intervalObjt;
    tail = [];

    startGame() {
        this.showOverlay = false;
        this.intervalObjt = setInterval(() => {
            this.move();
        }, 200);
    }

    move() {
        let lastElement = this.tail[this.tail.length - 1];
        if (lastElement !== `${this.xHead}:${this.yHead}`) {
            this.tail.push(`${this.xHead}:${this.yHead}`);
            let removedElement = this.tail.shift();
            let currPosIndex = this.gameBlocks.findIndex(
                (x) => x.id === removedElement
            );
            this.gameBlocks[currPosIndex].snake = false;
            this.gameBlocks[currPosIndex].class = '';
        }
        this.xHead += this.xSpeed;
        this.yHead += this.ySpeed;

        if (this.xHead >= this.xMax) {
            this.xHead = 0;
        }
        if (this.xHead < 0) {
            this.xHead = this.xMax - 1;
        }
        if (this.yHead >= this.yMax) {
            this.yHead = 0;
        }
        if (this.yHead < 0) {
            this.yHead = this.yMax - 1;
        }

        if (this.tail.includes(`${this.xHead}:${this.yHead}`)) {
            /*this.tail = [];
      this.xHead = 0;
      this.yHead = 0;
      alert("Game Over");*/
            this.exitGame();
        } else {
            let newPosIndex = this.gameBlocks.findIndex(
                (x) => x.id === `${this.xHead}:${this.yHead}`
            );
            this.gameBlocks[newPosIndex].snake = true;
            this.gameBlocks[newPosIndex].class = 'snake';
            if (this.gameBlocks[newPosIndex].food) {
                this.score++;
                this.tail.push(`${this.xHead}:${this.yHead}`);
                this.gameBlocks[newPosIndex].food = false;
                this.generateFood();
            }
        }
    }

    addKeyBoardControls() {
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            switch (e.key) {
                case 'ArrowUp':
                    this.moveUp();
                    break;
                case 'ArrowDown':
                    this.moveDown();
                    break;
                case 'ArrowLeft':
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    this.moveRight();
                    break;

                default:
                    break;
            }
        });
    }
    moveLeft() {
        this.xSpeed = -1;
        this.ySpeed = 0;
    }
    moveRight() {
        this.xSpeed = 1;
        this.ySpeed = 0;
    }
    moveUp() {
        this.xSpeed = 0;
        this.ySpeed = -1;
    }
    moveDown() {
        this.xSpeed = 0;
        this.ySpeed = 1;
    }
    generateFood() {
        let xFood = Math.floor(Math.random() * this.xMax);
        let yFood = Math.floor(Math.random() * this.yMax);

        let foodPosIndex = this.gameBlocks.findIndex(
            (x) => x.id === `${xFood}:${yFood}`
        );
        this.gameBlocks[foodPosIndex].class = 'food';
        this.gameBlocks[foodPosIndex].food = true;
    }
    renderGameBlocks() {
        const gameContainer = this.template.querySelector('.game-container');
        let cWidth = gameContainer.clientWidth;
        let cHeight = gameContainer.clientHeight;
        this.xMax = Math.floor(cWidth / this.blockSize);
        this.yMax = Math.floor(cHeight / this.blockSize);
        let tmpBlock = [];
        for (let y = 0; y < this.yMax; y++) {
            for (let x = 0; x < this.xMax; x++) {
                let obj;
                if (x === 0 && y === 0) {
                    obj = {
                        id: `${x}:${y}`,
                        snake: true,
                        food: false,
                        class: 'snake'
                    };
                } else {
                    obj = {
                        id: `${x}:${y}`,
                        snake: false,
                        food: false,
                        class: ''
                    };
                }
                tmpBlock.push(obj);
                //this.gameBlocks.push(obj);
            }
        }
        this.gameBlocks = tmpBlock;
    }
    resetGameMetrics() {
        this.xSpeed = 1;
        this.ySpeed = 0;
        this.xHead = 0;
        this.yHead = 0;
        this.tail = [];
        this.score = 0;
        this.renderGameBlocks();
        this.generateFood();
        clearInterval(this.intervalObj);
    }
    resetGame() {
        this.resetGameMetrics();
        this.startGame();
    }
    exitGame() {
        this.showOverlay = true;
        this.gameOver = true;
        this.myMusic.stop();
        clearInterval(this.intervalObjt);
    }
    renderedCallback() {
        if (!this.renderedComplete) {
            this.renderedComplete = true;
            this.renderGameBlocks();
            this.addKeyBoardControls();
            this.generateFood();
            this.startGame();
        }
    }
}
