kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

loadRoot('https://i.imgur.com/')
loadSprite('tie2', 'ddxq5LU.png')
loadSprite('tie1', '2wogbvE.png')
loadSprite('tie3', 'JI7AM9I.png')
loadSprite('novel2', 'CC4Qfce.png')
loadSprite('novel1', 'Zzi0tLe.png')
loadSprite('date1', 'DHWMOOo.png')
loadSprite('date2', '5I345Tw.png')
loadSprite('fall2', '0IQw0ro.png')
loadSprite('fall1', 'WCqOl0x.png')
loadSprite('brick', 'aE5Dxen.png')
loadSprite('floor', 'QXYmhyn.png')
loadSprite('wall', 'UujO9Sp.png')
loadSprite('gold', 'P0dL3BH.png')
loadSprite('evil', 'qVMNAmN.png')
loadSprite('me', 'c19OsFc.png.png')


scene("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [

        '$                           $',
        '$    @@@@+@@@#@@@@@         $',
        '$                           $',
        '$                           $',
        '$ @@@@@!@@@@@              $',
        '$                           $',
        '$                           $',
        '$        @@?@@@&@@@@        $',
        '$                           $',
        '$         ^              ^  $',
        '==================    ========',
    ]

    const levelCfg = {
        width: 100,
        height: 100,
        '=': [sprite('floor', solid())],
        '@': [sprite('brick', solid())],
        '$': [sprite('wall', solid())],
        '^': [sprite('evil', solid())],
        '!': [sprite(choose(['fall1', 'date1', 'tie1', 'novel1']))],
        '?': [sprite(choose(['fall1', 'date1', 'tie1', 'novel1']))],
        '#': [sprite(choose(['fall2', 'date2', 'tie2', 'novel2']))],
        '+': [sprite(choose(['fall2', 'date2', 'tie2', 'novel2']))],
        '&': [sprite('tie3', solid())],
    }

    const gameLevel = addLevel(map, levelCfg)

})


start("game")