document.addEventListener("DOMContentLoaded", function () {
    const sortSelect = document.getElementById("sort");
    const container = document.querySelector(".notes-section .container");
    const discountChance = 0.4; // 40% chance for discount
    const discountMin = 10;
    const discountMax = 30;
    let deals = [];

    // Retrieve stored deals from localStorage
    let storedDeals = JSON.parse(localStorage.getItem("dealsData"));
    let lastUpdated = localStorage.getItem("dealsDate");
    let today = new Date().toISOString().split("T")[0]; // Get today's date

    // Check if deals need to be regenerated
    let generateNewDeals = !storedDeals || lastUpdated !== today;

    document.querySelectorAll(".card").forEach(card => {
        let originalPrice = parseInt(card.getAttribute("data-price"));
        let cardId = card.getAttribute("data-id");
        let priceElement = card.querySelector("p strong");
        let buyButton = card.querySelector(".buy-btn");
        let isPurchased = localStorage.getItem(`purchased-${cardId}`) === "true";

        if (!isPurchased) {
            let discountPercent = 0;
            let discountedPrice = originalPrice;

            if (generateNewDeals && Math.random() < discountChance) {
                discountPercent = Math.floor(Math.random() * (discountMax - discountMin + 1) + discountMin);
                discountedPrice = Math.floor(originalPrice * (1 - discountPercent / 100));

                deals.push({
                    id: cardId,
                    name: card.querySelector("h3").textContent,
                    originalPrice,
                    discountedPrice,
                    discountPercent
                });
            } else if (!generateNewDeals && storedDeals) {
                let storedDeal = storedDeals.find(deal => deal.id === cardId);
                if (storedDeal) {
                    discountPercent = storedDeal.discountPercent;
                    discountedPrice = storedDeal.discountedPrice;
                }
            }

            if (discountPercent > 0) {
                priceElement.innerHTML = `<del>₹${originalPrice}</del> ₹${discountedPrice}`;
                card.setAttribute("data-price", discountedPrice);

                let badge = document.createElement("span");
                badge.classList.add("discount-badge");
                badge.textContent = `-${discountPercent}%`;
                card.querySelector(".imgBx").appendChild(badge);
            }
        }

        // Handle purchase button
        if (isPurchased) {
            buyButton.innerHTML = "Purchased";
            buyButton.classList.add("purchased");
            buyButton.style.background = "gray";
            buyButton.style.cursor = "not-allowed";
            buyButton.disabled = true;
        } else {
            buyButton.addEventListener("click", function () {
                localStorage.setItem(`purchased-${cardId}`, "true");
                buyButton.innerHTML = "Purchased";
                buyButton.classList.add("purchased");
                buyButton.style.background = "gray";
                buyButton.style.cursor = "not-allowed";
                buyButton.disabled = true;
            });
        }
    });

    // Store new deals if required
    if (generateNewDeals && deals.length > 0) {
        localStorage.setItem("dealsData", JSON.stringify(deals));
        localStorage.setItem("dealsDate", today);
    }

    // Show deals popup
    let finalDeals = JSON.parse(localStorage.getItem("dealsData")) || [];
    if (finalDeals.length > 0) {
        let dealsContainer = document.getElementById("deals-of-the-day");
        let overlay = document.getElementById("overlay");
        let dealsList = document.querySelector(".deals-list");

        dealsList.innerHTML = "";
        finalDeals.forEach(deal => {
            let dealItem = document.createElement("div");
            dealItem.classList.add("deal-item");
            dealItem.innerHTML = `<strong>${deal.name}</strong>: <del>₹${deal.originalPrice}</del> <span>₹${deal.discountedPrice} (-${deal.discountPercent}%)</span>`;
            dealsList.appendChild(dealItem);
        });

        dealsContainer.style.display = "block";
        overlay.style.display = "block";

        document.getElementById("close-deals").addEventListener("click", function () {
            dealsContainer.style.display = "none";
            overlay.style.display = "none";
        });

        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) {
                dealsContainer.style.display = "none";
                overlay.style.display = "none";
            }
        });
    }

    // Sorting function based on updated discounted price
    function sortCards(order) {
        let cards = Array.from(container.children);
        cards.sort((a, b) => {
            let priceA = parseInt(a.getAttribute("data-price"));
            let priceB = parseInt(b.getAttribute("data-price"));
            return order === "asc" ? priceA - priceB : priceB - priceA;
        });

        const fragment = document.createDocumentFragment();
        cards.forEach(card => fragment.appendChild(card));
        container.innerHTML = "";
        container.appendChild(fragment);
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", function () {
            sortCards(this.value);
        });

        setTimeout(() => {
            sortCards(sortSelect.value);
        }, 100);
    }
});
