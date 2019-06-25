'use strict';

const os = require("os");
const fs = require('fs');
const path = require('path');
const fileType = require('file-type');
const globby = require('globby');
const makeDir = require('make-dir');
const pify = require('pify');
const pPipe = require('p-pipe');
const replaceExt = require('replace-ext');
const Bluebird = require('bluebird');

const fsP = pify(fs);
const cpus = os.cpus().length;

const handleFile = (input, output, opts) => fsP.readFile(input).then(data => {
	let dest = output ? path.join(output, path.basename(input)) : input;

	if (opts.replaceOutputDir) {
		if (typeof opts.replaceOutputDir === 'function') {
			dest = opts.replaceOutputDir.call(null, dest);
		} else {
			throw new TypeError('The replaceOutputDir option should be an `Function`');
		}
	}

	if (opts.plugins && !Array.isArray(opts.plugins)) {
		throw new TypeError('The plugins option should be an `Array`');
	}

	const pipe = opts.plugins.length > 0 ? pPipe(opts.plugins)(data) : Promise.resolve(data);

	return pipe
		.then(buf => {
			buf = buf.length < data.length ? buf : data;

			const ret = {
				data: buf,
				path: (fileType(buf) && fileType(buf).ext === 'webp') ? replaceExt(dest, '.webp') : dest
			};

			if (!dest) {
				return ret;
			}

			return makeDir(path.dirname(ret.path))
				.then(() => fsP.writeFile(ret.path, ret.data))
				.then(() => ret);
		})
		.catch(err => {
			err.message = `Error in file: ${input}\n\n${err.message}`;
			throw err;
		});
});


module.exports = (input, output, opts) => {
	if (!Array.isArray(input)) {
		return Promise.reject(new TypeError(`Expected an \`Array\`, got \`${typeof input}\``));
	}

	if (typeof output === 'object') {
		opts = output;
		output = null;
	}

	opts = Object.assign({
		plugins: [],
		skipExtensions: []
	}, opts);
	opts.plugins = opts.use || opts.plugins;

	const se = opts.skipExtensions;
	const shouldSkipFile = (path) => Array.isArray(se) && se.reduce((a, v) => a || path.endsWith(`.${v}`), false);
	return globby(input, {onlyFiles: true}).then(paths => Bluebird.map(paths, (x => {
		if (shouldSkipFile(x)) {
			return;
		}
		return handleFile(x, output, opts)
	}), {
		concurrency: opts.concurrency || cpus
	}));
};

module.exports.buffer = (input, opts) => {
	if (!Buffer.isBuffer(input)) {
		return Promise.reject(new TypeError(`Expected a \`Buffer\`, got \`${typeof input}\``));
	}

	opts = Object.assign({plugins: []}, opts);
	opts.plugins = opts.use || opts.plugins;

	if (opts.plugins.length === 0) {
		return Promise.resolve(input);
	}

	return pPipe(opts.plugins)(input).then(buf => (buf.length < input.length ? buf : input));
};
