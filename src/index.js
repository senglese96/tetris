import GameView from './game_view'
import key from 'keymaster'

window.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    const start_button = document.getElementById('start-button')
    const start_modal = document.getElementById('start-modal-background')
    const restart_modal = document.getElementById('restart-modal-background')
    const restart_button = document.getElementById('restart-button')
    const hold_ctx = document.getElementById("hold-canvas").getContext("2d")
    const next_ctx = document.getElementById("next-canvas").getContext("2d")
    const score_ctx = document.getElementById('score-canvas').getContext("2d")
    let game_view = new GameView(ctx, hold_ctx, next_ctx, score_ctx);
    start_button.addEventListener('click', e => {
        start_modal.style.display = 'none'
        game_view.start()
        let gamePlay = setInterval(() => {
            game_view.update()
            if (!game_view.game.playing) {
                clearInterval(gamePlay)
                restart_modal.style.display = 'block'
            }
        }, 16)
    })

    restart_button.addEventListener('click', e => {
        game_view.game.newStart();
        restart_modal.style.display = 'none'
        game_view.start()
        let gamePlay = setInterval(() => {
            game_view.update()
            if (!game_view.game.playing) {
                clearInterval(gamePlay)
                restart_modal.style.display = 'block'
            }
        }, 16)
    })
})
