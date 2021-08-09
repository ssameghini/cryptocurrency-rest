import axios from 'axios';
import { useState } from "react";

export default function UpdateForm({currencies, update}) {
  const [currencyName, setCurrencyName] = useState('');
  const [valueInput, setValueInput] = useState(0);
  const [error, setError] = useState(false);

  const changeCurrencyInput = e => {
    const { value } = e.target;
    setCurrencyName(value);
    setError(false);
  }

  const changeValueInput = e => {
    const { value } = e.target;
    setValueInput(value);
    setError(false);
  }

  const postRateUpdate = e => {
    e.preventDefault();
    if (!currencyName && !valueInput) {
      setError(true);
      return;
    }
    const currencyId = currencies.find(currency => {
      return currency.symbol === currencyName;
    }).id;
    const rateInput = {
      id_currency: currencyId,
      value: valueInput,
    };
    axios.post('http://localhost:5000/rates', rateInput)
      .then(({data}) => {
        update(true);
      });
  }

  const deleteCurrency = () => {
    if (!currencyName) {
      setError(true);
      return;
    }
    const currencyDescription = currencies.find(currency => {
      return currency.symbol === currencyName;
    }).description;
    let confirmation = prompt(`Are you sure you want to delete ${currencyDescription}?`, 'No');
    if (confirmation.toLowerCase() === ('yes' || 'y')){
      axios.post('http://localhost:5000/delete', {symbol: currencyName})
        .then(() => {
          setError(false);
          update(true);
        })
    }
  }
  
  return(
      <aside className='input-bar flex'>
        <h3>Update {currencyName || 'a currency'} value</h3>
        <form onSubmit={postRateUpdate} className='flex aside-form'>
          <select 
            id='select-currency' 
            name='currency'
            required
            placeholder='Choose one of the listed currencies'
            value={currencyName}
            onChange={changeCurrencyInput}
            >
              <option value=''></option>
              {
                currencies && currencies.map(({id, symbol, description}) => {
                  description = description[0].toUpperCase() + description.slice(1, description.length);
                  return(
                    <option key={id} value={symbol}>{symbol + ' - ' + description}</option>
                  )
                })
              }
            </select>
            <label htmlFor='select-currency' className='form-label'><em>Select a currency...</em></label>
            <input 
              type='number'
              placeholder="What's its new value?"
              required
              name='value'
              id='select-value'
              value={valueInput}
              onChange={changeValueInput}
              />
            <label htmlFor='select-value' className='form-label'><em>Specify a value...</em></label>
            <button type='submit' className='post-button'>Update {currencyName} rate!</button>
        </form>
        <button type='button' className='post-button delete' onClick={deleteCurrency}>Or delete this currency...</button>
        { error &&
          (
            <>
              <span>Please verify your input</span>
              <ul>
                <li>Select one currency</li>
                <br/>
                <li>And if you want to <strong>update</strong> a rate...</li>
                <li>Assign a new numerical value (up to ten decimals allowed)</li>
              </ul>
            </>
          )
        }
      </aside>
  )
}