import React from 'react';
import { Modal, Button } from 'react-bootstrap';
class TextChangeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        };
        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    close() {
        this.props.handleClose();
    }
    handleChange(e) {
        this.setState({ value: e.target.value });
    }
    handleSubmit() {
        console.log(this.state.value);
        this.props.handleChange(this.props.rowIndex, this.props.columnIndex, this.state.value);
    }
    render() {
        return (
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Change Value</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <label>
                            Value:
                    </label>
                        <input type="text" value={this.state.value} onChange={(e) => this.handleChange(e)} />
                        <br /><br />
                        <Button bsStyle="info" onClick={this.handleSubmit}>Submit</Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.close}>Close </Button>
                    </Modal.Footer>
                </Modal.Dialog>
        );
    }
}
export default TextChangeModal;