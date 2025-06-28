import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import PaginaInicio from "../pages/PaginaInicio";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import { Badge, Collapse, List } from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
import EventIcon from "@material-ui/icons/Event";
import MemoryIcon from '@material-ui/icons/Memory';
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import BarChartIcon from '@material-ui/icons/BarChart';
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PeopleIcon from "@material-ui/icons/People";
import ListIcon from "@material-ui/icons/ListAlt";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import ForumIcon from "@material-ui/icons/Forum";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import RotateRight from "@material-ui/icons/RotateRight";
import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import LoyaltyRoundedIcon from '@material-ui/icons/LoyaltyRounded';
import { Can } from "../components/Can";
import { SocketContext } from "../context/Socket/SocketContext";
import { isArray } from "lodash";
import TableChartIcon from '@material-ui/icons/TableChart';
import api from "../services/api";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import ToDoList from "../pages/ToDoList/";
import toastError from "../errors/toastError";
import { makeStyles } from "@material-ui/core/styles";
import { AllInclusive, AttachFile, BlurCircular, DeviceHubOutlined, Schedule } from '@material-ui/icons';
import usePlans from "../hooks/usePlans";
import Typography from "@material-ui/core/Typography";
import useVersion from "../hooks/useVersion";
import { color } from "@mui/system";

const useStyles = makeStyles((theme) => ({
  ListSubheader: {
    height: 26,
    marginTop: "-15px",
    marginBottom: "-10px",
  },
}));


function ListItemLink(props) {
  const { icon, primary, to, className } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );
//#0C2454
  return (
    <li>
      <ListItem button dense component={renderLink} className={className}>
        {icon ? <ListItemIcon /*style={{color:'white'}}*/>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} /*style={{color:'white'}}*/ />
      </ListItem>
    </li>
  );
}

const reducer = (state, action) => {
  if (action.type === "LOAD_CHATS") {
    const chats = action.payload;
    const newChats = [];

    if (isArray(chats)) {
      chats.forEach((chat) => {
        const chatIndex = state.findIndex((u) => u.id === chat.id);
        if (chatIndex !== -1) {
          state[chatIndex] = chat;
        } else {
          newChats.push(chat);
        }
      });
    }

    return [...state, ...newChats];
  }

  if (action.type === "UPDATE_CHATS") {
    const chat = action.payload;
    const chatIndex = state.findIndex((u) => u.id === chat.id);

    if (chatIndex !== -1) {
      state[chatIndex] = chat;
      return [...state];
    } else {
      return [chat, ...state];
    }
  }

  if (action.type === "DELETE_CHAT") {
    const chatId = action.payload;

    const chatIndex = state.findIndex((u) => u.id === chatId);
    if (chatIndex !== -1) {
      state.splice(chatIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }

  if (action.type === "CHANGE_CHAT") {
    const changedChats = state.map((chat) => {
      if (chat.id === action.payload.chat.id) {
        return action.payload.chat;
      }
      return chat;
    });
    return changedChats;
  }
};

const MainListItems = (props) => {
  const classes = useStyles();
  const { drawerClose, collapsed } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user, handleLogout } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const [openCampaignSubmenu, setOpenCampaignSubmenu] = useState(false);
  const [openManagementSubmenu, setOpenManagementSubmenu] = useState(false);
  const [openExternSubmenu, setOpenExternSubmenu] = useState(false);
  const [openInternSubmenu, setOpenInternSubmenu] = useState(false);
  const [showManagement, setShowManagement] = useState(false);
  const [showInterns, setShowInterns] = useState(false);
  const [showExterns, setShowExterns] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [showKanban, setShowKanban] = useState(false);
  const [showOpenAi, setShowOpenAi] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false); const history = useHistory();
  const [showSchedules, setShowSchedules] = useState(false);
  const [showInternalChat, setShowInternalChat] = useState(false);
  const [showExternalApi, setShowExternalApi] = useState(false);


  const [invisible, setInvisible] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam] = useState("");
  const [chats, dispatch] = useReducer(reducer, []);
  const { getPlanCompany } = usePlans();
  
  const [version, setVersion] = useState(false);
  
  
  const { getVersion } = useVersion();

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    async function fetchVersion() {
      const _version = await getVersion();
      setVersion(_version.version);
    }
    fetchVersion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);
      setShowManagement(planConfigs.plan.useManagement);
      setShowInterns(planConfigs.plan.useInterns);
      setShowExterns(planConfigs.plan.useExterns);
      setShowCampaigns(planConfigs.plan.useCampaigns);
      setShowKanban(planConfigs.plan.useKanban);
      setShowOpenAi(planConfigs.plan.useOpenAi);
      setShowIntegrations(planConfigs.plan.useIntegrations);
      setShowSchedules(planConfigs.plan.useSchedules);
      setShowInternalChat(planConfigs.plan.useInternalChat);
      setShowExternalApi(planConfigs.plan.useExternalApi);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchChats();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-chat`, (data) => {
      if (data.action === "new-message") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
      if (data.action === "update") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  useEffect(() => {
    let unreadsCount = 0;
    if (chats.length > 0) {
      for (let chat of chats) {
        for (let chatUser of chat.users) {
          if (chatUser.userId === user.id) {
            unreadsCount += chatUser.unreads;
          }
        }
      }
    }
    if (unreadsCount > 0) {
      setInvisible(false);
    } else {
      setInvisible(true);
    }
  }, [chats, user.id]);

  useEffect(() => {
    if (localStorage.getItem("cshow")) {
      setShowManagement(true);
      setShowExterns(true);
      setShowCampaigns(true);
      setShowInterns(true);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chats/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_CHATS", payload: data.records });
    } catch (err) {
      toastError(err);
    }
  };

  const handleClickLogout = () => {
    //handleCloseMenu();
    handleLogout();
  };

  return (
    <div onClick={drawerClose} /*style={{backgroundColor:'#34D3A3'}}*/>
      <ListItemLink
        to="/paginainicio"
        style={{
            color: '#0C2454',
            fontSize: '17px',
          }}
        primary={<Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
        {i18n.t("Página de Início")}
      </Typography>
        
        }
          
        icon={<TableChartIcon style={{color: '#0C2454'}}/>}
      />
      <Divider />

            
            <ListSubheader
              hidden={collapsed}
              style={{
                position: "relative",
                fontSize: "17px",
                textAlign: "left",
                paddingLeft: 20,
                color: '#0C2454',
                }}
              inset
              color="inherit">
              {i18n.t("mainDrawer.listItems.tickets")}
            </ListSubheader>
            <ListItemLink
        to="/chats"
        primary={<Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
        {i18n.t("Chat Interno")}
      </Typography>}
        icon={
          <Badge color="secondary" variant="dot" invisible={invisible}>
            <ForumIcon style={{color: '#0C2454'}}/>
          </Badge>
        }
        
      />
            <ListItemLink
        to="/tickets"
        primary={<Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
        {i18n.t("Chamados")}
      </Typography>}
      
        icon={<WhatsAppIcon style={{color: '#0C2454'}}/>}
      />
      <ListItemLink
              to="/connections"
              primary={<Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
              {i18n.t("Conexões")}
            </Typography>}
              icon={
                <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
                  <SyncAltIcon style={{color: '#0C2454'}}/>
                </Badge>
              }
            />
            <ListItemLink
              to="/files"
              primary={<Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
              {i18n.t("Lista de Arquivos")}
            </Typography>}
              icon={<AttachFile style={{color: '#0C2454'}}/>}
            />
            
       {showCampaigns && (
              <>
                <ListItem
                  button
                  onClick={() => setOpenInternSubmenu((prev) => !prev)}
                >
                  <ListItemIcon>
                    <BarChartIcon style={{color: '#0C2454'}}/>
                  </ListItemIcon>
                  <ListItemText
                    primary={'Campanhas'}
                    primaryTypographyProps={{ style: { fontSize: '0.9rem', color: '#0C2454' } }}
                  />
                  {openInternSubmenu ? (
                    <ExpandLessIcon style={{color: '#0C2454'}}/>
                  ) : (
                    <ExpandMoreIcon style={{color: '#0C2454'}}/>
                  )}
                </ListItem>
                <Collapse
                  style={{ paddingLeft: 15 }}
                  in={openInternSubmenu}
                  timeout="auto"
                  unmountOnExit
                >

                  <List component="div" disablePadding>
                  <ListItemLink
        to="/contact-lists"
        primary={
        <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
        {i18n.t("mainDrawer.listItems.contactList")}
      </Typography> 
      }
        icon={<EventAvailableIcon style={{color: '#0C2454'}}/>}
      />
         <ListItemLink
        to="/campaigns"
        primary={<Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
        {i18n.t("Campanhas")}
      </Typography>}
        icon={<EventAvailableIcon style={{color: '#0C2454'}}/>}
      />                
                    <ListItem
                      onClick={() => history.push("/campaigns-config")}
                      button
                    >
                      <ListItemIcon>
                        <SettingsOutlinedIcon style={{color: '#0C2454'}}/>
                      </ListItemIcon>
                      <ListItemText primary="Configurações"
                                   primaryTypographyProps={{ style: { fontSize: '0.9rem', color: '#0c2454'} }}

                       />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}
           
    
             <Divider/>
           
            <ListSubheader
              hidden={collapsed}
              style={{
                position: "relative",
                fontSize: "17px",
                textAlign: "left",
                paddingLeft: 20,
                color: "#0C2454"
              }}
              inset
              color="inherit">
              {i18n.t("mainDrawer.listItems.management")}
            </ListSubheader>
            {showCampaigns && (
              <>
                <ListItem
                  button
                  onClick={() => setOpenManagementSubmenu((prev) => !prev)}
                >
                  <ListItemIcon>
                    <SettingsOutlinedIcon style={{color: '#0C2454'}}/>
                  </ListItemIcon>
                  <ListItemText
                    primary={i18n.t("mainDrawer.listItems.management")}
                    primaryTypographyProps={{ style: { fontSize: '0.9rem', color: '#0C2454' } }}

                  />
                  {openManagementSubmenu ? (
                    <ExpandLessIcon style={{color: '#0C2454'}}/>
                  ) : (
                    <ExpandMoreIcon style={{color: '#0C2454'}}/>
                  )}
                </ListItem>
                <Collapse
                  style={{ paddingLeft: 15 }}
                  in={openManagementSubmenu}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    
              <>

	  
	{showKanban && (  
	  <ListItemLink
        to="/kanban"
        primary={
          <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
          {i18n.t("Kanban")}
        </Typography> 
        }
        icon={<TableChartIcon style={{color: '#0C2454'}}/>}
      />
      
	  )}
	  
	  <ListItemLink
        to="/todolist"
        primary={
          <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
          {i18n.t("Tarefas")}
        </Typography> 
        }
        icon={<BorderColorIcon style={{color: '#0C2454'}}/>}
      />
       <ListItemLink
        to="/contacts"
        primary={
          <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
          {i18n.t("Contatos")}
        </Typography> 
        }
        icon={<ContactPhoneOutlinedIcon style={{color: '#0C2454'}}/>}
      />

       <ListItemLink
              to="/users"
              primary={
                <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
                {i18n.t("Usuários")}
              </Typography> 
              }
              icon={<PeopleAltOutlinedIcon style={{color: '#0C2454'}}/>}
            />
       <ListItemLink
            to="/"
            primary={
              <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
              {i18n.t("Dashboard")}
            </Typography> 
            }
            icon={<DashboardOutlinedIcon style={{color: '#0C2454'}}/>}
          />
      <ListItemLink
        to="/schedules"
        primary={
          <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
          {i18n.t("Agendamentos")}
        </Typography> 
        }
        icon={<EventIcon style={{color: '#0C2454'}}/>}
      />
       <ListItemLink
        to="/tags"
        primary={
          <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
          {i18n.t("Tags")}
        </Typography> 
        }
        icon={<LocalOfferIcon style={{color: '#0C2454'}}/>}
      />
       
              </>
                  </List>
                </Collapse>
              </>
            )}

      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <Divider />
            <ListSubheader
              hidden={collapsed}
              style={{
                position: "relative",
                fontSize: "17px",
                textAlign: "left",
                paddingLeft: 20,
                color: "#0C2454"
              }}
              inset
              color="inherit">
              {i18n.t("mainDrawer.listItems.queueIntegration")}
            </ListSubheader>
            
            {showCampaigns && (
              <>
                <ListItem
                  button
                  onClick={() => setOpenCampaignSubmenu((prev) => !prev)}
                >
                  <ListItemIcon>
                    <AccountTreeOutlinedIcon style={{color: '#0C2454'}}/>
                  </ListItemIcon>
                  <ListItemText
                    primary={i18n.t("mainDrawer.listItems.queueIntegration")}
                    primaryTypographyProps={{ style: { fontSize: '0.9rem', color: '#0c2454' } }}

                    
                  />
                  
                  {openCampaignSubmenu ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ListItem>
                <Collapse
                  style={{ paddingLeft: 15 }}
                  in={openCampaignSubmenu}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    
                     
              <>
                <ListItemLink
                  to="/messages-api"
                  primary={
                    <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
                    {i18n.t("API")}
                  </Typography> 
                  }
                  icon={<CodeRoundedIcon style={{color: '#0C2454'}}/>}
                />
              </>
            
                    <ListItemLink
              to="/queues"
              primary={
                <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
                {i18n.t("Filas & Chatbot")}
              </Typography> 
              }
              icon={<AccountTreeOutlinedIcon style={{color: '#0C2454'}}/>}
            />
                    <ListItemLink
                to="/prompts"
                primary={
                  <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
                  {i18n.t("Open.Ai")}
                </Typography> 
                }
                icon={<AllInclusive style={{color: '#0C2454'}}/>}
              />
                    
                    {showIntegrations && (
                      
              <ListItemLink
                to="/queue-integration"
                primary={
                  <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
                  {i18n.t("Integrações")}
                </Typography> 
                }
                icon={<DeviceHubOutlined style={{color: '#0C2454'}}/>}
                
              />
              
            )}
                  </List>
                </Collapse>
              </>
            )}
              <Divider />
             <ListSubheader
              hidden={collapsed}
              style={{
                position: "relative",
                fontSize: "17px",
                textAlign: "left",
                paddingLeft: 20,
                color: "#0C2454"
              }}
              inset
              color="inherit">
              {i18n.t("mainDrawer.listItems.support")}
            </ListSubheader>
      <ListItemLink
        to="/settings"
        primary={
          <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
          {i18n.t("Configurações")}
        </Typography> 
        }
        primaryTypographyProps={{ style: { color: '#0c2454' } }}

        icon={<SettingsOutlinedIcon  style={{color: '#0C2454'}}/>}
      />      

	  <ListItemLink
        to="/helps"
        primary={
          <Typography style={{ color: '#0C2454', fontSize: '0.9rem' }}>
          {i18n.t("Ajuda")}
        </Typography> 
        }
        
        icon={<HelpOutlineIcon style={{color:'#0c2454'}}/>}
      />
    
    <ListItemText
                    primary={i18n.t("mainDrawer.listItems.helps")}
                    primaryTypographyProps={{ style: { color: '#0c2454' } }}
      />
	
     <Divider />
            {!collapsed && <React.Fragment>
              <Divider />
              {/* 
              // IMAGEM NO MENU
              <Hidden only={['sm', 'xs']}>
                <img style={{ width: "100%", padding: "10px" }} src={logo} alt="image" />            
              </Hidden> 
              */}
              <Typography style={{ fontSize: "17px", padding: "10px", textAlign: "right", fontWeight: "bold" }}>
                {`6.0.0`}

              </Typography>
            </React.Fragment>
            }
			
          </>
        )}
      />
      
    </div>
  );
};

export default MainListItems;
