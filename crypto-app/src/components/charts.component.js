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
    <ResponsiveContainer width="80%" height="100%" className="container">
      <LineChart data={fluctuations
        .map(rate => ({...rate, "value": +rate.value }))
        .slice(-5)
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
    axios.get(`http://localhost:5000/rates/fluctuations/${symbol}`)
      .then(({data}) => {
        setFluctuations(data);
        update && setUpdate(false);
      });
  }, [symbol, update, setUpdate]);
  
  return(
      <section id='charts-section'>
        {renderLineChart}
      </section>
  )
}