// JavaScript to toggle between light and dark modes
const toggleBtn = document.createElement("button");
toggleBtn.classList.add("dark-mode-btn");
toggleBtn.textContent = "🌙"; // Dark mode button icon

document.body.appendChild(toggleBtn);

// Check if user has previously selected dark mode
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
} else {
    document.body.classList.add("light-mode");
}

toggleBtn.addEventListener("click", () => {
    if (document.body.classList.contains("dark-mode")) {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
        toggleBtn.textContent = "🌙"; // Change button icon to dark mode
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
        toggleBtn.textContent = "🌞"; // Change button icon to light mode
        localStorage.setItem("theme", "dark");
    }
});
