import React from 'react';

const LeftNav = props => {
  return (
    <div className="col fixed-wp achievements-left-wp">
      <div className="col-box-wp p-0">
        <div className="left-content">
          <div className="top-head">
            <div className="icon">
              <img src={props.profilePic} alt="" />
            </div>
            <span className="col-heading">
              {props.userProfile.firstName} {props.userProfile.lastName}
            </span>
          </div>
          <ul className="achievements-left-wap-links">
            {props.tempCompaniesNavData.map((company, index) => {
              return (
                <li key={ index } onClick={props.onLeftNavCompanyClick.bind(props, index)} href="#" className={index === props.currentCompany ? 'active' : ''}>
                  <a>
                    <p>{company.name}</p>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftNav;
