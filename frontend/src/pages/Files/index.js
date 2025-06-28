import React, {
    useState,
    useEffect,
    useReducer,
    useCallback,
    useContext,
} from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import FileModal from "../../components/FileModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";

const reducer = (state, action) => {
    if (action.type === "LOAD_FILES") {
        const files = action.payload;
        const newFiles = [];

        files.forEach((fileList) => {
            const fileListIndex = state.findIndex((s) => s.id === fileList.id);
            if (fileListIndex !== -1) {
                state[fileListIndex] = fileList;
            } else {
                newFiles.push(fileList);
            }
        });

        return [...state, ...newFiles];
    }

    if (action.type === "UPDATE_FILES") {
        const fileList = action.payload;
        const fileListIndex = state.findIndex((s) => s.id === fileList.id);

        if (fileListIndex !== -1) {
            state[fileListIndex] = fileList;
            return [...state];
        } else {
            return [fileList, ...state];
        }
    }

    if (action.type === "DELETE_TAG") {
        const fileListId = action.payload;

        const fileListIndex = state.findIndex((s) => s.id === fileListId);
        if (fileListIndex !== -1) {
            state.splice(fileListIndex, 1);
        }
        return [...state];
    }

    if (action.type === "RESET") {
        return [];
    }
};

const useStyles = makeStyles((theme) => ({
    mainPaper: {
        flex: 1,
        padding: theme.spacing(1),
        overflowY: "scroll",
        borderRadius: "16px",
        ...theme.scrollbarStyles,
    },
    traco: {
        height: '2px',
        width: '100%',
        backgroundColor: '#0C2454',
        marginLeft: '0px',
      },
      fundo: {
		marginTop:'80px',
		backgroundColor:'white',
		width:'90%',
		height:'80%',
		marginLeft:'67px',
		borderRadius:'18px',
		padding:'16px',
	  },
}));

const FileLists = () => {
    const classes = useStyles();

    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [selectedFileList, setSelectedFileList] = useState(null);
    const [deletingFileList, setDeletingFileList] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const [files, dispatch] = useReducer(reducer, []);
    const [fileListModalOpen, setFileListModalOpen] = useState(false);

    const fetchFileLists = useCallback(async () => {
        try {
            const { data } = await api.get("/files/", {
                params: { searchParam, pageNumber },
            });
            dispatch({ type: "LOAD_FILES", payload: data.files });
            setHasMore(data.hasMore);
            setLoading(false);
        } catch (err) {
            toastError(err);
        }
    }, [searchParam, pageNumber]);

    const socketManager = useContext(SocketContext);

    useEffect(() => {
        dispatch({ type: "RESET" });
        setPageNumber(1);
    }, [searchParam]);

    useEffect(() => {
        setLoading(true);
        const delayDebounceFn = setTimeout(() => {
            fetchFileLists();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchParam, pageNumber, fetchFileLists]);

    useEffect(() => {
        const socket = socketManager.getSocket(user.companyId);

        socket.on(`company-${user.companyId}-file`, (data) => {
            if (data.action === "update" || data.action === "create") {
                dispatch({ type: "UPDATE_FILES", payload: data.files });
            }

            if (data.action === "delete") {
                dispatch({ type: "DELETE_USER", payload: +data.fileId });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [socketManager, user]);

    const handleOpenFileListModal = () => {
        setSelectedFileList(null);
        setFileListModalOpen(true);
    };

    const handleCloseFileListModal = () => {
        setSelectedFileList(null);
        setFileListModalOpen(false);
    };

    const handleSearch = (event) => {
        setSearchParam(event.target.value.toLowerCase());
    };

    const handleEditFileList = (fileList) => {
        setSelectedFileList(fileList);
        setFileListModalOpen(true);
    };

    const handleDeleteFileList = async (fileListId) => {
        try {
            await api.delete(`/files/${fileListId}`);
            toast.success(i18n.t("files.toasts.deleted"));
        } catch (err) {
            toastError(err);
        }
        setDeletingFileList(null);
        setSearchParam("");
        setPageNumber(1);

        dispatch({ type: "RESET" });
        setPageNumber(1);
        await fetchFileLists();
    };

    const loadMore = () => {
        setPageNumber((prevState) => prevState + 1);
    };

    const handleScroll = (e) => {
        if (!hasMore || loading) return;
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - (scrollTop + 100) < clientHeight) {
            loadMore();
        }
    };

    return (
           
           <div className={classes.fundo}>
                <div className={classes.listadearq}>

                <ConfirmationModal
                title={deletingFileList && `${i18n.t("files.confirmationModal.deleteTitle")}`}
                open={confirmModalOpen}
                onClose={setConfirmModalOpen}
                onConfirm={() => handleDeleteFileList(deletingFileList.id)}
            >
                {i18n.t("files.confirmationModal.deleteMessage")}
            </ConfirmationModal>
            <FileModal
                open={fileListModalOpen}
                onClose={handleCloseFileListModal}
                reload={fetchFileLists}
                aria-labelledby="form-dialog-title"
                fileListId={selectedFileList && selectedFileList.id}
            />
            <MainHeader>
                <Title>
                    
                    {i18n.t("files.title")} ({files.length})</Title>
                <MainHeaderButtonsWrapper>
                    
                    {/* Input Pesquisa */}
                    <TextField
                        style={{backgroundColor: '#D9D9D9', borderRadius: '7px', paddingLeft: '6px', height:'36.5px'}}
                        placeholder={i18n.t("contacts.searchPlaceholder")}
                        type="search"
                        value={searchParam}
                        onChange={handleSearch}
                        InputProps={{
                            disableUnderline: true, // remove a linha
                            style: {
                              color: '#0C2454', // cor do texto normal
                              fontWeight: 'bold', // texto em negrito
                            },
                            inputProps: {
                              style: {
                                paddingLeft: '8px', // espaçamento à esquerda
                                '&::placeholder': {
                                  color: '#0C2454',
                                  fontWeight: 'bold',
                                  opacity: 1, // cor do placeholder
                                  paddingLeft: '8px', // opcional: para adicionar espaço ao placeholder
                                },
                              },
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <SearchIcon style={{ color: '#0C2454' }} />
                              </InputAdornment>
                            ),
                          }}
                    />
                    
                    {/* + Arquivo */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenFileListModal}
                    >
                        {`+ ${i18n.t("fileModal.buttons.fileOptions")}`}
                    </Button>
                </MainHeaderButtonsWrapper>
            </MainHeader>
            <div className={classes.traco}></div>
                <Table size="small" style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <TableHead>
                        <TableRow>
                            
                            {/* Nome */}
                            <TableCell 
                                align="center"
                                style={{color: '#0C2454', fontSize: '17px', fontWeight: 'bold'}}>{i18n.t("files.table.name")}</TableCell>
                            
                            {/* Ações */}
                            <TableCell 
                                style={{color: '#0C2454', fontSize: '17px', fontWeight: 'bold'}}
                                align="center">
                                {i18n.t("files.table.actions")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <>
                            {files.map((fileList) => (
                               <TableRow style={{ backgroundColor: '#D9D9D9' }} key={fileList.id}>
                               <TableCell 
                                   style={{
                                       color: '#0C2454', 
                                       fontWeight: 'bold', 
                                       borderRadius: '7px 0 0 7px', // Aplica border-radius apenas na esquerda
                                       overflow: 'hidden' // Para evitar que o conteúdo transborde
                                   }}
                                   align="center">
                                   {fileList.name}
                               </TableCell>
                               <TableCell 
                                   align="center"
                                   style={{
                                       color: '#0C2454', 
                                       fontSize: '17px', 
                                       fontWeight: 'bold', 
                                       borderRadius: '0 7px 7px 0', // Aplica border-radius apenas na direita
                                       overflow: 'hidden' // Para evitar que o conteúdo transborde
                                   }}>
                                   <IconButton 
                                       style={{ color: '#0C2454' }} 
                                       size="small" 
                                       onClick={() => handleEditFileList(fileList)}>
                                       <EditIcon />
                                   </IconButton>
                           
                                   <IconButton
                                       style={{ color: '#D3343E' }} 
                                       size="small" 
                                       onClick={(e) => {
                                           setConfirmModalOpen(true);
                                           setDeletingFileList(fileList);
                                       }}>
                                       <DeleteOutlineIcon />
                                   </IconButton>
                               </TableCell>
                           </TableRow>
                            ))}
                            {loading && <TableRowSkeleton columns={4} />}
                        </>
                    </TableBody>
                </Table>
                </div> 
                </div>
    );
};

export default FileLists;
