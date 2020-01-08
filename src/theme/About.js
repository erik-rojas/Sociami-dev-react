/*
    author: Alexander Zolotov
*/
import React from 'react';
import { Icon } from 'react-fa';

import '~/src/theme/css/about.css';

function About(props) {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div id="main-content_1">
          <div id="about-page">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <h1 className="pull-right">About Us</h1>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-10">
                  <p>
                    Powered by Artificial intelligence and Blockchain, Soqqle is a Social Network built as an
                    economy to let users monetize an underutilized asset - Knowledge and Experience.
                  </p>
                  <h3>The Social Economy</h3>
                </div>
                <div className="col-lg-2">
                  <Icon name="users" className="fa-huge-icon" />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <p>
                    Social networks have not changed in the last 10 years, with big-data overloading masses
                    with content without showing where to get more depth. The solution consists of 3 modules -
                    data-driven personalized roadmaps, meaningful social network and tokenized learning.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <p className>
                    As the world moves into the upcoming 4th industrial revolution, with people expected to
                    not just be unemployed but unemployable, Soqqle sets out with the vision to produce a
                    network of motivated and connected Soqqlers placed at the forefront of humankind to drive
                    the future economy.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <a href="http://soqqle.com/about" className="btn btn-lg btn-outline-inverse pull-right">
                    read more
                  </a>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div id="aboutVideo">
                    <iframe src="https://www.youtube.com/embed/mH78ukEovdU" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
