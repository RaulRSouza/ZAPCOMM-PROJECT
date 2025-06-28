import React, { useState, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import {
	Button,
	TableBody,
	TableRow,
	TableCell,
	IconButton,
	Table,
	TableHead,
	Paper,
	Tooltip,
	Typography,
	CircularProgress,
} from "@material-ui/core";
import {
	Edit,
	CheckCircle,
	SignalCellularConnectedNoInternet2Bar,
	SignalCellularConnectedNoInternet0Bar,
	SignalCellular4Bar,
	CropFree,
	DeleteOutline,
	ArrowLeft,
	Height,
	Transform,
} from "@material-ui/icons";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import TableRowSkeleton from "../../components/TableRowSkeleton";

import api from "../../services/api";
import WhatsAppModal from "../../components/WhatsAppModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import QrcodeModal from "../../components/QrcodeModal";
import { i18n } from "../../translate/i18n";
import { WhatsAppsContext } from "../../context/WhatsApp/WhatsAppsContext";
import toastError from "../../errors/toastError";

import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../../components/Can";
import Logo from "../../assets/logo.png"
import add from "../../assets/add.png"
import pencil from "../../assets/pencil.png"
import thrashcan from "../../assets/thrashcan.png"
import qr from "../../assets/qr.png"
const useStyles = makeStyles(theme => ({

	mais: {
		transform: 'scale(0.5)'

	},

	traco: {
		height: '2px',
		width: '100%',
		backgroundColor: '#0C2454',
		marginLeft: '0px',
	  },

	titulo: {
		position:'relative',
		left:'5px',
		color:'black',
	},


	contentWrapper: {
		backgroundColor: "green",
	},
// table
	mainPaper: {
		flex: 1,
		padding:'8px',
		overflowY: "scroll",
		...theme.scrollbarStyles,
		backgroundColor: "#FFFFFF", 
		borderRadius: "16px",
	},
	customTableCell: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "0px",
		borderSpacing: '50 100px'

	
	},
	// fundo
	tooltip: {
		backgroundColor: "#FFFFFF",
		color: "rgba(0, 0, 0, 0.87)",
		fontSize: theme.typography.pxToRem(14),
		border: "1px solid #dadde9",
		maxWidth: 450,

	},
	tooltipPopper: {
		textAlign: "center",
	},
	buttonProgress: {
		color: green[500],
	},
	fundo: {
		marginTop:'80px',
		backgroundColor:'white',
		width:'90%',
		height:'100%',
		marginLeft:'67px',
		borderRadius:'18px',
		padding:'16px',
		overflowY: "scroll",
		...theme.scrollbarStyles,
	  },
	

}));

const CustomToolTip = ({ title, content, children }) => {
	const classes = useStyles();

	return (
		<Tooltip
			arrow
			classes={{
				tooltip: classes.tooltip,
				popper: classes.tooltipPopper,
			}}
			title={
				<React.Fragment>
					<Typography gutterBottom color="inherit">
						{title}
					</Typography>
					{content && <Typography>{content}</Typography>}
				</React.Fragment>
			}
		>
			{children}
		</Tooltip>
	);
};

const Connections = () => {
	const classes = useStyles();

	const { user } = useContext(AuthContext);
	const { whatsApps, loading } = useContext(WhatsAppsContext);
	const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
	const [qrModalOpen, setQrModalOpen] = useState(false);
	const [selectedWhatsApp, setSelectedWhatsApp] = useState(null);
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const confirmationModalInitialState = {
		action: "",
		title: "",
		message: "",
		whatsAppId: "",
		open: false,
	};
	const [confirmModalInfo, setConfirmModalInfo] = useState(
		confirmationModalInitialState
	);

	const handleStartWhatsAppSession = async whatsAppId => {
		try {
			await api.post(`/whatsappsession/${whatsAppId}`);
		} catch (err) {
			toastError(err);
		}
	};

	const handleRequestNewQrCode = async whatsAppId => {
		try {
			await api.put(`/whatsappsession/${whatsAppId}`);
		} catch (err) {
			toastError(err);
		}
	};

	const handleOpenWhatsAppModal = () => {
		setSelectedWhatsApp(null);
		setWhatsAppModalOpen(true);
	};

	const handleCloseWhatsAppModal = useCallback(() => {
		setWhatsAppModalOpen(false);
		setSelectedWhatsApp(null);
	}, [setSelectedWhatsApp, setWhatsAppModalOpen]);

	const handleOpenQrModal = whatsApp => {
		setSelectedWhatsApp(whatsApp);
		setQrModalOpen(true);
	};

	const handleCloseQrModal = useCallback(() => {
		setSelectedWhatsApp(null);
		setQrModalOpen(false);
	}, [setQrModalOpen, setSelectedWhatsApp]);

	const handleEditWhatsApp = whatsApp => {
		setSelectedWhatsApp(whatsApp);
		setWhatsAppModalOpen(true);
	};

	const handleOpenConfirmationModal = (action, whatsAppId) => {
		if (action === "disconnect") {
			setConfirmModalInfo({
				action: action,
				title: i18n.t("connections.confirmationModal.disconnectTitle"),
				message: i18n.t("connections.confirmationModal.disconnectMessage"),
				whatsAppId: whatsAppId,
			});
		}

		if (action === "delete") {
			setConfirmModalInfo({
				action: action,
				title: i18n.t("connections.confirmationModal.deleteTitle"),
				message: i18n.t("connections.confirmationModal.deleteMessage"),
				whatsAppId: whatsAppId,
			});
		}
		setConfirmModalOpen(true);
	};

	const handleSubmitConfirmationModal = async () => {
		if (confirmModalInfo.action === "disconnect") {
			try {
				await api.delete(`/whatsappsession/${confirmModalInfo.whatsAppId}`);
			} catch (err) {
				toastError(err);
			}
		}

		if (confirmModalInfo.action === "delete") {
			try {
				await api.delete(`/whatsapp/${confirmModalInfo.whatsAppId}`);
				toast.success(i18n.t("connections.toasts.deleted"));
			} catch (err) {
				toastError(err);
			}
		}

		setConfirmModalInfo(confirmationModalInitialState);
	};

	const renderActionButtons = whatsApp => {
		return (
			<>
				{whatsApp.status === "qrcode" && (
					<Button
						size="small"
						variant="contained"
						color="realprimary"
						onClick={() => handleOpenQrModal(whatsApp)}
						style={{backgroundColor:"#0C2454",
							color:"white",
							transform:"scale(0.70)"
						}}
					>
						<div><img src={qr} style={{transform:"scale(0.80)",
							position:"relative",
							top:"5px",

						}}></img></div>
					</Button>
				)}
				{whatsApp.status === "DISCONNECTED" && (
					<>
						<Button
							size="small"
							variant="outlined"
							color="realprimary"
							onClick={() => handleStartWhatsAppSession(whatsApp.id)}
							style={{backgroundColor:"#0C2454",
								color:"white",
							}}
						>
							{i18n.t("connections.buttons.tryAgain")}
						</Button>{" "}
						<Button
							size="small"
							variant="outlined"
							color="secondary"
							onClick={() => handleRequestNewQrCode(whatsApp.id)}
							style={{backgroundColor:"#0C2454",
								transform:"scale(0.75)",
							}}
						>
							<img src={qr} style={{backgroundColor:"#0C2454",
								transform:"scale(0.8)"
							}}></img> 
						</Button>
					</>
				)}
				{(whatsApp.status === "CONNECTED" ||
					whatsApp.status === "PAIRING" ||
					whatsApp.status === "TIMEOUT") && (
					<Button
						size="small"
						variant="outlined"
						color="secondary"
						onClick={() => {
							handleOpenConfirmationModal("disconnect", whatsApp.id);
						}}
					>
						{i18n.t("connections.buttons.disconnect")}
					</Button>
				)}
				{whatsApp.status === "OPENING" && (
					<Button size="small" variant="outlined" disabled color="default">
						{i18n.t("connections.buttons.connecting")}
					</Button>
				)}
			</>
		);
	};

	const renderStatusToolTips = whatsApp => {
		return (
			<div className={classes.customTableCell}>
				{whatsApp.status === "DISCONNECTED" && (
					<CustomToolTip
						title={i18n.t("connections.toolTips.disconnected.title")}
						content={i18n.t("connections.toolTips.disconnected.content")}
					>
						<SignalCellularConnectedNoInternet0Bar color="secondary" />
					</CustomToolTip>
				)}
				{whatsApp.status === "OPENING" && (
					<CircularProgress size={24} className={classes.buttonProgress} />
				)}
				{whatsApp.status === "qrcode" && (
					<CustomToolTip
						title={i18n.t("connections.toolTips.qrcode.title")}
						content={i18n.t("connections.toolTips.qrcode.content")}
					>
						<CropFree />
					</CustomToolTip>
				)}
				{whatsApp.status === "CONNECTED" && (
					<CustomToolTip title={i18n.t("connections.toolTips.connected.title")}>
						<SignalCellular4Bar style={{ color: green[500] }} />
					</CustomToolTip>
				)}
				{(whatsApp.status === "TIMEOUT" || whatsApp.status === "PAIRING") && (
					<CustomToolTip
						title={i18n.t("connections.toolTips.timeout.title")}
						content={i18n.t("connections.toolTips.timeout.content")}
					>
						<SignalCellularConnectedNoInternet2Bar color="secondary" />
					</CustomToolTip>
				)}
			</div>
		);
	};

	return (
			<div style={{height:'80%'}}>
			<ConfirmationModal
				title={confirmModalInfo.title}
				open={confirmModalOpen}
				onClose={setConfirmModalOpen}
				onConfirm={handleSubmitConfirmationModal}
				style={{backgroundColor:"green"}
				}
				
			
			>
				{confirmModalInfo.message}
			</ConfirmationModal>
			<QrcodeModal
				open={qrModalOpen}
				onClose={handleCloseQrModal}
				whatsAppId={!whatsAppModalOpen && selectedWhatsApp?.id}

			/>
			<WhatsAppModal
				open={whatsAppModalOpen}
				onClose={handleCloseWhatsAppModal}
				whatsAppId={!qrModalOpen && selectedWhatsApp?.id}
			/>
			
			<div className={classes.fundo}>
			<div className={classes.conexoes}>
			<MainHeader >
				<Title className={classes.titulo} style={{
						color: "#000000",}}
						>{i18n.t("connections.title")}
					</Title>
					<MainHeaderButtonsWrapper>
					
					<Can 
				role={user.profile}
				perform="connections-page:addConnection"
				yes={() => (
					<Button className={classes.botao}
							variant="contained"
							color="primary"
							onClick={handleOpenWhatsAppModal}
						>
							{i18n.t("connections.buttons.add")}
						</Button>
					)}
						
					/>
				</MainHeaderButtonsWrapper>
			</MainHeader>
					
				<div className={classes.traco}></div>
				<Table size="small"
				style={{
					borderCollapse: "separate",
					borderSpacing: "0 10px",
				}}>
					<TableHead>
						<TableRow>
							<TableCell align="center" style={{color:'#0C2454', fontWeight:'bold'}}>
								{i18n.t("connections.table.name")}
							</TableCell>
							<TableCell align="center" style={{color:'#0C2454', fontWeight:'bold'}}> 
								{i18n.t("connections.table.status")}
							</TableCell>
							<Can
								role={user.profile}
								perform="connections-page:actionButtons"
								yes={() => (
									<TableCell align="center" style={{color:'#0C2454', fontWeight:'bold'}}>
										{i18n.t("connections.table.session")}
									</TableCell>
								)}
							/>
							<TableCell align="center" style={{color:'#0C2454', fontWeight:'bold'}}> 
								{i18n.t("connections.table.lastUpdate")}
							</TableCell>
							<TableCell align="center" style={{color:'#0C2454', fontWeight:'bold'}}>
								{i18n.t("connections.table.default")}
							</TableCell>
							<Can
								role={user.profile}
								perform="connections-page:editOrDeleteConnection"
								yes={() => (
									<TableCell align="center" style={{color:'#0C2454', fontWeight:'bold'}}>
										{i18n.t("connections.table.actions")}
									</TableCell>
								)}
							/>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRowSkeleton />
						) : (
							<>
								{whatsApps?.length > 0 &&
									whatsApps.map(whatsApp => (
										<TableRow key={whatsApp.id}
										style={{backgroundColor:"#D9D9D9",
											borderRadius: "00px",
										}}>
											<TableCell align="center" style={{
												width: "5%",
												 borderTopLeftRadius: '16px',  // Borda superior esquerda
												 borderBottomLeftRadius: '16px',  // Borda inferior esquerda
												 border: "none",

											}}>{whatsApp.name}</TableCell>
											<TableCell align="center"
											style={{width: '5%',
												position: "relative",
												left: "0px",

											}}>
												{renderStatusToolTips(whatsApp)}
											</TableCell>
											<Can
												role={user.profile}
												perform="connections-page:actionButtons"
												yes={() => (
													<TableCell align="center">
														{renderActionButtons(whatsApp)}
													</TableCell>
												)}
											/>
											<TableCell align="center">
												<strong>{format(parseISO(whatsApp.updatedAt), "dd/MM/yy HH:mm")}</strong>
											</TableCell>
											<TableCell align="center">
												{whatsApp.isDefault && (
													<div className={classes.customTableCell}>
														<CheckCircle style={{ color: green[500] }} />
													</div>
												)}
											</TableCell>
											<Can
												role={user.profile}
												perform="connections-page:editOrDeleteConnection"
												yes={() => (
													<TableCell align="center" style={{borderTopRightRadius:"16px",
														borderBottomRightRadius:"16px",
														border: "none",

													}}>
														<IconButton
															size="small"
															onClick={() => handleEditWhatsApp(whatsApp)}
														>
														<div><img src={pencil} style={{transform: "scale(0.5)"}}></img></div>
														</IconButton>

														<IconButton
															size="small"
															onClick={e => {
																handleOpenConfirmationModal("delete", whatsApp.id);
															}}
														>
															<div><img src={thrashcan} style={{transform:"scale(0.45)"}}></img></div>
														</IconButton>
													</TableCell>
												)}
											/>
										</TableRow>
									))}
							</>
						)}
					</TableBody>
				</Table>
				</div>
				</div>
				</div>
	);
};

export default Connections;
