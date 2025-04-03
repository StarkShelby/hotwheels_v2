function addToCollection(carName, carImage, carYear, carSeries) {
  let collection = JSON.parse(localStorage.getItem("myCollection")) || [];

  if (!collection.some((car) => car.name === carName)) {
    collection.push({
      name: carName,
      image: carImage,
      year: carYear,
      series: carSeries,
    });
    localStorage.setItem("myCollection", JSON.stringify(collection));
  }
}
function addToCollection(name, image, year, series, event) {
  let myCollection = JSON.parse(localStorage.getItem("myCollection")) || [];

  // Prevent duplicate entries
  if (myCollection.some((car) => car.name === name)) {
    alert("This car is already in your collection!");
    return;
  }

  // Add car to localStorage
  myCollection.push({ name, image, year, series });
  localStorage.setItem("myCollection", JSON.stringify(myCollection));

  // Find the clicked card and animate it
  const card = event.target.closest(".car-card");
  if (!card) return;

  animateCardFlyToCollection(card, image);
}

// ✅ Function to animate the card flying into the `mycollection-navbar`
function animateCardFlyToCollection(card, imageSrc) {
  const navbar = document.getElementById("mycollection-navbar"); // Ensure this ID exists
  if (!navbar) return;

  // Get positions
  const cardRect = card.getBoundingClientRect();
  const navbarRect = navbar.getBoundingClientRect();

  // Create flying image
  const flyingImage = document.createElement("img");
  flyingImage.src = imageSrc;
  flyingImage.classList.add("flying-card");
  document.body.appendChild(flyingImage);

  // Set initial position (centered on the clicked card)
  flyingImage.style.left = `${cardRect.left + cardRect.width / 2}px`;
  flyingImage.style.top = `${cardRect.top + cardRect.height / 2}px`;

  // Force reflow
  flyingImage.offsetWidth;

  // Animate to `mycollection-navbar`
  flyingImage.style.transform = `translate(${
    navbarRect.left - cardRect.left
  }px, ${navbarRect.top - cardRect.top}px) scale(0.2)`;
  flyingImage.style.opacity = "0";

  // Remove after animation completes
  setTimeout(() => {
    flyingImage.remove();
  }, 1000);
}

function showCollectionMessage(message, isError = false) {
  let messageBox = document.getElementById("collection-message");
  messageBox.innerText = message;
  messageBox.style.background = isError
    ? "rgba(255, 0, 0, 0.8)"
    : "rgba(0, 128, 0, 0.8)"; // Red for error, Green for success
  messageBox.classList.add("show");

  setTimeout(() => {
    messageBox.classList.remove("show");
  }, 2000); // Hide after 2 seconds
}

function addToCollection(name, image, year, series, event) {
  let myCollection = JSON.parse(localStorage.getItem("myCollection")) || [];

  if (myCollection.some((car) => car.name === name)) {
    showCollectionMessage("Car already added!", true); // Show red message
    return;
  }

  myCollection.push({ name, image, year, series });
  localStorage.setItem("myCollection", JSON.stringify(myCollection));

  showCollectionMessage("Car added successfully!"); // Show green message
}
