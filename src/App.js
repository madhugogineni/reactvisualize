import React from 'react';
import { MultiGrid } from 'react-virtualized';

// Grid data as an array of arrays
var list = addElements([]);

function addElements(list) {
  for (var i = 0; i < 100000; i++) {
    list.push(['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125, 'Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125, 'Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125]);
  }
  console.log(list);
  return list;
}
var activeList = setDisabled([]);

function setDisabled(list) {
  for (var i = 0; i < 10; i++) {
    list.push([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
  }
  console.log(list);
  return list;
}

// function cellRenderer({ columnIndex, key, rowIndex, style }) {

//   return (
//     <input
//       key={key}
//       style={style}
//       value={list[rowIndex][columnIndex]} disabled={activeList[rowIndex][columnIndex]} onClick={() => {
//         activeList[rowIndex][columnIndex] = false;
//       }} />
//   )
// }

// Render your grid
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { list: [], activeList: [], randomvalue: Math.random(100) };
    this._cellRender = this._cellRender.bind(this);
  }
  handleClick(rowIndex, columnIndex) {
    var activeListArray = this.state.activeList;
    activeListArray[rowIndex][columnIndex] = false;
    console.log(activeListArray[rowIndex][columnIndex]);
    this.setState({ activeList: activeListArray });
  }
  handleChange(rowIndex, columnIndex, e) {
    var list = this.state.list;
    console.log(e.target.value);
    list[rowIndex][columnIndex] = e.target.value;
    this.setState({ list: list, randomvalue: Math.random(100) });
    console.log(this.state.list[rowIndex][columnIndex]);
    this.forceUpdate();
  }
  componentWillMount() {
    this.setState({ list: list, activeList: activeList });
  }
  _cellRender({ columnIndex, rowIndex, style, key, handleClick, handleChange }) {
    return (
      <input
        key={key}
        style={style}
        value={this.state.list[rowIndex][columnIndex]}
        onChange={this.handleChange.bind(this, rowIndex, columnIndex)} />//disabled={activeList[rowIndex][columnIndex]} onClick={() => { activeList[rowIndex][columnIndex] = false;}}        
    )
  }
  render() {
    console.log(this.state.list);
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
          random={this.state.randomvalue}
        />
        <button onClick={(e) => this.handleClick(e)}>welcome</button>
      </React.Fragment>
    );
  }
}