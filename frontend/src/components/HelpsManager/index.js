import React, { useState, useEffect } from "react";
import {
    makeStyles,
    Paper,
    Grid,
    TextField,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    useMediaQuery
} from "@material-ui/core";
import { Formik, Form, Field } from 'formik';
import ButtonWithSpinner from "../ButtonWithSpinner";
import ConfirmationModal from "../ConfirmationModal";

import { Edit as EditIcon } from "@material-ui/icons";

import { toast } from "react-toastify";
import useHelps from "../../hooks/useHelps";


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    mainPaper: {
        width: '100%',
        flex: 1,
        padding: theme.spacing(2),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(1),
        },
    },
    fullWidth: {
        width: '100%',
    },
    tableContainer: {
        width: '100%',
        overflowX: "auto", // Garantir rolagem em telas pequenas
        ...theme.scrollbarStyles,
    },
    textfield: {
        width: '100%',
        [theme.breakpoints.down("xs")]: {
            marginBottom: theme.spacing(1), // Espaço adicional para telas menores
        },
    },
    textRight: {
        textAlign: 'right',
        [theme.breakpoints.down("xs")]: {
            textAlign: 'center', // Centraliza textos para telas pequenas
        },
    },
    row: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },
    control: {
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(0.5),
        },
    },
    buttonContainer: {
        textAlign: 'right',
        padding: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            textAlign: 'center', // Centraliza botões em telas menores
        },
    },
    tableHeadCell: {
        color: '#0C2454',
        fontWeight: 'bold',
        fontSize: '1rem',
        [theme.breakpoints.down("xs")]: {
            fontSize: '0.8rem', // Reduz tamanho da fonte em telas pequenas
        },
    },
    tableRowCell: {
        backgroundColor: '#D9D9D9',
        color: '#0C2454',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        [theme.breakpoints.down("xs")]: {
            fontSize: '0.7rem',
            padding: theme.spacing(0.5), // Reduz padding em telas pequenas
        },
    },
    tableRow: {
        marginBottom: '100px',
    }
}));

export function HelpManagerForm(props) {
    const { onSubmit, onDelete, onCancel, initialValue, loading } = props;
    const classes = useStyles();
    const isMobile = useMediaQuery("(max-width:600px)"); // Verifica se a tela é pequena

    const [record, setRecord] = useState(initialValue);

    useEffect(() => {
        setRecord(initialValue);
    }, [initialValue]);

    const handleSubmit = async (data) => {
        onSubmit(data);
    };

    return (
        <Formik
            enableReinitialize
            className={classes.fullWidth}
            initialValues={record}
            onSubmit={(values, { resetForm }) =>
                setTimeout(() => {
                    handleSubmit(values);
                    resetForm();
                }, 500)
            }
        >
            {() => (
                <Form className={classes.fullWidth}>
                    <Grid spacing={isMobile ? 1 : 2} justifyContent="flex-end" container>
                        <Grid xs={12} sm={6} md={3} item>
                            <Field
                                as={TextField}
                                label="Título"
                                name="title"
                                variant="outlined"
                                className={classes.textfield}
                                margin="dense"
                                InputProps={{
                                    disableUnderline: true,
                                    style: {
                                        backgroundColor: '#D9D9D9',
                                        color: '#0C2454',
                                        paddingLeft: '8px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid xs={12} sm={6} md={3} item>
                            <Field
                                as={TextField}
                                label="Código do Vídeo"
                                name="video"
                                variant="outlined"
                                className={classes.textfield}
                                margin="dense"
                                InputProps={{
                                    disableUnderline: true,
                                    style: {
                                        backgroundColor: '#D9D9D9',
                                        color: '#0C2454',
                                        paddingLeft: '8px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid xs={12} md={6} item>
                            <Field
                                as={TextField}
                                label="Descrição"
                                name="description"
                                variant="outlined"
                                className={classes.textfield}
                                margin="dense"
                                InputProps={{
                                    disableUnderline: true,
                                    style: {
                                        backgroundColor: '#D9D9D9',
                                        color: '#0C2454',
                                        paddingLeft: '8px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid xs={12} sm={4} md={2} item>
                            <ButtonWithSpinner
                                className={classes.fullWidth}
                                loading={loading}
                                onClick={() => onCancel()}
                                variant="contained"
                                style={{
                                    color: '#0C2454',
                                    backgroundColor: '#CCCCCC',
                                }}
                            >
                                Limpar
                            </ButtonWithSpinner>
                        </Grid>
                        {record.id !== undefined ? (
                            <Grid xs={12} sm={4} md={2} item>
                                <ButtonWithSpinner
                                    className={classes.fullWidth}
                                    loading={loading}
                                    onClick={() => onDelete(record)}
                                    variant="contained"
                                    color="secondary"
                                >
                                    Excluir
                                </ButtonWithSpinner>
                            </Grid>
                        ) : null}
                        <Grid xs={12} sm={4} md={2} item>
                            <ButtonWithSpinner
                                className={classes.fullWidth}
                                loading={loading}
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Salvar
                            </ButtonWithSpinner>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}

export function HelpsManagerGrid(props) {
    const { records, onSelect } = props;
    const classes = useStyles();

    return (
        <div className={classes.tableContainer}>
            <Table className={classes.fullWidth} size="small" style={{ borderCollapse: 'separate', borderSpacing: '0 20px' }}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" className={classes.tableHeadCell}>Título</TableCell>
                        <TableCell align="center" className={classes.tableHeadCell}>Descrição</TableCell>
                        <TableCell align="center" className={classes.tableHeadCell}>Vídeo</TableCell>
                        <TableCell align="center" className={classes.tableHeadCell}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell align="center" className={classes.tableRowCell}>{row.title || '-'}</TableCell>
                            <TableCell align="center" className={classes.tableRowCell}>{row.description || '-'}</TableCell>
                            <TableCell align="center" className={classes.tableRowCell}>{row.video || '-'}</TableCell>
                            <TableCell align="center" className={classes.tableRowCell}>
                                <IconButton onClick={() => onSelect(row)} aria-label="edit">
                                    <EditIcon style={{ color: '#0C2454' }} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default function HelpsManager() {
    const classes = useStyles();
    const { list, save, update, remove } = useHelps();

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [record, setRecord] = useState({
        title: '',
        description: '',
        video: ''
    });

    useEffect(() => {
        async function fetchData() {
            await loadHelps();
        }
        fetchData();
    }, []);

    const loadHelps = async () => {
        setLoading(true);
        try {
            const helpList = await list();
            setRecords(helpList);
        } catch (e) {
            toast.error('Não foi possível carregar a lista de registros');
        }
        setLoading(false);
    };

    const handleSubmit = async (data) => {
        setLoading(true);
        try {
            if (data.id !== undefined) {
                await update(data);
            } else {
                await save(data);
            }
            await loadHelps();
            handleCancel();
            toast.success('Operação realizada com sucesso.');
        } catch (err) {
            toast.error('Operação falhou.');
        }
        setLoading(false);
    };

    const handleDelete = async (data) => {
        try {
            await remove(data);
            toast.success('Operação realizada com sucesso.');
            await loadHelps();
        } catch (err) {
            toast.error('Operação falhou.');
        }
        setShowConfirmDialog(false);
    };

    const handleSelect = (record) => {
        setRecord(record);
    };

    const handleCancel = () => {
        setRecord({
            title: '',
            description: '',
            video: ''
        });
    };

    return (
        <Paper className={classes.mainPaper} variant="outlined">
            <HelpManagerForm
                initialValue={record}
                onSubmit={handleSubmit}
                onDelete={(record) => setShowConfirmDialog(record)}
                onCancel={handleCancel}
                loading={loading}
            />
            <HelpsManagerGrid
                records={records}
                onSelect={handleSelect}
            />
            <ConfirmationModal
                title="Exclusão"
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={() => handleDelete(record)}
            >
                Deseja realmente excluir esse registro?
            </ConfirmationModal>
        </Paper>
    );
}
