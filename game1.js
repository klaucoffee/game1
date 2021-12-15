kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

loadRoot('https://i.imgur.com/')
loadSprite('tie2', 'ddxq5LU.png')
loadSprite('tie1', '2wogbvE.png')
loadSprite('tie3', 'JI7AM9I.png')
loadSprite('novel2', 'CC4Qfce.png')
loadSprite('novel1', 'Zzi0tLe.png')
loadSprite('date1', 'pgE4uC.png')
loadSprite('date2', '5I345Tw.png')
loadSprite('fall2', '0IQw0ro.png')
loadSprite('fall1', 'WCqOl0x.png')
loadSprite('brick', 'zqJGPqm.png')
loadSprite('floor', 'QXYmhyn.png')
loadSprite('wall', 'UujO9Sp.png')
loadSprite('gold', '3alcNAk.png')
loadSprite('evil', 'CKT1ipY.png')
loadSprite('me', 'pbu3a1q.png')


scene("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')



})


start("game")