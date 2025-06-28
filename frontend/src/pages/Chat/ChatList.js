import React, { useContext, useState } from "react";
import {
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useDate } from "../../hooks/useDate";

import DeleteIcon from "@material-ui/icons/Delete";
import AccountCircle from "@material-ui/icons/AccountCircle";
import EditIcon from "@material-ui/icons/Edit";
import ConfirmationModal from "../../components/ConfirmationModal";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  lixo: {
    transform: "scale(0.5)",
  },
  tt: {
    position: "relative",
    bottom: "50px",
    marginLeft: "20%",
    color: "#0C2454",
    fontWeight: "bold",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "10%",
      fontSize: "1.5rem",
    },
  },
  ln: {
    height: "1px",
    width: "350%",
    backgroundColor: "#0C2454",
    position: "relative",
    left: "20%",
    bottom: "50px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      left: "0",
    },
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    flex: 1,
    height: "calc(100% - 58px)",
    width: "700px",
    overflow: "hidden",
    borderRadius: "12px",
    backgroundColor: "#FFFFFF",
    [theme.breakpoints.down("md")]: {
      width: "90%",
      margin: "0 auto",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      borderRadius: "0",
    },
  },
  chatList: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflowY: "auto",
    ...theme.scrollbarStyles,
    width: "660px",
    height: "auto",
    backgroundColor: "#FFFFFF",
    left: "61px",
    marginTop: "-30px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      left: "0",
      marginTop: "0",
      padding: theme.spacing(2),
    },
  },
  listItem: {
    cursor: "pointer",
    backgroundColor: "#D9D9D9",
    borderRadius: "6px",
    marginBottom: theme.spacing(2),
    height: "75px",
    width: "40%",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  ln2: {
    height: "2px",
    width: "80%",
    backgroundColor: "#0C2454",
    position: "relative",
    marginTop: "5px",
    marginBottom: "5px",
    right: "15%",
    borderRadius: "5px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      right: "0",
    },
  },
}));


export default function ChatList({
  chats,
  handleSelectChat,
  handleDeleteChat,
  handleEditChat,
  pageInfo,
  loading,
}) {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { datetimeToClient } = useDate();
  const [confirmationModal, setConfirmModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});
  const { id } = useParams();

  const goToMessages = async (chat) => {
    if (unreadMessages(chat) > 0) {
      try {
        await api.post(`/chats/${chat.id}/read`, { userId: user.id });
      } catch (err) {}
    }

    if (id !== chat.uuid) {
      history.push(`/chats/${chat.uuid}`);
      handleSelectChat(chat);
    }
  };

  const handleDelete = () => {
    handleDeleteChat(selectedChat);
  };

  const unreadMessages = (chat) => {
    const currentUser = chat.users.find((u) => u.userId === user.id);
    return currentUser.unreads;
  };

  const getPrimaryText = (chat) => {
    const mainText = chat.title;
    const unreads = unreadMessages(chat);
    return (
      <>
        <span style={{ fontWeight: "bold", display: "block", position:"relative", right:"15%",
         }}>{mainText}</span>
        <div className={classes.ln2}></div>
        {unreads > 0 && (
          <Chip
            size="small"
            style={{ marginLeft: 5 }}
            label={unreads}
            color="secondary"
          />
        )}
      </>
    );
  };

  const getItemStyle = (chat) => {
    return {
      borderLeft: chat.uuid === id ? "6px solid #002d6e" : null,
      backgroundColor: chat.uuid === id ? "#f0f0f0" : null,
    };
  };

  return (
    <>
      <h1 className={classes.tt}>Chat Interno</h1>
      <div className={classes.ln}></div>

      <ConfirmationModal
        title={"Excluir Conversa"}
        open={confirmationModal}
        onClose={setConfirmModalOpen}
        onConfirm={handleDelete}
      >
        Esta ação não pode ser revertida, confirmar?
      </ConfirmationModal>
      <div className={classes.chatList}>
        <List style={{ width: "100%" }}>
          {Array.isArray(chats) &&
            chats.length > 0 &&
            chats.map((chat, key) => (
              <ListItem
                onClick={() => goToMessages(chat)}
                key={key}
                className={classes.listItem}
                style={getItemStyle(chat)}
                button
              >
                <AccountCircle
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "20px",
                    width: "45px",
                    height: "45px",
                    color: "#0C2454",
                  }}
                />
                <ListItemText
                  primary={getPrimaryText(chat)}
                  style={{ marginLeft: "75px", top: "50%" }} // Ajusta o texto para o lado do ícone
                />
                {chat.ownerId === user.id && (
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => {
                        goToMessages(chat).then(() => {
                          handleEditChat(chat);
                        });
                      }}
                      edge="end"
                      aria-label="edit"
                      size="small"
                      style={{ marginRight: 5 ,
                        position:"relative",
                        right:"625%",
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedChat(chat);
                        setConfirmModalOpen(true);
                      }}
                      edge="end"
                      aria-label="delete"
                      size="small"
                      style={{ color: "#D3343E",
                        position:"relative",
                        right:"620%",
                       }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
        </List>
      </div>
    </>
  );
}
