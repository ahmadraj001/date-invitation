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

    /*
       Fixed position use karenge taake
       button viewport ke according move ho.
    */
    noBtn.style.position = "fixed";
    noBtn.style.zIndex = "99999";

    /*
       Hover transform remove
       taake calculation disturb na ho.
    */
    noBtn.style.transform = "none";

    /*
       Actual button dimensions
    */
    const buttonWidth = noBtn.offsetWidth;
    const buttonHeight = noBtn.offsetHeight;

    /*
       Safe area calculate karo
    */
    const minX = padding;
    const minY = padding;

    const maxX = Math.max(
        minX,
        window.innerWidth - buttonWidth - padding
    );

    const maxY = Math.max(
        minY,
        window.innerHeight - buttonHeight - padding
    );

    /*
       Random position
    */
    const randomX =
        minX + Math.random() * (maxX - minX);

    const randomY =
        minY + Math.random() * (maxY - minY);

    /*
       Final safety clamp
       Button KABHI screen se bahar nahi jayega.
    */
    const finalX = Math.max(
        minX,
        Math.min(randomX, maxX)
    );

    const finalY = Math.max(
        minY,
        Math.min(randomY, maxY)
    );

    /*
       Apply position
    */
    noBtn.style.left = `${finalX}px`;
    noBtn.style.top = `${finalY}px`;


    /* =========================
       HINT TEXT
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
       Small delay taake
       button multiple times instantly
       teleport na kare.
    */
    setTimeout(() => {

        isMoving = false;

    }, 200);
}


/* =========================
   DESKTOP CURSOR DETECTION
========================= */

document.addEventListener("mousemove", function (event) {

    if (!noBtn) return;

    if (isMoving) return;


    const rect =
        noBtn.getBoundingClientRect();


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


    /*
       Cursor button ke 120px paas aaye
       to button bhaag jayega.
    */
    if (distance < 120) {

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


    /*
       Minimum date = Today
    */

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


    dateInput.min =
        todayString;

});


/* =========================
   CONFIRM DATE + TIME
========================= */

confirmBtn.addEventListener("click", function () {

    const selectedDate =
        dateInput.value;

    const selectedTime =
        timeInput.value;


    /*
       DATE VALIDATION
    */

    if (!selectedDate) {

        formMessage.textContent =
            "Please choose a date ❤️";

        formMessage.className =
            "form-message error";

        return;

    }


    /*
       TIME VALIDATION
    */

    if (!selectedTime) {

        formMessage.textContent =
            "Please choose a time 🕐";

        formMessage.className =
            "form-message error";

        return;

    }


    /*
       Disable confirm button
    */

    confirmBtn.disabled =
        true;

    confirmBtn.textContent =
        "Saving... 💕";


    /*
       Get timezone
    */

    const timezone =
        Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone;


    /*
       Data for Google Sheet
    */

    const data = {

        answer: "YES",

        date: selectedDate,

        time: selectedTime,

        timezone: timezone

    };


    /*
       Send data
    */

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


        /*
           Close popup after 2.5 sec
        */

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


        confirmBtn.disabled =
            false;


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
       Random animation speed
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
   KEEP BUTTON INSIDE
   AFTER RESIZE / ROTATION
========================= */

window.addEventListener(
    "resize",
    function () {

        /*
           Agar button abhi tak move nahi hua
           to kuch nahi karna.
        */

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


        /*
           Current position
        */

        let currentX =
            parseFloat(noBtn.style.left);

        let currentY =
            parseFloat(noBtn.style.top);


        if (isNaN(currentX)) {
            currentX = padding;
        }

        if (isNaN(currentY)) {
            currentY = padding;
        }


        /*
           New safe boundaries
        */

        const maxX = Math.max(
            padding,
            window.innerWidth -
            width -
            padding
        );

        const maxY = Math.max(
            padding,
            window.innerHeight -
            height -
            padding
        );


        /*
           Clamp position
        */

        currentX =
            Math.max(
                padding,
                Math.min(
                    currentX,
                    maxX
                )
            );


        currentY =
            Math.max(
                padding,
                Math.min(
                    currentY,
                    maxY
                )
            );


        /*
           Apply corrected position
        */

        noBtn.style.left =
            `${currentX}px`;

        noBtn.style.top =
            `${currentY}px`;

    }
);
