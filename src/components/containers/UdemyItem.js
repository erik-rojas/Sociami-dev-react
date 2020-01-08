import React, { Component } from 'react';

class UdemyItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //output table row and table data, where table data is taken from props passed inside from parent component
    if (typeof this.props !== 'undefined') {
      //pack all <td> tags and their data into array
      // <td key="1">{this.props.item.description}</td>,

      let itemObject = this.props.item;
      itemObject._type = 'udemy_course';

      const instructorListItems = this.props.item.instructors.map((instructor, index) => (
        <li key={index.toString()}>
          <a href={instructor.url} target="_blank">
            {instructor.title}
          </a>
        </li>
      ));

      let instructors = <ul>{instructorListItems}</ul>;

      let tdItems = [
        <td key="0">{this.props.item.title}</td>,
        <td key="1">
          <img src={this.props.item.image} />
        </td>,
        <td key="2">{instructors}</td>,
        <td key="3">{this.props.item.price}</td>,
        <td key="4">
          <a href={this.props.item.url} target="_blank">
            Got to course
          </a>
        </td>,
        <td key="5">
          <button
            type="button"
            className="btn btn-md btn-outline-inverse"
            onClick={() => this.props.onAddBookmark(itemObject)}
          >
            Bookmark
          </button>
        </td>,
      ];
      return (
        //output table row and table data inside it
        <tr key={this.props.index}>{tdItems}</tr>
      );
    }

    return null;
  }
}

export default UdemyItem;
