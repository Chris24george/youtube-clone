import express from "express";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf-8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received');
    }
  }
  catch (error) {
    console.error(error);
    return res.status(400).send('Bad Request: missing file name.');
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  // Download raw video from cloud storage
  await downloadRawVideo(inputFileName);

  // Convert the video to 360p
  try {
    await convertVideo(inputFileName, outputFileName);
  }
  catch (error) {
    // local cleanup if we fail to convert
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ])
    console.error('Error during video conversion:', error);
    return res.status(500).send('Internal service error: video processing failed');
  }

  // Upload the processed video to cloud storage
  await uploadProcessedVideo(outputFileName);

  // local cleanup after upload
  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ])

  return res.status(200).send('Processing finished successfully');

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`video service listening at localhost:${port}`);
});