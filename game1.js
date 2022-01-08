if (typeof jQuery == "undefined") {
  console.log("oops! I still have to link my jQuery properly!");
} else {
  console.log("I did it! I linked jQuery and this js file!");
}

$(() => {
  //1st page
  //store user input for words
  let userwordArray = [];
  $("form").on("submit", (event) => {
    const inputValue = $("#input-box").val();
    event.preventDefault();
    //console.log(inputValue);
    $(event.currentTarget).trigger("reset");
    const $word = $("<li>").attr("id", "word-item").text(inputValue);
    $(".word-list").append($word);
    userwordArray.push(inputValue);
    console.log(userwordArray);
  });

  $("#restart").on("click", () => {
    location.reload();
    alert("game will restart");
  });

  //second page
  $("#startgame").on("click", () => {
    start("game", { level: 0, score: 0 });
  });

  kaboom({
    global: true,
    fullscreen: true,
    scale: 0.5,
    debug: true,
    clearColor: [0, 0, 0, 1],
  });

  const MOVE_SPEED = 350;
  const DANGER_SPEED = 200;
  const JUMP_FORCE = 250;
  const GOLD_SPEED = 250;
  const RANDOM_TIME = 5; //time before gold & evil randomly change times, from 1-5. increase for easy level
  const letterbrick1 = ["fall1", "date1", "tie1", "novel1"];
  const letterbrick2 = ["fall2", "date2", "tie2", "novel2"];
  let wordArray = [];
  //const wordArray = ["TIE", "DATE", "FALL", "NOVEL"];

  loadRoot("https://i.imgur.com/");
  loadSprite("tie2", "ddxq5LU.png");
  loadSprite("tie1", "2wogbvE.png");
  loadSprite("tie3", "JI7AM9I.png");
  loadSprite("novel2", "CC4Qfce.png");
  loadSprite("novel1", "Zzi0tLe.png");
  loadSprite("date1", "DHWMOOo.png");
  loadSprite("date2", "5I345Tw.png");
  loadSprite("fall2", "0IQw0ro.png");
  loadSprite("fall1", "WCqOl0x.png");
  loadSprite("brick", "aE5Dxen.png");
  loadSprite("floor", "QXYmhyn.png");
  loadSprite("wall", "UujO9Sp.png");
  loadSprite("gold", "P0dL3BH.png");
  loadSprite("evil", "qVMNAmN.png");
  loadSprite("me", "c19OsFc.png.png");
  loadSprite("arrow-down", "laOEupO.png");

  scene("game", ({ level, score }) => {
    layers(["bg", "obj", "ui"], "obj");

    const maps = [
      [
        "=================",
        "$  3    1       $",
        "$     ?         $",
        "$               $",
        "$    @@    !    $",
        "$ [             $",
        "$               $",
        "$     ^      ^  $",
        "$  [     [     ($",
        "=================",
      ],
      [
        "===============",
        "$              $",
        "$  @@@      ^  $",
        "$              $",
        "$   !   [      $",
        "$          ?   $",
        "$              $",
        "$     ^      ^ $",
        "$ [           ($",
        "================",
      ],
    ];

    const levelCfg = {
      width: 100,
      height: 100,
      "=": [sprite("floor"), solid(), "wall"],
      "@": [sprite("brick"), solid(), "wall"],
      $: [sprite("wall"), solid(), "wall"],
      "^": [sprite("evil"), "dangerous", { dir: -1, timer: 0 }],
      "(": [sprite("arrow-down"), "next-level"],
      "[": [sprite("gold"), "gold", { dir: -1, timer: 0 }],
      "!": [sprite(choose(letterbrick1)), solid(), "letterbrick1"],
      "?": [sprite(choose(letterbrick2)), solid(), "letterbrick2"],
      "&": [sprite("tie3", solid())],
    };

    const gameLevel = addLevel(maps[level], levelCfg);

    //prints score
    const scoreLabel = add([
      text("0"),
      scale(5),
      pos(2000, 400),
      layer("ui"),
      {
        value: score,
      },
    ]);

    //prints level
    add([
      text("level: " + parseInt(level + 1)),
      pos(2000, 200),
      layer("ui"),
      scale(6),
    ]);

    //initializes player
    const player = add([
      sprite("me"),
      solid(),
      scale(1),
      pos(200, 200),
      //body(), //gravity
      origin("bot"),

      {
        //right by default
        dir: vec2(1.0),
      },
    ]);
    //to ensure page loads before player starts
    player.action(() => {
      player.resolve();
    });

    player.overlaps("next-level", () => {
      go("game", {
        level: (level + 1) % maps.length, //%maps.length makes the maps loop
        score: scoreLabel.value,
      });
    });

    keyDown("left", () => {
      player.move(-MOVE_SPEED, 0);
      player.dir = vec2(-1, 0);
    });

    keyDown("right", () => {
      player.move(MOVE_SPEED, 0);
      player.dir = vec2(1, 0);
    });

    keyDown("up", () => {
      player.move(0, -MOVE_SPEED);
      player.dir = vec2(0, -1);
    });

    keyDown("down", () => {
      player.move(0, MOVE_SPEED);
      player.dir = vec2(0, 1);
    });

    // keyDown('space', () => {
    //     player.jump(JUMP_FORCE)
    //     player.dir = vec2(0, -1)
    // })
    //ENEMIES
    action("dangerous", (d) => {
      d.move(d.dir * DANGER_SPEED, 0); //danger moving along x-asis at DANGER_SPEED
      d.timer -= dt();
      if (d.timer <= 0) {
        d.dir = -d.dir;
        d.timer = rand(RANDOM_TIME);
      }
    });

    collides("dangerous", "wall", (d) => {
      d.dir = -d.dir;
    });

    player.overlaps("dangerous", (d) => {
      if (scoreLabel.value > 0) {
        scoreLabel.value -= 1;
        scoreLabel.text = scoreLabel.value;
        destroy(d);
        camShake(4);
      } else {
        go("lose", {
          score: scoreLabel.value,
        });
      }
    });

    //GOLD

    collides("gold", "wall", (g) => {
      g.dir = -g.dir;
    });

    action("gold", (g) => {
      g.move(0, g.dir * GOLD_SPEED);
      g.timer -= dt();
      if (g.timer <= 0) {
        g.dir = -g.dir;
        g.timer = rand(RANDOM_TIME);
      }
    });

    player.collides("gold", (g) => {
      destroy(g);
      scoreLabel.value++;
      scoreLabel.text = scoreLabel.value;
    });

    //player collides with letter
    let randomLetter1 = choose(letterbrick1);
    let randomLetter2 = choose(letterbrick2);

    player.collides("letterbrick1", () => {
      wordArray.push(randomLetter1);
      console.log(wordArray[wordArray.length - 1]);
      console.log(wordArray);
      const letterCollide = add([
        text("WORD:" + wordArray),
        scale(5),
        pos(200, 1000),
        layer("ui"),
      ]);
    });

    player.collides("letterbrick2", () => {
      wordArray.push(randomLetter2);
      console.log(wordArray[wordArray.length - 1]);
      console.log(wordArray);
      const letterCollide = add([
        text("WORD:" + wordArray),
        scale(5),
        pos(200, 1000),
        layer("ui"),
      ]);
    });

    //prints collided letter - bottom of screen
    //   const letterCollide = add([
    //     text("WORD:" + choose(wordArray)),
    //     scale(10),
    //     pos(200, 1300),
    //     layer("ui"),
    //   ]);
  });

  scene("lose", ({ score }) => {
    add([
      text("GAME OVER" + "\n\n\n" + score, 52),
      origin("center"),
      pos(width() / 2, height() / 2),
    ]);
  });

  //to continue
  //how to include first scene where people click button to enter?
});
