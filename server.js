//npm install
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.listen(3000, () => console.log("App escuchando en el puerto 3000!"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://mainor:pAssw0rd2606@maincluster.ujttw.mongodb.net/?retryWrites=true&w=majority"
  )
  .catch((error) => handleError(error));

const videoSchema = new mongoose.Schema(
  {
    video_titulo: String,
    video_descripcion:String,
    duracion: Number,
    autor: String,
    enlace: String,
    fecha: { type: Date, default: Date.Now },
  },
  {
    collection: "videos",
  }
);

const Video = mongoose.model("Video", videoSchema);

// POST /api/videos – agregar un nuevo video

app.post("/api/videos", function (req, res) {
  const video1 = new Video({
    video_titulo: req.body.titulo,
    video_descripcion:req.body.descripcion,
    duracion: req.body.duracion,
    autor: req.body.autor,
    enlace: req.body.enlace,
    fecha: new Date(1983, 05, 10),
  });

  video1.save(function (error, video1) {
    if (error) {
      res.status(500).send("No se ha podido agregar el video.");
    } else {
      res.status(200).json(video1);
    }
  });
});

// GET /api/videos – muestra todos los videos

app.get("/api/videos", (req, res) => {
  Video.find((err, videos) => {
    if (err) res.status(500).send("Error en la base de datos");
    else res.status(200).json(videos);
  });
});


// GET /api/videos/:id - muestra un video por id

app.get("/api/videos/:id", function (req, res) {
  Video.findById(req.params.id, function (err, video) {
    if (err) res.status(500).send("Error en la base de datos");
    else {
      if (video != null) {
        res.status(200).json(video);
      } else res.status(404).send("No se encontro ese video en la base de datos.");
    }
  });
});

// GET /api/videos?autor={autor del video} - muestra todos los videos de un autor

app.get("/api/videos/autor", function (req, res) {
  Video.findById(req.params.autor, function (err, video) {
    if (err) res.status(500).send("Error en la base de datos");
    else {
      if (video != null) {
        res.status(200).json(video);
      } else res.status(404).send("No se encontro ese video del autor en la base de datos.");
    }
  });
});

// GET /api/videos?fechadesde={fecha1}&fechahasta={fecha2} – muestra todos los videos agregados en un rango de fechas

app.get("/api/videos/fechadesde", function (req, res) {
  Video.find({ fecha: { $gt: req.query.fecha, $lt: req.query.fecha} }, function (err, videos) {
    if (err) {
      console.log(err);
      res.status(500).send("Error al leer de la base de datos");
    } else res.status(200).json(videos);
  });
});

// DELETE /api/videos/:id – elimina un video por id

app.delete("/api/videos/:id", function (req, res) {
  Video.findById(req.params.id, function (err, video) {
    if (err) res.status(500).send("Error en la base de datos");
    else {
      if (video != null) {
        video.remove(function (error, resultado) {
          if (error) res.status(500).send("Error en la base de datos");
          else {
            res.status(200).send("Video eliminado exitosamente");
          }
        });
      } else res.status(404).send("No se encontro ese video en la base de datos");
    }
  });
});






