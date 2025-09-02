import { httpServer } from "./main";
import "dotenv/config";
import { connectDatabase } from "./database/database";

connectDatabase();

const port = process.env.PORT || 3000;

httpServer.listen(port, "0.0.0.0", () => {
    console.log(`Server running! Port: ${port}`);
});
