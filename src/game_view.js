import Game from './game'
import key from 'keymaster'

class GameView{
    constructor(ctx){
        this.ctx = ctx
        this.game = new Game()
        this.drawGrid()
    }

    start(){
        this.setKeyMap()
        this.game.start()
    }

    setKeyMap(){
        key('right', () => this.game.moveActivePiece([0, 1]))
        key('left', () => this.game.moveActivePiece([0, -1]))
        const speedUp = debounce((e) => {
            if (e.keyCode === 40 && this.game.gravity > 100) {
                clearInterval(this.game.gravInterval);
                this.game.updateGravity(100)
            }
        }, 200)
        const slowDown = debounce(e => {
            if (e.keyCode === 40 && this.game.gravity > 100) {
                clearInterval(this.game.gravInterval);
                this.game.updateGravity(this.game.gravity)
            }
        }, 200)
        document.addEventListener('keydown', speedUp)
        document.addEventListener('keyup', slowDown)
        key('x', () => this.game.rotateActivePiece(1))
        key('z', () => this.game.rotateActivePiece(-1))
    }

    update(){
        this.drawGrid()
        this.game.grid.board.forEach(row => {
            row.forEach(block => {
                if(block){
                    block.drawBlock(this.ctx);
                }
            })
        })
    }

    drawGrid(){
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, 500, 800)
        for(let i = 40; i <= 400; i += 40){
            this.ctx.strokeStyle = "gray"
            this.ctx.beginPath()
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, 800);
            this.ctx.stroke();
        }

        for(let j = 40; j <= 800; j += 40){
            this.ctx.strokeStyle = "gray"
            this.ctx.beginPath()
            this.ctx.moveTo(0, j);
            this.ctx.lineTo(400, j);
            this.ctx.stroke();
        }
    }
}

const debounce = (func, delay) => {
    let debounceTimer
    return function () {
        const context = this
        const args = arguments
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => func.apply(context, args), delay)
    }
}

export default GameView