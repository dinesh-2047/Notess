      
      //navbar
      
      // Get the elements
      const menuBtn = document.getElementById('menu-btn');
      const menu = document.querySelector('.menu');
      const menuOpen = document.querySelector('.menu-open');
      const menuClose = document.querySelector('.menu-close');
      
      // Add event listener to toggle the menu on click of the button
      menuBtn.addEventListener('click', () => {
        menu.classList.toggle('active');
      });

      menuClose.style.display = 'none';
      menuClose.addEventListener("click",()=>{
        menuClose.style.display="none"
        menuOpen.style.display = "inline-block"
      })

      menuOpen.addEventListener("click",()=>{
        menuOpen.style.display = "none"
        menuClose.style.display = "inline-block"
      })
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
        const input = document.querySelectorAll("input");
        const textarea = document.querySelectorAll("textarea")
      
        // Check if user has a saved preference
        if (localStorage.getItem("darkMode") === "enabled") {
          body.classList.add("dark-mode");

          heroSection?.classList.add("dark-hero");
          Array.from(input)?.forEach((element)=>{
            element.classList?.add("input-box-dark")
          })
          Array.from(textarea)?.forEach((element)=>{
            element.classList?.add("input-box-dark")
          })
          if(toggleSwitch){
            toggleSwitch.checked = true;
          }

        }
      
        toggleSwitch?.addEventListener("change", () => {
          if (toggleSwitch.checked) {
            body.classList.add("dark-mode");
            heroSection?.classList.add("dark-hero");
            localStorage.setItem("darkMode", "enabled");

            Array.from(input)?.forEach((element)=>{
              element.classList?.add("input-box-dark")
            })

            Array.from(textarea)?.forEach((element)=>{
              element.classList?.add("input-box-dark")
            })

          } else {
            body.classList.remove("dark-mode");
            heroSection?.classList.remove("dark-hero");

            Array.from(input)?.forEach((element)=>{
              element.classList?.remove("input-box-dark")
            })

            Array.from(textarea).forEach((element)=>{
              element.classList?.remove("input-box-dark")
            })

            localStorage.setItem("darkMode", "disabled");
          }
        });
      });
      