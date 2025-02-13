"use strict";

const has = Object.prototype.hasOwnProperty;
const undef = undefined;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input: string) {
	try {
		return decodeURIComponent(input.replace(/\+/g, " "));
	} catch (e) {
		return null;
	}
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
export function parse(query: string | null) {
	if (!query) {
		return {};
	}
	const parser = /([^=?&]+)=?([^&]*)/g;
	const result: any = {};
	let part;

	while ((part = parser.exec(query))) {
		const key = decode(part[1]),
			value = decode(part[2]);

		//
		// Prevent overriding of existing properties. This ensures that build-in
		// methods like `toString` or __proto__ are not overriden by malicious
		// querystrings.
		//
		// In the case if failed decoding, we want to omit the key/value pairs
		// from the result.
		//
		if (key === null || value === null || key in result) {
			continue;
		}
		result[key] = value;
	}

	return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
export function querystringify(obj: any, prefix?: string) {
	prefix = prefix || "";

	const pairs: string[] = [];
	let value: string, key: string;

	//
	// Optionally prefix with a '?' if needed
	//
	if ("string" !== typeof prefix) {
		prefix = "?";
	}

	for (key in obj) {
		if (has.call(obj, key)) {
			value = obj[key];

			//
			// Edge cases where we actually want to encode the value to an empty
			// string instead of the stringified value.
			//
			if (!value && (value === null || value === undef || isNaN(Number(value)))) {
				value = "";
			}

			key = encodeURIComponent(key);
			value = encodeURIComponent(value);

			//
			// If we failed to encode the strings, we should bail out as we don't
			// want to add invalid strings to the query.
			//
			if (key === null || value === null) {
				continue;
			}
			pairs.push(`${key}=${value}`);
		}
	}

	return pairs.length ? prefix + pairs.join("&") : "";
}

//
// Expose the module.
//
export default {
	stringify: querystringify,
	parse: parse
};
