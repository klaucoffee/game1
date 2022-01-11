if (typeof jQuery == "undefined") {
  console.log("oops! I still have to link my jQuery properly!");
} else {
  console.log("I did it! I linked jQuery and this js file!");
}

$(() => {
  //restart button
  $("#restart").on("click", () => {
    location.reload();
    alert("game will restart");
  });

  //start game button
  $("#startgame").on("click", () => {
    start("game", { level: 0, score: 0 });
  });

  //store operations from drop down selection
  let operations = "operation";
  $("form").on("submit", (event) => {
    event.preventDefault();
    const inputValue = $("#operations :selected").val();
    //console.log(inputValue);
    operations = inputValue;
    $(event.currentTarget).trigger("reset");
  });

  //store user input for words
  // let userwordArray = [];
  // $("form").on("submit", (event) => {
  //   const inputValue = $("#input-box").val();
  //   event.preventDefault();
  //   console.log(inputValue);
  //   $(event.currentTarget).trigger("reset");
  //   const $word = $("<li>").attr("id", "word-item").text(inputValue);
  //   $(".word-list").append($word);
  //   userwordArray.push(inputValue);
  //   console.log(userwordArray);
  // });

  kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
  });

  const MOVE_SPEED = 350;
  const DANGER_SPEED = 100;
  const JUMP_FORCE = 250;
  const GOLD_SPEED = 100;
  const RANDOM_TIME = 1; //time before gold & evil randomly change times, from 1-5. increase for easy level
  let numArray = [];

  //need to change URL
  loadRoot("https://i.imgur.com/");
  loadSprite("1", "MRwJ0U6.png");
  loadSprite("2", "zTpWYGN.png");
  loadSprite("3", "7Zkfg4d.png");
  loadSprite("4", "wEfmxa5.png");
  loadSprite("5", "0ATrUDp.png");
  loadSprite("6", "M5liEl1.png");
  loadSprite("7", "dkLjKJh.png");
  loadSprite("8", "o6e0rZA.png");
  loadSprite("9", "h5YZSlN.png");
  loadSprite("brick", "s9GEIzB.png");
  loadSprite("floor", "Gca2DBB.png");
  loadSprite("gold", "GMu4gOf.png");
  loadSprite("evil", "No5PqFY.png");
  loadSprite("me", "HByYqzG.png");
  loadSprite("arrow-down", "GFY6YOU.png");

  scene("game", ({ level, score }) => {
    layers(["bg", "obj", "ui"], "obj");

    const maps = [
      [
        "=================",
        "@               @",
        "@     ?     %   @",
        "@               @",
        "@    @ @    !   @",
        "@ [             @",
        "@               @",
        "@     ^      ^  @",
        "@  [     [     (@",
        "=================",
      ],
      [
        "===============",
        "@       %      @",
        "@  @@@      ^  @",
        "@              @",
        "@   !   [      @",
        "@          ?   @",
        "@              @",
        "@     ^      ^ @",
        "@ [           (@",
        "================",
      ],
    ];

    const levelCfg = {
      width: 20,
      height: 20,
      //need to change sprite labels
      "=": [sprite("floor"), solid(), "wall"],
      "@": [sprite("brick"), solid(), "wall"],
      "^": [sprite("evil"), solid(), "dangerous", { dir: -1, timer: 0 }],
      "(": [sprite("arrow-down"), "next-level"],
      "[": [sprite("gold"), solid(), "gold", { dir: -1, timer: 0 }],
      "!": [sprite("1"), solid(), "1"],
      "|": [sprite("2"), solid(), "2"],
      "#": [sprite("3"), solid(), "3"],
      "%": [sprite("4"), solid(), "4"],
      "&": [sprite("5"), solid(), "5"],
      "*": [sprite("6"), solid(), "6"],
      "+": [sprite("7"), solid(), "7"],
      "{": [sprite("8"), solid(), "8"],
      "}": [sprite("9"), solid(), "9"],
    };

    const gameLevel = addLevel(maps[level], levelCfg);

    //prints score
    const scoreLabel = add([
      text("0"),
      scale(1),
      pos(800, 400),
      layer("ui"),
      {
        value: score,
      },
    ]);

    //prints level
    add([
      text("level: " + parseInt(level + 1)),
      pos(800, 200),
      layer("ui"),
      scale(1),
    ]);

    //initializes player
    const player = add([
      sprite("me"),
      solid(),
      scale(1),
      pos(100, 100),
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
            scale(1),
            pos(200, 500),
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

    //Calculate functions
    function addition(num1, num2) {
      return num1 + num2;
    }
    function subtraction(num1, num2) {
      if (num1 > num2) {
        return num1 - num2;
      } else {
        return num2 - num1;
      }
    }
    function division(num1, num2) {
      if (num1 > num2) {
        return parseFloat(num1 / num2).toFixed(2);
      } else {
        return parseFloat(num2 / num1).toFixed(2);
      }
    }

    function multiplication(num1, num2) {
      return num1 * num2;
    }

    function calculate(num1, num2, operates) {
      return operates(num1, num2);
    }

    //calculate button

    //console.log(operations);
    $("#calculate").on("click", () => {
      console.log(operations);
      switch (operations) {
        case "addition":
          console.log(addition(numArray[0], numArray[1]));
          break;
        case "multiplication":
          multiplication(numArray[0], numArray[1]);
          break;
        case "subtraction":
          subtraction(numArray[0], numArray[1]);
          break;
        case "division":
          division(numArray[0], numArray[1]);
          break;
      }
      // console.log(addition(3, 5));
      // calculate(numArray[0], numArray[1], operations);
    });
  });

  scene("lose", ({ score }) => {
    add([
      text("GAME OVER" + "\n\n\n" + score, 52),
      origin("center"),
      pos(width() / 2, height() / 2),
    ]);
  });
});
