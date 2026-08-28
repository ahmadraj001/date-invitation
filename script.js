const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzl6ye9P7CvKDun34QXYvk55hIaMwGKTG6aK55BFBvBFejOVsaLPZEgP35NPGGhHXIcQw/exec";


const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const success = document.getElementById("success");
const closeBtn = document.getElementById("closeBtn");
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

    // Make button fixed so it can move anywhere
    noBtn.style.position = "fixed";
    noBtn.style.zIndex = "99999";

    // Get actual button size
    const rect = noBtn.getBoundingClientRect();

    // Safe area inside viewport
    const minX = padding;
    const minY = padding;

    const maxX = Math.max(
        minX,
        window.innerWidth - rect.width - padding
    );

    const maxY = Math.max(
        minY,
        window.innerHeight - rect.height - padding
    );

    // Random position — always inside screen
    const x =
        minX + Math.random() * (maxX - minX);

    const y =
        minY + Math.random() * (maxY - minY);

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;

    escaped++;

    /* =========================
       CHANGE HINT
    ========================= */

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

    setTimeout(() => {

        isMoving = false;

    }, 180);
}


/* =========================
   DESKTOP CURSOR DETECTION
========================= */

document.addEventListener("mousemove", function (event) {

    if (!noBtn) return;

    const rect = noBtn.getBoundingClientRect();

    const centerX =
        rect.left + rect.width / 2;

    const centerY =
        rect.top + rect.height / 2;

    const distanceX =
        event.clientX - centerX;

    const distanceY =
        event.clientY - centerY;

    const distance = Math.sqrt(
        distanceX * distanceX +
        distanceY * distanceY
    );

    // Button escapes when cursor gets close
    if (distance < 100) {

        moveNoButton();

    }

});


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

yesBtn.addEventListener("click", function () {

    success.classList.add("show");

    createBurst();

    // Set minimum date to today
    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    const todayString =
        `${year}-${month}-${day}`;

    dateInput.min = todayString;

});


/* =========================
   CONFIRM DATE + TIME
========================= */

confirmBtn.addEventListener("click", function () {

    const selectedDate =
        dateInput.value;

    const selectedTime =
        timeInput.value;


    /* DATE VALIDATION */

    if (!selectedDate) {

        formMessage.textContent =
            "Please choose a date ❤️";

        formMessage.className =
            "form-message error";

        return;
    }


    /* TIME VALIDATION */

    if (!selectedTime) {

        formMessage.textContent =
            "Please choose a time 🕐";

        formMessage.className =
            "form-message error";

        return;
    }


    /* DISABLE BUTTON */

    confirmBtn.disabled = true;

    confirmBtn.textContent =
        "Saving... 💕";


    /* GET USER TIMEZONE */

    const timezone =
        Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone;


    /* DATA */

    const data = {

        answer: "YES",

        date: selectedDate,

        time: selectedTime,

        timezone: timezone

    };


    /* SEND TO GOOGLE SHEETS */

    fetch(GOOGLE_SCRIPT_URL, {

        method: "POST",

        mode: "no-cors",

        body: JSON.stringify(data)

    })

    .then(() => {

        formMessage.textContent =
            "It's a date! 💖 See you then! ✨";

        formMessage.className =
            "form-message success";


        confirmBtn.textContent =
            "Confirmed ❤️";


        setTimeout(() => {

            success.classList.remove("show");

        }, 2500);

    })


    .catch((error) => {

        console.error(error);


        formMessage.textContent =
            "Something went wrong. Please try again.";

        formMessage.className =
            "form-message error";


        confirmBtn.disabled = false;


        confirmBtn.textContent =
            "Confirm Date 💕";

    });

});


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


    /* RANDOM HORIZONTAL POSITION */

    heart.style.left =
        `${Math.random() * 100}%`;


    /* RANDOM SIZE */

    heart.style.fontSize =
        `${14 + Math.random() * 22}px`;


    /* RANDOM SPEED */

    heart.style.animationDuration =
        `${5 + Math.random() * 5}s`;


    document
        .querySelector(".hearts")
        .appendChild(heart);


    /* REMOVE AFTER ANIMATION */

    setTimeout(() => {

        heart.remove();

    }, 11000);

}


/* =========================
   CREATE HEARTS CONTINUOUSLY
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
   KEEP NO BUTTON INSIDE
   AFTER SCREEN RESIZE
========================= */

window.addEventListener("resize", function () {

    // Only adjust if button has already moved
    if (noBtn.style.position !== "fixed") {
        return;
    }

    const padding = 25;

    const rect =
        noBtn.getBoundingClientRect();


    let x =
        parseFloat(noBtn.style.left) || padding;

    let y =
        parseFloat(noBtn.style.top) || padding;


    const maxX =
        window.innerWidth -
        rect.width -
        padding;

    const maxY =
        window.innerHeight -
        rect.height -
        padding;


    // Keep X inside screen

    x = Math.max(
        padding,
        Math.min(x, maxX)
    );


    // Keep Y inside screen

    y = Math.max(
        padding,
        Math.min(y, maxY)
    );


    noBtn.style.left =
        `${x}px`;

    noBtn.style.top =
        `${y}px`;

});
