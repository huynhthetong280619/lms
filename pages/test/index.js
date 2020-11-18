import React from 'react'
import { Progress } from 'antd';

class Test extends React.Component{

    render(){
        return <>
            <Progress percent={30} />
    <Progress percent={50} status="active" />
    <Progress percent={70} status="exception" />
    <Progress percent={100} />
        </>
    }
}

export default Test
