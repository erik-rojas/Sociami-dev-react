/*
  author: Anshul Kumar
*/

import React, { Component } from 'react';
import '~/src/theme/css/heroes.css';

class Heroes extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="materialize-warper common-mat-wrapper heroes-wrapper">
        <div className="container">
          <h1 className="heading-primery pt-46 pb-46">Heroes</h1>
          <div className="row card_box valign-wrapper">
            <div className="col s12 m6">
              <div className="card">
                <div className="card-image heroes-black-img-box">
                  <div className="img-box">
                    <img  src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/heroes/heroes-img1.png"/>
                  </div>
                </div>
              </div>
            </div>
            <div className="col s12 m6">
              <div className="box-wp">
                <div className="heroes-heading-wp">
                  <h2>Innovator</h2>
                  <div className="yl-d"></div>
                </div>
                <p>The Innovator is the son of a successful businessman that put his money to good use as a super hero. Using his own innovative powers he was able to create a super-suit that helps him generate the right tool to accomplish any task. The Innovator is famous for helping struggling businesses and families find the right solutions to achieve their goals</p>
              </div>
            </div>
          </div>
          <div className="row card_box valign-wrapper">
            <div className="col s12 m6 right">
              <div className="card">
                <div className="card-image heroes-black-img-box">
                  <div className="img-box">
                    <img  src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/heroes/heroes-img2.png"/>
                  </div>
                </div>
              </div>
            </div>
            <div className="col s12 m6">
              <div className="box-wp">
                <div className="heroes-heading-wp">
                  <h2>Digital Nomad</h2>
                  <div className="yl-d"></div>
                </div>
                <p>An office worker by day and a digital superhero by night. He lives alone with his cat Slice who he modeled his digital assistance program after in the the digital world, called DigiSpace. His special ability is he can phase into, and out of, DigiSpace at will</p>
              </div>
            </div>
          </div>
          <div className="row card_box valign-wrapper">
            <div className="col s12 m6">
              <div className="card">
                <div className="card-image heroes-black-img-box">
                  <div className="img-box">
                    <img  src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/heroes/heroes-img3.png"/>
                  </div>
                </div>
              </div>
            </div>
            <div className="col s12 m6">
              <div className="box-wp">
                <div className="heroes-heading-wp">
                  <h2>Data Miner</h2>
                  <div className="yl-d"></div>
                </div>
                <p>The Data Miner is a special hero with the unique ability to see raw mega-data in DigiSpace and quickly process and understand it without relying on slow methodical programs. Originally the Miner did not truly understand his power and how useful it could be. It changed his life forever.</p>
              </div>
            </div>
          </div>
          <div className="row card_box valign-wrapper">
            <div className="col s12 m6 right">
              <div className="card">
                <div className="card-image heroes-black-img-box">
                  <div className="img-box">
                    <img  src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/heroes/heroes-img4.png"/>
                  </div>
                </div>
              </div>
            </div>
            <div className="col s12 m6">
              <div className="box-wp">
                <div className="heroes-heading-wp">
                  <h2>Blockforce</h2>
                  <div className="yl-d"></div>
                </div>
                <p>The Blockforce Enhancer did not grow up with much. He was born to a poor impoverished family. He quickly learned at an early age that by giving the little he did have to those who had less actually enriched his life and made it better. He applied this generous philosophy to his life and the experiences that led to him becoming the Blockforce Enhancer hero. </p>
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

export default Heroes;
