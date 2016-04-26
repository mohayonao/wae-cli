# wae-cli
[![NPM Version](http://img.shields.io/npm/v/wae-cli.svg?style=flat-square)](https://www.npmjs.org/package/wae-cli)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> [`web-audio-engine`](https://github.com/mohayonao/web-audio-engine) command line

## Installation

```sh
$ npm install -g wae-cli
```

## Usage

You can write a code using the Web Audio API via `context`.

```js
// coin.js

const osc = context.createOscillator();
const amp = context.createGain();

osc.type = "square";
osc.frequency.setValueAtTime(987.7666, 0);
osc.frequency.setValueAtTime(1318.5102, 0.075);
osc.start(0);
osc.stop(2);
osc.connect(amp);

amp.gain.setValueAtTime(0.25, 0);
amp.gain.setValueAtTime(0.25, 0.075);
amp.gain.linearRampToValueAtTime(0, 2);
amp.connect(context.destination);
```

simplest playback (using [`node-speaker`](https://github.com/TooTallNate/node-speaker))

```sh
$ wae coin.js
```

playback using [ALSA](http://alsa.opensrc.org/Aplay) `aplay` via `stdout`

```sh
$ wae coin.js -o stdout | aplay -f cd
```

playback using [SoX](http://sox.sourceforge.net/) `play` via `stdout`

```sh
$ wae coin.js -o stdout | play -t s16 -r 44100 -c 2 -
```

render to an audio file

```sh
$ wae coin.js -o coin.wav
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

#### asynchronous code

```js
const fs = require("fs");

module.exports = (context) => {
  const buffer = fs.readFileSync("coin.wav");

  return context.decodeAudioData(buffer).then((audioBuffer) => {
    const bufSrc = context.createBufferSource();

    bufSrc.buffer = audioBuffer;
    bufSrc.start(0);

    bufSrc.connect(context.destination);
  });
};
```


## License
MIT
