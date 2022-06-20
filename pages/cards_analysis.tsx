import { NextPage } from 'next';
import { server } from '../config';
import Layout from "../components/layout";
import styles from '../styles/CardAnalysis.module.css';
import 'chart.js/auto';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

export const optionsByColor = {
    responsive: true,
    // maintainAspectRatio: false,
    aspectRatio:1,
    plugins: {
      legend: {
        display:false,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribution by Color Identity',
        color: '#422273',
      },
    },
  }
export const optionsByManaValue = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio:2,
    plugins: {
      legend: {
        display:false,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribution by Mana Value',
        color: '#422273',
      },
    },
  }
export const optionsByType = {
    responsive: true,
    // maintainAspectRatio: false,
    aspectRatio:1,
    plugins: {
      legend: {
        display:false,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribution by Type',
        color: '#422273',
      },
      datalabels: {
        color:'#422273',
      },
    },
  }


type CardAnalysisProps = {
  "data": any,
}

const CardAnalysis: NextPage<CardAnalysisProps> = ({ data }) => {
  return (
    <Layout title="Cards Analysis">
      <div className={styles.cardAnalysis}>
        <h1>Cards Analysis</h1>
        <span className={styles.upperRow}>
          <span className={styles.byColor}>
            <Bar
                options={optionsByColor}
                data={data.by_color}
            />
          </span>
          <span className={styles.byManaValue}>
            <Bar
                options={optionsByManaValue}
                data={data.by_mv}
                />
          </span>
        </span>
        <span className={styles.upperRow}>
          <span className={styles.byType}>
            <Bar
                options={optionsByType}
                data={data.by_type}
            />
          </span>
          <span className={styles.byType}>
            <Bar
                options={optionsByType}
                data={data.by_type}
            />
          </span>
        </span>
      </div>
    </Layout>
  );
};

CardAnalysis.getInitialProps = async () => {
  const rawResult = await fetch(`${server}/data/charts/cardAnalysis.json`);
  const result = await rawResult.json();
  return { data: result }
}

export default CardAnalysis;