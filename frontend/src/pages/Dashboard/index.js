import React, { useContext, useState, useEffect } from "react";




import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";




import SpeedIcon from "@material-ui/icons/Speed";
import GroupIcon from "@material-ui/icons/Group";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PersonIcon from "@material-ui/icons/Person";
import CallIcon from "@material-ui/icons/Call";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ForumIcon from "@material-ui/icons/Forum";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from '@material-ui/icons/Send';
import MessageIcon from '@material-ui/icons/Message';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TimerIcon from '@material-ui/icons/Timer';




import { makeStyles } from "@material-ui/core/styles";
import { grey, blue } from "@material-ui/core/colors";
import { toast } from "react-toastify";




import Chart from "./Chart";
import ButtonWithSpinner from "../../components/ButtonWithSpinner";




import CardCounter from "../../components/Dashboard/CardCounter";
import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";




import { AuthContext } from "../../context/Auth/AuthContext";




import useDashboard from "../../hooks/useDashboard";
import useTickets from "../../hooks/useTickets";
import useUsers from "../../hooks/useUsers";
import useContacts from "../../hooks/useContacts";
import useMessages from "../../hooks/useMessages";
import { ChatsUser } from "./ChartsUser"




import Filters from "./Filters";
import { isEmpty } from "lodash";
import moment from "moment";
import { ChartsDate } from "./ChartsDate";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import MainContainer from "../../components/MainContainer";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    overflowX: "hidden",
    borderRadius: '16px',
    ...theme.scrollbarStyles,
    
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.padding,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    height: 240,
    overflowY: "auto",
    ...theme.scrollbarStyles,
  },
  cardAvatar: {
    fontSize: "55px",
    color: grey[500],
    backgroundColor: "#ffffff",
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  cardTitle: {
    fontSize: "18px",
    color: blue[700],
  },
  cardSubtitle: {
    color: grey[600],
    fontSize: "14px",
  },
  alignRight: {
    textAlign: "right",
  },
  fullWidth: {
    width: "100%",
    marginLeft:'320px',
    [theme.breakpoints.down("sm")]:{
      marginLeft:'80px',
    }
  },
  selectContainer: {
    width: "100%",
    textAlign: "left",
  },
  iframeDashboard: {
    width: "100%",
    height: "calc(100vh - 64px)",
    border: "none",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 240,
  },
  customFixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 120,
  },
  customFixedHeightPaperLg: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
  },
  card1: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: "palette",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
    [theme.breakpoints.down("sm")]:{
      marginLeft:'75px',
    }
  },
  card2: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: "palette",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
    [theme.breakpoints.down("sm")]:{
      marginLeft:'75px',
    }
  },
  card3: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
  //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
    [theme.breakpoints.down("sm")]:{
      marginLeft:'75px',
    }
  },
  card4: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
    [theme.breakpoints.down("sm")]:{
      marginLeft:'75px',
    }
  },
  card5: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card6: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card7: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card8: {
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    height: '100%',
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : "rgba(52, 211, 163, 0.35)",
    color: '#000',
    borderRadius: '12px',
    boxShadow: 'none',
    minHeight: '85px',
    width: '190px',
  },
  card9: {
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    height: '100%',
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : "rgba(30, 75, 165, 0.6)",
    color: '#000',
    borderRadius: '12px',
    boxShadow: 'none',
    minHeight: '85px',
    width: '190px',
  },
  cardTitle: {
    fontSize: '12px',
    marginBottom: '6px',
    paddingLeft: '10px',
  },
  cardValue: {
    fontSize: '18px',
    paddingLeft: '10px',
  },
  fixedHeightPaper2: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fundo: {
    paddingTop: '70px',
  },
  blueLine: {
    border: 0,
    height: "1px",
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(2, 0),
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'fit-content', // Ou ajuste conforme o conteúdo
    height: 'fit-content', // Reduza o impacto de margens não centralizadas
    margin: 'auto', // Centraliza a `box` dentro do `Paper`
    [theme.breakpoints.down("sm")]:{
      flexDirection:'column',
    }
  },
  container1: {
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]:{
    }
  },
  fundo: {
    marginTop:'80px',
    backgroundColor:'white',
    width:'90%',
    height:'100%',
    marginLeft:'67px',
    borderRadius:'18px',
    padding:'16px',
    overflowY:'scroll',
    ...theme.scrollbarStyles,
    [theme.breakpoints.down("sm")]:{
      marginLeft:'25px',
    }
  },
}));




const Dashboard = () => {
  const classes = useStyles();
  const [counters, setCounters] = useState({});
  const [attendants, setAttendants] = useState([]);
  const [period, setPeriod] = useState(0);
  const [filterType, setFilterType] = useState(1);
  const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const { find } = useDashboard();
  

  const simulatedData = [
    { name: 'Jan', value: 30 },
    { name: 'Feb', value: 45 },
    { name: 'Mar', value: 28 },
    { name: 'Apr', value: 60 },
    { name: 'May', value: 50 },
    { name: 'Jun', value: 75 },
    { name: 'Jul', value: 90 },
    { name: 'Aug', value: 85 },
    { name: 'Sep', value: 65 },
    { name: 'Oct', value: 50 },
    { name: 'Nov', value: 70 },
    { name: 'Dec', value: 95 }
  ];

  const TotalsimulatedData = [

    { name: 'Seg', value: 50 },
    { name: 'Ter', value: 100 },
    { name: 'Qua', value: 85 },
    { name: 'Qui', value: 35 },
    { name: 'Sex', value: 15 },
    { name: 'Sáb', value: 65 },
    { name: 'Dom', value: 5 },
  
  ];


  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let now = `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`;




  const [showFilter, setShowFilter] = useState(false);
  const [queueTicket, setQueueTicket] = useState(false);




  const { user } = useContext(AuthContext);
  var userQueueIds = [];




  if (user.queues && user.queues.length > 0) {
    userQueueIds = user.queues.map((q) => q.id);
  }




  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
    async function handleChangePeriod(value) {
    setPeriod(value);
  }




  async function handleChangeFilterType(value) {
    setFilterType(value);
    if (value === 1) {
      setPeriod(0);
    } else {
      setDateFrom("");
      setDateTo("");
    }
  }




  async function fetchData() {
    setLoading(true);




    let params = {};




    if (period > 0) {
      params = {
        days: period,
      };
    }




    if (!isEmpty(dateFrom) && moment(dateFrom).isValid()) {
      params = {
        ...params,
        date_from: moment(dateFrom).format("YYYY-MM-DD"),
      };
    }




    if (!isEmpty(dateTo) && moment(dateTo).isValid()) {
      params = {
        ...params,
        date_to: moment(dateTo).format("YYYY-MM-DD"),
      };
    }




    if (Object.keys(params).length === 0) {
      toast.error("Parametrize o filtro");
      setLoading(false);
      return;
    }




    const data = await find(params);




    setCounters(data.counters);
    if (isArray(data.attendants)) {
      setAttendants(data.attendants);
    } else {
      setAttendants([]);
    }




    setLoading(false);
  }




  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  }




  const GetUsers = () => {
    let count;
    let userOnline = 0;
    attendants.forEach(user => {
      if (user.online === true) {
        userOnline = userOnline + 1
      }
    })
    count = userOnline === 0 ? 0 : userOnline;
    return count;
  };
 
    const GetContacts = (all) => {
    let props = {};
    if (all) {
      props = {};
    }
    const { count } = useContacts(props);
    return count;
  };
  function renderFilters() {
    if (filterType === 1) {
      return (
        
        <>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Data Inicial"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                backgroundColorolor: '#0C2454',
                shrink: true,
              }}
              style={{ width: '50%' }} // Ajuste o tamanho aqui
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}> {/* Ajuste a margem aqui */}
            <TextField
              label="Data Final"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ width: '50%' }} // Ajuste o tamanho aqui
            />
          </Grid>
        </>
      );
    } else {
      return (
        <Grid item xs={12} sm={6} md={4}>
          <FormControl className={classes.selectContainer} style={{ width: '80%' }}> {/* Ajuste o tamanho aqui */}
            <InputLabel id="period-selector-label">Período</InputLabel>
            <Select
              labelId="period-selector-label"
              id="period-selector"
              value={period}
              onChange={(e) => handleChangePeriod(e.target.value)}
              style={{ color: '#0C2454' }} // Define a cor do texto aqui
            >
              <MenuItem value={0}>Nenhum selecionado</MenuItem>
              <MenuItem value={3}>Últimos 3 dias</MenuItem>
              <MenuItem value={7}>Últimos 7 dias</MenuItem>
              <MenuItem value={15}>Últimos 15 dias</MenuItem>
              <MenuItem value={30}>Últimos 30 dias</MenuItem>
              <MenuItem value={60}>Últimos 60 dias</MenuItem>
              <MenuItem value={90}>Últimos 90 dias</MenuItem>
            </Select>
            <FormHelperText>Selecione o período desejado</FormHelperText>
          </FormControl>
        </Grid>
      );
    }
  }
  return (
    <div style={{height:'80%'}}>
      <div className={classes.fundo}>
        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#0C2454', paddingTop: '20px', paddingLeft: '20px' }}>
          Dashboard
        </Typography>
        <hr className={classes.blueLine} />
        {/* Campos de Filtro por Data ou Período */}
        <Grid container spacing={3} style={{ paddingLeft: '25px' }}>
          {renderFilters()}
        </Grid>
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3} justifyContent="flex-start">
              {/* EM ATENDIMENTO */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  className={classes.card1}
                  elevation={4}
                  style={{
                    overflow: "hidden",
                    backgroundColor: "white",
                    borderRadius: '10px',
                    width: 225,
                    height: 100,
                    padding: '3px 10px'
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center' }}>
                      {/* Círculo - Alinhado com "Em Conversa" */}
                      <div style={{
                        width: '15px', // ajuste o tamanho conforme necessário
                        height: '15px', // ajuste o tamanho conforme necessário
                        borderRadius: '50%',
                        backgroundColor: '#4557A1',
                        marginRight: '10px' // espaço entre o círculo e o texto
                      }} />
                      {/* "Em Conversa" - Alinhado com a bolinha */}
                      <Typography component="h3" variant="h6" style={{ color: "#0C2454", fontSize: 12, margin: 0}}>
                        Em Conversa <br/>
                        <span style={{ color: "#C3C3C3" }}>Chamados</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                      {/* Combinando o número de pessoas com a palavra "pessoas" em uma única linha */}
                      <Typography component="h1" variant="h4" style={{ color: "#0C2454", fontSize: 12, marginRight: '5px', display: 'flex', alignItems: 'center' }}>
                        {counters.supportHappening}
                      </Typography>
                      <Typography component="h1" variant="h4" style={{ color: "#0C2454", fontSize: 12 }}>
                        pessoas
                      </Typography>
                      <CallIcon style={{ fontSize: 40, color: "#FFFFFF", marginLeft: '5px' }} />
                    </Grid>
                    <ResponsiveContainer width="100%" height={70} style={{ margin: '0' }}>
                      <AreaChart data={simulatedData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#4557A1" fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Grid>
                </Paper>
              </Grid>

          {/* AGUARDANDO */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              className={classes.card2}
              elevation={6}
              style={{
                overflow: "hidden",
                backgroundColor: "white",
                borderRadius: '10px',
                width: 225,
                height: 100,
                padding: '3px 10px'
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={8} style={{ display: 'flex', alignItems: 'center' }}>
                  {/* Círculo - Alinhado com "Aguardando" */}
                  <div style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    backgroundColor: '#07BEAA',
                    marginRight: '10px'
                  }} />
                  {/* "Aguardando" - Alinhado com a bolinha */}
                  <Typography component="h3" variant="h6" style={{ color: "#0C2454", fontSize: 12, margin: 0 }}>
                    Aguardando <br />
                    <span style={{ color: "#C3C3C3" }}>Chamados</span>
                  </Typography>

                </Grid>
                <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  {/* Número de suporte pendente e "pessoas" em uma única linha */}
                  <Typography component="h1" variant="h4" style={{ color: "#0C2454", fontSize: 12, marginRight: '5px', display: 'flex', alignItems: 'center' }}>
                    {counters.supportPending}
                  </Typography>
                  <Typography component="h1" variant="h4" style={{ color: "#0C2454", fontSize: 12 }}>
                    pessoas
                  </Typography>
                  <HourglassEmptyIcon style={{ fontSize: 40, color: "#FFFFFF", marginLeft: '5px' }} />
                </Grid>
                <ResponsiveContainer width="100%" height={70} style={{ margin: '0' }}>
                  <AreaChart data={simulatedData}>
                    <defs>
                      <linearGradient id="colorAguardando" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#07BEAA" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#07BEAA" fillOpacity={1} fill="url(#colorAguardando)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Grid>
            </Paper>
          </Grid>


          {/* FINALIZADOS */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              className={classes.card3}
              elevation={6}
              style={{
                overflow: "hidden",
                backgroundColor: "white",
                borderRadius: '10px',
                width: 225,
                height: 100,
                padding: '3px 10px',
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={8} style={{ display: 'flex', alignItems: 'center' }}>
                  {/* Círculo - Alinhado com "Finalizados" */}
                  <div style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    backgroundColor: '#1786C4',
                    marginRight: '10px'
                  }} />
                  {/* "Finalizados" - Alinhado com a bolinha */}
                  <Typography component="h3" variant="h6" style={{ color: "#0C2454", fontSize: 12, margin: 0 }}>
                    Finalizados <br />
                    <span style={{ color: "#C3C3C3" }}>Chamados</span>
                  </Typography>
                </Grid>
                <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  {/* Número de suporte finalizado e "pessoas" em uma única linha */}
                  <Typography component="h1" variant="h4" style={{ color: "#0C2454", fontSize: 12, marginRight: '5px', display: 'flex', alignItems: 'center' }}>
                    {counters.supportFinished}
                  </Typography>
                  <Typography component="h1" variant="h4" style={{ color: "#0C2454", fontSize: 12 }}>
                    pessoas
                  </Typography>
                  <CheckCircleIcon style={{ fontSize: 40, color: "#FFFFFF", marginLeft: '5px' }} />
                </Grid>
                <ResponsiveContainer width="100%" height={70} style={{ margin: '0' }}>
                  <AreaChart data={simulatedData}>
                    <defs>
                      <linearGradient id="colorFinalizados" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1786C4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#1786C4" fillOpacity={1} fill="url(#colorFinalizados)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Grid>
            </Paper>
          </Grid>




          {/* NOVOS CONTATOS */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              className={classes.card4}
              elevation={6}
              style={{
                overflow: "hidden",
                backgroundColor: "white",
                borderRadius: '10px',
                width: 225,
                height: 100,
                padding: '3px 10px'
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={8} style={{ display: 'flex', alignItems: 'center' }}>
                  {/* Círculo - Alinhado com "Novos Contatos" */}
                  <div style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    backgroundColor: '#0C1E43',
                    marginRight: '10px'
                  }} />
                  {/* "Novos Contatos" - Alinhado com a bolinha */}
                  <Typography component="h3" variant="h6" style={{ color: "#0C2454", fontSize: 12, margin: 0 }}>
                    Novos Contatos <br />
                    <span style={{ color: "#C3C3C3" }}>Chamados</span>
                  </Typography>
                </Grid>
                <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  {/* Número de novos contatos e "pessoas" em uma única linha */}
                  <Typography component="h1" variant="h4" style={{ color: "#0C2454", fontSize: 12, marginRight: '5px', display: 'flex', alignItems: 'center' }}>
                    {GetContacts(true)}
                  </Typography>
                  <Typography component="h1" variant="h4" style={{ color: "#0C2454", fontSize: 12 }}>
                    pessoas
                  </Typography>
                  <GroupAddIcon style={{ fontSize: 40, color: "#FFFFFF", marginLeft: '5px' }} />
                </Grid>
                <ResponsiveContainer width="100%" height={70} style={{ margin: '0' }}>
                  <AreaChart data={simulatedData}>
                    <defs>
                      <linearGradient id="colorNovosContatos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0C1E43" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#0C1E43" fillOpacity={1} fill="url(#colorNovosContatos)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Grid>
            </Paper>
          </Grid>





        {/* 
            FILTROS 
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.selectContainer}>
                <InputLabel id="period-selector-label">Tipo de Filtro</InputLabel>
                <Select
                  labelId="period-selector-label"
                  value={filterType}
                  onChange={(e) => handleChangeFilterType(e.target.value)}
                >
                  <MenuItem value={1}>Filtro por Data</MenuItem>
                  <MenuItem value={2}>Filtro por Período</MenuItem>
                </Select>
                <FormHelperText>Selecione o período desejado</FormHelperText>
              </FormControl>
            </Grid>

            BOTAO FILTRAR 
            <Grid item xs={12} className={classes.alignRight}>
              <ButtonWithSpinner
                loading={loading}
                onClick={() => fetchData()}
                variant="contained"
                color="primary"
              >
                Filtrar
              </ButtonWithSpinner>
            </Grid>
        */}
        
        

            {/* TOTAL DE ATENDIMENTOS POR USUARIO */}
            <Grid item xs={12}>
              <Paper className={classes.fixedHeightPaper2}>
                <ChatsUser />
              </Paper>
            </Grid>


            {/* TOTAL DE ATENDIMENTOS */}
            <div class={classes.box}>
                <Grid  class={classes.container1}>
                  <Paper
                     
                      elevation={0}
                      style={{
                          overflow: "hidden",
                          backgroundColor: "#F7F9FB",
                          borderRadius: '10px',
                          border: '1px solid #A5BDB6',
                          width: 300,
                          height: 157,
                          padding: '3px 10px'
                  }}
                  >
                    <Grid >
                        <Grid item style={{ display: 'flex', margin:0}}>
                        
                        
                        <Typography component="h3" variant="h6" style={{ color: "#0C2454", fontSize: 12, margin: 0 }}>
                            Atividades Diárias <br />
                        </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        </Grid>
                        <ResponsiveContainer width={"90%"} height={100} style={{ margin: '0' }}>
                        <BarChart data={TotalsimulatedData}>
                        <YAxis
                            type="number"
                            tick={{ fill: "#A5BDB6", fontSize: 12 }}
                            domain={[0, 100]} // Define o intervalo de 0 a 30
                            ticks={[0, 75, 90, 100]} 
                            interval="preserveStartEnd"// Define os valores que aparecerão no eixo Y
                        />

                        <XAxis dataKey="day" tick={{ fill: "#A5BDB6", fontSize: 12 }}
                        domain={["seg", "dom"]} // Define o intervalo de 0 a 30
                        ticks={["seg","dom"]} 
                        interval="preserveStartEnd"
                        />
                        <Tooltip />
                
                            <defs>
                            <linearGradient id="colorAguardando" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#07BEAA" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                            </linearGradient>
                            </defs>
                            <Tooltip />
                            <Bar type="monotone" dataKey="value" stroke="#07BEAA" fillOpacity={1} fill="#07BEAA" />
                        </BarChart>
                        </ResponsiveContainer>
                    </Grid>
                  </Paper>
                </Grid>
                    {/* T.M. DE ATENDIMENTO */}
                <Grid item xs={12} sm={6} md={4} class={classes.container1}>
                <Paper
                    className={classes.card8}
                    style={{ overflow: "hidden" }}
                    elevation={6}
                >
                    <Grid container spacing={3}>
                    <Grid item xs={8}>
                        <Typography
                        component="h3"
                        variant="h6"
                        paragraph
                        className={classes.cardTitle}
                        >
                        Tempo Médio de Atendimento
                        </Typography>
                        <Grid item>
                        <Typography
                            component="h1"
                            variant="h4"
                            className={classes.cardValue}
                        >
                            {formatTime(counters.avgSupportTime)}
                        </Typography>
                        </Grid>
                    </Grid>
                    </Grid>
                </Paper>
                </Grid>


                {/* T.M. DE ESPERA */}
                <Grid item xs={12} sm={6} md={4} class={classes.container1}>
                <Paper
                    className={classes.card9}
                    style={{ overflow: "hidden" }}
                    elevation={6}
                >
                    <Grid container spacing={3}>
                    <Grid item xs={8}>
                        <Typography
                        component="h3"
                        variant="h6"
                        paragraph
                        className={classes.cardTitle}
                        >
                        Tempo Médio de Espera
                        </Typography>
                        <Grid item>
                        <Typography
                            component="h1"
                            variant="h4"
                            className={classes.cardValue}
                        >
                            {formatTime(counters.avgWaitTime)}
                        </Typography>
                        </Grid>
                    </Grid>
                    </Grid>
                </Paper>
                </Grid>
            </div>
          </Grid>
          <Grid item xs={12}>
              {attendants.length ? (
                <TableAttendantsStatus
                  attendants={attendants}
                  loading={loading}
                />
              ) : null}
            </Grid>
        </Container >
      </div>
    </div>
  );
};




export default Dashboard;