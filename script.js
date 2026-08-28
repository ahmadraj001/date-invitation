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
   CURSOR KI OPPOSITE DIRECTION
========================= */

function moveNoButton(mouseX, mouseY) {

    if (isMoving) return;

    isMoving = true;

    const padding = 20;

    /* Make button fixed */
    noBtn.style.position = "fixed";
    noBtn.style.zIndex = "99999";
    noBtn.style.transform = "none";

    /* Actual button size */
    const width = noBtn.offsetWidth;
    const height = noBtn.offsetHeight;

    /* Current position */
    const rect = noBtn.getBoundingClientRect();

    let currentX = rect.left;
    let currentY = rect.top;

    /* Button center */
    const centerX = currentX + width / 2;
    const centerY = currentY + height / 2;

    /*
       Cursor kis side par hai?
    */

    const fromLeft = mouseX < centerX;
    const fromRight = mouseX > centerX;
    const fromTop = mouseY < centerY;
    const fromBottom = mouseY > centerY;


    /*
       Movement distance
    */

    const horizontalDistance =
        140 + Math.random() * 100;

    const verticalDistance =
        110 + Math.random() * 90;


    let newX = currentX;
    let newY = currentY;


    /*
       CURSOR LEFT SIDE PAR HAI
       => BUTTON RIGHT JAYEGA

       CURSOR RIGHT SIDE PAR HAI
       => BUTTON LEFT JAYEGA
    */

    if (fromLeft) {

        newX =
            currentX +
            horizontalDistance;

    } else {

        newX =
            currentX -
            horizontalDistance;

    }


    /*
       CURSOR TOP PAR HAI
       => BUTTON DOWN JAYEGA

       CURSOR BOTTOM PAR HAI
       => BUTTON UP JAYEGA
    */

    if (fromTop) {

        newY =
            currentY +
            verticalDistance;

    } else {

        newY =
            currentY -
            verticalDistance;

    }


    /*
       SCREEN BOUNDARIES
    */

    const minX = padding;
    const minY = padding;

    const maxX =
        window.innerWidth -
        width -
        padding;

    const maxY =
        window.innerHeight -
        height -
        padding;


    /*
       Agar right boundary aa gayi
       to LEFT side move karo
    */

    if (newX > maxX) {

        newX =
            currentX -
            horizontalDistance;

    }


    /*
       Agar left boundary aa gayi
       to RIGHT side move karo
    */

    if (newX < minX) {

        newX =
            currentX +
            horizontalDistance;

    }


    /*
       Agar bottom boundary aa gayi
       to UP move karo
    */

    if (newY > maxY) {

        newY =
            currentY -
            verticalDistance;

    }


    /*
       Agar top boundary aa gayi
       to DOWN move karo
    */

    if (newY < minY) {

        newY =
            currentY +
            verticalDistance;

    }


    /*
       FINAL SAFETY CLAMP

       Button kisi bhi situation mein
       viewport se bahar nahi ja sakta.
    */

    newX = Math.max(
        minX,
        Math.min(newX, maxX)
    );

    newY = Math.max(
        minY,
        Math.min(newY, maxY)
    );


    /*
       Apply position
    */

    noBtn.style.left =
        `${newX}px`;

    noBtn.style.top =
        `${newY}px`;


    /* =========================
       HINT
    ========================= */

    escaped++;

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
       Prevent repeated movement
    */

    setTimeout(() => {

        isMoving = false;

    }, 300);
}


/* =========================
   DESKTOP MOUSE
========================= */

document.addEventListener(
    "mousemove",
    function (event) {

        if (isMoving) return;

        const rect =
            noBtn.getBoundingClientRect();


        /*
           Extra detection area
           button ke around
        */

        const extra = 65;

        const nearButton =
            event.clientX >=
                rect.left - extra &&

            event.clientX <=
                rect.right + extra &&

            event.clientY >=
                rect.top - extra &&

            event.clientY <=
                rect.bottom + extra;


        if (nearButton) {

            moveNoButton(
                event.clientX,
                event.clientY
            );

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

        const touch =
            event.touches[0];

        moveNoButton(
            touch.clientX,
            touch.clientY
        );

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


        /* Today's date */

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


        dateInput.min =
            `${year}-${month}-${day}`;

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


        if (!selectedDate) {

            formMessage.textContent =
                "Please choose a date ❤️";

            formMessage.className =
                "form-message error";

            return;

        }


        if (!selectedTime) {

            formMessage.textContent =
                "Please choose a time 🕐";

            formMessage.className =
                "form-message error";

            return;

        }


        confirmBtn.disabled =
            true;

        confirmBtn.textContent =
            "Saving... 💕";


        const timezone =
            Intl.DateTimeFormat()
                .resolvedOptions()
                .timeZone;


        const data = {

            answer: "YES",
            date: selectedDate,
            time: selectedTime,
            timezone: timezone

        };


        fetch(
            GOOGLE_SCRIPT_URL,
            {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(data)
            }
        )

        .then(() => {

            formMessage.textContent =
                "It's a date! 💖 See you then! ✨";

            formMessage.className =
                "form-message success";

            confirmBtn.textContent =
                "Confirmed ❤️";


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


    heart.style.left =
        `${Math.random() * 100}%`;


    heart.style.fontSize =
        `${14 + Math.random() * 22}px`;


    heart.style.animationDuration =
        `${5 + Math.random() * 5}s`;


    document
        .querySelector(".hearts")
        .appendChild(heart);


    setTimeout(() => {

        heart.remove();

    }, 11000);

}


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
   KEEP BUTTON INSIDE
   AFTER RESIZE
========================= */

window.addEventListener(
    "resize",
    function () {

        if (
            noBtn.style.position !== "fixed"
        ) {
            return;
        }


        const padding = 20;

        const width =
            noBtn.offsetWidth;

        const height =
            noBtn.offsetHeight;


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


        let x =
            parseFloat(
                noBtn.style.left
            ) || padding;


        let y =
            parseFloat(
                noBtn.style.top
            ) || padding;


        x =
            Math.max(
                padding,
                Math.min(x, maxX)
            );


        y =
            Math.max(
                padding,
                Math.min(y, maxY)
            );


        noBtn.style.left =
            `${x}px`;

        noBtn.style.top =
            `${y}px`;

    }
);
