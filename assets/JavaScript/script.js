      
      //navbar
      
      // Get the elements
      const menuBtn = document.getElementById('menu-btn');
      const menu = document.querySelector('.menu');
      
      // Add event listener to toggle the menu on click of the button
      menuBtn.addEventListener('click', () => {
        menu.classList.toggle('active');
      });
      
      // Close the menu when clicking outside of it
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
          menu.classList.remove('active');
        }
      });
      



//Dark mode 
      document.addEventListener("DOMContentLoaded", () => {
        const toggleSwitch = document.querySelector(".checkbox");
        const body = document.body;
        const heroSection = document.querySelector(".hero");
      
        // Check if user has a saved preference
        if (localStorage.getItem("darkMode") === "enabled") {
          body.classList.add("dark-mode");
          heroSection.classList.add("dark-hero");
          toggleSwitch.checked = true;
        }
      
        toggleSwitch.addEventListener("change", () => {
          if (toggleSwitch.checked) {
            body.classList.add("dark-mode");
            heroSection.classList.add("dark-hero");
            localStorage.setItem("darkMode", "enabled");
          } else {
            body.classList.remove("dark-mode");
            heroSection.classList.remove("dark-hero");
            localStorage.setItem("darkMode", "disabled");
          }
        });
      });
      