import axios from 'axios';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend
} from 'recharts';

export default function ChartsSection({symbol, update, setUpdate}) {
  const [fluctuations, setFluctuations] = useState([]);
  const [lastRate, setLastRate] = useState({});

  const lineColor = () => {
    switch (symbol) {
      case 'BTC':
        return '#82ca9d'
      case 'ETH':
        return '#8884d8'
      case 'ADA':
        return '#FF2626'
      default:
        return `#${Math.floor(Math.random()*16777215).toString(16)}`
    }
  }
  
  const renderLineChart = (
    <ResponsiveContainer width="80%" className="container">
      <LineChart data={fluctuations
        .map(rate => ({...rate, "value": +rate.value })) // Set value from String to Number
        .slice(-5) // Show only the last 5 values
        }>
        <Line type="monotone" dataKey="value" stroke={lineColor()} strokeWidth={2}/>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
        <XAxis dataKey="created_at" interval="preserveStartEnd"/>
        <YAxis type="number" domain={[
          "auto",
          "auto",
          ]}/>
        <Tooltip />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );

  useEffect(() => {
    axios.get(`http://localhost/rates/fluctuations/${symbol}`)
      .then(({data}) => {
        setFluctuations(data);
        update && setUpdate(false);
      });
  }, [symbol, update, setUpdate]);

  useEffect(() => {
    axios.get(`http://localhost/rates/${symbol}`)
      .then(({data}) => {
        if (data.id) {
          let description = data.currency.description;
          description = description[0].toUpperCase() + description.slice(1, description.length);
          setLastRate({
            description,
            value: data.value,
            created_at: data.created_at,
          })
        }
      })
  }, [symbol, update]);
  
  return(
      <section id='charts-section'className='flex'>
        {renderLineChart}
        { lastRate.description &&
          <article id='last-rate'>
            <h3 className='grid-description'>{lastRate.description}</h3>
            <h4 className='grid-symbol'>{symbol}</h4>
            <p className='grid-value'>Last value: <span>{lastRate.value}</span></p>
            <p className='grid-date'>at <em>{lastRate.created_at}</em></p>
          </article>
        }
      </section>
  )
}