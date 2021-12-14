kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: rgb(0, 0, 1)
})

loadroot('https://imgur.com/')
loadSprite('doggo', 'Xl68unC.jpg')


screen("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')





})

start("game")