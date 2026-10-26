const filters = document.querySelectorAll(".filter");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {

    const isActive = filter.classList.toggle("active");

    filter.classList.remove("animate");
    void filter.offsetWidth;
    filter.classList.add("animate");

    filter.setAttribute("aria-pressed", isActive);

    const category = filter.dataset.category;
    const assets = document.querySelectorAll(`.asset.${category}`);

    assets.forEach((asset) => {
      asset.classList.toggle("hidden", !isActive);
    });

  });
});


const popup = document.querySelector("#popup");
const popupTitle = document.querySelector("#popup-title");
const popupText = document.querySelector("#popup-text");

function openPopup(title, text) {
  popupTitle.textContent = title;
  popupText.textContent = text;
  popup.classList.add("open");
}

document.querySelector("#how-button").addEventListener("click", () => {
  openPopup("juans mograph !", "very cool stuff");
});

document.querySelector("#about-button").addEventListener("click", () => {
  openPopup("aarons blurb", "pretend this is a very cool paragraph abt our proj");
});

document.querySelector("#close-popup").addEventListener("click", () => {
  popup.classList.remove("open");
});

popup.addEventListener("click", (event) => {
  if (event.target === popup) {
    popup.classList.remove("open");
  }
});
