import React from 'react'
import { Row } from 'antd'
// import FileViewer from "react-file-viewer";

import dynamic from 'next/dynamic'
import './overwrite.css'

const FileViewer = dynamic(
    () => import('react-file-viewer'),
    { ssr: false }
)


class ViewOnline extends React.Component {

    state = {
        filePath: null,
        fileType: null
    }
    onError = e => {
        console.log(e, "error in file-viewer");
    };

    componentDidMount(){
        this.setState({
            filePath: this.props.detailFile.path,
            fileType: this.props.detailFile.type
        })
    }
    render() {

        console.log('detailFile', this.props.detailFile)
        return (
            <Row style={{
                width: '85%',
                textAlign: 'center',
                background: '#fff',
                minHeight: '20px',
                paddingBottom: 50,
                paddingTop: 50,
                margin: '0 auto',
                justifyContent: 'center'
            }}>
                <h1 style={{width: "100%"}}>{this.props.detailFile.name}</h1>
                <div style={{
                    fontFamily: 'sans-serif',
                    textAlign: 'center'
                }}>
                    <FileViewer fileType={this.state.fileType} filePath={this.state.filePath} onError={this.onError} />
                </div>
                
            </Row>

        )
    }
}

export default ViewOnline;