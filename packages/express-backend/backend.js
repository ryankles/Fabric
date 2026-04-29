import express from 'express'; // ES module (async), uses CommonJS by default (sync)
import cors from "cors";
import userServices from "./services/user-services.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
// CommonJS would be more like require('express');

const { getUsers, findUserById, findUserByName, addUser, removeUserById } = userServices;

dotenv.config();
const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors()); // adds 'Access-Control-Allow-Origin' header to any response at all
app.use(express.json()); // set up express to parse incoming data in JSON

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.get("/users", (req, res) => {
    const name = req.query.name
    const job = req.query.job
    let promise = getUsers(name, job)
    promise.then((result) => {
        res.send({ users_list: result })
    })
    .catch((error) => {
        console.log(error)
        res.status(400).send("Bad request.")
    })
})

app.get("/users/:id", (req, res) => {
    const id = req.params.id
    let promise = findUserById(id)
    promise.then((result) => {
        if (result === null) {
            res.status(404).send("Resource not found.")
        }
        else {
            res.send(result)
        }
    })
    .catch((error) => {
        console.log(error)
        res.status(400).send("Bad id.")
    })
})

app.post("/users", (req, res) => {
    const user = req.body
    let promise = addUser(user)
    promise.then((addedUser) => {
        if (addedUser === undefined) {
            res.status(400).send("Bad request.")
        }
        else {
            res.status(201).send(addedUser)
        }
    })
    .catch((error) => {
        console.log(error)
        res.status(400).send("Bad request.")
    })
})

app.delete("/users/:id", (req, res) => {
    const id = req.params.id
    let promise = removeUserById(id)
    promise.then((result) => {
        if (result === null) {
            res.status(404).send("Resource not found.")
        }
        else {
            res.status(204).send(id)
        }
    })
    .catch((error) => {
        console.log(error)
        res.status(400).send("Bad id.")
    })
})

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
})

// Setting debugger: export DEBUG='express:router'