/*
  author: Anshul Kumar
*/

import React, { Component } from 'react';
import '~/src/theme/css/houses.css';

class Houses extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    mixpanel.track("View Houses");
  }

  render() {
    return (
      <div className="materialize-warper common-mat-wrapper houses-wrapper">
        <div className="container">
          <h1 className="heading-primery pt-46">Houses</h1>
          <div className="row card_box valign-wrapper">
            <div className="col s12 m6">
              <div className="card">
                <div className="card-image">
                  <img className="activator" src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/houses/house-img1.jpg"/>
                </div>
              </div>
            </div>
            <div className="col s12 m6">
              <div className="box-wp">
                <h2>Executives</h2>
                <ul>
                  <li>Operations Management</li>
                  <li>Big Data</li>
                  <li>Data Analytic</li>
                </ul>
                <p>Experts in the operational day to day needs of businesses across all industries, executives are business experts across verticals who work with all houses to find best ways to push productivity in the economy.</p>
              </div>
            </div>
          </div>
          <div className="row card_box valign-wrapper">
            <div className="col s12 m6 right">
              <div className="card">
                <div className="card-image">
                  <img className="activator" src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/houses/house-img2.jpg"/>
                </div>
              </div>
            </div>
            <div className="col s12 m6">
              <div className="box-wp">
                <h2>Bot Tinkerer</h2>
                <ul>
                  <li>Data Science</li>
                  <li>Robotics</li>
                </ul>
                <p>The Bot Tinkerers started early by infusing both physical and mental automation in the form of robots. They have been able to work very closely with the App Ninjas in the latest of Robotics to create robots that harness the full power of automation. </p>
              </div>
            </div>
          </div>
          <div className="row card_box valign-wrapper">
            <div className="col s12 m6">
              <div className="card">
                <div className="card-image">
                  <img className="activator" src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/houses/house-img3.jpg"/>
                </div>
              </div>
            </div>
            <div className="col s12 m6">
              <div className="box-wp">
                <h2>Science Illuminati</h2>
                <ul>
                  <li>Chemical Engineering </li>
                  <li>BioTech</li>
                </ul>
                <p>Keen researchers in science, the science illuminati dives deep into the needs of economy from a science perspective across biological and non-biological needs. They provide data points across different aspects of the world from environment, to community to health.</p>
              </div>
            </div>
          </div>
          <div className="row card_box valign-wrapper">
            <div className="col s12 m6 right">
              <div className="card">
                <div className="card-image">
                  <img className="activator" src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/houses/house-img4.jpg"/>
                </div>
              </div>
            </div>
            <div className="col s12 m6">
              <div className="box-wp">
                <h2>Network Seekers</h2>
                <ul>
                  <li>Cybersecurity</li>
                  <li>Networking</li>
                </ul>
                <p>Masters of technical networks and relevant security requirements. Network seekers lay out the infrastructure of the new society of which new applications, businesses, technology is implemented. They are the new enforcers, police of the new economy.</p>
              </div>
            </div>
          </div>
          <div className="row card_box valign-wrapper">
            <div className="col s12 m6">
              <div className="card">
                <div className="card-image">
                  <img className="activator" src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/houses/house-img5.jpg"/>
                </div>
              </div>
            </div>
            <div className="col s12 m6">
              <div className="box-wp">
                <h2>App Ninja</h2>
                <ul>
                  <li>Data Science</li>
                  <li>Programming</li>
                </ul>
                <p>Experts in technical development and the growth of techniques of applications to build advancements of society in aspects across all walks of life.  Naturally curious, they seek information to be able to be the harbringers of automation to bring about change in society</p>
              </div>
            </div>
          </div>
          <div className="row card_box valign-wrapper">
            <div className="col s12 m6 right">
              <div className="card">
                <div className="card-image">
                  <img className="activator" src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/houses/house-img6.jpg"/>
                </div>
              </div>
            </div>
            <div className="col s12 m6">
              <div className="box-wp">
                <h2>Business Clairvoyants</h2>
                <ul>
                  <li>Finance</li>
                  <li>Legal</li>
                  <li>Business</li>
                </ul>
                <p>Master networkers of finance and investments, the business clairvoyants somehow seem to know everything about traversing the creation, growth and funding of businesses. Linked to hard to reach circles, this house look to penetrate deep into needs of businesses, and work across all houses to power overall growth.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="video-warp">
          <div className="container">
            <div className="row">
              <div className="col s12">
                <h2 className="heading-primery">Discover Soqqle</h2>
                <div className="video-box">
                  <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/houses/videobg.jpg" alt=""/>
                  <a href="#"><div className="icon"></div></a>
                </div>
                <div className="center"><a href="#" className="more-video-btn">See all videos</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Houses;
