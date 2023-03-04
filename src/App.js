import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { HeaderComponent } from './Components/HeaderComponent';

import { DiscordExplore } from './Pages/DiscordExplore';
import { DiscordUpload } from './Pages/DiscordUpload';
import { Landing } from './Pages/Landing';
import { SpotifyExplore } from './Pages/SpotifyExplore';
import { SpotifyUpload } from './Pages/SpotifyUpload';

const App = () => (
	<StyledApp>
		<HeaderComponent />
		<Switch>
			<Route exact path='/' component={Landing} />
			<Route exact path='/discord/upload' component={DiscordUpload} />
			<Route exact path='/spotify/upload' component={SpotifyUpload} />
			<Route exact path='/spotify/explore' component={SpotifyExplore} />
			<Route exact path='/discord/explore' component={DiscordExplore} />
			<Redirect from='*' to='/' />
		</Switch>
	</StyledApp>
);

const StyledApp = styled.div`
	margin: max(1%, 20px);
`;

export default App;
