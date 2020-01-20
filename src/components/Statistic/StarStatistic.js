import React, {Component} from 'react';
import {Card, Col, Divider, Row, Statistic} from "antd";
import './index.css'

class StarStatistic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            articleTotal: 100,
            articleDay: 1,
            articleWeek: 19,
            articleMonth: 24
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col id="articleStatisticCol" span={8}>
                        <Statistic id="articleStatisticTotal" title="总计 Total" value={this.state.articleTotal} suffix="篇"/>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col id="articleStatisticCol" span={8}>
                        <div id="articleStatistic">
                            <Statistic title="今日" value={"+ " + this.state.articleDay} suffix="篇"/>
                            <span></span>
                            <Statistic title="本周" value={"+ " + this.state.articleWeek} suffix="篇"/>
                            <span></span>
                            <Statistic title="当月" value={"+ " + this.state.articleMonth} suffix="篇"/>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default StarStatistic;