/**
 * Render defaults for 1080x1920 social video.
 * CLI flags override these. All options: https://remotion.dev/docs/config
 */
import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
Config.setAudioBitrate("192k");

// Use a preinstalled Chrome Headless Shell when Remotion cannot download its own
// (e.g. sandboxed/cloud machines): export REMOTION_BROWSER=/path/to/chrome-headless-shell
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
