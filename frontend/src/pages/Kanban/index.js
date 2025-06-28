import React, { useState, useEffect, useReducer, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import Board from 'react-trello';
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import { useHistory } from 'react-router-dom';
import MainContainer from "../../components/MainContainer";
import Title from "../../components/Title";
import MainHeader from "../../components/MainHeader";
import {useMediaQuery} from "@material-ui/core"
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  button: {
    background: "#34D3A3",
    border: "none",
    padding: "10px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
    boxShadow:'0px 2px 4px gray',
  },
  fundo: {
    marginTop:'80px',
    backgroundColor:'white',
    width:'90%',
    height:'80%',
    marginLeft:'67px',
    borderRadius:'18px',
    padding:'16px',
    [theme.breakpoints.down("sm")]:{
      marginLeft:'25px',
    }
  },
  traco: {
    height: '2px',
    width: '100%',
    backgroundColor: '#0C2454',
    marginLeft: '0px',
  },
  
}));

const Kanban = () => {
  const classes = useStyles();
  const history = useHistory();

  const [tags, setTags] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);


  const fetchTags = async () => {
    try {
      const response = await api.get("/tags/kanban");
      const fetchedTags = response.data.lista || []; 

      setTags(fetchedTags);

      // Fetch tickets after fetching tags
      await fetchTickets(jsonString);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const [file, setFile] = useState({
    lanes: []
  });


  const [tickets, setTickets] = useState([]);
  const { user } = useContext(AuthContext);
  const { profile, queues } = user;
  const jsonString = user.queues.map(queue => queue.UserQueue.queueId);

  const fetchTickets = async (jsonString) => {
    try {
      
      const { data } = await api.get("/ticket/kanban", {
        params: {
          queueIds: JSON.stringify(jsonString),
          teste: true
        }
      });
      setTickets(data.tickets);
    } catch (err) {
      console.log(err);
      setTickets([]);
    }
  };


  const popularCards = (jsonString) => {
    const filteredTickets = tickets.filter(ticket => ticket.tags.length === 0);
    const aguardandfornecedor = tickets.filter(ticket => ticket.status === 'AguardFornecedor');
    const ematendimento = tickets.filter(ticket => ticket.status === 'ematendimento');
    const impedido = tickets.filter(ticket => ticket.status === 'impedido');
    const finalizado = tickets.filter(ticket => ticket.status === 'finalizado');

    const lanes = [
      {
        id: "lane0",
        title: i18n.t("Em aberto"),
        label: "0",
        style:{backgroundColor:'white', padding:'10px , 0px !important', height:'600px'},
        cards: filteredTickets.map(ticket => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description: (
              <div>
                <p style={{marginTop:'0',}}>
                 <div style={{fontWeight:'600',color:'#0C2C54'}}> {ticket.contact.number}</div>
                  <div style={{paddingLeft:'3px'}}>{ticket.lastMessage}</div>
                </p>
              </div>
            ),
          title: (<div style={{display:'flex', justifyContent:'space-between', width:'250px'}}>{ticket.contact.name}        <button 
            className={classes.button} 
            onClick={() => {
              handleCardClick(ticket.uuid)
            }}>
              Ver Ticket
          
          </button></div>),
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      },
      {
        id: "lane1",
        title: i18n.t("Em Atendimento"),
        label: "0",
        style:{backgroundColor:'white', padding:'10px , 0px !important', height:'20%'},
        cards: ematendimento.map(ticket => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description: (
              <div>
                <p style={{marginTop:'0',}}>
                 <div style={{fontWeight:'600',color:'#0C2C54'}}> {ticket.contact.number}</div>
                  <div style={{paddingLeft:'3px'}}>{ticket.lastMessage}</div>
                </p>
              </div>
            ),
          title: (<div style={{display:'flex', justifyContent:'space-between', width:'250px'}}>{ticket.contact.name}        <button 
            className={classes.button} 
            onClick={() => {
              handleCardClick(ticket.uuid)
            }}>
              Ver Ticket
          
          </button></div>),
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      },
      {
        id: "lane2",
        title: i18n.t("Aguardando Fornecedor"),
        label: "0",
        style:{backgroundColor:'white', padding:'10px , 0px !important', height:'20%'},
        cards: aguardandfornecedor.map(ticket => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description: (
              <div>
                <p style={{marginTop:'0',}}>
                 <div style={{fontWeight:'600',color:'#0C2C54'}}> {ticket.contact.number}</div>
                  <div style={{paddingLeft:'3px'}}>{ticket.lastMessage}</div>
                </p>
              </div>
            ),
          title: (<div style={{display:'flex', justifyContent:'space-between', width:'250px'}}>{ticket.contact.name}        <button 
            className={classes.button} 
            onClick={() => {
              handleCardClick(ticket.uuid)
            }}>
              Ver Ticket
          
          </button></div>),
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      },
      {
        id: "lane3",
        title: i18n.t("Impedidos"),
        label: "0",
        style:{backgroundColor:'white', padding:'10px , 0px !important', height:'20%'},
        cards: impedido.map(ticket => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description: (
              <div>
                <p style={{marginTop:'0',}}>
                 <div style={{fontWeight:'600',color:'#0C2C54'}}> {ticket.contact.number}</div>
                  <div style={{paddingLeft:'3px'}}>{ticket.lastMessage}</div>
                </p>
              </div>
            ),
          title: (<div style={{display:'flex', justifyContent:'space-between', width:'250px'}}>{ticket.contact.name}        <button 
            className={classes.button} 
            onClick={() => {
              handleCardClick(ticket.uuid)
            }}>
              Ver Ticket
          
          </button></div>),
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      },
      {
        id: "lane4",
        title: i18n.t("Finalizados"),
        label: "0",
        style:{backgroundColor:'white', padding:'10px , 0px !important', height:'20%'},
        cards: finalizado.map(ticket => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description: (
              <div>
                <p style={{marginTop:'0',}}>
                 <div style={{fontWeight:'600',color:'#0C2C54'}}> {ticket.contact.number}</div>
                  <div style={{paddingLeft:'3px'}}>{ticket.lastMessage}</div>
                </p>
              </div>
            ),
          title: (<div style={{display:'flex', justifyContent:'space-between', width:'250px'}}>{ticket.contact.name}        <button 
            className={classes.button} 
            onClick={() => {
              handleCardClick(ticket.uuid)
            }}>
              Ver Ticket
          
          </button></div>),
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      },
      ...tags.map(tag => {
        const filteredTickets = tickets.filter(ticket => {
          const tagIds = ticket.tags.map(tag => tag.id);
          return tagIds.includes(tag.id);
        });

        return {
          id: tag.id.toString(),
          title: (<div style={{display:'flex',justifyContent:'space-between', width:'250px'}}>{tag.name}<div style={{width:'45px',height:'20px',borderRadius:'5px', backgroundColor:tag.color, }}></div></div>),
          label: '',
          cards: filteredTickets.map(ticket => ({
            id: ticket.id.toString(),
            label: "Ticket nº " + ticket.id.toString(),
            description: (
              <div>
                <p style={{marginTop:'0',}}>
                 <div style={{fontWeight:'600',color:'#0C2C54'}}> {ticket.contact.number}</div>
                  <div style={{paddingLeft:'3px'}}>{ticket.lastMessage}</div>
                </p>
              </div>
            ),
            title: (<div style={{display:'flex', justifyContent:"space-between", width:'250px'}}>
                          <div style={{display:'flex'}}>{ticket.contact.name}
                            <div style={{width:'10px',height:'10px',backgroundColor:tag.color, borderRadius:'10px', marginTop:'7px',marginLeft:'5px'}}></div>
                          </div>
                          <button 
            className={classes.button} 
            onClick={() => {
              handleCardClick(ticket.uuid)
            }}>
              Ver Ticket
          
          </button>
                    </div>),
            draggable: true,
            href: "/tickets/" + ticket.uuid,          
          })),
          style: { backgroundColor:'white', color: "white" }
        };
      }),
    ];

    setFile({ lanes });
  };

  const handleCardClick = (uuid) => {  
    //console.log("Clicked on card with UUID:", uuid);
    history.push('/tickets/' + uuid);
  };

  useEffect(() => {
    popularCards(jsonString);
}, [tags, tickets, reloadData]);

  const handleCardMove = async (cardId, sourceLaneId, targetLaneId) => {
    try {
        
          await api.delete(`/ticket-tags/${targetLaneId}`);
        toast.success('Ticket Tag Removido!');
          await api.put(`/ticket-tags/${targetLaneId}/${sourceLaneId}`);
        toast.success('Ticket Tag Adicionado com Sucesso!');
          await fetchTickets(jsonString);
          popularCards(jsonString);

    } catch (err) {
      console.log(err);
    }
  };
const MeuCartao = ({id, label, title, href, ticket,description}) => {
  const handleCardClick = (uuid) => {  
    //console.log("Clicked on card with UUID:", uuid);
    history.push('/tickets/' + uuid);
  };
  return (
    <div style={{backgroundColor:'#d9d9d9', marginBottom:'10px',padding:'10px',height:'115px', borderRadius:'8px',boxShadow:'0px 2px 4px gray',}}>
      <div style={{fontSize:'16px', color:'#0C2C54', fontWeight:'600', fontFamily:'inter', display:'flex', justifyContent:'space-between', width:'250px'}}>
        {title}
      </div>
      <div style={{
          fontSize: "12px",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "pre-wrap",
          color: "rgba(0, 0, 0, 0.50)",
          width:'150px',
          height:'60px',
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {description}
        </div>
    </div>
  )
}
const CustomLaneHeader = ({label, cards, title, current, target,tag
}) => {
    return (
      <div>
        <header
          style={{
            backgroundColor: "#0C2C54",
            padding: "10px 15px",
            borderRadius: "10px",
            color: "#FFFFFF",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",

          }}>
          <div
            style={{
              fontFamily: "inter",
              fontSize: "18px",
              fontWeight: "500",
              lineHeight: "normal",
            }}>
            {title}
          </div>
        </header>
      </div>
    );
  };

    return (
      <div className={classes.fundo}>
        <MainHeader>
          <Title style={{color:'#0C2454', fontWeight:"bold"}}>
            Kanban

          </Title>
        </MainHeader>
        <div className={classes.traco}></div>
        <Board
        className={classes.quadro}
          data={file}
          onCardMoveAcrossLanes={handleCardMove}
          style={{
            backgroundColor: '#FFFFFF',
            marginColor: "#0C2454",
            padding: "10px",
            borderRadius: "10px",
            height:'92%',
          }}
          components={{
            LaneHeader: CustomLaneHeader,
            Card: MeuCartao
          }}
        />
        
      </div>
    );
  };


export default Kanban;
