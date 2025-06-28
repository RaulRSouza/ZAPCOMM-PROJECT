import React, { useState, useEffect } from "react";
import qs from 'query-string'

import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import InputMask from 'react-input-mask';
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "../../assets/logo.png";
import { i18n } from "../../translate/i18n";

import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";
import efeito1 from "../../assets/efeito1.png";
import efeito3 from "../../assets/efeito3.png";
const Copyright = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright © "}
			<Link color="inherit" href="#">
				PLW
			</Link>{" "}
		   {new Date().getFullYear()}
			{"."}
		</Typography>
	);
};

const useStyles = makeStyles(theme => ({
	paper: {
		backgroundColor:'#34D3A3',
		width: '670px',
		height: '620px',
		borderRadius: '20px',
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		justifyContent: "center",
		textAlign: "center",

	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		color: '#0c2c54',
		width: '320px',
		backgroundColor: 'white',
		borderRadius: '8px',
	},
	elipse: {
		width: '133px',
		height: '133px',
		background: 'rgba(52,211,163,1)',
		opacity: '1',
		position: 'absolute',
		top: '540px',
		left: '184px',
		borderRadius: '50%',
	},
	efeito1: {
		width: '555px',
		height: '435px',
		opacity: '1',
		position: 'absolute',
		top: '0px',
		left: '0px',
	},
	efeito3: {
		width: '378px',
		height: '423px',
		opacity: '1',
		position: 'absolute',
		right: '0px',
		bottom: '0px',
		margin: '0',
		display: 'flex',
		justifyContent: 'end',	
	},
	input: {
		width: '330px',
		backgroundColor: '#0c2c54',
		border: '0',
		borderRadius: '8px',
		height: '45px'
	},
	ilname: {
		color:'#0c2c54', 
		fontWeight: '600',
		width: '50px',
		marginLeft: '170px' 
	},
	logozp: {
		marginTop: '40px',
		paddingLeft: '0',
	
	}

}));

const UserSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email").required("Required"),
});

const SignUp = () => {
	const classes = useStyles();
	const history = useHistory();
	let companyId = null

	const params = qs.parse(window.location.search)
	if (params.companyId !== undefined) {
		companyId = params.companyId
	}

	const initialState = { name: "", email: "", phone: "", password: "", planId: "", };

	const [user] = useState(initialState);
	const dueDate = moment().add(3, "day").format();
	const handleSignUp = async values => {
		Object.assign(values, { recurrence: "MENSAL" });
		Object.assign(values, { dueDate: dueDate });
		Object.assign(values, { status: "t" });
		Object.assign(values, { campaignsEnabled: true });
		try {
			await openApi.post("/companies/cadastro", values);
			toast.success(i18n.t("signup.toasts.success"));
			history.push("/login");
		} catch (err) {
			console.log(err);
			toastError(err);
		}
	};

	const [plans, setPlans] = useState([]);
	const { list: listPlans } = usePlans();

	useEffect(() => {
		async function fetchData() {
			const list = await listPlans();
			setPlans(list);
		}
		fetchData();
	}, []);


	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.efeito1}>
				<img src={efeito1} alt=""/>
			</div>
			<div className={classes.efeito3}>
				<img src={efeito3} alt=''/>
			</div>
			<div className={classes.elipse}></div>
			<div>
				<img className={classes.logozp} style={{marginLeft: '215px', left:'50%', transform:'translate(-50%)'}} src={logo} alt="Whats" />
			</div>
			<div className={classes.paper}>
			<div classname={classes.texto01}><p style={{color:'#0c2c54', margin: '0px',fontSize:'40px',}}>Registrar</p></div>
				{/*<Typography component="h1" variant="h5">
					{i18n.t("signup.title")}
				</Typography>*/}
				{/* <form className={classes.form} noValidate onSubmit={handleSignUp}> */}
				<Formik
					initialValues={user}
					enableReinitialize={true}
					validationSchema={UserSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSignUp(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form className={classes.form}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<InputLabel htmlFor="plan-selection" className={classes.ilname}>Nome</InputLabel>
									<Field
										as={TextField}
										autoComplete="name"
										name="name"
										error={touched.name && Boolean(errors.name)}
										helperText={touched.name && errors.name}
										fullWidth
										id="name"
										
										className={classes.input}
										InputProps={{
											disableUnderline: true, // remove a linha
											style: {
												color: '#FFFFFF', // cor do texto normal
												fontWeight: 'bold', // texto em negrito
											},
										}}
										InputLabelProps={{
											style: {
												color: '#FFFFFF', // cor do label
												
												opacity: 1, // visibilidade total
											},
										}}
									/>
								</Grid>

								<Grid item xs={12}>
									<InputLabel htmlFor="plan-selection" className={classes.ilname}>Email</InputLabel>
									<Field
										as={TextField}
										//variant="outlined"
										fullWidth
										id="email"
										
										name="email"
										error={touched.email && Boolean(errors.email)}
										helperText={touched.email && errors.email}
										autoComplete="email"
										required
										InputProps={{
											disableUnderline: true, // remove a linha
											style: {
												color: '#FFFFFF', // cor do texto normal
												fontWeight: 'bold', // texto em negrito
											},
										}}
										InputLabelProps={{
											style: {
												color: '#FFFFFF', // cor do label
												
												opacity: 1, // visibilidade total
											},
										}}
										className={classes.input}
									/>
								</Grid>
								
							<Grid item xs={12}>
								<InputLabel htmlFor="plan-selection" className={classes.ilname}>Número</InputLabel>
								<Field
									as={InputMask}
									mask="(99) 99999-9999"
									//variant="outlined"
									fullWidth
									id="phone"
									name="phone"
									error={touched.phone && Boolean(errors.phone)}
									helperText={touched.phone && errors.phone}
									autoComplete="phone"
									required
									InputProps={{
										disableUnderline: true, // remove a linha
										style: {
											color: '#FFFFFF', // cor do texto normal
											fontWeight: 'bold', // texto em negrito
										},
									}}
									InputLabelProps={{
										style: {
											color: '#FFFFFF', // cor do label
											
											opacity: 1, // visibilidade total
										},
									}}
									className={classes.input}
								>
									{({ field }) => (
										<TextField
											{...field}
											//variant="outlined"
											fullWidth
											
											InputProps={{
												disableUnderline: true, // remove a linha
												style: {
													color: '#FFFFFF', // cor do texto normal
													fontWeight: 'bold', // texto em negrito
												},
											}}
											InputLabelProps={{
												style: {
													color: '#FFFFFF', // cor do label
													
													opacity: 1, // visibilidade total
												},
											}}
											className={classes.input}
											 // Definindo o limite de caracteres
										/>
									)}
								</Field>
							</Grid>
								<Grid item xs={12}>
								<InputLabel htmlFor="plan-selection" className={classes.ilname}>Senha</InputLabel>
									<Field
										as={TextField}
										//variant="outlined"
										fullWidth
										name="password"
										error={touched.password && Boolean(errors.password)}
										helperText={touched.password && errors.password}
										
										type="password"
										id="password"
										autoComplete="current-password"
										required
										className={classes.input}
										InputProps={{
											disableUnderline: true, // remove a linha
											style: {
												color: '#FFFFFF', // cor do texto normal
												fontWeight: 'bold', // texto em negrito
											},
										}}
										InputLabelProps={{
											style: {
												color: '#FFFFFF', // cor do label
												
												opacity: 1, // visibilidade total
											},
										}}
									/>
								</Grid>
								{/*<Grid item xs={12}>
									<InputLabel htmlFor="plan-selection" className={classes.ilname}>Plano</InputLabel>
									<Field
										as={Select}
										variant="outlined"
										fullWidth
										id="plan-selection"
										
										name="planId"
										required
										className={classes.input}
										
									>
										{plans.map((plan, key) => (
											<MenuItem key={key} value={plan.id}>
												{plan.name} - Atendentes: {plan.users} - WhatsApp: {plan.connections} - Filas: {plan.queues} - R$ {plan.value}
											</MenuItem>
										))}
									</Field>
								</Grid>*/}
							</Grid>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color=""
								className={classes.submit}
							>
								{i18n.t("signup.buttons.submit")}
							</Button>
							<Grid container>
								<Grid item>
									<Link
										href="#"
										variant="body2"
										component={RouterLink}
										to="/login"
										style={{ paddingLeft:'250px',color:'#0c2c54',fontWeight:'600', marginTop: '10px'}}
									>
										{i18n.t("signup.buttons.login")}
									</Link>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</div>
			<Box mt={5}>{/* <Copyright /> */}</Box>
		</Container>
	);
};

export default SignUp;
