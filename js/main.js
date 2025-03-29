const body = $("body");
let tabCount = 0; // To keep track of the tab count
let tabInstances = {}; // Keep track of tab instances to avoid duplicates

// Function to add a new tab or activate an existing one
function addTab(tabName) {
  const tabId = `tab-${tabName}`;
  const contentId = `content-${tabName}`;
  const tabFile = `pages/${tabName.toLowerCase()}.html`; // Convert to lowercase and add extension

  // Check if tab already exists
  if (tabInstances[tabName]) {
    activateTab(tabId, contentId);
    return;
  }

  fetch(tabFile, { method: "HEAD" }) // Only check if the file exists
    .then((response) => {
      if (!response.ok) {
        throw new Error(`File ${tabFile} not found`);
      }
      return response;
    })
    .then(() => {
      const tabList = document.getElementById("tabs");
      const tabContentList = document.getElementById("tabs-content");

      // Create new tab
      const tabItem = document.createElement("li");
      tabItem.className = "nav-item";
      tabItem.id = tabId;
      tabItem.innerHTML = `
        <a class="nav-link" id="${tabId}-tab" data-bs-toggle="tab" href="#${contentId}" role="tab">
          <i class="fa-solid fa-earth-americas"></i>
          ${tabName}
          <span class="tab-close" onclick="closeTab('${tabId}', '${contentId}')">×</span>
        </a>
      `;

      // Insert tab **at the beginning** instead of the end
      tabList.prepend(tabItem);

      // Create new tab content
      const tabContent = document.createElement("div");
      tabContent.className = "tab-pane fade";
      tabContent.id = contentId;
      tabContent.role = "tabpanel";
      tabContent.innerHTML = `<p>Loading ${tabName} content...</p>`;

      // Insert content **at the beginning**
      tabContentList.prepend(tabContent);

      // Fetch external HTML content
      fetch(tabFile)
        .then((response) => response.text())
        .then((data) => {
          tabContent.innerHTML = data;
        })
        .catch((error) => {
          tabContent.innerHTML = `<p>Error loading ${tabName} content.</p>`;
          console.error("Error fetching content:", error);
        });

      // Store tab instance and activate it
      tabInstances[tabName] = true;
      activateTab(tabId, contentId);
      manageIcons();
    })
    .catch((error) => {
      console.warn(error.message);
      alert(`Error: The file for ${tabName} does not exist!`);
    });
}

// Function to activate a tab
function activateTab(tabId, contentId) {
  // Deactivate all tabs and content
  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.classList.remove("active"));
  document
    .querySelectorAll(".tab-pane")
    .forEach((content) => content.classList.remove("show", "active"));

  // Activate the selected tab and content
  document.getElementById(`${tabId}-tab`).classList.add("active");
  document.getElementById(contentId).classList.add("show", "active");
}

// Function to close a tab
function closeTab(tabId, contentId) {
  const tabItem = document.getElementById(tabId);
  const tabContent = document.getElementById(contentId);

  if (tabItem && tabContent) {
    tabItem.remove();
    tabContent.remove();

    // Remove tab instance from tracking
    delete tabInstances[tabId.replace("tab-", "")];

    // Activate the **first** tab after closing
    const firstTab = document.querySelector(
      ".nav-tabs .nav-item:first-child .nav-link"
    );
    if (firstTab) {
      firstTab.click(); // Activate the first tab
    }
  }
}

// Listen for tab clicks to properly activate the correct content
document.getElementById("tabs").addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("nav-link")) {
    const targetTab = e.target.getAttribute("href").substring(1); // Get the content ID
    const targetTabContent = document.getElementById(targetTab);

    // Ensure the tab content is shown
    const tabContents = document.querySelectorAll(".tab-pane");
    tabContents.forEach((content) =>
      content.classList.remove("show", "active")
    );
    targetTabContent.classList.add("show", "active");

    // Mark the clicked tab as active
    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => link.classList.remove("active"));
    e.target.classList.add("active");
  }
});

// hide show left side menu
body.on("click", "#menu-toggle", function (e) {
  var eThis = $(this);
  e.preventDefault();
  eThis.css({ display: "none" });
  $("#menu-toggle-hide").css({ display: "block" });
  $(".menu").css({ width: "0%", display: "none" });
  $(".navbar").css({ width: "calc(100% - 12px)" });
  manageIcons();
});
body.on("click", "#menu-toggle-hide", function (e) {
  var eThis = $(this);
  e.preventDefault();
  eThis.css({ display: "none" });
  $("#menu-toggle").css({ display: "block" });
  $(".menu").css({ width: "260px", display: "block" });
  $(".navbar").css({ width: "calc(100% - 272px)" });
  manageIcons();
});

// Show Submenu
body.on("click", ".main-menu-item a", function (e) {
  var eThis = $(this);
  e.preventDefault();
  eThis.parent().find(".submenu").toggle();
});

body.on("click", ".submenu-item a", function (e) {
  var eThis = $(this);
  e.preventDefault();
  eThis.parent().find(".submenu-submenu").toggle();
});

// Selected menu-item
$(".main-menu-item a").on("click", function (e) {
  var eThis = $(this);
  e.preventDefault();
  $(".main-menu a").removeClass("main-menu-item-selected");
  eThis.addClass("main-menu-item-selected");
});

// Toggle Add & View Action Form
body.on("click", ".card-header-down", function () {
  var eThis = $(this);
  eThis.css({ display: "none" });
  eThis.parent().find(".card-header-up").css({
    display: "block",
    "background-color": "rgba(0, 0, 0, 0.02)",
    border: "1px dotted #c2d5f1",
    "border-radius": "6px",
  });
  eThis.parent().find(".card-conten").css({ display: "block" });
});
body.on("click", ".card-header-up", function () {
  var eThis = $(this);
  eThis.css({ display: "none" });
  eThis.parent().find(".card-header-down").css({ display: "block" });
  eThis.parent().find(".card-conten").css({ display: "none" });
});

$(document).ready(function () {
  function updateNavbarWidth() {
    // if ($(window).width() < 991.98) {
    //   $(".navbar").css({ width: "calc(100% - 12px)" });
    // } else {
    //   $(".navbar").css({ width: "calc(100% - 272px)" });
    // }
    $(".navbar").css({ width: "calc(100% - 12px)" });
  }
  // Run on page load
  updateNavbarWidth();
  // Run on resize
  $(window).resize(updateNavbarWidth);
});

// Tab management
const tabs = document.querySelectorAll(".nav-tabs .nav-item");
const rightArrow = document.querySelector(".btn-right svg");
const leftArrow = document.querySelector(".btn-left svg");
const tabsList = document.querySelector(".nav-tabs");
const leftArrowContainer = document.querySelector(".btn-left");
const rightArrowContainer = document.querySelector(".btn-right");

$(".btn-left svg").on("click", function () {
  tabsList.scrollLeft -= 200;
  manageIcons();
});

$(".btn-right svg").on("click", function () {
  tabsList.scrollLeft += 200;
  manageIcons();
});

const manageIcons = () => {
  let maxScrollValue = tabsList.scrollWidth - tabsList.clientWidth;

  if (tabsList.scrollLeft > 0) {
    leftArrowContainer.classList.add("active");
  } else {
    leftArrowContainer.classList.remove("active");
  }

  if (tabsList.scrollLeft < maxScrollValue) {
    rightArrowContainer.classList.add("active");
  } else {
    rightArrowContainer.classList.remove("active");
  }
};

// manage icons when scroll left or right
tabsList.addEventListener("scroll", manageIcons);

// start manage icons(left & right when page loan and resize window real time)
window.addEventListener(
  "resize",
  function (event) {
    manageIcons();
  },
  true
);
manageIcons();
// end session

// start drag & drop event
let dragging = false;
const drag = (e) => {
  if (!dragging) return;
  tabsList.classList.add("dragging");
  tabsList.scrollLeft -= e.movementX;
};
tabsList.addEventListener("mousedown", () => {
  dragging = true;
});
tabsList.addEventListener("mousemove", drag);
document.addEventListener("mouseup", () => {
  dragging = false;
  tabsList.classList.remove("dragging");
});

// let dragging = false;
// let startX, scrollLeftStart;

// tabsList.addEventListener("mousedown", (e) => {
//   dragging = true;
//   startX = e.pageX - tabsList.offsetLeft;
//   scrollLeftStart = tabsList.scrollLeft;
// });

// tabsList.addEventListener("mousemove", (e) => {
//   if (!dragging) return;
//   e.preventDefault();
//   const x = e.pageX - tabsList.offsetLeft;
//   const walk = (x - startX) * 2; // Speed factor
//   tabsList.scrollLeft = scrollLeftStart - walk;
// });

// document.addEventListener("mouseup", () => {
//   dragging = false;
// });

// end drage & drop event
