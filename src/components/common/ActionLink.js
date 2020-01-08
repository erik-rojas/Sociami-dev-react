import React, { Component } from 'react';

class ActionLink extends React.Component {
  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
  }
  render() {
    const className = this.props.className ? this.props.className : '';
    const styleTag = this.props.style ? this.props.style : {};
    const tagId = this.props.id ? this.props.id : '';
    const tagAriaControls = this.props['aria-controls'] ? this.props['aria-controls'] : '';
    const tagRole = this.props.role ? this.props.role : '';
    const tagDataToggle = this.props['data-toggle'] ? this.props['data-toggle'] : '';
    const tagHref = this.props.href ? this.props.href : '';

    return <a {...this.props}>{this.props.children}</a>;
  }
}

export default ActionLink;
