import React, { useContext, useEffect, useReducer, useState } from "react";
import logoOpenAI from "../../assets/logoopenai.png";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { DeleteOutline, Edit } from "@material-ui/icons";
import PromptModal from "../../components/PromptModal";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import { AuthContext } from "../../context/Auth/AuthContext";
import usePlans from "../../hooks/usePlans";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { SocketContext } from "../../context/Socket/SocketContext";


const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    width: '90%',
    height: '100%',
    marginTop: '80px',
    marginLeft: '5%',
    overflowX: 'hidden',
  },
  logo: {
    width: "130px",
    marginRight: "100px",
    [theme.breakpoints.down("sm")]: {
      width: "100px",
      marginRight: "50px",
    },
  },
  addButton: {
    marginRight: '61px',
    width: '80%',
    [theme.breakpoints.down("sm")]: {
      width: '70%',
      fontSize: '10px',
      left: '5%',
    },
  },
  customTableContainer: {
    overflowX: "auto", // Habilita o scroll horizontal
    maxWidth: "100%", // Garante que o container respeite o tamanho disponível
    borderRadius: "8px",
    padding: theme.spacing(1),
  },
  customTable: {
    borderCollapse: "separate",
    borderSpacing: "0 20px",
    overflowY: "hidden",
    overflowX: "auto",
  },
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeaderCell: {
    color: theme.palette.primary.main,
    paddingRight: theme.spacing(3),
  },
  blueLine: {
    border: 0,
    height: "2px",
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(1, 0),
    marginTop: '5px',
    width: '100%',
  },
  redBox: {
    backgroundColor: "#ffcccc",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  openai2: {
    padding:'16px'
  }
}));


const reducer = (state, action) => {
  if (action.type === "LOAD_PROMPTS") {
    const prompts = action.payload;
    const newPrompts = [];


    prompts.forEach((prompt) => {
      const promptIndex = state.findIndex((p) => p.id === prompt.id);
      if (promptIndex !== -1) {
        state[promptIndex] = prompt;
      } else {
        newPrompts.push(prompt);
      }
    });


    return [...state, ...newPrompts];
  }


  if (action.type === "UPDATE_PROMPTS") {
    const prompt = action.payload;
    const promptIndex = state.findIndex((p) => p.id === prompt.id);


    if (promptIndex !== -1) {
      state[promptIndex] = prompt;
      return [...state];
    } else {
      return [prompt, ...state];
    }
  }


  if (action.type === "DELETE_PROMPT") {
    const promptId = action.payload;
    return state.filter((p) => p.id !== promptId); // Filtra a lista e retorna nova sem o prompt deletado
  }


  if (action.type === "RESET") {
    return [];
  }
};


const Prompts = () => {
  const classes = useStyles();
  const [prompts, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { getPlanCompany } = usePlans();
  const history = useHistory();
  const companyId = user.companyId;
  const socketManager = useContext(SocketContext);


  useEffect(() => {
    async function fetchData() {
      const planConfigs = await getPlanCompany(undefined, companyId);
      if (!planConfigs.plan.useOpenAi) {
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
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/prompt");
        dispatch({ type: "LOAD_PROMPTS", payload: data.prompts });
        setLoading(false);
      } catch (err) {
        toastError(err);
        setLoading(false);
      }
    })();
  }, []);


  useEffect(() => {
    const socket = socketManager.getSocket(companyId);


    socket.on(`company-${companyId}-prompt`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_PROMPTS", payload: data.prompt });
      }


      if (data.action === "delete") {
        dispatch({ type: "DELETE_PROMPT", payload: data.promptId });
      }
    });


    return () => {
      socket.disconnect();
    };
  }, [companyId, socketManager]);


  const handleOpenPromptModal = () => {
    setPromptModalOpen(true);
    setSelectedPrompt(null);
  };


  const handleClosePromptModal = () => {
    setPromptModalOpen(false);
    setSelectedPrompt(null);
  };


  const handleEditPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setPromptModalOpen(true);
  };


  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedPrompt(null);
  };


  const handleDeletePrompt = async (promptId) => {
    console.log("Iniciando exclusão de prompt:", promptId);
    try {
      const { data } = await api.delete(`/prompt/${promptId}`);
      console.log("Resposta da API:", data); // Para verificar a resposta
      toast.info(i18n.t(data.message));
      dispatch({ type: "DELETE_PROMPT", payload: promptId });
    } catch (err) {
      toastError(err);
      console.log("Erro ao deletar:", err); // Para identificar possíveis erros
    }
    setSelectedPrompt(null);
  };


  useEffect(() => {
    if (!confirmModalOpen) {
      (async () => {
        try {
          const { data } = await api.get("/prompt");
          dispatch({ type: "LOAD_PROMPTS", payload: data.prompts });
        } catch (err) {
          toastError(err);
        }
      })();
    }
  }, [confirmModalOpen]);


  return (
      <Paper className={classes.mainPaper} variant="outlined">
      <div classname={classes.openai2} style={{padding:'16px'}}>
      <ConfirmationModal
        title={
          selectedPrompt &&
          `${i18n.t("prompts.confirmationModal.deleteTitle")} ${selectedPrompt.name
          }?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeletePrompt(selectedPrompt.id)}
      >
        {i18n.t("prompts.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <PromptModal
        open={promptModalOpen}
        onClose={handleClosePromptModal}
        promptId={selectedPrompt?.id}
      />
      <MainHeader>
        <Title>
          <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={logoOpenAI}
            alt="Logo OpenAI"
            className={classes.logo}
          />
          </div>
        </Title>
        <MainHeaderButtonsWrapper>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenPromptModal}
            className={classes.addButton}
          >
            {i18n.t("prompts.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <hr className={classes.blueLine} />
      <div className={classes.customTableContainer}>
        <Table size="small" className={classes.customTable}>
          <TableHead>
            <TableRow>
              <TableCell align="left" className={classes.tableHeaderCell}>
                {i18n.t("prompts.table.name")}
              </TableCell>
              <TableCell align="left" className={classes.tableHeaderCell}>
                {i18n.t("prompts.table.queue")}
              </TableCell>
              <TableCell align="left" className={classes.tableHeaderCell}>
                {i18n.t("prompts.table.max_tokens")}
              </TableCell>
              <TableCell align="center" className={classes.tableHeaderCell}>
                {i18n.t("prompts.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{backgroundColor: "#D9D9D9"}}>


            <>
              {prompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell align="left" style={{ borderRadius: '8px 0 0 8px', overflow: 'hidden',color:'#0C2454', fontWeight:"bold" }}>{prompt.name}</TableCell>
                  <TableCell align="left" style={{ overflow: 'hidden',color:'#0C2454', fontWeight:"bold" }}>{prompt.queue.name}</TableCell>
                  <TableCell align="left" style={{ overflow: 'hidden',color:'#0C2454', fontWeight:"bold", paddingLeft: '7%' }}>{prompt.maxTokens}</TableCell>
                  <TableCell align="center" style={{ borderRadius: '0 8px 8px 0',overflow: 'hidden',color:'#0C2454', fontWeight:"bold" }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditPrompt(prompt)}
                      style={{color:'#0C2454'}}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedPrompt(prompt);
                        setConfirmModalOpen(true);
                      }}
                      style={{color:'red'}}
                    >
                      <DeleteOutline />
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
      </Paper>
   
  );
};


export default Prompts;


