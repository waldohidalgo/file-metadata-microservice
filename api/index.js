import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import { promises as fs } from "fs";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use("/public", express.static(path.resolve("public")));

app.get("/", function (req, res) {
  res.sendFile(path.resolve("api", "views", "index.html"));
});

app.post("/api/fileanalyse", upload.single("upfile"), function (req, res) {
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});

setInterval(async () => {
  const carpeta = path.resolve("uploads");
  try {
    const archivos = await fs.readdir(carpeta);
    if (archivos.length > 0) {
      for (const archivo of archivos) {
        const rutaArchivo = path.join(carpeta, archivo);
        await fs.unlink(rutaArchivo);
      }
      console.log("Data reseteada con exito");
    }
  } catch (error) {
    console.log("Error al resetear la data");
  }
}, 900000);
