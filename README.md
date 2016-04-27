# wae-cli
[![NPM Version](http://img.shields.io/npm/v/wae-cli.svg?style=flat-square)](https://www.npmjs.org/package/wae-cli)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> [`web-audio-engine`](https://github.com/mohayonao/web-audio-engine) command line

## Installation

```sh
$ npm install -g wae-cli
```

## Usage

You can write a code using the Web Audio API via `audioContext`.

```js
// coin.js
const osc = audioContext.createOscillator();
const amp = audioContext.createGain();

osc.type = "square";
osc.frequency.setValueAtTime(987.7666, 0);
osc.frequency.setValueAtTime(1318.5102, 0.075);
osc.start(0);
osc.stop(2);
osc.connect(amp);
osc.onended = () => {
  process.exit();
};

amp.gain.setValueAtTime(0.25, 0);
amp.gain.setValueAtTime(0.25, 0.075);
amp.gain.linearRampToValueAtTime(0, 2);
amp.connect(audioContext.destination);
```

simplest playback (using [`node-speaker`](https://github.com/TooTallNate/node-speaker))

```sh
$ wae coin
```

playback using [ALSA](http://alsa.opensrc.org/Aplay) `aplay` via `stdout`

```sh
$ wae coin -o stdout | aplay -f cd
```

playback using [SoX](http://sox.sourceforge.net/) `play` via `stdout`

```sh
$ wae coin -o stdout | play -t s16 -r 44100 -c 2 -
```

render to an audio file

```sh
$ wae coin -o coin.wav
```

other options

```
$ wae --help
wae [option] script-name [args]

  -h, --help             display help
  -v, --version          display version
  -t, --type String      file type of audio - default: s16
  -r, --rate Number      samplerate of audio - default: 44100
  -c, --channels Number  number of channels of audio: e.g. 2 = stereo - default: 2
  -d, --duration Number  number of duration for rendering
  -o, --out String       write output to <file> - default: speaker
  -V, --verbose          run in verbose mode - default: false

AUDIO FILE FORMAT: s16 s32 u8 raw cd
```

#### provide arguments
You can provide arguments from command line using node module style function. The arguments are parsed as JSON.

```js
// beep.js
module.exports = (audioContext, frequency, duration) => {
  const osc = audioContext.createOscillator();
  const amp = audioContext.createGain();

  osc.frequency.value = frequency;
  osc.start(0);
  osc.stop(duration);
  osc.connect(amp);

  amp.gain.setValueAtTime(0.5, 0);
  amp.gain.linearRampToValueAtTime(0, duration);
  amp.connect(audioContext.destination);
};
```

```sh
$ wae beep -- 1760 0.5
```

#### asynchronous code
You can run asynchronous code using `Promise`.

```js
const fs = require("fs");

module.exports = (audioContext) => {
  const buffer = fs.readFileSync("coin.wav");

  return audioContext.decodeAudioData(buffer).then((audioBuffer) => {
    const bufSrc = audioContext.createBufferSource();

    bufSrc.buffer = audioBuffer;
    bufSrc.start(0);

    bufSrc.connect(audioContext.destination);
  });
};
```

## License
MIT
