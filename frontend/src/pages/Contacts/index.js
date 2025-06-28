import React, { useState, useEffect, useReducer, useContext } from "react";
import {useMediaQuery} from "@material-ui/core"
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import api from "../../services/api";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ContactModal from "../../components/ContactModal";
import ConfirmationModal from "../../components/ConfirmationModal/";

import { i18n } from "../../translate/i18n";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import MainContainer from "../../components/MainContainer";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../../components/Can";
import NewTicketModal from "../../components/NewTicketModal";
import { SocketContext } from "../../context/Socket/SocketContext";
import Announcements from "../Annoucements/index"
import {CSVLink} from "react-csv";
import Plus from "../../assets/plus.png"
import Importa from "../../assets/importa.png"
import Exporta from "../../assets/export.png"
import QueueIntegration from "../QueueIntegration";

const reducer = (state, action) => {
  if (action.type === "LOAD_CONTACTS") {
    const contacts = action.payload;
    const newContacts = [];

    contacts.forEach((contact) => {
      const contactIndex = state.findIndex((c) => c.id === contact.id);
      if (contactIndex !== -1) {
        state[contactIndex] = contact;
      } else {
        newContacts.push(contact);
      }
    });

    return [...state, ...newContacts];
  }

  if (action.type === "UPDATE_CONTACTS") {
    const contact = action.payload;
    const contactIndex = state.findIndex((c) => c.id === contact.id);

    if (contactIndex !== -1) {
      state[contactIndex] = contact;
      return [...state];
    } else {
      return [contact, ...state];
    }
  }

  if (action.type === "DELETE_CONTACT") {
    const contactId = action.payload;

    const contactIndex = state.findIndex((c) => c.id === contactId);
    if (contactIndex !== -1) {
      state.splice(contactIndex, 1);
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
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    borderRadius:'16px'
  },

  traco: {
    height: '2px',
    width: '100%',
    backgroundColor: '#0C2454',
    marginLeft: '0px',
  },
  icones: {
    width:'25px',
    [theme.breakpoints.down("sm")]:{
      width:'18px'
    }
  },
  icones2: {
    [theme.breakpoints.down("sm")]:{
      width:'15px'
    }
  },
  icones3: {
    width:'18px',
    [theme.breakpoints.down("sm")]:{
      width:'13px'
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
  celulaTabela:{
    overflow: 'hidden',
    color:'#0C2454',
    fontWeight:"bold",
    [theme.breakpoints.down("sm")]:{
      width:'400px',
      fontSize: '13px',
      padding:'6px'
    } 
  },
  barraDePesquisa:{
    [theme.breakpoints.down("sm")]:{
      width:'130px'
    }
    
  },
  botoesContatos:{
    backgroundColor:"#0C2454",
    width:'80px',
    height:'40px',
    padding:'10px',
    borderRadius:'10px',
    margin:'5px',
    border:'0',
    [theme.breakpoints.down("sm")]:{
    width:'40px',
    height:'40px',
    padding:'7px',
    border:'0',
    borderRadius:'8px',
    margin:'5px',
    }
  }
}));

const Contacts = () => {
  const classes = useStyles();
  const history = useHistory();

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam, setSearchParam] = useState("");
  const [contacts, dispatch] = useReducer(reducer, []);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [contactTicket, setContactTicket] = useState({});
  const [deletingContact, setDeletingContact] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        try {
          const { data } = await api.get("/contacts/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_CONTACTS", payload: data.contacts });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-contact`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_CONTACTS", payload: data.contact });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_CONTACT", payload: +data.contactId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ socketManager]);

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleOpenContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(false);
  };

  // const handleSaveTicket = async contactId => {
  // 	if (!contactId) return;
  // 	setLoading(true);
  // 	try {
  // 		const { data: ticket } = await api.post("/tickets", {
  // 			contactId: contactId,
  // 			userId: user?.id,
  // 			status: "open",
  // 		});
  // 		history.push(`/tickets/${ticket.id}`);
  // 	} catch (err) {
  // 		toastError(err);
  // 	}
  // 	setLoading(false);
  // };

  const handleCloseOrOpenTicket = (ticket) => {
    setNewTicketModalOpen(false);
    if (ticket !== undefined && ticket.uuid !== undefined) {
      history.push(`/tickets/${ticket.uuid}`);
    }
  };

  const hadleEditContact = (contactId) => {
    setSelectedContactId(contactId);
    setContactModalOpen(true);
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await api.delete(`/contacts/${contactId}`);
      toast.success(i18n.t("contacts.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingContact(null);
    setSearchParam("");
    setPageNumber(1);
  };

  const handleimportContact = async () => {
    try {
      await api.post("/contacts/import");
      history.go(0);
    } catch (err) {
      toastError(err);
    }
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
      <NewTicketModal
        modalOpen={newTicketModalOpen}
        initialContact={contactTicket}
        onClose={(ticket) => {
          handleCloseOrOpenTicket(ticket);
        }}
      />
      <ContactModal
        open={contactModalOpen}
        onClose={handleCloseContactModal}
        aria-labelledby="form-dialog-title"
        contactId={selectedContactId}
      ></ContactModal>
      <ConfirmationModal
        title={
          deletingContact
            ? `${i18n.t("contacts.confirmationModal.deleteTitle")} ${
                deletingContact.name
              }?`
            : `${i18n.t("Importar Contato")}`
         }
        open={confirmOpen}
        onClose={setConfirmOpen}
        onConfirm={(e) =>
          deletingContact
            ? handleDeleteContact(deletingContact.id)
            : handleimportContact()
        }>
        {deletingContact
          ? `${i18n.t("contacts.confirmationModal.deleteMessage")}`
          : `${i18n.t("contacts.confirmationModal.importMessage")}`}
      </ConfirmationModal>
      
      
      <div className={classes.fundo}>
       <div className={classes.contatos}>  
        <MainHeader style={{textAlign:'center'}}>
        <Title  style={{color:'#0C2454', fontWeight:"bold"}}>{i18n.t("contacts.title")}</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t("contacts.searchPlaceholder")}
            type="search"
            value={searchParam}
            onChange={handleSearch}
            className={classes.barraDePesquisa}
            InputProps={{
              disableUnderline: true, // remove a linha
              style: {
                color: '#0C2454',// cor do texto normal
                fontWeight: 'bold', // texto em negrito
                backgroundColor: "#D9D9D9",
                borderRadius: '8px',
                height: "36.5px",
              },
              inputProps: {
                style: {
                  paddingLeft: '8px',
                  '&::placeholder': {
                    color: '#0C2454',
                    fontWeight: 'bold',
                    Opacity: 1, // cor do placeholder
                    paddingLeft: "10px"
                  
                  },
                },
              },
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#0C2454' }} />
                </InputAdornment>
              ),
            }}
            /*InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}*/
          />
          <button
            onClick={(e) => setConfirmOpen(true)}
            className={classes.botoesContatos}
            >
            <img src={Importa} className={classes.icones} />
          </button>
          <button
            onClick={handleOpenContactModal}
            className={classes.botoesContatos}
            >
            <img src={Plus} className={classes.icones2}/>
            
          </button>

         <CSVLink style={{ textDecoration:'none', margin:'0'}} separator=";" filename={'contatos.csv'} data={contacts.map((contact) => ({ name: contact.name, number: contact.number, email: contact.email }))}>
          <button className={classes.botoesContatos}> 
          <img src={Exporta} className={classes.icones3} />
          </button>
          </CSVLink>		  

        </MainHeaderButtonsWrapper>
      </MainHeader>
      <div className={classes.traco}></div>
        <Table size="small" style={{ borderCollapse: 'separate', borderSpacing: '0 20px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" style={{color:'#0C2454', fontWeight:"bold"}}/>
              <TableCell style={{color:'#0C2454', fontWeight:"bold"}}>{i18n.t("contacts.table.name")}</TableCell>
              <TableCell align="center" style={{color:'#0C2454', fontWeight:"bold"}}>
                {i18n.t("contacts.table.whatsapp")}
              </TableCell>
              <TableCell align="center" style={{color:'#0C2454', fontWeight:"bold"}}>
                {i18n.t("contacts.table.email")}
              </TableCell>
              <TableCell align="center" style={{color:'#0C2454', fontWeight:"bold"}}> 
                {i18n.t("contacts.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{backgroundColor: "#D9D9D9"}}>
            <>
              {contacts.map((contact) => (
                <TableRow key={contact.id} style={{marginBottom: "5px", borderRadius:'16px'}}>
                  <TableCell className={classes.celulaTabela} style={{ borderRadius: '8px 0 0 8px'}}>
                    {<Avatar src={contact.profilePicUrl} />}
                  </TableCell>
                  <TableCell align='center' className={classes.celulaTabela}>{contact.name}</TableCell>
                  <TableCell align="center" className={classes.celulaTabela}>{contact.number}</TableCell>
                  <TableCell align="center" className={classes.celulaTabela}>{contact.email}</TableCell>
                  <TableCell align="center" className={classes.celulaTabela} style={{ borderRadius: '0 8px 8px 0'}}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setContactTicket(contact);
                        setNewTicketModalOpen(true);
                      }}
                    >
                      <WhatsAppIcon style={{color:"#34D3A3"}}/>
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => hadleEditContact(contact.id)}
                    >
                      <EditIcon style={{color:"#0C2454"}}/>
                    </IconButton>
                    <Can
                      role={user.profile}
                      perform="contacts-page:deleteContact"
                      yes={() => (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setConfirmOpen(true);
                            setDeletingContact(contact);
                          }}
                        >
                          <DeleteOutlineIcon style={{color:"red"}}/>
                        </IconButton>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton avatar columns={3} />}
            </>
          </TableBody>
        </Table>
        </div>
        <Announcements></Announcements>
      </div>
    </div>
  );
};

export default Contacts;
