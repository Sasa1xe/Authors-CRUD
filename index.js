import express from "express";
import { createDB } from "./db.js";

const app = express();
const db = createDB();

app.use(express.json());

app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});

app.use((req, res, next) => {
  req.db = db;
  next();
});

//Query Search middleware
app.get("/authors", async (req, req) => {
  const search = req.query.search;

  if (!search) {
    return next();
  }

  const authors = await req.db.getAll("authors");

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().startsWith(search.toLowerCase())
  );

  return res.json({
    data: filteredAuthors,
  });
});
//get all 
app.get("/authors", async (req, res) => {
  const authors = await db.getAll("authors");

  return res.json({
    data: authors,
  });


});
// get one author
app.get("/authors/:author_id", async (req, res) => {
  const author = await db.getById("authors" , req.params.author_id);

  if (!author) {
    return res.status(404).json({
      message: "author not found",
    });
  }

  return res.json({
    data: author,
  });
});


// create author
app.post("/authors", async (req, res) => {
  const authorData = req.body;

  await db.create("authors", authorData);

  return res.status(201).json({
    message: "author created successfully",
  });
});


// update author
app.patch("/authors/:author_id", async (req, res) => {
  const id = req.params.author_id;
  const author = await db.getById("authors", id);

  if (!author) {
    return res.status(404).json({
      message: "author not found",
    });
  }

  const updateData = req.body;

  await db.update("authors", id, updateData);

  const newAuthor = await db.getById("authors", id);

  return res.status(200).json({
    message: "author updated successfully",
    data: newAuthor,
  });
});


// delete author
app.delete("/authors/:author_id", async (req, res) => {
  const id = req.params.author_id;

  const author = await db.getById("authors", id);

  if (!author) {
    return res.status(404).json({
      message: "author not found",
    });
  }

  await db.delete("authors", id);

  return res.status(204).json({
    message: "author deleted successfully",
  });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
