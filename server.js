const express = require("express");
const app = express();
const db = require("./sql/db");
const multer = require("multer");
const uidSafe = require("uid-safe"); // gives unique ID to a file
const path = require("path");
const s3 = require("./s3");

app.use(express.static("./public"));

app.use(express.json());

//processes image object into a readable req.file behind the scenes
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

//routes
app.get("/images.json", (req, res) => {
    db.getImages().then((data) => {
        // console.log('node side', data);
        res.json(data);
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log(req.file);
    // console.log(req.body);
    if (!req.file) {
        res.json({
            success: false,
        });
    } else {
        db.addImage(
            `https://s3.amazonaws.com/khorneworldeaters/${req.file.filename}`,
            req.body.username,
            req.body.title,
            req.body.description
        )
            .then(function ({ rows }) {
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500);
                res.json([]);
            });
    }
});

app.get("/getImage/:id", (req, res) => {
    db.pullImage(req.params.id).then(({ rows }) => {
        res.json(rows[0]);
    });
});

app.get("/comment/:id", (req, res) => {
    db.pullComment(req.params.id).then(({ rows }) => {
        res.json(rows);
    });
});

app.post("/comment", (req, res) => {
    const { text, username, image_id } = req.body;
    console.log(text, username, image_id);
    db.postComment(text, username, image_id)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log("error in back end posting", err);
            // res.statusCode(500);
        });
});

app.get("/moreImages/:id", (req, res) => {
    db.getMoreImages(req.params.id).then(({ rows }) => {
        res.json(rows);
    });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
