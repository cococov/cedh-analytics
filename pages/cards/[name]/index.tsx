import { useEffect } from 'react';
import { useRouter } from 'next/router'
import styles from '../../../styles/Home.module.css';
import { CardInfoPage, Layout } from '../../../components';
import { AppProvider, CardProvider } from '../../../contexts';
import { includes, T } from 'rambda';


type CardsProps = {
  cardType: string,
  cardText: string,
  gathererId: number,
  averagePrice: number,
  isReservedList: boolean,
  cardImage: string,
}

const Cards = ({ cardType, cardText, gathererId, averagePrice, isReservedList, cardImage }: CardsProps) => {
  const router = useRouter()
  const { name } = router.query

  return (
    <div className={styles.container}>
      <Layout title={name} description={`${name} info.`}>
        <AppProvider>
          <main className={styles.main}>
            <CardProvider>
              <CardInfoPage
                cardName={typeof (name) === "string" ? name : ''}
                cardType={cardType}
                cardText={cardText}
                gathererId={gathererId}
                averagePrice={averagePrice}
                isReservedList={isReservedList}
                cardImage={cardImage}
              />
            </CardProvider>
          </main>
        </AppProvider>
      </Layout>
    </div >
  )
}

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
    const rawResult = await fetch(`https://api.scryfall.com/cards/named?exact=${params.name}`);
    const result = await rawResult.json();
    const rawAllPrints = await fetch(result['prints_search_uri']);
    const allPrints = await rawAllPrints.json();
    const GARBAGE_EDITIONS = ['Intl. Collectors’ Edition', 'Collectors’ Edition', 'Legacy Championship', 'Summer Magic / Edgar'];

    const print = allPrints['data'].reduce(
      (accumulator: any, current: any) => {
        if (current['digital']) return accumulator;
        if (current['oversized']) return accumulator;
        if (current['border_color'] === 'gold') return accumulator;
        if (includes(current['set_name'], GARBAGE_EDITIONS)) return accumulator;
        if (!current['prices']['usd'] && !current['prices']['usd_foil']) return accumulator;
        const currentPrice = !!current['prices']['usd'] ? parseFloat(current['prices']['usd']) : parseFloat(current['prices']['usd_foil']);
        const accumulatedPrice = !!accumulator['prices']['usd'] ? parseFloat(accumulator['prices']['usd']) : parseFloat(accumulator['prices']['usd_foil']);
        if (currentPrice >= accumulatedPrice) return accumulator;
        if (current['multiverse_ids'].length === 0) return { ...current, multiverse_ids: accumulator['multiverse_ids'] }
        return current;
      },
      result
    );

    if(!print['multiverse_ids'][0] || print['multiverse_ids'][0] === 0) {
      throw new Error("Card Not found");
    }

    return {
      props: {
        cardType: print['type_line'],
        manaCost: print['mana_cost'],
        cmc: print['cmc'],
        colorIdentity: print['color_identity'],
        rarity: print['rarity'],
        cardText: print['oracle_text'],
        gathererId: print['multiverse_ids'][0],
        averagePrice: !!print['prices']['usd'] ? print['prices']['usd'] : print['prices']['usd_foil'],
        isReservedList: print['reserved'],
        cardImage: print['image_uris']['large'],
        cardFaces: print['card_faces'] || null,
      }
    };
  } catch (err) {
    return {
      notFound: true,
      props: {
        cardType: '',
        manaCost: '',
        cmc: 0,
        colorIdentity: [],
        rarity: '',
        cardText: '',
        gathererId: 0,
        averagePrice: 0,
        isReservedList: false,
        cardImage: '',
        cardFaces: null,
      }
    };
  }
}

export default Cards;
