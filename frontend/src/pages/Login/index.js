import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import {useMediaQuery} from "@material-ui/core"
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid"; 
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { versionSystem } from "../../../package.json";
import { i18n } from "../../translate/i18n";
import { nomeEmpresa } from "../../../package.json";
import { AuthContext } from "../../context/Auth/AuthContext";
import logo from "../../assets/logo.png";
import efeito1 from "../../assets/efeito1.png";
import efeito3 from "../../assets/efeito3.png";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@material-ui/core";

const Copyright = () => {
	return (
		<Typography variant="body2" color="primary" align="center">
			{"Copyright "}
 			<Link color="primary" href="#">
 				{ nomeEmpresa } - v { versionSystem }
 			</Link>{" "}
 			{new Date().getFullYear()}
 			{"."}
 		</Typography>
 	);
 };

const useStyles = makeStyles(theme => ({
	body: {
		margin: '0',
		overflow:'hidden'
	},
	root: {
		width: "100vw",
		height: "100vh",
		//background: "linear-gradient(to right, #682EE3 , #682EE3 , #682EE3)",
		//backgroundImage: "url(https://i.imgur.com/CGby9tN.png)",
		backgroundColor: 'white',
		//backgroundPosition: "center",
		display: "flex",
		//flexDirection: "column",
		margin: '0',
		backgroundSize: '50% 50%',
		overflowX:'hidden'

		

	},
	paper: {
		/*backgroundColor: 'red',
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "55px 30px",
		borderRadius: "12.5px",*/
		backgroundColor:'#34D3A3',
		width: '670px',
		height: '583px',
		borderRadius: '20px',
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		justifyContent: "center",
		textAlign: "center",
		[theme.breakpoints.down("sm")]:{
			width: '370px',
			overflow:'hidden'
		  }
	},
	avatar: {
		margin: theme.spacing(1),  
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		color: '#0c2c54',
		width: '320px',
		backgroundColor: 'white',
		borderRadius: '8px',
	},
	powered: {
		color: "white"
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
		overflow:'hidden'
	},
	efeito1: {
		width: '1px',
		opacity: '1',
		position: 'absolute',
		top: '0px',
		left: '0px',
		[theme.breakpoints.down("sm")]:{
			top: '-200px',
			left:'-220px',

		  }
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
		overflow:'hidden',
		[theme.breakpoints.down("sm")]:{
			bottom: '-300px',
			right: '0px',
			overflow:'hidden'
		  }
		
	},
	inp1: {
		width: '330px',
		backgroundColor: '#0c2c54',
		border: '0',
		borderRadius: '8px',
		height: '45px',
		marginTop: '0px',
		[theme.breakpoints.down("sm")]:{
			width: '230px',
		  },
	},

	inp2: {
		width: '330px',
		backgroundColor: '#0c2c54',
		border: '0',
		borderRadius: '8px',
		height: '45px',
		marginTop: '0px',
		[theme.breakpoints.down("sm")]:{
			width: '230px',
		  },
	},

	texto01: {
		color: '#0c2c54',
		fontSize: '0px',
		margin: '0',
	},
	txt02: {
		color: '#0c2c54',
		fontSize: '0px',
	},
	logozp: {
		position:'static',
		marginTop: '40px',
		paddingLeft: '0',
		[theme.breakpoints.down("sm")]:{
			position:'relative',
			left:'-25px',
			overflowX:'hidden',

		  },

	},
	ilname: {
		color:'#0c2c54', 
		fontWeight: '600',
		width: '50px',
		marginLeft: '170px', 
		marginTop: '16px',
		[theme.breakpoints.down("sm")]:{
			marginLeft: '70px',
		  },
	},
	registrese:{
		[theme.breakpoints.down("sm")]:{
			marginLeft: '-160px',
		  },
	}
}));

const Login = () => {
	const classes = useStyles();

	const [user, setUser] = useState({ email: "", password: "" });

	const { handleLogin } = useContext(AuthContext);

	const handleChangeInput = e => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handlSubmit = e => {
		e.preventDefault();
		handleLogin(user);
	};

	
	return (
		<div className={classes.root} style={{overflowX:'hidden'}}>
		<Container style={{padding:'0',overflowX:'hidden'}}component="main" maxWidth="xs">
			<CssBaseline/>
			<div className={classes.efeito1}>
				<img src={efeito1} alt=""/>
			</div>
			<div className={classes.efeito3}>
				<img src={efeito3} alt=''/>
			</div>
			<div className={classes.elipse}></div>
			<div className={classes.logozpcm}>
				<img className={classes.logozp} style={{overflowX:'hidden'}}src={logo} alt="Whats"/>
			</div>
			<div className={classes.paper}>				
				<div classname={classes.texto01}><p style={{color:'#0c2c54', margin: '0px', fontSize:'64px',}}>Entrar</p></div>
				<div classname={classes.txt02} style={{marginTop: '10px', fontFamily: 'Roboto', fontSize: '16px',fontWeight:'500', color:'white'}}>Cadastre-se no Zapcomm</div>
				{/*<Typography component="h1" variant="h5">
					{i18n.t("login.title")}
				</Typography>*/}
				<form className={classes.form} noValidate onSubmit={handlSubmit}>
				<InputLabel htmlFor="plan-selection" className={classes.ilname}>Email</InputLabel>
					<TextField 
						margin="normal"
						id="email"
						
						required
						name="email"
						value={user.email}
						onChange={handleChangeInput}
						autoComplete="email"
						autoFocus
						className={classes.inp1}
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
							/><br/>
				<InputLabel htmlFor="plan-selection" className={classes.ilname}>Senha</InputLabel>
					<TextField
						className={classes.inp2}
						//variant="outlined" deixa contornado essa variant
						margin="normal"
						required
						fullWidth
						name="password"
						
						type="password"
						id="password"
						value={user.password}
						onChange={handleChangeInput}
						autoComplete="current-password"
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
					/><br/>
					
					{<Grid>
					  <Grid item>
						<Link 
						component={RouterLink} 
						to="/forgetpsw" 
						variant="body2" 
						style={{color:'#0c2c54',fontWeight:'600' }}>
						  Esqueceu sua senha?
						</Link>
					  </Grid>
					</Grid>}
					{ <Grid container>
						<Grid item>
							<Link
								style={{ paddingLeft:'250px',color:'#0c2c54',fontWeight:'600', marginTop: '10px'}}
								href="#"
								variant="body2"
								component={RouterLink}
								to="/signup"
								className={classes.registrese}
							>
								{i18n.t("login.buttons.register")}
							</Link>
						</Grid>
					</Grid> }
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color=""
						className={classes.submit}
					>
						{i18n.t("login.buttons.submit")}
					</Button>
					
				</form>
			
			</div>
			<Box mt={8}><Copyright /></Box>
		</Container>
		</div>
	);
};

export default Login;
