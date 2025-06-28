import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

import { AuthContext } from "../../context/Auth/AuthContext";
import { useDate } from "../../hooks/useDate";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    flex: 1,
    overflow: "hidden",
    borderRadius: 0,
    height: "95%",
    width: "65%",
    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
    backgroundColor: "#F5F4F3",
    borderRadius: "15px",
    top: "14%",
    left: "37%",
    zIndex: "1000",
    [theme.breakpoints.down("md")]: {
      width: "90%",
      left: "5%",
      top: "10%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "100%",
      left: "0",
      top: "0",
      borderRadius: "0",
    },
  },
  chatTitleContainer: {
    textAlign: "center",
    color: "#0C2454",
    fontSize: "32px",
    padding: theme.spacing(2),
    fontWeight: "bolder",
    [theme.breakpoints.down("sm")]: {
      fontSize: "24px",
      padding: theme.spacing(1),
    },
  },
  messageList: {
    position: "relative",
    overflowY: "auto",
    height: "75%",
    width: "95%",
    ...theme.scrollbarStyles,
    backgroundColor: "#F5F4F3",
    top: "30px",
    [theme.breakpoints.down("sm")]: {
      height: "70%",
      width: "100%",
      top: "10px",
    },
  },
  inputArea: {
    position: "relative",
    height: "10%",
    width: "90%",
    left: "5%",
    borderRadius: "16px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      left: "0",
    },
  },
  bord: {
    position: "relative",
    width: "90%",
    height: "100%",
    backgroundColor: "white",
    border: "2px solid #0C2454",
    borderRadius: "16px",
    zIndex: "1",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  input: {
    padding: "20px",
    backgroundColor: "#E2E2E2",
    borderRadius: "16px",
    position: "relative",
    border: "2px solid #0C2454",
    [theme.breakpoints.down("sm")]: {
      padding: "10px",
    },
  },
  buttonSend: {
    margin: theme.spacing(1),
  },
  boxLeft: {
    padding: "10px 25px 5px",
    margin: "10px 10px 10px auto",
    position: "relative",
    backgroundColor: "#0C2454",
    color: "#FFFFFF",
    textAlign: "right",
    maxWidth: "60%",
    borderRadius: 10,
    borderBottomRightRadius: 0,
    border: "1px solid rgba(0, 0, 0, 0.12)",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "80%",
    },
  },
  boxRight: {
    padding: "10px 25px 10px",
    margin: "10px 0px 0px auto",
    backgroundColor: "#0C2454",
    color: "#FFFFFF",
    textAlign: "right",
    fontSize: "18px",
    width: "50%",
    borderRadius: 10,
    borderBottomRightRadius: 0,
    border: "1px solid rgba(0, 0, 0, 0.12)",
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
  },
  line: {
    width: "90%",
    height: "2px",
    backgroundColor: "#0C2454",
    position: "relative",
    zIndex: "5",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  line2: {
    width: "90%",
    height: "2px",
    backgroundColor: "#0C2454",
    position: "relative",
    zIndex: "5",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  data: {
    position: "relative",
    maxWidth: "40%",
    zIndex: "10",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "80%",
    },
  },
}));



export default function ChatMessages({
  chat,
  messages,
  handleSendMessage,
  handleLoadMore,
  scrollToBottomRef,
  pageInfo,
  loading,
}) {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const { datetimeToClient } = useDate();
  const baseRef = useRef();

  const [contentMessage, setContentMessage] = useState("");

  const scrollToBottom = () => {
    if (baseRef.current) {
      baseRef.current.scrollIntoView({});
    }
  };

  const unreadMessages = (chat) => {
    if (chat !== undefined) {
      const currentUser = chat.users.find((u) => u.userId === user.id);
      return currentUser.unreads > 0;
    }
    return 0;
  };

  useEffect(() => {
    if (unreadMessages(chat) > 0) {
      try {
        api.post(`/chats/${chat.id}/read`, { userId: user.id });
      } catch (err) {}
    }
  }, []);

  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;
    if (!pageInfo.hasMore || loading) return;
    if (scrollTop < 600) {
      handleLoadMore();
    }
  };

  return (
    <Paper className={classes.mainContainer}>
      {/* Contêiner do título do chat selecionado */}
      <div className={classes.chatTitleContainer}>
        <Typography variant="h6" style={{fontSize: "30px"}}>
          {chat ? chat.title : "Selecione um chat"}
        </Typography>
      </div>
      
      <div className={classes.line}></div>
      <div className={classes.line2}></div>
      <div onScroll={handleScroll} className={classes.messageList}>
        {Array.isArray(messages) &&
          messages.map((item, key) => {
            if (item.senderId === user.id) {
              return (
                <Box key={key} className={classes.boxRight}>
                  <Typography variant="subtitle2" style={{fontSize:'18px' }}>
                    {item.sender.name}
                  </Typography>
                  {item.message}
                  <Typography variant="caption" display="block" style={{position:"relative",
                    bottom:"50px",
                    right:"140px",
                  }}>
                    {datetimeToClient(item.createdAt)}
                  </Typography>
                </Box>
              );
            } else {
              return (
                <Box key={key} className={classes.boxLeft}>
                  <Typography variant="subtitle2" style={{fontSize:'18px' }} >
                    {item.sender.name}
                  </Typography>
                  {item.message}
                  <Typography variant="caption" display="block">
                    {datetimeToClient(item.createdAt)}
                  </Typography>
                </Box>
              );
            }
          })}
        <div ref={baseRef}></div>
      </div>
      <div className={classes.inputArea}>
        <FormControl variant="outlined" fullWidth>
          <Input
            multiline
            value={contentMessage}
            onKeyUp={(e) => {
              if (e.key === "Enter" && contentMessage.trim() !== "") {
                handleSendMessage(contentMessage);
                setContentMessage("");
              }
            }}
            onChange={(e) => setContentMessage(e.target.value)}
            className={classes.input}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    if (contentMessage.trim() !== "") {
                      handleSendMessage(contentMessage);
                      setContentMessage("");
                    }
                  }}
                  className={classes.buttonSend}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
            disableUnderline
          />
        </FormControl>
        <div className={classes.line2}></div>
      </div>
    </Paper>
  );
}
