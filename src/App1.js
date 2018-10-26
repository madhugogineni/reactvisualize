import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { Table, Column, SortDirection, SortIndicator, sortBy } from 'react-virtualized';
import 'react-virtualized/styles.css';
import TextChangeModal from './TextChangeModal';
import Draggable from 'react-draggable';
var list = addElements([]);

function addElements(list) {
    console.log(typeof list);
    for (var i = 0; i < 100000; i++) {
        if (i == 2) {
            list.push({ name: 'Vaughn', designation: "Software Engineer", city: "San Jose", state: "CA", pincode: "95125" });
        }
        else
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
            activeList: activeList,
            sortedList: list,
            sortBy: 'name',
            sortDirection: SortDirection.ASC,
            randomvalue: Math.random(100),
            isModalShown: false,
            value: null,
            rowIndex: null,
            columnIndex: null,
            rowCount: this.dataList.length,
            widths: {
                name: 0.33,
                designation: 0.33,
                city: 0.33,
                state: 0.33,
                pincode: 0.33
            },
        };
        this._cellRender = this._cellRender.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.headerRenderer = this.headerRenderer.bind(this);
        this.sort = this.sort.bind(this);
    }
    isSortEnabled() {
        const list = this.dataList;
        const rowCount = this.state;
        return rowCount <= list.length;
    }
    sort({ sortBy, sortDirection }) {
        function compare(a, b) {
            if (a[sortBy] < b[sortBy])
                return -1;
            if (a[sortBy] > b[sortBy])
                return 1;
            return 0;
        }
        var mainList = list.sort(compare);
        function asords(mainList) {
            return sortDirection === SortDirection.DESC ? mainList.reverse() : mainList;
        }
        mainList = asords(mainList);
        this.setState({ sortBy, sortDirection, sortedList: mainList });
    }
    handleClick(rowIndex, columnIndex) {
        var activeListArray = this.state.activeList;
        activeListArray[rowIndex][columnIndex] = false;
        console.log(activeListArray[rowIndex][columnIndex]);
        this.setState({ activeList: activeListArray });
    }
    handleChange(rowIndex, columnIndex, value) {
        var list = this.state.sortedList;
        list[rowIndex][columnIndex] = value;
        this.setState({ sortedList: list, randomvalue: Math.random(100), isModalShown: false });
        console.log(this.state.list[rowIndex][columnIndex]);
        this.forceUpdate();
    }
    closeModal() {
        this.setState({ isModalShown: false });
    }
    showModal(rowIndex, dataKey) {
        var value = this.state.sortedList[rowIndex][dataKey];
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
                        {sortBy === dataKey &&
                            <SortIndicator sortDirection={sortDirection} />
                        }
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
        const list = this.dataList;
        const sortBy = this.state.sortBy;
        const sortDirection = this.state.sortDirection;
        // const sortedList = this.isSortEnabled() ?
        //     (list.sortBy(item => item[sortBy]).update(list => sortDirection === SortDirection.DESC ?
        //         list.reverse() : list))
        //     : list;
        return (
            <React.Fragment>
                <Table
                    width={500}
                    height={300}
                    headerHeight={20}
                    rowHeight={30}
                    rowCount={list.length}
                    rowStyle={{ borderBottom: "1px solid black" }}
                    rowGetter={({ index }) => this.state.sortedList[index]}
                    sort={this.sort}
                    sortBy={this.state.sortBy}
                    sortDirection={this.state.sortDirection} >
                    <Column
                        headerRenderer={this.headerRenderer}
                        label='Name'
                        dataKey='name'
                        disableSort={!this.isSortEnabled}
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