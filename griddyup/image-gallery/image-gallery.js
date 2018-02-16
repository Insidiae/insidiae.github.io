const gallery = document.querySelector(".gallery");
const overlay = document.querySelector(".overlay");
const overlayImage = overlay.querySelector("img");
const overlayClose = overlay.querySelector(".close");

function generateHTML([r, c]) {
    return `
        <div class="item r${r} c${c}">
            <img src="images/${randomNumber(12)}.jpg">
            <div class="item__overlay">
                <button>View →</button>
            </div>
        </div>
    `;
}

function randomNumber(limit) {
    return Math.floor(Math.random() * limit) + 1;
}

function viewItem(e) {
    const src = e.currentTarget.querySelector("img").src;
    overlayImage.src = src;
    overlay.classList.add("open");
}

function closeOverlay() {
    overlay.classList.remove("open");
}

overlayClose.addEventListener("click", closeOverlay);

const digits = Array.from({length: 50}, () =>
                          [randomNumber(4), randomNumber(4)])
                    .concat(Array.from({length: 20}, () => [1, 1]));
const html = digits.map(generateHTML).join('');
gallery.innerHTML = html;

const items = document.querySelectorAll(".item");
items.forEach(item => item.addEventListener("click", viewItem));