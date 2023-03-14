import dbConfig from "../config/db.js";
import { MongoClient, GridFSBucket } from "mongodb";
import User from "../model/user.js";

const url = dbConfig.url;

const baseUrl = "http://localhost:4000/files/";

const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res) => {
  if (req.file == undefined) {
    req.flash("error", "You must select a file.");
    return res.redirect(`/profile/${req.user._id}`);
  }
  const user = await User.findById(req.user._id);

  const database = mongoClient.db(dbConfig.database);
  const chunks = database.collection(dbConfig.imgBucket + ".chunks");
  const images = database.collection(dbConfig.imgBucket + ".files");

  const file = await images.findOne({ filename: user.avatar });
  if (file) {
    await chunks.deleteMany({ files_id: file._id });
  }
  await images.findOneAndDelete({ filename: user.avatar });
  user.avatar = req.file.filename;
  await user.save();

  req.flash("success", "Profile photo has been uploaded.");
  return res.redirect(`/profile/${req.user._id}`);
};

const getListFiles = async (req, res) => {
  await mongoClient.connect();

  const database = mongoClient.db(dbConfig.database);
  const images = database.collection(dbConfig.imgBucket + ".files");

  const cursor = images.find({});

  if ((await cursor.count()) === 0) {
    return res.status(500).send({
      message: "No files found!",
    });
  }

  let fileInfos = [];
  await cursor.forEach((doc) => {
    fileInfos.push({
      name: doc.filename,
      url: baseUrl + doc.filename,
    });
  });

  res.status(200).send(fileInfos);
};

const download = async (req, res) => {
  await mongoClient.connect();

  const database = mongoClient.db(dbConfig.database);
  const bucket = new GridFSBucket(database, {
    bucketName: dbConfig.imgBucket,
  });

  let downloadStream = bucket.openDownloadStreamByName(req.params.name);

  downloadStream.on("data", function (data) {
    return res.status(200).write(data);
  });

  downloadStream.on("error", function (err) {
    return res.status(404).send({ message: "Cannot download the Image!" });
  });

  downloadStream.on("end", () => {
    return res.end();
  });
};

export default { uploadFiles, getListFiles, download };
