router.get("/cars", async (req, res) => {
  try {
    console.log("Fetching cars from database...");
    const cars = await Car.find();
    console.log("Cars found:", cars);
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
