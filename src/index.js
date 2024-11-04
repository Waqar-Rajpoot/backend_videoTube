import dotenv from "dotenv"
import connectDB from "./database/connection.js"
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})

// Connect to MongoDB
connectDB().then(() => {

    const port = process.env.PORT || 9000;

    app.on("error", (error) => {
        console.log("Error in express application ", error);  
    })
    
    app.listen(port, () => {
        console.log(`Server is listening on port http://localhost:${process.env.PORT}`);
    });

}).catch((err) => {
    console.log("MONGODB connection failed !", err);    
});