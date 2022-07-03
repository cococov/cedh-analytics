import { useRouter } from 'next/router';
import styles from '../../../styles/CardsList.module.css';
import { CardInfoPage, Layout } from '../../../components';
import fetchCards from '../../../utils/fetch/cardData';
import DATA from '../../../public/data/cards/competitiveCards.json';

type occurrencesForCard = { occurrences: number, persentaje: number };
type ColorIdentity = ('G' | 'B' | 'R' | 'U' | 'W' | 'C')[]
type Commander = { name: string, color_identity: ColorIdentity };
type DeckList = { name: string, url: string, commanders: Commander[] };
type DeckListsByCommander = { commanders: string, decks: DeckList[], colorIdentity: ColorIdentity };
type CardFace = {
  object: string,
  name: string,
  mana_cost: string,
  type_line: string,
  oracle_text: string,
  colors: string[],
  artist: string,
  artist_id: string,
  illustration_id: string,
  image_uris: { medium: string, large: string }
};

type CardProps = {
  cardType: string,
  cardText: string,
  gathererId: number,
  averagePrice: number,
  isReservedList: boolean,
  cardImage: string,
  cardFaces: CardFace[],
  occurrencesForCard: occurrencesForCard,
  decklists: DeckListsByCommander[],
};

const Card: React.FC<CardProps> = ({ cardType, cardText, gathererId, averagePrice, isReservedList, cardImage, occurrencesForCard, decklists, cardFaces }) => {
  const router = useRouter()
  const { name } = router.query

  return (
    <Layout title={name} description={`${name} info`}>
      <main className={styles.main}>
        <CardInfoPage
          cardName={typeof (name) === "string" ? name : ''}
          cardType={cardType}
          cardText={cardText || `\
          ${cardFaces[0]['oracle_text']}
          --DIVIDE--
          ${cardFaces[1]['oracle_text']}
          `}
          gathererId={gathererId}
          averagePrice={averagePrice}
          isReservedList={isReservedList}
          cardImage={cardImage || cardFaces[0].image_uris.large}
          occurrencesForCard={occurrencesForCard}
          decklists={decklists}
        />
      </main>
    </Layout>
  )
};

type Params = {
  params: {
    name: string
  },
  res: {
    setHeader: (name: string, value: string) => void
  }
}

export const getServerSideProps = async ({ params, res }: Params) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1000, stale-while-revalidate=59'
  )

  try {
    const result = await fetchCards(params.name);

    if (result.error) throw new Error('Fetch Error');

    const card = (DATA as any[]).find((current: any) => current['cardName'].toLowerCase() === (params.name as string).toLowerCase());
    const decklists: DeckListsByCommander[] = card?.decklists || [];
    const occurrencesForCard = { occurrences: card?.occurrences || 0, persentaje: card?.percentageOfUse || 0 };

    return {
      props: {
        cardType: result['cardType'],
        cmc: result['cmc'],
        colorIdentity: result['colorIdentity'],
        rarity: result['rarity'],
        cardText: result['cardText'],
        gathererId: result['gathererId'],
        averagePrice: result['averagePrice'],
        isReservedList: result['isReservedList'],
        cardImage: result['cardImage'],
        cardFaces: result['cardFaces'],
        occurrencesForCard: occurrencesForCard,
        decklists: decklists,
      }
    };
  } catch (err) {
    return {
      notFound: true,
      props: {
        cardType: '',
        cmc: 0,
        colorIdentity: [],
        rarity: '',
        cardText: '',
        gathererId: 0,
        averagePrice: 0,
        isReservedList: false,
        cardImage: '',
        cardFaces: null,
        occurrencesForCard: { occurrences: 0, persentaje: 0 },
        decklists: [],
      }
    };
  }
};

export default Card;
