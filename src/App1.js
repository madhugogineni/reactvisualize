import React from 'react';
import './App.css';
import { Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css';
import TextChangeModal from './TextChangeModal';
import Draggable from 'react-draggable';
var list = addElements([]);

function addElements(list) {
    for (var i = 0; i < 100000; i++) {
        list.push({ name: 'Brian Vaughn', designation: "Software Engineer", city: "San Jose", state: "CA", pincode: "95125" });
        // 'Software Engineer', 'San Jose', 'CA', 95125, 'Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125, 'Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125
    }
    return list;
}
var activeList = setDisabled([]);

function setDisabled(list) {
    for (var i = 0; i < 100000; i++) {
        list.push([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
    }
    return list;
}
export default class App1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            activeList: [],
            randomvalue: Math.random(100),
            isModalShown: false,
            value: null,
            rowIndex: null,
            columnIndex: null
        };
        this._cellRender = this._cellRender.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount() {
        this.setState({ list: list, activeList: activeList });
    }
    handleClick(rowIndex, columnIndex) {
        var activeListArray = this.state.activeList;
        activeListArray[rowIndex][columnIndex] = false;
        console.log(activeListArray[rowIndex][columnIndex]);
        this.setState({ activeList: activeListArray });
    }
    handleChange(rowIndex, columnIndex, value) {
        var list = this.state.list;
        list[rowIndex][columnIndex] = value;
        this.setState({ list: list, randomvalue: Math.random(100), isModalShown: false });
        console.log(this.state.list[rowIndex][columnIndex]);
        this.forceUpdate();
    }
    closeModal() {
        this.setState({ isModalShown: false });
    }
    showModal(rowIndex, dataKey) {
        var value = this.state.list[rowIndex][dataKey];
        this.setState({ isModalShown: true, value: value, rowIndex: rowIndex, columnIndex: dataKey });
    }
    _cellRender({ cellData, rowData, columnData, columnIndex, rowIndex, dataKey, style, key, handleClick, handleChange }) {
        return (
            <div
                className="cell"
                key={key}
                style={style}
                readOnly={this.state.activeList[rowIndex][columnIndex]}
                onDoubleClick={this.showModal.bind(this, rowIndex, dataKey)}
                onChange={(e) => this.handleChange(rowIndex, dataKey)} >
                {cellData}
            </div>
        )
    }
    render() {
        let editTextModal;
        if (this.state.isModalShown === true) {
            editTextModal = <TextChangeModal value={this.state.value} rowIndex={this.state.rowIndex}
                columnIndex={this.state.columnIndex} handleClose={this.closeModal}
                handleChange={this.handleChange} />
        }
        return (
            <React.Fragment>
                <Draggable bounds={{ bottom: 300 }}>
                    <Table
                        width={500}
                        height={300}
                        headerHeight={20}
                        rowHeight={30}
                        rowCount={list.length}
                        rowStyle={{ borderBottom: "1px solid black" }}
                        rowGetter={({ index }) => this.state.list[index]} >
                        <Column
                            label='Name'
                            dataKey='name'
                            width={500}
                            style={{ display: "flex", alignItems: "center" }}
                            cellRenderer={this._cellRender} />
                        <Column
                            label='Designation'
                            dataKey='designation'
                            width={750}
                            cellRenderer={this._cellRender} />
                        <Column
                            label='City'
                            dataKey='city'
                            width={400}
                            cellRenderer={this._cellRender} />
                        <Column
                            label='State'
                            dataKey='state'
                            width={300}
                            cellRenderer={this._cellRender} />
                        <Column
                            label='Pincode'
                            dataKey='pincode'
                            width={300}
                            cellRenderer={this._cellRender} />
                    </Table>
                </Draggable>
                {editTextModal}
                <Draggable>
                    <div>wgcjdc</div>
                </Draggable>
            </React.Fragment>
        );
    }
}