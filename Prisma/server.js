import express from "express"
const app = express();
const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
    return res.send("Hello")
})

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes Files
import routes from "./routes/index.js"
app.use(routes)

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`))