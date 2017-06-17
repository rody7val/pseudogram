import React, { Component } from 'react';

class FileUpload extends Component {
	constructor () {
		super();
		this.state = {
      key: ""
    };
	}

	render () {
		return (
			<div>
				<progress value={this.props.uploadValue} max='100'>
					{this.props.uploadValue} %
				</progress>
				<input type='file' onChange={this.props.onUpload}/>
			</div>
		);
	}
}

export default FileUpload;
