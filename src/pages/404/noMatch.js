import React, {Component} from 'react';
import Navigation from "../../components/Navigation/Navigation";
import './index.css'

class NoMatch extends Component {
    render() {
        return (
            <div>
                <Navigation current="category" />
                <div id="nomatch">
                    404 Not Found.
                </div>
            </div>
        );
    }
}

export default NoMatch;