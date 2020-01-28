import React, {Component} from 'react';
import Navigation from "../../components/Navigation/Navigation";
import './index.css'
import axios from 'axios'
import {BackTop, Button, Col, Divider, Drawer, Icon, List, notification, Popover, Row, Tooltip} from "antd";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import {NavLink, withRouter} from "react-router-dom";
import Footer from "../../components/Footer/Footer";

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            archives: [],
            essays: [],
            categories: [],
            visible: false,
            articleDate: [
                [], [], [], [], [], [], []
            ],
            versionInfos: [{
                version: '',
                date: '',
                contents: []
            }],
            loaded: false
        }
    }

    componentDidMount() {
        const _this = this
        axios.get(global.constants.server + "/article/list/public?isPublic=1")
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    _this.setState({
                        archives: res.data
                    })
                } else {
                    notification.open({
                        message: '请求失败',
                        description: '服务器返回信息： ' + res.msg
                    })
                }
                this.generateActivities()
            }).catch(e => {
            notification.open({
                message: '请求失败',
                description: '服务器无响应：' + e,
            });
        })
        axios.get(global.constants.server + "/article/category/list")
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    this.setState({
                        categories: res.data
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

    generateActivities = () => {
        const year = new Date().getFullYear()
        // 获取今年第一天所在星期 firstWeek
        let firstDay = new Date(year, 0, 1)
        let firstWeek = []
        const firstDayIndex = firstDay.getDay()
        let firstWeekIndex = firstDayIndex
        while (firstWeekIndex < 7) {
            firstWeek[firstWeekIndex++] = new Date(year, 0, firstWeekIndex - firstDayIndex + 1).toLocaleDateString()
        }
        while (firstWeekIndex > 0) {
            firstWeek[firstWeekIndex--] = new Date(year, 0, firstWeekIndex - firstDayIndex + 1).toLocaleDateString()
        }

        // 获取今年最后一天所在星期 lastWeek
        let lastDay = new Date(year, 11, 31)
        let lastWeek = []
        const lastDayIndex = lastDay.getDay()
        let lastWeekIndex = lastDayIndex
        while (lastWeekIndex < 7) {
            lastWeek[lastWeekIndex++] = new Date(year, 11, lastWeekIndex - lastDayIndex + 31).toLocaleDateString()
        }
        while (lastWeekIndex > 0) {
            lastWeek[lastWeekIndex--] = new Date(year, 11, lastWeekIndex - lastDayIndex + 31).toLocaleDateString()
        }

        // 获取文章日期信息
        let articleActivity = new Map()
        this.state.archives.map(item => {
            let date = item.date.split("-")
            date = new Date(date[0], date[1] - 1, date[2])
            if (articleActivity.get(date.toLocaleDateString()) !== undefined) {
                articleActivity.set(date.toLocaleDateString(), articleActivity.get(date.toLocaleDateString()) + 1)
            } else {
                articleActivity.set(date.toLocaleDateString(), 1)
            }
            return item
        })

        // 按星期将全年分成七份
        let sun = [], mon = [], tue = [], wed = [], thu = [], fri = [], sat = []
        this.generateWeeksInYear(sun, firstWeek[1], lastWeek[1], articleActivity)
        this.generateWeeksInYear(mon, firstWeek[2], lastWeek[2], articleActivity)
        this.generateWeeksInYear(tue, firstWeek[3], lastWeek[3], articleActivity)
        this.generateWeeksInYear(wed, firstWeek[4], lastWeek[4], articleActivity)
        this.generateWeeksInYear(thu, firstWeek[5], lastWeek[5], articleActivity)
        this.generateWeeksInYear(fri, firstWeek[6], lastWeek[6], articleActivity)
        this.generateWeeksInYear(sat, firstWeek[7], lastWeek[7], articleActivity)
        this.setState({
            articleDate: [sun, mon, tue, wed, thu, fri, sat],
            loaded: true
        })
    }

    generateWeeksInYear = (weekArr, firstDay, lastDay, articleActivity) => {
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let tempDate = firstDay
        let articleNum = articleActivity.get(tempDate)
        weekArr.push({
            month: month[firstDay.split('/')[1] - 1],
            year: firstDay.split('/')[0],
            date: firstDay.split('/')[2],
            articleNum: articleNum === undefined ? 0 : articleNum
        })
        while (tempDate !== lastDay) {
            let tempDateArr = tempDate.split('/')
            tempDate = new Date(tempDateArr[0], tempDateArr[1] - 1, tempDateArr[2])
            tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + 7)
            articleNum = articleActivity.get(tempDate.toLocaleDateString())
            weekArr.push({
                month: month[tempDate.getMonth()],
                year: tempDate.getFullYear(),
                date: tempDate.getDate(),
                articleNum: articleNum === undefined ? 0 : articleNum
            })
            tempDate = tempDate.toLocaleDateString()
        }
    }

    generateActivitiesSquare = (item) => {
        switch (item.articleNum) {
            case 0:
                return (
                    <Tooltip key={item.month + "-" + item.date + "-" + item.year} mouseEnterDelay={0}
                             mouseLeaveDelay={0}
                             title={"No article on " + item.month + " " + item.date + ", " + item.year}>
                        <div className="square"></div>
                    </Tooltip>
                )
            case 1:
                return (
                    <Tooltip key={item.month + "-" + item.date + "-" + item.year} mouseEnterDelay={0}
                             mouseLeaveDelay={0}
                             title={item.articleNum + " article on " + item.month + " " + item.date + ", " + item.year}>
                        <div className="square"
                             style={{backgroundColor: '#c6e48b'}}></div>
                    </Tooltip>
                )
            case 2:
                return (
                    <Tooltip key={item.month + "-" + item.date + "-" + item.year} mouseEnterDelay={0}
                             mouseLeaveDelay={0}
                             title={item.articleNum + " article on " + item.month + " " + item.date + ", " + item.year}>
                        <div className="square"
                             style={{backgroundColor: '#7bc96f'}}></div>
                    </Tooltip>
                )
            case 3:
                return (
                    <Tooltip key={item.month + "-" + item.date + "-" + item.year} mouseEnterDelay={0}
                             mouseLeaveDelay={0}
                             title={item.articleNum + " article on " + item.month + " " + item.date + ", " + item.year}>
                        <div className="square"
                             style={{backgroundColor: '#239a3b'}}></div>
                    </Tooltip>
                )
            default:
                return (
                    <Tooltip key={item.month + "-" + item.date + "-" + item.year} mouseEnterDelay={0}
                             mouseLeaveDelay={0}
                             title={item.articleNum + " article on " + item.month + " " + item.date + ", " + item.year}>
                        <div className="square"
                             style={{backgroundColor: '#196127'}}></div>
                    </Tooltip>
                )
        }
    }

    render() {

        const contactContent = (
            <div>
                <Button style={{border: 'none', boxShadow: 'none'}}>
                    <a href="https://github.com/star0224" target="view_window">
                        <Icon type="github" theme="filled"/>
                    </a>
                </Button>
                <Popover content={(
                    <div>
                        <img style={{width: '20vw', height: '40vh'}} src={require('../../assets/wechat.jpg')}
                             alt="load error"/>
                    </div>
                )} trigger="hover" placement="right">
                    <Button style={{border: 'none', boxShadow: 'none'}}>
                        <Icon type="wechat" theme="filled"/>
                    </Button>
                </Popover>
            </div>
        )

        const IconText = ({type, text}) => (
            <span>
                <Icon type={type} style={{marginRight: 8}}/>
                {text}
            </span>
        );

        return (
            <div>
                <Drawer
                    width={350}
                    title={"Star's First Land V" + this.state.versionInfos[0].version}
                    placement="right"
                    closable={false}
                    onClose={() => this.setState({visible: false})}
                    visible={this.state.visible}
                >
                    <div>
                        {this.state.versionInfos.map(versionInfo => {
                            return (
                                <div>
                                    <h3 style={{display: 'inline'}}>{"V" + versionInfo.version}</h3>
                                    <span style={{marginLeft: '20px'}}>
                                        {versionInfo.date}
                                    </span>
                                    <Divider style={{margin: '10px 0px 10px 0px'}}/>
                                    <ul style={{listStyle: 'none', paddingLeft: '5px', marginBottom: '50px'}}>
                                        {versionInfo.contents.map(content => {
                                            return <li style={{marginBottom: '5px'}}>{content}</li>
                                        })}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </Drawer>

                <ProgressBar/>
                <BackTop/>
                <Navigation current="home"/>
                <div id="background"></div>
                <div id="blurBox">
                    <p className="enHomeTitle">Star's</p>
                    <p className="enHomeTitle">The First Lands —— The Placidium of Navori</p>
                    <h2 id="blurBoxTitle">Star的初生之土 —— 纳沃利的普雷西典</h2>
                    <p>
                        <Button onClick={() => this.setState({visible: true})}>What's New</Button>
                        <Button onClick={() => this.props.history.push('/category/list')}>Reading</Button>
                        <Popover content={contactContent} trigger="click" placement="right">
                            <Button type="primary">Contact Me</Button>
                        </Popover>
                    </p>
                </div>
                {!this.state.loaded ? (
                    <div style={{height: '100vh', position: 'absolute', top: '100vh', width: '100vw', backgroundColor: '#f6f6f6'}} >
                        <Row style={{height: '100vh'}} type="flex" justify="center" align="middle">
                            <span style={{top: '-4px'}} id='teamcity'></span>
                            <h2 style={{marginLeft: '10px'}}>正在加载，请稍等~</h2>
                        </Row>
                    </div>
                ) : (<div id="content">
                    <Row>
                        <Col span={4}></Col>
                        <Col span={15}>
                            <h3 style={{marginTop: '20px', fontWeight: 'normal', textAlign: 'left'}}>
                                <span id="teamcity"></span>
                                {this.state.archives.length} Articles in {new Date().getFullYear()}
                            </h3>
                            <ul id="activities">
                                <li>
                                    {
                                        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(item => {
                                            return (
                                                <div className="weekTitle" key={item}>{item}</div>
                                            )
                                        })
                                    }
                                </li>
                                <li>
                                    <div className="weekTitle">
                                    </div>
                                    {this.state.articleDate[0].map(this.generateActivitiesSquare)}
                                </li>
                                <li>
                                    <div className="weekTitle">
                                        Mon
                                    </div>
                                    {this.state.articleDate[1].map(this.generateActivitiesSquare)}
                                </li>
                                <li>
                                    <div className="weekTitle">
                                    </div>
                                    {this.state.articleDate[2].map(this.generateActivitiesSquare)}
                                </li>
                                <li>
                                    <div className="weekTitle">
                                        Wed
                                    </div>
                                    {this.state.articleDate[3].map(this.generateActivitiesSquare)}
                                </li>
                                <li>
                                    <div className="weekTitle">
                                    </div>
                                    {this.state.articleDate[4].map(this.generateActivitiesSquare)}
                                </li>
                                <li>
                                    <div className="weekTitle">
                                        Fri
                                    </div>
                                    {this.state.articleDate[5].map(this.generateActivitiesSquare)}
                                </li>
                                <li>
                                    <div className="weekTitle">
                                    </div>
                                    {this.state.articleDate[6].map(this.generateActivitiesSquare)}
                                </li>
                                <li style={{textAlign: 'right', marginTop: '8px', marginRight: '15px'}}>
                                    <div className="weekTitle">Less</div>
                                    <div className="square"></div>
                                    <div className="square"
                                         style={{backgroundColor: '#c6e48b'}}></div>
                                    <div className="square"
                                         style={{backgroundColor: '#7bc96f'}}></div>
                                    <div className="square"
                                         style={{backgroundColor: '#239a3b'}}></div>
                                    <div className="square"
                                         style={{backgroundColor: '#196127'}}></div>
                                    <div className="weekTitle">More</div>
                                </li>
                            </ul>
                        </Col>
                        <Col span={5}></Col>
                    </Row>
                    <Row>
                        <Col span={3}>
                        </Col>
                        <Col span={10}>
                            <div id="archives">
                                <h3>
                                    <Icon type="smile"/>
                                    Discovery
                                </h3>
                                <Divider dashed/>
                                <List
                                    itemLayout="vertical"
                                    size="large"
                                    pagination={{
                                        pageSize: 5,
                                    }}
                                    dataSource={this.state.archives}
                                    renderItem={item => (
                                        <List.Item
                                            key={item.title}
                                        >
                                            <List.Item.Meta
                                                title={<NavLink to={"/article/" + item.id}>{item.title}</NavLink>}
                                                description={(
                                                    <div id="archivesDesc">
                                                        <IconText type="calendar" text={item.date} key="calendar"/>
                                                        <IconText type="folder-open" text={item.category.name}
                                                                  key="category"/>
                                                        <IconText type="message" text={0 + " Comments"} key="message"/>
                                                        <IconText type="eye" text={item.views + " Views"} key="views"/>
                                                    </div>
                                                )}
                                            />
                                            {item.content}
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={6}>
                            <div id="essays">
                                <h3>
                                    <Icon type="unordered-list"/>
                                    Category
                                </h3>
                                <Divider dashed/>
                                <List
                                    split={false}
                                    dataSource={this.state.categories}
                                    renderItem={item => (
                                        <List.Item>
                                            <NavLink to={"/category/" + item.id}
                                                     style={{color: 'rgba(0, 0, 0, 0.65)'}}>
                                                <IconText type="folder" text={item.name}/>
                                            </NavLink>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Col>
                        <Col span={3}>
                        </Col>
                    </Row>
                    <Row style={{marginTop: '50px'}}>
                        <Footer/>
                    </Row>
                </div>)}
            </div>
        );
    }
}

export default withRouter(Home);