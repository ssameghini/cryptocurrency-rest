import axios from 'axios';
import { useState } from "react";

export default function NewCurrencyForm({setUpdate}) {
  const [currencyName, setCurrencyName] = useState('');
  const [symbolInput, setSymbolInput] = useState('');
  const [error, setError] = useState(false);

  const changeCurrencyInput = e => {
    const { value } = e.target;
    setCurrencyName(value);
    setError(false);
  }

  const changeSymbolInput = e => {
    const { value } = e.target;
    setSymbolInput(value);
    setError(false);
  }

  const postNewCurrency = e => {
    e.preventDefault();
    if (!currencyName && !symbolInput) {
      setError(true);
      return;
    }
    const newCurrency = {
      description: currencyName,
      symbol: symbolInput,
    };
    axios.post('http://localhost:5000/currencies', newCurrency)
      .then(({data}) => {
        console.log(data);
        setUpdate(true);
      });
  }
  
  return(
      <aside className='input-bar flex'>
        <h3>Add a new currency!</h3>
        <form onSubmit={postNewCurrency} className='flex aside-form'>
            <input 
                type='text' 
                value={currencyName}
                name='description'
                id='description'
                placeholder='Currency name'
                required
                onChange={changeCurrencyInput}
                />
            <label htmlFor='description' className='form-label'><em>Type the new currency name...</em></label>
            <input 
                type='text'
                placeholder="Only three letters, lowercased."
                required
                name='symbol'
                id='symbol'
                value={symbolInput}
                onChange={changeSymbolInput}
                />
            <label htmlFor='symbol' className='form-label'><em>Specify a symbol...</em></label>
            <button type='submit' className='post-button'>
                {currencyName && symbolInput ? `Save ${currencyName}` : 'Fill the fields with a new currency!'}
            </button>
        </form>
        { error &&
          (
            <>
              <span>Please verify your input</span>
              <ul>
                <li>Select one currency</li>
                <li>Assign a new numerical value (up to ten decimals allowed)</li>
              </ul>
            </>
          )
        }
      </aside>
  )
}