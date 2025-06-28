import React, { useState, useEffect, useReducer, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import ScheduleModal from "../../components/ScheduleModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import moment from "moment";
import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";
import usePlans from "../../hooks/usePlans";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SearchIcon from "@material-ui/icons/Search";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

import "./Schedules.css"; // Importe o arquivo CSS

// Defina a função getUrlParam antes de usá-la
function getUrlParam(paramName) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(paramName);
}

const eventTitleStyle = {
  fontSize: "14px", // Defina um tamanho de fonte menor
  overflow: "hidden", // Oculte qualquer conteúdo excedente
  whiteSpace: "nowrap", // Evite a quebra de linha do texto
  textOverflow: "ellipsis", // Exiba "..." se o texto for muito longo
};

const localizer = momentLocalizer(moment);
var defaultMessages = {
  date: "Data",
  time: "Hora",
  event: "Evento",
  allDay: "Dia Todo",
  week: "Semana",
  work_week: "Agendamentos",
  day: "Dia",
  month: "Mês",
  previous: "Anterior",
  next: "Próximo",
  yesterday: "Ontem",
  tomorrow: "Amanhã",
  today: "Hoje",
  agenda: "Agenda",
  noEventsInRange: "Não há agendamentos no período.",
  showMore: function showMore(total) {
    return "+" + total + " mais";
  }
};

const reducer = (state, action) => {
  if (action.type === "LOAD_SCHEDULES") {
    return [...state, ...action.payload];
  }

  if (action.type === "UPDATE_SCHEDULES") {
    const schedule = action.payload;
    const scheduleIndex = state.findIndex((s) => s.id === schedule.id);

    if (scheduleIndex !== -1) {
      state[scheduleIndex] = schedule;
      return [...state];
    } else {
      return [schedule, ...state];
    }
  }

  if (action.type === "DELETE_SCHEDULE") {
    const scheduleId = action.payload;
    return state.filter((s) => s.id !== scheduleId);
  }

  if (action.type === "RESET") {
    return [];
  }

  return state;
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1, // Faz o elemento crescer para preencher o espaço disponível
    padding: theme.spacing(1), // Adiciona padding baseado no espaçamento do tema
    overflowY: "scroll", // Permite rolagem vertical
    ...theme.scrollbarStyles, // Aplica estilos de scrollbar definidos no tema
    borderRadius: "16px",
  },
  calendar: {
    marginTop: "30px", // Adiciona margem superior
    // Estilo para o rótulo da barra de ferramentas
    "& .rbc-toolbar-label": {
      fontWeight: "bold",
      color: "#0C2454",
      textTransform: "capitalize",
    },
    
    // Estilos para botões ativos e focados
    "& .rbc-active, & .rbc-btn-group button.rbc-active, & .rbc-toolbar button:focus, & .rbc-toolbar button.rbc-active:focus": { 
      backgroundColor: "#0C2454 !important",
      color: "white !important",
      fontWeight: "bold",
    },
    
    // Estilo padrão para botões na barra de ferramentas
    "& .rbc-btn-group button": {
      fontWeight: "bold",
      border: "none",
      color: "#0C2454",
    },
    
    // Arredondamento dos cantos superiores da visão mensal
    "& .rbc-month-view": {
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
    },
    
    // Estilos para os cabeçalhos do calendário
    "& .rbc-header": {
      padding: "10px 5px",
      fontWeight: "bold",
      //display: "flex",
      //alignItems: "center",
      //justifyContent: "center",
      //textAlign: "center",
    },
    
    // Ajuste da altura da linha do texto no cabeçalho
    "& .rbc-header span": {
      lineHeight: 1,
    },
    
    // Arredondamento do canto superior esquerdo do primeiro cabeçalho
    "& .rbc-header:first-child": {
      borderTopLeftRadius: "16px",
    },
    
    // Arredondamento do canto superior direito do último cabeçalho
    "& .rbc-header:last-child": {
      borderTopRightRadius: "16px",
    },
    
    // Estilos para a lista de eventos(Agendamentos)
    "& .rbc-event": {
      backgroundColor: "#D9D9D9",
      borderRadius: "16px",
      color: "#0C2454",
      border: "none",
      padding: "4px 8px",
      marginBottom: "8px",
    },
    
    // Ajuste da margem direita para eventos na visualização de dia
    "& .rbc-day-slot .rbc-events-container": {
      marginRight: "10px",
    },
    
    // Tamanho da fonte para o conteúdo dos eventos
    "& .rbc-event-content": {
      fontSize: "14px",
    },
    
    // Ajustes específicos para a visualização de semana
    "& .rbc-time-header-content .rbc-header": {
      height: "100%",
    },
    
    // Garante que os cabeçalhos ocupem toda a altura em diferentes visualizações
    "& .rbc-time-header-cell, & .rbc-time-header-cell-single-day": {
      height: "100%",
    },
  },
  pageHeader: {
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column"
    }
  },
  traco: {
    height: '2px',
    width: 'calc(100%)',
    backgroundColor: '#0C2454',
    marginLeft: '0px',
  },
  fundo: {
    marginTop:'80px',
    backgroundColor:'white',
    width:'90%',
    height:'100%',
    marginLeft:'67px',
    borderRadius:'18px',
    padding:'16px',
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  container: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
        flexDirection: "row",
        justifyContent: "center",
    },
  },
}));

const Schedules = () => {
  const classes = useStyles();
  const history = useHistory();

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [deletingSchedule, setDeletingSchedule] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [schedules, dispatch] = useReducer(reducer, []);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [contactId, setContactId] = useState(+getUrlParam("contactId"));


  const fetchSchedules = useCallback(async () => {
    try {
      const { data } = await api.get("/schedules/", {
        params: { searchParam, pageNumber },
      });

      dispatch({ type: "LOAD_SCHEDULES", payload: data.schedules });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  }, [searchParam, pageNumber]);

  const handleOpenScheduleModalFromContactId = useCallback(() => {
    if (contactId) {
      handleOpenScheduleModal();
    }
  }, [contactId]);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchSchedules();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [
    searchParam,
    pageNumber,
    contactId,
    fetchSchedules,
    handleOpenScheduleModalFromContactId,
  ]);

  useEffect(() => {
    handleOpenScheduleModalFromContactId();
    const socket = socketManager.getSocket(user.companyId);

    socket.on(`company${user.companyId}-schedule`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_SCHEDULES", payload: data.schedule });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_SCHEDULE", payload: +data.scheduleId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [handleOpenScheduleModalFromContactId, socketManager, user]);

  const cleanContact = () => {
    setContactId("");
  };

  const handleOpenScheduleModal = () => {
    setSelectedSchedule(null);
    setScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setSelectedSchedule(null);
    setScheduleModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setScheduleModalOpen(true);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await api.delete(`/schedules/${scheduleId}`);
      toast.success(i18n.t("schedules.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingSchedule(null);
    setSearchParam("");
    setPageNumber(1);

    dispatch({ type: "RESET" });
    setPageNumber(1);
    await fetchSchedules();
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

  const truncate = (str, len) => {
    if (str.length > len) {
      return str.substring(0, len) + "...";
    }
    return str;
  };

  return (
    <div style={{height:'80%'}}>
      <ConfirmationModal
        title={
          deletingSchedule &&
          `${i18n.t("schedules.confirmationModal.deleteTitle")}`
        }
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => handleDeleteSchedule(deletingSchedule.id)}
      >
        {i18n.t("schedules.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <ScheduleModal
        open={scheduleModalOpen}
        onClose={handleCloseScheduleModal}
        reload={fetchSchedules}
        aria-labelledby="form-dialog-title"
        scheduleId={selectedSchedule && selectedSchedule.id}
        contactId={contactId}
        cleanContact={cleanContact}
      />
       <div className={classes.fundo}>
        <div className={classes.pageHeader}>
          <Title>{i18n.t("schedules.title")} ({schedules.length})</Title>
          <div className={classes.container}>
            <TextField
              placeholder="Pesquisar"
              type="search"
              value={searchParam}
              onChange={handleSearch}
              className={classes.searchField}
              InputProps={{
                style: {
                  backgroundColor: "#D9D9D9",
                  borderRadius: "16px",
                  padding: "4px",
                  marginRight: "10px",
                },
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: "#0C2454" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleOpenScheduleModal}
              >
              {i18n.t("schedules.buttons.add")}
            </Button>
          </div>
        </div>
        <div className={classes.traco}></div>
        <Calendar
          className={classes.calendar}
          messages={defaultMessages}
          formats={{
            agendaDateFormat: "DD/MM ddd",
            weekdayFormat: (date) => {
              const weekdays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
              return weekdays[date.getDay()];
            },
          }}
          localizer={localizer}
          events={schedules.map((schedule) => ({
            title: (
              <div className="event-container">
                <div style={eventTitleStyle}>{schedule.contact.name}</div>
                <DeleteOutlineIcon
                  onClick={() => handleDeleteSchedule(schedule.id)}
                  className="delete-icon"
                  style={{ color: "#D3343E", cursor: "pointer" }}
                />
                <EditIcon
                  onClick={() => {
                    handleEditSchedule(schedule);
                    setScheduleModalOpen(true);
                  }}
                  style={{ color: "#0C2454", cursor: "pointer" }}
                  className="edit-icon"
                />
              </div>
            ),
            start: new Date(schedule.sendAt),
            end: new Date(schedule.sendAt),
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
        </div>
      </div>
  );
};

export default Schedules;
