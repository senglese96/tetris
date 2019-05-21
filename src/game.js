import {I, S, O, Z, J, L, T} from './blocks'
import Grid from './grid'


class Game{
    constructor(){
        this.grid = new Grid;
        this.currentBag = this.randomBag()
        this.current = this.currentBag.shift()
        this.next = this.currentBag.splice(0, 3)
        this.score = 0;
        this.lines = 0
        this.gravInterval
        this.gravCurve = [750, 500, 250, 150, 100, 80, 65, 50, 40]
        this.gravTable = [15, 30, 45, 60, 75, 100, 125, 150]
        this.level = 1
        this.gravity = this.gravCurve.shift()
        this.playing = false
        this.hold = null
    }

    updateGravity(gravity){
        this.gravInterval = setInterval(() => {
            this.drop();
        }, gravity)
    }

    drop(){
        let isOccupied = false;
        this.current.blocks.forEach(block => {
            if (this.grid.occupied([block.pos[0] + 1, block.pos[1]], this.current)){
                isOccupied = true
            }
        })
        if(isOccupied){
            this.chooseNextPiece()
        }else{
            this.grid.move(this.current, [1, 0])
        }
        return isOccupied
    }

    fastDrop(){
        while(!this.drop()){
        }
    }

    holdPiece(){
        if(!this.hasHeld){
            this.current.blocks.forEach(block => {
                this.grid.board[block.pos[0]][block.pos[1]] = null
            })
            this.hasHeld = true
            if(this.hold){
                let temp
                temp = this.hold
                this.hold = this.current
                this.current = new temp.constructor([1, 4])
                this.generatePiece()
            } else{
                this.hold = this.current
                if (this.currentBag.length === 0 && this.next[0] === undefined) {
                    this.currentBag = this.randomBag()
                    this.current = this.currentBag.shift()
                    this.next = this.currentBag.splice(0, 3)
                } else {
                    this.current = this.next.shift()
                    this.next.push(this.currentBag.shift())
                }
                this.generatePiece()
            }
        }
    }

    randomBag(){
        let newBag = [new T([1, 4]), new I([1, 4]), new O([1, 4]), new J([1, 4]), new L([1, 4]), new S([1, 4]), new Z([1, 4])]
        newBag = this.shuffle(newBag)
        return newBag
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    chooseNextPiece(){
        this.current = null
        this.lines += this.didClear()
        if(this.lines >= this.gravTable[this.level-1]){
            this.level += 1;
            this.gravity = this.gravCurve.shift();
            clearInterval(this.gravInterval)
            this.updateGravity(this.gravity)
        }
        if(this.currentBag.length === 0){
            this.currentBag = this.randomBag()
            this.current = this.next.shift()
            this.next.push(this.currentBag.shift())
        }else{
            this.current = this.next.shift()
            this.next.push(this.currentBag.shift())
        }
        this.hasHeld = false
        this.generatePiece()
    }

    start(){
        this.generatePiece(this.current)
        this.updateGravity(this.gravity)
        this.playing = true
    }

    newStart(){
        this.grid = new Grid;
        this.currentBag = this.randomBag()
        this.current = this.currentBag.shift()
        this.next = this.currentBag.splice(0, 3)
        this.score = 0;
        this.lines = 0
        this.gravInterval
        this.gravCurve = [750, 500, 250, 150, 100, 80, 65, 50, 40]
        this.gravTable = [15, 30, 45, 60, 75, 100, 125, 150]
        this.level = 1
        this.gravity = this.gravCurve.shift()
        this.playing = false
        this.hold = null
    }

    gameOver(){
        clearInterval(this.gravInterval);
        this.current = null;
        this.playing = false
        this.level = 1
    }

    generatePiece(){
        let over = false
        this.current.blocks.forEach(block => {
            if(this.grid.blockOccupied(block.pos)){
                over = true
            }
        })
        if(over){
            this.grid.updatePiece(this.current)
            this.gameOver();
        }
        else{
            this.grid.updatePiece(this.current)
        }
    }

    moveActivePiece(dir){
        let isOccupied = false;
        this.current.blocks.forEach(block => {
            if (this.grid.occupied([block.pos[0] + dir[0], block.pos[1] + dir[1]], this.current)) {
                isOccupied = true
            }
        })
        if (!isOccupied) {
            this.grid.move(this.current, dir)
        }
    }

    didClear(){
        let count = 0
        this.grid.board.forEach((row, idx) => {
            if(!row.includes(null)){
                count += 1
                row.forEach(block => {
                    this.grid.board[block.pos[0]][block.pos[1]] = null
                })
                if (count > 0) {
                    for (let i = idx - 1; i >= 0; i--) {
                        this.grid.board[i].forEach(block => {
                            if (block) {
                                this.dropStep(block)
                            }
                        })
                    }
                }
            }
        })
        switch(count){
            case 1:
                this.score += 100 * this.level
                break
            case 2:
                this.score += 300 * this.level
                break
            case 3:
                this.score += 500 * this.level
                break
            case 4:
                this.score += 800 * this.level
                break
            default:
                this.score += 0
        }
        return count;
    }

    dropStep(block){
        this.grid.board[block.pos[0]][block.pos[1]] = null
        block.updatePos([block.pos[0] + 1, block.pos[1]], this.grid)
    }

    rotateActivePiece(dir){
        this.current.rotate(this.grid, dir)
    }
}

export default Game