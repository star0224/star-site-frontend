import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import './index.css'

class Footer extends Component {

    render() {
        return (
            <footer id="footer">
                <div>
                    Made with
                    <span style={{color: "rgb(255, 255, 255)"}}> ❤ </span>
                    by
                    <NavLink to="/"> Star</NavLink>
                </div>
                <div>Created ©2019 励世邦 皖ICP备20001119号</div>
            </footer>
        );
    }
}

export default Footer;