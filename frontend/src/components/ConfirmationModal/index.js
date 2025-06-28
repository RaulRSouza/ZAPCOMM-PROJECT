import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { i18n } from "../../translate/i18n";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
	traco: {
	height: '2px',
	width: '95%',
	backgroundColor: '#0C2454',
	marginBottom: '20px',
	marginLeft:'10px',
},
}));
const ConfirmationModal = ({ title, children, open, onClose, onConfirm }) => {
	const classes = useStyles();
	return (
		<Dialog
			open={open}
			onClose={() => onClose(false)}
			aria-labelledby="confirm-dialog"
		>
			<DialogTitle id="confirm-dialog" style={{color:'#0C2454', textAlign:'center'}}>{title}</DialogTitle>
			<div className={classes.traco}></div>
				<Typography style={{padding: '0 10px', color:'#0C2454', marginBottom:'20px'}}>{children}</Typography>
			<div className={classes.traco}></div>
			<DialogActions>
				<Button
					variant="contained"
					onClick={() => onClose(false)}
					color="secondary"
				>
					<DeleteOutlineIcon style={{color: 'white'}} />
				</Button>
				<Button
					variant="contained"
					onClick={() => {
						onClose(false);
						onConfirm();
					}}
					color="primary"
				>
					{i18n.t("confirmationModal.buttons.confirm")}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmationModal;
