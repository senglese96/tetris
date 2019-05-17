import GameView from './game_view'

window.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    const game_view = new GameView(ctx);
    game_view.start()
    setInterval(() => game_view.update(), 50)
})
