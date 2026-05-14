const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");
const game = document.getElementById("game");

const leftImage = document.getElementById("leftImage");
const rightImage = document.getElementById("rightImage");
const marksLayer = document.getElementById("marksLayer");

const levelText = document.getElementById("levelText");
const foundText = document.getElementById("foundText");
const totalText = document.getElementById("totalText");
const timeText = document.getElementById("timeText");

const backBtn = document.getElementById("backBtn");

const levelComplete = document.getElementById("levelComplete");
const nextLevelBtn = document.getElementById("nextLevelBtn");

let currentLevel = 0;
let found = 0;
let time = 60;
let timer = null;

const levels = [
    {
        left: "images/level1-left.png",
        right: "images/level1-right.png",
        differences: [
            { x: 91.5, y: 88.2, r: 8 },
            { x: 74.1, y: 34.9, r: 8 },
            { x: 10.1, y: 89.7, r: 8 }
        ]
    },

    {
        left: "images/level2-left.png",
        right: "images/level2-right.png",
        differences: [
            { x: 43.2, y: 76.8, r: 8 },
            { x: 89.0, y: 54.0, r: 8 },
            { x: 69.4, y: 22.1, r: 8 }
        ]
    },

    {
        left: "images/level3-left.png",
        right: "images/level3-right.png",
        differences: [
            { x: 83.0, y: 22.7, r: 8 },
            { x: 77.2, y: 66.7, r: 8 },
            { x: 84.9, y: 86.4, r: 8 }
        ]
    }
];

startBtn.addEventListener("click", () => {

    menu.classList.add("hidden");
    game.classList.remove("hidden");

    loadLevel(0);

});

backBtn.addEventListener("click", () => {

    location.reload();

});

nextLevelBtn.addEventListener("click", () => {

    levelComplete.classList.add("hidden");

    if(currentLevel < levels.length - 1){

        loadLevel(currentLevel + 1);

    }else{

        showFinalScreen();

    }

});

rightImage.parentElement.addEventListener("click", checkClick);

function loadLevel(index){

    currentLevel = index;

    found = 0;

    time = 60;

    clearInterval(timer);

    marksLayer.innerHTML = "";

    const level = levels[currentLevel];

    leftImage.src = level.left;
    rightImage.src = level.right;

    levelText.textContent = currentLevel + 1;
    foundText.textContent = found;
    totalText.textContent = level.differences.length;
    timeText.textContent = time;

    level.differences.forEach(diff => {

        diff.found = false;

    });

    timer = setInterval(() => {

        time--;

        timeText.textContent = time;

        if(time <= 0){

            clearInterval(timer);

            alert("Time is over!");

            loadLevel(currentLevel);

        }

    }, 1000);

}

function checkClick(event){

    const rect = rightImage.getBoundingClientRect();

    const clickX =
        ((event.clientX - rect.left) / rect.width) * 100;

    const clickY =
        ((event.clientY - rect.top) / rect.height) * 100;

    const level = levels[currentLevel];

    for(const diff of level.differences){

        const distance = Math.sqrt(

            Math.pow(clickX - diff.x, 2) +
            Math.pow(clickY - diff.y, 2)

        );

        if(distance <= diff.r && !diff.found){

            diff.found = true;

            found++;

            foundText.textContent = found;

            addMark(diff.x, diff.y);

            if(found === level.differences.length){

                clearInterval(timer);

                setTimeout(() => {

                    if(currentLevel < levels.length - 1){

                        levelComplete.classList.remove("hidden");

                    }else{

                        showFinalScreen();

                    }

                }, 500);
            }

            return;
        }
    }
}

function addMark(x, y){

    const mark = document.createElement("div");

    mark.className = "mark";

    mark.style.left = x + "%";
    mark.style.top = y + "%";

    marksLayer.appendChild(mark);

}

function showFinalScreen(){

    levelComplete.classList.remove("hidden");

    levelComplete.innerHTML = `

        <div class="complete-box">

            <h2>YOU WON!</h2>

            <p>
                Congratulations! You completed all levels.
            </p>

            <button onclick="location.reload()">
                PLAY AGAIN
            </button>

        </div>

    `;
}