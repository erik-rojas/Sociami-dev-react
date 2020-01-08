import React from 'react';

const Photos = (props) => {

  return (
    <div className="col-box-wp">
      <div className="my-photos-wp">
        <h3 className="col-heading">{props.heading}</h3>
        <ul>
          <li><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/left-bottom-1.jpg" /></li>
          <li><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/left-bottom-2.jpg" /></li>
          <li><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/left-bottom-3.jpg" /></li>
          <li><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/left-bottom-4.jpg" /></li>
          <li><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/left-bottom-5.jpg" /></li>
          <li><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/left-bottom-6.jpg" /></li>
        </ul>
      </div>
    </div>
  );
}

export default Photos;
