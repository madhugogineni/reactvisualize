import React from 'react';
import { MultiGrid } from 'react-virtualized';
import TextChangeModal from './TextChangeModal';

// Grid data as an array of arrays
var list = addElements([]);

function addElements(list) {
  for (var i = 0; i < 100000; i++) {
    list.push(['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125, 'Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125, 'Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125]);
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
export default class App extends React.Component {
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
    this.setState({ list: list, randomvalue: Math.random(100) });
    console.log(this.state.list[rowIndex][columnIndex]);
    this.forceUpdate();
  }
  closeModal() {
    this.setState({ isModalShown: false });
  }
  showModal(rowIndex, columnIndex) {
    var value = this.state.list[rowIndex][columnIndex];
    this.setState({ isModalShown: true, value: value, rowIndex: rowIndex, columnIndex: columnIndex });
  }
  _cellRender({ columnIndex, rowIndex, style, key, handleClick, handleChange }) {
    return (
      <input
        key={key}
        style={style}
        readOnly={this.state.activeList[rowIndex][columnIndex]}
        value={this.state.list[rowIndex][columnIndex]}
        onDoubleClick={this.showModal.bind(this, rowIndex, columnIndex)}
        onChange={(e) => this.handleChange(rowIndex, columnIndex)} />
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
        <MultiGrid
          cellRenderer={this._cellRender}
          columnCount={this.state.list[0].length}
          columnWidth={100}
          height={400}
          rowCount={this.state.list.length}
          rowHeight={50}
          width={800}
          random={this.state.randomvalue} />
        {editTextModal}
      </React.Fragment>
    );
  }
}