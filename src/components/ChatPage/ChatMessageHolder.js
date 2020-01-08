import React from 'react';

import messageTemp from '../../theme/images/message_temp.png';

const ChatMessageHolder = () => {
  return(
    <div className="right-middle-messages">

      <div className="message-box">
        <div className="header">
          <div className="icon-holder">
            <div className="icon">
              <img/>
            </div>
            <div className="header-text">Danie who doesn't like 90</div>
          </div>
          <div className="time-text">04:48p.m.</div>
        </div>
        <div className="text-holder">
          <div className="text-message">
            <i className='fa fa-paperclip'/>
            &nbsp;&nbsp;&nbsp;
            <div className="file-link">File 1</div>
          </div>
        </div>
      </div>

      <div className="divide-message"/>

      <div className="message-box">
        <div className="header">
          <div className="icon-holder">
            <div className="icon">
              <img/>
            </div>
            <div className="header-text">Danie who doesn't like 90</div>
          </div>
          <div className="time-text">04:48p.m.</div>
        </div>
        <div className="text-holder">
          <div className="text-message">
            <a>http://stg.soqqle.com</a>
          </div>
          <div>
            <img src={messageTemp}/>
          </div>
        </div>
      </div>
      <div className="divide-message"/>

      <div className="message-box">
        <div className="header">
          <div className="icon-holder">
            <div className="icon">
              <img/>
            </div>
            <div className="header-text">Danie who doesn't like 90</div>
          </div>
          <div className="time-text">04:48p.m.</div>
        </div>
        <div className="text-holder">
          <div>
            <img src={messageTemp}/>
          </div>
        </div>
      </div>
      <div className="divide-message">
        <div className="new-message">
          NEW MESSAGE
        </div>
      </div>

      <div className="message-box">
        <div className="header">
          <div className="icon-holder">
            <div className="icon">
              <img/>
            </div>
            <div className="header-text">Danie who doesn't like 90</div>
          </div>
          <div className="time-text">04:48p.m.</div>
        </div>
        <div className="text-holder">
          <div className="text-message">
            But i must <span className="hasTag-text">#explain</span> to <span className="name-text">@Daniel</span> how all this mistaken idea of <span className="hasTag-text">#denouncing</span> pleasure and
          </div>
        </div>
      </div>
      <div className="divide-message"/>

    </div>
  )
}

export default ChatMessageHolder;
