/* author: Ribhararnus Pracutiar */

import React, { Component } from 'react';
import * as URL from 'url';


class LinkPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  hasMeta() {
    const { meta } = this.props;
    if (typeof meta === 'undefined') return false;
    if (Object.keys(meta).length > 0) return true

    return false;
  }

  linkSnippet() {
    const { meta } = this.props;
    const { image, title, description, url } = meta;
    const { hostname } = URL.parse(url);
    const refinedHostname = hostname.replace(/^www\./, '').toUpperCase();

    return (
      <div className="link-preview">
        <img src={image} />
        <h3 className="title">{title}</h3>
        <div className="description">{description}</div>
        <div>{ refinedHostname }</div>
      </div>
    );
  }

  render() {
    const { loader, isLoading } = this.props;
    const hasNoMeta = !this.hasMeta();

    if (isLoading) return loader;
    if (hasNoMeta) return <div />;
    return this.linkSnippet();
  }
}

export default LinkPreview;
