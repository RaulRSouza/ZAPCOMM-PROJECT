import React, { useState, useEffect, useReducer, useContext, useCallback } from "react";
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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import QuickMessageDialog from "../../components/QuickMessageDialog";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { Grid, withWidth } from "@material-ui/core";
import { isArray } from "lodash";
import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";


const reducer = (state, action) => {
  if (action.type === "LOAD_QUICKMESSAGES") {
    //console.log("aqui");
    //console.log(action);
    //console.log(action.payload);
    const quickmessages = action.payload;
    const newQuickmessages = [];
    //console.log(newQuickmessages);

    if (isArray(quickmessages)) {
      quickmessages.forEach((quickemessage) => {
        const quickemessageIndex = state.findIndex(
          (u) => u.id === quickemessage.id
        );
        if (quickemessageIndex !== -1) {
          state[quickemessageIndex] = quickemessage;
        } else {
          newQuickmessages.push(quickemessage);
        }
      });
    }

    return [...state, ...newQuickmessages];
  }

  if (action.type === "UPDATE_QUICKMESSAGES") {
    const quickemessage = action.payload;
    const quickemessageIndex = state.findIndex((u) => u.id === quickemessage.id);

    if (quickemessageIndex !== -1) {
      state[quickemessageIndex] = quickemessage;
      return [...state];
    } else {
      return [quickemessage, ...state];
    }
  }

  if (action.type === "DELETE_QUICKMESSAGE") {
    const quickemessageId = action.payload;

    const quickemessageIndex = state.findIndex((u) => u.id === quickemessageId);
    if (quickemessageIndex !== -1) {
      state.splice(quickemessageIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    display: "relative",
    padding: theme.spacing(1),
    ...theme.scrollbarStyles,
  },
  blueLine: {
		border: 0,
		height: "1px",
    width: '133%',
		backgroundColor: theme.palette.primary.main, // Azul da cor primária do tema
		margin: theme.spacing(2, 0), // Espaçamento vertical
   
	  },

}));

const Quickemessages = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedQuickemessage, setSelectedQuickemessage] = useState(null);
  const [deletingQuickemessage, setDeletingQuickemessage] = useState(null);
  const [quickemessageModalOpen, setQuickMessageDialogOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [quickemessages, dispatch] = useReducer(reducer, []);
  const { user } = useContext(AuthContext);
  const { profile } = user;

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchQuickemessages();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = user.companyId;
    const socket = socketManager.getSocket(companyId);

    socket.on(`company${companyId}-quickemessage`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_QUICKMESSAGES", payload: data.record });
      }
      if (data.action === "delete") {
        dispatch({ type: "DELETE_QUICKMESSAGE", payload: +data.id });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [socketManager, user.companyId]);

  const fetchQuickemessages = async () => {
    try {
      const companyId = user.companyId;
      //const searchParam = ({ companyId, userId: user.id });
      const { data } = await api.get("/quick-messages", {
        params: { searchParam, pageNumber, userId: user.id },
      });

      dispatch({ type: "LOAD_QUICKMESSAGES", payload: data.records });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenQuickMessageDialog = () => {
    setSelectedQuickemessage(null);
    setQuickMessageDialogOpen(true);
  };

  const handleCloseQuickMessageDialog = () => {
    setSelectedQuickemessage(null);
    setQuickMessageDialogOpen(false);
    //window.location.reload();
    fetchQuickemessages();
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditQuickemessage = (quickemessage) => {
    //console.log(quickemessage);
    setSelectedQuickemessage(quickemessage);
    setQuickMessageDialogOpen(true);
  };

  const handleDeleteQuickemessage = async (quickemessageId) => {
    try {
      await api.delete(`/quick-messages/${quickemessageId}`);
      toast.success(i18n.t("quickemessages.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingQuickemessage(null);
    setSearchParam("");
    setPageNumber(1);
    fetchQuickemessages();
    dispatch({ type: "RESET" });

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
    <div style={{width:'100%'}}>
    <ConfirmationModal
      title={deletingQuickemessage && `${i18n.t("quickMessages.confirmationModal.deleteTitle")} ${deletingQuickemessage.shortcode}?`}
      open={confirmModalOpen}
      onClose={setConfirmModalOpen}
      onConfirm={() => handleDeleteQuickemessage(deletingQuickemessage.id)}
    >
      {i18n.t("quickMessages.confirmationModal.deleteMessage")}
    </ConfirmationModal>
  
    <QuickMessageDialog
      resetPagination={() => {
        setPageNumber(1);
        fetchQuickemessages();
      }}
      open={quickemessageModalOpen}
      onClose={handleCloseQuickMessageDialog}
      aria-labelledby="form-dialog-title"
      quickemessageId={selectedQuickemessage && selectedQuickemessage.id}
    />
  
    <MainHeader container>
    
        <Grid item xs={12} sm={8} md={9}>
          <Title>{i18n.t("quickMessages.title")}</Title>
          <hr className={classes.blueLine} />
        </Grid>
  
        <Grid item xs={12} sm={4} md={3} style={{marginTop:'40px'}}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder={i18n.t("quickMessages.searchPlaceholder")}
                type="search"
                value={searchParam}
                onChange={handleSearch}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    backgroundColor: '#D3d3d3',
                    borderRadius: '8px',
                    color: '#0C2454',
                    fontWeight: 'bold',
                    width: '110%'
                  },
                  inputProps: {
                    style: {
                      paddingLeft: '8px',
                      '&::placeholder': {
                        color: '#0C2454',
                        fontWeight: 'bold',
                        opacity: 1,
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
            </Grid>
  
            <Grid style={{ marginBottom: "20%", height:"90%", paddingLeft:"5%" }}  item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleOpenQuickMessageDialog}
                color="primary"
                
              >
                {i18n.t("quickMessages.buttons.add")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
     
    </MainHeader>
  

      <Grid container>
        <Grid item xs={12} style={{ padding: '0 16px' }}>
          <Table
            size="medium"
            style={{
              width: '100%', // A tabela vai preencher toda a largura do container
              borderCollapse: 'separate',
              borderSpacing: '0 10px',
            }}
          >
            <TableHead>
              <TableRow style={{ border: 'none' }}>
                <TableCell align="center" style={{ border: 'none' }}>
                  {i18n.t("quickMessages.table.shortcode")}
                </TableCell>
                <TableCell align="center" style={{ border: 'none' }}>
                  {i18n.t("quickMessages.table.mediaName")}
                </TableCell>
                <TableCell align="center" style={{ border: 'none' }}>
                  {i18n.t("quickMessages.table.actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quickemessages.map((quickemessage) => (
                <TableRow key={quickemessage.id} style={{ marginBottom: '5px' }}>
                  <TableCell
                    align="center"
                    style={{
                      borderRadius: '16px 0 0 16px',
                      backgroundColor: '#D3D3D3',
                      borderRight: '1px solid #ccc',
                    }}
                  >
                    {quickemessage.shortcode}
                  </TableCell>
  
                  <TableCell
                    align="center"
                    style={{
                      backgroundColor: '#D3D3D3',
                    }}
                  >
                    {quickemessage.mediaName ?? i18n.t("quickMessages.noAttachment")}
                  </TableCell>
  
                  <TableCell
                    align="center"
                    style={{
                      borderRadius: '0 16px 16px 0',
                      backgroundColor: '#D3D3D3',
                    }}
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditQuickemessage(quickemessage)}
                    >
                      <EditIcon />
                    </IconButton>
  
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={(e) => {
                        setConfirmModalOpen(true);
                        setDeletingQuickemessage(quickemessage);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={5} />}
            </TableBody>
          </Table>
        </Grid>
      </Grid>

    </div>
  );
};

export default Quickemessages;