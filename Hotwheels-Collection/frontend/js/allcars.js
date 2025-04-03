document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:5001/cars"); // Fetch data from backend
    const carsData = await response.json(); // Store all cars data

    const carsContainer = document.getElementById("cars-container");
    const searchBar = document.getElementById("searchBar");

    // Function to display cars
    function displayCars(cars) {
      carsContainer.innerHTML = ""; // Clear previous cars

      if (cars.length === 0) {
        carsContainer.innerHTML = `<p id="no-cars-message" class="no-cars-message">No cars found.</p>`;
        return;
      }

      cars.forEach((car) => {
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
                  <div class="flex items-center gap-3">
                      <button 
                          class="px-3 py-1 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition duration-200"
                          onclick="addToCollection('${car.name}', '${car.image}', '${car.year}', '${car.series}')">
                          Add to Collection
                      </button>
                      <button 
                          class="wishlist-btn text-2xl hover:text-red-500 transition duration-200" 
                          onclick="toggleWishlist('${car.name}', '${car.image}', '${car.year}', '${car.series}', this)">
                          🤍
                      </button>
                  </div>
              </div>
          </div>
        `;

        carsContainer.appendChild(carElement);
      });
    }

    // Show all cars initially
    displayCars(carsData);

    // Search Functionality
    searchBar.addEventListener("input", function () {
      const searchText = searchBar.value.toLowerCase();

      if (searchText === "") {
        displayCars(carsData); // Show all cars if search bar is empty
      } else {
        const filteredCars = carsData.filter(
          (car) =>
            car.name.toLowerCase().includes(searchText) ||
            car.series.toLowerCase().includes(searchText) // Filters by both name and series
        );
        displayCars(filteredCars);
      }
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
  }
});
