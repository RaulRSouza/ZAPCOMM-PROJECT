import React, { useState, useEffect, useReducer, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import { useHistory } from 'react-router-dom';
import openaifoto from "../../assets/images/openaifoto.png"
import calendfoto from "../../assets/images/calendfoto.png"
import fotoilust from "../../assets/images/fotoilust.png"
import frame219 from "../../assets/images/Frame 219.png"
import group264 from "../../assets/images/Group 264.png"
import grupofraciobarraempe from "../../assets/images/grupofraciobarraempe.png"
import chatfoto from "../../assets/images/chatfoto.png"
import zIndex from "@material-ui/core/styles/zIndex";
import MainContainer from "../../components/MainContainer";
//import efeito1 from "../../assets/efeito1.png";
import Paper from "@material-ui/core/Paper";
const useStyles = makeStyles(theme => ({
  /*root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  button: {
    background: "#10a110",
    border: "none",
    padding: "10px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
  },*/

  openAIbotao: {
    width: '325px',
    height: '230px',
    background: 'rgba(19,16,16,1)',
    opacity: '1',
    zndex: '1',
    borderRadius: '18px',
    boxShadow: '0px 3.100625991821289px 3px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
    marginRight: '20px',
    marginBottom: '30px',
    display: 'flex',
  },
  chatBotao: {
    width: '325px',
    height: '230px',
    background: 'rgba(10,38,64,0.9900000095367432)',
    borderRadius: '18px',
    boxShadow: '0px 3.100625991821289px 3px rgba(0, 0, 0, 0.25)',
    marginLeft: '20px',
    marginBottom: '30px',
    display: 'flex',
  },
  calendarioBotao: {
    width: '325px',
    height: '230px',
    background: 'rgba(52,211,163,1)',
    borderRadius: '18px',
    boxShadow: '0px 3.100625991821289px 3px rgba(0, 0, 0, 0.25)',
    marginLeft: '20px',
    display: 'flex',
  },
  fotoilustrada: {
    width: '400px',
    height: '489px',
    opacity: '1',
    zIndex: '1',
    borderRadius: '18px',
    marginRight: '1px'
  },
  
  sqo: {
    width: '294px',
    color: 'rgba(12,36,84,1)', 
    fontFamily: 'Arial',
    fontWeight: 'Bold',
    fontSize: '23px',
    opacity: '1',
    textAlign: 'center',
    marginLeft: '50px'
  },
  
  efeitovc: {
    width:'400px',
    height: '225px',
    background: 'rgba(79,233,164,0.28999999165534973)',
    opacity: '1',
    position: 'absolute',
    top: '0px',
    right: '0px',
    borderBottomLeftRadius: '300px',
    zIndex: '0',
  },
  agrupamentott: {
    marginTop: '10px',
    marginLeft: '50px',
  },
  imggraficos: {
    marginTop: '47px',
    marginLeft:'45em',
    zIndex: '1',
  },
  altzapcor: {
    color: '#34D3A3',
    fontSize: '44px'
  },
  welcome: {
    width: '480px',
    fontFamily: 'Arial',
    fontWeight: 'Bold',
    fontSize: '38px',
    opacity: '1',
    textAlign: 'left',
    color: '#0C2454'
  },
  explicativo: {
    width: '465px',
    color: 'rgba(12,36,84,1)',
    fontFamily: 'Arial',
    fontWeight: '500',
    fontSize: '16px',
    opacity: '1',
    textAlign: 'left',
  },
  
  openaitt: {
    color: 'rgba(255,255,255,1)',
    fontFamily: 'Arial',
    fontWeight: 'Bold',
    fontSize: '30px',
    marginTop: '100px',
    marginLeft: '10px',
  
  },
  chattt: {
    color: 'rgba(255,255,255,1)',
    marginTop: '100px',
    fontFamily: 'Arial',
    fontWeight: 'Bold',
    fontSize: '30px',
    marginLeft: '10px',
    
  
  },
  calendariott: {
    color: 'rgba(12,36,84,1)',
    fontFamily: 'Arial',
    fontWeight: 'Bold',
    fontSize: '30px',
    marginTop: '100px',
    marginLeft: '10px',
  },
  
  kanbanBotao: {
    width: '325px',
    height: '230px',
    background: 'rgb(251, 251, 251)',
    opacity: '1',
    zIndex: '1',
    border: '2.325469493865967px solid rgba(204,204,204,1)',
    borderRadius: '18px',
    overflow: 'hidden',
    display: 'flex',
  
  },
  kanbantt: {
    color: 'rgba(52,211,163,1)',
    fontFamily: 'Arial',
    fontWeight: 'Bold',
    fontSize: '30px',
    marginTop: '100px',
    marginLeft: '100px',
  },
  
  blocosrapidos: {
    zIndex: '1',
    marginTop: '0',
    width: '1100px',
  },
  
  orgablock: {
    display: 'flex',
    right: '0',
    padding: '10px',
      marginLeft: '20em'
  },
  
  imagensilu: {
    marginTop: '90px',
    width: '50px',
    height: '50px',
    marginLeft: '70px',
  },
  blocodecima: {
    display: 'flex',
    width: '100%',
  },
  traco: {
    height: '2px',
    width: '1600px',
    backgroundColor: '#0C2454',
    marginLeft: '50px',
    marginBottom: '20px',
  },
  grafico3: {
    marginLeft: '30px',
  },
  fundobranco: {
    paddingTop: '70px'
  }

  
}));

const PaginaInicio = () => {
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
  /*const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };*/

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

    const lanes = [
      {
        id: "lane0",
        title: i18n.t("Em aberto"),
        label: "0",
        cards: filteredTickets.map(ticket => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description: (
              <div>
                <p>
                  {ticket.contact.number}
                  <br />
                  {ticket.lastMessage}
                </p>
                <button 
                  className={classes.button} 
                  onClick={() => {
                    handleCardClick(ticket.uuid)
                  }}>
                    Ver Ticket
                </button>
              </div>
            ),
          title: ticket.contact.name,
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
          title: tag.name,
          label: tag.id.toString(),
          cards: filteredTickets.map(ticket => ({
            id: ticket.id.toString(),
            label: "Ticket nº " + ticket.id.toString(),
            description: (
              <div>
                <p>
                  {ticket.contact.number}
                  <br />
                  {ticket.lastMessage}
                </p>
                <button 
                  className={classes.button} 
                  onClick={() => {
                    
                    handleCardClick(ticket.uuid)
                  }}>
                    Ver Ticket
                </button>
              </div>
            ),
            title: ticket.contact.name,
            draggable: true,
            href: "/tickets/" + ticket.uuid,          
          })),
          style: { backgroundColor: tag.color, color: "white" }
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

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Paper
        className={classes.mainPaper}
        variant="outlined"
        //onScroll={handleScroll}
      >
    <div className={classes.fundobranco}>
    <div className={classes.efeitovc}></div>
    <div className={classes.blocodecima}>
        <div className={classes.agrupamentott}>
            <p className={classes.welcome}>BEM VINDO AO <span className={classes.altzapcor}>ZAPCOMM</span></p>
            <p className={classes.explicativo}>
                A plataforma que transforma o WhatsApp no seu canal de suporte
                inteligente, garantindo atendimento rápido, eficiente e uma
                experiência contínua para nossos clientes!
            </p>
        </div>
        <div className={classes.imggraficos}>
            <img src={frame219} alt=""/>
            <div>
                <img src={grupofraciobarraempe} alt=""/>
                <img src={group264} alt="" className={classes.grafico3}/>
            </div>
        </div>
    </div>
    <div className={classes.blocosrapidos}>
        <p className={classes.sqo}>Serviços que oferecemos</p>
        <div className={classes.traco}></div>
        <div className={classes.orgablock}>
            <div>
                <div className={classes.openAIbotao}>
                    <img src={openaifoto} alt="" className={classes.imagensilu}/>
                    <span className={classes.openaitt}>OpenAI</span>
                </div>
                <div className={classes.kanbanBotao}>
                    <span className={classes.kanbantt}>Kanban</span>
                </div>
            </div>
            <div className={classes.fotoilustrada}>
              <img src={fotoilust} alt=''/>
            </div>
            <div>
                <div className={classes.chatBotao}>
                    <img src={chatfoto} alt="" className={classes.imagensilu}/>
                    <span className={classes.chattt}>Chat</span>
                </div>
                <div className={classes.calendarioBotao}>
                    <img src={calendfoto} alt="" className={classes.imagensilu}/>
                    <span className={classes.calendariott}>Calendário</span>
                </div>
            </div>
        </div>
    </div>
</div>    
</Paper>
  );

};


export default PaginaInicio;
