import React, { useState, useEffect } from "react";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import { makeStyles, Paper, Tabs, Tab } from "@material-ui/core";

import TabPanel from "../../components/TabPanel";

import SchedulesForm from "../../components/SchedulesForm";
import CompaniesManager from "../../components/CompaniesManager";
import PlansManager from "../../components/PlansManager";
import HelpsManager from "../../components/HelpsManager";
import Options from "../../components/Settings/Options";

import { i18n } from "../../translate/i18n.js";
import { toast } from "react-toastify";

import useCompanies from "../../hooks/useCompanies";
import useAuth from "../../hooks/useAuth.js";
import useSettings from "../../hooks/useSettings";

import OnlyForSuperUser from "../../components/OnlyForSuperUser";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    marginLeft:'67px',
    [theme.breakpoints.down("sm")]:{
      marginLeft:'20px',
    }

  },
  mainPaper: {
    ...theme.scrollbarStyles,
    overflowY: "scroll",
    flex: 1,
    borderRadius:'16px',
  },
  tab: {
    backgroundColor: theme.palette.options,
    border: `1px solid #0C2454`, // Borda em todos os tabs
    flexGrow: 1,
    fontSize: '1.2rem',
    '&.Mui-selected': {
      backgroundColor: '#0C2454',
      color: 'white',
    },
    '&:first-child': {
      borderTopLeftRadius: 4, // Bordas arredondadas apenas no canto superior esquerdo
      borderBottomLeftRadius: 4, // Bordas arredondadas na parte inferior esquerda
    },
    '&:last-child': {
      borderTopRightRadius: 4, // Bordas arredondadas apenas no canto superior direito
      borderBottomRightRadius: 4, // Bordas arredondadas na parte inferior direita
    },
  },
  paper: {
    ...theme.scrollbarStyles,
    overflowY: "scroll",
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    width: "100%",
    borderRadius:'16px',
  },
  container: {
    width: "100%",
    maxHeight: "100%",
    
  },
  control: {
    padding: theme.spacing(1),
  },
  textfield: {
    width: "100%",
  },
  traco: {
    height: '2px',
    width: '100%',
    backgroundColor: '#0C2454',
    marginBottom: '20px',
  },
  titulo:{
    fontSize:"25px",
    marginLeft:"20px",
    marginTop:"20px",
    color:"#0c2c54",
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
  [theme.breakpoints.down("sm")]:{
    marginLeft:'25px',
  }
  },
}));

const SettingsCustom = () => {
  const classes = useStyles();
  const [tab, setTab] = useState("options");
  const [schedules, setSchedules] = useState([]);
  const [company, setCompany] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [settings, setSettings] = useState({});
  const [schedulesEnabled, setSchedulesEnabled] = useState(false);

  const { getCurrentUserInfo } = useAuth();
  const { find, updateSchedules } = useCompanies();
  const { getAll: getAllSettings } = useSettings();

  useEffect(() => {
    async function findData() {
      setLoading(true);
      try {
        const companyId = localStorage.getItem("companyId");
        const company = await find(companyId);
        const settingList = await getAllSettings();
        setCompany(company);
        setSchedules(company.schedules);
        setSettings(settingList);

        if (Array.isArray(settingList)) {
          const scheduleType = settingList.find(
            (d) => d.key === "scheduleType"
          );
          if (scheduleType) {
            setSchedulesEnabled(scheduleType.value === "company");
          }
        }

        const user = await getCurrentUserInfo();
        setCurrentUser(user);
      } catch (e) {
        toast.error(e);
      }
      setLoading(false);
    }
    findData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (event, newValue) => {
      async function findData() {
        setLoading(true);
        try {
          const companyId = localStorage.getItem("companyId");
          const company = await find(companyId);
          const settingList = await getAllSettings();
          setCompany(company);
          setSchedules(company.schedules);
          setSettings(settingList);
  
          if (Array.isArray(settingList)) {
            const scheduleType = settingList.find(
              (d) => d.key === "scheduleType"
            );
            if (scheduleType) {
              setSchedulesEnabled(scheduleType.value === "company");
            }
          }
  
          const user = await getCurrentUserInfo();
          setCurrentUser(user);
        } catch (e) {
          toast.error(e);
        }
        setLoading(false);
      }
      findData();
      // eslint-disable-next-line react-hooks/exhaustive-deps

    setTab(newValue);
  };

  const handleSubmitSchedules = async (data) => {
    setLoading(true);
    try {
      setSchedules(data);
      await updateSchedules({ id: company.id, schedules: data });
      toast.success("Horários atualizados com sucesso.");
    } catch (e) {
      toast.error(e);
    }
    setLoading(false);
  };

  const isSuper = () => {
    return currentUser.super;
  };

  return (
    <div style={{height:'80%'}}>
      <MainHeader>
        
      </MainHeader>
      <div className={classes.fundo}>
      <div className={classes.titulo}>Configurações</div>
      <div className={classes.traco}></div>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          scrollButtons="on"
          variant="fullWidth"
          onChange={handleTabChange}
          classes={{ root: classes.root }}
          style={{ display: 'flex', width: '90%', marginBottom:'15px'}} // Mantém o display flex
        >

          <Tab label="Opções" value={"options"} classes={{ root: classes.tab }} />
  
  {isSuper() ? <Tab label="Empresas" value={"companies"} classes={{ root: classes.tab }} /> : null}
  {isSuper() ? <Tab label="Ajuda" value={"helps"} classes={{ root: classes.tab }} style={{ flexGrow: 1 }}/> : null}

        </Tabs>
        <Paper className={classes.paper} elevation={0}>
          
          <TabPanel
            className={classes.container}
            value={tab}
            name={"schedules"}
          >
            <SchedulesForm
              loading={loading}
              onSubmit={handleSubmitSchedules}
              initialValues={schedules}
            />
          </TabPanel>
          <OnlyForSuperUser
            user={currentUser}
            yes={() => (
              <TabPanel
                className={classes.container}
                value={tab}
                name={"companies"}
              >
                <CompaniesManager />
              </TabPanel>
            )}
          />
          <OnlyForSuperUser
            user={currentUser}
            yes={() => (
              <TabPanel
                className={classes.container}
                value={tab}
                name={"plans"}
              >
                <PlansManager />
              </TabPanel>
            )}
          />
          <OnlyForSuperUser
            user={currentUser}
            yes={() => (
              <TabPanel
                className={classes.container}
                value={tab}
                name={"helps"}
              >
                <HelpsManager />
              </TabPanel>
            )}
          />
          <TabPanel className={classes.container} value={tab} name={"options"}>
            <Options
              settings={settings}
              scheduleTypeChanged={(value) =>
                setSchedulesEnabled(value === "company")
              }
            />
          </TabPanel>
        </Paper>
      </div>
    </div>
  );
};

export default SettingsCustom;
