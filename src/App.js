import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/dist/css/rsuite-table.css';

import dataGenerator from './data';

const chartData = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const WalletCell = ({ rowData, ...props }) => (
  <Cell {...props}>
    <a target="_blank" rel="noreferrer" href={`https://bscscan.com/token/0xD4d03e510b382244B2289637B5f7D9067bcAaE85?a=${rowData.wallet}`}>{rowData.wallet}</a>
  </Cell>
);

const LFCell = ({ rowData, ...props }) => (
  <Cell {...props}>
    <div>{rowData.totalMined.toLocaleString('pt')} LF</div>
  </Cell>
);

function App() {
  const [data, setData] = useState({});
  const [nftQuantity, setNFTQuantity] = useState([]);
  const [lfQuantity, setLFQuantity] = useState([]);
  const [fiveStars, setFiveStars] = useState([]);
  const [fourStars, setFourStars] = useState([]);

  useEffect(() => {
    const newData = dataGenerator();
    setData(newData);
    setNFTQuantity(
      newData.sortedByWalletNFTQuantity
        .slice(0, 50)
        .map((item, index) => ({ id: index + 1, wallet: item.wallet, miners: item.miners.length }))
    );
    setLFQuantity(
      newData.sortedByMinedQuantity
        .slice(0, 50)
        .map((item, index) => ({ id: index + 1, wallet: item.wallet, totalMined: item.totalMined }))
    );

    setFiveStars(
      newData.sortedByNFTRarityQuantity
        .slice(0, 10)
        .map((item, index) => ({ id: index + 1, wallet: item.wallet, miners: item.fiveStar }))
    );
    setFourStars(
      newData.sortedByNFTRarityQuantity
        .sort((a, b) => b.fourStar - a.fourStar)
        .slice(0, 10)
        .map((item, index) => ({ id: index + 1, wallet: item.wallet, miners: item.fourStar }))
    );
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h1>ELEF Dashboard</h1>

      <div>
        <h2>Número de jogadores</h2>
        <p>{data.numberOfPlayers}</p>
      </div>

      <div>
        <h2>Número de NFTs</h2>
        <p>{data.numberOfNFTs}</p>
      </div>

      <div>
        <h2>Número de jogadores com 10 NFTs ou mais</h2>
        <p>{data.numberOfFullLandWallets}</p>
      </div>

      <div>
        <h2>Total de LF minado</h2>
        <p>{data.totalMinedLF} LF</p>
      </div>

      <div>
        <h2>Top 50 Carteiras por número de NFTs</h2>
        <Table data={nftQuantity} width={650} height={400}>
          <Column width={70} resizable>
            <HeaderCell>Rank</HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column width={430} fixed resizable>
            <HeaderCell>Carteira</HeaderCell>
            <WalletCell />
          </Column>

          <Column width={150} resizable>
            <HeaderCell>Número de NFTs</HeaderCell>
            <Cell dataKey="miners" />
          </Column>
        </Table>
      </div>

      <div>
        <h2>Top 50 Carteiras por LF minado</h2>
        <Table data={lfQuantity} width={650} height={400}>
          <Column width={70} resizable>
            <HeaderCell>Rank</HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column width={420} fixed resizable>
            <HeaderCell>Carteira</HeaderCell>
            <WalletCell />
          </Column>

          <Column width={160} resizable>
            <HeaderCell>Quantidade Minada</HeaderCell>
            <LFCell />
          </Column>
        </Table>
      </div>

      <div>
        <h2>Top 10 Carteiras por Mineiros Lendários</h2>
        <Table data={fiveStars} width={650} height={400}>
          <Column width={70} resizable>
            <HeaderCell>Rank</HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column width={420} fixed resizable>
            <HeaderCell>Carteira</HeaderCell>
            <WalletCell />
          </Column>

          <Column width={160} resizable>
            <HeaderCell>Número de NFTs</HeaderCell>
            <Cell dataKey="miners" />
          </Column>
        </Table>
      </div>

      <div>
        <h2>Top 10 Carteiras por Mineiros Raros</h2>
        <Table data={fourStars} width={650} height={400}>
          <Column width={70} resizable>
            <HeaderCell>Rank</HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column width={420} fixed resizable>
            <HeaderCell>Carteira</HeaderCell>
            <WalletCell />
          </Column>

          <Column width={160} resizable>
            <HeaderCell>Número de NFTs</HeaderCell>
            <Cell dataKey="miners" />
          </Column>
        </Table>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
