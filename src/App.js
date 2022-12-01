import React from 'react';
import { Block } from './Block';
// import Board from './Board';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = React.useState('UAH');
  const [toCurrency, setToCurrency] = React.useState('USD');
  const [fromPrice, setFromPrice] = React.useState(0);
  const [toPrice, setToPrice] = React.useState(1);

  const ratesRef = React.useRef({});

  React.useEffect(() =>{
    fetch('https://api.exchangerate.host/latest')
    .then(res => res.json())
    .then(json =>{
      ratesRef.current = json.rates
      onChangeToPrice(1);
    })
    .catch((err) =>{
      console.warn(err);
      alert('Не вдалось отримати інформацію')
    })
  }, []);

  const onChangeFromPrice = (value) => {
    const price = value / ratesRef.current[fromCurrency];
    const result = price * ratesRef.current[toCurrency];
    setToPrice(result.toFixed(3));
    setFromPrice(value);
  }

  const onChangeToPrice = (value) => {
    const result = (ratesRef.current[fromCurrency] / ratesRef.current[toCurrency]) * value;
    setFromPrice(result.toFixed(3));
    setToPrice(value);
  }


  React.useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency, fromPrice]);

  React.useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency, toPrice]);


  const currencies = ['USD', 'EUR']

  let eurPrice = ratesRef.current['UAH']?.toFixed(3);
  let usdPrice = ((ratesRef.current['UAH'] / ratesRef.current['USD']) * '1')?.toFixed(3);

  return (
    <div className="App">
      <header className="board">
          <h2>Exchange rate</h2>
          <h4>relative to the UAH</h4>
          <div className="list">
            <ul className="board__name">
              {currencies.map((items) => (
              <li
                className="board__name-item"
                key={items}>
                {items}
              </li>
            ))}
            </ul>
            <ul className="price">
              <li className="price__item">{eurPrice}</li>
              <li className="price__item" >{usdPrice}</li>
            </ul>
          </div>
      </header>
      <div className="Change">
        <Block 
        value={fromPrice} 
        currency={fromCurrency} 
        onChangeCurrency={setFromCurrency} 
        onChangeValue={onChangeFromPrice}
        />
        <Block
        value={toPrice} 
        currency={toCurrency} 
        onChangeCurrency={setToCurrency} 
        onChangeValue={onChangeToPrice}
        />
      </div>
    </div>
  );
}

export default App;
