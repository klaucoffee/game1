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
    start("game", { level: 0 });
  });

  //store operations from drop down selection
  let operations = "operation";
  $("form").on("submit", (event) => {
    event.preventDefault();
    const inputValue = $("#operations :selected").val();
    //console.log(inputValue);
    operations = inputValue;
    alert(
      "this game will be based on: " +
        operations +
        "\n" +
        "Click Start Game to continue"
    );
    //$(event.currentTarget).trigger("reset");
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
    scale: 0.7,
    debug: true,
    clearColor: [0, 0, 0, 1],
  });

  const MOVE_SPEED = 350;
  const DANGER_SPEED = 200;
  const HARD_DANGER_SPEED = 250;
  const JUMP_FORCE = 150;
  let numArray = [];

  //need to change URL
  loadRoot("https://i.imgur.com/");
  loadSprite("0", "Gfsd8ch.png");
  loadSprite("1", "jjFfwcT.png");
  loadSprite("2", "Y4rR0bT.png");
  loadSprite("3", "VSQTzs4.png");
  loadSprite("4", "lQeFW6Q.png");
  loadSprite("5", "9L0Dt6l.png");
  loadSprite("6", "Oe02ThC.png");
  loadSprite("7", "1RRH6aP.png");
  loadSprite("8", "PKOdjlq.png");
  loadSprite("9", "4s2Ct95.png");
  loadSprite("brick", "AtQa3jU.png");
  loadSprite("floor", "qJEtCIC.png");
  loadSprite("evil1", "D3niCqI.png");
  loadSprite("evil2", "buhAo8v.png");
  loadSprite("evil3", "Js2ekOB.png");
  loadSprite("me", "Pmdmj2L.png");
  loadSprite("arrow-down", "qsO75DZ.png");

  scene("game", ({ level }) => {
    layers(["bg", "obj", "ui"], "obj");

    const maps = [
      [
        "@@@@@@@@@@@@@@@@@@@@@",
        "@         ]         @",
        "@                   @",
        "@  !  |   #   %  &  @",
        "@   ^               @",
        "@                   @",
        "@  =  =  =  =  =  = @",
        "@                   @",
        "@                   @",
        "@   *   +   {   }   @",
        "@                   @",
        "@                  (@",
        "@@@@@@@@@@@@@@@@@@@@@",
      ],
      [
        "@@@@@@@@@@@@@@@@@@@@@",
        "@                   @",
        "@                   @",
        "@  !     &     }    @",
        "@   ^               @",
        "@  |     *     ]    @",
        "@                   @",
        "@  #     +     =    @",
        "@                   @",
        "@  %     {     =    @",
        "@   ^               @",
        "@                  (@",
        "@@@@@@@@@@@@@@@@@@@@@",
      ],
      [
        "@@@@@@@@@@@@@@@@@@@@@",
        "@                   @",
        "@                   @",
        "@  !   #   &   +  } @",
        "@                   @",
        "@  ]   |   %   *  { @",
        "@                   @",
        "@     =   [    =    @",
        "@                   @",
        "@     =        =    @",
        "@                   @",
        "@                  (@",
        "@@@@@@@@@@@@@@@@@@@@@",
      ],
      [
        "@@@@@@@@@@@@@@@@@@@@@",
        "@                   @",
        "@            !      @",
        "@    &     [    }   @",
        "@                   @",
        "@  +    %       ]   @",
        "@                   @",
        "@     |        =    @",
        "@                   @",
        "@     =    {    *   @",
        "@   [               @",
        "@        #         (@",
        "@@@@@@@@@@@@@@@@@@@@@",
      ],
      [
        "@@@@@@@@@@@@@@@@@@@@@",
        "@        |     !    @",
        "@                %  @",
        "@           >       @",
        "@   #               @",
        "@        >      ]   @",
        "@                   @",
        "@     }    *        @",
        "@                +  @",
        "@     =    {        @",
        "@                   @",
        "@              &   (@",
        "@@@@@@@@@@@@@@@@@@@@@",
      ],
    ];

    const levelCfg = {
      width: 60,
      height: 60,

      //need to change sprite labels
      "=": [sprite("floor"), solid(), "wall"],
      "@": [sprite("brick"), solid(), "wall"],
      "^": [sprite("evil1"), solid(), "dangerous", { dir: -1, timer: 0 }],
      "[": [sprite("evil2"), solid(), "dangerous", { dir: -1, timer: 0 }],
      ">": [sprite("evil3"), solid(), "dangerous", { dir: -1, timer: 0 }],
      "(": [sprite("arrow-down"), "next-level"],
      "]": [sprite("0"), solid(), "0"],
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

    //prints level
    const levelLabel = add([
      text("level: " + level),
      scale(3.5),
      pos(vec2(1380, 240)),
      layer("ui"),
      {
        value: level,
      },
    ]);

    //prints blanks
    add([text("__"), layer("ui"), scale(2), pos(width() / 24, height() / 3)]);

    add([text("__"), layer("ui"), scale(2), pos(width() / 10, height() / 3)]);

    //prints math operation selected
    switch (operations) {
      case "addition":
        printOperatorSymbol("+");
        break;
      case "multiplication":
        printOperatorSymbol("x");
        break;
      case "subtraction":
        printOperatorSymbol("-");
        break;
      case "division":
        printOperatorSymbol("/");
        break;
    }
    //print operator symbol
    function printOperatorSymbol(symbol) {
      add([
        text(symbol),
        layer("ui"),
        scale(2),
        pos(width() / 14, height() / 3),
      ]);
    }

    //print random number in the game
    let modelAnswer = parseInt(rand(2, 9));
    //let modelAnswer = 4;
    add([
      text(" = " + modelAnswer),
      layer("ui"),
      scale(2),
      pos(width() / 8, height() / 3),
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
      if (numArray.length === 2) {
        if (answer === modelAnswer) {
          levelLabel.value++;
          numArray.length = 0;
          go("game", {
            level: levelLabel.value % maps.length, //%maps.length makes the maps loop
          });
        }
      } else {
        add([
          text("Unable to proceed to next level"),
          layer("ui"),
          scale(1),
          pos(width() / 8, height() / 3),
        ]);
      }
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
      if (levelLabel.value === 4) {
        d.move(0, d.dir * HARD_DANGER_SPEED);
      }
      if (levelLabel.value >= 2) {
        d.move(0, d.dir * DANGER_SPEED);
      } else {
        d.move(d.dir * DANGER_SPEED, 0); //danger moving along x-asis at DANGER_SPEED
      }
    });

    collides("dangerous", "wall", (d) => {
      d.dir = -d.dir;
    });

    player.collides("dangerous", (d) => {
      go("lose", {
        level: levelLabel.value,
      });
    });

    //stores numbers in numArray
    function collision(num, digit) {
      player.collides(num, (d) => {
        if (numArray.length > 1) {
          add([
            text(
              "You can only choose a maximum of 2 digits. \n Click 'restart' to try again"
            ),
            layer("ui"),
            scale(1),
            pos(width() / 4, height() / 3),
          ]);
        } else if (numArray.length === 0) {
          numArray.push(digit);
          destroy(d);
          add([
            text(numArray[0]),
            scale(2),
            pos(width() / 24, height() / 3),
            layer("ui"),
          ]);
        } else {
          numArray.push(digit);
          destroy(d);
          //console.log(num);
          add([
            text(numArray[1]),
            scale(2),
            pos(width() / 10, height() / 3),
            layer("ui"),
          ]);
          calculate(operations);
          printAnswer(answer);
          checkingAnswer(answer);
        }
      });
    }

    collision("0", 0);
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
        return parseFloat(num1 / num2);
      } else {
        return parseFloat(num2 / num1);
      }
    }

    function multiplication(num1, num2) {
      return num1 * num2;
    }

    //function to print answer
    function printAnswer(answer) {
      add([
        text("Your Answer: " + answer),
        layer("ui"),
        scale(1),
        pos(width() / 8, height() / 4),
      ]);
    }

    //calculate function
    function calculate(operations) {
      console.log(operations);
      switch (operations) {
        case "addition":
          return (answer = addition(numArray[0], numArray[1]));
          break;
        case "multiplication":
          return (answer = multiplication(numArray[0], numArray[1]));
          break;
        case "subtraction":
          return (answer = subtraction(numArray[0], numArray[1]));
          break;
        case "division":
          return (answer = division(numArray[0], numArray[1]));
          break;
      }
    }

    //check if answer is correct
    function checkingAnswer(answer) {
      if (answer === modelAnswer) {
        add([
          text("correct answer" + "\n" + "you may proceed to the next level"),
          origin("center"),
          pos(width() / 2, height() / 2),
        ]);
      } else {
        //HERE
        add([
          text("wrong answer" + "\n" + "please restart game"),
          origin("center"),
          pos(width() / 2, height() / 2),
        ]);
      }
    }

    //lose scene when wrong answer
    //submit button for dropdown should just start the game
    //formatting
  });

  scene("lose", ({ level }) => {
    add([
      text("GAME OVER" + "\n\n\n" + "level: " + level, 20),
      origin("center"),
      pos(width() / 2, height() / 2),
    ]);
  });
});
