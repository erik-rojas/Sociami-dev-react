import React, { Component } from 'react';
import { render } from 'react-dom';
import { Document, Page } from 'react-pdf';

import Axios from 'axios';

class Sample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: 'http://sociamibucket.s3.amazonaws.com/pdf/Latest%201110%20FTCHK%20Pitch.pdf',
      numPages: null,
    };

    this.onFileChange = this.onFileChange.bind(this);
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
  }

  componentWillMount() {
    this.fetchPdfDocument();
  }

  fetchPdfDocument() {
    Axios({
      method: 'get',
      url: 'http://sociamibucket.s3.amazonaws.com/pdf/Latest%201110%20FTCHK%20Pitch.pdf',
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then(response => this.handleFetchPdfDocument(response))
      .catch(error => this.handleFetchPdfDocumentError(error));
  }

  handleFetchPdfDocument(response) {
    const data = response.data;
    //this.setState({file: data});
  }

  handleFetchPdfDocumentError(error) {}

  onFileChange(event) {
    this.setState({
      file: event.target.files[0],
    });
  }

  onDocumentLoadSuccess({ numPages }) {
    this.setState({
      numPages,
    });
  }

  render() {
    const { file, numPages } = this.state;
    let that = this;
    return (
      <div className="Example">
        <div className="Example__container">
          <div className="Example__container__load" />
          <div className="Example__container__document">
            <Document file={file} onLoadSuccess={that.onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  onRenderSuccess={this.onPageRenderSuccess}
                  width={Math.min(800, document.body.clientWidth - 52)}
                />
              ))}
            </Document>
          </div>
        </div>
      </div>
    );
  }
}

export default Sample;
