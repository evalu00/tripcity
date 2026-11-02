const loadingScreen = document.querySelector("#loading-screen");
const loadingVideo = document.querySelector("#loading-video");
const skipButton = document.querySelector("#skip-button");

let videoStage = 1;
let introClosed = false;

function closeLoadingScreen() {
  if (introClosed) return;

  introClosed = true;
  loadingVideo.pause();
  loadingScreen.style.display = "none";
  loadingScreen.style.pointerEvents = "none";
}

function playSecondVideo() {
  if (videoStage !== 1 || introClosed) return;

  videoStage = 2;
  skipButton.hidden = false;

  loadingVideo.src = "./videos/loading.mp4";
  loadingVideo.load();

  loadingVideo.play().catch(() => closeLoadingScreen());
}

loadingVideo.addEventListener("ended", () => {
  if (videoStage === 1) {
    playSecondVideo();
  } else {
    closeLoadingScreen();
  }
});

loadingVideo.addEventListener("error", () => {
  console.error("video error:", loadingVideo.currentSrc);

  if (videoStage === 1) {
    playSecondVideo();
  } else {
    closeLoadingScreen();
  }
});

skipButton.addEventListener("click", () => {
  if (videoStage === 2) closeLoadingScreen();
});

loadingVideo.play().catch(() => {
  if (videoStage === 1) playSecondVideo();
});

// click logo (replay intro)

document.querySelector("#logo-button").addEventListener("click", (event) => {
  event.preventDefault();

  videoStage = 1;
  introClosed = false;

  skipButton.hidden = true;

  loadingScreen.style.display = "flex";
  loadingScreen.style.pointerEvents = "auto";

  loadingVideo.pause();
  loadingVideo.src = "./videos/tripcity.mp4";
  loadingVideo.load();
  loadingVideo.currentTime = 0;

  loadingVideo.play().catch(() => {
    playSecondVideo();
  });
});


// filters

const filters = document.querySelectorAll(".filter");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const isActive = filter.classList.toggle("active");

    filter.classList.remove("animate");
    void filter.offsetWidth;
    filter.classList.add("animate");

    filter.setAttribute("aria-pressed", String(isActive));

    const category = filter.dataset.category;

    document.querySelectorAll(`.asset.${category}`).forEach((asset) => {
      asset.classList.toggle("hidden", !isActive);

      if (!isActive) stopMarkerVideo(asset);
    });
  });
});


// popup elements

const popup = document.querySelector("#popup");
const popupContent = document.querySelector("#popup-content");
const popupTitle = document.querySelector("#popup-title");
const popupText = document.querySelector("#popup-text");


// photo gallery

const aboutGallery = document.querySelector("#about-gallery");
const galleryImage = document.querySelector("#gallery-image");

const galleryPhotos = [
  "./images/3 copy.png",
  "./images/5 copy.png",
  "./images/8 copy.png",
  "./images/10 copy.png",
  "./images/13 copy.png",
  "./images/21 copy.png",
  "./images/22 copy.png",
  "./images/28 copy.png"
];

let galleryIndex = 0;
let galleryTimer = null;
let galleryPaused = false;

function showGalleryPhoto() {
  galleryImage.src = galleryPhotos[galleryIndex];
}

function nextGalleryPhoto() {
  galleryIndex = (galleryIndex + 1) % galleryPhotos.length;
  showGalleryPhoto();
}

function previousGalleryPhoto() {
  galleryIndex =
    (galleryIndex - 1 + galleryPhotos.length) % galleryPhotos.length;

  showGalleryPhoto();
}

function stopGallery() {
  clearInterval(galleryTimer);
  galleryTimer = null;
}

function startGallery() {
  stopGallery();

  if (galleryPaused) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (!popup.classList.contains("open")) return;
  if (!popupContent.classList.contains("about-mode")) return;

  galleryTimer = setInterval(nextGalleryPhoto, 3500);
}

document.querySelector("#gallery-next").addEventListener("click", () => {
  nextGalleryPhoto();
  startGallery();
});

document.querySelector("#gallery-prev").addEventListener("click", () => {
  previousGalleryPhoto();
  startGallery();
});

aboutGallery.addEventListener("mouseenter", () => {
  galleryPaused = true;
  stopGallery();
});

aboutGallery.addEventListener("mouseleave", () => {
  galleryPaused = false;
  startGallery();
});

aboutGallery.addEventListener("focusin", () => {
  galleryPaused = true;
  stopGallery();
});

aboutGallery.addEventListener("focusout", (event) => {
  if (aboutGallery.contains(event.relatedTarget)) return;

  galleryPaused = false;
  startGallery();
});


// open information popup

function openPopup(title, content, isAbout = false) {
  stopGallery();

  aboutGallery.remove();

  popupTitle.textContent = title;
  popupText.replaceChildren();

  content.split("\n\n").forEach((paragraph, index) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    popupText.appendChild(p);

    if (isAbout && index === 2) {
      popupText.appendChild(aboutGallery);
    }
  });

  if (!isAbout) {
    popupContent.appendChild(aboutGallery);
  } else {
    galleryIndex = 0;
    galleryPaused = false;
    showGalleryPhoto();
  }

  popupContent.classList.toggle("about-mode", isAbout);
  popup.classList.add("open");
  popupContent.scrollTop = 0;

  if (isAbout) startGallery();

  document.querySelector("#close-popup").focus();
}


// how to explore

document.querySelector("#how-button").addEventListener("click", () => {
  openPopup(
    "HOW TO EXPLORE",
    `The sidewalks along Benefit Street have all sorts of problems. Cracked pavement, uneven bricks, fallen leaves, and sometimes even a random scooter left in the middle of the sidewalk. There's quite a lot to look out for, so we decided to narrow everything down to five categories: dips, hazards, bumps, foliage, and cracks.

We've given each category its own color and symbol, marking where we found them along Benefit Street. Some areas have more than others, and it's interesting to see just how many different imperfections can be found along the same stretch of road.

Buttons on the left are used to turn each category on and off—maybe you only want to look at cracks, or compare where the bumps and dips are. You can also leave everything on, or hover over the symbols to see them move.`
  );
});


// about

document.querySelector("#about-button").addEventListener("click", () => {
  openPopup(
    "ABOUT TRIPCITY",
    `Benefit Street is more than just another road in Providence. Located in the heart of RISD and Brown, it's a piece of American history, a gathering place for students, and a street that many of us walk down every day. But for a street with this much historical significance, why are its sidewalks in such poor condition?

Cracked pavement, uneven concrete slabs, loose bricks, and tree roots protruding from the ground are just some of the things you might come across while walking down Benefit Street. Some parts are worse than others, and it's difficult to walk down the street without constantly having to look at your feet. For many of us, tripping has almost become a regular occurrence. That's where Tripcity comes in.

We believe Benefit Street deserves more attention than it currently receives. Through sidewalk installations, posters in local storefronts, promotional videos played in neighborhood businesses, and an interactive map highlighting the hazards found along Benefit Street, we want more people to recognize just how bad the sidewalks really are.

Of course, we can joke about tripping over the occasional brick. But it's still a serious issue, especially considering how many people use this street every day. Fixing these sidewalks wouldn't just make Providence look nicer. It would make walking through the neighborhood a safer experience for students, residents, and visitors alike.

And that's really what we're hoping to achieve with Tripcity. We want the City of Providence, along with those responsible for funding public infrastructure, to recognize how much work these sidewalks actually need. Through our petition, we're asking for more funding to go toward repairing them.

A street this important deserves more care, and we don't think that's too much to ask for. Let's make Benefit Street a little less trippy.`,
    true
  );
});


// close information popup

function closePopup() {
  popup.classList.remove("open");
  stopGallery();
}

document.querySelector("#close-popup").addEventListener("click", closePopup);

popup.addEventListener("click", (event) => {
  if (event.target === popup) closePopup();
});


// sign petition

const petitionPopup = document.querySelector("#petition-popup");
const petitionForm = document.querySelector("#petition-form");
const petitionMessage = document.querySelector("#petition-message");
const petitionClose = document.querySelector("#close-petition");

const demoSignatures = [];

document.querySelector("#sign-button").addEventListener("click", () => {
  petitionMessage.textContent = "";

  petitionPopup.classList.add("open");
  document.querySelector("#petition-content").scrollTop = 0;

  petitionClose.focus();
});

function closePetition() {
  petitionPopup.classList.remove("open");
}

petitionClose.addEventListener("click", closePetition);

petitionPopup.addEventListener("click", (event) => {
  if (event.target === petitionPopup) closePetition();
});

petitionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstName = document.querySelector("#first-name").value.trim();
  const lastName = document.querySelector("#last-name").value.trim();

  if (!firstName || !lastName) return;

  demoSignatures.push({
    firstName,
    lastName
  });

  petitionForm.reset();
});


// escape key

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePopup();
    closePetition();
  }
});


// map dimensions

const MAP_W = 2048;
const MAP_H = 315;


// marker locations

const markerLocations = [

  // cracks

  ["cracks", "cracks-05.svg", 286, 129, 23, 17],
  ["cracks", "cracks-01.svg", 390, 129, 18, 22],
  ["cracks", "cracks-02.svg", 896, 123, 34, 30],
  ["cracks", "cracks-08.svg", 158, 131, 29, 23],
  ["cracks", "cracks-07.svg", 455, 132, 22, 20],
  ["cracks", "cracks-04.svg", 762, 133, 19, 10],
  ["cracks", "cracks-02.svg", 495, 133, 16, 16],
  ["cracks", "cracks-08.svg", 967, 138, 24, 20],
  ["cracks", "cracks-02.svg", 1082, 142, 23, 23],
  ["cracks", "cracks-07.svg", 1402, 145, 36, 32],
  ["cracks", "cracks-05.svg", 1264, 146, 18, 17],
  ["cracks", "cracks-04.svg", 1520, 157, 28, 14],
  ["cracks", "cracks-03.svg", 1895, 153, 33, 27],
  ["cracks", "cracks-02.svg", 1788, 165, 18, 18],
  ["cracks", "cracks-06.svg", 675, 197, 22, 17],
  ["cracks", "cracks-01.svg", 993, 210, 15, 18],
  ["cracks", "cracks-06.svg", 1918, 237, 19, 19],


  // foliage

  ["foliage", "foliage-07.svg", 911, 109, 30, 27],
  ["foliage", "foliage-02.svg", 586, 112, 20, 20],
  ["foliage", "foliage-03.svg", 758, 114, 36, 24],
  ["foliage", "foliage-05.svg", 558, 117, 21, 18],
  ["foliage", "foliage-06.svg", 210, 118, 47, 47],
  ["foliage", "foliage-04.svg", 472, 118, 19, 19],
  ["foliage", "foliage-08.svg", 608, 119, 20, 11],
  ["foliage", "foliage-06.svg", 1168, 115, 67, 36],
  ["foliage", "foliage-03.svg", 1216, 125, 34, 30],
  ["foliage", "foliage-08.svg", 346, 120, 18, 10],
  ["foliage", "foliage-04.svg", 274, 121, 17, 16],
  ["foliage", "foliage-02.svg", 1538, 140, 22, 22],
  ["foliage", "foliage-08.svg", 978, 132, 20, 20],
  ["foliage", "foliage-02.svg", 1000, 136, 17, 17],
  ["foliage", "foliage-03.svg", 1680, 135, 35, 35],
  ["foliage", "foliage-02.svg", 1717, 145, 25, 25],
  ["foliage", "foliage-08.svg", 1744, 149, 24, 16],
  ["foliage", "foliage-03.svg", 1858, 153, 31, 20],
  ["foliage", "foliage-06.svg", 1902, 158, 47, 42],
  ["foliage", "foliage-04.svg", 1970, 174, 24, 24],
  ["foliage", "foliage-06.svg", 735, 179, 40, 41],
  ["foliage", "foliage-02.svg", 312, 187, 18, 20],
  ["foliage", "foliage-03.svg", 457, 192, 32, 29],
  ["foliage", "foliage-07.svg", 596, 193, 19, 19],
  ["foliage", "foliage-05.svg", 428, 196, 30, 23],
  ["foliage", "foliage-04.svg", 883, 208, 25, 26],
  ["foliage", "foliage-03.svg", 1108, 210, 36, 28],
  ["foliage", "foliage-06.svg", 1270, 208, 47, 47],
  ["foliage", "foliage-07.svg", 1371, 212, 20, 20],
  ["foliage", "foliage-05.svg", 1079, 210, 28, 24],
  ["foliage", "foliage-04.svg", 1194, 215, 22, 22],
  ["foliage", "foliage-08.svg", 1242, 215, 18, 12],
  ["foliage", "foliage-05.svg", 1217, 217, 20, 18],
  ["foliage", "foliage-02.svg", 1424, 220, 27, 27],
  ["foliage", "foliage-05.svg", 1702, 224, 19, 19],
  ["foliage", "foliage-06.svg", 1713, 238, 22, 22],
  ["foliage", "foliage-03.svg", 1870, 225, 35, 24],
  ["foliage", "foliage-07.svg", 1778, 223, 28, 28],
  ["foliage", "foliage-05.svg", 1849, 230, 22, 22],
  ["foliage", "foliage-04.svg", 1634, 236, 17, 17],
  ["foliage", "foliage-08.svg", 1902, 247, 28, 17],


  // dips

  ["dips", "dips-05.svg", 309, 120, 32, 20],
  ["dips", "dips-04.svg", 890, 124, 19, 12],
  ["dips", "dips-07.svg", 1093, 122, 42, 46],
  ["dips", "dips-07.svg", 933, 126, 25, 23],
  ["dips", "dips-07.svg", 417, 127, 29, 26],
  ["dips", "dips-07.svg", 725, 124, 35, 32],
  ["dips", "dips-03.svg", 496, 128, 40, 22],
  ["dips", "dips-02.svg", 566, 130, 25, 16],
  ["dips", "dips-06.svg", 340, 133, 25, 16],
  ["dips", "dips-04.svg", 626, 139, 19, 11],
  ["dips", "dips-06.svg", 1252, 142, 22, 17],
  ["dips", "dips-07.svg", 1778, 145, 38, 44],
  ["dips", "dips-05.svg", 1342, 148, 38, 24],
  ["dips", "dips-04.svg", 1514, 150, 28, 28],
  ["dips", "dips-04.svg", 1316, 153, 19, 11],
  ["dips", "dips-06.svg", 1942, 156, 22, 17],
  ["dips", "dips-02.svg", 1653, 160, 17, 14],
  ["dips", "dips-04.svg", 1850, 166, 22, 22],
  ["dips", "dips-04.svg", 1768, 172, 25, 16],
  ["dips", "dips-06.svg", 692, 199, 23, 16],
  ["dips", "dips-02.svg", 838, 203, 27, 18],
  ["dips", "dips-04.svg", 320, 205, 19, 12],
  ["dips", "dips-06.svg", 904, 202, 22, 16],
  ["dips", "dips-03.svg", 934, 205, 41, 23],
  ["dips", "dips-05.svg", 1753, 222, 25, 25],
  ["dips", "dips-03.svg", 1573, 228, 37, 20],
  ["dips", "dips-06.svg", 1670, 236, 20, 16],


  // bumps

  ["bumps", "bumps-08.svg", 533, 118, 17, 17],
  ["bumps", "bumps-04.svg", 178, 134, 15, 18],
  ["bumps", "bumps-03.svg", 266, 133, 36, 22],
  ["bumps", "bumps-05.svg", 380, 134, 18, 21],
  ["bumps", "bumps-04.svg", 1378, 142, 20, 26],
  ["bumps", "bumps-08.svg", 1436, 150, 17, 17],
  ["bumps", "bumps-03.svg", 1673, 165, 37, 13],
  ["bumps", "bumps-06.svg", 707, 178, 26, 26],
  ["bumps", "bumps-07.svg", 570, 196, 17, 15],
  ["bumps", "bumps-02.svg", 296, 199, 22, 16],
  ["bumps", "bumps-07.svg", 866, 201, 14, 14],
  ["bumps", "bumps-05.svg", 980, 203, 19, 23],
  ["bumps", "bumps-06.svg", 1730, 230, 27, 27],
  ["bumps", "bumps-02.svg", 1651, 234, 17, 17],


  // hazards

  ["hazards", "hazards-05.svg", 506, 139, 22, 21],
  ["hazards", "hazards-04.svg", 1889, 165, 35, 33],
  ["hazards", "hazards-03.svg", 1929, 231, 27, 36]

];


// marker videos

const videoFiles = {
  cracks: "./videos/cracks.webm",
  dips: "./videos/dips.webm",
  foliage: "./videos/foliage.webm",
  hazards: "./videos/hazards.webm",
  bumps: "./videos/bumps.webm"
};

function startMarkerVideo(asset, category) {
  let video = asset.querySelector(".marker-video");

  if (!video) {
    video = document.createElement("video");

    video.className = "marker-video";
    video.src = videoFiles[category];
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";

    video.addEventListener("error", () => {
      console.error("marker video failed:", video.src);
      asset.classList.remove("video-playing");
    });

    asset.appendChild(video);
  }

  if (video.readyState > 0) {
    video.currentTime = 0;
  }

  video.play().then(() => {
    if (
      asset.matches(":hover") &&
      !asset.classList.contains("hidden")
    ) {
      asset.classList.add("video-playing");
    } else {
      video.pause();
    }
  }).catch((error) => {
    console.error("marker playback failed:", category, error);
  });
}

function stopMarkerVideo(asset) {
  asset.classList.remove("video-playing");

  const video = asset.querySelector(".marker-video");

  if (video) {
    video.pause();

    if (video.readyState > 0) {
      video.currentTime = 0;
    }
  }
}


// create markers

const road = document.querySelector("#road");
const map = document.querySelector(".map");

if (road && map) {

  function resizeRoad() {
    road.style.width = `${map.clientHeight * MAP_W / MAP_H}px`;
  }

  resizeRoad();

  const roadObserver = new ResizeObserver(resizeRoad);
  roadObserver.observe(map);

  markerLocations.forEach((marker, index) => {
    const [category, filename, x, y, width, height] = marker;

    const asset = document.createElement("button");
    const img = document.createElement("img");

    asset.type = "button";
    asset.className = `asset map-marker ${category}`;

    asset.setAttribute(
      "aria-label",
      `${category} map marker ${index + 1}`
    );

    asset.style.left = `${x / MAP_W * 100}%`;
    asset.style.top = `${y / MAP_H * 100}%`;
    asset.style.width = `${width / MAP_W * 100}%`;
    asset.style.height = `${height / MAP_H * 100}%`;

    img.src = `./web-assets/${filename}`;
    img.alt = "";
    img.draggable = false;

    img.onerror = () => {
      console.error("image failed:", img.src);
    };

    asset.appendChild(img);
    road.appendChild(asset);

    asset.addEventListener("mouseenter", () => {
      startMarkerVideo(asset, category);
    });

    asset.addEventListener("mouseleave", () => {
      stopMarkerVideo(asset);
    });
  });
}