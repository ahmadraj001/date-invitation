const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzl6ye9P7CvKDun34QXYvk55hIaMwGKTG6aK55BFBvBFejOVsaLPZEgP35NPGGhHXIcQw/exec";


const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const success = document.getElementById("success");
const hint = document.getElementById("hint");
const confirmBtn = document.getElementById("confirmBtn");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const formMessage = document.getElementById("formMessage");

let escaped = 0;
let isMoving = false;


/* =========================
   MOVE NO BUTTON
========================= */

function moveNoButton() {

    if (isMoving) return;

    isMoving = true;

    const padding = 25;

    /*
       Fixed position
    */

    noBtn.style.position = "fixed";
    noBtn.style.zIndex = "99999";

    /*
       Remove transform
       taake position calculation correct rahe
    */

    noBtn.style.transform = "none";


    /*
       Button dimensions
    */

    const width =
        noBtn.offsetWidth;

    const height =
        noBtn.offsetHeight;


    /*
       Current position
    */

    const rect =
        noBtn.getBoundingClientRect();

    let currentX =
        rect.left;

    let currentY =
        rect.top;


    /*
       Screen boundaries
    */

    const minX =
        padding;

    const minY =
        padding;

    const maxX =
        Math.max(
            minX,
            window.innerWidth -
            width -
            padding
        );

    const maxY =
        Math.max(
            minY,
            window.innerHeight -
            height -
            padding
        );


    /*
       Movement distance
    */

    const moveDistanceX =
        120 + Math.random() * 180;

    const moveDistanceY =
        100 + Math.random() * 160;


    /*
       Random direction
    */

    let directionX =
        Math.random() > 0.5 ? 1 : -1;

    let directionY =
        Math.random() > 0.5 ? 1 : -1;


    /*
       New position
    */

    let newX =
        currentX +
        moveDistanceX *
        directionX;

    let newY =
        currentY +
        moveDistanceY *
        directionY;


    /*
       If X goes outside,
       reverse direction
    */

    if (newX > maxX) {

        newX =
            currentX -
            moveDistanceX;

    }

    if (newX < minX) {

        newX =
            currentX +
            moveDistanceX;

    }


    /*
       If Y goes outside,
       reverse direction
    */

    if (newY > maxY) {

        newY =
            currentY -
            moveDistanceY;

    }

    if (newY < minY) {

        newY =
            currentY +
            moveDistanceY;

    }


    /*
       Final safety clamp
    */

    newX =
        Math.max(
            minX,
            Math.min(
                newX,
                maxX
            )
        );


    newY =
        Math.max(
            minY,
            Math.min(
                newY,
                maxY
            )
        );


    /*
       Apply position
    */

    noBtn.style.left =
        `${newX}px`;

    noBtn.style.top =
        `${newY}px`;


    /*
       Escape counter
    */

    escaped++;


    /*
       Change hint
    */

    if (escaped === 1) {

        hint.textContent =
            "Haha, nice try! 😏";

    }

    if (escaped === 3) {

        hint.textContent =
            "The No button is getting shy... 🙈";

    }

    if (escaped >= 5) {

        hint.textContent =
            "Okay okay... maybe Yes is easier? 😂❤️";

    }


    /*
       Small cooldown
    */

    setTimeout(() => {

        isMoving = false;

    }, 400);

}


/* =========================
   DESKTOP CURSOR DETECTION
========================= */

document.addEventListener(
    "mousemove",
    function (event) {

        if (isMoving) return;

        const rect =
            noBtn.getBoundingClientRect();


        const centerX =
            rect.left +
            rect.width / 2;

        const centerY =
            rect.top +
            rect.height / 2;


        const distanceX =
            event.clientX -
            centerX;

        const distanceY =
            event.clientY -
            centerY;


        const distance =
            Math.sqrt(
                distanceX * distanceX +
                distanceY * distanceY
            );


        /*
           Cursor button ke qareeb aaye
        */

        if (distance < 90) {

            moveNoButton();

        }

    }
);


/* =========================
   MOBILE TOUCH
========================= */

noBtn.addEventListener(
    "touchstart",
    function (event) {

        event.preventDefault();

        moveNoButton();

    },
    {
        passive: false
    }
);


/* =========================
   YES BUTTON
========================= */

yesBtn.addEventListener(
    "click",
    function () {

        success.classList.add("show");

        createBurst();


        /*
           Minimum date = today
        */

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        const todayString =
            `${year}-${month}-${day}`;


        dateInput.min =
            todayString;

    }
);


/* =========================
   CONFIRM DATE + TIME
========================= */

confirmBtn.addEventListener(
    "click",
    function () {

        const selectedDate =
            dateInput.value;

        const selectedTime =
            timeInput.value;


        /*
           Date validation
        */

        if (!selectedDate) {

            formMessage.textContent =
                "Please choose a date ❤️";

            formMessage.className =
                "form-message error";

            return;

        }


        /*
           Time validation
        */

        if (!selectedTime) {

            formMessage.textContent =
                "Please choose a time 🕐";

            formMessage.className =
                "form-message error";

            return;

        }


        /*
           Disable button
        */

        confirmBtn.disabled =
            true;

        confirmBtn.textContent =
            "Saving... 💕";


        /*
           Timezone
        */

        const timezone =
            Intl.DateTimeFormat()
                .resolvedOptions()
                .timeZone;


        /*
           Data
        */

        const data = {

            answer: "YES",

            date: selectedDate,

            time: selectedTime,

            timezone: timezone

        };


        /*
           Send to Google Script
        */

        fetch(
            GOOGLE_SCRIPT_URL,
            {

                method: "POST",

                mode: "no-cors",

                body:
                    JSON.stringify(data)

            }
        )

        .then(() => {

            formMessage.textContent =
                "It's a date! 💖 See you then! ✨";


            formMessage.className =
                "form-message success";


            confirmBtn.textContent =
                "Confirmed ❤️";


            /*
               Close popup
            */

            setTimeout(() => {

                success.classList.remove(
                    "show"
                );

            }, 2500);

        })

        .catch((error) => {

            console.error(error);


            formMessage.textContent =
                "Something went wrong. Please try again.";


            formMessage.className =
                "form-message error";


            confirmBtn.disabled =
                false;


            confirmBtn.textContent =
                "Confirm Date 💕";

        });

    }
);


/* =========================
   FLOATING HEARTS
========================= */

function createHeart() {

    const heart =
        document.createElement("span");


    heart.className =
        "heart";


    const heartTypes = [

        "♥",
        "♡",
        "💗",
        "💕",
        "💖"

    ];


    heart.textContent =
        heartTypes[
            Math.floor(
                Math.random() *
                heartTypes.length
            )
        ];


    /*
       Random horizontal position
    */

    heart.style.left =
        `${Math.random() * 100}%`;


    /*
       Random size
    */

    heart.style.fontSize =
        `${14 + Math.random() * 22}px`;


    /*
       Random speed
    */

    heart.style.animationDuration =
        `${5 + Math.random() * 5}s`;


    document
        .querySelector(".hearts")
        .appendChild(heart);


    /*
       Remove after animation
    */

    setTimeout(() => {

        heart.remove();

    }, 11000);

}


/* =========================
   CREATE HEARTS
========================= */

setInterval(
    createHeart,
    650
);


/* =========================
   HEART BURST
========================= */

function createBurst() {

    for (
        let i = 0;
        i < 28;
        i++
    ) {

        setTimeout(() => {

            createHeart();

        }, i * 45);

    }

}


/* =========================
   KEEP BUTTON INSIDE SCREEN
========================= */

window.addEventListener(
    "resize",
    function () {

        if (
            noBtn.style.position !== "fixed"
        ) {
            return;
        }


        const padding = 25;

        const width =
            noBtn.offsetWidth;

        const height =
            noBtn.offsetHeight;


        let x =
            parseFloat(
                noBtn.style.left
            ) || padding;


        let y =
            parseFloat(
                noBtn.style.top
            ) || padding;


        const maxX =
            Math.max(
                padding,
                window.innerWidth -
                width -
                padding
            );


        const maxY =
            Math.max(
                padding,
                window.innerHeight -
                height -
                padding
            );


        /*
           Keep X inside
        */

        x =
            Math.max(
                padding,
                Math.min(
                    x,
                    maxX
                )
            );


        /*
           Keep Y inside
        */

        y =
            Math.max(
                padding,
                Math.min(
                    y,
                    maxY
                )
            );


        noBtn.style.left =
            `${x}px`;

        noBtn.style.top =
            `${y}px`;

    }
);
