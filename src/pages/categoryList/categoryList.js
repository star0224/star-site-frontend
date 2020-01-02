import React, {Component} from 'react';
import Category from "../../components/Category/Category";
import Navigation from "../../components/Navigation/Navigation";
import './index.css'
import {Row} from "antd";
import $ from "jquery"

class CategoryList extends Component {

    constructor(props) {
        super(props);
        console.log(props.match.params.id)
        this.state = {
            categoryId: props.match.params.id
        }
    }

    componentDidMount() {
        const width = $('#menu').height()
        const categoryListDOM = $('#categoryList').children('div:nth-child(2)').children('div').children('div').children('ul')
        $('#categoryList').children('div:nth-child(2)').css('top', width + 'px')
        categoryListDOM.height("calc(100vh - " + width + "px)")
    }

    render() {
        return (
            <div id="categoryList">
                <Row>
                    <Navigation current="category"/>
                </Row>
                <Row>
                    {
                        this.state.categoryId !== undefined ?
                            <Category isBackStage={false} categorySelectedKeys={this.state.categoryId}/> :
                            <Category isBackStage={false} categorySelectedKeys="all_category"/>
                    }
                </Row>
            </div>
        );
    }
}

export default CategoryList;