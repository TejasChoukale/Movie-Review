//Movie_Website\Backend\index.js
import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import ReviewsDAO from "./dao/reviewsDAO.js"; // Ensure the correct DAO import path

// Load environment variables
dotenv.config();

const MongoClient = mongodb.MongoClient;
const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = encodeURIComponent(process.env.MONGO_PASSWORD);

const url = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.4y59e.mongodb.net/Movie_reviews?retryWrites=true&w=majority`;

const port = 8000;

console.log("Initializing MongoDB Atlas connection...");

MongoClient.connect(
  url,
  {
    maxPoolSize: 50, // Maximum number of concurrent connections in the pool
    wtimeoutMS: 2500, // Timeout duration for database operations
  }
)
  .then(async (client) => {
    console.log("Successfully connected to MongoDB Atlas cluster.");
    console.log("Injecting database connection into data access objects...");
    
    await ReviewsDAO.injectDB(client); // Inject database connection into DAO

    console.log(`Starting the server and listening for requests on port ${port}...`);
    app.listen(port, () => {
      console.log(`Server is up and running! You can access it at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas. Detailed error information:");
    console.error(err.stack);
    process.exit(1); // Exit process if the connection fails
  });
