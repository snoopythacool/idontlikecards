var express = require('express')

var router = express()

router.get("/", (req, res) => {
    res.render("index")
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/logout", (req, res) => {
    res.render("logout")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.get("/collection", (req, res) => {
    res.render("collection")
})

module.exports = router