import { AsyncUnzipInflate, unzip as unz, Unzip } from 'fflate';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createContainer } from 'unstated-next';

const useSpotifyData = (initialState = []) => {
	const [state, setState] = useState(initialState);
	const history = useHistory();
	const [isValid, setIsValid] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState(false);
	const [data, setData] = useState({ tracks: {} });
	const [errorMessage, setErrorMessage] = useState(false);

	const unzip = async arr => {
		const tracks = [];
		const files = [];
		const unzipper = new Unzip();
		unzipper.register(AsyncUnzipInflate);
		unzipper.onfile = f => {
			files.push(f);
		};

		unz(arr, { filter: f => f.name.endsWith('.json') }, (err, d) => {
			console.log('unzipped: ', d);
			setLoadingMessage('Reading files...');
			for (const file of Object.keys(d).filter(e =>
				e.includes('endsong_')
			)) {
				setLoadingMessage(`Reading ${file}...`);
				const obj = JSON.parse(Buffer.from(d[file]).toString('utf8'));
				tracks.push(...obj);
			}
			setLoadingMessage(`Loaded ${tracks.length} listens.`);
			setData({ tracks: tracks });
			setIsValid(true);
			history.push('/spotify/explore');
		});
	};

	const upload = file => {
		console.log(file);
		setLoadingMessage('Unpacking .zip file...');
		const fr = new FileReader();
		fr.onloadend = () => {
			unzip(new Uint8Array(fr.result));
		};
		fr.readAsArrayBuffer(file[0]);
	};

	return {
		state,
		upload,
		setState,
		isValid,
		loadingMessage,
		errorMessage,
		data,
	};
};

export const SpotifyData = createContainer(useSpotifyData);
