const express = require("express"),
    router = express.Router(),
    Menu = require("../models/menuModel"),
    New = require("../models/newModel"),
    getMenu = require("./menuRoute"),
    slug = require("slug");



router.route("/newAdd")
    .get(async (req, res) => {
        let menus = await getMenu();
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
        Promise.all([Menu.find().then(), New.find().then()])
            .then(data => {
                res.render("./news/menuNews", { menus: data[0], news: data[1] });
            });
        // let menus = await getMenu();
        // New.find()
        //     .then(news => res.render("./news/menuNews", { menus, news }))
        //     .catch(e => console.log(e))
    });

router.route("/news/:slugNew")
    .get(async (req, res) => {
        let menus = await getMenu();
        let slugNew = req.params.slugNew;
        New.findOne({ slugNew })
            .then(news => res.render("./news/newsDetail", { menus, news }))
            .catch(e => console.log(e))
    });


router.route("/news/:id/edit")
    .get(async (req, res) => {
        let menus = await getMenu();
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
