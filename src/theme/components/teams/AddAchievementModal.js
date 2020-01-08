import React, { Component } from 'react';
import Modal from 'react-modal';
import { Icon } from 'react-fa';
import Img from 'react-image';
import _ from 'lodash';
import Axios from 'axios';

import ConfigMain from '~/configs/main';
import { getPopupParentElement } from '~/src/common/PopupUtils.js';

class AddAchievementModal extends Component {
  constructor(props) {
    super(props);

    this.modalDefaultStyles = {};

    this.state = {
      saveAchievement: false,
      deleteAchievement: false,
      formData: {
        type: 'Achievement',
        name: '',
        description: '',
        result: 'Title',
        resultValue: '',
        generic: true,
        conditions: [
          {
            id: 0,
            type: 'Task',
            taskType: 'Deepdive',
            count: 1
          }
        ]
      },
      achievementTypes: ['Achievement', 'Powerup', 'Story'],
      result: ['Title', 'Bonus Luck', 'Chapter'],
      data: this.props.achievements,
      roadmapData: this.props.roadmapData,
      skillsData: this.props.skillsData,
      achievementId: this.props.achievementId
    };

    this.addCondition = this.addCondition.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.removeCondition = this.removeCondition.bind(this);
  }

  componentWillMount() {
    this.modalDefaultStyles = Modal.defaultStyles;

    Modal.defaultStyles.content.border = '1px solid rgb(6, 144, 247)';
    Modal.defaultStyles.content['boxShadow'] = '0px 0px 5.53px 1.47px rgba(73, 177, 255, 0.53)';
    Modal.defaultStyles.content.color = 'initial';
    Modal.defaultStyles.content.overflow = 'auto';
    Modal.defaultStyles.content.padding = '0';
    Modal.defaultStyles.content['minWidth'] = '260px';
    Modal.defaultStyles.content['maxWidth'] = '800px';
    Modal.defaultStyles.content['height'] = 'initial';
    Modal.defaultStyles.content['minHeight'] = '500px';
    Modal.defaultStyles.content['maxHeight'] = '635px';
    Modal.defaultStyles.content['overflowY'] = 'auto';
    Modal.defaultStyles.content['marginLeft'] = 'auto';
    Modal.defaultStyles.content['marginRight'] = 'auto';
    Modal.defaultStyles.content['left'] = '50%';
    Modal.defaultStyles.content['width'] = '700px';
  }

  componentDidMount() {
    const id = this.state.achievementId;
    if(id != 0) {
      let formData = _.find(this.state.data, {_id: id})
      formData._id = id;
      formData.image = `https://s3.us-east-2.amazonaws.com/admin.soqqle.com/achievementImages/${id}?date=${new Date().toISOString()}`
      _.each(formData.conditions, (c, i) => c.id = i);
      this.setState({formData: _.clone(formData)}, () => {
      });
    }
  }

  onDelete() {
    this.setState({ deleteAchievement: true });
    const id = this.props.achievementId;
    const url = `${ConfigMain.getBackendURL()}/achievements/${id}`;
    return Axios.delete(url)
      .then(response => {
        this.props.getAchievementGroup({id: id, action: 'delete'});
        this.setState({ deleteAchievement: false });
      })
      .catch(error => {
        this.setState({ deleteAchievement: false });
      });
  }

  openImageDialog(evt) {
    evt.stopPropagation();
    var file = this.refs.achievementImageInput;
    if(file) {
      file.click();
    }
  }

  uploadImage(e) {
    var file = e.target.files[0];
    if(file) {
      var imageFormData = new FormData();
      imageFormData.append("image", file);

      Axios.post(`${ConfigMain.getBackendURL()}/achievements/${this.state.formData._id}/upload-image`, imageFormData)
      .then(response => {
        const formData = _.clone(this.state.formData);
        const id = formData._id;
        formData.image = `https://s3.us-east-2.amazonaws.com/admin.soqqle.com/achievementImages/${id}?date=${new Date().toISOString()}`
        this.setState({formData})
      }).catch(err => {
      });
    }
  }

  onSubmit() {
    this.setState({ saveAchievement: true });
    let conf = {
      url: '/achievements',
      method: 'post'
    };

    if (this.state.formData._id) {
      conf = {
        url: `/achievements/${this.state.formData._id}`,
        method: 'put'
      };
    }

    Axios({
      url: `${ConfigMain.getBackendURL()}${conf.url}`,
      method: conf.method,
      data: this.state.formData
    }).then(response => {
      this.props.getAchievementGroup({id: response.data._id, action: 'create'});
      this.setState({ saveAchievement: false });
    })
    .catch(err => {
      this.setState({ saveAchievement: false });
    });
  }

  addCondition() {
    _.get(this, 'state.formData.conditions', []).push(
      {
        id: _.size(_.get(this, 'state.formData.conditions', [])),
        type: 'Task',
        taskType: 'Deepdive',
        count: 1
      }
    );

    let formData = this.state.formData;
    this.setState({formData})
  }

  removeCondition(id) {
    let conditions = this.state.formData.conditions;
    _.remove(conditions, condition => condition.id === id);
    _.set(this, 'state.formData.conditions', conditions)
    let formData = this.state.formData;
    this.setState({formData});
  }

  detailsForm() {
    return (
      <div>
        <h3 style={{
          textAlign: 'left',
          color: '#ffc225',
          fontSize: '16px',
          margin: '5px',
          padding: '10px'
        }}>Details</h3>
        <div>
          <span style={{ color: 'white' }} className="col-lg-6">Type:</span>
          <select
            className="col-lg-6"
            style={{
              borderRadius: 0,
              background: 'white',
              marginBottom: '5px',
              fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
              height: 'auto',
              border: 'none',
              padding: '0',
              fontSize: 'initial'
            }}
            value={this.state.formData.type}
            onChange={e => this.setState({formData: _.merge(this.state.formData, {type: e.target.value})})}
          >
            {this.state.achievementTypes.map((item) => (<option key={item} value={item}>{item}</option>))}
          </select>
        </div>

        <div>
          <span style={{ color: 'white' }} className="col-lg-6">Name:</span>
          <input
            className="col-lg-6"
            style={{ border: 'none', marginBottom: '5px', paddingLeft: '5px', paddingRight: '0' }}
            type="text"
            placeholder="Name"
            value={this.state.formData.name}
            onChange={e => this.setState({formData: _.merge(this.state.formData, {name:e.target.value})})}
          />
        </div>

        <div>
          <span style={{ color: 'white' }} className="col-lg-6">Description:</span>
          <textarea
            className="col-lg-6"
            rows="2"
            style={{ resize:'none', border: 'none', marginBottom: '5px', paddingLeft: '5px', paddingRight: '0' }}
            placeholder="Description"
            value={this.state.formData.description}
            onChange={e => this.setState({formData: _.merge(this.state.formData, {description:e.target.value})})}
          />
        </div>

        <div>
          <span style={{ color: 'white' }} className="col-lg-6">Result:</span>
          <select
            className="col-lg-6"
            style={{
              borderRadius: 0,
              background: 'white',
              marginBottom: '5px',
              fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
              height: 'auto',
              border: 'none',
              padding: '0',
              fontSize: 'initial'
            }}
            value={this.state.formData.result}
            onChange={e => this.setState({formData: _.merge(this.state.formData, {result: e.target.value})})}
          >
            {this.state.result.map((item) => (<option key={item} value={item}>{item}</option>))}
          </select>
        </div>

        <div>
          <span style={{ color: 'white' }} className="col-lg-6">Result value:</span>
          <input
            className="col-lg-6"
            style={{ border: 'none', marginBottom: '5px', paddingLeft: '5px', paddingRight: '0' }}
            type="text"
            placeholder="Result value"
            value={this.state.formData.resultValue}
            onChange={e => this.setState({formData: _.merge(this.state.formData, {resultValue: e.target.value})})}
          />
        </div>

        <div>
          <span style={{ color: 'white' }} className="col-lg-6">Generic:</span>
          <select
            className="col-lg-6"
            style={{
              borderRadius: 0,
              background: 'white',
              marginBottom: '5px',
              fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
              height: 'auto',
              border: 'none',
              padding: '0',
              fontSize: 'initial'
            }}
            value={this.state.formData.generic}
            onChange={e => this.setState({formData: _.merge(this.state.formData, {generic: e.target.value})})}
          >
            {[{val: true, name: 'Yes'}, {val: false, name: 'No'}].map((item) => (<option key={item.val} value={item.val}>{item.name}</option>))}
          </select>
        </div>

        {
          this.props.achievementId != 0 &&
          <div>
            <span style={{ color: 'white' }} className="col-lg-6">Image:</span>
            <div className="col-lg-6" style={{padding: '0'}}>
              <Img
                src={this.state.formData.image}
                style={{maxWidth: 135, maxHeight: 120}}
              />
              <div className="middle-edit" onClick={this.openImageDialog.bind(this)}><a href="#" style={{color: 'white', fontSize: '12px', textDecoration: 'none'}}><i className="fa fa-camera" aria-hidden="true"></i> &nbsp; Click to Upload</a></div>
            </div>
            <input type="file" ref="achievementImageInput" accept=".jpg, .png, .jpeg, .gif" style={{ display: 'none' }} onChange={this.uploadImage.bind(this)} />
          </div>
        }
      </div>
    );
  }

  addConditionsForm() {
    let conditions = this.state.formData.conditions;
    return (
      <div>
        <h3 style={{
          textAlign: 'left',
          color: '#ffc225',
          fontSize: '16px',
          margin: '5px',
          padding: '10px'
        }}>Conditions</h3>
        {
          _.map(conditions, (c, index) => {
            return (
              <div key={index} style={{padding: '10px 10px 5px', clear: 'both', background: 'rgba(99, 99, 99, 0.5)', display: 'inline-block', width: '100%', borderRadius: '5px'}}>
                <div>
                  <div className="col-lg-12" style={{ padding: 0, width: 'auto', margin: '-10px 0 0 -5px' }}>
                    <span style={{ color: '#ffc225', cursor: 'pointer' }} className="fa fa-minus-circle" onClick={() => this.removeCondition(c.id)}></span>
                  </div>
                  <span style={{ color: 'white', clear: 'both' }} className="col-lg-6">Condition Type:</span>
                  <select
                    className="col-lg-6"
                    style={{
                      borderRadius: 0,
                      background: 'white',
                      marginBottom: '5px',
                      fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
                      height: 'auto',
                      border: 'none',
                      padding: '0',
                      fontSize: 'initial'
                    }}
                    value={c.type}
                    onChange={e => {
                      let type = e.target.value;
                      let condition = {id: c.id, type};
                      if (type === 'Task' || type === 'Task and Progression') {
                        condition.count = 1;
                        condition.taskType = 'Deepdive';
                      }

                      if (type === 'Progression' || type === 'Action' || type === 'Level') {
                        condition.count = 1;
                      }
                      _.set(this, `state.formData.conditions.${c.id}`, condition)
                      let formData = _.get(this, 'state.formData')
                      this.setState({formData});
                    }}
                  >
                    <option value="Task" key="Task">Task</option>
                    <option value="Progression" key="Progression">Progression</option>
                    <option value="Task and Progression" key="Task and Progression">Task and Progression</option>
                    <option value="Achievements" key="Achievements">Achievements</option>
                    <option value="Action" key="Action">Action</option>
                    <option value="Level" key="Level">Level</option>
                    <option value="Story" key="Story">Story</option>
                  </select>
                </div>

                {
                  c.type === 'Task' &&
                  <div>
                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Task Type:</span>
                      <select
                        className="col-lg-6"
                        style={{
                          borderRadius: 0,
                          background: 'white',
                          marginBottom: '5px',
                          fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
                          height: 'auto',
                          border: 'none',
                          padding: '0',
                          fontSize: 'initial'
                        }}
                        value={_.get(this, `state.formData.conditions.${c.id}.taskType`)}
                        onChange={e => {
                          _.set(this, `state.formData.conditions.${c.id}.taskType`, e.target.value)
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      >
                        <option value="Deepdive" key="Deepdive">Deepdive</option>
                        <option value="Illuminate" key="Illuminate">Illuminate</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Count:</span>
                      <input
                        className="col-lg-6"
                        style={{ border: 'none', marginBottom: '5px', paddingLeft: '5px', paddingRight: '0' }}
                        type="number"
                        placeholder="Count"
                        value={c.count}
                        min={1}
                        onChange={e => {
                          _.set(this, `state.formData.conditions.${c.id}.count`, e.target.value)
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      />
                    </div>
                  </div>
                }

                {
                  c.type === 'Progression' &&
                  <div>
                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Progression:</span>
                      <select
                        className="col-lg-6"
                        style={{
                          borderRadius: 0,
                          background: 'white',
                          marginBottom: '5px',
                          fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
                          height: 'auto',
                          border: 'none',
                          padding: '0',
                          fontSize: 'initial'
                        }}
                        value={this.state.formData.conditions[c.id]._roadmap}
                        onChange={e => {
                          _.set(this, `state.formData.conditions.${c.id}._roadmap`, e.target.value)
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      >
                        {_.map(this.state.roadmapData, roadmap => {
                          return (
                            <option key={roadmap._id} value={roadmap.name}>{roadmap.name}</option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Count:</span>
                      <input
                        className="col-lg-6"
                        style={{ border: 'none', marginBottom: '5px', paddingLeft: '5px', paddingRight: '0' }}
                        type="number"
                        placeholder="Count"
                        value={c.count}
                        min={1}
                        onChange={e => {
                          _.set(this, `state.formData.conditions.${c.id}.count`, e.target.value)
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      />
                    </div>
                  </div>
                }

                {
                  c.type === 'Task and Progression' &&
                  <div>
                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Task Type:</span>
                      <select
                        className="col-lg-6"
                        style={{
                          borderRadius: 0,
                          background: 'white',
                          marginBottom: '5px',
                          fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
                          height: 'auto',
                          border: 'none',
                          padding: '0',
                          fontSize: 'initial'
                        }}
                        value={_.get(this, `state.formData.conditions.${c.id}.taskType`)}
                        onChange={e => {
                          _.set(this, `state.formData.conditions.${c.id}.taskType`, e.target.value)
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      >
                        <option value="Deepdive">Deepdive</option>
                        <option value="Illuminate">Illuminate</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Progression:</span>
                      <select
                        className="col-lg-6"
                        style={{
                          borderRadius: 0,
                          background: 'white',
                          marginBottom: '5px',
                          fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
                          height: 'auto',
                          border: 'none',
                          padding: '0',
                          fontSize: 'initial'
                        }}
                        value={this.state.formData.conditions[c.id]._roadmap}
                        onChange={e => {
                          _.set(this, `state.formData.conditions.${c.id}._roadmap`, e.target.value)
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      >
                        {_.map(this.state.roadmapData, roadmap => {
                          return (
                            <option key={roadmap._id} value={roadmap._id}>{roadmap.name}</option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Count:</span>
                      <input
                        className="col-lg-6"
                        style={{ border: 'none', marginBottom: '5px', paddingLeft: '5px', paddingRight: '0' }}
                        type="number"
                        placeholder="Count"
                        value={c.count}
                        min={1}
                        onChange={e => {
                          _.set(this, `state.formData.conditions.${c.id}.count`, e.target.value)
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      />
                    </div>
                  </div>
                }

                {
                  c.type === 'Achievements' &&
                  <div>
                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Achievements:</span>
                      <select
                        className="col-lg-6"
                        style={{
                          borderRadius: 0,
                          background: 'white',
                          marginBottom: '5px',
                          fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
                          height: 'auto',
                          border: 'none',
                          padding: '0',
                          fontSize: 'initial'
                        }}
                        multiple="multiple"
                        value={c._achievements}
                        onChange={ e => {
                          var options = e.target.options;
                          var values = [];
                          for (var i = 0, l = options.length; i < l; i++) {
                            if (options[i].selected) {
                              values.push(options[i].value);
                            }
                          }
                          _.set(this, `state.formData.conditions.${c.id}._achievements`, values)
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      >
                        {
                          _.map(_.filter(this.state.data, {type: 'Achievement'}), data => <option key={data._id} value={data._id}>{data.name}</option>)
                        }
                      </select>
                    </div>
                  </div>
                }

                {
                  c.type === 'Story' &&
                  <div>
                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Story:</span>
                      <select
                        className="col-lg-6"
                        style={{
                          borderRadius: 0,
                          background: 'white',
                          marginBottom: '5px',
                          fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
                          height: 'auto',
                          border: 'none',
                          padding: '0',
                          fontSize: 'initial'
                        }}
                        value={c._story}
                        onChange={ e => {
                          _.set(this, `state.formData.conditions.${c.id}._story`, e.target.value)
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      >
                        { _.map(_.filter(this.state.data, {type: 'Story'}), data => <option key={data._id} value={data._id}>{data.name}</option>)}
                      </select>
                    </div>
                  </div>
                }

                {
                  c.type === 'Action' &&
                  <div>
                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Action:</span>
                      <select
                        className="col-lg-6"
                        style={{
                          borderRadius: 0,
                          background: 'white',
                          marginBottom: '5px',
                          fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
                          height: 'auto',
                          border: 'none',
                          padding: '0',
                          fontSize: 'initial'
                        }}
                        value={c.action}
                        onChange={ e => {
                          _.set(this, `state.formData.conditions.${c.id}.action`, e.target.value)
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      >
                        <option value="Facebook Share">Facebook Share</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Count:</span>
                      <input
                        className="col-lg-6"
                        style={{ border: 'none', marginBottom: '5px', paddingLeft: '5px', paddingRight: '0' }}
                        type="number"
                        placeholder="Count"
                        value={c.count}
                        min={1}
                        onChange={e => {
                          _.set(this, `state.formData.conditions.${c.id}.count`, e.target.value)
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      />
                    </div>
                  </div>
                }

                {
                  c.type === 'Level' &&
                  <div>
                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Roadmap or Skill:</span>
                      <select
                        className="col-lg-6"
                        style={{
                          borderRadius: 0,
                          background: 'white',
                          marginBottom: '5px',
                          fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
                          height: 'auto',
                          border: 'none',
                          padding: '0',
                          fontSize: 'initial'
                        }}
                        value={_.get(this, `state.formData.conditions.${c.id}.levelType`)}
                        onChange={e => {
                          let levelType = e.target.value;
                          _.set(this, `state.formData.conditions.${c.id}.levelType`, levelType)
                          if (levelType === 'None') {
                            _.set(this, `state.formData.conditions.${c.id}._roadmap`, '')
                            _.set(this, `state.formData.conditions.${c.id}._skill`, '')
                          }
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      >
                        <option value="None" key="None">None</option>
                        <option value="Roadmap" key="Roadmap">Roadmap</option>
                        <option value="Skill" key="Skill">Skill</option>
                      </select>
                    </div>

                    {
                      _.get(this, `state.formData.conditions.${c.id}.levelType`) === 'Roadmap' &&
                      <div>
                        <span style={{ color: 'white' }} className="col-lg-6">Roadmap:</span>
                        <select
                          className="col-lg-6"
                          style={{
                            borderRadius: 0,
                            background: 'white',
                            marginBottom: '5px',
                            fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
                            height: 'auto',
                            border: 'none',
                            padding: '0',
                            fontSize: 'initial'
                          }}
                          value={_.get(this, `state.formData.conditions.${c.id}._roadmap`)}
                          onChange={e => {
                            _.set(this, `state.formData.conditions.${c.id}._roadmap`, e.target.value)
                              const formData = this.state.formData;
                              this.setState({formData})
                          }}
                        >
                          {_.map(this.state.roadmapData, roadmap => {
                            return (
                              <option key={roadmap._id} >{roadmap.name}</option>
                            );
                          })}
                        </select>
                      </div>
                    }

                    {
                      _.get(this, `state.formData.conditions.${c.id}.levelType`) === 'Skill' &&
                      <div>
                        <span style={{ color: 'white' }} className="col-lg-6">Skill:</span>
                        <select
                          className="col-lg-6"
                          style={{
                            borderRadius: 0,
                            background: 'white',
                            marginBottom: '5px',
                            fontFamily: 'Berlin-Sans-FB-Regular, sans-serif',
                            height: 'auto',
                            border: 'none',
                            padding: '0',
                            fontSize: 'initial'
                          }}
                          value={_.get(this, `state.formData.conditions.${c.id}._skill`)}
                          onChange={e => {
                            _.set(this, `state.formData.conditions.${c.id}._skill`, e.target.value)
                              const formData = this.state.formData;
                              this.setState({formData})
                          }}
                        >
                          {_.map(this.state.skillsData, skill => {
                            return (
                              <option key={skill._id} >{skill.skill}</option>
                            );
                          })}
                        </select>
                      </div>
                    }

                    <div>
                      <span style={{ color: 'white' }} className="col-lg-6">Count:</span>
                      <input
                        className="col-lg-6"
                        style={{ border: 'none', marginBottom: '5px', paddingLeft: '5px', paddingRight: '0' }}
                        type="number"
                        placeholder="Count"
                        value={c.count}
                        min={1}
                        onChange={e => {
                          _.set(this, `state.formData.conditions.${c.id}.count`, e.target.value)
                          const formData = this.state.formData;
                          this.setState({formData})
                        }}
                      />
                    </div>
                  </div>
                }
              </div>
            );
          })
        }
        <button
          style={{
            background: '#ffc225',
            fontSize: '16px',
            margin: '15px',
            border: 'transparent'
          }}
          onClick={() => this.addCondition()}
        >
          Add Condition
        </button>
      </div>
    );
  }

  conditionTable() {
    return(
      <div>
        <h3 style={{
          textAlign: 'left',
          color: '#ffc225',
          fontSize: '16px',
          margin: '5px',
          padding: '10px'
        }}>Conditions</h3>
        <table style={{
          color: 'white',
          width: '100%',
          margin: '15px'
        }}>
          <thead style={{ color: 'grey' }}>
            <tr>
              <th style={{ width: '20%'}}>#</th>
              <th style={{ width: '30%'}}>Type</th>
              <th style={{ width: '30%'}}>Detail</th>
              <th>Count</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              _.map(this.state.formData.conditions, (c, index) => {
                return (
                  <tr key={c.id}>
                    <th>{index + 1}</th>
                    <th>{c.type}</th>
                    <th>
                      {c.taskType}
                      {c.levelType}
                    </th>
                    <th>{c.count}</th>
                    <th>
                      {
                        index != 0 &&
                        <Icon style={{color: '#ffc225'}} name="minus-circle" />
                      }
                    </th>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }

  renderHeader() {
    return (
      <div style={{ padding: '10px' }}>
        <table style={{width: '100%',
          borderCollapse: 'inherit',
          borderSpacing: '30px'}}>
          <tbody>
            <tr>
              <td colSpan="2" style={{
                padding: '10px 25px',
                border: '1px solid gray'
              }}>{this.detailsForm()}</td>
            </tr>
            <tr>
              {<td colSpan="2" style={{
                padding: '10px 25px',
                border: '1px solid gray'
              }}>{this.addConditionsForm()}</td>}
            </tr>
            {/* <tr>
              <td colSpan="2" style={{
                padding: '10px 25px',
                border: '1px solid gray'
              }}>{this.conditionTable()}</td>
            </tr> */}
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                <button
                  style={{
                    background: '#ffc225',
                    fontSize: '16px',
                    border: 'transparent'
                  }}
                  disabled={this.state.saveAchievement}
                  onClick={() => this.onSubmit()}
                >
                  {this.props.achievementId == 0 ? 'Submit' : 'Update'}
                </button>
                {
                  this.props.achievementId != 0 &&
                  <button
                    style={{
                      background: '#eae3e2',
                      fontSize: '16px',
                      border: 'transparent',
                      marginLeft: '10px'
                    }}
                    disabled={this.state.deleteAchievement}
                    onClick={() => this.onDelete()}
                  >
                    Delete
                  </button>
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <Modal
        contentLabel={'Add Team Achievement'}
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
        parentSelector={getPopupParentElement}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)'
          },
          content: {
            background: 'black',
            width: '760px'
          }
        }}>
        {this.renderHeader()}
      </Modal>
    );
  }
}

export default require('react-click-outside')(AddAchievementModal);
