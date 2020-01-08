/*
  Replacement of: src/theme/ProjectManagement.js
*/

import React, { Component } from 'react';

import LeftNav from '~/src/theme/components/homepage/LeftNav';
import RightSection from '~/src/theme/components/homepage/RightSection';
import MyChallenges from '~/src/theme/components/challenges/MyChallenges';
import AddChallenge from '~/src/theme/components/challenges/AddChallenge';
import ApproveChallenge from '~/src/theme/components/challenges/ApproveChallenge';

const profilePic = 'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/default-profile.png';

class Challenges extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: "MyChallenges",
      profilePic: this.props.userProfile.pictureURL ? this.props.userProfile.pictureURL : profilePic
    }
  }

  togglePage(page) {
    this.setState({
      currentPage: page
    });
  }

  section() {
    switch(this.state.currentPage) {
      case "MyChallenges":
        return (
          <div className="col-middle ml-fixed">
            <div className="row">
              <div className="col-sm-5">
                <h3>My Challenges</h3>
              </div>
              <div className="col-sm-7 text-right">
                <button className="yellow-btn" onClick={ () => this.togglePage("AddChallenge") }>+ Add challenge</button>
                <button className="pur-btn" onClick={ () => this.togglePage("ApproveChallenge") }>Approve submission</button>
              </div>
            </div>

            <MyChallenges />
          </div>
        );
      case "AddChallenge":
        return <AddChallenge />;
      case "ApproveChallenge":
        return <ApproveChallenge profilePic={this.state.profilePic} />;
    }
  }

  render() {
    return (
      <div className={`${this.props.userProfile.theme.toLowerCase()}-theme-wrapper profile-wrapper mychallenges-wrapper main-bg`}>
        <div className="row">
          <div className="container">
            <div className="row">
              <div className="row">
                
                <LeftNav 
                  accounting={this.props.accounting}
                  userProfile={this.props.userProfile} 
                  profilePic={this.props.userProfile.pictureURL ? this.props.userProfile.pictureURL : profilePic} 
                  />

                <RightSection
                  skills={this.props.skills}
                  roadmapsAdmin={this.props.roadmapsAdmin}
                  userProfile={this.props.userProfile}
                />

                { this.section() }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Challenges;
