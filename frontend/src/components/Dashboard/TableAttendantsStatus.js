import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';








const useStyles = makeStyles((theme) => ({
  tableContainer: {
    width: '100%',
    maxWidth: 1000,
    borderRadius: 10,
    margin: '0 auto',
    overflow: 'hidden',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    marginTop: theme.spacing(4),
  },
  table: {
    width: '100%',
    minWidth: 650,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    marginLeft: theme.spacing(1),
  },
  monthNav: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(0.5),
  },
  monthButton: {
    color: '#A0A0A0',
    textTransform: 'uppercase',
    fontSize: '0.85rem',
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    '&:hover': {
      color: theme.palette.primary.main,
    },
    margin: theme.spacing(0, 0.5),
  },
  activeMonthButton: {
    color: '#000000',
    textDecoration: 'underline',
    textDecorationColor: theme.palette.primary.main,
    textDecorationThickness: '2px',
    textUnderlineOffset: '4px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
  tableHeader: {
    backgroundColor: '#f9f9f9',
  },
  tableHeaderCell: {
    fontWeight: 'normal',
    textTransform: 'none',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  pageButton: {
    minWidth: '40px',
    height: '40px',
    margin: theme.spacing(0.5),
    borderRadius: '5px',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid ' + theme.palette.divider,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  activePageButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  disabledArrow: {
    color: theme.palette.action.disabled,
  },
  arrow: {
    color: theme.palette.primary.main,
  },
  tableHeight: {
    maxHeight: 800, // Increased height for more user display space
    overflowY: 'auto',
  },
}));








const ReportTable = () => {
  const classes = useStyles();
  const [activeMonth, setActiveMonth] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Rows per page








  const rows = [
    { date: '2018/10/02 10:57:46', name: 'Aruan', time: '10m', status: 'Completado' },
    { date: '2018/10/03 11:57:46', name: 'Any', time: '15m', status: 'Pendente' },
    { date: '2018/10/04 12:57:46', name: 'Melissa', time: '20m', status: 'Completado' },
    { date: '2018/10/05 13:57:46', name: 'Vitória', time: '25m', status: 'Pendente' },
    { date: '2018/10/06 14:57:46', name: 'Carlos', time: '18m', status: 'Completado' },
    { date: '2018/10/07 15:57:46', name: 'Ana', time: '22m', status: 'Pendente' },
    { date: '2018/10/08 16:57:46', name: 'Lucas', time: '12m', status: 'Completado' },
    { date: '2018/10/09 17:57:46', name: 'Fernanda', time: '30m', status: 'Pendente' },
    { date: '2018/10/10 18:57:46', name: 'João', time: '17m', status: 'Completado' },
    { date: '2018/10/11 19:57:46', name: 'Maria', time: '35m', status: 'Pendente' },
    { date: '2018/10/12 20:57:46', name: 'Pedro', time: '28m', status: 'Completado' },
  ];








  const maxPage = Math.ceil(rows.length / rowsPerPage);








  const handlePageChange = (page) => {
    setCurrentPage(page);
  };








  const handleNextPage = () => {
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };








  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };








  return (
    <Paper className={classes.tableContainer}>
      <div className={classes.header}>
        <div className={classes.titleContainer}>
          <IconButton>
            <EditIcon color="primary" />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Últimos Relatórios
          </Typography>
        </div>
      </div>
      <div className={classes.monthNav}>
        {['ALL', 'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'].map((month) => (
          <Button
            key={month}
            onClick={() => setActiveMonth(month)}
            className={month === activeMonth ? classes.activeMonthButton : classes.monthButton}
          >
            {month}
          </Button>
        ))}
      </div>
      <TableContainer className={classes.tableHeight}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.tableHeader}>
              <TableCell align="center" className={classes.tableHeaderCell} style={{ fontWeight: 'bold' }}>Data</TableCell>
              <TableCell align="center" className={classes.tableHeaderCell} style={{ fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell align="center" className={classes.tableHeaderCell} style={{ fontWeight: 'bold' }}>T.M de atendimento</TableCell>
              <TableCell align="center" className={classes.tableHeaderCell} style={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((row) => (
              <TableRow key={row.date}>
                <TableCell align="center">{row.date}</TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.time}</TableCell>
                <TableCell align="center">{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.paginationContainer}>
        <IconButton
          className={currentPage === 1 ? classes.disabledArrow : classes.arrow}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <ArrowBackIosIcon />
        </IconButton>
        {[...Array(maxPage)].map((_, index) => (
          <Button
            key={index + 1}
            className={`${classes.pageButton} ${index + 1 === currentPage ? classes.activePageButton : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <IconButton
          className={currentPage === maxPage ? classes.disabledArrow : classes.arrow}
          onClick={handleNextPage}
          disabled={currentPage === maxPage}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    </Paper>
  );
};








export default ReportTable;



