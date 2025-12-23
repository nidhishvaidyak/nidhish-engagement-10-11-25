const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const videoDir = path.join(__dirname, "videos");

const inputExt = [".mpg", ".mpeg", ".mov", ".avi", ".mkv"];
const outputExt = ".mp4";

function convertVideos() {
  const files = fs.readdirSync(videoDir);

  files.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    if (!inputExt.includes(ext)) return;

    const inputPath = path.join(videoDir, file);
    const outputPath = path.join(
      videoDir,
      path.basename(file, ext) + outputExt
    );

    if (fs.existsSync(outputPath)) {
      console.log(`⏭️ Skipping (already exists): ${outputPath}`);
      return;
    }

    console.log(`🎬 Converting ${file} → ${path.basename(outputPath)}`);

    // 🔥 SINGLE-LINE FFmpeg COMMAND (VERY IMPORTANT)
    const cmd = `ffmpeg -y -i "${inputPath}" -c:v libx264 -profile:v high -level 4.2 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k "${outputPath}"`;

    try {
      execSync(cmd, { stdio: "inherit" });
      console.log(`✅ Converted: ${outputPath}`);
    } catch (err) {
      console.error(`❌ Failed: ${file}`);
    }
  });
}

convertVideos();
