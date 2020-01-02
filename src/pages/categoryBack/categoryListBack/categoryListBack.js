import React, {Component} from 'react';
import NavigationBack from "../../../components/Navigation_Back/NavigationBack";
import './index.css'
import Category from "../../../components/Category/Category";


class CategoryListBack extends Component {
    render() {
        return (
            <div>
                <NavigationBack selectedKeys="category_list" openKeys="category"/>
                <div id="categoryListBack">
                    <Category isBackStage={true} categorySelectedKeys="all_category"/>
                </div>
            </div>
        );
    }
}

export default CategoryListBack;