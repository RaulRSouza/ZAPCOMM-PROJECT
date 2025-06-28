import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Title from "../../components/Title";


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  mainPaper: {
    marginTop: '80px',
    width: '90%',
    maxWidth: '1500px',
    height: '700px',
    borderRadius: '16px',
    marginLeft: 'auto',
    marginRight: 'auto',

  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  title: {
    marginTop: '20px',
    fontWeight: 'bold',
    color: '#0C2454',
  },
  searchField: {
    backgroundColor: '#D9D9D9',
    borderRadius: '4px',
    height: '40px',
    width: '100%',
    maxWidth: '250px',
    border: '2px solid #A0A0A0',
    marginLeft: 'auto',
    '@media (max-width: 600px)': {
      marginLeft: '0',
      width: '100%',
      alignSelf: 'flex-end',

    },
  },
  blueLine: {
    height: '2px',
    backgroundColor: '#0C2454',
    margin: '1rem 0',
  },
  inputContainer: {
    display: 'flex',
    marginBottom: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: '8px',
    border: '0',
    flexGrow: 1,
    marginRight: '0.5rem',
    padding: '10px',
    height: '50px',
    fontSize: '16px',
    minWidth: '200px',
  },
  buttonRed: {
    backgroundColor: '#f44336',
    color: '#fff',
    borderRadius: '8px',
    padding: '6px 10px',
    minWidth: '60px',
    height: '52px',
    '&:hover': {
      backgroundColor: '#c62828',
    },
    marginLeft: '1rem',
    marginRight: '1rem',
    '@media (max-width: 600px)': {
      width: '100%',
      marginLeft: '0',
      marginRight: '0',
    },
  },
  button: {
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '14px',
    width: '100px',
    height: '51px',
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
  listContainer: {
    marginTop: '1rem',
    backgroundColor: 'transparent',
    borderRadius: '6px',
  },
  listItem: {
    height: '60px',
    backgroundColor: '#E0E0E0',
    borderRadius: '8px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center', // Centraliza checkbox e título verticalmente
    padding: '10px',
    '@media (max-width: 600px)': {
      flexDirection: 'column', // Alinha os itens verticalmente apenas em telas pequenas
      alignItems: 'stretch',
      height: 'auto', // Ajusta a altura para acomodar todos os itens
      padding: '16px', // Adiciona mais padding
    },
  },
  infoContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    '@media (max-width: 600px)': {
      flexDirection: 'column', // Empilha os itens verticalmente em telas pequenas
      alignItems: 'flex-start', // Alinha os itens à esquerda
      gap: '8px', // Adiciona espaço entre os itens
    },
  },
  taskText: {
    color: '#0C2454',
    fontWeight: 'bold',

    marginLeft: '10px', // Espaço entre o checkbox e o título
    whiteSpace: 'nowrap',
    flex: '1 0 auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '@media (max-width: 600px)': {
      whiteSpace: 'normal', // Permite quebra de linha em telas pequenas
      overflow: 'visible',
      fontSize: '14px',
      marginLeft: '0', // Remove a margem lateral
    },

  },
  avatarContainer: {
    marginRight: '20px',
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 600px)': {
      justifyContent: 'flex-start',
      gap: '10px', // Espaço entre avatar e texto
    },
  },
  avatar: {
    marginRight: '4px',
    '@media (max-width: 600px)': {
      width: '30px',
      height: '30px', // Ajusta tamanho do avatar em telas pequenas
    },
  },
  dateContainer: {
    marginRight: '20px',
    display: 'flex',
    justifyContent: 'flex-start',
    '@media (max-width: 600px)': {
      fontSize: '12px', // Ajusta fonte para telas pequenas
    },
  },
  statusContainer: {
    marginLeft: '20px',
    fontWeight: 'bold',
    color: '#4CAF50',
    '@media (max-width: 600px)': {
      fontSize: '12px', // Ajusta fonte em telas pequenas
    },
  },
  fundo: {
    marginTop: '80px',
    backgroundColor: 'white',
    width: '90%',
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: '18px',
    padding: '16px',
    '@media (max-width: 600px)': {
      padding: '10px', // Padding reduzido em telas pequenas
    },
  },
}));


export { useStyles };


const ToDoList = () => {
  const classes = useStyles();
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [searchParam, setSearchParam] = useState('');
  const [checked, setChecked] = useState([]);


  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);


  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };


  const handleAddTask = () => {
    if (!task.trim()) {
      return;
    }
    const now = new Date();
    if (editIndex >= 0) {
      const newTasks = [...tasks];
      newTasks[editIndex] = {
        text: task,
        createdAt: newTasks[editIndex].createdAt,
        updatedAt: now,
        status: newTasks[editIndex].status,
      };
      setTasks(newTasks);
      setTask('');
      setEditIndex(-1);
    } else {
      setTasks([...tasks, { text: task, createdAt: now, status: 'Pendente' }]);
      setTask('');
    }
  };


  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };


  const handleToggle = (index) => {
    const newTasks = [...tasks];
    newTasks[index].status = checked.includes(index) ? 'Pendente' : 'Concluída';
    setChecked((prev) => {
      const newChecked = [...prev];
      const currentIndex = newChecked.indexOf(index);
      if (currentIndex === -1) {
        newChecked.push(index);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      return newChecked;
    });
    setTasks(newTasks);
  };


  return (
    <div className={classes.fundo}>
      <div className={classes.root}>
        <div className={classes.titleContainer}>

          <Title>Tarefas</Title>

          <TextField
            placeholder="Pesquisar..."
            type="search"
            value={searchParam}

            onChange={(e) => setSearchParam(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: {
                color: '#0C2454',
                fontWeight: 'bold',
                backgroundColor: '#D9D9D9',
                borderRadius: '8px',
                height: '36.5px',

              },
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#0C2454' }} />
                </InputAdornment>
              ),
            }}
        />
        </div>

        <div className={classes.blueLine} />

        <div className={classes.contentContainer}>
          <div className={classes.inputContainer}>
            <input
              placeholder="Nova tarefa"
              className={classes.input}
              value={task}
              onChange={handleTaskChange}
            />

            <Button className={classes.buttonRed}>

              <DeleteIcon style={{ marginRight: '5px', marginLeft: '5px' }} />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              className={classes.button}
            >
              {editIndex >= 0 ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
          <div className={classes.listContainer}>
            <List>
              {tasks.map((task, index) => (
                <ListItem key={index} className={classes.listItem}>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(index) !== -1}
                    tabIndex={-1}
                    disableRipple
                    onClick={() => handleToggle(index)}
                    style={{

                      color: "#0C2454",
                      backgroundColor: "#FFFFFF",
                      width: '20px',
                      height: '20px',
                      padding: '0px',
                      borderRadius: '4px',
                      marginLeft: '10px',
                    }}
                  />
                  <Typography className={classes.taskText}>{task.text}</Typography>
                  <div className={classes.infoContainer}>
                    <div className={classes.avatarContainer}>
                      <Typography
                        variant="body2"
                        style={{
                          marginRight: '6px',
                          fontWeight: 'bold',
                          color: '#0C2454',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Criado por:
                      </Typography>
                      <Avatar className={classes.avatar}>U</Avatar>
                    </div>
                    <Typography
                      variant="body2"
                      className={classes.dateContainer}
                      style={{
                        fontWeight: 'bold',
                        color: '#0C2454',
                      }}
                    >
                      Criada em: {new Date(task.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      className={classes.statusContainer}
                      style={{
                        fontWeight: 'bold',
                        color: '#0C2454',
                      }}
                    >
                      Status: {task.status}
                    </Typography>

                  </div>
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => setEditIndex(index)}>
                      <EditIcon style={{ color: "#0C2454" }} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTask(index)}>
                      <DeleteIcon style={{ color: "#0C2454" }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>
    </div>

  );
};


export default ToDoList;

