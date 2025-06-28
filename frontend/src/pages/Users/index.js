import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Grid,
} from "@material-ui/core";
import {
  Search as SearchIcon,
  DeleteOutline as DeleteOutlineIcon,
  Edit as EditIcon,
} from "@material-ui/icons";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import UserModal from "../../components/UserModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { SocketContext } from "../../context/Socket/SocketContext";

const useStyles = makeStyles((theme) => ({

  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    backgroundColor: 'red',
  },

  blueLine: {
    border: 0,
    height: "2px",
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(1, 0),
    marginTop: '5px'

  },
  searchField: {
    backgroundColor: '#DFDFDF',
    borderRadius: '12px',
    border: '1px solid #DFDFDF',
  },
  searchFieldWidth: {
    width: '269px',
  },
  searchFieldHeight: {
    '& .MuiInputBase-root': {
      height: '42px',
    },
  },
  titleMargin: {
    marginBottom: '20px',
  },
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px'
  },
  fundo: {
    marginTop: '80px',
    backgroundColor: 'white',
    width: '90%',
    height: '100%',
    marginLeft: '67px',
    borderRadius: '18px',
    padding: '16px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '5%',
      width: '95%',
      padding: '8px',
    },
  },
  tableResponsive: {
    overflowX: 'auto', // Permite rolagem horizontal em telas pequenas
    '& table': {
      minWidth: '600px', // Garante que a tabela não fique comprimida
    },
    [theme.breakpoints.down('sm')]: {
      '& table': {
        minWidth: '100%', // Ajusta largura para dispositivos menores
      },
      '& th, & td': {
        fontSize: '14px', // Reduz tamanho da fonte para telas pequenas
        padding: '6px', // Ajusta espaçamento
      },
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '4px', // Espaço entre os botões
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column', // Empilha os botões verticalmente
      alignItems: 'center',
    },
  },
  tableBody: {
    [theme.breakpoints.down('sm')]: {
      '& .MuiTableRow-root': {
        height: 'auto', // Remove a altura fixa das linhas
      },
    },
  },
  searchFieldWrapper: {
    display: "flex",
    gap: "10px", // Espaçamento entre os elementos
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column", // Empilha os elementos verticalmente em telas pequenas
      alignItems: "stretch", // Faz com que ocupem a largura total
    },
  },
  searchFieldSmall: {
    [theme.breakpoints.down("sm")]: {
      width: "30%", // Ocupa toda a largura em telas pequenas
      fontSize: "8px", // Reduz o tamanho da fonte
    },
  },
  addButtonSmall: {
    [theme.breakpoints.down("sm")]: {
      width: "30%", // Ocupa toda a largura em telas pequenas
      fontSize: "12px", // Reduz o tamanho da fonte
    },
  },


}));

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_USERS":
      const users = action.payload;
      const newUsers = [];
      users.forEach((user) => {
        const userIndex = state.findIndex((u) => u.id === user.id);
        if (userIndex !== -1) {
          state[userIndex] = user;
        } else {
          newUsers.push(user);
        }
      });
      return [...state, ...newUsers];
    case "UPDATE_USERS":
      const user = action.payload;
      const userIndex = state.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        state[userIndex] = user;
        return [...state];
      } else {
        return [user, ...state];
      }
    case "DELETE_USER":
      const userId = action.payload;
      const deleteUserIndex = state.findIndex((u) => u.id === userId);
      if (deleteUserIndex !== -1) {
        state.splice(deleteUserIndex, 1);
      }
      return [...state];
    case "RESET":
      return [];
    default:
      return state;
  }
};

const Users = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [users, dispatch] = useReducer(reducer, []);
  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_USERS", payload: data.users });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);
    socket.on(`company-${companyId}-user`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_USERS", payload: data.user });
      }
      if (data.action === "delete") {
        dispatch({ type: "DELETE_USER", payload: +data.userId });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  const handleOpenUserModal = () => {
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setUserModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      toast.success(i18n.t("users.toasts.deleted"));
      dispatch({ type: "DELETE_USER", payload: userId });
    } catch (err) {
      toastError(err);
    }
    setDeletingUser(null);
    setConfirmModalOpen(false);
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
    <div style={{ height: '80%' }}>

      <ConfirmationModal
        title={
          deletingUser &&
          `${i18n.t("users.confirmationModal.deleteTitle")} ${deletingUser.name}?`
        }
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => handleDeleteUser(deletingUser.id)}
      >
        {i18n.t("users.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <UserModal
        open={userModalOpen}
        onClose={handleCloseUserModal}
        aria-labelledby="form-dialog-title"
        userId={selectedUser && selectedUser.id}
      />
      <div className={classes.fundo}>
        <MainHeader>
          <Title>Usuários</Title>
          <MainHeaderButtonsWrapper className={classes.searchFieldWrapper}>
  <TextField
    variant="standard"
    className={classes.searchFieldSmall}
    style={{
      borderRadius: "10px",
      backgroundColor: "#D9D9D9",
      padding: "3px",
    }}
    placeholder="Pesquisar por Usuário"
    type="search"
    value={searchParam}
    onChange={handleSearch}
    InputProps={{
      disableUnderline: true,
      style: {
        color: "#0C2454",
        fontWeight: "bold",
      },
      inputProps: {
        style: {
          paddingLeft: "8px",
          "&::placeholder": {
            color: "#0C2454",
            fontWeight: "bold",
            opacity: 1,
            paddingLeft: "8px",
          },
        },
      },
      endAdornment: (
        <InputAdornment position="end">
          <SearchIcon style={{ color: "#0C2454" }} />
        </InputAdornment>
      ),
    }}
  />
  <Button
    variant="contained"
    color="primary"
    onClick={handleOpenUserModal}
    className={classes.addButtonSmall}
    style={{
      height: "42px",
      textTransform: "none",
      fontWeight: "bold",
    }}
  >
    Adicionar Usuário
  </Button>
</MainHeaderButtonsWrapper>
        </MainHeader>
        <hr className={classes.blueLine} style={{ marginTop: '-10px' }} />
        <Paper
          className={classes.tableResponsive}
          style={{
            border: '4px solid #34D3A3',
            borderRadius: '25px',
            overflow: 'hidden',
            marginTop: '25px',
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  style={{
                    color: '#0C2454',
                    fontSize: 17,
                    borderRight: '1px solid #34D3A3',
                    borderBottom: '1px solid #34D3A3',
                    padding: '8px 0',
                    width: '10%',
                  }}
                >
                  {i18n.t("users.table.id")}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    color: '#0C2454',
                    fontSize: 17,
                    borderRight: '1px solid #34D3A3',
                    borderBottom: '1px solid #34D3A3',
                    padding: '8px 0',
                    width: '25%',
                  }}
                >
                  {i18n.t("users.table.name")}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    color: '#0C2454',
                    fontSize: 17,
                    borderRight: '1px solid #34D3A3',
                    borderBottom: '1px solid #34D3A3',
                    padding: '8px 0',
                    width: '20%',
                  }}
                >
                  {i18n.t("users.table.email")}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    color: '#0C2454',
                    fontSize: 17,
                    borderRight: '1px solid #34D3A3',
                    borderBottom: '1px solid #34D3A3',
                    padding: '8px 0',
                    width: '20%',
                  }}
                >
                  {i18n.t("users.table.profile")}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    color: '#0C2454',
                    fontSize: 17,
                    borderBottom: '1px solid #34D3A3',
                    padding: '8px 0',
                    width: '10%',
                  }}
                >
                  {i18n.t("users.table.actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell align="center" style={{ borderRight: '1px solid #34D3A3', borderBottom: '1px solid #34D3A3', padding: '4px 0' }}>{user.id}</TableCell>
                  <TableCell align="center" style={{ borderRight: '1px solid #34D3A3', borderBottom: '1px solid #34D3A3', padding: '4px 0' }}>{user.name}</TableCell>
                  <TableCell align="center" style={{ borderRight: '1px solid #34D3A3', borderBottom: '1px solid #34D3A3', padding: '4px 0' }}>{user.email}</TableCell>
                  <TableCell align="center" style={{ borderRight: '1px solid #34D3A3', borderBottom: '1px solid #34D3A3', padding: '4px 0' }}>{user.profile}</TableCell>
                  <TableCell align="center" style={{ borderBottom: '1px solid #34D3A3', padding: '4px 0' }}>
                    <div className={classes.actions}>
                      <IconButton onClick={() => handleEditUser(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => { setDeletingUser(user); setConfirmModalOpen(true); }}>
                        <DeleteOutlineIcon color="secondary" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {loading && (
                <>
                  <TableRow>
                    <TableRowSkeleton />
                  </TableRow>
                  <TableRow>
                    <TableRowSkeleton />
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </div>
  );
};

export default Users;


