import React, {Component} from 'react';
import {Button, Icon, notification, Popconfirm, Row, Spin, Table} from "antd";
import axios from "axios";
import {withRouter} from "react-router-dom";

class VocabularyList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vocabularyInfo: [],
            loaded: false,
            isBack: props.isBack,
            total: ''
        }
    }

    componentDidMount() {
        axios.get(global.constants.server + '/vocabulary/all')
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    let total = 0
                    res.data.map(item => {
                        total += item.vocabularyNum
                    })
                    this.setState({
                        vocabularyInfo: res.data,
                        loaded: true,
                        total
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
            })
        })
    }

    render() {
        const columnsBack = [
            {
                title: '日期',
                dataIndex: 'date',
                key: 'date',
                width: '33%',
                render: (text, record, index) => (
                    <a onClick={() => {
                        this.props.history.push('/bk/vocabulary/add/' + text.replace('-', '').replace('-', ''))
                    }}>{text}</a>
                ),
            },
            {
                title: '词汇数',
                dataIndex: 'vocabularyNum',
                key: 'vocabularyNum',
                width: '33%',
            },
            {
                title: '操作',
                key: 'action',
                width: '33%',
                render: (text, record, index) => (
                    <Popconfirm
                        title={"确定删除" + record.date + "的记录?"}
                        onConfirm={() => {
                            axios.get(global.constants.server + '/vocabulary/delete?date=' + record.date)
                                .then(res => {
                                    res = JSON.parse(res.data)
                                    if (res.status === 1) {
                                        let vocabularyInfo = this.state.vocabularyInfo
                                        vocabularyInfo.splice(index, 1)
                                        this.setState({
                                            vocabularyInfo,
                                        })
                                        notification.open({
                                            message: '请求成功',
                                            description: '服务器返回信息： ' + res.msg
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
                                })
                            })
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a>Delete</a>
                    </Popconfirm>
                ),
            },
        ]
        const columnsFront = [
            {
                title: '日期',
                dataIndex: 'date',
                key: 'date',
                width: '50%',
                render: (text) => (
                    <a onClick={() => {
                        this.props.history.push('/vocabularyInfo/' + text.replace('-', '').replace('-', ''))
                    }}>{text}</a>
                ),
            },
            {
                title: '词汇数',
                dataIndex: 'vocabularyNum',
                key: 'vocabularyNum',
                width: '50%',
            },
        ]

        return (
            <div>
                {!this.state.loaded ? (
                    <div>
                        <Row style={{height: '80vh'}} type="flex" justify="center" align="middle">
                            <Spin
                                indicator={<Icon type="loading"
                                                 style={{
                                                     fontSize: 24,
                                                     position: 'relative',
                                                     top: '0px',
                                                     marginRight: '10px'
                                                 }}
                                                 spin/>}/>
                            <h2 style={{marginLeft: '10px'}}>正在加载，请稍等~</h2>
                        </Row>
                    </div>
                ) : this.state.isBack ? (
                    <div>
                        <Button type='primary' style={{
                            width: '100%',
                            height: '100%',
                            marginBottom: '20px',
                            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.37)',
                            borderRadius: '10px'
                        }}>
                            <div style={{
                                position: 'absolute',
                                float: 'left',
                                margin: '10px 0px 30px 20px',
                                fontSize: '20px',
                            }}>
                                总计 <span style={{fontSize: '15px', fontWeight: '300'}}>Total</span>
                            </div>
                            <div style={{fontSize: '30px', padding: '15px'}}>
                                {this.state.total + ' '}
                                <span style={{fontSize: '20px', fontWeight: '300'}}>vocabularies</span>
                            </div>
                        </Button>
                        <Table bordered
                               style={{
                                   boxShadow: '0 1px 4px 0 rgba(0,0,0,0.37)',
                                   borderRadius: '10px',
                                   padding: '30px',
                                   backgroundColor: '#fff'
                               }}
                               pagination={{
                                   pageSize: 6,
                               }}
                               columns={columnsBack} dataSource={this.state.vocabularyInfo}>

                        </Table>
                    </div>) : (
                    <div>
                        <Button type='primary'
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    marginBottom: '20px',
                                    boxShadow: '0 1px 4px 0 rgba(0,0,0,0.37)',
                                    borderRadius: '10px'
                                }}
                                onClick={() => this.props.history.push('/vocabularyInfo/all')}>
                            <div style={{
                                position: 'absolute',
                                float: 'left',
                                margin: '10px 0px 30px 20px',
                                fontSize: '20px',
                            }}>
                                总计 <span style={{fontSize: '15px', fontWeight: '300'}}>Total</span>
                            </div>
                            <div style={{fontSize: '30px', padding: '15px'}}>
                                {this.state.total + ' '}
                                <span style={{fontSize: '20px', fontWeight: '300'}}>vocabularies</span>
                            </div>
                        </Button>
                        <Table bordered
                               style={{
                                   boxShadow: '0 1px 4px 0 rgba(0,0,0,0.37)',
                                   borderRadius: '10px',
                                   padding: '30px',
                                   backgroundColor: '#fff'
                               }}
                               pagination={{
                                   pageSize: 6,
                               }}
                               columns={columnsFront} dataSource={this.state.vocabularyInfo}>
                        </Table>
                    </div>)
                }
            </div>
        );
    }
}

export default withRouter(VocabularyList);