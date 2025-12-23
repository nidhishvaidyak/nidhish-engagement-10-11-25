const fs = require("fs");
const path = require("path");

const imageDir = path.join(__dirname, "photos");
const candidDir = path.join(__dirname, "candid");
const videoDir = path.join(__dirname, "videos");

const imageExt = [".jpg", ".jpeg", ".png", ".webp"];
const videoExt = [".mp4", ".webm", ".mov",".mpg"];

/* ========= GENERIC RENAME FUNCTION ========= */
function renameAndCollect(dir, prefix, allowedExt) {
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter(f => allowedExt.includes(path.extname(f).toLowerCase()))
    .sort();

  const renamedFiles = [];

  files.forEach((file, index) => {
    const ext = path.extname(file);
    const newName = `${prefix}_${String(index + 1).padStart(4, "0")}${ext}`;

    const oldPath = path.join(dir, file);
    const newPath = path.join(dir, newName);

    if (file !== newName) {
      fs.renameSync(oldPath, newPath);
    }

    renamedFiles.push(newName);
  });

  return renamedFiles;
}

/* ========= VIDEO COLLECT ========= */
function collectVideos(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter(f => videoExt.includes(path.extname(f).toLowerCase()))
    .sort();
}

/* ========= BUILD MEDIA.JSON ========= */
const media = {
  images: renameAndCollect(imageDir, "photo", imageExt),
  candid: renameAndCollect(candidDir, "candid", imageExt),
  videos: collectVideos(videoDir),
};

fs.writeFileSync(
  path.join(__dirname, "media.json"),
  JSON.stringify(media, null, 2)
);

console.log("✅ Photos, Candid images renamed & media.json generated successfully");
