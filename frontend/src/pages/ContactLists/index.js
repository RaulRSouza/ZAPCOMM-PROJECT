import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";

import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import PeopleIcon from "@material-ui/icons/People";
import DownloadIcon from "@material-ui/icons/GetApp";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ContactListDialog from "../../components/ContactListDialog";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { Grid } from "@material-ui/core";

import planilhaExemplo from "../../assets/planilha.xlsx";
import { SocketContext } from "../../context/Socket/SocketContext";

const reducer = (state, action) => {
  if (action.type === "LOAD_CONTACTLISTS") {
    const contactLists = action.payload;
    const newContactLists = [];

    contactLists.forEach((contactList) => {
      const contactListIndex = state.findIndex((u) => u.id === contactList.id);
      if (contactListIndex !== -1) {
        state[contactListIndex] = contactList;
      } else {
        newContactLists.push(contactList);
      }
    });

    return [...state, ...newContactLists];
  }

  if (action.type === "UPDATE_CONTACTLIST") {
    const contactList = action.payload;
    const contactListIndex = state.findIndex((u) => u.id === contactList.id);

    if (contactListIndex !== -1) {
      state[contactListIndex] = contactList;
      return [...state];
    } else {
      return [contactList, ...state];
    }
  }

  if (action.type === "DELETE_CONTACTLIST") {
    const contactListId = action.payload;

    const contactListIndex = state.findIndex((u) => u.id === contactListId);
    if (contactListIndex !== -1) {
      state.splice(contactListIndex, 1);
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
    borderRadius:'16px',
  },
  traco: {
    height: '2px',
    width: '99%',
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
}));

const ContactLists = () => {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedContactList, setSelectedContactList] = useState(null);
  const [deletingContactList, setDeletingContactList] = useState(null);
  const [contactListModalOpen, setContactListModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [contactLists, dispatch] = useReducer(reducer, []);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContactLists = async () => {
        try {
          const { data } = await api.get("/contact-lists/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_CONTACTLISTS", payload: data.records });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchContactLists();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-ContactList`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_CONTACTLIST", payload: data.record });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_CONTACTLIST", payload: +data.id });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  const handleOpenContactListModal = () => {
    setSelectedContactList(null);
    setContactListModalOpen(true);
  };

  const handleCloseContactListModal = () => {
    setSelectedContactList(null);
    setContactListModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditContactList = (contactList) => {
    setSelectedContactList(contactList);
    setContactListModalOpen(true);
  };

  const handleDeleteContactList = async (contactListId) => {
    try {
      await api.delete(`/contact-lists/${contactListId}`);
      toast.success(i18n.t("contactLists.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingContactList(null);
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

  const goToContacts = (id) => {
    history.push(`/contact-lists/${id}/contacts`);
  };

  return (
    <div style={{height:'80%'}}>
      <ConfirmationModal
        title={
          deletingContactList &&
          `${i18n.t("contactLists.confirmationModal.deleteTitle")} ${
            deletingContactList.name
          }?`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteContactList(deletingContactList.id)}
      >
        {i18n.t("contactLists.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <ContactListDialog
        open={contactListModalOpen}
        onClose={handleCloseContactListModal}
        aria-labelledby="form-dialog-title"
        contactListId={selectedContactList && selectedContactList.id}
      />

        <div className={classes.fundo}>
        <div className={classes.listacont}>
              <MainHeader>
        <Grid style={{ width: "99.6%" }} container>
          <Grid xs={12} sm={8} item>
            <Title>{i18n.t("contactLists.title")}</Title>
          </Grid>
          <Grid xs={12} sm={4} item>
            <Grid spacing={2} container>
              <Grid xs={7} sm={6} item>
              <TextField
            placeholder='Pesquisar Contatos'
            type="search"
            value={searchParam}
            onChange={handleSearch}
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
                />
              </Grid>
              <Grid xs={5} sm={6} item>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleOpenContactListModal}
                >
                  {i18n.t("contactLists.buttons.add")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MainHeader>
      <div className={classes.traco}></div>
        <Table size="small" style={{ borderCollapse: 'separate', borderSpacing: '0 20px' }}> 
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{color:'#0C2454', fontWeight:"bold" }}>
                {i18n.t("contactLists.table.name")}
              </TableCell>
              <TableCell align="center" style={{color:'#0C2454', fontWeight:"bold" }}>
                {i18n.t("contactLists.table.contacts")}
              </TableCell>
              <TableCell align="center" style={{color:'#0C2454', fontWeight:"bold" }}>
                {i18n.t("contactLists.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{backgroundColor: "#D9D9D9"}}>
            <>
              {contactLists.map((contactList) => (
                <TableRow key={contactList.id}>
                  <TableCell align="center" style={{ borderRadius: '8px 0 0 8px', overflow: 'hidden',color:'#0C2454', fontWeight:"bold" }}>{contactList.name}</TableCell>
                  <TableCell align="center" style={{ overflow: 'hidden',color:'#0C2454', fontWeight:"bold" }}>
                    {contactList.contactsCount || 0}
                  </TableCell>
                  <TableCell align="center" style={{ borderRadius: '0 8px 8px 0',overflow: 'hidden',color:'#0C2454', fontWeight:"bold" }}>
                    <a href={planilhaExemplo} download="planilha.xlsx">
                      <IconButton size="small" title="Baixar Planilha Exemplo" style={{color:'#0C2454'}}>
                        <DownloadIcon />
                      </IconButton>
                    </a>

                    <IconButton
                      size="small"
                      onClick={() => goToContacts(contactList.id)}
                      style={{color:'#0C2454'}}
                    >
                      <PeopleIcon />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => handleEditContactList(contactList)}
                      style={{color:'#0C2454'}}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setConfirmModalOpen(true);
                        setDeletingContactList(contactList);
                      }}
                      style={{color:'red'}}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={3} />}
            </>
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
};

export default ContactLists;
