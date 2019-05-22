class Grid{
    constructor(){
        this.board = []
        for(let i = 0; i < 20; i++){
            this.board.push(new Array())
            for(let j = 0; j < 10; j++){
                this.board[i].push(null)
            }
        };
    }

    updatePiece(tetrimino){
        tetrimino.blocks.forEach(block => {
            this.board[block.pos[0]][block.pos[1]] = block
        })
    }

    move(tetrimino, dir){
        tetrimino.blocks.forEach(block => {
            this.board[block.pos[0]][block.pos[1]] = null
        })
        tetrimino.move(dir, this);
        this.updatePiece(tetrimino)
    }

    blockOccupied(pos){
        if (this.board[pos[0]] === undefined ||
            this.board[pos[0]][pos[1]] === undefined ||
            this.board[pos[0]][pos[1]] !== null){
            return true
        }
        return false
    }

    occupied(pos, tetrimino) {
        let isOccupied = true
        tetrimino.blocks.forEach(block => {
            if (block.pos[0] === pos[0] && block.pos[1] === pos[1]) {
                isOccupied = false
            }
        })
        if(!isOccupied){
            return false
        }
        else if (this.board[pos[0]] === undefined ||
            this.board[pos[0]][pos[1]] === undefined) {
            return true
        } else if (this.board[pos[0]][pos[1]] !== null){
            return true
        }
        return false
    }
}

export default Grid