import React, {Component} from 'react';
import {Progress} from "antd";
import './index.css'
import $ from 'jquery'

class ProgressBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: 0
        }
    }

    componentDidMount() {
        const _this = this
        let percent = $(window).scrollTop() / ($(document).height() - $(window).height()) * 100
        percent = percent < 99.9 ? percent : 100
        _this.setState({
            percent: percent
        })
        window.addEventListener('scroll', () => {
            let percent = $(window).scrollTop() / ($(document).height() - $(window).height()) * 100
            percent = percent < 99.9 ? percent : 100
            _this.setState({
                percent: percent
            })
        }, false)
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