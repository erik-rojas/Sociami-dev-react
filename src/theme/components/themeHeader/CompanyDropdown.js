
import React, { Component } from 'react';
import { ListGroupItem, ListGroup } from 'react-bootstrap';

class CompanyDropDown extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClickOutside() {
    this.props.handleClickOutside();
  }

  render() {
    return (
    <div id="companyDropdown">
    <ListGroup>
      <ListGroupItem className="notifyTitle">
        <ul className="sub-navbar">
          {
            this.props.companies.map((c, i) => {
              return (
                <li key={i}>
                  <a href="javascript:" onClick={() => this.props.selectCompany(c._id)} >
                    <span className="new-img-icon-head">
                      <img src={c.imageUrl} alt="" />
                    </span>
                    <span className="company-name">{c.name}</span>
                  </a>
                </li>
              )
            })
          }
        </ul>
      </ListGroupItem>
    </ListGroup>
  </div>
    )
  }
}
export default (require('react-click-outside')(CompanyDropDown));

