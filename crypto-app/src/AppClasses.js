import axios from 'axios';
import { Component } from 'react';

import ChartsSection from './components/charts.component';
import CurrenciesSection from './components/currencies.component';
import UpdateForm from './components/update-form.component';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currencies: [],
      selectedCurrency: ""
    }

    this.changeCurrency = this.changeCurrency.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:5000/currencies')
      .then(({data}) => {
        this.setState({
          currencies: data,
          selectedCurrency: data[0].symbol,
        })
      });
  }

  changeCurrency(symbol) {
    symbol !== this.state.selectedCurrency &&
      this.setState({selectedCurrency: symbol});
  }

  render() {
    const { currencies, selectedCurrency } = this.state;
    
    return (
      <>
        <header className='flex'>
          <h1>Crypto App</h1>
          <h2>A simple App for cryptocurrencies fluctuations</h2>
        </header>
        <main className='flex'>
          <CurrenciesSection 
            currencies={currencies}
            onSelect={this.changeCurrency}
            selected={selectedCurrency}
            />
          <ChartsSection symbol={selectedCurrency}/>
          <UpdateForm currencies={currencies}/>
        </main>
      </>
    )
  }
}
