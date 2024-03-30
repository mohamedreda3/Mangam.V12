const express = require("express");
const Router = express.Router();
const Infos = require("../controllers/info");
const infos = new Infos;
const SocialMedia = require("../controllers/social_media");
const socialMedia = new SocialMedia;

Router.get("/info/getAll", (req, res) => infos.getAll(req, res));
Router.post("/info/edit", (req, res) => infos.edit_info(req, res));
Router.get("/info/stats", (req, res) => infos.stats(req, res));
Router.post("/social_media/add", (req, res) => socialMedia.add_socialMedia(req, res));
Router.post("/social_media/edit", (req, res) => socialMedia.edit_socialMedia(req, res));
Router.post("/social_media/getAll", (req, res) => socialMedia.getAll(req, res));
Router.post("/social_media/updateHidden", (req, res) => socialMedia.updateHidden(req, res));

module.exports = Router;