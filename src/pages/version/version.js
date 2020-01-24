import React, {Component} from 'react';
import NavigationBack from "../../components/Navigation_Back/NavigationBack";
import axios from 'axios'
import './index.css'
import $ from 'jquery'
import {Button, Icon, notification} from "antd";
import VersionInfo from "../../components/VersionInfo/VersionInfo";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

class Version extends Component {

    constructor(props) {
        super(props);
        this.state = {
            versionInfos: [],
            isVisible: false,
            isPlus: true,
        }
    }

    componentDidMount() {
        axios.get(global.constants.server + "/versionInfo/all")
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    this.setState({
                        versionInfos: res.data
                    })
                } else {
                    notification.open({
                        message: '请求失败',
                        description: '服务器返回信息： ' + res.msg
                    })
                }
            }).catch(e => {
            notification.open({
                message: '请求失败',
                description: '服务器无响应：' + e,
            });
        })
    }

    uploadVersionInfo = () => {
        let versionInfos = []

        $('#version .versionInfoDiv').each(function () {
            let versionInfo = []
            $(this).find('input').each(function () {
                versionInfo.push($(this).val())
            })
            if (versionInfo[0] === '') {
                notification.open({
                    message: '请输入版本号'
                })
                return
            }
            if (versionInfo[1] === '') {
                notification.open({
                    message: '请选择日期'
                })
                return
            }
            let version = versionInfo[0]
            let date = versionInfo[1]
            versionInfo.splice(0, 2)
            versionInfo.forEach(item => {
                versionInfos.push({
                    version,
                    date,
                    content: item
                })
            })
        })

        axios.post(global.constants.server + "/versionInfo/add", versionInfos)
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    notification.open({
                        message: '请求成功',
                        description: '服务器返回信息： ' + res.msg
                    })
                    window.location.reload()
                } else {
                    notification.open({
                        message: '请求失败',
                        description: '服务器返回信息： ' + res.msg
                    })
                }
            }).catch(e => {
            notification.open({
                message: '请求失败',
                description: '服务器无响应：' + e,
            })
        })

    }

    render() {
        return (
            <div>
                <ProgressBar/>
                <NavigationBack selectedKeys="version_detail" openKeys="version"/>
                <div id="version">
                    <div>
                        <Icon style={{marginLeft: '20px', fontSize: '25px'}} type="branches"/>
                        <h1 style={{display: 'inline-block', marginRight: '50px', marginLeft: '10px'}}>版本信息</h1>
                        {this.state.isPlus ?
                            <Button id="newVersionInfoBtn" style={{
                                position: 'relative',
                                top: '-4px',
                                backgroundColor: '#f5f5f9',
                            }} onClick={() => {
                                this.setState({isVisible: true, isPlus: false})
                            }}>
                                <Icon type="plus"/>
                            </Button> :
                            <Button id="deleteVersionInfoBtn" style={{
                                position: 'relative',
                                top: '-4px',
                                backgroundColor: '#f5f5f9',
                            }} onClick={() => {
                                this.setState({isVisible: false, isPlus: true})
                            }}>
                                <Icon type="minus"/>
                            </Button>
                        }
                        <Button style={{
                            position: 'relative',
                            top: '-4px',
                            backgroundColor: '#f5f5f9',
                            marginLeft: '20px'
                        }}
                                onClick={this.uploadVersionInfo}>
                            <Icon type="upload"/>
                        </Button>
                    </div>
                    {this.state.isVisible ?
                        <VersionInfo modifiable={false} version="" versionInfos={[""]} versionDate=""/> : ""}
                    {this.state.versionInfos.map(item => {
                        return <VersionInfo modifiable={true} version={item.version} versionInfos={item.contents}
                                            versionDate={item.date}/>
                    })}
                </div>
            </div>
        );
    }
}

export default Version;