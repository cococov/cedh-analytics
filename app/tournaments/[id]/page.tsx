import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
/* Vendor */
import { find, propEq } from 'ramda';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '../../shared-metadata';
import { CardsTableWithProvider, CardInfoWithProvider, DeckListsWithProvider } from '../../../components';
import TournamentResumeContext, { TournamentResumeProvider } from '../../../contexts/tournamentResumeStore';
import fetchCards from '../../../utils/fetch/cardData';
/* Static */
import styles from '../../../styles/CardsListForTournament.module.css';
import TOURNAMENTS_LIST from '../../../public/data/tournaments/list.json';
import TAGS_BY_CARD from '../../../public/data/cards/tags.json';
import { server } from '../../../config';

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
type TournamentResume = {
  decks: number;
  cards: number;
  staples: number;
  staples_small: number;
  pet: number;
  last_set: string;
  last_set_top_10: { occurrences: number; cardName: string }[];
};
type PageData = {
  cards: CardProps[];
  tagsByCard: { [key: string]: string[] };
  tournamentInfo: TournamentInfo;
  tournamentResume: TournamentResume;
};

type ErrorData = { notFound: boolean };
type ResponseData = PageData & ErrorData | ErrorData;
type Params = { id: string | string[] | undefined };

export async function generateMetadata({
  params,
}: {
  params: Params,
}): Promise<Metadata> {
  const tournamentInfo = find(propEq(params.id, 'id'), TOURNAMENTS_LIST);
  const description = `Information and statistics of ${tournamentInfo?.name} | ${descriptionMetadata}`;
  const image = `/data/tournaments/${!!tournamentInfo?.imageName ? `${tournamentInfo.id}/${tournamentInfo.imageName}` : 'default.jpg'}`;

  return {
    title: `${tournamentInfo?.name}`,
    description: description,
    openGraph: {
      ...openGraphMetadata,
      title: `${tournamentInfo?.name} | cEDH Analytics`,
      images: [
        {
          url: image,
          width: 1280,
          height: 720,
          alt: `${tournamentInfo?.name} Image`,
        },
      ],
    },
    twitter: {
      ...twitterMetadata,
      title: `${tournamentInfo?.name} | cEDH Analytics`,
      description: description,
      images: {
        url: image,
        alt: `${tournamentInfo?.name} Image`,
      },
    },
  }
};

async function fetchData({ id }: Params): Promise<ResponseData> {
  if (!id) return { notFound: true };

  try {
    const rawData = await fetch(`${server}/data/tournaments/${id}/cards/competitiveCards.json`);
    const data = await rawData.json();

    const tournamentInfo = find(propEq(id, 'id'), TOURNAMENTS_LIST);
    const rawTournamentResume = await fetch(`${server}/data/tournaments/${id}/home_overview.json`);
    const tournamentResume = await rawTournamentResume.json();

    return {
      cards: data,
      tagsByCard: TAGS_BY_CARD,
      tournamentInfo,
      tournamentResume,
      notFound: false,
    };
  } catch (err) {
    return { notFound: true };
  }
};

export default async function Card({
  params
}: {
  params: Params
}) {
  const response = await fetchData({ id: decodeURI(String(params.id)) });

  if (response.notFound) notFound();

  const { cards, tagsByCard, tournamentInfo, tournamentResume } = response as PageData;

  return (
    <main className={styles.main}>
      <TournamentResumeProvider cards={cards}>
        <section className={styles.tournamentImageContainer}>
          <Image
            className={styles.tournamentImage}
            src={`/data/tournaments/${!!tournamentInfo.imageName ? `${tournamentInfo.id}/${tournamentInfo.imageName}` : 'default.jpg'}`}
            alt={`${tournamentInfo.id} Image`}
            quality={100}
            width={1920}
            height={1080}
            priority
          />
          {tournamentInfo.showName && <h1>{tournamentInfo.name}</h1>}
        </section>
        <section className={styles.homeStatsSection}>
          <span className={styles.homeStat}>
            <h2>Total Decks</h2>
            <p>{tournamentResume?.decks}</p>
          </span>
          <span className={styles.homeStat}>
            <h2>Total Cards</h2>
            <p>{tournamentResume?.cards}</p>
          </span>
          {
            tournamentResume?.decks < 15 ? (
              <span className={styles.homeStat}>
                <h2>{'>'} 5 occurrences</h2>
                <p>{tournamentResume?.staples_small}</p>
              </span>
            ) : (
              <span className={styles.homeStat}>
                <h2>{'>'} 10 occurrences</h2>
                <p>{tournamentResume?.staples}</p>
              </span>
            )
          }
          <span className={styles.homeStat}>
            <h2>1 occurrence</h2>
            <p>{tournamentResume?.pet}</p>
          </span>
        </section>
        <section className={styles.cardList}>
          <span className={styles.leftSpan}>
            <DeckListsWithProvider size="medium" context={TournamentResumeContext} />
          </span>
          <span className={styles.commandersContainer}>
            <CardsTableWithProvider
              title="Cards"
              cards={cards}
              tagsByCard={tagsByCard}
              context={TournamentResumeContext}
              cardUrlBase={`/tournaments/${String(params.id)}`}
            />
          </span>
          <CardInfoWithProvider context={TournamentResumeContext} />
        </section>
      </TournamentResumeProvider>
    </main>
  );
};
