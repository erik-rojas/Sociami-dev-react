import React, { Component } from 'react';

export class AddChallenge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isValidationClose: true,
      validation: '3rd party basic',
      isRewardClose: true,
      reward: 'Token'
    };
  }

  toggleValidationState() {
    this.setState({
      isValidationClose: !this.state.isValidationClose
    });
  }

  selectValidation(validation) {
    this.setState({
      isValidationClose: !this.state.isValidationClose,
      validation: validation
    });
  }

  renderValidationSelect(options) {
    return (
      <div className="custom-select">
        <select>
          {options.map((validation, i) => {
            return(
              <option value={ validation.value } key={ i }>{ validation.label }</option>
            )
          })}
        </select>
        <div
          className={ !this.state.isValidationClose ? 'select-selected select-arrow-active' : 'select-selected' }
          onClick={ () => this.toggleValidationState() }>
          { this.state.validation }
        </div>

        <div
          className={ this.state.isValidationClose ? 'select-items select-hide' : 'select-items' }>
          {options.map((validation, i) => {
            return(
              <div
                onClick={ () => this.selectValidation(validation.label) } key={ i }>
                { validation.label }
              </div>
            )
          })}
        </div>
      </div>
    );
  }

  toggleRewardState() {
    this.setState({
      isRewardClose: !this.state.isRewardClose
    });
  }

  selectReward(reward) {
    this.setState({
      isRewardClose: !this.state.isRewardClose,
      reward: reward
    });
  }

  renderRewardSelect(options) {
    return (
      <div className="custom-select">
        <select>
          {options.map((reward, i) => {
            return(
              <option value={ reward.value } key={ i }>{ reward.label }</option>
            )
          })}
        </select>
        <div
          className={ !this.state.isRewardClose ? 'select-selected select-arrow-active' : 'select-selected' }
          onClick={ () => this.toggleRewardState() }>
          { this.state.reward }
        </div>

        <div
          className={ this.state.isRewardClose ? 'select-items select-hide' : 'select-items' }>
          {options.map((reward, i) => {
            return(
              <div
                onClick={ () => this.selectReward(reward.label) } key={ i }>
                { reward.label }
              </div>
            )
          })}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="col-middle ml-fixed">
        <div className="col-box-wp black-bg">
          <h4 className="top-heading">Add Challenge</h4>
          <form>
            <div className="row">
              <div className="col-sm-12">
                <input type="text" className="form-control" placeholder="Name" />
              </div>
              <div className="col-sm-12">
                <textarea className="form-control" placeholder="Description" className="form-control" rows="3"></textarea>
              </div>
              <div className="col-sm-12">
                <textarea className="form-control" placeholder="Success" className="form-control" rows="3"></textarea>
              </div>
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-4 pr-7 pt-3">
                    {
                      this.renderValidationSelect([
                        { value: "3rd party basic", label: "3rd party basic" },
                        { value: "3rd party intermediate", label: "3rd party intermediate" },
                        { value: "Admin", label: "Admin" },
                        { value: "Maker", label: "Maker" }
                      ])
                    }
                  </div>
                  <div className="col-sm-4 pr-7 pl-7 pt-3">
                    {
                      this.renderRewardSelect([
                        { value: "Token", label: "Token" },
                        { value: "Achievement", label: "Achievement" },
                        { value: "Cash", label: "Cash" }
                      ])
                    }
                  </div>
                  <div className="col-sm-4 pl-7">
                    <input type="text" className="form-control" placeholder="How Much" />
                  </div>
                </div>
              </div>
              <div className="col-sm-12 text-center"><button className="yellow-btn mtb-1">+ Add challenge</button></div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default AddChallenge;
