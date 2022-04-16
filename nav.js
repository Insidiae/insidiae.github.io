const primaryNav = document.getElementById("primary-navigation");
const navToggle = document.querySelector(".header__nav-toggle");

navToggle.addEventListener("click", () => {
  const visibility = primaryNav.dataset.visible;

  primaryNav.dataset.visible = visibility === "false" ? true : false;
  navToggle.setAttribute(
    "aria-expanded",
    visibility === "false" ? true : false
  );
});
