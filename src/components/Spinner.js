import React from "react";
import spinner from './spinner.svg';

export default class Spinner extends React.Component {
    render() {
        return (
            <div className="loader-container">
                <img src={spinner} alt="Подождите, данные загружаются" className="loader-img" />
            </div>
        )
    }
}