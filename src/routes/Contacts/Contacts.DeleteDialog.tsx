import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class ContactsDeleteDialog extends React.Component {
  constructor() {
    super({});
    this.state = {
      open: false,
      contacts: [],
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  handleClose() {
    this.setState({open: false});
  }

  handleOk() {
    // let ids = [];
    // for (let row of this.state.contacts) {
    //     ids.push(row.id);
    // }
    // this.handleClose();
    // this.props.onOk(ids);
  }

  show() {
    /*this.setState({
            open: true,
            contacts: contacts
        })*/
  }

  render() {
    return '';
    /*
        const title = (this.state.contacts.length > 1) ? 'Delete Selected Contacts?' : 'Delete Contact?';
        let num = this.state.contacts.length;
        let msg = `The selected ${num} contacts will be deleted.`;
        if (num === 1) {
            let name = `${this.state.contacts[0]['firstname']} ${this.state.contacts[0]['lastname']}`;
            msg = `The contact '${name}' will be deleted.`;
        }

        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                disableRestoreFocus={true}
            >
                <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {msg}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={this.handleOk}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog >
        );
        */
  }
}
