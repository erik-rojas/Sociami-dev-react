/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withCookies, Cookies } from 'react-cookie';

import '~/src/theme/new_ui/css/style.css';

import SignUpFormPopup from '~/src/authentication/SignUpForm';

import ActionLink from '~/src/components/common/ActionLink';

import { openSignUpForm } from '~/src/redux/actions/authorization';

import CharacterCreationFlow from '~/src/character-creation/CharacterCreationFlow';

import { startCharacterCreation } from '~/src/redux/actions/characterCreation';

class LandingPageContent extends React.Component {
  constructor(props) {
    super(props);
  }

  startCharacterCreation() {
    this.props.startCharacterCreation();
  }

  renderSignUpForm() {
    return this.props.isSignUpFormOpen ? (
      <SignUpFormPopup
        modalIsOpen={this.props.isSignUpFormOpen}
        isAuthorized={this.props.isAuthorized}
        onCloseModal={() => this.props.onCloseSignUpModal()}
        onHandleSignUpFacebook={() => this.props.onHandleSignUpFacebook()}
        onHandleSignUpLinkedIn={() => this.props.onHandleSignUpLinkedIn()}
        pathname={this.props.pathname}
      />
    ) : null;
  }

  render() {
    return (
      <div>
        {this.renderSignUpForm()}
        <CharacterCreationFlow
          onHandleSignUpFacebook={() => this.props.onHandleSignUpFacebook()}
          onHandleSignUpLinkedIn={() => this.props.onHandleSignUpLinkedIn()}
          onHandleCreationFinish={() => this.props.finishCharacterCreation()}
        />
        <div className="session-header-landing">
          <div className="container">
            <div className="row">
              <div className="col-xs-6">
                <h1 className="logo">
                  <a href="#">
                    <img
                      src="https://sociamibucket.s3.amazonaws.com/assets/new_ui_gamified/assets/img/logo.png"
                      alt=""
                    />
                    <span
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        position: 'relative',
                        bottom: '-20px',
                        left: '-30px',
                      }}
                    >
                      alpha
                    </span>
                  </a>
                </h1>
              </div>
              <div className="col-xs-6 pull-right">
                <div className="pull-right" id="landing-header-links">
                  <div className="text-right" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 col-md-offset-2">
                <div className="box-intro">
                  <h1 className="heading-1">Fight for the future</h1>
                  <h4 className="heading-4"> Join one of the most futuristic orders in the world</h4>
                  <p className="text-para">
                    Welcome to Soqqle<br />
                    Soqqle is a new gamified learning world for people to come together to prepare and solve
                    challenges to unlock the next-generation Human Renaissance.
                  </p>
                  <p>
                    <a
                      href="#"
                      className="btn-base-landing btn-red-landing"
                      onClick={() => this.props.openSignUpForm()}
                    >
                      Sign in
                    </a>
                    <br />
                    <ActionLink
                      id="link-create-acc"
                      href="#"
                      onClick={() => this.startCharacterCreation()}
                      className=""
                    >
                      <span style={{ fontWeight: 'bold', color: 'black', textDecoration: 'underline' }}>
                        CREATE YOUR CHARACTER INSTEAD
                      </span>
                    </ActionLink>
                  </p>
                  <iframe
                    width="420"
                    height="345"
                    id="intro-video"
                    src="https://www.youtube.com/embed/i8PJgSclIf0"
                  />
                </div>
              </div>
            </div>

            <div className="modal fade" id="token" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 className="modal-title">Token Events Updates</h4>
                  </div>
                  <div className="modal-body">
                    <p>
                      The easiest way to learn and collaborate with your friends. The only Blockchain powered
                      smart social network that propels you to the forefront of humankind.
                    </p>
                    <form>
                      <div className="form-group">
                        <label htmlFor="token-name" className="control-label">
                          Name:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="token-name"
                          placeholder="Enter you name here"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="token-email" className="control-label">
                          Email:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="token-email"
                          placeholder="Enter you email here"
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button id="cancel" type="button" className="btn btn-default" data-dismiss="modal">
                      Close
                    </button>
                    <button id="ok" type="button" className="btn btn-primary">
                      Join us
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-7" />
              <div className="col-md-5">
                <div className="box-problem">
                  <div className="icon-format">?</div>
                  <h1 className="text-heading">The Revolution War</h1>
                  <div>
                    <p>It’s no secret. </p>
                    <p>
                      A mysterious technology epidemic surges across the world today. And this epidemic is
                      called the 4th Industrial Revolution aka “Future of Work”.{' '}
                    </p>
                    <p>
                      Bands of people must now come together to build new next-generation high-tech to beat
                      threatening technologies to ensure the survival of humankind.
                    </p>
                    <p>But we need to be better with how we learn and grow.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="session-mid">
          <div className="container">
            <div className="box-head">
              <h1 className="text-heading heading-border">
                <span>Goal</span>
              </h1>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4 no-padding">
                <div className="box-seed seed-left">
                  <div className="block-capital">
                    <h4>Complete Learning Challenges</h4>
                    <div>
                      <p>
                        Browse progression trees to discover opportunities you may not have known about or
                        know how to get deeper into .
                      </p>
                      <p>
                        Complete tasks along each tree that guides you closer to the mastery level you need!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 no-padding">
                <div className="box-seed seed-mid">
                  <div className="block-capital">
                    <h4>Loop in your Friends</h4>
                    <div>
                      <p>Don’t go into battle alone! Bring friends to master your journeys togethe</p>
                      <p>
                        Rewards tend to be bigger, and come faster in groups. Earn reputation and cast it on
                        the “Blockchain Stone”
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 no-padding">
                <div className="box-seed seed-right">
                  <div className="block-capital">
                    <h4>The Force of the Block</h4>
                    <div>
                      <p>
                        A Mysterious Force spits out tokens digitally to pioneering Soqqle Users (Soqqlers)
                        and records social reputation. The word going around is that it is powered by
                        “Blockchain”.
                      </p>
                      <p>
                        Grow your character and gain mastery to unlock more powerful tasks to gain more
                        control over the “Force of the Block”.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="session2">
            <div className="container">
              <div className="row">
                <div className="col-md-3">
                  <div className="box-feature">
                    <div className="item-feature feature-1">
                      Discover the world of the future as you pick up quests and challenges in progression
                      trees.
                    </div>
                    <div className="item-feature feature-2">
                      Feel like being alone? Explore the game in Single Player by completing tasks laid out to
                      you.
                    </div>
                    <div className="item-feature feature-3">
                      Want to be social? Put out a request to engage others to work on tasks together.
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="block-feature">
                    <div className="head-how">HOW IT WORKS</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="box-feature">
                    <div className="item-feature feature-4">
                      As you complete group tasks you earn EXP (Electronic XP) to solidify the social
                      engagement you contributed in.
                    </div>
                    <div className="item-feature feature-5">
                      Use E-XP to convert to merchant vouchers (A future enhancement) or Token (To be released
                      in Beta).
                    </div>
                    <div className="item-feature feature-6">
                      Use tokens to boost your experience gain, or save it until you need it later. Or, you
                      could give it to a friend
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="session-mid2">
          <div>
            <div className="col-md-4" />
            <div className="col-md-3" />
            <div className="col-md-5">
              <div className="block-token">
                <div className="head-token">Summary</div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <h2 className="heading-token">Token-Leveling System</h2>
              <div className="col-md-4">
                <div className="box-token token-1">
                  <h3>Electronic XP (EXP)</h3>
                  <p>
                    Special tasks (Group Only) churn out EXP. You can see how many EXP is given when you pick
                    up your tasks. EXP is Experience, or Expertise that solidify your growth.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="box-token token-2">
                  <h3>SOQQ: The Powerup token</h3>
                  <p>
                    SOQQ Tokens power-up pre-defined group or individual’s experience gains like a booster
                    pack.
                  </p>
                </div>
              </div>
              <div className="col-md-4 no-padding">
                <div className="box-token token-3" />
              </div>
            </div>
          </div>

          <div className="container">
            <div className="block-experience">
              <div className="col-md-9 no-padding">
                <div className="text-intro-experience">
                  Users choose a character type that represents their personality. This will define the
                  overall experience around tasks that will be assigned.
                </div>
              </div>
              <div className="col-md-3 no-padding" />

              <div className="col-md-4 col-sm-4 no-padding">
                <div className="box-experience bg-white">
                  <h3>Realistic (Do’er)</h3>
                  <p>Prefers physical activities that re-quire skill, strength, and coordina-tion.</p>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 no-padding">
                <div className="box-experience bg-blue">
                  <h3>Investigative (Thinker)</h3>
                  <p>Prefers working with theory and information, thinking, organizing, and understanding.</p>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 no-padding">
                <div className="box-experience bg-white">
                  <h3>Artistic (Creator)</h3>
                  <p>
                    Prefers creative, original, and un-systematic activities that allow creative expression.
                  </p>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 no-padding">
                <div className="box-experience bg-blue">
                  <h3>Social (Helper)</h3>
                  <p>Prefers activities that involve help-ing, healing, or developing others.</p>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 no-padding">
                <div className="box-experience bg-white">
                  <h3>Enterprising (Persuader)</h3>
                  <p>Prefers competitive environments, leadership, influence, selling, and status.</p>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 no-padding">
                <div className="box-experience bg-blue">
                  <h3>Conventional (Organizer)</h3>
                  <p>Prefers precise, rule-regulated, or-derly, and unambiguous activities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="session-mid3">
          <div className="col-md-7 no-padding" />
          <div className="col-md-5 no-padding">
            <div className="heading-characters">Characters</div>
          </div>

          <div className="container-fluid">
            <div className="block-item clearfix">
              <div className="row">
                <div className="col-sm-4 col-sm-push-8 no-padding">
                  <div className="avatar-p1">
                    <img
                      src="https://sociamibucket.s3.amazonaws.com/assets/new_ui_gamified/assets/img/p1.png"
                      alt=""
                      className="img-avatar"
                    />
                    <div className="btn-name btn-contact-red1">Leona</div>
                  </div>
                </div>
                <div className="col-sm-8 col-sm-pull-4 no-padding">
                  <div className="item-contact">
                    <div className="box-contact1 text-item">
                      <span>
                        PIE > CAKE, #YOLO, DO WHAT YOU LOVE, CLINICAL DOCTOR, SCIENCE HACKTIVIST, CLONING
                        ILLUMINATI, RESEARCH HOARDER, WELCOME TO MY WORLD
                      </span>
                    </div>

                    <div className="box-overlay overlay-red" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 col-sm-4 no-padding">
                  <div className="avatar-p2">
                    <img
                      src="https://sociamibucket.s3.amazonaws.com/assets/new_ui_gamified/assets/img/p2.png"
                      alt=""
                      className="img-avatar"
                    />

                    <div className="btn-name btn-contact-red2">Leo</div>
                  </div>
                </div>
                <div className="col-md-8 col-sm-8 no-padding">
                  <div className="item-contact">
                    <div className="box-contact2 text-item">
                      <span>
                        INTERNET OF THINGS CSAR, COOLHUNTER, BOT COACH, GADGET INNOVATOR, SERIAL CLAIRVOYANT,
                        CES TRENDSETTER, RUNS WITH SCISSORS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="clearfix">
              <div className="row">
                <div className="col-sm-4 col-sm-push-8 no-padding">
                  <div className="avatar-p1">
                    <img
                      src="https://sociamibucket.s3.amazonaws.com/assets/new_ui_gamified/assets/img/p3.png"
                      alt=""
                      className="img-avatar"
                    />
                    <div className="btn-name btn-contact-pink1">Max</div>
                  </div>
                </div>
                <div className="col-sm-8 col-sm-pull-4 no-padding">
                  <div className="item-contact">
                    <div className="box-contact1 text-item">
                      <span>
                        DIGITAL CONTENT ACROBAT, GYM JOCK, WHAT THE WHAT, GENEROUS LOVER, COFFEE IS FOR
                        CLOSERS, BOT HYPNOTIST, CMS GEEK
                      </span>
                    </div>

                    <div className="box-overlay overlay-purple" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 col-sm-4 no-padding">
                  <div className="avatar-p2">
                    <img
                      src="https://sociamibucket.s3.amazonaws.com/assets/new_ui_gamified/assets/img/p4.png"
                      alt=""
                      className="img-avatar"
                    />

                    <div className="btn-name btn-contact-pink2">Ashe</div>
                  </div>
                </div>
                <div className="col-md-8 col-sm-8 no-padding">
                  <div className="item-contact">
                    <div className="box-contact2 text-item">
                      <span>
                        CHIEF MOTIVATION GOD, PUTTING OUT FIRES, CREATIVE TRENDSPOTTER, SILOCON VALLEY GYPST,
                        PROBLEM SOLVING RULE BREAKER, VC SPECIALIST
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="clearfix">
              <div className="row">
                <div className="col-sm-4 col-sm-push-8 no-padding">
                  <div className="avatar-p1">
                    <img
                      src="https://sociamibucket.s3.amazonaws.com/assets/new_ui_gamified/assets/img/p5.png"
                      alt=""
                      className="img-avatar"
                    />

                    <div className="btn-name btn-contact-green1">Kaye</div>
                  </div>
                </div>

                <div className="col-sm-8 col-sm-pull-4 no-padding">
                  <div className="item-contact">
                    <div className="box-contact1 text-item">
                      <span>
                        SPEED DATER, STEAING YOUR INTERNETZ, INTROVERT, CHOCOLATE SNOB, SECURITY DIVA, DON"T
                        HATE ME BECAUSE I'M BEAUTIFUL
                      </span>
                    </div>

                    <div className="box-overlay overlay-yellow" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 col-sm-4 no-padding">
                  <div className="avatar-p2">
                    <img
                      src="https://sociamibucket.s3.amazonaws.com/assets/new_ui_gamified/assets/img/p6.png"
                      alt=""
                      className="img-avatar"
                    />

                    <div className="btn-name btn-contact-green2">Nelson</div>
                  </div>
                </div>
                <div className="col-md-8 col-sm-8 no-padding">
                  <div className="item-contact">
                    <div className="box-contact2 text-item">
                      <span>
                        PROGRAMMING VISIONARY{'<'} BIG DATA WHISPER, WEB 4.0 SENSEI, APP PUNK, GAMING PUNDIT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="session-mid4">
          <div className="container">
            <div className="row">
              <div className="col-sm-4 col-sm-push-8">
                <h1 className="heading-system">System</h1>
              </div>
              <div className="col-sm-8 col-sm-pull-4">
                <div className="box-system">
                  <div className="item-system block-1">
                    <h3 className="text-red">Single Player Modes</h3>
                    <p>
                      <span className="text-red">Illuminate -</span> Meant for Secret Society Acolytes
                    </p>
                    <p>
                      <span className="text-red">Decipher -</span> Meant for Code-Breakers and Puzzle-Solvers
                    </p>
                    <p>
                      <span className="text-red">Demystify -</span> Meant for Detectives
                    </p>
                  </div>

                  <div className="item-system block-2">
                    <p>
                      <span className="text-red">Hangout -</span> A conversation out of curiosity and
                      information gathering
                    </p>
                    <p>
                      <span className="text-red">Disentangle -</span> For people who see the topics of
                      interest as a bit of an unclear mess that they can disen-tangle
                    </p>
                  </div>

                  <div className="item-system block-3">
                    <h3 className="text-red">Team Player Modes</h3>
                  </div>

                  <div className="item-system block-4">
                    <p>
                      <span className="text-red">Deep Dive -</span> two people seriously want to delve deep
                      into a common topic of interest
                    </p>
                  </div>

                  <div className="item-system block-5">
                    <p>
                      <span className="text-red">Brainstorm -</span> Storming an iron fortress feel or two
                      brains clashing like clouds causing a lightning / thun-derstorm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-widget">
          <div className="container">
            {/*<div className="row">
                <div className="box-specs">
                    <div className="item-specs">
                        <div className="col-md-3 col-sm-4">
                            <h1>Token Specs</h1>
                        </div>
                        <div className="col-md-9 col-sm-8">
                            <p>Users complete challenges to gain a token.
                                The token gives experience boosts or redeems advanced challenges.
                                It can also be used to get help from others (friends or public) to complete tasks for a personal project.
                                This gamification model creates a viral need for people to meet and learn to gain tokens.
                                Also, users will want to level faster through token usage to get alluring merchant benefits.
                            </p>
                        </div>
                    </div>

                    <div className="item-specs specs2">
                        <div className="col-md-3 col-sm-4">
                            <h1>Specs</h1>
                        </div>
                        <div className="col-md-9 col-sm-8">
                            <p>Our token sale is expected in Q2 register for our newsletter to receive updates on our project</p>
                        </div>
                    </div>
                </div>
            </div>*/}
          </div>
        </div>

        <div className="session-footer">
          <div className="container">
            <img
              src="https://sociamibucket.s3.amazonaws.com/assets/new_ui_gamified/assets/img/logo.png"
              className="logo-footer"
              alt=""
            />
          </div>
        </div>
      </div>
    );
  }
}

LandingPageContent.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  isSignUpFormOpen: PropTypes.bool.isRequired,
  startCharacterCreation: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  openSignUpForm: bindActionCreators(openSignUpForm, dispatch),
  startCharacterCreation: bindActionCreators(startCharacterCreation, dispatch),
});

const mapStateToProps = state => ({
  isAuthorized: state.userProfile.isAuthorized,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withCookies(LandingPageContent));
