const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Trippy backend is running");
});

app.post("/generate-trip", (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { budget, interests, days } = req.body;

    if (!budget || !interests || !days) {
      return res.status(400).json({ message: "Missing fields" });
    }

    res.json({
      message: `Trip planned for ${days} days with budget ${budget} and interests ${interests}`,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("server is runnig on port 5000");
});
