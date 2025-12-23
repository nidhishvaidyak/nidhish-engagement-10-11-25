const fs = require("fs");
const path = require("path");

const imageDir = path.join(__dirname, "photos");
const videoDir = path.join(__dirname, "videos");

const imageExt = [".jpg", ".jpeg", ".png", ".webp"];
const videoExt = [".mp4", ".webm", ".mov"];

function renameAndCollectImages() {
  const files = fs.readdirSync(imageDir)
    .filter(f => imageExt.includes(path.extname(f).toLowerCase()))
    .sort();

  const renamedFiles = [];

  files.forEach((file, index) => {
    const ext = path.extname(file);
    const newName = `photo_${String(index + 1).padStart(4, "0")}${ext}`;

    const oldPath = path.join(imageDir, file);
    const newPath = path.join(imageDir, newName);

    if (file !== newName) {
      fs.renameSync(oldPath, newPath);
    }

    renamedFiles.push(newName);
  });

  return renamedFiles;
}

function collectVideos() {
  return fs.readdirSync(videoDir)
    .filter(f => videoExt.includes(path.extname(f).toLowerCase()))
    .sort();
}

const media = {
  images: renameAndCollectImages(),
  videos: collectVideos()
};

fs.writeFileSync("media.json", JSON.stringify(media, null, 2));

console.log("✅ Images renamed & media.json generated successfully");
