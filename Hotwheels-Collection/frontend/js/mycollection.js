function displayMyCollection() {
  const collectionContainer = document.getElementById(
    "my-collection-container"
  );
  collectionContainer.innerHTML = ""; // Clear previous content

  const myCollection = JSON.parse(localStorage.getItem("myCollection")) || [];

  myCollection.forEach((car, index) => {
    const carCard = document.createElement("div");
    carCard.classList.add(
      "car-card",
      "p-4",
      "bg-white",
      "rounded-lg",
      "shadow-md"
    );

    carCard.innerHTML = `
      <img src="${car.image}" class="car-image" alt="${car.name}">
      <h3 class="text-lg font-bold mt-2">${car.name} (${car.year})</h3>
      <p><strong>Series:</strong> ${car.series}</p>
      <button class="remove-btn bg-red-500 text-white px-4 py-2 rounded mt-2" data-index="${index}">
        Remove
      </button>
    `;

    collectionContainer.appendChild(carCard);
  });

  // Attach event listeners to all Remove buttons
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", function () {
      removeCarFromCollection(this.dataset.index);
    });
  });
}
function createCarCard(car, index, isCollection = false) {
  let card = document.createElement("div");
  card.classList.add("car-card");

  card.innerHTML = `
    <img src="${car.image}" alt="${car.name}" class="car-image">
    <h3>${car.name}</h3>
    <p>Year: ${car.year} | Series: ${car.series}</p>
    ${
      isCollection
        ? `<button class="remove-btn" onclick="removeCarFromCollection(${index})">Remove</button>`
        : ""
    }
  `;

  return card;
}

// Function to remove car from localStorage and update UI
function removeCarFromCollection(index) {
  let myCollection = JSON.parse(localStorage.getItem("myCollection")) || [];
  let carCards = document.querySelectorAll(".car-card");

  if (carCards[index]) {
    let card = carCards[index];

    // Apply animation class
    card.classList.add("removing");

    // Generate dust particles for realism
    createDustEffect(card);

    setTimeout(() => {
      card.remove(); // Remove from DOM after animation

      // Remove from localStorage
      myCollection.splice(index, 1);
      localStorage.setItem("myCollection", JSON.stringify(myCollection));

      // Refresh collection view
      displayMyCollection();
    }, 1200); // Match animation duration
  }
}

// Call function to display the collection when the page loads
document.addEventListener("DOMContentLoaded", displayMyCollection);

document.addEventListener("DOMContentLoaded", function () {
  let carSound = document.getElementById("car-sound");

  // Play car sound on page load
  carSound.volume = 0.5;
  carSound.play().catch((error) => console.log("Auto-play blocked:", error));

  // Play sound when hovering over a car card
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      carSound.currentTime = 0; // Reset sound to start
      carSound.play();
    });
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:5001/cars");
    let cars = await response.json();

    const carsContainer = document.getElementById("cars-container");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    function displayCars(filteredCars) {
      carsContainer.innerHTML = ""; // Clear previous cars
      filteredCars.forEach((car) => {
        const carElement = document.createElement("div");
        carElement.classList.add("car-card");
        carElement.innerHTML = `
          <div class="w-full h-96 flex flex-col items-center rounded-lg shadow-md bg-white overflow-hidden">
              <div class="w-full h-3/4 flex items-center justify-center bg-gray-100">
                  <img src="${car.image}" alt="${car.name}" 
                      class="w-auto h-full object-contain" 
                      onerror="this.src='placeholder.jpg';">
              </div>
              <div class="w-full h-1/4 p-2 flex flex-col items-center justify-between">
                  <h3 class="text-sm font-semibold text-center">${car.name} (${car.year})</h3>
                  <p class="text-xs text-gray-600 text-center"><strong>Series:</strong> ${car.series}</p>
                  <p class="text-xs text-gray-600 text-center"><strong>Category:</strong> ${car.category}</p>
                  <p class="text-xs text-gray-600 text-center"><strong>Price:</strong> $${car.price}</p>
                  <button 
                      class="mt-1 px-3 py-1 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition duration-200"
                      onclick="addToCollection('${car.name}', '${car.image}', '${car.year}', '${car.series}')">
                      Add to Collection
                  </button>
              </div>
          </div>
        `;
        carsContainer.appendChild(carElement);
      });
    }

    // Initial display
    displayCars(cars);

    // Search function
    function searchCars() {
      const query = searchInput.value.toLowerCase();
      const filteredCars = cars.filter(
        (car) =>
          car.name.toLowerCase().includes(query) ||
          car.series.toLowerCase().includes(query) ||
          car.category.toLowerCase().includes(query)
      );
      displayCars(filteredCars);
    }

    // Trigger search on button click and input typing
    searchBtn.addEventListener("click", searchCars);
    searchInput.addEventListener("input", searchCars); // Live search effect
  } catch (error) {
    console.error("Error fetching cars:", error);
  }
});

document.getElementById("searchBar").addEventListener("input", function () {
  let searchQuery = this.value.trim().toLowerCase();
  let myCollection = JSON.parse(localStorage.getItem("myCollection")) || [];
  let collectionContainer = document.getElementById("collection-container");

  collectionContainer.innerHTML = ""; // Clear the container

  // If search is empty, show full collection with remove buttons
  if (searchQuery === "") {
    displayMyCollection(); // Call the function that renders all cards with the remove button
    return;
  }

  // Filter and display only matching items
  let filteredCars = myCollection.filter((car) =>
    car.name.toLowerCase().includes(searchQuery)
  );

  filteredCars.forEach((car, index) => {
    let card = createCarCard(car, index, true); // Ensure remove button is included
    collectionContainer.appendChild(card);
  });
});
