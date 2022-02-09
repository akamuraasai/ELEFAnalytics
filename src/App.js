import { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import { isMobile } from 'react-device-detect';
import 'rsuite-table/dist/css/rsuite-table.css';
import './App.css';

import dataGenerator from './data';

const WalletCell = ({ rowData, ...props }) => (
  <Cell {...props}>
    <a target="_blank" rel="noreferrer" href={`https://bscscan.com/token/0xD4d03e510b382244B2289637B5f7D9067bcAaE85?a=${rowData.wallet}`}>{rowData.wallet}</a>
  </Cell>
);

const LFCell = ({ rowData, ...props }) => (
  <Cell {...props}>
    <div>{rowData.totalMined?.toLocaleString('pt')} LF</div>
  </Cell>
);

const Card = ({ title, value }) => (
  <div className="card">
    <h2>{value}</h2>
    <p>{title}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const [real, expected] = payload;

    return (
      <div className="tp-card">
        <p className="tp-label">{label}</p>
        <p className="tp-data tp-real">{`${real.name}: ${real.value}`}</p>
        <p className="tp-data tp-expected">{`${expected.name}: ${expected.value}`}</p>
        <p className="tp-total">{`O total de NTFs deste tipo é ${real?.payload?.total?.toLocaleString('pt')}.`}</p>
      </div>
    );
  }

  return null;
};

function App() {
  const [data, setData] = useState({});
  const [nftQuantity, setNFTQuantity] = useState([]);
  const [lfQuantity, setLFQuantity] = useState([]);
  const [fiveStars, setFiveStars] = useState([]);
  const [fourStars, setFourStars] = useState([]);
  const [chartData, setChartData] = useState([]);

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

    setChartData([
      {
        name: 'Beginer (1*)',
        total: newData?.totalNFTByRarity?.oneStar || 0,
        'Porcentagem de Mint Real': parseFloat(((newData?.totalNFTByRarity?.oneStar / newData.numberOfNFTs) * 100).toFixed(2)),
        'Porcentagem de Mint Esperada': 51
      },
      {
        name: 'Intermediate (2*)',
        total: newData?.totalNFTByRarity?.twoStars || 0,
        'Porcentagem de Mint Real': parseFloat(((newData?.totalNFTByRarity?.twoStars / newData.numberOfNFTs) * 100).toFixed(2)),
        'Porcentagem de Mint Esperada': 30
      },
      {
        name: 'Advanced (3*)',
        total: newData?.totalNFTByRarity?.threeStars || 0,
        'Porcentagem de Mint Real': parseFloat(((newData?.totalNFTByRarity?.threeStars / newData.numberOfNFTs) * 100).toFixed(2)),
        'Porcentagem de Mint Esperada': 15
      },
      {
        name: 'Rare (4*)',
        total: newData?.totalNFTByRarity?.fourStars || 0,
        'Porcentagem de Mint Real': parseFloat(((newData?.totalNFTByRarity?.fourStars / newData.numberOfNFTs) * 100).toFixed(2)),
        'Porcentagem de Mint Esperada': 3
      },
      {
        name: 'Legendary (5*)',
        total: newData?.totalNFTByRarity?.fiveStars || 0,
        'Porcentagem de Mint Real': parseFloat(((newData?.totalNFTByRarity?.fiveStars / newData.numberOfNFTs) * 100).toFixed(2)),
        'Porcentagem de Mint Esperada': 1
      },
    ])
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', flex: 1, display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: 40 }}>
      <h1>ELEF Dashboard</h1>

      <div className="cards">
        <Card title="Número de Jogadores" value={data.numberOfPlayers?.toLocaleString('pt')} />
        <Card title="Número de NFTs" value={data.numberOfNFTs?.toLocaleString('pt')} />
        <Card title="Jogadores com 10+ NFTs" value={data.numberOfFullLandWallets?.toLocaleString('pt')} />
        <Card title="Total de LF minado" value={`${data.totalMinedLF?.toLocaleString('pt')} LF`} />
      </div>

      <div className="card full-width bottom-margin">
        <h2 className="title">NFTs Mintados por raridade</h2>

        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              width={500}
              height={400}
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" scale="band" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar barSize={40} dataKey="Porcentagem de Mint Real" fill="#8884d8" />
              <Bar barSize={40} dataKey="Porcentagem de Mint Esperada" fill="#82ca9d" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="section bottom-margin">
        <div className="card right-margin">
          <h2>Top 50 Carteiras por número de NFTs</h2>
          <Table data={nftQuantity} width={isMobile ? '100%' : 584} height={400} hover={false} virtualized>
            <Column width={70} resizable>
              <HeaderCell>Rank</HeaderCell>
              <Cell dataKey="id" />
            </Column>

            <Column width={354} resizable>
              <HeaderCell>Carteira</HeaderCell>
              <WalletCell />
            </Column>

            <Column width={150} resizable>
              <HeaderCell>Número de NFTs</HeaderCell>
              <Cell dataKey="miners" />
            </Column>
          </Table>
        </div>

        <div className="card">
          <h2>Top 50 Carteiras por LF minado</h2>
          <Table data={lfQuantity} width={isMobile ? '100%' : 584} height={400} hover={false}>
            <Column width={70} resizable>
              <HeaderCell>Rank</HeaderCell>
              <Cell dataKey="id" />
            </Column>

            <Column width={354} resizable>
              <HeaderCell>Carteira</HeaderCell>
              <WalletCell />
            </Column>

            <Column width={160} resizable>
              <HeaderCell>Quantidade Minada</HeaderCell>
              <LFCell />
            </Column>
          </Table>
        </div>
      </div>


      <div className="section bottom-margin">
        <div className="card right-margin">
          <h2>Top 10 Carteiras por Mineiros Lendários</h2>
          <Table data={fiveStars} width={isMobile ? '100%' : 584} height={400} hover={false}>
            <Column width={70} resizable>
              <HeaderCell>Rank</HeaderCell>
              <Cell dataKey="id" />
            </Column>

            <Column width={354} resizable>
              <HeaderCell>Carteira</HeaderCell>
              <WalletCell />
            </Column>

            <Column width={160} resizable>
              <HeaderCell>Número de NFTs</HeaderCell>
              <Cell dataKey="miners" />
            </Column>
          </Table>
        </div>

        <div className="card">
          <h2>Top 10 Carteiras por Mineiros Raros</h2>
          <Table data={fourStars} width={isMobile ? '100%' : 584} height={400} hover={false}>
            <Column width={70} resizable>
              <HeaderCell>Rank</HeaderCell>
              <Cell dataKey="id" />
            </Column>

            <Column width={354} resizable>
              <HeaderCell>Carteira</HeaderCell>
              <WalletCell />
            </Column>

            <Column width={160} resizable>
              <HeaderCell>Número de NFTs</HeaderCell>
              <Cell dataKey="miners" />
            </Column>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default App;
