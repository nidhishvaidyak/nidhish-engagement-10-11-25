const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const videoDir = path.join(__dirname, "videos");

const inputExt = [".mpg", ".mpeg", ".mov", ".avi", ".mkv"];
const TARGET_SECONDS = 80; // ≈ 80–90MB depending on bitrate

function convertAndSplitVideos() {
    const files = fs.readdirSync(videoDir);

    files.forEach((file) => {
        const ext = path.extname(file).toLowerCase();
        if (!inputExt.includes(ext)) return;

        const baseName = path.basename(file, ext);
        const inputPath = path.join(videoDir, file);
        const outputPattern = path.join(
            videoDir,
            `${baseName}_part%03d.mp4`
        );

        console.log(`🎬 Converting & splitting: ${file}`);

        const cmd = `ffmpeg -y -i "${inputPath}" -c:v libx264 -profile:v high -level 4.2 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -map 0 -f segment -segment_time ${TARGET_SECONDS} -reset_timestamps 1 "${outputPattern}"`;

        try {
            execSync(cmd, { stdio: "inherit" });
            console.log(`✅ Done: ${baseName}_partXXX.mp4`);
        } catch (err) {
            console.error(`❌ Failed: ${file}`);
        }
    });
}

convertAndSplitVideos();
