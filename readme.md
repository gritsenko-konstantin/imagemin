# imagemin-concurrent-skip-preserve

> Minify images seamlessly


## Install

```
$ npm install imagemin-concurrent-skip-preserve
```


## Usage

```js
const imagemin = require('imagemin-concurrent-skip-preserve');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

(async () => {
	const files = await imagemin(['images/*.{jpg,png}'], 'build/images', {
		plugins: [
			imageminJpegtran(),
			imageminPngquant({quality: '65-80'})
		]
	});

	console.log(files);
	//=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
})();
```

```js
// keep folder structure as input
const imagemin = require('imagemin-concurrent-skip-preserve');

imagemin(['images/**/*.{jpg,png}'], {
  
});
// for example
// images/a.jpg => images/a.jpg
// images/foo/a.jpg => images/foo/a.jpg
// images/foo/bar/a.jpg => images/foo/bar/a.jpg
```

```js
// keep folder structure as input use imagemin-webp
const imagemin = require('imagemin-concurrent-skip-preserve');
const imageminWebp = require("imagemin-webp");

imagemin(['images/**/*.{jpg,png}'], {
  use: [
    imageminWebp({})
  ]
});
// for example
// images/a.jpg => images/a.webp
// images/foo/a.jpg => images/foo/a.webp
// images/foo/bar/a.jpg => images/foo/bar/a.webp
```

```js
// customize folder structure as input use imagemin-webp
const imagemin = require('imagemin-concurrent-skip-preserve');
const imageminWebp = require("imagemin-webp");

imagemin(['images/**/*.{jpg,png}'], {
  use: [
    imageminWebp({})
  ],
  replaceOutputDir: output => {
    return output.replace(/images\//, '.webp/')
  }
});
// for example
// images/a.jpg => .webp/a.webp
// images/foo/a.jpg => .webp/foo/a.webp
// images/foo/bar/a.jpg => .webp/foo/bar/a.webp
```

```js
// Limit concurrency of minimizers
const imagemin = require('imagemin-concurrent-skip-preserve');
const imageminWebp = require("imagemin-webp");

imagemin(['images/**/*.{jpg,png}'], {
  use: [
    imageminWebp({})
  ],
  concurrency: 16, // default limit: number of CPUs
  replaceOutputDir: output => {
    return output.replace(/images\//, '.webp/')
  }
});
```

```js
// Skip files by extension
const imagemin = require('imagemin-concurrent-skip-preserve');
const imageminWebp = require("imagemin-webp");

imagemin(['images/**/*.{jpg,png}'], {
  use: [
    imageminWebp({})
  ],
  skipExtensions: ['webp', 'jpeg'],
  replaceOutputDir: output => {
    return output.replace(/images\//, '.webp/')
  }
});
```

## API

### imagemin(input, [output], [options])

Returns `Promise<Object[]>` in the format `{data: Buffer, path: String}`.

#### input

Type: `string[]`

Files to be optimized. See supported `minimatch` [patterns](https://github.com/isaacs/minimatch#usage).

#### output

Type: `string`

Set the destination folder to where your files will be written. If no destination is specified no files will be written.

#### options

Type: `Object`

##### plugins

Type: `Array`

[Plugins](https://www.npmjs.com/browse/keyword/imageminplugin) to use.

### imagemin.buffer(buffer, [options])

Returns `Promise<Buffer>`.

#### buffer

Type: `Buffer`

Buffer to optimize.

#### options

Type: `Object`

##### plugins

Type: `Array`

[Plugins](https://www.npmjs.com/browse/keyword/imageminplugin) to use.

## License

MIT © [imagemin](https://github.com/imagemin)
