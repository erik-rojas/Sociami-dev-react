import React, { Component } from 'react';
import {connect} from 'react-redux';
import { ListGroupItem, ListGroup } from 'react-bootstrap';

import '~/src/theme/css/iconToggle.css';

class UserIconToggle extends Component {
  constructor(props) {
    super(props);
  }

  handleClickOutside() {
    this.props.onClose();
  }

  renderIconRow(){
    return this.props.userIconTempObject.map((obj,i) => (
      <ListGroupItem key={i} className="iconToggle-item" >
        <div className="iconToggleSection-row">
          <span className="new-img-icon-head">
            <img src={obj.imgUrl} alt="" />
          </span>
          <div className="iconToggleSection-row-text">
            {obj.text}
          </div>
        </div>
      </ListGroupItem>
    ));
  };

  render() {
    return (
      <div id="iconToggleHolder">
        <ListGroup>
          <div id="iconToggleSection">
            {this.renderIconRow()}
          </div>
        </ListGroup>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const userIconTempObject = [
    {imgUrl:'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/themeHeader/header-menu-new-icon-1.png',text:'Icon 1'},
    {imgUrl:'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/themeHeader/header-menu-new-icon-1.png',text:'Icon 2'},
  ];
  return{
    userIconTempObject,
  }
};

export default connect(mapStateToProps)(require('react-click-outside')(UserIconToggle));
