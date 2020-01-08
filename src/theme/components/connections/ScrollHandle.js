import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Spinner from '~/src/theme/components/homepage/Spinner';
class ScrollHandle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      positionY: -1,
    }
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(e) {
    if(this.props.progress || !this.props.active) return;
    const windowHeight = document.querySelector('body').offsetHeight;
    const visibleScreen = window.pageYOffset + windowHeight + 50;
    if(this.element.offsetTop <= visibleScreen)  {
      // the scroll position falls inside the visible screen area
      this.props.onActive();
    }
  }

  render() {
    return (
      <div style={{ marginBottom: '100px' }}ref={(el) => { this.element = el; } }>
        {this.props.progress && <Spinner shown />}
      </div>
    );
  }
}

export default ScrollHandle;