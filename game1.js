kaboom({
    global: true,
    fullscreen: true,
    scale: 0.8,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

const MOVE_SPEED = 240
const DANGER_SPEED = 300
const word1 = ['fall1', 'date1', 'tie1', 'novel1']
const word2 = ['fall2', 'date2', 'tie2', 'novel2']

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
loadSprite('arrow-down', 'laOEupO.png')

scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const maps = [
        [

            '====================',
            '$                  $',
            '$     ?            $',
            '$                  $',
            '$           !      $',
            '$                  $',
            '$                  $',
            '$     ^         ^  $',
            '$ (                $',
            '====================',
        ],
        [
            '==================',
            '$                 $',
            '$              ^  $',
            '$                 $',
            '$   !             $',
            '$             ?   $',
            '$                 $',
            '$     ^         ^ $',
            '$                ($',
            '===================',
        ]]


    const levelCfg = {
        width: 100,
        height: 100,
        '=': [sprite('floor'), solid()],
        '@': [sprite('brick'), solid()],
        '$': [sprite('wall'), solid()],
        '^': [sprite('evil'), scale(1), 'dangerous', { dir: -1 }],
        '(': [sprite('arrow-down'), 'next-level'],
        '[': [sprite('gold')],
        '!': [sprite(choose(word1))],
        '?': [sprite(choose(word2))],
        '&': [sprite('tie3', solid())],
    }

    const gameLevel = addLevel(maps[level], levelCfg)

    //prints score
    const scoreLabel = add([
        text('0'),
        scale(5),
        pos(2300, 400),
        layer('ui'),
        {
            value: score,
        }
    ])

    //prints level
    add([text('level: ' + parseInt(level + 1)), pos(2300, 200), scale(6),])


    //prints random word - bottom of screen
    const word = add([
        text('WORD:' + choose(['TIE', 'DATE', 'FALL', 'NOVEL'])),
        scale(10),
        pos(200, 1300),
        layer('ui'),

    ])
    //initializes player
    const player = add([
        sprite('me'), solid(),
        scale(1),
        pos(100, 100),
        origin('bot'),
        {
            //right by default
            dir: vec2(1.0)
        }
    ])
    //to ensure page loads before player starts
    player.action(() => {
        player.resolve()
    })

    player.overlaps('next-level', () => {
        go('game', {
            level: (level + 1) % maps.length, //%maps.length makes the maps loop
            score: scoreLabel.value
        })
    })

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
        player.dir = vec2(-1, 0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
        player.dir = vec2(1, 0)
    })

    keyDown('up', () => {
        player.move(0, -MOVE_SPEED)
        player.dir = vec2(0, -1)
    })

    keyDown('down', () => {
        player.move(0, MOVE_SPEED)
        player.dir = vec2(0, 1)
    })

    action('dangerous', (d) => {
        d.move(d.dir * DANGER_SPEED, 0) //danger moving along x-asis at DANGER_SPEED
    })


})


start("game", { level: 0, score: 0 })

//to continue
//consider having pictures zoom past. add double jump