import {I, S, O, Z, J, L, T} from './blocks'
import Grid from './grid'


class Game{
    constructor(){
        this.grid = new Grid;
        this.currentBag = this.randomBag()
        this.current = this.currentBag.shift()
        this.next = this.currentBag.splice(0, 3)
        this.gravity = 500;
        this.score = 0;
        this.lines = 0
        this.gravInterval
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
        if(this.currentBag.length === 0 && this.next[0] === undefined){
            this.currentBag = this.randomBag()
            this.current = this.currentBag.shift()
            this.next = this.currentBag.splice(0, 3)
        }else{
            this.current = this.next.shift()
            this.next.push(this.currentBag.shift())
        }
        this.generatePiece()
    }

    start(){
        this.generatePiece(this.current)
        this.updateGravity(this.gravity)
    }

    generatePiece(){
        this.grid.updatePiece(this.current)
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

    rotateActivePiece(dir){
        this.current.rotate(this.grid, dir)
    }
}

export default Game