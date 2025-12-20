const express = require("express");
const cors = require("cors");

const summaryRoutes = require("./routes/summary");
const uploadRoutes = require("./routes/upload");
const employeeRoutes = require("./routes/employees");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/employees", employeeRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is running");
});


app.use("/summary", summaryRoutes);
app.use("/upload", uploadRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
