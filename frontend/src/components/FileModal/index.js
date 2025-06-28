import React, { useState, useEffect, useContext } from "react";

import DeleteIcon from '@material-ui/icons/Delete';

import * as Yup from "yup";
import {
    Formik,
    Form,
    Field,
    FieldArray
} from "formik";
import { toast } from "react-toastify";

import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    makeStyles,
    TextField
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AttachFileIcon from "@material-ui/icons/AttachFile";

import { green } from "@material-ui/core/colors";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        gap: 4
    },
    multFieldLine: {
        display: "flex",
        "& > *:not(:last-child)": {
            marginRight: theme.spacing(1),
        },
        
    },
    textField: {
        marginRight: theme.spacing(1),
        flex: 1,
        border: '2px solid #0C2454', // Cor e espessura da borda
        borderRadius: '8px', // Bordas arredondadas
    },

    extraAttr: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    btnWrapper: {
        position: "relative",
    },
    multFieldLine: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px',
         // Ajuste conforme necessário
    },
    
    buttonProgress: {
        color: green[500],
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12,
    },
    
    focused: {},
    error: {},
    formControl: {
        margin: theme.spacing(1),
        minWidth: 2000,
        
    },
    
    colorAdorment: {
        width: 20,
        height: 20,
    },

    
}));

const FileListSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "nome muito curto")
        .required("Obrigatório"),
    message: Yup.string()
        .required("Obrigatório")
});

const FilesModal = ({ open, onClose, fileListId, reload }) => {
    const classes = useStyles();
    const { user } = useContext(AuthContext);
    const [ files, setFiles ] = useState([]);
    const [selectedFileNames, setSelectedFileNames] = useState([]);


    const initialState = {
        name: "",
        message: "",
        options: [{ name: "", path:"", mediaType:"" }],
    };

    const [fileList, setFileList] = useState(initialState);

    useEffect(() => {
        try {
            (async () => {
                if (!fileListId) return;

                const { data } = await api.get(`/files/${fileListId}`);
                setFileList(data);
            })()
        } catch (err) {
            toastError(err);
        }
    }, [fileListId, open]);

    const handleClose = () => {
        setFileList(initialState);
        setFiles([]);
        onClose();
    };

    const handleSaveFileList = async (values) => {

        const uploadFiles = async (options, filesOptions, id) => {
                const formData = new FormData();
                formData.append("fileId", id);
                formData.append("typeArch", "fileList")
                filesOptions.forEach((fileOption, index) => {
                    if (fileOption.file) {
                        formData.append("files", fileOption.file);
                        formData.append("mediaType", fileOption.file.type)
                        formData.append("name", options[index].name);
                        formData.append("id", options[index].id);
                    }
                });
      
              try {
                const { data } = await api.post(`/files/uploadList/${id}`, formData);
                setFiles([]);
                return data;
              } catch (err) {
                toastError(err);
              }
            return null;
        }

        const fileData = { ...values, userId: user.id };
        
        try {
            if (fileListId) {
                const { data } = await api.put(`/files/${fileListId}`, fileData)
                if (data.options.length > 0)

                    uploadFiles(data.options, values.options, fileListId)
            } else {
                const { data } = await api.post("/files", fileData);
                if (data.options.length > 0)
                    uploadFiles(data.options, values.options, data.id)
            }
            toast.success(i18n.t("fileModal.success"));
            if (typeof reload == 'function') {
                reload();
            }            
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
                maxWidth="md"
                fullWidth
                scroll="paper"
                PaperProps={{
                    style: {
                        borderRadius: 22,
                    },
                }}>

                {/* Titulo do popup */}
                <DialogTitle 
                    id="form-dialog-title"
                    style={{color: '#0C2454', textAlign:'center'}}>
                    
                    {(fileListId ? `${i18n.t("fileModal.title.edit")}` : `${i18n.t("fileModal.title.add")}`)}
                </DialogTitle>
                <Formik
                    initialValues={fileList}
                    enableReinitialize={true}
                    validationSchema={FileListSchema}
                    onSubmit={(values, actions) => {
                        setTimeout(() => {
                            handleSaveFileList(values);
                            actions.setSubmitting(false);
                        }, 400);
                    }}
                >
                    {({ touched, errors, isSubmitting, values }) => (
                        <Form>
                            <DialogContent dividers>
                                <div className={classes.multFieldLine}>
                                
                                {/* Primeiro Input */}
                                <Field
    as={TextField}
    label={i18n.t("fileModal.form.name")}
    name="name"
    placeholder="Insira um nome"
    error={touched.name && Boolean(errors.name)}
    helperText={touched.name && errors.name}
    variant="outlined"
    margin="dense"
    fullWidth
    InputProps={{
        // style: {
        //     border: '1px solid #0C2454', // Borda padrão
        // },
    }}
    InputLabelProps={{
        style: {
            color: '#0C2454', // Cor do label
        },
    }}
    inputProps={{
        style: {
            padding: '10px', // Ajuste o padding se necessário
        },
    }}
                                    />
                                   
                                </div>
                                <br />
                                <div className={classes.multFieldLine}>
                                    
                                    {/* Segundo Input */}
                                    <Field
                                        as={TextField}
                                        label={i18n.t("fileModal.form.message")}
                                        type="message"
                                        placeholder="Detalhes"
                                        multiline
                                        minRows={5}
                                        fullWidth
                                        InputLabelProps={{
                                            style: {
                                                color: '#0C2454', // Cor do label
                                            },
                                        }}
                                        name="message"
                                        error={
                                            touched.message && Boolean(errors.message)
                                        }
                                        helperText={
                                            touched.message && errors.message
                                        }
                                        variant="outlined"
                                        margin="dense"
                                    />
                                </div>
                                <Typography
                                    style={{ marginBottom: 8, marginTop: 12, fontWeight: 'bold', color: '#0C2454' }}
                                    variant="subtitle1"
                                >
                                    {i18n.t("fileModal.form.fileOptions")}
                                </Typography>

                                <FieldArray name="options">
                                    {({ push, remove }) => (
                                        <>
                                            {values.options &&
                                                values.options.length > 0 &&
                                                values.options.map((info, index) => (    
                                                    <div
                                                        className={classes.extraAttr}
                                                        key={`${index}-info`}
                                                    >
                                                        <Grid container  spacing={0}>
                                                            <Grid xs={6} md={10} item> 
                                                                
                                                                {/* Terceiro Input */}
                                                                <Field
                                                                
                                                                    as={TextField}
                                                                    // label={i18n.t("fileModal.form.extraName")}
                                                                    placeholder="Mensagem para enviar com o arquivo"
                                                                    name={`options[${index}].name`}
                                                                    variant="outlined"
                                                                    margin="dense"
                                                                    multiline
                                                                    fullWidth
                                                                    minRows={2}
                                                                    className={classes.textField}
                                                                />
                                                            </Grid>     
                                                            <Grid xs={2} md={2} item style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                                                                <input
                                                                    type="file"
                                                                    onChange={(e) => {
                                                                        const selectedFile = e.target.files[0];
                                                                        const updatedOptions = [...values.options];                                                                
                                                                        updatedOptions[index].file = selectedFile;
                                                                       
                                                                        setFiles('options', updatedOptions);

                                                                        // Atualize a lista selectedFileNames para o campo específico
                                                                        const updatedFileNames = [...selectedFileNames];
                                                                        updatedFileNames[index] = selectedFile ? selectedFile.name : '';
                                                                        setSelectedFileNames(updatedFileNames);
                                                                    }}
                                                                    style={{ display: 'none' }}
                                                                    name={`options[${index}].file`}
                                                                    id={`file-upload-${index}`}
                                                                />
                                                                <label htmlFor={`file-upload-${index}`}>
                                                                    
                                                                    {/* Icone de anexar arquivo */}
                                                                    <IconButton 
                                                                        style={{color: '#0C2454'}}
                                                                        component="span">
                                                                        <AttachFileIcon />
                                                                    </IconButton>
                                                                </label>
                                                                
                                                                {/* Icone de lixeira */}
                                                                <IconButton
                                                                    style={{color: '#D3343E'}}
                                                                    size="small"
                                                                    onClick={() => remove(index)}
                                                                >
                                                                    <DeleteOutlineIcon />
                                                                </IconButton>    
                                                            </Grid>
                                                            <Grid xs={12} md={12} item>
                                                                {info.path? info.path : selectedFileNames[index]}                               
                                                            </Grid> 
                                                        </Grid>                                                    
                                                </div>                     
                                                                                           
                                                ))}
                                            <div className={classes.extraAttr}>
                                                <Button
                                                    style={{ flex: 1, marginTop: 8, color: '#fff', backgroundColor: '#0C2454' }}
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => {push({ name: "", path: ""});
                                                    setSelectedFileNames([...selectedFileNames, ""]);
                                                }}
                                                >
                                                    {`+ ${i18n.t("fileModal.buttons.fileOptions")}`}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </FieldArray>
                            </DialogContent>
                            <DialogActions>
                                
                                {/* Icone de deletar lista de arquivos */}
                                <Button
                                    style={{backgroundColor: '#D3343E'}}
                                    onClick={handleClose}
                                    color="secondary"
                                    disabled={isSubmitting}
                                    variant="outlined"
                                >
                                    <DeleteIcon style={{ marginRight: '8px', marginLeft: '8px', width: '24px', height: '24px', color: '#fff'}} /> {/* Adiciona o ícone */}
                                    
                                </Button>
                                <Button
                                    type="submit"
                                    color="primary"
                                    disabled={isSubmitting}
                                    variant="contained"
                                    className={classes.btnWrapper}
                                >
                                    {fileListId
                                        ? `${i18n.t("fileModal.buttons.okEdit")}`
                                        : `${i18n.t("fileModal.buttons.okAdd")}`}
                                    {isSubmitting && (
                                        <CircularProgress
                                            size={24}
                                            className={classes.buttonProgress}
                                        />
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

export default FilesModal;