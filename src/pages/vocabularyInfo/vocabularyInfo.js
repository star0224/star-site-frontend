import React, {Component} from 'react';
import axios from "axios";
import {Breadcrumb, Button, Col, DatePicker, Icon, Input, notification, Row, Spin, Table} from "antd";
import Highlighter from "react-highlight-words";
import Navigation from "../../components/Navigation/Navigation";
import locale from "antd/es/date-picker/locale/zh_CN";
import moment from "moment";
import {NavLink} from "react-router-dom";

class VocabularyInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            vocabulary: [],
            loaded: false,
            date: props.match.params.id.substring(0, 4) + '-' + props.match.params.id.substring(4, 6) + '-' + props.match.params.id.substring(6, 8),
            loadAll: false
        }
    }

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        if (this.state.date.indexOf('all') !== -1) {
            this.setState({
                loadAll: true
            })
            this.loadAll()
        } else {
            axios.get(global.constants.server + '/vocabulary/date?date=' + this.state.date)
                .then(res => {
                    res = JSON.parse(res.data)
                    if (res.status === 1) {
                        if (res.data.length === 0) {
                            this.loadAll()
                        } else {
                            this.setState({
                                vocabulary: res.data,
                                loaded: true
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
    }

    loadAll = () => {
        axios.get(global.constants.server + '/vocabulary/all/info')
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    this.setState({
                        vocabulary: res.data,
                        loaded: true,
                        loadAll: true
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


    render() {
        const columns = [
            {
                title: '英文',
                dataIndex: 'english',
                key: 'english',
                width: '33%',
                ...this.getColumnSearchProps('english'),
            },
            {
                title: '中文',
                dataIndex: 'chinese',
                key: 'chinese',
                width: '33%',
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
                width: '33%',
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
        ]

        return (
            <div>
                <Navigation current='vocabulary'/>
                <div style={{
                    top: '55px',
                    position: 'absolute',
                    width: '100%',
                    padding: '20px',
                }}>
                    <Row style={{marginTop: '10px'}}>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <NavLink style={{color: 'rgba(0, 0, 0, 0.45)'}} to="/">Home</NavLink>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <NavLink style={{color: 'rgba(0, 0, 0, 0.45)'}} to="/vocabulary">
                                    词汇
                                </NavLink>
                            </Breadcrumb.Item>
                            {this.state.loaded ? (
                                <Breadcrumb.Item>
                                    {this.state.loadAll ?
                                        (<span style={{color: 'rgba(0, 0, 0, 0.45)'}}>all
                                    </span>)
                                        : (<span style={{color: 'rgba(0, 0, 0, 0.45)'}}>{this.state.date}
                                    </span>)}
                                </Breadcrumb.Item>
                            ) : ''}
                        </Breadcrumb>
                    </Row>
                    <Row style={{marginTop: '30px'}}>
                        <Col>
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
                                        this.state.loadAll ? "" :
                                            <DatePicker locale={locale}
                                                        defaultValue={moment(this.state.date)}
                                                        value={moment(this.state.date)}
                                                        onChange={(date, dateString) => {
                                                            this.setState({
                                                                date: dateString,
                                                                loaded: false
                                                            }, () => this.getData())
                                                        }}/>
                                    )}
                                    pagination={{
                                        current: this.state.current,
                                        pageSize: 6,
                                        onChange: (page, pageSize) => {
                                            this.setState({current: page})
                                        }
                                    }}
                                    bordered
                                    style={{
                                        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.2)',
                                        borderRadius: '20px',
                                        padding: '30px 30px 5px 30px',
                                        backgroundColor: 'rgba(255,255,255,0.5)'
                                    }}
                                    columns={columns} dataSource={this.state.vocabulary}/>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default VocabularyInfo;