import React from 'react';
import './App.css';
import { Table, Column, SortDirection, SortIndicator } from 'react-virtualized';
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
const TOTAL_WIDTH = 500;
export default class App1 extends React.Component {
    constructor(props) {
        super(props);
        this.dataList = list;
        this.state = {
            list: [],
            activeList: [],
            randomvalue: Math.random(100),
            isModalShown: false,
            value: null,
            rowIndex: null,
            columnIndex: null,
            rowCount: list.length,
            widths: {
                name: 0.33,
                designation: 0.33,
                city: 0.33,
                state: 0.33,
                pincode: 0.33
            }
        };
        this._cellRender = this._cellRender.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.headerRenderer = this.headerRenderer.bind(this);
        this.sort = this.sort.bind(this);
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
    headerRenderer = ({
        columnData,
        dataKey,
        disableSort,
        label,
        sortBy,
        sortDirection
    }) => {
        return (
            <React.Fragment key={dataKey}>
                <Draggable
                    axis="x"
                    defaultClassName="DragHandle"
                    defaultClassNameDragging="DragHandleActive"
                    onDrag={(event, { deltaX }) =>
                        this.resizeRow({
                            dataKey,
                            deltaX
                        })
                    }
                    position={{ x: 0 }}
                    zIndex={999}>
                    <div className="ReactVirtualized__Table__headerTruncatedText">
                        {label}
                    </div>
                </Draggable>
            </React.Fragment>
        );
    };
    resizeRow = ({ dataKey, deltaX }) =>
        this.setState(prevState => {

            const prevWidths = prevState.widths;
            const percentDelta = deltaX / TOTAL_WIDTH;

            var nextDataKey;
            switch (dataKey) {
                case "name": nextDataKey = "designation"; break;
                case "designation": nextDataKey = "city"; break;
                case "city": nextDataKey = "state"; break;
                case "state": nextDataKey = "pincode"; break;
                case "pincode": nextDataKey = "state"; break;
            }

            return {
                widths: {
                    ...prevWidths,
                    [dataKey]: prevWidths[dataKey] + percentDelta,
                    [nextDataKey]: prevWidths[nextDataKey] - percentDelta
                }
            };
        }
        );



    render() {
        let editTextModal;
        if (this.state.isModalShown === true) {
            editTextModal = <TextChangeModal value={this.state.value} rowIndex={this.state.rowIndex}
                columnIndex={this.state.columnIndex} handleClose={this.closeModal}
                handleChange={this.handleChange} />
        }
        const widths = this.state.widths;
        return (
            <React.Fragment>
                <Table
                    width={500}
                    height={300}
                    headerHeight={20}
                    rowHeight={30}
                    rowCount={list.length}
                    rowStyle={{ borderBottom: "1px solid black" }}
                    rowGetter={({ index }) => this.state.list[index]} >
                    <Column
                        headerRenderer={this.headerRenderer}
                        label='Name'
                        dataKey='name'
                        width={widths.name * TOTAL_WIDTH}
                        style={{ display: "flex", alignItems: "center" }}
                        cellRenderer={this._cellRender} />
                    <Column
                        headerRenderer={this.headerRenderer}
                        label='Designation'
                        dataKey='designation'
                        width={widths.designation * TOTAL_WIDTH}
                        cellRenderer={this._cellRender} />
                    <Column
                        headerRenderer={this.headerRenderer}
                        label='City'
                        dataKey='city'
                        width={widths.city * TOTAL_WIDTH}
                        cellRenderer={this._cellRender} />
                    <Column
                        headerRenderer={this.headerRenderer}
                        label='State'
                        dataKey='state'
                        width={widths.state * TOTAL_WIDTH}
                        cellRenderer={this._cellRender} />
                    <Column
                        headerRenderer={this.headerRenderer}
                        label='Pincode'
                        dataKey='pincode'
                        width={widths.pincode * TOTAL_WIDTH}
                        cellRenderer={this._cellRender} />
                </Table>
                {editTextModal}
            </React.Fragment>
        );
    }
}