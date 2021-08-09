export default function CurrenciesSection({currencies, onSelect, selected, setNewCurrency}) {
  return(
      <section id='currencies-section' className='flex'>
        {
          currencies.map(({id, symbol, description}) => {
            description = description[0].toUpperCase() + description.slice(1, description.length);
            return(
              <button 
                key={id} 
                className={`currency-button ${selected === symbol ? 'active-button' : ''}`}
                onClick={() => {onSelect(symbol)}}
                >
                {description}
              </button>
            )
          })
        }
        <button
          className={`currency-button post-button`}
          onClick={() => {setNewCurrency(true)}}
          >
          Add a new currency...
        </button>
      </section>
  )
}