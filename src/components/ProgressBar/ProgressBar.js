import React, {Component} from 'react';
import {Progress} from "antd";
import './index.css'
import $ from 'jquery'

class ProgressBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: 0,
            isInit: true
        }
    }

    componentWillUnmount() {
        this.setState({
            percent: 0
        })
    }

    componentDidMount() {
        const _this = this
        window.addEventListener('scroll', () => {
            if (_this.state.isInit) {
                _this.setState({
                    isInit: false,
                    percent: 0
                })
                return
            }
            let percent = $(window).scrollTop() / ($(document).height() - $(window).height()) * 100
            // 适配进度条滚到底还不是100%
            percent = percent < 99.9 ? percent : 100
            _this.setState({
                percent: percent
            })
        }, false)
        this.setState({
            percent: 0,
        })
    }


    render() {
        return (
            <div>
                <Progress strokeLinecap="square" id="progressBar" percent={this.state.percent} showInfo={false}/>
            </div>
        );
    }
}

export default ProgressBar;