import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  CircularProgress,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import thrash from "../../assets/thrashcan2.jpg";

const useStyles = makeStyles((theme) => ({

  botao1: {
    position:"relative",
    top:"450px",
    left:"140px",
  },

  queues1:  {
    backgroundColor: "red",
    "& .MuiInputBase-root": {
      backgroundColor: "red", // Isso estiliza o fundo da parte de seleção
    }
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
    top: "895px",
    left: "265px"
    
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },

  container1: {
    width: "850.43px",
    height: "1000px",
    backgroundColor: "#D9D9D9",
    borderRadius: "16px",
    position: "relative",
    left: "15px",
    top: "50px",
    zIndex: "0",
  },

  line: {
    height: "2px",
    width: "850px",
    backgroundColor: "black", 
    position: "relative",
    top: "10px", 
    left:"50px",
  }
}));

const SessionSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

const WhatsAppModal = ({ open, onClose, whatsAppId }) => {
  const classes = useStyles();
  const initialState = {
    name: "",
    greetingMessage: "",
    complationMessage: "",
    outOfHoursMessage: "",
    ratingMessage: "",
    isDefault: false,
    token: "",
    provider: "beta",
    //timeSendQueue: 0,
    //sendIdQueue: 0,
    expiresInactiveMessage: "",
    expiresTicket: 0,
    timeUseBotQueues: 0,
    maxUseBotQueues: 3
  };
  const [whatsApp, setWhatsApp] = useState(initialState);
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);
  const [queues, setQueues] = useState([]);
  const [selectedQueueId, setSelectedQueueId] = useState(null)
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [prompts, setPrompts] = useState([]);
  
    useEffect(() => {
    const fetchSession = async () => {
      if (!whatsAppId) return;

      try {
        const { data } = await api.get(`whatsapp/${whatsAppId}?session=0`);
        setWhatsApp(data);

        const whatsQueueIds = data.queues?.map((queue) => queue.id);
        setSelectedQueueIds(whatsQueueIds);
		setSelectedQueueId(data.transferQueueId);
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, [whatsAppId]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/prompt");
        setPrompts(data.prompts);
      } catch (err) {
        toastError(err);
      }
    })();
  }, [whatsAppId]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/queue");
        setQueues(data);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  const handleSaveWhatsApp = async (values) => {
const whatsappData = {
      ...values, queueIds: selectedQueueIds, transferQueueId: selectedQueueId,
      promptId: selectedPrompt ? selectedPrompt : null
    };
    delete whatsappData["queues"];
    delete whatsappData["session"];

    try {
      if (whatsAppId) {
        await api.put(`/whatsapp/${whatsAppId}`, whatsappData);
      } else {
        await api.post("/whatsapp", whatsappData);
      }
      toast.success(i18n.t("whatsappModal.success"));
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  const handleChangeQueue = (e) => {
    setSelectedQueueIds(e);
    setSelectedPrompt(null);
  };

  const handleChangePrompt = (e) => {
    setSelectedPrompt(e.target.value);
    setSelectedQueueIds([]);
  };

  const handleClose = () => {
    onClose();
    setWhatsApp(initialState);
	  setSelectedQueueId(null);
    setSelectedQueueIds([]);
  };

  return (


    
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle style={{position:"relative",
          left:"30px",
          top:"30px",
        }}>
          {whatsAppId
            ? i18n.t("whatsappModal.title.edit")
            : i18n.t("whatsappModal.title.add")}
        </DialogTitle>
        <div>
          <div className={classes.line}></div>
        </div>
        <div>
          
        </div>
        <Formik
          initialValues={whatsApp}
          enableReinitialize={true}
          validationSchema={SessionSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveWhatsApp(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, touched, errors, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.container1}>
                  <Grid spacing={2} container>
                    <Grid item>
                      <Field
                        as={TextField}
                        label={i18n.t("whatsappModal.form.name")}
                        autoFocus
                        name="name"
                        error={touched.name && Boolean(errors.name)}
                        variant="outlined"
                        margin="dense"
                        className={classes.textField}
                        style={{position:"relative",
                          left:"50px",      
                          backgroundColor:"#F5F5F5",
                          color:"#0C2454",
                          borderRadius:"10px",
                          width:"80%",
                                         }}
                      />
                    </Grid>
                    <Grid style={{ paddingTop: 15 }} item>
                      <FormControlLabel
                        control={
                          <Field
                            as={Switch}
                            color="#0C2454"
                            name="isDefault"
                            checked={values.isDefault}
                          />
                        }
                        label={i18n.t("whatsappModal.form.default")}
                        style={{color: "#0C2454",
                          position: "relative",
                          left: "50px",
                          
                        }}
                      />
                    </Grid>
                  </Grid>
                  <div>
                  <Field
                    as={TextField}
                    label={i18n.t("queueModal.form.greetingMessage")}
                    type="greetingMessage"
                    multiline
                    rows={4}
                    
                    name="greetingMessage"
                    error={
                      touched.greetingMessage && Boolean(errors.greetingMessage)
                    }
                    helperText={
                      touched.greetingMessage && errors.greetingMessage
                    }
                    variant="outlined"
                    margin="dense"
                    style={{backgroundColor:"#F5F5F5",
                      width:"40%",
                      position:"relative",
                      left:"40px",
                      borderRadius:"10px",
                    }}
                  />
                  <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  
                  style={{width:"20.86px,",
                    height:"35.86px"
                  }}
                  className={classes.botao1}
                >
                  <div><img src={thrash} style={{transform:"scale(0.5)",
                    borderRadius:"10px"
                  }}className={classes.botao1}></img></div>
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                  style={{backgroundColor:"#0C2454",
                    color:"white",
                    position:"relative",
                    bottom:"5px",
                  }}
                >
                  {whatsAppId
                    ? i18n.t("whatsappModal.buttons.okEdit")
                    : i18n.t("whatsappModal.buttons.okAdd")}
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
                </div>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t("queueModal.form.complationMessage")}
                    type="complationMessage"
                    multiline
                    rows={4}
                    fullWidth
                    name="complationMessage"
                    error={
                      touched.complationMessage &&
                      Boolean(errors.complationMessage)
                    }
                    helperText={
                      touched.complationMessage && errors.complationMessage
                    }
                    variant="outlined"
                    margin="dense"
                    style={{width:"40%",
                      position:"relative",
                      backgroundColor:"#F5F5F5",
                      left:"40px",
                      borderRadius:"10px",
                    }}
                  />
                </div>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t("queueModal.form.outOfHoursMessage")}
                    type="outOfHoursMessage"
                    multiline
                    rows={4}
                    fullWidth
                    name="outOfHoursMessage"
                    error={
                      touched.outOfHoursMessage &&
                      Boolean(errors.outOfHoursMessage)
                    }
                    helperText={
                      touched.outOfHoursMessage && errors.outOfHoursMessage
                    }
                    variant="outlined"
                    margin="dense"
                    style={{width:"40%",
                      position:"relative",
                      backgroundColor:"#F5F5F5",
                      left:"400px",
                      bottom:"218.5px",
                      borderRadius:"10px",}}
                  />
                </div>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t("queueModal.form.ratingMessage")}
                    type="ratingMessage"
                    multiline
                    rows={4}
                    fullWidth
                    name="ratingMessage"
                    error={
                      touched.ratingMessage && Boolean(errors.ratingMessage)
                    }
                    helperText={touched.ratingMessage && errors.ratingMessage}
                    variant="outlined"
                    margin="dense"
                    style={{width:"40%",
                      position:"relative",
                      backgroundColor:"#F5F5F5",
                      left:"400px",
                      bottom:"218.5px",
                      borderRadius:"10px",}}
                  />
                </div>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t("queueModal.form.token")}
                    type="token"
                    
                    name="token"
                    variant="outlined"
                    margin="dense"
                    style={{width:"82.5%",
                      position:"relative",
                      backgroundColor:"#F5F5F5",
                      bottom:"218.5px",
                      left:"40px",
                      borderRadius:"10px",}}
                  />
                </div>
                <FormControl
                  margin="dense"
                  variant="outlined"
                  style={{width:"82.5%",
                    position:"relative",
                    backgroundColor:"#F5F5F5",
                    borderRadius:"10px",
                    left:"40px",
                    bottom:"220px",}}

                >
                  <InputLabel>
                    {i18n.t("whatsappModal.form.prompt")}
                  </InputLabel>
                  <Select
                    labelId="dialog-select-prompt-label"
                    id="dialog-select-prompt"
                    name="promptId"
                    value={selectedPrompt || ""}
                    onChange={handleChangePrompt}
                    label={i18n.t("whatsappModal.form.prompt")}
                    fullWidth
                    MenuProps={{
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      getContentAnchorEl: null,
                    }}
                  >
                    {prompts.map((prompt) => (
                      <MenuItem
                        key={prompt.id}
                        value={prompt.id}
                      >
                        {prompt.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* botao problematico */}
                <QueueSelect
                  selectedQueueIds={selectedQueueIds}
                  onChange={(selectedIds) => handleChangeQueue(selectedIds)}
                  style={{backgroundColor:"#F5F5F5",
                    width:"82.5%",
                    left:"40px",
                    borderRadius:"10px",
                    bottom:"222.5px",
                  }}
                  
                />  
                
                </div>
                
               

                
                
                <div style={{position:"relative",
                  bottom:"500px",
                  width:"75%",
                  left:"60px",
                }}>
                  <h3>{i18n.t("whatsappModal.form.queueRedirection")}</h3>
                  <p>{i18n.t("whatsappModal.form.queueRedirectionDesc")}</p>
				<Grid container spacing={2}>
                  <Grid item sm={6} >
                    <Field
                      fullWidth
                      type="number"
                      as={TextField}
                      label='Transferir após x (minutos)'
                      name="timeToTransfer"
                      error={touched.timeToTransfer && Boolean(errors.timeToTransfer)}
                      helperText={touched.timeToTransfer && errors.timeToTransfer}
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                      InputLabelProps={{ shrink: values.timeToTransfer ? true : false,
                        style: { color: "white" },  // Cor do rótulo (label)
                       }}
                       InputProps={{
                        style: { color: "white" },  // Cor do texto dentro do campo
                      }}
                      style={{color:"white",
                        backgroundColor:"#0C2454",
                        borderRadius:"10px",
                      }}
                    />

                  </Grid>

                  <Grid item sm={6}>
                    <QueueSelect
                      selectedQueueIds={selectedQueueId}
                      onChange={(selectedId) => {
                        setSelectedQueueId(selectedId)
                      }}
                      multiple={false}
                      title={'Fila de Transferência'}
                    />
                  </Grid>

                  </Grid>
                  <Grid spacing={2} container>
                    {/* ENCERRAR CHATS ABERTOS APÓS X HORAS */}
                    <Grid xs={12} md={12} item>
                      <Field
                        as={TextField}
                        label={i18n.t("whatsappModal.form.expiresTicket")}
                        fullWidth
                        name="expiresTicket"
                        variant="outlined"
                        margin="dense"
                        error={touched.expiresTicket && Boolean(errors.expiresTicket)}
                        helperText={touched.expiresTicket && errors.expiresTicket}
                        style={{backgroundColor:"#F5F5F5",
                          borderRadius:"10px",
                        }
                      }
                      />
                    </Grid>
                  </Grid>
                  {/* MENSAGEM POR INATIVIDADE*/}
                  <div>
                    <Field
                      as={TextField}
                      label={i18n.t("whatsappModal.form.expiresInactiveMessage")}
                      multiline
                      rows={4}
                      fullWidth
                      name="expiresInactiveMessage"
                      error={touched.expiresInactiveMessage && Boolean(errors.expiresInactiveMessage)}
                      helperText={touched.expiresInactiveMessage && errors.expiresInactiveMessage}
                      variant="outlined"
                      margin="dense"
                      style={{backgroundColor:"#F5F5F5",
                        borderRadius:"10px",
                      }
                    }
                    />
                  </div>
                </div>
              </DialogContent>
              <DialogActions>
                
                
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default React.memo(WhatsAppModal);
