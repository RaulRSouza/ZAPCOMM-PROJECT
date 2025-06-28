import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";
import { SocketContext } from "../../context/Socket/SocketContext";
import n8n from "../../assets/n8n.png";
import dialogflow from "../../assets/dialogflow.png";
import webhooks from "../../assets/webhook.png";
import typebot from "../../assets/typebot.jpg";
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from "@material-ui/core/styles";

import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from "@material-ui/core";

import {
  DeleteOutline,
  Edit,
  Opacity
} from "@material-ui/icons";

import SearchIcon from "@material-ui/icons/Search";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import IntegrationModal from "../../components/QueueIntegrationModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import useMediaQuery from "@material-ui/core";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import usePlans from "../../hooks/usePlans";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const reducer = (state, action) => {
  if (action.type === "LOAD_INTEGRATIONS") {
    const queueIntegration = action.payload;
    const newIntegrations = [];

    queueIntegration.forEach((integration) => {
      const integrationIndex = state.findIndex((u) => u.id === integration.id);
      if (integrationIndex !== -1) {
        state[integrationIndex] = integration;
      } else {
        newIntegrations.push(integration);
      }
    });

    return [...state, ...newIntegrations];
  }

  if (action.type === "UPDATE_INTEGRATIONS") {
    const queueIntegration = action.payload;
    const integrationIndex = state.findIndex((u) => u.id === queueIntegration.id);

    if (integrationIndex !== -1) {
      state[integrationIndex] = queueIntegration;
      return [...state];
    } else {
      return [queueIntegration, ...state];
    }
  }

  if (action.type === "DELETE_INTEGRATION") {
    const integrationId = action.payload;

    const integrationIndex = state.findIndex((u) => u.id === integrationId);
    if (integrationIndex !== -1) {
      state.splice(integrationIndex, 1);
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
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    [theme.breakpoints.down("xs")]: { // For mobile screens (small devices)
      padding: theme.spacing(1), // Reduce padding on smaller screens
      margin: theme.spacing(0.5), // Reduce margin for mobile devices
    },
  },
  avatar: {
    width: "140px",
    height: "40px",
    align: "center",
    borderRadius: 4,
    [theme.breakpoints.down("xs")]: { // For mobile devices
      width: "80px", // Smaller avatar for mobile screens
      height: "30px", // Smaller height for mobile
    },
  },
  traco: {
    height: '2px',
    width: '100%',
    backgroundColor: '#0C2454',
    marginLeft: '0px',
    marginBottom: '20px',
    [theme.breakpoints.down("xs")]: { // For mobile devices
    
    },
  },
  fundo: {
    marginTop: '80px',
    backgroundColor: 'white',
    width: '90%',
    height: '100%',
    marginLeft: '67px',
    borderRadius: '18px',
    padding: '16px',
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    [theme.breakpoints.down("xs")]: { // For small screens
      marginLeft: '10px', // Adjust the left margin for smaller screens
      width: '100%', // Make the width 100% on mobile devices
      
      padding: theme.spacing(2), // Add extra padding for mobile screens
    },
    addButton: {
      backgroundColor: theme.palette.primary.main, // Cor de fundo padrão
      color: '#fff', // Cor do texto
      padding: theme.spacing(1, 2), // Padding (ajustável com breakpoints)
      borderRadius: '8px', // Bordas arredondadas
      display: 'flex', // Para alinhar o ícone e texto
      alignItems: 'center',
      gap: '8px', // Espaço entre ícone e texto
      '&:hover': {
        backgroundColor: theme.palette.primary.dark, // Cor no hover
      },
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5, 1), // Botão menor em telas pequenas
        fontSize: '12px', // Texto menor em telas pequenas
        gap: '4px', // Menos espaço entre ícone e texto
      },
    },
  },
}));
const QueueIntegration = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [queueIntegration, dispatch] = useReducer(reducer, []);
  const { user } = useContext(AuthContext);
  const { getPlanCompany } = usePlans();
  const companyId = user.companyId;
  const history = useHistory();

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    async function fetchData() {
      const planConfigs = await getPlanCompany(undefined, companyId);
      if (!planConfigs.plan.useIntegrations) {
        toast.error("Esta empresa não possui permissão para acessar essa página! Estamos lhe redirecionando.");
        setTimeout(() => {
          history.push(`/`)
        }, 1000);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchIntegrations = async () => {
        try {
          const { data } = await api.get("/queueIntegration/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_INTEGRATIONS", payload: data.queueIntegrations });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchIntegrations();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-queueIntegration`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_INTEGRATIONS", payload: data.queueIntegration });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_INTEGRATION", payload: +data.integrationId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  const handleOpenUserModal = () => {
    setSelectedIntegration(null);
    setUserModalOpen(true);
  };

  const handleCloseIntegrationModal = () => {
    setSelectedIntegration(null);
    setUserModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditIntegration = (queueIntegration) => {
    setSelectedIntegration(queueIntegration);
    setUserModalOpen(true);
  };

  const handleDeleteIntegration = async (integrationId) => {
    try {
      await api.delete(`/queueIntegration/${integrationId}`);
      toast.success(i18n.t("queueIntegration.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingUser(null);
    setSearchParam("");
    setPageNumber(1);
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
    <div style={{height:'80%'}}>
      <ConfirmationModal
        title={
          deletingUser &&
          `${i18n.t("queueIntegration.confirmationModal.deleteTitle")} ${deletingUser.name
          }?`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteIntegration(deletingUser.id)}
      >
        {i18n.t("queueIntegration.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <IntegrationModal
        open={userModalOpen}
       
        onClose={handleCloseIntegrationModal}
        aria-labelledby="form-dialog-title"
        integrationId={selectedIntegration && selectedIntegration.id}
      />
      
      
      <div className={classes.fundo}>
        <MainHeader>
        <Title>{i18n.t("queueIntegration.title")} ({queueIntegration.length})</Title>
        <MainHeaderButtonsWrapper>
          <TextField   variant="standard"   style={{  borderRadius: '10px',backgroundColor: '#D9D9D9', padding:'3px'}}
            placeholder={i18n.t("queueIntegration.searchPlaceholder")}
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
                   '@media (max-width:600px)': { // For mobile screens (xs)
                   
          fontSize: '12px', // Reduce placeholder font size on mobile
          paddingLeft: '4px', // Reduce padding for placeholder on mobile
        },
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenUserModal}
          >
             <AddIcon/>
            {i18n.t("queueIntegration.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <div className={classes.traco}></div>
        <Table size="small" style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }} >
          <TableHead>
            <TableRow >
              <TableCell align='center' style={{color:'#0C2454', fontWeight:'bold'}}>{i18n.t("queueIntegration.table.type")}</TableCell>
              <TableCell align="center" style={{color:'#0C2454', fontWeight:'bold'}}>{i18n.t("queueIntegration.table.id")}</TableCell>
              <TableCell align="center" style={{color:'#0C2454', fontWeight:'bold'}}>{i18n.t("queueIntegration.table.name")}</TableCell>
              <TableCell align="center" style={{color:'#0C2454', fontWeight:'bold'}}>{i18n.t("queueIntegration.table.actions")}</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody style={{backgroundColor:'#D9D9D9' }}>
            <>
              {queueIntegration.map((integration) => (
                <TableRow key={integration.id} style={{ marginBottom: '5px', borderRadius: '16px'}} >
                  
                  <TableCell style={{ borderRadius: '16px 0 0 16px', overflow: 'hidden'  }}>
                    {integration.type === "dialogflow" && (<Avatar style={{margin: 'auto' }}
                      src={dialogflow} className={classes.avatar} />)}
                    {integration.type === "n8n" && (<Avatar   style={{margin: 'auto', }}
                      src={n8n} className={classes.avatar} />)}
                    {integration.type === "webhook" && (<Avatar style={{margin: 'auto'}}
                      src={webhooks} className={classes.avatar} />)}
                    {integration.type === "typebot" && (<Avatar  style={{margin: 'auto'}}
                      src={typebot} className={classes.avatar} />)}
                  </TableCell>
                      
                  <TableCell align="center"style={{ borderRadius: '0', overflow: 'hidden' }}>{integration.id}</TableCell>
                  <TableCell align="center"style={{ borderRadius: '0', overflow: 'hidden' }}>{integration.name}</TableCell>
                  <TableCell align="center"style={{ borderRadius: '0 16px 16px 0', overflow: 'hidden' }}>
                    <IconButton 
                      size="big"
                      onClick={() => handleEditIntegration(integration)}
                    >
                      <Edit style={{color:'#0C2454'}} />
                    </IconButton>

                    <IconButton
                      size="big"
                      onClick={(e) => {
                        setConfirmModalOpen(true);
                        setDeletingUser(integration);
                      }}
                    >
                      <DeleteOutline color="secondary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={7} />}
            </>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QueueIntegration;