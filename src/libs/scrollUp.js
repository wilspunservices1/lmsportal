const scrollUp = () => {
  const scrollUpElement = document.querySelector(".scroll-up");
  if (scrollUpElement) {
    scrollUpElement.addEventListener("click", () => {
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    });

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollCount = window.scrollY;
          scrollUpElement.style.display = scrollCount > 300 ? "block" : "none";
          ticking = false;
        });
        ticking = true;
      }
    });
  }
};
export default scrollUp;
