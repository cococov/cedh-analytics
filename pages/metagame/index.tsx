import { NextPage } from 'next';
import Layout from "../../components/layout";
import styles from '../styles/Metagame.module.css';
import RESUME from '../../public/data/metagame/metagame_resume.json';
import COMMANDERS from '../../public/data/metagame/condensed_commanders_data.json';
import CARDS from '../../public/data/metagame/metagame_cards.json';

type ResumeData = {
  cantCommanders: number;
  cantLists: number;
  cantTournaments: number;
  avgColorPercentages: { [key: string]: number };
  avgColorIdentityPercentages: { [key: string]: number };
  avgCantBattles: number;
  avgCantPlaneswalkers: number;
  avgCantCreatures: number;
  avgCantSorceries: number;
  avgCantInstants: number;
  avgCantArtifacts: number;
  avgCantEnchantments: number;
  avgCantLands: number;
  cantDecksWithStickers: number;
  cantDecksWithCompanions: number;
  percentageDecksWithStickers: number;
  percentageDecksWithCompanions: number;
  allTokens: string[];
  lastSet: string;
  lastSetTop10: { [key: string]: number | string }[];
  avgCmcWithLands: number;
  avgCmcWithoutLands: number;
  minAvgCmcWithLands: number;
  minAvgCmcWithoutLands: number;
  maxAvgCmcWithLands: number;
  maxAvgCmcWithoutLands: number;
};

type CommandersData = {
  identity: string;
  commander: string;
  appearances: number;
  wins: number;
  avgWinRate: number;
  bestStanding: number;
  worstStanding: number;
};

type CardsData = any;

type MetagameProps = {
  resume_data: ResumeData,
  commanders_data: CommandersData,
  cards_data: CardsData,
}

const Metagame: NextPage<MetagameProps> = ({ resume_data, commanders_data, cards_data }) => {
  return (
    <Layout title="Metagame" description="cEDH metagame analysis">
      <span>
        <section>
        </section>
        < section>
        </section>
      </span>
    </Layout>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      resume_data: RESUME,
      commanders_data: COMMANDERS,
      cards_data: CARDS
    }
  };
};

export default Metagame;