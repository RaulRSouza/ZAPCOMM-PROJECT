import React, { useEffect, useState } from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Button, Stack, TextField, Box, Typography } from '@mui/material';
import api from '../../services/api';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import './button.css';
import { makeStyles } from "@material-ui/core/styles"
const useStyles = makeStyles((theme) => ({
    areaGraficos:{
        [theme.breakpoints.down("sm")]:{
            display:'flex',
            flexDirection:'column'
          }
        
    },
    legenda:{
        border:"1px solid #ddd", 
        borderRadius:"8px", 
        backgroundColor:'#F7F9FB', 
        width:'300px', 
        height:'150px',
        marginLeft:'20px',
        padding:'10px',
        [theme.breakpoints.down("sm")]:{
            margin:'10px'
          }
    },
}))
export const ChatsUser = () => {
    const classes = useStyles();
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(new Date());
    const [ticketsData, setTicketsData] = useState([]);

    const companyId = localStorage.getItem("companyId");
    const data = [
        { nome: 'Jan', uv: 10000, pv: 12000, previousYear: 9000 },
        { nome: 'Feb', uv: 5000, pv: 15000, previousYear: 11000 },
        { nome: 'Mar', uv: 9000, pv: 16000, previousYear: 12000 },
        { nome: 'Apr', uv: 17000, pv: 17000, previousYear: 13000 },
        { nome: 'May', uv: 20000, pv: 20000, previousYear: 14000 },
        { nome: 'Jun', uv: 15000, pv: 22000, previousYear: 16000 },
        { nome: 'Jul', uv: 15000, pv: 25000, previousYear: 18000 },
    ];

    useEffect(() => {
        handleGetTicketsInformation();
    }, []);

    const handleGetTicketsInformation = async () => {
        try {
            const { data } = await api.get(`/dashboard/ticketsUsers?initialDate=${format(initialDate, 'yyyy-MM-dd')}&finalDate=${format(finalDate, 'yyyy-MM-dd')}&companyId=${companyId}`);
            setTicketsData(data?.data || []);
        } catch (error) {
            toast.error('Erro ao obter informações da conversa');
        }
    }

    return (
        <>
            <Typography component="h2" variant="h6" gutterBottom style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <span style={{ color: '#000' }}>ZAPCOMM</span> 
                <span style={{ color: '#1C1C1C', fontSize: '14px', opacity: '40%' }}>Atividades Mensal</span>
            </Typography>

            <Stack direction={'row'} spacing={2} alignItems={'center'} sx={{ my: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                    <DatePicker
                        value={initialDate}
                        onChange={(newValue) => { setInitialDate(newValue) }}
                        label="Inicio"
                        renderInput={(params) => <TextField fullWidth {...params} sx={{ width: '20ch' }} />}
                    />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                    <DatePicker
                        value={finalDate}
                        onChange={(newValue) => { setFinalDate(newValue) }}
                        label="Fim"
                        renderInput={(params) => <TextField fullWidth {...params} sx={{ width: '20ch' }} />}
                    />
                </LocalizationProvider>

                <Button className="buttonHover" onClick={handleGetTicketsInformation} variant='contained' style={{backgroundColor:'#0C294F'}}>Filtrar</Button>
            </Stack>

            <Box display="flex" alignItems="center" borderRadius={12} className={classes.areaGraficos}>
            <ResponsiveContainer width="80%" height={300} >
                <AreaChart data={data} className={classes.grafico}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f6f7f8" stopOpacity={1} />
                            <stop offset="95%" stopColor="#f6f7f8" stopOpacity={1} />
                        </linearGradient>
                    </defs>

                    <XAxis dataKey="nome" />
                    <YAxis
                        ticks={[0, 10000, 20000, 30000]}
                        tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip />

                    {/* Area and Line elements remain unchanged */}
                    <Area type="monotone" dataKey="uv" stroke="#5bd8b3" fillOpacity={1} fill="url(#colorUv)" />
                    <Line type="monotone" dataKey="pv" stroke="#00008B" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="previousYear" stroke="#8884d8" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
                </AreaChart>
            </ResponsiveContainer>


                <div ml={8} mb={17} p={2} className={classes.legenda}>
                    <Typography variant="subtitle1" gutterBottom style={{fontWeight:'bold', color:'#0C2454'}}>Tópicos</Typography>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Box width={16} height={16} borderRadius="50%" bgcolor="grey.500" mr={1} />
                        <Typography variant="body2">Finalizados</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Box width={16} height={16} borderRadius="50%" bgcolor="#00008B" mr={1} />
                        <Typography variant="body2">Novos</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box width={16} height={16} borderRadius="50%" bgcolor="#5bd8b3" mr={1} />
                        <Typography variant="body2">Não Finalizados</Typography>
                    </Box>
                </div>
            </Box>
        </>
    );
};
