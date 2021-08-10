import axios from 'axios';
import { useState, useEffect } from 'react';

import ChartsSection from './components/charts.component';
import CurrenciesSection from './components/currencies.component';
import NewCurrencyForm from './components/new-currency-form.component';
import UpdateForm from './components/update-form.component';
import './App.css';

export default function App(props) {
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [outdated, setOutdated] = useState(false);
    const [newCurrencyAside, setNewCurrencyAside] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/currencies')
        .then(({data}) => {
            setCurrencies(data);
            setSelectedCurrency(data[0].symbol);
        });
    }, []);

    useEffect(() => {
        outdated &&
        axios.get('http://localhost:5000/currencies')
        .then(({data}) => {
            setCurrencies(data);
        });
    }, [outdated]);

    const changeCurrency = symbol => {
        symbol !== selectedCurrency &&
            setSelectedCurrency(symbol);
    }

    return (
        <>
        <header className='flex'>
            <h1>Crypto App</h1>
            <h2>A simple App for cryptocurrencies fluctuations</h2>
        </header>
        <main className='flex'>
            <CurrenciesSection 
            currencies={currencies}
            onSelect={changeCurrency}
            selected={selectedCurrency}
            setNewCurrency={setNewCurrencyAside}
            newCurrencyAside={newCurrencyAside}
            />
            <ChartsSection 
                symbol={selectedCurrency} 
                update={outdated} 
                setUpdate={setOutdated}
                />
            {
                newCurrencyAside === true ?
                <NewCurrencyForm setUpdate={setOutdated}/> :
                <UpdateForm currencies={currencies} update={setOutdated}/>
            }
        </main>
        </>
    )
}
