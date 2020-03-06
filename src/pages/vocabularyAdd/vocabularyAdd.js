import React, {Component} from 'react';
import NavigationBack from "../../components/Navigation_Back/NavigationBack";
import {Button, Card, Col, DatePicker, Icon, Input, notification, Row, Spin, Table} from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";
import moment from "moment";
import './index.css'
import {sha256} from "js-sha256";
import Highlighter from 'react-highlight-words';
import $ from 'jquery'
import axios from "axios";

// 拓展Date格式化功能
Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

class VocabularyAdd extends Component {

    constructor(props) {
        super(props);

        this.state = {
            input: '',
            output: '',
            phonetic: '',
            explains: [],
            inputSpeakUrl: '',
            isTranslate: false,
            vocabulary: [],
            current: 1,
            loaded: false,
            date: props.match.params.id === undefined ? new Date().format('yyyy-MM-dd') : props.match.params.id.substring(0, 4) + '-' + props.match.params.id.substring(4, 6) + '-' + props.match.params.id.substring(6, 8),
            isUpdate: props.match.params.id === undefined ? false : true
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        axios.get(global.constants.server + '/vocabulary/date?date=' + this.state.date)
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    if (res.data.length > 0) {
                        this.setState({
                            vocabulary: res.data,
                            loaded: true,
                            isUpdate: true
                        })
                    } else {
                        this.setState({
                            vocabulary: res.data,
                            loaded: true,
                            isUpdate: false
                        })
                    }
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

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon="search"
                    size="small"
                    style={{width: 90, marginRight: 8}}
                >
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({searchText: ''});
    };

    truncate = (q) => {
        let len = q.length;
        return len <= 20 ? q : q.substring(0, 10) + len + q.substring(len - 10, len);
    }

    translate = () => {
        if (this.state.isTranslate) {
            notification.open({
                message: '已查询完毕'
            })
            return
        }
        if (this.state.input.match(/^\s*$/)) {
            notification.open({
                message: '查询信息不能为空'
            })
            return
        }
        const _this = this;
        let salt = new Date().getTime()
        let curtime = Math.round(new Date().getTime() / 1000)
        let sign = sha256(global.constants.appId + this.truncate(this.state.input) + salt + curtime + global.constants.appKey)
        let data = {
            q: this.state.input,
            appKey: global.constants.appId,
            salt,
            from: 'en',
            to: 'zh-CHS',
            sign,
            signType: 'v3',
            curtime
        }
        $.ajax({
            url: 'http://openapi.youdao.com/api',
            data,
            type: 'post',
            dataType: 'jsonp',
            success: function (data) {
                _this.setState({
                    output: data.translation[0],
                    phonetic: data.hasOwnProperty('basic') ? (data.basic !== null && data.basic.hasOwnProperty('phonetic') ? data.basic.phonetic.split(';')[0] : '') : '',
                    inputSpeakUrl: data.speakUrl,
                    isTranslate: true,
                    explains: data.hasOwnProperty('basic') ? (data.basic !== null && data.basic.hasOwnProperty('explains') ? data.basic.explains : '') : '',
                })
            }
        })
    }

    save2Table = () => {
        if (!this.state.isTranslate) {
            notification.open({
                message: '请先翻译'
            })
            return
        }
        this.state.vocabulary.push({
            english: this.state.input,
            chinese: this.state.output,
            phonetic: this.state.phonetic,
            date: this.state.date
        });
        this.setState({
            input: '',
            output: '',
            phonetic: '',
            inputSpeakUrl: '',
            isTranslate: false,
            explains: [],
            current: Math.ceil(this.state.vocabulary.length / 2)
        })
    }

    render() {

        const columns = [
            {
                title: '英文',
                dataIndex: 'english',
                key: 'english',
                width: '25%',
                ...this.getColumnSearchProps('english'),
            },
            {
                title: '中文',
                dataIndex: 'chinese',
                key: 'chinese',
                width: '25%',
                render: (text) => {
                    return (
                        <div>
                            {text}
                        </div>
                    )
                }
            },
            {
                title: '音标',
                dataIndex: 'phonetic',
                key: 'phonetic',
                width: '25%',
                render: (text) => {
                    return text === '' ? (
                        <div>
                            /
                        </div>
                    ) : (
                        <div>
                            [ {text} ]
                        </div>
                    )
                }
            },
            {
                title: '操作',
                key: 'action',
                width: '25%',
                render: (text, record, index) => (
                    <a onClick={() => {
                        let vocabulary = this.state.vocabulary
                        vocabulary.splice(index, 1)
                        this.setState({
                            vocabulary
                        })
                    }}>Delete</a>
                ),
            },
        ]

        return (
            <div>
                {this.state.isUpdate ?
                    <NavigationBack selectedKeys="vocabulary_update" openKeys="vocabulary"/> :
                    <NavigationBack selectedKeys="vocabulary_add" openKeys="vocabulary"/>
                }
                <div id="vocabularyAdd">
                    <Row style={{height: '20vh'}} type='flex' align='middle' justify='center'
                         style={{marginBottom: '50px'}}>
                        <Col span={3}/>
                        <Col span={7}>
                            <Card title="英文" headStyle={{height: '30px'}}
                                  style={{boxShadow: '0 1px 4px 0 rgba(0,0,0,0.37)', borderRadius: '10px'}}>
                                <Input allowClear
                                       onPressEnter={() => {
                                           if (!this.state.isTranslate) {
                                               this.translate()
                                           } else {
                                               this.save2Table()
                                           }
                                       }}
                                       value={this.state.input}
                                       onChange={(e) => {
                                           this.setState({
                                               input: e.target.value,
                                               output: '',
                                               phonetic: '',
                                               inputSpeakUrl: '',
                                               explains: [],
                                               isTranslate: false,
                                           })
                                       }}/>
                                {this.state.phonetic === '' ? '' : (
                                    <div style={{
                                        marginTop: '9px',
                                        fontSize: '16px',
                                        marginLeft: '2px',
                                        color: '#777'
                                    }}>{this.state.phonetic}</div>
                                )}
                                {!this.state.isTranslate ? '' : (
                                    <Icon onClick={() => {
                                        if (this.state.inputSpeakUrl !== '') {
                                            document.getElementById('inputSpeak').play()
                                        }
                                    }}
                                          type="customer-service"
                                          style={{cursor: 'pointer', marginTop: '13px', fontSize: '20px'}}/>
                                )}
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Icon id='vocabularyTranslateBtn' style={{
                                fontSize: '25px', position: 'relative', left: '89px'
                            }} type="swap" onClick={() => this.translate()}/>
                            <div>
                                <Icon type="down" style={{
                                    fontSize: '25px', position: 'relative', left: '89px', top: '20px', cursor: 'pointer'
                                }} onClick={() => {
                                    this.save2Table()
                                }}/>
                            </div>
                        </Col>
                        <Col span={7}>
                            <Card title="中文" headStyle={{height: '30px'}}
                                  style={{boxShadow: '0 1px 4px 0 rgba(0,0,0,0.37)', borderRadius: '10px'}}>
                                <Input value={this.state.output}/>
                                {this.state.explains.length === 0 ? '' : (
                                    <div style={{
                                        marginTop: '9px',
                                        fontSize: '16px',
                                        marginLeft: '2px',
                                        color: '#777'
                                    }}>{this.state.explains.map(item => {
                                        if (item.split('.').length > 1) {
                                            return (
                                                <div>
                                                    {item.split('.')[0] + '. '}
                                                    {item.split('.')[1].split('；').map((item, index, array) => {
                                                        return index === array.length - 1 ?
                                                            <span style={{cursor: 'pointer'}} onClick={() => {
                                                                this.setState({output: item.replace(' ', '')})
                                                            }}>{item}</span> :
                                                            <span style={{cursor: 'pointer'}} onClick={() => {
                                                                this.setState({output: item.replace(' ', '')})
                                                            }}>{item + '；'}</span>
                                                    })}
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div>
                                                    <span style={{cursor: 'pointer'}} onClick={() => {
                                                        this.setState({output: item.replace(' ', '')})
                                                    }}>{item}</span>
                                                </div>
                                            )
                                        }
                                    })}
                                    </div>
                                )}
                            </Card>
                        </Col>
                        <Col span={3}/>
                    </Row>
                    <Row>
                        <Col span={3}/>
                        <Col span={18}>
                            {!this.state.loaded ? (
                                <div>
                                    <Row style={{height: '50vh'}} type="flex" justify="center" align="middle">
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
                            ) : (
                                <Table
                                    title={() => (
                                        <DatePicker locale={locale}
                                                    defaultValue={moment(new Date().format("yyyy-MM-dd"))}
                                                    value={moment(this.state.date)}
                                                    onChange={(date, dateString) => {
                                                        this.setState({
                                                            date: dateString,
                                                            loaded: false
                                                        }, () => this.getData())
                                                    }}/>
                                    )}
                                    footer={() => (
                                        <Row type='flex' align='middle' justify='center'>
                                            <Button type='primary' onClick={() => {
                                                if (this.state.vocabulary.length === 0) {
                                                    notification.open({
                                                        message: '请输入想要保存的单词'
                                                    })
                                                    return
                                                }
                                                axios.post(global.constants.server + "/vocabulary/save/all", this.state.vocabulary)
                                                    .then(res => {
                                                        res = JSON.parse(res.data)
                                                        if (res.status === 1) {
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
                                                });
                                            }}>保存</Button>
                                        </Row>
                                    )}
                                    pagination={{
                                        current: this.state.current,
                                        pageSize: 3,
                                        onChange: (page, pageSize) => {
                                            this.setState({current: page})
                                        }
                                    }}
                                    bordered
                                    style={{
                                        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.37)',
                                        borderRadius: '10px',
                                        padding: '30px',
                                        backgroundColor: '#fff'
                                    }}
                                    columns={columns} dataSource={this.state.vocabulary}/>
                            )}
                        </Col>
                        <Col span={3}/>
                    </Row>
                </div>
                <audio id="inputSpeak" src={this.state.inputSpeakUrl} controls="controls"
                       hidden={true}></audio>
            </div>
        );
    }
}

export default VocabularyAdd;