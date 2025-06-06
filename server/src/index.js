import "dotenv/config";
import { connectDB } from "./database/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log(`app failed to start ${err}`);
    });

    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(`falied to connect to db ${error}`);
    process.exit(1);
  });
