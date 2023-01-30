/* eslint-disable */
const details = () => {
  return {
    id: "Tdarr_Plugin_JoeAudioOnly",
    Stage: "Pre-processing",
    Name: "Transcode Specific Audio Stream Codecs",
    Type: "Audio",
    Operation: "Transcode",
    Description: `[Contains built-in filter] Transcode audio streams with specific codecs into another codec.  \n\n`,
    Version: "1.00",
    Tags: "pre-processing,audio only,ffmpeg,configurable",
    Inputs: [
      {
        name: "codec",
        type: 'string',
        defaultValue: 'aac',
        inputUI: {
          type: 'text',
        },
        tooltip: `Specify the codec you'd like to transcode into:
        \\n aac
        \\n ac3
        \\n eac3
        \\n dts
        \\n flac
        \\n mp2
        \\n mp3
        \\n truehd
        \\nExample:\\n
        eac3
 
        `,
      },
      {
        name: "bitrate",
        type: 'string',
        defaultValue: '',
        inputUI: {
          type: 'text',
        },
        tooltip: `Specify the transcoded audio bitrate (optional):
        \\n 384k
        \\n 640k
        \\nExample:\\n
        640k
 
        `,
      },
    ],
  };
};

// eslint-disable-next-line no-unused-vars
const plugin = (file, librarySettings, inputs, otherArguments) => {
    
    const lib = require('../methods/lib')();
  // eslint-disable-next-line no-unused-vars,no-param-reassign
  inputs = lib.loadDefaultValues(inputs, details);
  //Must return this object

  var response = {
    processFile: false,
    preset: "",
    container: `.${file.container}`,
    handBrakeMode: false,
    FFmpegMode: false,
    reQueueAfter: false,
    infoLog: "",
  };

  if (inputs.codec === undefined ) {
    response.processFile = false;
    response.infoLog += "☒ Input not entered! \n";
    return response;
  }

  var encoder = inputs.codec.toLowerCase();

  if (encoder == "mp3") {
    encoder = `libmp3lame`;
  } else if (encoder == "dts") {
    encoder = `dca`;
  }

  var hasStreamsToTranscode = false;

  var ffmpegCommand = `, -c copy  -map 0:v `;

  for (var i = 0; i < file.ffProbeData.streams.length; i++) {
    if (
      file.ffProbeData.streams[i].codec_type.toLowerCase() == "audio" &&
      file.ffProbeData.streams[i].codec_name &&
      encoder != file.ffProbeData.streams[i].codec_name.toLowerCase()
    ) {
      ffmpegCommand += `  -map 0:${i} -c:${i} ${encoder} `;
      if (inputs.bitrate !== '') {
        ffmpegCommand += `-b:a ${inputs.bitrate} `;
      }
      hasStreamsToTranscode = true;
    } else if (file.ffProbeData.streams[i].codec_type.toLowerCase() == "audio") {
      ffmpegCommand += `  -map 0:${i}`;
    }
  }

  ffmpegCommand += ` -map 0:s? -map 0:d? -max_muxing_queue_size 9999`;

  if (hasStreamsToTranscode == false) {
    response.processFile = false;
    response.infoLog +=
      "☑ File does not have any streams that need to be transcoded! \n";
    return response;
  } else {
    response.processFile = true;
    response.preset = ffmpegCommand;
    response.container = "." + file.container;
    response.handBrakeMode = false;
    response.FFmpegMode = true;
    response.reQueueAfter = true;
    response.infoLog += `☒ File has streams which aren't in desired codec! \n`;
    return response;
  }
};


module.exports.details = details;
module.exports.plugin = plugin;