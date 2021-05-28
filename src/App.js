import './App.css';
import * as data from './flights.json';
import FiltersPanel from './components/FiltersPanel.js';
import MainPage from './components/MainPage.js';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      allFlights: data.result.flights,
      allCompanies: {},
      filtered: data.result.flights,
      sortedBy: '',
      minPrice: '',
      maxPrice: '',
      transfers: [],
      selectedCompanies: [],
      options: {},
    }
  }

  createFlightsList = () => { 
    const allCompanies = {};
    data.result.flights.forEach(el => { 
      const company = el.flight.carrier.caption
      allCompanies[company] = true;
    })
    this.setState({
      allCompanies: allCompanies,
      loading: false,
    })
  }

  componentDidMount = () => {
    this.createFlightsList();
    this.setState({
      filtered: this.state.allFlights
    })
  }

  // Тут все зависит от условий: 
  // ищем рейсы ТОЛЬКО с одной пересадкой в обе стороны? 
  // с одной пересадкой в одну из сторон?
  // включает ли выдача по запросу "с 1 пересадкой" результаты без пересадок?

  // я реализовал фильтрацию по принципу:
  // "условие применияется при соответствии хотя бы в одном из вариантов"
  isFlightMatchesOptions = (flight) => { 
    const keys = Object.keys(this.state.options); 
    return keys.every(option => {
      if(this.state.options[option] == false) return true;
      switch(option) {
        case 'minPrice':  
          return Number(flight.price.total.amount) >= Number(this.state.minPrice);
        case 'maxPrice':  
          return Number(flight.price.total.amount) <= Number(this.state.maxPrice);
        case 'transfers':
          const res = (
            this.state.transfers
            .some(elem => flight.legs
            .every(leg => leg.segments.length - 1 === Number(elem)))
          )
          return res
        case 'companies':
          const company = flight.carrier.caption;

          return this.state.selectedCompanies.some(elem => elem === company)
        default:
          return true;
      }
    })
  }

  matchedCompanies = () => {
    const companies = {...this.state.allCompanies};
    Object.keys(companies).forEach(comp=>companies[comp] = false)
    //выбираем для прохода только true-опции
    const options = Object.keys(this.state.options); 
    //перебираем все рейсы
    this.state.allFlights.forEach(obj=>{
      const flight = obj.flight;
      const matches = (
        options.every(option => {
          if(this.state.options[option] == false) return true;
          switch (option) {
            case 'minPrice':
              return Number(flight.price.total.amount) >= Number(this.state.minPrice);
            case 'maxPrice':
              return Number(flight.price.total.amount) <= Number(this.state.maxPrice);
            case 'transfers':
              const res = (
                this.state.transfers
                  .some(elem => flight.legs
                    .every(leg => leg.segments.length - 1 === Number(elem)))
              )
              return res
            default:
              return true;
          }
        })
      )

      //фасетная фильтрация мне далась тяжело, вижу, что код трудно читаем и некрасив, кое-где дублируется,
      //и наверное можно вынести часть функций, снизить вложенность, чтобы было аккуратнее, 
      //но думаю, это выходит за рамки задания :)

      if (matches) {
        //если совпало - компания доступна в массиве объектов
        companies[(obj.flight.carrier.caption)] = true;
      }
    })
    return companies;
  }

  handleChanges = async () => {
    const filtered = await this.state.allFlights.filter(obj => this.isFlightMatchesOptions(obj.flight))
    const companies = await this.matchedCompanies()
    
    await this.setState({
      filtered: filtered,
      allCompanies: companies,
      loading: false,
    })

    console.log(this.state.allCompanies)
    this.sortByState()
  }

  findTimeOfWay = (flight) => {
    //Ох уж этот ваш апи...
    //1 сегмент
    const lastPointTo = flight.legs[0].segments.length - 1
    const departureTo = new Date(flight.legs[0].segments[0].departureDate);
    const arrivalTo = new Date(flight.legs[0].segments[lastPointTo].arrivalDate);
    //2 сегмент
    const lastPointFrom = flight.legs[1].segments.length - 1
    const departureFrom = new Date(flight.legs[1].segments[0].departureDate);
    const arrivalFrom = new Date(flight.legs[1].segments[lastPointFrom].arrivalDate);

    const sumOfDiffs = Number (arrivalTo-departureTo) + Number (arrivalFrom-departureFrom)
    return sumOfDiffs
  }

  sortByState = async () => {
    const filtered = [...this.state.filtered];
    let sorted;
    switch (this.state.sortedBy) {
      case 'lowerPrice':
        sorted = await filtered.sort((first, second) => Number (first.flight.price.total.amount) > Number (second.flight.price.total.amount) ? 1: -1 );
        break;
      case 'higherPrice':
        sorted = await filtered.sort((first, second) => Number(second.flight.price.total.amount) > Number(first.flight.price.total.amount) ? 1: -1);
        break;
      case 'duration':
        sorted = await filtered.sort((first, second) => {
          return this.findTimeOfWay(first.flight) > this.findTimeOfWay(second.flight) ? 1 : -1          
        })
        break;
      default:
        return; 
    }
    await this.setState({ 
      filtered: sorted, 
      loading: false, 
    })
  }

  sortBy = async (elem) => {
    await this.setState({
      loading: true,
      sortedBy: elem
    })

    this.sortByState()
  }

  setMaxPrice = async (e) => { 
    const value = e.target.value;
    const options = { ...this.state.options }
    value === '' ? 
      options.maxPrice = false :
      options.maxPrice = true ;

    await this.setState({
      maxPrice: value,
      loading: true,
      options: options,
    })
    await this.handleChanges();
  }

  setMinPrice = async (e) => {
    const value = e.target.value;
    const options = { ...this.state.options }
    value === '' ? 
      options.minPrice = false :
      options.minPrice = true ;
    await this.setState({
      minPrice: value,
      loading: true,
      options: options,
    })
    await this.handleChanges();
  }

  selectTransfers = async (value) => {
    const options = { ...this.state.options }
    let transfers = [...this.state.transfers ]
    transfers.includes(value) ? 
      transfers = transfers.filter(el => el != value):
      transfers.push(value) ;
    transfers.length === 0 ? 
      options.transfers = false :
      options.transfers = true ;

    await this.setState({
      options: options,
      transfers: transfers,
    })
    await this.handleChanges();
  }

  selectCompany = async (value) => { 
    const options = { ...this.state.options }
    let companies = [...this.state.selectedCompanies ]
    companies.includes(value) ? 
      companies = companies.filter(el => el != value):
      companies.push(value) ;
    companies.length === 0 ? 
      options.companies = false :
      options.companies = true ;

    await this.setState({
      options: options,
      selectedCompanies: companies,
    })
    await this.handleChanges();
  }

  render() {
    return (
      <div className="App">
        <FiltersPanel
          onSelectCompany={this.selectCompany}
          onSetMinPrice={this.setMinPrice}
          onSetMaxPrice={this.setMaxPrice}
          onSelectTransfers={this.selectTransfers}

          allCompanies={this.state.allCompanies}
          sortedBy={this.state.sortedBy}
          minPrice={this.state.minPrice}
          maxPrice={this.state.maxPrice}
          transfers={this.state.transfers}
          selected={this.state.selectedCompanies}
          onSortBy={this.sortBy}
        /> 
        <MainPage 
          flights={this.state.filtered}
          isLoading={this.state.loading}
        >

        </MainPage>
      </div>
    );
  }
}

export default App;
