import React, {Component} from 'react';
import VocabularyList from "../../components/VocabularyList/VocabularyList";
import Navigation from "../../components/Navigation/Navigation";
import './index.css'
import {Col, Row} from "antd";
import Footer from "../../components/Footer/Footer";

class VocabularyListFront extends Component {
    render() {
        return (
            <div>
                <Navigation current="vocabulary"/>
                <div id="vocabularyListFront">
                    <Row style={{marginTop: '20px'}}>
                        <Col span={2}/>
                        <Col span={20}>
                            <VocabularyList isBack={false}/>
                        </Col>
                        <Col span={2}/>
                    </Row>
                </div>
            </div>
        );
    }
}

export default VocabularyListFront;