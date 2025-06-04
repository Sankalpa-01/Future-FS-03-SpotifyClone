import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
import {
  addSong,
  addThumbnail,
  createAlbum,
  deleteSong,
  getAllAlbums,
  getAllSongs,
  getAllSongsByAlbum,
  getSingleSong,
} from "../controllers/songControllers.js";

const router = express.Router();

router.post("/album/new", isAuth, uploadFile, createAlbum);
router.get("/album/all", isAuth, getAllAlbums);
router.get("/album/:id", isAuth, getAllSongsByAlbum); // <-- move this up

router.get("/single/:id", isAuth, getSingleSong);
router.delete("/:id", isAuth, deleteSong);
router.post("/new", isAuth, uploadFile, addSong);
router.patch("/thumbnail/:id", isAuth, uploadFile, addThumbnail);
 // <-- keep general :id routes last
router.get("/all", isAuth, getAllSongs);

export default router;