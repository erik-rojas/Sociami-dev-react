/*
  author: Tyro Tan
*/

import React, { Component } from 'react';

import LeftNav from '~/src/theme/components/homepage/LeftNav';
import RightSection from '~/src/theme/components/homepage/RightSection';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import '~/src/theme/css/sparks.css';
import moment from 'moment';

const profilePic =
  'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/default-profile.png';

class Sparks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sorted: [
        {
          id: 'timestamp',
          desc: true,
        },
      ],
    };
  }

  renderTable() {
    const { firstName, lastName } = this.props.userProfile;
    const name = `${firstName} ${lastName}`;
    const accountingData = this.props.accounting;
    const data =
      accountingData &&
      accountingData.data &&
      accountingData.data.userTransactions &&
      accountingData.data.userTransactions.length
        ? accountingData.data.userTransactions
        : [];

    const columns = [
      {
        id: 'numTokens',
        Header: () => {},
        accessor: 'numTokens',
        width: 85,
        Cell: props => <span className="col-task d-tw">+{props.value} Token</span>, // Custom cell components!
      },
      {
        id: 'task', // Required because our accessor is not a string
        Header: () => {},
        accessor: d =>
          d.source && d.source.illuminate && d.source.illuminate.name ? d.source.illuminate.name : '',
        width: 270,
        Cell: props => <span className="col-user d-tw">{props.value}</span>, // Custom cell components!
      },
      {
        id: 'receiver',
        Header: () => {},
        accessor: 'receiverId', // String-based value accessors!
        width: 150,
        Cell: props => <span className="col-token d-tw">{name}</span>,
      },
      {
        id: 'timestamp',
        Header: () => {}, // Custom header components!
        accessor: 'timestamp',
        width: 200,
        Cell: props => <span className="col-date d-sv">{moment(props.value).format('MM/DD/YYYY')}</span>, // Custom cell components!
      },
    ];

    return <ReactTable sorted={this.state.sorted} className={'d-blue-box'} data={data} columns={columns} />;
  }

  setSortClass(field) {
    return this.state.sorted.filter(sortItems => sortItems.id === field).length ? 'current-sort ' : '';
  }

  onSortClick(field) {
    this.setState({
      sorted: [
        {
          id: field,
          desc: true,
        },
      ],
    });
  }

  getSortFunctionByField(field) {
    return () => this.onSortClick(field);
  }

  renderTableWrapper() {
    return (
      <div className="sparks-table-wrapper">
        <div className="d-blue-box sparks-filter-wrapper d-tb-bg">
          <span className="d-sv sort-by-label">SORT BY:</span>
          <ul className="sparks-filter">
            <li
              onClick={this.getSortFunctionByField('timestamp')}
              className={`${this.setSortClass('timestamp')} sparks-tertiary sparks-li`}
            >
              <a href="javascript:void(0)">Date</a>
            </li>
            <li
              onClick={this.getSortFunctionByField('task')}
              className={`${this.setSortClass('task')} sparks-li`}
            >
              <a href="javascript:void(0)">Task</a>
            </li>
            <li
              onClick={this.getSortFunctionByField('receiver')}
              className={`${this.setSortClass('receiver')} sparks-li`}
            >
              <a href="javascript:void(0)">House</a>
            </li>
            <li
              onClick={this.getSortFunctionByField('progression')}
              className={`${this.setSortClass('progression')} sparks-li`}
            >
              <a href="javascript:void(0)">Progression</a>
            </li>
            <li
              onClick={this.getSortFunctionByField('numTokens')}
              className={`${this.setSortClass('numTokens')} sparks-li`}
            >
              <a href="javascript:void(0)">Tokens</a>
            </li>
          </ul>
        </div>
        {this.renderTable()}
      </div>
    );
  }

  editWalletInfo(e) {
    e.preventDefault();
  }

  toggleAccountOption(e) {
    e.preventDefault();
  }

  togglePrivacyOption(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div
        className={`${this.props.userProfile.theme.toLowerCase()}-theme-wrapper sparks-wrapper profile-wrapper settings-wrapper main-bg`}
      >
        <div className="row">
          <div className="container">
            <div className="row">
              <div className="row">
                <LeftNav
                  accounting={this.props.accounting}
                  userProfile={this.props.userProfile}
                  profilePic={
                    this.props.userProfile.pictureURL ? this.props.userProfile.pictureURL : profilePic
                  }
                />

                <RightSection
                  skills={this.props.skills}
                  roadmapsAdmin={this.props.roadmapsAdmin}
                  userProfile={this.props.userProfile}
                />

                <div className="col-middle ml-fixed">
                  <div className="sparks-h4 sparks-golden">Token related</div>
                  <div className="col-box-wp mb-20 p-0">
                    <ul className="tab-wp d-tb-bg">
                      <li className="wallet-address">
                        <a className="sort-by-label d-tw" onClick={this.toggleAccountOption}>
                          MY WALLET ADDRESS
                        </a>
                      </li>
                      <li className={this.state == 'block' ? 'active' : ''}>
                        <a className="sparks-golden" onClick={this.togglePrivacyOption}>
                          SOME ADDRESS 234wef23slkdjff
                        </a>
                      </li>
                      <li>
                        <a className="d-tw" onClick={this.editWalletInfo}>
                          Edit
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="sparks-h5 d-tw">Transactions</div>
                  {this.renderTableWrapper()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sparks;
