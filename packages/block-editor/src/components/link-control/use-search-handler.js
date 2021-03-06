/**
 * WordPress dependencies
 */
import { getProtocol, prependHTTP } from '@wordpress/url';
import { useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import { startsWith } from 'lodash';

/**
 * Internal dependencies
 */
import isURLLike from './is-url-like';
import { CREATE_TYPE } from './constants';

export const handleNoop = () => Promise.resolve( [] );

export const handleDirectEntry = ( val ) => {
	let type = 'URL';

	const protocol = getProtocol( val ) || '';

	if ( protocol.includes( 'mailto' ) ) {
		type = 'mailto';
	}

	if ( protocol.includes( 'tel' ) ) {
		type = 'tel';
	}

	if ( startsWith( val, '#' ) ) {
		type = 'internal';
	}

	return Promise.resolve( [
		{
			id: val,
			title: val,
			url: type === 'URL' ? prependHTTP( val ) : val,
			type,
		},
	] );
};

export const handleEntitySearch = async (
	val,
	args,
	fetchSearchSuggestions,
	directEntryHandler
) => {
	let results = await Promise.all( [
		fetchSearchSuggestions( val, {
			...( args.isInitialSuggestions ? { perPage: 3 } : {} ),
		} ),
		directEntryHandler( val ),
	] );

	const couldBeURL = ! val.includes( ' ' );

	// If it's potentially a URL search then concat on a URL search suggestion
	// just for good measure. That way once the actual results run out we always
	// have a URL option to fallback on.
	results =
		couldBeURL && ! args.isInitialSuggestions
			? results[ 0 ].concat( results[ 1 ] )
			: results[ 0 ];

	// If displaying initial suggestions just return plain results.
	if ( args.isInitialSuggestions ) {
		return results;
	}

	// Here we append a faux suggestion to represent a "CREATE" option. This
	// is detected in the rendering of the search results and handled as a
	// special case. This is currently necessary because the suggestions
	// dropdown will only appear if there are valid suggestions and
	// therefore unless the create option is a suggestion it will not
	// display in scenarios where there are no results returned from the
	// API. In addition promoting CREATE to a first class suggestion affords
	// the a11y benefits afforded by `URLInput` to all suggestions (eg:
	// keyboard handling, ARIA roles...etc).
	//
	// Note also that the value of the `title` and `url` properties must correspond
	// to the text value of the `<input>`. This is because `title` is used
	// when creating the suggestion. Similarly `url` is used when using keyboard to select
	// the suggestion (the <form> `onSubmit` handler falls-back to `url`).
	return isURLLike( val )
		? results
		: results.concat( {
				// the `id` prop is intentionally ommitted here because it
				// is never exposed as part of the component's public API.
				// see: https://github.com/WordPress/gutenberg/pull/19775#discussion_r378931316.
				title: val, // must match the existing `<input>`s text value
				url: val, // must match the existing `<input>`s text value
				type: CREATE_TYPE,
		  } );
};

export default function useSearchHandler( allowDirectEntry ) {
	const { fetchSearchSuggestions } = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		return {
			fetchSearchSuggestions: getSettings()
				.__experimentalFetchLinkSuggestions,
		};
	}, [] );

	const directEntryHandler = allowDirectEntry
		? handleDirectEntry
		: handleNoop;

	return useCallback(
		( val, args ) => {
			return isURLLike( val )
				? directEntryHandler( val, args )
				: handleEntitySearch(
						val,
						args,
						fetchSearchSuggestions,
						directEntryHandler
				  );
		},
		[ directEntryHandler, fetchSearchSuggestions ]
	);
}
