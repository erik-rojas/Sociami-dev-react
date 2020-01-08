/*
  author: Anna Kuzii
*/

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import Authorize from '~/src/authentication/Authorize';
import { openSignUpForm } from '~/src/redux/actions/authorization';
import { fetchArticles } from '~/src/redux/actions/articles';
import { startCharacterCreation } from '~/src/redux/actions/characterCreation';
import SubscribeThanksModal from "~/src/theme/components/SubscribeThanksModal";
import BetaFormModal from "~/src/theme/components/landingPage/BetaFormModal";
import TrailerModal from "~/src/theme/components/landingPage/TrailerModal";
import Axios from 'axios';
import ConfigMain from '~/configs/main';
import Youtube from 'react-youtube';
import languageContent from './languageWiseContent.json';

import journeyIcon from '../../../../assets/img/jorney.png'
import heroImage from '../../../../assets/img/hero.png'
import rewardImage from '../../../../assets/img/reward.png'
import useRewardsImage from '../../../../assets/img/use-rewards.png'
import combineGoalsImage from '../../../../assets/img/combine-goals.png'
import selectHouseImage from '../../../../assets/img/select-house.png'
import playGameImage from '../../../../assets/img/play-the-game.png'
import courseImage from '../../../../assets/img/learning-course.png'
import videoIconImage from '../../../../assets/img/video-btn-icon.png'
import backgroundCity from '../../../../assets/img/background-city.jpg'


const soqqleEnv = process.env.SOQQLE_ENV;

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//this one is for desktop only, for mobile, there is simple input element
const EmailInput = ({ onEmailInputHide, onEmailInputSubmit, onEmailInput, email }) => {
  const handleInputSubmit = (event) => {
    event.preventDefault();
    if (validateEmail(email)) {
      onEmailInputSubmit(email);
    }
  }

  return (
    <span>
      <span className="landing-email-input-textfield-container">
        <input value={email}
          onChange={onEmailInput}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleInputSubmit(event)
            }
          }}
          type="email" placeholder="email@example.com" autoFocus={true} />
      </span>
      <button type="submit" className="explore-button" onClick={handleInputSubmit}><p>Send</p></button>
    </span>
  )
}

const Banner = ({ openSignUpForm, startCharacterCreation, onBetaFormModalShow, onEmailInputHide, onEmailInputSubmit, onEmailInput, isEmailInputVisible, email, onTrailerModalShow, currentLanguage }) => {
  return (
    <div className="banner-wrapper">
      <img
        src={backgroundCity}
        alt="banner" />
      <div className="banner-content">
        <h2>{ soqqleEnv === 'production' ? 'SIGN UP FOR BETA' : languageContent[currentLanguage].banner_main }</h2>
        <p>{languageContent[currentLanguage].banner_sub}</p>
        {
          soqqleEnv === 'production' ?
          <a className="btn-top" onClick={onBetaFormModalShow}>Sign up now!</a>
          :
          <Link to="/characterCreation" className="btn-top" onClick={() => startCharacterCreation() }>
            {languageContent[currentLanguage].banner_button}
          </Link>
        }
        {
          soqqleEnv === 'production' ?
          <span className="col-md-12"><a className="btn-bottom" onClick={onTrailerModalShow}>Trailer</a></span>
          :
          <span className="col-md-12"><a className="btn-bottom" onClick={() => openSignUpForm()}>
            {languageContent[currentLanguage].banner_small}
          </a></span>
        }
        {/* <section>
          {
            soqqleEnv === 'production' ?
            <h2>sign up for beta</h2>:
            <h2>game up your passion</h2>
          }
          <p>Plug in for the Future. Explore a world of quests with <br /> friends and play
            them
            together to
            gain glory and rewards.</p>
        </section>
        {
          soqqleEnv === 'production' ?
          <button type="button" className="explore-button" onClick={onBetaFormModalShow}>
            <p>Sign up now!</p>
          </button>
          :
          <Link to="/characterCreation" className="explore-button" onClick={() => startCharacterCreation() }>
            <p>Explore Soqqle</p>
          </Link>
        }
        {
          soqqleEnv === 'production' ?
          <button type="button" className="sign-in-button"
            onClick={onTrailerModalShow}>
            <p>Trailer</p>
          </button>
          :
          <button type="button" className="sign-in-button"
            onClick={() => openSignUpForm()}>
            <p>Sign in</p>
          </button>
        } */}
      </div>
    </div>
  );
};

const AboutComponent = ({currentLanguage}) => {
  return (
    <div className="about-wrapper second-section-bg">
      <h2 dangerouslySetInnerHTML={{ __html:languageContent[currentLanguage].about_header }}/>
      <p>{languageContent[currentLanguage].about_second_line}</p>
      <h3 dangerouslySetInnerHTML={{ __html: languageContent[currentLanguage].about_third_line}}/>
    </div>
  );
};

const Article = ({article}) => {
  const published_time = article.openGraph.published_time ? new Date(article.openGraph.published_time) : new Date(article.data.date)
  const date = new Date(published_time);
  const dateStr = date.getDate() +'.'+ (date.getMonth()+1).toString() + '.' + date.getFullYear();
  const title = article.openGraph.title ? article.openGraph.title : article.data.title;
  const subTitle = article.openGraph.description ? article.openGraph.description : article.data.subTitle;
  return (
      <article>
        <p className="date">{dateStr}</p>
        <h3><a href={article.data.urlLink} target="_blank">{title}</a></h3>
        <p>{subTitle}</p>
      </article>
  )
}

const OurBlog = (props) => {
  const article = {
    data: {
      title: '',
      subTitle: '',
      date: new Date(),
      urlLink: '',
    },
    jsonLd: {},
    general: {},
    openGraph: {
      image: {
        url: ''
      }
    }
  }
  let firstArticle = article
  let secondArticle = article
  let thirdArticle = article
  if(props.articles) {
    firstArticle = props.articles.length > 0 ? props.articles[0] : article;
    secondArticle = props.articles.length > 1 ? props.articles[1] : article;
    thirdArticle = props.articles.length > 2 ? props.articles[2] : article;
  }
  return (
    <div className="our-blog">
      <h2>{languageContent[props.currentLanguage].blog_header}</h2>
      <section>
        {
          firstArticle ?
            <div className="one-news">
              <div className="overlay"></div>
              <img src={firstArticle.openGraph.image.url} />
              <Article article={firstArticle}></Article>
            </div> : null
        }

        <div className="two-news">
          {
            secondArticle ?
              <div className="top-news">
                <div className="overlay"></div>
                <img src={secondArticle.openGraph.image.url} />
                <Article article={secondArticle}></Article>
              </div> : null
          }
          {
            thirdArticle ?
              <div className="bottom-news">
                <div className="overlay"></div>
                <img src={thirdArticle.openGraph.image.url} />
                <Article article={thirdArticle}></Article>
              </div> : null
          }
        </div>
      </section>
      <button type="button" className="btn"><p>{languageContent[props.currentLanguage].blog_button}</p></button>
    </div>
  );
};

const SoqqleInfo = ({currentLanguage}) => {
  return (
    <div className="soqqle-info">
      <h2>{languageContent[currentLanguage].info_header}</h2>
      <section>
        <img
          src={courseImage}
          className="learning-course"
          alt="drive purposeful learning" />
        <p>{languageContent[currentLanguage].info_one}</p>
      </section>
      <section>

              <img
      alt="Combine social and learning goals"
      src={combineGoalsImage}
      className="goals" />
        <p>{languageContent[currentLanguage].info_two}</p>
      </section>
      <section>
          <img
      alt="Helps identify networks to join the journey"
      src={journeyIcon}
      className="jorney" />
        <p>{languageContent[currentLanguage].info_three}</p>
      </section>
    </div>
  );
};

const TalkAboutUs = ({currentLanguage}) => {
  return (
    <div className="talk-about-us">
      <h2>{languageContent[currentLanguage].talk_header}</h2>
      <section className="background-section-1">
        <div>
          <img className="avatar"
            src="http://d9hhrg4mnvzow.cloudfront.net/beta.soqqle.com/connect/1d6c97e1-unsplash-u-lay00ifd4-man-wearing-parka-jacket_02d01c01c01c00i000.jpg"
            alt="avatar" />
        </div>
        <article>
          <h4>CARLO</h4>
          <p>I learnt about Soqqle in an event and was floored by the idea that we could learn more about others through games. Can't wait to be a part of Beta!</p>
        </article>
      </section>
      <section className="main-section">
        <div>
          <img className="avatar"
            src="http:////d9hhrg4mnvzow.cloudfront.net/beta.soqqle.com/edutech/54ac4729-unsplash-rzj4teqze4m-woman-smiling-closing-eyes-while-flipping-her-hair_04p03e03e03e00n000.jpg"
            alt="avatar" />
        </div>
        <article>
          <h4>JAYES</h4>
          <p>It'd be fantastic to be able to to know what my friends are interested in. Can't find anywhere else.</p>
        </article>
      </section>
      <section className="background-section-2">
        <div>
          <img className="avatar"
            src="http://d9hhrg4mnvzow.cloudfront.net/beta.soqqle.com/connect/0a28d17b-unsplash-0e4pr7deta8-smiling-woman-holding-her-head_02001c01c01c00c000.jpg"
            alt="avatar" />
        </div>
        <article>
          <h4>LILY</h4>
          <p>A new way to find out more about brands, and people around me is very unique and unheard of! I hope to learn more about this cool project.</p>
        </article>
      </section>
      {/* <footer>
        <a href="#"></a>
        <a href="#" className="active"></a>
        <a href="#"></a>
      </footer> */}
    </div>
  );
};

const VideoComponent = ({currentLanguage}) => {
  return (
    <div className="video">
      <h1>{languageContent[currentLanguage].video_header}</h1>
      <div className="video-box-home">
        <div className="img-box">
          <Youtube
            videoId="GN4XqcrfAWY"
            id="GN4XqcrfAWY"
            opts={
              {
                width: "740",
                height: "415",
                frameborder: "0",
                allow: "autoplay; encrypted-media",
                allowfullscreen: true
              }
            }
            onPlay={()=> mixpanel.track('View Video')}
          />
        </div>
        <a href="#" className="video-box-home btn-video">See all videos <span><img src={videoIconImage} alt="" /></span></a>
      </div>
    </div>
  );
};

const WorkExplanation = ({currentLanguage}) => {
  return (
    <div className="work-explanation">
      <h2>{languageContent[currentLanguage].work_header}</h2>
      <div id="myCarousel" className="carousel slide" data-ride="carousel">
        <ol className="carousel-indicators">
          <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
          <li data-target="#myCarousel" data-slide-to="1"></li>
          <li data-target="#myCarousel" data-slide-to="2"></li>
          <li data-target="#myCarousel" data-slide-to="3"></li>
          <li data-target="#myCarousel" data-slide-to="4"></li>
        </ol>

        <div className="carousel-inner">
          <div className="item active">
            <div className="select-house clearfix">
              <div className="images-wrapper"><img src={selectHouseImage} alt="select your house" /></div>
              <div className="description">
                <span className="blue-rectangle"> </span>
                <h1>1</h1>
                <h3>1. {languageContent[currentLanguage].work_one}</h3>
                <p>{languageContent[currentLanguage].work_one_text}</p>
                <p>{languageContent[currentLanguage].work_one_line}</p>
                <a href="/houses" className="explore-page">{languageContent[currentLanguage].work_one_link} &gt;</a>
              </div>
            </div>
          </div>

          <div className="item">
            <div className="select-house clearfix">
              <div className="images-wrapper">
                <img
                  src={heroImage}
                  alt="select a hero" />
              </div>
              <div className="description">
                <span className="blue-rectangle"> </span>
                <h1>2</h1>
                <h3>2. {languageContent[currentLanguage].work_two}</h3>
                <p>{languageContent[currentLanguage].work_two_text}</p>
                <p>{languageContent[currentLanguage].work_two_line}</p>
                <a href="/heroes" className="explore-page">{languageContent[currentLanguage].work_two_link} &#62;</a>
              </div>
            </div>
          </div>

          <div className="item">
            <div className="select-house clearfix">
              <div className="images-wrapper">
                <div className="play-the-game-video">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/veQyAxuRzD0?rel=0&amp;controls=0&amp;showinfo=0" frameBorder="0" allowFullScreen=""></iframe>
                </div>
                {/* <img
                  src={playGameImage}
                  alt="play the game"/> */}
              </div>
              <div className="description">
                <span className="blue-rectangle"> </span>
                <h1>3</h1>
                <h3>3. {languageContent[currentLanguage].work_three}</h3>
                <p>{languageContent[currentLanguage].work_three_text}</p>
                <a href="" className="explore-page">{languageContent[currentLanguage].work_three_link} &#62;</a>
              </div>
            </div>
          </div>

          <div className="item">
            <div className="select-house clearfix">
              <div className="images-wrapper">
                <img
                  src={rewardImage}
                  alt="get a reward"/>
              </div>
              <div className="description">
                <span className="blue-rectangle"> </span>
                <h1>4</h1>
                <h3>4. {languageContent[currentLanguage].work_four}</h3>
                <p>{languageContent[currentLanguage].work_four_text}</p>
                <a href="" className="explore-page">{languageContent[currentLanguage].work_four_link} &#62;</a>
              </div>
            </div>
          </div>

          <div className="item">
            <div className="select-house clearfix">
              <div className="images-wrapper">
                <img
                  src={useRewardsImage}
                  alt="use your rewards" />
              </div>
              <div className="description">
                <span className="blue-rectangle"> </span>
                <h1>5</h1>
                <h3>5. {languageContent[currentLanguage].work_five}</h3>
                <p>{languageContent[currentLanguage].work_five_text}</p>
                <a href="" className="explore-page">{languageContent[currentLanguage].work_five_link} &#62;</a>
              </div>
            </div>
          </div>

        </div>

        <a className="left carousel-control" href="#myCarousel" data-slide="prev">
          <span className="glyphicon fa fa-angle-left"></span>
        </a>
        <a className="right carousel-control" href="#myCarousel" data-slide="next">
          <span className="glyphicon fa fa-angle-right"></span>
        </a>
      </div>
    </div>
  );
};

class LandingPageContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isBetaFormModalVisible: false, isTrailerModalVisible: false, email: "", isSubscriptionModalVisible: false,};
  }

  componentWillMount() {
    this.props.fetchArticles()
  }

  //mailerlite subscribe
  handleEmailInputShow(show) {
    this.setState({ isEmailInputVisible: show });
  }

  handleonBetaFormModalShow(show) {
    if (show) {
      mixpanel.track("Sign Up Beta");
    }
    this.setState({ isBetaFormModalVisible: show });
  }

  handleonTrailerModalShow(show) {
    this.setState({ isTrailerModalVisible: show });
  }

  handleEmailInputSubmit(value) {
    if (value) {
      const BETA_SIGN_UP_ID = 10186414;
      const body = { groupId: BETA_SIGN_UP_ID, name: "n/a", email: value };
      mixpanel.track("Sign Up Beta - submit")
      Axios.post(`${ConfigMain.getBackendURL()}/addSubscriberToGroup`, body)
        .then((response) => {
        })
        .catch(error => {
        });
      this.setState({isBetaFormModalVisible: false, isSubscriptionModalVisible: true });
    }
  }

  handleEmailInput(event) {
    this.setState({ email: event.target.value });
  }

  handleCloseSubscribeThankYouModal() {
    this.setState({ isSubscriptionModalVisible: false });
  }

  render() {
    return (
      <div className="landing-page-wrapper">
        <header>
          <SubscribeThanksModal isVisible={this.state.isSubscriptionModalVisible} email={this.state.email}
            closeSubscribeThankYouModal={() => this.handleCloseSubscribeThankYouModal()} />
          <BetaFormModal isVisible={this.state.isBetaFormModalVisible} email={this.state.email}
            closeSubscribeThankYouModal={() => this.handleCloseSubscribeThankYouModal()}
            onBetaFormModalHide={() => this.handleonBetaFormModalShow(false)}
            onEmailInput={(event) => { this.handleEmailInput(event) }}
            email={this.state.email}
            onEmailInputSubmit={value=> {this.handleEmailInputSubmit(value)}}/>
          <TrailerModal isVisible={this.state.isTrailerModalVisible}
            onTrailerModalHide={() => this.handleonTrailerModalShow(false)}
          />
          <Banner openSignUpForm={this.props.openSignUpForm}
            startCharacterCreation={this.props.startCharacterCreation}
            onEmailInputSubmit={(value) => { this.handleEmailInputSubmit(value) }}
            isEmailInputVisible={this.state.isEmailInputVisible}
            onTrailerModalShow={() => this.handleonTrailerModalShow(true)}
            onBetaFormModalShow={() => this.handleonBetaFormModalShow(true)}
            currentLanguage={this.props.currentLanguage}
          />
        </header>
        <AboutComponent currentLanguage={this.props.currentLanguage} />
        <main>
          <SoqqleInfo currentLanguage={this.props.currentLanguage} />
          <WorkExplanation currentLanguage={this.props.currentLanguage} />
        </main>
        <VideoComponent currentLanguage={this.props.currentLanguage} />
        <main>
          <OurBlog articles={this.props.articles} currentLanguage={this.props.currentLanguage} />
          <TalkAboutUs currentLanguage={this.props.currentLanguage} />
        </main>
      </div>
    );
  }
}

LandingPageContent.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  isSignUpFormOpen: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
  openSignUpForm: bindActionCreators(openSignUpForm, dispatch),
  fetchArticles: bindActionCreators(fetchArticles, dispatch)
});


const mapStateToProps = state => ({
  isAuthorized: state.userProfile.isAuthorized,
  articles: state.articles.articles,
  currentLanguage: state.userProfile.locale.selectedLanguage || 'en'
});

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(LandingPageContent));
