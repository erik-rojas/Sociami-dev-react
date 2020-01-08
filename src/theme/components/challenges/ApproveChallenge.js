import React from 'react';

const ApproveChallenge = (props) => {
  return (
    <div className="col-middle ml-fixed">
      <div className="row">
        <div className="col-sm-12">
          <h3 className="yellow-text">Approve Submission</h3>
        </div>
      </div>
      <div className="col-box-wp">
        <div className="top-head">
          <div className="profile-icon">
            <img src={props.profilePic} alt="" />
          </div>
          <span className="col-heading">David Avetyan</span>
          <span className="bule-text">2 days ago</span>
        </div>
        <div className="img-warp"><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/approve-sub-img.jpg" alt="" /></div>
        <div className="bot-warp">
          <div className="row">
            <div className="col-sm-7 col-xs-12">
              <div className="row">
                <div className="col-sm-8 col-xs-6">
                  <h6>challenge</h6>
                  <p>Mine 100 Irone One</p>
                </div>
                <div className="col-sm-4 col-xs-6">
                  <h6>reward</h6>
                  <p>500 Tokens</p>
                </div>
              </div>
            </div>
            <div className="col-sm-5 col-xs-12">                                  
              <button className="btn">Reject</button>
              <button className="btn active">Approve</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApproveChallenge;
