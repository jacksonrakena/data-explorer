import React, { useEffect, useState } from 'react';
import FadeIn from 'react-fade-in';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Card, Divider, Grid, Header, List, Table } from 'semantic-ui-react';
import styled from 'styled-components';

import { SpotifyData } from '../Processors/Spotify';

export const SpotifyExplore = () => {
	const history = useHistory();
	const { addToast } = useToasts();
	const SpotifyDataContainer = SpotifyData.useContainer();
	const [data, setData] = useState({
		tracks: [],
	});

	useEffect(() => {
		if (!SpotifyDataContainer.isValid) {
			history.push('/spotify/upload');
		}
		if (!SpotifyDataContainer.data) {
			addToast('Something went wrong, please try again!', {
				appearance: 'error',
			});
			history.push('/spotify/upload');
		}

		setData(SpotifyDataContainer.data);
	}, [SpotifyDataContainer, addToast, history]);
	console.log(data);

	return (
		<>
			<FadeIn>
				<Grid centered columns={1}>
					<StyledCard>
						<Card.Content>
							<CardDescription>
								<Header as='h2'>
									<GrayText>
										You've listened {data.tracks.length}{' '}
										times.
									</GrayText>
									<Divider />
								</Header>
							</CardDescription>
						</Card.Content>
					</StyledCard>
					<StyledCard>
						<Card.Content>
							<CardDescription>
								<Header as='h2'>
									<GrayText>Your top artists</GrayText>
									<Divider />
								</Header>
								<StyledList bulleted>
									{
										data.tracks.reduce((a, b) => {
											if (
												a.master_metadata_album_artist_name
											) {
												if (a.result) {
													a.result[
														a.master_metadata_album_artist_name
													] =
														(a.result[
															a
																.master_metadata_album_artist_name
														] ?? 0) + 1;
													return a;
												} else {
													a.result = {};
													a.result[
														a.master_metadata_album_artist_name
													] = 1;
													return a;
												}
											}
											return a;
										}).result[0]
									}
								</StyledList>
							</CardDescription>
						</Card.Content>
					</StyledCard>
				</Grid>
			</FadeIn>
		</>
	);
};

const DarkGreyText = styled.span`
	color: darkgrey;
`;

const StyledTable = styled(Table)`
	width: 90% !important;
	margin: 25px !important;
	padding: 0 !important;
`;

const ModalText = styled.span`
	color: #4183c4;
	cursor: pointer;
	:hover {
		color: #0183c4;
	}
`;

const StyledList = styled(List)`
	*:before {
		color: #eeeeee !important;
	}
`;

const GrayText = styled.span`
	color: #eeeeee;
`;

const CardDescription = styled(Card.Description)`
	color: lightgrey !important;
	text-align: left;
	margin: 20px;
`;

const StyledCard = styled(Card)`
	box-shadow: none !important;
	background-color: #23272a !important;
	margin-top: 25px !important;
	width: 650px !important;
	min-width: max(40%, 300px) !important;
	margin-bottom: 50px !important;
`;
