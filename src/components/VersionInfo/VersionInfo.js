import React, {Component} from 'react';
import './index.css'
import {DatePicker, Divider, Icon, Input, Modal} from "antd";
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

class VersionInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            versionInfos: props.versionInfos,
            version: props.version,
            versionDate: props.versionDate,
            modifiable: props.modifiable,
            isDelete: false,
            visible: false
        }
    }

    addVersionContent = () => {
        let versionInfos = this.state.versionInfos
        versionInfos.push("")
        this.setState({
            versionInfos
        })
    }

    render() {

        return this.state.isDelete ? "" :
            (
                <div className="versionInfoDiv" style={{marginTop: '20px', marginLeft: '20px'}}>
                    <Input addonBefore={"V"} defaultValue={this.state.version} disabled={this.state.modifiable}
                           style={{width: '6vw', marginBottom: '20px', marginRight: '20px'}}
                           placeholder={"版本"}/>
                    <DatePicker locale={locale} disabled={this.state.modifiable} defaultValue={this.state.versionDate === "" ? "" : moment(this.state.versionDate, 'YYYY-MM-DD')} />
                    {!this.state.modifiable ? (
                        <button className="versionInfoBtn"
                                onClick={this.addVersionContent}>
                            <Icon type="plus-circle"/>
                        </button>) : ""}
                    {this.state.modifiable ? (
                        <button className="versionInfoBtn"
                                onClick={() => this.setState({modifiable: !this.state.modifiable})}>
                            <Icon type="form"/>
                        </button>) : ""}
                    {!this.state.modifiable && this.state.version !== "" ? (
                        <button className="versionInfoBtn"
                                onClick={() => this.setState({visible: true})}>
                            <Icon type="close-circle"/>
                        </button>) : ""}

                    {!this.state.modifiable ? (
                        <button className="versionInfoBtn"
                                onClick={() => this.setState({modifiable: !this.state.modifiable})}>
                            <Icon type="check-circle"/>
                        </button>) : ""}

                    {this.state.versionInfos.map((info, index, thisArr) => {
                        return (
                            <div>
                                <Input className="versionInfo" defaultValue={info} allowClear placeholder="版本更新内容"
                                       disabled={this.state.modifiable} onChange={value => {
                                    thisArr[index] = value
                                    this.setState({versionInfos: thisArr})
                                }}/>
                                {!this.state.modifiable ? (
                                    <button style={{top: '0px'}} className="versionInfoBtn" onClick={() => {
                                        thisArr.splice(index, 1)
                                        this.setState({versionInfos: thisArr})
                                    }}>
                                        <Icon type="minus-circle"/>
                                    </button>) : ""}
                            </div>
                        )
                    })}
                    <Divider/>
                    <Modal
                        title="Warning"
                        visible={this.state.visible}
                        onOk={() => {
                            this.setState({
                                visible: false,
                                isDelete: true
                            })
                        }}
                        onCancel={() => {
                            this.setState({
                                visible: false
                            })
                        }}
                    >
                        <p>是否确认删除</p>
                    </Modal>
                </div>
            )
    }
}

export default VersionInfo;