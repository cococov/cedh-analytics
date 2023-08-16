import { useReducer, useState, useEffect } from 'react';
import { replace, find, propEq } from 'ramda';
import { CardsTable, CardInfo, DeckLists, Layout, SnackBarLoading } from '../../../components';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import styles from '../../../styles/CardsListForTournament.module.css';
import fetchCards from '../../../utils/fetch/cardData';
import { server } from '../../../config';
import TOURNAMENTS_LIST from '../../../public/data/tournaments/list.json';
import TAGS_BY_CARD from '../../../public/data/cards/tags.json';
import Image from 'next/image';

type CardProps = any; // TODO: define type

type TournamentInfo = {
  name: string;
  showName: boolean;
  id: string;
  bookmark: string;
  imageName?: string | null;
  serie: string;
  number: number;
};

type TounamentResume = {
  decks: number;
  cards: number;
  staples: number;
  staples_small: number;
  pet: number;
  last_set: string;
  last_set_top_10: { occurrences: number; cardName: string }[];
};

type CardsProps = {
  cards: CardProps[];
  tagsByCard: { [key: string]: string[] };
  tournamentInfo: TournamentInfo;
  tounamentResume: TounamentResume;
};

type ColorIdentity = ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[]
type Commander = { name: string; color_identity: ColorIdentity };
type DeckList = { name: string; url: string; commanders: Commander[] };
type DeckListsByCommander = { commanders: string; decks: DeckList[]; colorIdentity: ColorIdentity };
type occurrencesForCard = { occurrences: number; persentaje: number };

type CardData = {
  cardImage: string;
  cardType: string;
  cardText: string;
  averagePrice: number;
  gathererId: number;
  cardFaces: { type_line: string }[];
  isReservedList: boolean;
  isDoubleFace: boolean;
};

const Tournament: React.FC<CardsProps> = ({ cards, tagsByCard, tournamentInfo, tounamentResume }) => {
  const isMediumScreen = useMediaQuery('(max-width: 1080px) and (min-width: 601px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [occurrencesForCard, setOccurrencesForCard] = useState<occurrencesForCard>({ occurrences: 0, persentaje: 0 });
  const [decklists, setDecklists] = useState<DeckListsByCommander[]>([]);
  const [cardData, setCardData] = useState<CardData>({
    cardImage: '',
    cardType: '',
    cardText: '',
    averagePrice: 0,
    gathererId: 0,
    cardFaces: [],
    isReservedList: false,
    isDoubleFace: false,
  });
  const [isForcedSnackBarLoading, forceSnackBarLoading] = useReducer((_state: boolean, newValue: boolean) => newValue, false);
  const [isLoading, toggleLoading] = useReducer((_state: boolean, newValue: boolean) => newValue, false);
  const [isLoadingDeckLists, toggleLoadingDecklists] = useReducer((_state: boolean, newValue: boolean) => newValue, false);

  const handleChangeCard = async (cardName: string | undefined) => {
    toggleLoadingDecklists(true);
    setTimeout(() => { toggleLoadingDecklists(false) }, 300);
    toggleLoading(true);
    setSelectedCard(cardName || '');
    const card = cards.find((current: any) => current['cardName'] === cardName);
    const decklists: DeckListsByCommander[] = card?.decklists || [];
    setOccurrencesForCard({ occurrences: card?.occurrences, persentaje: card?.percentageOfUse });
    setDecklists(decklists);
  };

  useEffect(() => {
    const requestData = async () => {
      const cardName = replace(/\s/g, '%20', selectedCard);
      const result = await fetchCards(cardName);
      setCardData({
        cardImage: result['cardImage'],
        cardType: result['cardType'],
        cardText: result['cardText'],
        averagePrice: parseFloat(result['averagePrice']),
        gathererId: result['gathererId'],
        cardFaces: result['cardFaces'],
        isReservedList: result['isReservedList'],
        isDoubleFace: result['isDoubleFace'],
      });
      toggleLoading(false);
    };

    !!selectedCard && requestData();
  }, [selectedCard]);

  return (
    <Layout title={`${tournamentInfo.name}`} description={`Information and statistics of ${tournamentInfo.name}`} image={`/data/tournaments/${!!tournamentInfo.imageName ? `${tournamentInfo.id}/${tournamentInfo.imageName}` : 'default.jpg'}`}>
      <SnackBarLoading isOpen={(isLoading && (isMediumScreen || isSmallScreen)) || isForcedSnackBarLoading} />
      <main className={styles.main}>
        <section className={styles.tournamentImageContainer}>
          <Image
            className={styles.tournamentImage}
            src={`/data/tournaments/${!!tournamentInfo.imageName ? `${tournamentInfo.id}/${tournamentInfo.imageName}` : 'default.jpg'}`}
            alt={`${tournamentInfo.id} Image`}
            layout="fill"
            quality={100}
            priority
          />
          {tournamentInfo.showName && <h1>{tournamentInfo.name}</h1>}
        </section>
        <section className={styles.homeStatsSection}>
          <span className={styles.homeStat}>
            <h2>Total Decks</h2>
            <p>{tounamentResume?.decks}</p>
          </span>
          <span className={styles.homeStat}>
            <h2>Total Cards</h2>
            <p>{tounamentResume?.cards}</p>
          </span>
          {
            tounamentResume?.decks < 15 ? (
              <span className={styles.homeStat}>
                <h2>{'>'} 5 occurrences</h2>
                <p>{tounamentResume?.staples_small}</p>
              </span>
            ) : (
              <span className={styles.homeStat}>
                <h2>{'>'} 10 occurrences</h2>
                <p>{tounamentResume?.staples}</p>
              </span>
            )
          }
          <span className={styles.homeStat}>
            <h2>1 occurrence</h2>
            <p>{tounamentResume?.pet}</p>
          </span>
        </section>
        <section className={styles.cardList}>
          <span className={styles.leftSpan}>
            <DeckLists
              occurrencesForCard={occurrencesForCard}
              isLoading={isLoadingDeckLists}
              decklists={decklists}
              size="medium"
            />
          </span>
          <CardsTable
            cards={cards}
            tagsByCard={tagsByCard}
            toggleLoading={toggleLoading}
            handleChangeCard={handleChangeCard}
            tournamentId={tournamentInfo?.id}
            forceSnackBarLoading={forceSnackBarLoading}
          />
          <CardInfo
            selectedCard={selectedCard}
            isLoading={isLoading}
            cardData={cardData}
          />
        </section>
      </main>
    </Layout>
  );
};

type Params = {
  params: { id: string; };
  res: { setHeader: (name: string, value: string) => void; };
};

export const getServerSideProps = async ({ params, res }: Params) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1000, stale-while-revalidate=59'
  )

  try {
    const rawData = await fetch(`${server}/data/tournaments/${params.id}/cards/competitiveCards.json`);
    const data = await rawData.json();

    const tournamentInfo = find(propEq('id', params.id), TOURNAMENTS_LIST);
    const rawTounamentResume = await fetch(`${server}/data/tournaments/${params.id}/home_overview.json`);
    const tounamentResume = await rawTounamentResume.json();

    return {
      props: {
        cards: data,
        tagsByCard: TAGS_BY_CARD,
        tournamentInfo,
        tounamentResume
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default Tournament;
