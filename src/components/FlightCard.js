import React from "react"

function  getFlightTime (departure, arrival) {
    const diff = arrival-departure;
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.round(((diff % 86400000) % 3600000) / 60000);
    return `${hours} ч ${minutes} мин`
}

function formatTime (date) {
    const hrs = `0${date.getHours()}`.slice(-2)
    const min =`0${date.getMinutes()}`.slice(-2)
    return `${hrs}:${min}`
}

function formatTransfers(num) {
    switch (num) {
        case num = 0:
            return
        case num = 1:
            return '1 пересадка'
        case num = 2:
            return '2 пересадки'
        case num > 2:
            return '3 или более пересадок'
    }
}

function outboundFlight (flight) {
    const lastPoint = flight.legs[0].segments.length - 1
    const start = flight.legs[0].segments[0];
    const finish = flight.legs[0].segments[lastPoint];

    const departureDate = new Date(start.departureDate)
    const arrivalDate = new Date(finish.arrivalDate)

    const transfersClass = lastPoint===0 ? 'transfers invisible' : 'transfers'
    
    const table = (
        <div>
            <div className="flight-route">
                <p>
                    {start.departureCity.caption}, {start.departureAirport.caption} 
                    <span className="blue-thin"> ({start.departureAirport.uid}) &#8594; </span>
                    {finish.arrivalCity?.caption}, {finish.arrivalAirport.caption}
                    <span className="blue-thin"> ({finish.arrivalAirport.uid})</span>
                
                </p>
            </div>
            <div className="flight-time">
                <p>
                    
                    {formatTime(departureDate)} 
                    <span className="blue-thin"> {departureDate.toLocaleString('ru', {  weekday: 'short', day: 'numeric', month: 'short' }) }</span>
                </p>
                <p>
                    &#128339; {getFlightTime(departureDate, arrivalDate)}
                </p>
                <p>
                    <span className="blue-thin">{arrivalDate.toLocaleString('ru', {  weekday: 'short', day: 'numeric', month: 'short' }) } </span>
                    {arrivalDate.getHours()}:{arrivalDate.getMinutes().toLocaleString('ru', {hours: "2-digit", minute: "2-digit"})} 
                </p>
            </div>
            <div className="flight-info">
                <div>
                    <span className="stripe"><span className={transfersClass}>{formatTransfers(lastPoint)}</span></span> 
                </div>
                <div>
                    <p className="company-description">Рейс выполняет: {flight.carrier.caption}</p>
                </div>
            </div>
        </div>
    )

    return table
}

function returnFlight (flight) {
    const lastPoint = flight.legs[1].segments.length - 1
    const start = flight.legs[1].segments[0];
    const finish = flight.legs[1].segments[lastPoint];

    const departureDate = new Date(start.departureDate)
    const arrivalDate = new Date(finish.arrivalDate)

    const transfersClass = lastPoint===0 ? 'transfers invisible' : 'transfers'
    
    const table = (
        <div>
            <div className="flight-route">
                <p>
                    {start.departureCity?.caption}, {start.departureAirport.caption} 
                    <span className="blue-thin"> ({start.departureAirport.uid}) &#8594; </span>
                    {finish.arrivalCity.caption}, {finish.arrivalAirport.caption}
                    <span className="blue-thin"> ({finish.arrivalAirport.uid})</span>
                
                </p>
            </div>
            <div className="flight-time">
                <p>
                    
                    {formatTime(departureDate)} 
                    <span className="blue-thin"> {departureDate.toLocaleString('ru', {  weekday: 'short', day: 'numeric', month: 'short' }) }</span>
                </p>
                <p>
                    &#128339; {getFlightTime(departureDate, arrivalDate)}
                </p>
                <p>
                    <span className="blue-thin">{arrivalDate.toLocaleString('ru', {  weekday: 'short', day: 'numeric', month: 'short' }) } </span>
                    {arrivalDate.getHours()}:{arrivalDate.getMinutes().toLocaleString('ru', {hours: "2-digit", minute: "2-digit"})} 
                </p>
            </div>
            <div className="flight-info">
                <div>
                    <span className="stripe"><span className={transfersClass}>{formatTransfers(lastPoint)}</span></span> 
                </div>
                <div>
                    <p className="company-description">Рейс выполняет: {start.airline.caption}</p>
                </div>
            </div>
        </div>
    )

    return table
}

export default function FlightCard (props) {
    const { flight } = props;
    const company = flight.carrier.caption
    const img = (<img className="header-img" href="#" alt={company}></img>)
    const totalCost = flight.price.total.amount
    // console.log(flight)

    return (
        <div className="flight-card">
            <header className="flight-card--header">
                {img}
                <div>
                <p className="price">{totalCost}₽</p>
                <p className="description">Стоимость для одного взрослого пассажира</p>
                </div>
            </header>
            <div className="card--flight-description">
                {outboundFlight(flight)}
            </div>
            <div className="card--flight-description">
                {returnFlight(flight)}
            </div>
            <button className="button--select-flight">ВЫБРАТЬ</button>
        </div>
    )
}