import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import { Grid, LinearProgress, Typography } from "@material-ui/core";
import api from "../../services/api";
import { has, get, isNull } from "lodash";
import CardCounter from "../../components/Dashboard/CardCounter";
import GroupIcon from "@material-ui/icons/Group";
import ScheduleIcon from "@material-ui/icons/Schedule";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import DoneIcon from "@material-ui/icons/Done";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { useDate } from "../../hooks/useDate";

import { SocketContext } from "../../context/Socket/SocketContext";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(2),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  textRight: {
    textAlign: "right",
  },
  tabPanelsContainer: {
    padding: theme.spacing(2),
  },
  traco: {
    height: '2px',
    width: '100%%',
    backgroundColor: '#0C2454',
    marginLeft: '0px',
    marginTop: '10px'
  },
  icon: {
    color: '#0C2454'
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
}));

const CampaignReport = () => {
  const classes = useStyles();

  const { campaignId } = useParams();

  const [campaign, setCampaign] = useState({});
  const [validContacts, setValidContacts] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [confirmationRequested, setConfirmationRequested] = useState(0);
  const [confirmed, setConfirmed] = useState(0);
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  const { datetimeToClient } = useDate();

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    if (mounted.current) {
      findCampaign();
    }

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mounted.current && has(campaign, "shipping")) {
      if (has(campaign, "contactList")) {
        const contactList = get(campaign, "contactList");
        const valids = contactList.contacts.filter((c) => c.isWhatsappValid);
        setValidContacts(valids.length);
      }

      if (has(campaign, "shipping")) {
        const contacts = get(campaign, "shipping");
        const delivered = contacts.filter((c) => !isNull(c.deliveredAt));
        const confirmationRequested = contacts.filter(
          (c) => !isNull(c.confirmationRequestedAt)
        );
        const confirmed = contacts.filter(
          (c) => !isNull(c.deliveredAt) && !isNull(c.confirmationRequestedAt)
        );
        setDelivered(delivered.length);
        setConfirmationRequested(confirmationRequested.length);
        setConfirmed(confirmed.length);
        setDelivered(delivered.length);
      }
    }
  }, [campaign]);

  useEffect(() => {
    setPercent((delivered / validContacts) * 100);
  }, [delivered, validContacts]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-campaign`, (data) => {
     
      if (data.record.id === +campaignId) {
        setCampaign(data.record);

        if (data.record.status === "FINALIZADA") {
          setTimeout(() => {
            findCampaign();
          }, 5000);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, socketManager]);

  const findCampaign = async () => {
    setLoading(true);
    const { data } = await api.get(`/campaigns/${campaignId}`);
    setCampaign(data);
    setLoading(false);
  };

  const formatStatus = (val) => {
    switch (val) {
      case "INATIVA":
        return "Inativa";
      case "PROGRAMADA":
        return "Programada";
      case "EM_ANDAMENTO":
        return "Em Andamento";
      case "CANCELADA":
        return "Cancelada";
      case "FINALIZADA":
        return "Finalizada";
      default:
        return val;
    }
  };

  return (
    <div style={{height:'80%'}}>
      <div className={classes.fundo}>
        <MainHeader>
            <Grid style={{ width: "99.6%" }} container>
                <Grid xs={12} item>
                    <Title style={{ color:'#0C2454', fontWeight:800}}>Relatório da {campaign.name || "Campanha"}</Title>
                </Grid>
            </Grid>
        </MainHeader>
        <div className={classes.traco}></div>
        <Typography variant="h6" component="h2" style={{ color:'#0C2454', fontWeight:800, marginTop: '15px'}}>
          Status: {formatStatus(campaign.status)} {delivered} de {validContacts}
        </Typography>
        <Grid spacing={2} container>
          <Grid xs={12} item>
            <LinearProgress
              variant="determinate"
              style={{ height: 15, borderRadius: 3, margin: "20px 0" }}
              value={percent}
            />
          </Grid>
          <Grid xs={12} md={4} item>
            <CardCounter
              icon={<GroupIcon fontSize="inherit" className={classes.icon} />}
              title={<span style={{ color: '#0C2454', fontWeight: 'bold' }}>Contatos Válidos</span>}
              value={<span style={{ color: '#0C2454' }}>{validContacts}</span>}
              loading={loading}
            />
          </Grid>
          {campaign.confirmation && (
            <>
              <Grid xs={12} md={4} item>
                <CardCounter
                  icon={<DoneIcon fontSize="inherit" className={classes.icon} />}
                  title={<span style={{ color: '#0C2454', fontWeight: 'bold' }}>Confirmações Solicitadas</span>}
                  value={<span style={{ color: '#0C2454' }}>{confirmationRequested}</span>}
                  loading={loading}
                />
              </Grid>
              <Grid xs={12} md={4} item>
                <CardCounter
                  icon={<DoneAllIcon fontSize="inherit" className={classes.icon} />}
                  title={<span style={{ color: '#0C2454', fontWeight: 'bold' }}>Confirmações</span>}
                  value={<span style={{ color: '#0C2454' }}>{confirmed}</span>}
                  loading={loading}
                />
              </Grid>
            </>
          )}
          <Grid xs={12} md={4} item>
            <CardCounter
              icon={<CheckCircleIcon fontSize="inherit" className={classes.icon} />}
              title={<span style={{ color: '#0C2454', fontWeight: 'bold' }}>Entregues</span>}
              value={<span style={{ color: '#0C2454' }}>{delivered}</span>}
              loading={loading}
            />
          </Grid>
          {campaign.whatsappId && (
            <Grid xs={12} md={4} item>
              <CardCounter
                icon={<WhatsAppIcon fontSize="inherit" className={classes.icon} />}
                title={<span style={{ color: '#0C2454', fontWeight: 'bold' }}>Conexão</span>}
                value={<span style={{ color: '#0C2454' }}>{campaign.whatsapp.name}</span>}
                loading={loading}
              />
            </Grid>
          )}
          {campaign.contactListId && (
            <Grid xs={12} md={4} item>
              <CardCounter
                icon={<ListAltIcon fontSize="inherit" className={classes.icon} />}
                title={<span style={{ color: '#0C2454', fontWeight: 'bold' }}>Lista de Contatos</span>}
                value={<span style={{ color: '#0C2454' }}>{campaign.contactList.name}</span>}
                loading={loading}
              />
            </Grid>
          )}
          <Grid xs={12} md={4} item>
            <CardCounter
              icon={<ScheduleIcon fontSize="inherit" className={classes.icon} />}
              title={<span style={{ color: '#0C2454', fontWeight: 'bold' }}>Agendamento</span>}
              value={<span style={{ color: '#0C2454' }}>{datetimeToClient(campaign.scheduledAt)}</span>}
              loading={loading}
            />
          </Grid>
          <Grid xs={12} md={4} item>
            <CardCounter
              icon={<EventAvailableIcon fontSize="inherit" className={classes.icon} />}
              title={<span style={{ color: '#0C2454', fontWeight: 'bold' }}>Conclusão</span>}
              value={<span style={{ color: '#0C2454' }}>{datetimeToClient(campaign.completedAt)}</span>}
              loading={loading}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default CampaignReport;
