import React from 'react';
import FlightCard from './FlightCard.js'
import Spinner from'./Spinner.js'

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shift: 2,
        }
    }

    showMore = () => {
        const shift = this.state.shift + 2
        this.setState({shift: shift})
    }

    render() {
        const flights = this.props.flights.slice(0, this.state.shift);
        if (this.props.isLoading) return <Spinner />
        if (flights.length === 0) return (
        <div className="main-section">
            <div className="no-search-results"><h1>ничего не найдено...</h1></div>
        </div> 
        ) 
        return (
            <div className="main-section">
            {flights.map(el=> <FlightCard flight={el.flight} key={el.flightToken}/>)}
            <button className="show-more" onClick={this.showMore}>
                Показать еще
            </button>
            </div>
        )
    }
}