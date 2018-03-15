const express = require("express"),
    router = express.Router(),
    Menu = require("../models/menuModel"),
    New = require("../models/newModel"),
    slug = require("slug");

let menus = [];
Menu.find()
    .then(arrMenu => menus = arrMenu)
    .catch(e => console.log(e))

router.route("/newAdd")
    .get((req, res) => {
        res.render("./news/newsAdd", { menus })
    })
    .post((req, res) => {
        let { name, image } = req.body;
        let description = req.body.editor1;
        let slugNew = slug(name, { lower: true });
        let newNew = { name, slugNew, image, description };
        New.create(newNew)
            .then(() => res.redirect("/news"))
            .catch(e => res.redirect("back"))
    });

router.route("/news")
    .get((req, res) => {
        New.find()
            .then(news => res.render("./news/menuNews", { menus, news }))
            .catch(e => console.log(e))
    });

router.route("/news/:slugNew")
    .get((req, res) => {
        let slugNew = req.params.slugNew;
        New.findOne({ slugNew })
            .then(news => res.render("./news/newsDetail", { menus, news }))
            .catch(e => console.log(e))
    });


router.route("/news/:id/edit")
    .get((req, res) => {
        let idNews = req.params.id;
        New.findById(idNews)
            .then(news => res.render("./news/newsEdit", { menus, news }))
            .catch(e => console.log(e))
    })

router.route("/news/:id")
    .put((req, res) => {
        let { name, image } = req.body;
        let description = req.body.editor1;
        let idNews = req.params.id;
        let newNews = { name, image, description };
        New.findByIdAndUpdate(idNews, newNews)
            .then((news) => res.redirect("/news/" + news.slugNew))
            .catch(e => res.redirect("/"))
    })
    .delete((req, res) => {
        let idNews = req.params.id;
        New.findByIdAndRemove(idNews)
            .then(() => res.redirect("/news"))
            .catch(e => res.redirect("/news"))
    });

module.exports = router;
