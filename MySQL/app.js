import express from "express";
import { createNote, getNote, getNotes } from "./database.js";

const app = express();
app.use(express.json());

app.get("/notes/:id", async (req, res) => {
    const id = req.params.id;
    const result = await getNote(id);
    res.send(result);
})

app.get("/notes", async (req, res) => {
    const result = await getNotes();
    res.send(result);
})


app.post("/notes", async (req, res) => {
    const { title, content } = req.body;
    const result = await createNote(title, content);
    res.status(201).send(result)
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke')
})

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})