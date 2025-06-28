import React, { useState } from "react";
import qs from "query-string";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import moment from "moment";
import logo from "../../assets/logo.png";
import { toast } from 'react-toastify'; 
import toastError from '../../errors/toastError';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import efeito1 from "../../assets/efeito1.png";
import efeito3 from "../../assets/efeito3.png";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    background: "white", //Cor de fundo
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  paper: {
    backgroundColor:'#34D3A3',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "55px 30px",
    borderRadius: "12.5px",
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
    color: "white",
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
  redefs: {
    color:'#0c2c54', 
    margin: '0px',
    fontSize:'30px',
    marginBottom: '20px'
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
		width: '180px',
		marginLeft: '5px',
    textAlign: 'left'

	},
}));

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const ForgetPassword = () => {
  const classes = useStyles();
  const history = useHistory();
  let companyId = null;
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showResetPasswordButton, setShowResetPasswordButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(""); // Estado para mensagens de erro

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
    if (showAdditionalFields) {
      setShowResetPasswordButton(false);
    } else {
      setShowResetPasswordButton(true);
    }
  };

  const params = qs.parse(window.location.search);
  if (params.companyId !== undefined) {
    companyId = params.companyId;
  }

  const initialState = { email: "" };

  const [user] = useState(initialState);
  const dueDate = moment().add(3, "day").format();

const handleSendEmail = async (values) => {
  const email = values.email;
  try {
    const response = await api.post(
      `${process.env.REACT_APP_BACKEND_URL}/forgetpassword/${email}`
    );
    console.log("API Response:", response.data);

    if (response.data.status === 404) {
      toast.error("Email não encontrado");
    } else {
      toast.success(i18n.t("Email enviado com sucesso!"));
    }
  } catch (err) {
    console.log("API Error:", err);
    toastError(err);
  }
};

  const handleResetPassword = async (values) => {
    const email = values.email;
    const token = values.token;
    const newPassword = values.newPassword;
    const confirmPassword = values.confirmPassword;

    if (newPassword === confirmPassword) {
      try {
        await api.post(
          `${process.env.REACT_APP_BACKEND_URL}/resetpasswords/${email}/${token}/${newPassword}`
        );
        setError(""); // Limpe o erro se não houver erro
        toast.success(i18n.t("Senha redefinida com sucesso."));
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const isResetPasswordButtonClicked = showResetPasswordButton;
  const UserSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    newPassword: isResetPasswordButtonClicked
      ? Yup.string()
          .required("Campo obrigatório")
          .matches(
            passwordRegex,
            "Sua senha precisa ter no mínimo 8 caracteres, sendo uma letra maiúscula, uma minúscula e um número."
          )
      : Yup.string(), // Sem validação se não for redefinição de senha
    confirmPassword: Yup.string().when("newPassword", {
      is: (newPassword) => isResetPasswordButtonClicked && newPassword,
      then: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "As senhas não correspondem")
        .required("Campo obrigatório"),
      otherwise: Yup.string(), // Sem validação se não for redefinição de senha
    }),
  });

  return (
    <div className={classes.root}>
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
          <img style={{ margin: "0 auto", height: "90px", width: "100%" }} src={logo} alt="Whats"/>
        </div>
        <div className={classes.paper}>    
          <Typography component="h1" variant="h5" className={classes.redefs}>
            {i18n.t("Redefinir senha")}
            
          </Typography>
          <Formik
            initialValues={{
              email: "",
              token: "",
              newPassword: "",
              confirmPassword: "",
            }}
            enableReinitialize={true}
            validationSchema={UserSchema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                if (showResetPasswordButton) {
                  handleResetPassword(values);
                } else {
                  handleSendEmail(values);
                }
                actions.setSubmitting(false);
                toggleAdditionalFields();
              }, 400);
            }}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
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
                  {showAdditionalFields && (
                    <>
                      <Grid item xs={12}>
                      <InputLabel htmlFor="plan-selection" className={classes.ilname}>Código de Verificação</InputLabel>
                        <Field
                          as={TextField}
                          //variant="outlined"
                          fullWidth
                          id="token"
                          
                          name="token"
                          error={touched.token && Boolean(errors.token)}
                          helperText={touched.token && errors.token}
                          autoComplete="off"
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
                      <InputLabel htmlFor="plan-selection" className={classes.ilname}>Nova Senha</InputLabel>
                        <Field
                          as={TextField}
                          //variant="outlined"
                          fullWidth
                          type={showPassword ? "text" : "password"}
                          id="newPassword"
                         
                          name="newPassword"
                          error={
                            touched.newPassword &&
                            Boolean(errors.newPassword)
                          }
                          helperText={
                            touched.newPassword && errors.newPassword
                          }
                          autoComplete="off"
                          required
                          InputProps={{
                            disableUnderline: true, // remove a linha
                            style: {
                              color: '#FFFFFF', // cor do texto normal
                              fontWeight: 'bold', // texto em negrito
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} style={{ color: '#FFFFFF' }}>
                                  {showPassword ? <VisibilityIcon style={{ color: '#FFFFFF' }} /> : <VisibilityOffIcon style={{ color: '#FFFFFF' }} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{
                            style: {
                              color: '#FFFFFF', // cor do label
                              opacity: 1, // visibilidade total
                            },
                          }}
                         
                          inputProps={{
                            style: {
                              color: '#FFFFFF', // cor do placeholder
                            },
                          }}
                          className={classes.input}
                        />
                      </Grid>
                      <Grid item xs={12}>
                      <InputLabel htmlFor="plan-selection" className={classes.ilname}>Confirmar Senha</InputLabel>
                        <Field
                          as={TextField}
                          //variant="outlined"
                          fullWidth
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          
                          name="confirmPassword"
                          error={
                            touched.confirmPassword &&
                            Boolean(errors.confirmPassword)
                          }
                          helperText={
                            touched.confirmPassword &&
                            errors.confirmPassword
                          }
                          autoComplete="off"
                          required
                          InputProps={{
                            disableUnderline: true, // remove a linha
                            style: {
                              color: '#FFFFFF', // cor do texto normal
                              fontWeight: 'bold', // texto em negrito
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} style={{ color: '#FFFFFF' }}>
                                  {showPassword ? <VisibilityIcon style={{ color: '#FFFFFF' }} /> : <VisibilityOffIcon style={{ color: '#FFFFFF' }} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{
                            style: {
                              color: '#FFFFFF', // cor do label
                              opacity: 1, // visibilidade total
                            },
                          }}
                          
                          inputProps={{
                            style: {
                              color: '#FFFFFF', // cor do placeholder
                            },
                          }}
                          className={classes.input}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                {showResetPasswordButton ? (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color=""
                    className={classes.submit}
                  >
                    Redefinir Senha
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color=""
                    className={classes.submit}
                  >
                    Enviar Email
                  </Button>
                )}
                <Grid container justifyContent="center">
                  <Grid item>
                    <Link
                      href="#"
                      variant="body2"
                      component={RouterLink}
                      to="/signup"
                      style={{color:'#0c2c54',fontWeight:'600', marginTop: '10px'}}
                    >
                      {i18n.t("Não tem uma conta? Cadastre-se!")}
                    </Link>
                  </Grid>
                </Grid>
                {error && (
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                )}
              </Form>
            )}
          </Formik>
        </div>
        <Box mt={5} />
      </Container>
    </div>
  );
};

export default ForgetPassword;
