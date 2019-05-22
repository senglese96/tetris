import Game from './game'
import key from 'keymaster'

class GameView{
    constructor(ctx, h_ctx, n_ctx, s_ctx){
        this.ctx = ctx
        this.game = new Game()
        this.drawGrid()
        this.h_ctx = h_ctx
        this.n_ctx = n_ctx
        this.s_ctx = s_ctx
        this.updateHold()
        this.updateNext()
        this.updateScore()
    }

    start(){
        this.h_ctx.fillStyle = 'black'
        this.h_ctx.fillRect(0, 0, 200, 200)
        if(!this.keymapSet){
            this.setKeyMap()
        }
        this.game.start()
    }

    setKeyMap(){
        this.keymapSet = true
        key('right', () => this.game.moveActivePiece([0, 1]))
        key('left', () => this.game.moveActivePiece([0, -1]))
        let game_view = this;
        let speed = false;
        const speedUp = throttled((e) => {
            if (e.keyCode === 40 && speed === false && this.game.gravity > 100) {
                clearInterval(this.game.gravInterval);
                this.game.updateGravity(100)
                speed = true
            }
        }, 350)
        const slowDown = throttled(e => {
            if (e.keyCode === 40 && this.game.gravity > 100 && speed === true) {
                clearInterval(this.game.gravInterval);
                this.game.updateGravity(this.game.gravity);
                speed = false
            }
        }, 350)
        const fastDrop = throttled(e => {
            this.game.fastDrop()
        }, 250)
        document.addEventListener('keydown', speedUp)
        document.addEventListener('keyup', slowDown)
        key('x', () => this.game.rotateActivePiece(1))
        key('z', () => this.game.rotateActivePiece(-1))
        key('c', () => this.game.holdPiece());
        key('space', fastDrop)
    }

    update(){
        this.drawGrid()
        if(this.game.current){
            this.game.ghostPiece().blocks.forEach(block => {
                block.drawGhost(this.ctx);
            })
        }
        this.game.grid.board.forEach(row => {
            row.forEach(block => {
                if(block){
                    block.drawBlock(this.ctx);
                }
            })
        })
        this.updateHold()
        this.updateNext()
        this.updateScore()
    }

    updateHold(){
        this.h_ctx.fillStyle = 'black'
        this.h_ctx.fillRect(0, 0, 200, 200)
        if(this.game.hold){
            let newHold
            if (this.game.hold.constructor.name === "O"){
                newHold = new this.game.hold.constructor([2, 1.5])
            } else if (this.game.hold.constructor.name === "I"){
                newHold = new this.game.hold.constructor([1.5, 1.5])
            } 
            else{
                newHold = new this.game.hold.constructor([2, 2])
            }
            newHold.blocks.forEach(block => {
                block.drawBlock(this.h_ctx)
            })
        }
    }

    updateNext(){
        this.n_ctx.fillStyle = 'black'
        this.n_ctx.fillRect(0, 0, 600, 600)
        let idx
        let newNext
        for(let i = 2; i < 9; i += 3){
            idx = (i - 2) / 3
            if (this.game.next[idx].constructor.name === "O" || this.game.next[idx].constructor.name === "I") {
                newNext = new this.game.next[idx].constructor([i, 1.5])
            } else {
                newNext = new this.game.next[idx].constructor([i, 2])
            }
            newNext.blocks.forEach(block => {
                block.drawBlock(this.n_ctx)
            })
        }
    }

    updateScore(){
        this.s_ctx.fillStyle = 'black'
        this.s_ctx.fillRect(0, 0, 600, 600)
        this.s_ctx.font = '20px Times New Roman'
        this.s_ctx.fillStyle = 'white'
        this.s_ctx.fillText(`score: ${this.game.score}`, 20, 56, 140)
        this.s_ctx.fillText(`lines: ${this.game.lines}`, 20, 112, 180)
        this.s_ctx.fillText(`level: ${this.game.level}`, 20, 168, 180)
    }

    drawGrid(){
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, 500, 800)
        for(let i = 32; i <= 320; i += 32){
            this.ctx.strokeStyle = "gray"
            this.ctx.lineWidth = '1'
            this.ctx.beginPath()
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, 800);
            this.ctx.stroke();
        }

        for(let j = 32; j <= 640; j += 32){
            this.ctx.strokeStyle = "gray"
            this.ctx.beginPath()
            this.ctx.moveTo(0, j);
            this.ctx.lineTo(400, j);
            this.ctx.stroke();
        }
    }
}

function throttled(fn, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}

export default GameView