import React, {Component} from 'react';
import {Button, Col, Divider, Icon, Input, Menu, Modal, notification, Row, Table} from "antd";
import axios from 'axios'
import {NavLink} from "react-router-dom";
import Highlighter from 'react-highlight-words';
import './index.css'

class Category extends Component {

    constructor(props) {
        super(props);
        console.log(props.categorySelectedKeys)
        this.state = {
            categorySelectedKeys: props.categorySelectedKeys,
            categoryList: [],
            articleList: [],
            isBackStage: props.isBackStage,
            confirmLoading: false,
            visible: false,
            deleteId: '',
            searchText: '',
            searchedColumn: '',
        }
    }

    componentDidMount() {
        const _this = this
        axios.get(global.constants.server + "/article/category/list")
            .then((res) => {
                _this.setState({
                    categoryList: JSON.parse(res.data)
                })
            }).catch(e => {
            notification.open({
                message: '请求失败',
                description: '错误信息：' + e,
            });
        })
        if (this.state.categorySelectedKeys !== "all_category") {
            axios.get(global.constants.server + "/article/category/?categoryId=" + this.state.categorySelectedKeys)
                .then((res) => {
                    _this.setState({
                        articleList: JSON.parse(res.data)
                    })
                }).catch(e => {
                notification.open({
                    message: '请求失败',
                    description: '错误信息：' + e,
                });
            })
        } else {
            axios.get(global.constants.server + "/article/list")
                .then((res) => {
                    _this.setState({
                        articleList: JSON.parse(res.data)
                    })
                }).catch(e => {
                notification.open({
                    message: '请求失败',
                    description: '错误信息：' + e,
                });
            })
        }
    }

    handleClick = (e) => {
        const _this = this
        console.log(e.key)
        switch (e.key) {
            case 'all_category':
                _this.setState({
                    categorySelectedKeys: 'all_category'
                })
                axios.get(global.constants.server + "/article/list")
                    .then((res) => {
                        _this.setState({
                            articleList: JSON.parse(res.data)
                        })
                    }).catch(e => {
                    notification.open({
                        message: '请求失败',
                        description: '错误信息：' + e,
                    });
                })
                break
            default:
                _this.setState({
                    categorySelectedKeys: e.key
                })
                axios.get(global.constants.server + "/article/category/?categoryId=" + e.key)
                    .then((res) => {
                        _this.setState({
                            articleList: JSON.parse(res.data)
                        })
                    }).catch(e => {
                    notification.open({
                        message: '请求失败',
                        description: '错误信息：' + e,
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
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false
            })
        }, 2000)
    }

    // table搜索功能
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
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
                    break
                default:
                    if (this.state.categoryList.length <= 0)
                        return
                    let selectedCategory = this.state.categoryList.find(text => text.id == this.state.categorySelectedKeys)
                    return selectedCategory.name
                    break
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
                title: 'Date',
                dataIndex: 'date',
                align: 'center',
                width: '25%',
                key: 'date',
                render: text => <IconText type="calendar" text={text} key="calendar"/>

            }, {
                title: 'Views',
                dataIndex: 'views',
                key: 'views',
                width: '25%',
                align: 'center',
                render: text => <IconText type="eye" text={text + " Views"} key="views"/>
            }
        ];

        return (
            <Row>
                <Modal
                    title="Warning"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <p>确认是否删除</p>
                </Modal>
                <Col span={4}>
                    <Menu
                        id="categoryMenu"
                        onClick={this.handleClick}
                        style={{paddingTop: '5px', overflowY: 'scroll', scrollbarWidth: 'none', overflowX: 'hidden'}}
                        defaultSelectedKeys={[this.state.categorySelectedKeys]}
                        mode="inline">
                        <Menu.Item key="all_category">
                            全部分类
                        </Menu.Item>
                        <Divider style={{margin: "10px 0px 10px 0px"}}/>
                        {this.state.categoryList.map(item => {
                            if (this.state.isBackStage) {
                                return (
                                    <Menu.Item key={item.id}>
                                        {item.name}
                                        <Icon type="close-circle" style={{
                                            float: 'right',
                                            position: 'relative',
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}
                                              onClick={e => {
                                                  this.setState({
                                                      visible: true,
                                                      deleteId: item.id
                                                  })
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
                    <Table columns={columns} dataSource={this.state.articleList}/>
                </Col>
            </Row>
        );
    }
}

export default Category;