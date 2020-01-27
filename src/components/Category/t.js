import React, {Component} from 'react';
import {Button, Col, Divider, Icon, Input, Menu, Modal, notification, Row, Table} from "antd";
import axios from 'axios'
import {NavLink, withRouter} from "react-router-dom";
import Highlighter from 'react-highlight-words';
import './index.css'
import $ from 'jquery'
import Footer from "../Footer/Footer";


class Category extends Component {

    isDeleteCategory = false
    deleteCategoryId

    constructor(props) {
        super(props);
        this.state = {
            categorySelectedKeys: props.categorySelectedKeys,
            categoryList: [],
            articleList: [],
            isBackStage: props.isBackStage,
            confirmLoading: false,
            visible: false,
            searchText: '',
            searchedColumn: '',
            articleModalVisible: false,
            articleModalConfirmLoading: false,
            deleteArticleId: '',
            articleLoaded: false,
            categoryLoaded: false,
        }
    }

    componentDidMount() {
        const _this = this
        $('footer').css('background-color', '#000')
        $('footer').css('color', '#fff')
        axios.get(global.constants.server + "/article/category/list")
            .then((res) => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    _this.setState({
                        categoryList: res.data,
                        categoryLoaded: true
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
        if (this.state.categorySelectedKeys !== "all_category") {
            let target = "/article/category/?categoryId=" + this.state.categorySelectedKeys + "&isPublic=1"
            if (this.state.isBackStage) {
                target = "/article/category/?categoryId=" + this.state.categorySelectedKeys
            }
            axios.get(global.constants.server + target)
                .then((res) => {
                    res = JSON.parse(res.data)
                    if (res.status === 1) {
                        _this.setState({
                            articleList: res.data,
                            articleLoaded: true
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
        } else {
            let target = "/article/list/public?isPublic=1"
            if (this.state.isBackStage) {
                target = "/article/list"
            }
            axios.get(global.constants.server + target)
                .then((res) => {
                    res = JSON.parse(res.data)
                    if (res.status === 1) {
                        _this.setState({
                            articleList: res.data,
                            articleLoaded: true
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
            });
        }
    }

    redirect2ThisPage = () => {
        if (this.state.categorySelectedKeys === 'all_category') {
            this.props.history.push('/bk/category/list')
        } else {
            this.props.history.push('/bk/category/' + this.state.categorySelectedKeys)
        }
    }

    // 处理分类点击事件
    handleClick = (e) => {
        const _this = this
        if (_this.isDeleteCategory) {
            _this.isDeleteCategory = false
            _this.deleteCategoryId = e.key
            e.key = _this.state.categorySelectedKeys
            return
        }
        switch (e.key) {
            case 'all_category':
                _this.setState({
                    categorySelectedKeys: 'all_category'
                })
                let target = "/article/list/public?isPublic=1"
                if (this.state.isBackStage) {
                    target = "/article/list"
                }
                axios.get(global.constants.server + target)
                    .then((res) => {
                        res = JSON.parse(res.data)
                        if (res.status === 1) {
                            _this.setState({
                                articleList: res.data
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
                break
            default:
                _this.setState({
                    categorySelectedKeys: e.key
                })
                let targetUrl = "/article/category/?categoryId=" + e.key + "&isPublic=1"
                if (this.state.isBackStage) {
                    targetUrl = "/article/category/?categoryId=" + e.key
                }
                axios.get(global.constants.server + targetUrl)
                    .then((res) => {
                        res = JSON.parse(res.data)
                        if (res.status === 1) {
                            _this.setState({
                                articleList: res.data
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
                break
        }
    }

    // 提示框，确认是否删除
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    handleOk = () => {
        this.setState({
            confirmLoading: true
        })
        axios.get(global.constants.server + "/article/category/delete?id=" + this.deleteCategoryId)
            .then((res) => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    notification.open({
                        message: '请求成功',
                        description: '服务器返回信息： ' + res.msg
                    });
                    this.set
                    this.props.history.push('/bk/category/list')
                } else {
                    notification.open({
                        message: '请求失败',
                        description: '服务器返回信息： ' + res.msg
                    })
                }
                this.setState({
                    visible: false,
                    confirmLoading: false
                })
            }).catch((e) => {
            notification.open({
                message: '请求失败',
                description: '服务器无响应： ' + e
            })
            this.setState({
                visible: false,
                confirmLoading: false
            })
        })
    }

    // table搜索功能
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

        const IconText = ({type, text}) => (
            <span>
                <Icon type={type} style={{marginRight: 8}}/>
                {text}
            </span>
        );

        let title = () => {
            switch (this.state.categorySelectedKeys) {
                case 'all_category':
                    return '全部分类'
                default:
                    if (this.state.categoryList.length <= 0)
                        return
                    let selectedCategory = this.state.categoryList.find(text => text.id == this.state.categorySelectedKeys)
                    return selectedCategory !== undefined ? selectedCategory.name : ''
            }
        }

        const columns = [
            {
                title: title,
                dataIndex: 'title',
                key: 'title',
                width: '50%',
                ...this.getColumnSearchProps('title'),
                render: (text, record) => <NavLink to={"/article/" + record.id}>{text}</NavLink>
            }, {
                title: '日期',
                dataIndex: 'date',
                align: 'center',
                width: '25%',
                key: 'date',
                render: text => <IconText type="calendar" text={text} key="calendar"/>

            }, {
                title: '访问量',
                dataIndex: 'views',
                key: 'views',
                width: '25%',
                align: 'center',
                render: text => <IconText type="eye" text={text + " Views"} key="views"/>
            }
        ];
        const backColumns = [
            {
                title: title,
                dataIndex: 'title',
                key: 'title',
                width: '45%',
                ...this.getColumnSearchProps('title'),
                render: (text, record) => <NavLink to={"/bk/article/add/" + record.id}>{text}</NavLink>
            }, {
                title: 'Date',
                dataIndex: 'date',
                align: 'center',
                width: '15%',
                key: 'date',
                render: text => <IconText type="calendar" text={text} key="calendar"/>

            }, {
                title: 'Views',
                dataIndex: 'views',
                key: 'views',
                width: '15%',
                align: 'center',
                render: text => <IconText type="eye" text={text + " Views"} key="views"/>
            }, {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                width: '15%',
                align: 'center',
                render: (text, record) => {
                    if (record.isPublic === '1') {
                        return (
                            <span>
                                <a onClick={() => {
                                    axios.get(global.constants.server + "/article/update/public?id=" + record.id + "&isPublic=" + "0")
                                        .then(res => {
                                            res = JSON.parse(res.data)
                                            if (res.status === 1) {
                                                notification.open({
                                                    message: '请求成功',
                                                    description: '服务器返回信息： ' + res.msg
                                                });
                                                this.state.articleList[this.state.articleList.findIndex(item => item.id === record.id)].isPublic = '0'
                                                this.redirect2ThisPage()
                                            } else {
                                                notification.open({
                                                    message: '请求失败',
                                                    description: '服务器返回信息： ' + res.msg
                                                })
                                            }
                                        }).catch(e => {
                                        notification.open({
                                            message: '请求失败',
                                            description: '服务器无响应： ' + e
                                        })
                                    })
                                }} style={{color: '#1890ff'}}>Set Hidden</a>
                                <Divider type="vertical"/>
                                <a onClick={() => {
                                    this.setState({
                                        deleteArticleId: record.id,
                                        articleModalVisible: true
                                    })
                                }} style={{color: '#1890ff'}}>Delete</a>
                            </span>
                        )
                    } else {
                        return (
                            <span>
                                <a onClick={() => {
                                    axios.get(global.constants.server + "/article/update/public?id=" + record.id + "&isPublic=" + "1")
                                        .then(res => {
                                            res = JSON.parse(res.data)
                                            if (res.status === 1) {
                                                notification.open({
                                                    message: '请求成功',
                                                    description: '服务器返回信息： ' + res.msg
                                                });
                                                this.state.articleList[this.state.articleList.findIndex(item => item.id === record.id)].isPublic = '1'
                                                this.redirect2ThisPage()
                                            } else {
                                                notification.open({
                                                    message: '请求失败',
                                                    description: '服务器返回信息： ' + res.msg
                                                })
                                            }
                                        }).catch(e => {
                                        notification.open({
                                            message: '请求失败',
                                            description: '服务器无响应： ' + e
                                        })
                                    })
                                }} style={{color: '#1890ff'}}>Set Public</a>
                                <Divider type="vertical"/>
                                <a onClick={() => {
                                    this.setState({
                                        deleteArticleId: record.id,
                                        articleModalVisible: true
                                    })
                                }} style={{color: '#1890ff'}}>Delete</a>
                            </span>
                        )
                    }
                }
            }
        ];

        return (
            <Row type="flex" align="center" justify="center">
                <Modal
                    title="Warning"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <p>确认是否删除该分类及其下所有文章</p>
                </Modal>
                <Modal
                    title="Warning"
                    visible={this.state.articleModalVisible}
                    onOk={(id) => {
                        this.setState({
                            articleModalConfirmLoading: true
                        })
                        axios.get(global.constants.server + "/article/delete?id=" + this.state.deleteArticleId)
                            .then((res) => {
                                res = JSON.parse(res.data)
                                if (res.status === 1) {
                                    notification.open({
                                        message: '请求成功',
                                        description: '服务器返回信息： ' + res.msg
                                    });
                                    this.state.articleList.splice(this.state.articleList.findIndex(item => item.id === this.state.deleteArticleId), 1)
                                    this.redirect2ThisPage()
                                } else {
                                    notification.open({
                                        message: '请求失败',
                                        description: '服务器返回信息： ' + res.msg
                                    })
                                }
                                this.setState({
                                    articleModalVisible: false,
                                    articleModalConfirmLoading: false
                                })
                            }).catch((e) => {
                            notification.open({
                                message: '请求失败',
                                description: '服务器无响应： ' + e
                            })
                            this.setState({
                                articleModalVisible: false,
                                articleModalConfirmLoading: false
                            })
                        })
                    }}
                    confirmLoading={this.state.articleModalConfirmLoading}
                    onCancel={() => {
                        this.setState({
                            articleModalVisible: false
                        })
                    }}
                >
                    <p>确认是否删除该文章</p>
                </Modal>
                <Col span={4}>
                    <Menu
                        id="categoryMenu"
                        onClick={this.handleClick}
                        style={{
                            paddingTop: '5px',
                            overflowY: 'scroll',
                            scrollbarWidth: 'none',
                            overflowX: 'hidden',
                            backgroundColor: '#f5f5f9'
                        }}
                        defaultSelectedKeys={[this.state.categorySelectedKeys]}
                        mode="inline">
                        <Menu.Item key="all_category">
                            全部分类
                        </Menu.Item>
                        <Divider style={{margin: "-3px 0px 10px 0px"}}/>
                        {this.state.categoryList.map(item => {
                            if (this.state.isBackStage) {
                                return (
                                    <Menu.Item key={item.id}>
                                        {item.name}
                                        <Icon type="close-circle" style={{
                                            position: 'absolute',
                                            marginLeft: '15px',
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}
                                              onClick={() => {
                                                  this.setState({
                                                      visible: true,
                                                  })
                                                  this.isDeleteCategory = true
                                              }}
                                        />
                                    </Menu.Item>
                                )
                            } else {
                                return (
                                    <Menu.Item key={item.id}>
                                        {item.name}
                                    </Menu.Item>
                                )
                            }
                        })}
                    </Menu>
                </Col>
                <Col span={20}>
                    {!this.state.articleLoaded ?
                        <div>
                            <Row style={{height: '80vh'}} type="flex" justify="center" align="middle">
                                <span style={{top: '-4px'}} id='teamcity'></span>
                                <h2 style={{marginLeft: '10px'}}>正在加载，请稍等~</h2>
                            </Row>
                        </div>
                        : <Table columns={this.state.isBackStage ? backColumns : columns}
                                 dataSource={this.state.articleList}/>}
                </Col>
                {this.state.isBackStage ? "" : <Footer/>}
            </Row>
        );
    }
}

export default withRouter(Category);