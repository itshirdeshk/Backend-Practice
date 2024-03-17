require("dotenv").config()

const express = require("express")
const app = express()
// const port = 3000

const githubData = {
    "login": "itshirdeshk",
    "id": 61307244,
    "node_id": "MDQ6VXNlcjYxMzA3MjQ0",
    "avatar_url": "https://avatars.githubusercontent.com/u/61307244?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/itshirdeshk",
    "html_url": "https://github.com/itshirdeshk",
    "followers_url": "https://api.github.com/users/itshirdeshk/followers",
    "following_url": "https://api.github.com/users/itshirdeshk/following{/other_user}",
    "gists_url": "https://api.github.com/users/itshirdeshk/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/itshirdeshk/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/itshirdeshk/subscriptions",
    "organizations_url": "https://api.github.com/users/itshirdeshk/orgs",
    "repos_url": "https://api.github.com/users/itshirdeshk/repos",
    "events_url": "https://api.github.com/users/itshirdeshk/events{/privacy}",
    "received_events_url": "https://api.github.com/users/itshirdeshk/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Hirdesh Khandelwal ",
    "company": null,
    "blog": "",
    "location": "India ",
    "email": null,
    "hireable": null,
    "bio": "I am a student and currently I am learning Android Development and also interested in Web Development.",
    "twitter_username": "itshirdeshk",
    "public_repos": 45,
    "public_gists": 0,
    "followers": 9,
    "following": 16,
    "created_at": "2020-02-21T06:31:25Z",
    "updated_at": "2024-02-19T14:27:38Z"
}

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.get('/twitter', (req, res) => {
    res.send("This is Twitter...")
})

app.get('/login', (req, res) => {
    res.send(`<h1>Please Login First...</h1>`);
})

app.get('/youtube', (req, res) => {
    res.send("<h2>Chai aur Code</h2>")
})

app.get('/github', (req, res) => {
    res.json(githubData)
})

app.listen(process.env.PORT, () => {
    console.log(`Server is listenig on port: ${process.env.PORT}`);
})