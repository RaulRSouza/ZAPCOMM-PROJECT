import React, { useState, useEffect, useContext } from "react"; 

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";
import useWhatsApps from "../../hooks/useWhatsApps";

const useStyles = makeStyles(theme => ({
	blueline: {
		borderBottom: "2px solid #0C2454",
		width: "90%",
		margin: "0 auto",
		marginBottom: theme.spacing(),
	},
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	multFieldLine: {
		display: "flex",
		"& > *:not(:last-child)": {
			marginRight: theme.spacing(1),
		},
	},
	btnWrapper: {
		position: "relative",
	},
	buttonProgress: {
		color: green[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	dialogTitle: {
		textAlign: "center",
		color: "#0C245",
	},
	dialogPaper: {
		borderRadius: 40,
	},
	textField: {
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
				borderColor: '#0C2454',
			},
			'&:hover fieldset': {
				borderColor: '#0C2454',
			},
			'&.Mui-focused fieldset': {
				borderColor: '#0C2454',
			},
		},
	},
	selectField: {
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
				borderColor: '#0C2454',
			},
			'&:hover fieldset': {
				borderColor: '#0C2454',
			},
			'&.Mui-focused fieldset': {
				borderColor: '#0C2454',
			},
		},
	},
	buttonRed: {
		backgroundColor: '#f44336', // Vermelho
		color: '#fff',
		borderRadius: '8px',
		padding: '8px 15px',
		textTransform: 'none', // Não transforma o texto para caixa alta
		'&:hover': {
			backgroundColor: '#c62828', // Vermelho escuro ao passar o mouse
		},
		transition: 'background-color 0.3s ease',
	},
	buttonBlue: {
		backgroundColor: '#0C2454', // Azul
		color: '#fff',
		borderRadius: '8px',
		padding: '8px 15px',
		textTransform: 'none', // Não transforma o texto para caixa alta
		'&:hover': {
			backgroundColor: '#0A1A3E', // Azul escuro ao passar o mouse
		},
		transition: 'background-color 0.3s ease',
	},
	buttonsContainer: {
		display: 'flex',
		marginRight: theme.spacing(2), // Um pouco de margem à direita
		marginTop: theme.spacing(0,5),
		marginLeft: theme.spacing(4), // Um pouco de margem à esquerda
	},
}));

const UserSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email").required("Required"),
});

const UserModal = ({ open, onClose, userId }) => {
	const classes = useStyles();

	const initialState = {
		name: "",
		email: "",
		password: "",
		profile: "user",
		allTicket: "desabled"
	};

	const { user: loggedInUser } = useContext(AuthContext);

	const [user, setUser] = useState(initialState);
	const [selectedQueueIds, setSelectedQueueIds] = useState([]);
	const [whatsappId, setWhatsappId] = useState(false);
	const { loading, whatsApps } = useWhatsApps();

	useEffect(() => {
		const fetchUser = async () => {
			if (!userId) return;
			try {
				const { data } = await api.get(`/users/${userId}`);
				setUser(prevState => {
					return { ...prevState, ...data };
				});
				const userQueueIds = data.queues?.map(queue => queue.id);
				setSelectedQueueIds(userQueueIds);
				setWhatsappId(data.whatsappId ? data.whatsappId : '');
			} catch (err) {
				toastError(err);
			}
		};

		fetchUser();
	}, [userId, open]);

	const handleClose = () => {
		onClose();
		setUser(initialState);
	};

	const handleSaveUser = async values => {
		const userData = { ...values, whatsappId, queueIds: selectedQueueIds, allTicket: values.allTicket };
		try {
			if (userId) {
				await api.put(`/users/${userId}`, userData);
			} else {
				await api.post("/users", userData);
			}
			toast.success(i18n.t("userModal.success"));
		} catch (err) {
			toastError(err);
		}
		handleClose();
	};

	return (
		<div className={classes.root}>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="xs"
				fullWidth
				scroll="paper"
				PaperProps={{
					classes: {
						root: classes.dialogPaper,
					},
				}}
			>
				<DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
					{userId
						? <strong>{i18n.t("userModal.title.edit")}</strong>
						: <strong>{i18n.t("userModal.title.add")}</strong>}
				</DialogTitle>
				
				<div className={classes.blueline}></div>
				
				<Formik
					initialValues={user}
					enableReinitialize={true}
					validationSchema={UserSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveUser(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form>
							<DialogContent >

							<div style={{ marginTop: '-20px' }}>

								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label={i18n.t("userModal.form.name")}
										autoFocus
										name="name"
										error={touched.name && Boolean(errors.name)}
										helperText={touched.name && errors.name}
										variant="outlined"
										margin="dense"
										fullWidth
										className={classes.textField}
									/>
									<Field
										as={TextField}
										label={i18n.t("userModal.form.password")}
										type="password"
										name="password"
										error={touched.password && Boolean(errors.password)}
										helperText={touched.password && errors.password}
										variant="outlined"
										margin="dense"
										fullWidth
										className={classes.textField}
									/>
								</div>
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label={i18n.t("userModal.form.email")}
										name="email"
										error={touched.email && Boolean(errors.email)}
										helperText={touched.email && errors.email}
										variant="outlined"
										margin="dense"
										fullWidth
										className={classes.textField}
									/>
									<FormControl
										variant="outlined"
										className={`${classes.formControl} ${classes.selectField}`}
										margin="dense"
									>
										<Can
											role={loggedInUser.profile}
											perform="user-modal:editProfile"
											yes={() => (
												<>
													<InputLabel id="profile-selection-input-label">
														{i18n.t("userModal.form.profile")}
													</InputLabel>

													<Field
														as={Select}
														label={i18n.t("userModal.form.profile")}
														name="profile"
														labelId="profile-selection-label"
														id="profile-selection"
														required
													>
														<MenuItem value="admin">Admin</MenuItem>
														<MenuItem value="user">User</MenuItem>
													</Field>
													</>
											)}
										/>
									</FormControl>
								</div>
								<Can
									role={loggedInUser.profile}
									perform="user-modal:editQueues"
									yes={() => (
										<QueueSelect
											selectedQueueIds={selectedQueueIds}
											onChange={values => setSelectedQueueIds(values)}
										/>
									)}
								/>
									<Can
										role={loggedInUser.profile}
										perform="user-modal:editProfile"
										yes={() => (!loading &&
											<div className={classes.textField}>
												<FormControl
													variant="outlined"
													className={`${classes.maxWidth} ${classes.selectField}`}
													margin="dense"
													fullWidth
												>
													<>
														<InputLabel id="profile-selection-input-label">
															{i18n.t("userModal.form.whatsapp")}
														</InputLabel>
	
														<Field
															as={Select}
															value={whatsappId}
															onChange={(e) => setWhatsappId(e.target.value)}
															label={i18n.t("userModal.form.whatsapp")}
														>
															<MenuItem value={''}>&nbsp;</MenuItem>
															{whatsApps.map((whatsapp) => (
																<MenuItem key={whatsapp.id} value={whatsapp.id}>{whatsapp.name}</MenuItem>
															))}
														</Field>
													</>
												</FormControl>
											</div>
										)}
									/>
								</div>
								<Can
									role={loggedInUser.profile}
									perform="user-modal:editProfile"
									yes={() => (!loading &&
										<div className={classes.textField}>
											<FormControl
												variant="outlined"
												className={`${classes.maxWidth} ${classes.selectField}`}
												margin="dense"
												fullWidth
											>
												<>
													<InputLabel id="profile-selection-input-label">
														{i18n.t("userModal.form.allTicket")}
													</InputLabel>

													<Field
														as={Select}
														label={i18n.t("allTicket.form.viewTags")}
														name="allTicket"
														labelId="allTicket-selection-label"
														id="allTicket-selection"
														required
													>
														<MenuItem value="enabled">{i18n.t("userModal.form.allTicketEnabled")}</MenuItem>
														<MenuItem value="desabled">{i18n.t("userModal.form.allTicketDesabled")}</MenuItem>
													</Field>
												</>
											</FormControl>
										</div>
									)}
								/>
							</DialogContent>
							<div className={classes.blueline}></div> {/* Nova linha azul */}
   
							<DialogActions className={classes.buttonsContainer}>
    <Button
        onClick={handleClose}
        className={classes.buttonRed}
        disabled={isSubmitting}
    >
        <DeleteIcon style={{ marginRight: '5px', marginLeft: '5px' }} /> {/* Adiciona o ícone */}
    </Button>
    <Button
        type="submit"
        disabled={isSubmitting}
        className={classes.buttonBlue}
    >
        {userId
            ? i18n.t("userModal.buttons.okEdit")
            : i18n.t("userModal.buttons.okAdd")}
        {isSubmitting && (
            <CircularProgress size={24} className={classes.buttonProgress} />
        )}
    </Button>
</DialogActions>

						</Form>
					)}
				</Formik>
			</Dialog>
		</div>
	);
};

export default UserModal;
