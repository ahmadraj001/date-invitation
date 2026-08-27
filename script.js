
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

    const padding = 20;

    // Get current button size
    const rect = noBtn.getBoundingClientRect();

    // Make button fixed so it can move anywhere on screen
    noBtn.style.position = "fixed";
    noBtn.style.zIndex = "99999";

    // Calculate available screen area
    const maxX = window.innerWidth - rect.width - padding;
    const maxY = window.innerHeight - rect.height - padding;

    // Random position
    const x = padding + Math.random() * Math.max(0, maxX - padding);
    const y = padding + Math.random() * Math.max(0, maxY - padding);

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;

    escaped++;

    if (escaped === 1) {
        hint.textContent = "Haha, nice try! 😏";
    }

    if (escaped === 3) {
        hint.textContent = "The No button is getting shy... 🙈";
    }

    if (escaped >= 5) {
        hint.textContent = "Okay okay... maybe Yes is easier? 😂❤️";
    }

    setTimeout(() => {
        isMoving = false;
    }, 180);
}


/* =========================
   DESKTOP CURSOR DETECTION
========================= */

document.addEventListener("mousemove", function (event) {

    const rect = noBtn.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;

    const distance = Math.sqrt(
        distanceX * distanceX +
        distanceY * distanceY
    );

    // Button escapes when cursor gets this close
    if (distance < 100) {
        moveNoButton();
    }

});


/* =========================
   MOBILE TOUCH
========================= */

noBtn.addEventListener("touchstart", function (event) {

    event.preventDefault();

    moveNoButton();

}, {
    passive: false
});


/* =========================
   YES BUTTON
========================= */

yesBtn.addEventListener("click", function () {

    success.classList.add("show");

    createBurst();

    // Set minimum date to today
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const todayString = `${year}-${month}-${day}`;

    dateInput.min = todayString;

});


/* =========================
   CONFIRM DATE + TIME
========================= */

confirmBtn.addEventListener("click", async function () {

    const selectedDate = dateInput.value;
    const selectedTime = timeInput.value;

    // Validation
    if (!selectedDate) {

        formMessage.textContent = "Please choose a date ❤️";
        formMessage.className = "form-message error";

        return;
    }

    if (!selectedTime) {

        formMessage.textContent = "Please choose a time 🕐";
        formMessage.className = "form-message error";

        return;
    }


    // Button loading state
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Saving... 💕";

    formMessage.textContent = "";


    // Get visitor timezone
    const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone;


    const data = {

        answer: "YES",

        date: selectedDate,

        time: selectedTime,

        timezone: timezone

    };


    try {

        await fetch(GOOGLE_SCRIPT_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify(data)

        });


        // Success
        formMessage.textContent =
            "It's a date! 💖 See you then! ✨";

        formMessage.className = "form-message success";


        confirmBtn.textContent = "Confirmed ❤️";


        // Close popup after 2.5 seconds
        setTimeout(() => {

            success.classList.remove("show");

        }, 2500);


    } catch (error) {

        console.error(error);

        formMessage.textContent =
            "Something went wrong. Please try again.";

        formMessage.className = "form-message error";

        confirmBtn.disabled = false;

        confirmBtn.textContent = "Confirm Date 💕";

    }

});

/* =========================
   FLOATING HEARTS
========================= */

function createHeart() {

    const heart = document.createElement("span");

    heart.className = "heart";

    const heartTypes = [
        "♥",
        "♡",
        "💗",
        "💕",
        "💖"
    ];

    heart.textContent =
        heartTypes[
            Math.floor(Math.random() * heartTypes.length)
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


/* Create hearts continuously */

setInterval(createHeart, 650);


/* =========================
   HEART BURST
========================= */

function createBurst() {

    for (let i = 0; i < 28; i++) {

        setTimeout(() => {
            createHeart();
        }, i * 45);

    }

}
