const details = () => ({
  id: 'Tdarr_Plugin_H264_8bit_AAC',
  Stage: 'Pre-processing',
  Name:
      'Custom h264 8Bit - AAC Audio - MKV Container',
  Type: 'Video',
  Operation: 'Transcode',
  Description: '[Contains built-in filter] This plugin transcodes into 8Bit H264 using FFMpeg '
    + 'if the file is not in H264 already. It maintains all subtitles. It removes metadata (if a title exists), '
    + `and turns audio to AAC. The output container is MKV. \n\n`,
  Version: '1.00',
  Tags: 'pre-processing,ffmpeg,h264',
  Inputs: [],
});

// eslint-disable-next-line
// eslint-disable-next-line no-unused-vars
const plugin = (file, librarySettings, inputs, otherArguments) => {
  const lib = require('../methods/lib')();
  // eslint-disable-next-line no-unused-vars,no-param-reassign
  inputs = lib.loadDefaultValues(inputs, details);
  // Must return this object

  let encodeMethod = "libx264"

  if (otherArguments['nodeHardwareType'] == "nvenc") {
    encodeMethod = "h264_nvenc"
  }

  const response = {
    processFile: false,
    preset: '',
    container: '.mkv',
    handBrakeMode: false,
    FFmpegMode: false,
    reQueueAfter: false,
    infoLog: '',
  };

  if (file.fileMedium !== 'video') {
    // eslint-disable-next-line no-console
    console.log('File is not video');

    response.infoLog += '☒File is not video \n';
    response.processFile = false;

    return response;
  }
  const jsonString = JSON.stringify(file);

  if (file.ffProbeData.streams[0].codec_name !== 'h264') {
    response.infoLog += '☒File is not in h264! \n';
    response.preset = '<io> -map_metadata -1 -map 0:v -map 0:s? '
    + '-map 0:a -c:v ' + encodeMethod + ' -crf 18 -vf format=yuv420p -c:a aac -c:s copy';
    response.reQueueAfter = true;
    response.processFile = true;
    response.FFmpegMode = true;
    return response;
  }
  response.infoLog += '☑File is already in h264! \n';

  if (file.ffProbeData.streams[0].profile === 'High 10') {
    response.infoLog += '☒File is not in a suitable profile! (' + file.ffProbeData.streams[0].profile + ') \n';
    response.preset = '<io> -map_metadata -1 -map 0:v -map 0:s? '
    + '-map 0:a -c:v ' + encodeMethod + ' -crf 18 -vf format=yuv420p -c:a aac -c:s copy';
    response.reQueueAfter = true;
    response.processFile = true;
    response.FFmpegMode = true;
    return response;
  }
  response.infoLog += '☑File is already in a suitable Profile! \n';

  if (file.meta.Title !== undefined) {
    response.infoLog += '☒File has title metadata \n';
    response.preset = ', -map_metadata -1 -map 0:v -map 0:s? -map 0:a -c:v copy -c:a copy -c:s copy';
    response.reQueueAfter = true;
    response.processFile = true;
    response.FFmpegMode = true;
    return response;
  }
  response.infoLog += '☑File has no title metadata \n';

  if (!jsonString.includes('aac')) {
    response.infoLog += '☒File has no aac track \n';
    response.preset = ', -map 0:v -map 0:s? -map 0:a -c:v copy -c:a aac -c:s copy';
    response.reQueueAfter = true;
    response.processFile = true;
    response.FFmpegMode = true;
    return response;
  }
  response.infoLog += '☑File has aac track \n';

  if (file.container !== "mkv") {
    response.infoLog += '☒File is not in mkv container \n';
    response.preset = ', -codec copy';
    response.reQueueAfter = true;
    response.processFile = true;
    response.FFmpegMode = true;
    return response;
  }
  response.infoLog += '☑File is in mkv container \n';

  response.infoLog += '☑File meets conditions! \n';
  return response;
};

module.exports.details = details;
module.exports.plugin = plugin;
