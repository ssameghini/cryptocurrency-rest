import axios from 'axios';
import { useState } from "react";

export default function UpdateForm({currencies, update}) {
  const [currencyName, setCurrencyName] = useState('');
  const [valueInput, setValueInput] = useState(0);
  const [createdAt, setCreatedAt] = useState('');
  const [error, setError] = useState(false);

  const dateFormat = date => {
    if (date[10] === ' ') {
      date = date.split(' ');
      date = date.join('T');
    } 
    if (date.length === 16) {
      date += ':00.000Z'; // For proper ISO format
    } else if (date.length === 19) {
      date += '.000Z'; // For proper ISO format
    }
    return date;
  }

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

  const changeDateInput = e => {
    const { value } = e.target;
    console.log(value);
    setCreatedAt(value);
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
    const date = dateFormat(createdAt);
    const rateInput = {
      id_currency: currencyId,
      value: valueInput,
      created_at: date,
    };
    axios.post('http://localhost/rates', rateInput)
      .then(({data}) => {
        update(true);
        setCurrencyName('');
        setValueInput(0);
        setCreatedAt('');
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
            <input 
              type='datetime-local' 
              name='created_at' 
              id='created_at'
              placeholder='YYYY-MM-DD HH:MM(:SS)'
              value={createdAt}
              onChange={changeDateInput}
              />
            <label htmlFor='created_at' className='form-label'><em>(Optional) Date of the rate...</em></label>
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
                <li>Assign a new numerical value <br/>
                (up to ten decimals allowed)</li>
              </ul>
            </>
          )
        }
      </aside>
  )
}
