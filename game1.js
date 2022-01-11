if (typeof jQuery == "undefined") {
  console.log("oops! I still have to link my jQuery properly!");
} else {
  console.log("I did it! I linked jQuery and this js file!");
}

$(() => {
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

  //restart button
  $("#restart").on("click", () => {
    location.reload();
    alert("game will restart");
  });

  //start game button
  $("#startgame").on("click", () => {
    start("game", { level: 0, score: 0 });
  });

  //calculate button
  $("#restart").on("click", () => {});

  //Calculate functions
  function add(num1, num2) {
    return num1 + num2;
  }
  function subtract(num1, num2) {
    if (num1 > num2) {
      return num1 - num2;
    } else {
      return num2 - num1;
    }
  }
  function divide(num1, num2) {
    if (num1 > num2) {
      return parseFloat(num1 / num2).toFixed(2);
    } else {
      return parseFloat(num2 / num1).toFixed(2);
    }
  }

  function multiply(num1, num2) {
    return num1 * num2;
  }

  function calculate(num1, num2, operates) {
    return operates(num1, num2);
  }

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
  const numbrick1 = 1;
  const numbrick2 = 2;
  let numArray = [];
  //const wordArray = ["TIE", "DATE", "FALL", "NOVEL"];

  //need to change URL
  loadRoot("https://i.imgur.com/");
  loadSprite("1", "ddxq5LU.png");
  loadSprite("2", "2wogbvE.png");
  loadSprite("3", "JI7AM9I.png");
  loadSprite("4", "CC4Qfce.png");
  loadSprite("5", "Zzi0tLe.png");
  loadSprite("6", "DHWMOOo.png");
  loadSprite("7", "5I345Tw.png");
  loadSprite("8", "0IQw0ro.png");
  loadSprite("9", "WCqOl0x.png");
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
        "$               $",
        "$     ?     %   $",
        "$               $",
        "$    @ @    !   $",
        "$ [             $",
        "$               $",
        "$     ^      ^  $",
        "$  [     [     ($",
        "=================",
      ],
      [
        "===============",
        "$       %      $",
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
      //need to change sprite labels
      "=": [sprite("floor"), solid(), "wall"],
      "@": [sprite("brick"), solid(), "wall"],
      $: [sprite("wall"), solid(), "wall"],
      "^": [sprite("evil"), "dangerous", { dir: -1, timer: 0 }],
      "(": [sprite("arrow-down"), "next-level"],
      "[": [sprite("gold"), "gold", { dir: -1, timer: 0 }],
      "!": [sprite("1"), solid(), "1"],
      "@": [sprite("2"), solid(), "2"],
      "#": [sprite("3"), solid(), "3"],
      "%": [sprite("4"), solid(), "4"],
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

    //stores numbers in numArray
    function collision(num, numbrick) {
      player.collides(num, () => {
        if (numArray.length > 1) {
          alert(
            "you've reached maximum number of digits. Please press 'calculate' or 'restart' to continue game"
          );
        } else {
          numArray.push(numbrick);
          console.log(num);

          const numCollide = add([
            text("Digits recorded:" + numArray),
            scale(5),
            pos(200, 1000),
            layer("ui"),
          ]);
        }
      });
    }

    collision("1", 1);
    collision("2", 2);
    collision("3", 3);
    collision("4", 4);
    collision("5", 5);
    collision("6", 6);
    collision("7", 7);
    collision("8", 8);
    collision("9", 9);
  });

  scene("lose", ({ score }) => {
    add([
      text("GAME OVER" + "\n\n\n" + score, 52),
      origin("center"),
      pos(width() / 2, height() / 2),
    ]);
  });
});
