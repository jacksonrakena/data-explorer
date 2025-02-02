import pms from 'pretty-ms';
import React, { useEffect, useState } from 'react';
import FadeIn from 'react-fade-in';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import {
	Card,
	Divider,
	Grid,
	Header,
	List,
	Modal,
	Table,
} from 'semantic-ui-react';
import styled from 'styled-components';

import { DiscordData } from '../Processors/Discord';

export const DiscordExplore = () => {
	const history = useHistory();
	const { addToast } = useToasts();
	const DiscordDataContainer = DiscordData.useContainer();
	const [data, setData] = useState({
		user: {
			guild_settings: [],
			notes: {},
			payments: [],
			user_activity_application_statistics: [],
		},
		messagesIndex: {},
		activity: { eventCounts: {}, durationConnected: {} },
	});

	useEffect(() => {
		if (!DiscordDataContainer.isValid) {
			history.push('/discord/upload');
		}
		if (!DiscordDataContainer.data) {
			addToast('Something went wrong, please try again!', {
				appearance: 'error',
			});
			history.push('/discord/upload');
		}

		setData(DiscordDataContainer.data);
	}, [DiscordDataContainer, addToast, history]);
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
										Hey there {data.user.username}#
										{data.user.discriminator},
									</GrayText>
									<Divider />
								</Header>
								<b>account/user.json</b>
								<StyledList bulleted>
									<List.Item>
										You've joined{' '}
										<b>
											{data.user.guild_settings.length}{' '}
										</b>
										servers.
									</List.Item>
									<List.Item>
										You've received{' '}
										<b>
											{data.user.guild_settings.reduce(
												(prev, cur) =>
													prev +
													cur.message_notifications,
												0
											)}
										</b>{' '}
										message notifications.
										<StyledList bulleted>
											<List.Item>
												<i>
													Above most likely isn't
													accurate, it's just what the
													file says.
												</i>
											</List.Item>
										</StyledList>
									</List.Item>
									<List.Item>
										You've created{' '}
										<b>
											{
												Object.keys(data.user.notes)
													.length
											}
										</b>{' '}
										user notes.{' '}
										<Modal
											trigger={
												<ModalText>
													View notes.
												</ModalText>
											}
											header='User Notes'
											content={
												<Grid centered>
													<StyledTable>
														<Table.Header>
															<Table.Row>
																<Table.HeaderCell>
																	User ID
																</Table.HeaderCell>
																<Table.HeaderCell>
																	Note
																</Table.HeaderCell>
															</Table.Row>
														</Table.Header>
														<Table.Body>
															{Object.keys(
																data.user.notes
															).map(id => (
																<Table.Row>
																	<Table.Cell>
																		{id}
																	</Table.Cell>
																	<Table.Cell>
																		{
																			data
																				.user
																				.notes[
																				id
																			]
																		}
																	</Table.Cell>
																</Table.Row>
															))}
														</Table.Body>
													</StyledTable>
												</Grid>
											}
											actions={[
												{
													key: 'close',
													content: 'Close',
													positive: true,
												},
											]}
										/>
									</List.Item>
									<List.Item>
										You've spent{' '}
										<b>
											{data.user.payments.reduce(
												(prev, cur) =>
													prev + cur.amount,
												0
											) / 100}{' '}
											{data.user.payments[0]?.currency?.toUpperCase() ||
												''}
										</b>{' '}
										on Discord.{' '}
										<Modal
											trigger={
												<ModalText>
													View payments.
												</ModalText>
											}
											header='Payments'
											content={
												<Grid centered>
													<StyledTable>
														<Table.Header>
															<Table.Row>
																<Table.HeaderCell>
																	Item
																</Table.HeaderCell>
																<Table.HeaderCell>
																	Price
																</Table.HeaderCell>
																<Table.HeaderCell>
																	Date
																</Table.HeaderCell>
															</Table.Row>
														</Table.Header>
														<Table.Body>
															{Object.values(
																data.user
																	.payments
															).map(payment => (
																<Table.Row>
																	<Table.Cell>
																		{
																			payment.description
																		}
																	</Table.Cell>
																	<Table.Cell>
																		{payment.amount /
																			100}{' '}
																		{payment.currency.toUpperCase()}
																	</Table.Cell>
																	<Table.Cell>
																		{
																			new Date(
																				payment.created_at
																			)
																				.toISOString()
																				.split(
																					'T'
																				)[0]
																		}
																	</Table.Cell>
																</Table.Row>
															))}
														</Table.Body>
													</StyledTable>
												</Grid>
											}
											actions={[
												{
													key: 'close',
													content: 'Close',
													positive: true,
												},
											]}
										/>
									</List.Item>
									<List.Item>
										You've had{' '}
										<b>
											{
												data.user
													.user_activity_application_statistics
													.length
											}
										</b>{' '}
										unique games/applications in your user
										status.{' '}
										<Modal
											trigger={
												<ModalText>
													View applications.
												</ModalText>
											}
											header='Applications'
											content={
												<Grid centered>
													<StyledTable>
														<Table.Header>
															<Table.Row>
																<Table.HeaderCell>
																	Application
																	ID
																</Table.HeaderCell>
																<Table.HeaderCell>
																	Last Played
																</Table.HeaderCell>
																<Table.HeaderCell>
																	Duration
																	Played
																</Table.HeaderCell>
															</Table.Row>
														</Table.Header>
														<Table.Body>
															{Object.values(
																data.user
																	.user_activity_application_statistics
															).map(
																application => (
																	<Table.Row>
																		<Table.Cell>
																			{
																				application.application_id
																			}
																		</Table.Cell>
																		<Table.Cell>
																			{
																				new Date(
																					application.last_played_at
																				)
																					.toISOString()
																					.split(
																						'T'
																					)[0]
																			}
																		</Table.Cell>
																		<Table.Cell>
																			{
																				application.total_duration
																			}
																		</Table.Cell>
																	</Table.Row>
																)
															)}
														</Table.Body>
													</StyledTable>
												</Grid>
											}
											actions={[
												{
													key: 'close',
													content: 'Close',
													positive: true,
												},
											]}
										/>
									</List.Item>
								</StyledList>
								<b>messages/</b>
								<StyledList bulleted>
									<List.Item>
										You've sent messages in{' '}
										<b>{data.channelCount}</b> unqiue
										channels.
									</List.Item>
									<List.Item>
										You've sent messages to{' '}
										<b>{data.dmChannelCount}</b> unqiue
										users.
									</List.Item>
									<List.Item>
										You've sent <b>{data.wordsCount}</b>{' '}
										words or <b>{data.characterCount}</b>{' '}
										characters.
									</List.Item>
								</StyledList>
								<b>activity/</b>
								<p>
									<i>
										<DarkGreyText>
											The following is from when "Use data
											to improve Discord" was been enabled
											in your settings.
										</DarkGreyText>
									</i>
								</p>
								<StyledList bulleted>
									<List.Item>
										You've spent{' '}
										<b>
											{pms(
												(Object.values(
													data.activity
														.durationConnected
												).reduce(
													(prev, cur) => prev + cur,
													0
												) || 0) * 1000
											)}
										</b>{' '}
										connected to voice channels since{' '}
										<b>
											{
												(
													data.activity
														.earliestVCJoinDate ||
													new Date()
												)
													.toISOString()
													.split('T')[0]
											}
										</b>
										.
									</List.Item>
									{data.activity.earliestVCJoinDate && (
										<List.Item>
											That's an average of{' '}
											<b>
												{pms(
													((Object.values(
														data.activity
															.durationConnected
													).reduce(
														(prev, cur) =>
															prev + cur,
														0
													) || 0) *
														1000) /
														Math.round(
															(Date.now() -
																data.activity
																	.earliestVCJoinDate) /
																(1000 *
																	3600 *
																	24)
														),
													{
														secondsDecimalDigits: 0,
													}
												)}
											</b>{' '}
											per day!
										</List.Item>
									)}
									<Table
										compact
										style={{
											background: 'transparent',
											color: 'grey',
										}}
									>
										{Object.keys(
											data.activity.durationConnected
										)
											.filter(
												i =>
													i !== 'undefined' &&
													data.activity
														.durationConnected[i] >
														60
											)
											.sort(
												(a, b) =>
													data.activity
														.durationConnected[b] -
													data.activity
														.durationConnected[a]
											)
											.map(i => (
												<tr>
													<td>
														{data.guildsIndex[i] ||
															'Deleted Server'}
													</td>{' '}
													<td>
														{pms(
															data.activity
																.durationConnected[
																i
															] * 1000
														)}
													</td>
												</tr>
											))}
									</Table>
									<List.Item>
										Discord has tracked{' '}
										<b>
											{Object.values(
												data.activity.eventCounts
											).reduce(
												(cur, prev) => cur + prev,
												0
											)}
										</b>{' '}
										of your actions.{' '}
										<Modal
											trigger={
												<ModalText>
													View counts.
												</ModalText>
											}
											header='Events'
											content={
												<Grid centered>
													<StyledTable>
														<Table.Header>
															<Table.Row>
																<Table.HeaderCell>
																	Event
																</Table.HeaderCell>
																<Table.HeaderCell>
																	Count
																</Table.HeaderCell>
															</Table.Row>
														</Table.Header>
														<Table.Body>
															{Object.keys(
																data.activity
																	.eventCounts
															)
																.sort(
																	(a, b) =>
																		data
																			.activity
																			.eventCounts[
																			b
																		] -
																		data
																			.activity
																			.eventCounts[
																			a
																		]
																)
																.map(key => (
																	<Table.Row>
																		<Table.Cell>
																			{
																				key
																			}
																		</Table.Cell>
																		<Table.Cell>
																			{
																				data
																					.activity
																					.eventCounts[
																					key
																				]
																			}
																		</Table.Cell>
																	</Table.Row>
																))}
														</Table.Body>
													</StyledTable>
												</Grid>
											}
											actions={[
												{
													key: 'close',
													content: 'Close',
													positive: true,
												},
											]}
										/>
									</List.Item>
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
