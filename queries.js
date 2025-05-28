// This script is for the MongoDB shell (mongosh), not Node.js
//use plp_bookstore;

print("--- Task 2: Basic CRUD Operations ---");

// Task 2.1: Find all books in a specific genre (e.g., 'Science Fiction')
print("\n--- Find all books in 'Science Fiction' genre ---");
db.books.find({ genre: "Science Fiction" }).pretty();

// Task 2.2: Find books published after a certain year (e.g., 2015)
print("\n--- Find books published after 2015 ---");
db.books.find({ published_year: { $gt: 2015 } }).pretty();

// Task 2.3: Find books by a specific author (e.g., 'James Clear')
print("\n--- Find books by 'James Clear' ---");
db.books.find({ author: "James Clear" }).pretty();

// Task 2.4: Update the price of a specific book (e.g., 'Atomic Habits')
// Using updateOne as recommended for single document updates
print("\n--- Updating price of 'Atomic Habits' ---");
var updateResult1 = db.books.updateOne(
    { title: "Atomic Habits" },
    { $set: { price: 13.99 } }
);
print("Update Result (Atomic Habits):");
printjson(updateResult1); // Use printjson for structured output in mongosh
// Verify the update
print("\n--- Verifying update for 'Atomic Habits' ---");
db.books.find({ title: "Atomic Habits" }).pretty();


// Task 2.5: Delete a book by its title (e.g., 'The Vanishing Half')
// Using deleteOne as recommended for single document deletion
print("\n--- Deleting 'The Vanishing Half' ---");
var deleteResult1 = db.books.deleteOne({ title: "The Vanishing Half" });
print("Delete Result (The Vanishing Half):");
printjson(deleteResult1); // Use printjson for structured output
// Verify deletion by trying to find it
print("\n--- Verifying deletion for 'The Vanishing Half' ---");
db.books.find({ title: "The Vanishing Half" }).pretty();

print("\n--- Task 3: Advanced Queries ---");

// Task 3.1: Find books that are both in stock and published after 2010
print("\n--- Find books in stock and published after 2010 ---");
db.books.find({
    in_stock: true,
    published_year: { $gt: 2010 }
}).pretty();

// Task 3.2: Use projection to return only the title, author, and price fields
print("\n--- Find all books with only Title, Author, Price ---");
db.books.find(
    {}, // Empty query to select all documents
    { title: 1, author: 1, price: 1, _id: 0 } // Projection: 1 to include, 0 to exclude _id
).pretty();

// Task 3.3: Implement sorting to display books by price (both ascending and descending)
print("\n--- Books sorted by price (Ascending) ---");
db.books.find().sort({ price: 1 }).pretty(); // 1 for ascending

print("\n--- Books sorted by price (Descending) ---");
db.books.find().sort({ price: -1 }).pretty(); // -1 for descending

// Task 3.4: Use the limit and skip methods to implement pagination (5 books per page)
// Page 1 (first 5 books)
print("\n--- Page 1 (5 books) ---");
db.books.find().limit(5).pretty();

// Page 2 (next 5 books) - skip the first 5, then limit to 5
print("\n--- Page 2 (next 5 books) ---");
db.books.find().skip(5).limit(5).pretty();

print("\n--- Task 4: Aggregation Pipeline ---");

// Task 4.1: Create an aggregation pipeline to calculate the average price of books by genre
print("\n--- Average price of books by genre ---");
db.books.aggregate([
    {
        $group: {
            _id: "$genre", // Group by the 'genre' field
            averagePrice: { $avg: "$price" } // Calculate the average of 'price'
        }
    },
    {
        $sort: { averagePrice: -1 } // Sort by average price descending
    }
]).pretty();

// Task 4.2: Create an aggregation pipeline to find the author with the most books in the collection
print("\n--- Author with the most books ---");
db.books.aggregate([
    {
        $group: {
            _id: "$author", // Group by 'author'
            bookCount: { $sum: 1 } // Count the number of books for each author
        }
    },
    {
        $sort: { bookCount: -1 } // Sort by book count in descending order
    },
    {
        $limit: 1 // Get only the top author
    }
]).pretty();

// Task 4.3: Implement a pipeline that groups books by publication decade and counts them
print("\n--- Books grouped by publication decade ---");
db.books.aggregate([
    {
        $project: {
            // Calculate the decade for each book
            // (published_year - (published_year % 10)) gives the start of the decade
            decade: { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] }
        }
    },
    {
        $group: {
            _id: "$decade", // Group by the calculated decade
            bookCount: { $sum: 1 } // Count books in each decade
        }
    },
    {
        $sort: { _id: 1 } // Sort by decade in ascending order
    }
]).pretty();

print("\n--- Task 5: Indexing (Commands to be run separately) ---");
print("Refer to README.md for instructions on creating indexes and using explain().");

// Task 5.1 Create an index on the title field
db.books.createIndex({ title: 1 });

// Task 5.2 Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 });

// Task 5.3 Use explain() to show query performance
db.books.find({ title: "1984" }).explain("executionStats");