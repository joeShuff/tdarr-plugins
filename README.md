# Custom Tdarr Plugins I made

## Tdarr_Plugin_JoeAudioOnly
`id` -> Tdarr_Plugin_JoeAudioOnly

I use this plugin to convert all audio tracks to the codec I specify. I use `aac`

It is based off of another plugin but I can't remember which off the top of my head. If I remember I'll pop the name of the original here.

This plugin changes ONLY the audio tracks, maintains all video/subtitle streams.

## Tdarr_Plugin_JoeCustomVideo
`id` -> Tdarr_Plugin_JoeCustomVideo

This plugin transcodes ONLY VIDEO if one of the conditions isn't true:
- File isn't h.264
- File isn't 8bit
- File isn't mkv container (only remuxed if this is the only change)

It maintains all audio/subtitle tracks.

It can also use your nvidia GPU to encode if you set the node up correctly.

In the node, make sure you specify that the hardware encoding type for GPU workers is `nvenc`
![Screenshot showing correct NVIDIA node setting](art/nvenc_node.png)

This will then make sure the command that is run can run on the GPU. If you select `any` in here, then the plugin will issues the `libx264` transcode option which is a CPU task so even if you have a GPU worker, it will run on the CPU.

## Tdarr_Plugin_H264_8bit_AAC (I no longer use this)

**I don't use this plugin any more, turns out it was removing metadata so I changed my setup**

This plugin converts the output file to the following
- 8bit H264 (High profile)
- AAC Audio tracks
- MKV container

It can also use your nvidia GPU to encode if you set the node up correctly.

In the node, make sure you specify that the hardware encoding type for GPU workers is `nvenc`
![Screenshot showing correct NVIDIA node setting](art/nvenc_node.png)

This will then make sure the command that is run can run on the GPU. If you select `any` in here, then the plugin will issues the `libx264` transcode option which is a CPU task so even if you have a GPU worker, it will run on the CPU.

### Intallation
Download the `Tdarr_Plugin_H264_8bit_AAC.js` file and add it to your server configs plugin folder.
for me its
`<config>/server/Tdarr/Plugins/local`

Just drop the file in there, and you should now have it as an option to add to a libraries transcode rules. May require a restart of tdarr. 
