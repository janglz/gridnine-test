import React from 'react';

export default class FiltersPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    handleOptionChange = (e) => {
        const value = e.target.getAttribute('value')
        this.props.onSortBy(value);
    }

    handleCheckbox = (e) => {
        const value = e.target.value;
        this.props.onSelectTransfers(value)
    }

    handleCompaniesChange = (e) => {
        const name = e.target.getAttribute('name')
        this.props.onSelectCompany(name)
    }

    render() {
        const { sortedBy, minPrice, maxPrice, selected } = this.props;
        const companies = Object.keys(this.props.allCompanies)
        const isDisabled = (company) =>{
            return this.props.allCompanies[company] === true
        }

        const companiesList = (
            companies.length > 0 ?
            companies.map(company => {
            
                return (
                    <div className="form-check" key={company}>
                        <label>
                            <input
                                disabled={!isDisabled(company)}
                                type="checkbox"
                                name={company}
                                value={selected.includes(company)}
                                onChange={this.handleCompaniesChange}
                                className={`form-text-input`}
                            /> 
                        <span  className={isDisabled(company) ? '' : 'disabled' }>
                        {company.slice(0,20)}  
                        </span>
                        </label>
                    </div>
                )
            }) : ''
        )

        return (
            <div className="search-panel">
                <form>
                    <h2>Сортировать</h2>
                    <div className="form-check">
                        <label>
                            <input
                                type="radio"
                                value="lowerPrice"
                                checked={sortedBy === "lowerPrice"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            /> 
                        По возрастанию цены
                        </label>
                    </div>
                    <div className="form-check">
                        <label>
                            <input
                                type="radio"
                                value="higherPrice"
                                checked={sortedBy === "higherPrice"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            />
                        По убыванию цены
                        </label>
                    </div>
                    <div className="form-check">
                        <label>
                            <input
                                type="radio"
                                value="duration"
                                checked={sortedBy === "duration"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            />
                        По времени в пути
                        </label>
                    </div>
                
                    <h2>Фильтровать</h2>
                    <div className="form-check">
                        <label>
                            <input
                                type="checkbox"
                                value="1"
                                //checked={transfers["1"]}
                                onChange={this.handleCheckbox}
                                className="form-check-input"
                            /> 
                        1 пересадка
                        </label>
                    </div>
                    <div className="form-check">
                        <label>
                            <input
                                type="checkbox"
                                value="0"
                                //checked={transfers["0"]}
                                onChange={this.handleCheckbox}
                                className="form-check-input"
                            /> 
                        без пересадок
                        </label>
                    </div>

                    <h2>Цена</h2>
                    <div className="form-text">
                        <label>
                            От
                            <input
                                type="text"
                                name="minPrice"
                                value={minPrice}
                                onChange={this.props.onSetMinPrice}
                                className="form-text-input"
                            /> 
                        </label>
                    </div>
                    <div className="form-check">
                        <label>
                            До
                            <input
                                type="text"
                                name="maxPrice"
                                value={maxPrice}
                                onChange={this.props.onSetMaxPrice}
                                className="form-text-input"
                            /> 
                        </label>
                    </div>

                    <h2>Авиакомпании</h2>
                    {companiesList}
                </form>
            </div>
        )
    }
}