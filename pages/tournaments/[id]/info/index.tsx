import { useRouter } from 'next/router';
import { GoogleMap, useLoadScript, Marker, OverlayView } from '@react-google-maps/api';
import { mergeAll, find, propEq } from 'ramda';
import Image from 'next/image';
import Link from 'next/link';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import { green } from '@mui/material/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Layout, Loading } from '../../../../components';
import { server } from '../../../../config';
import styles from '../../../../styles/TournamentInfo.module.css';

import TOURNAMENTS_LIST from '../../../../public/data/tournaments/list.json';

type placeCoords = { lat: number; lng: number };
type TournamentInfo = {
  name: string;
  showName: boolean;
  id: string;
  bookmark: string;
  imageName?: string | null;
  serie: string;
  number: number;
  hidden: boolean;
  date: string;
  cost: string[];
  costDisclaimer: string | null;
  placeCoords: placeCoords;
  placeName: string;
  placeDirection: string;
  prices: string[];
  quorum: string;
  rules: string[];
  mode: string[] | string[][];
  disclaimer: string | null;
  contact: { kind: string; value: string; }[];
};

type InfoProps = { tournamentInfo: TournamentInfo };

const Info: React.FC<InfoProps> = ({ tournamentInfo }) => {
  const router = useRouter();
  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' });
  const { id } = router.query;

  return (
    <Layout title={id} description={`${id} info`} image={`/data/tournaments/${!!tournamentInfo.imageName ? `${tournamentInfo.id}/${tournamentInfo.imageName}` : 'default.jpg'}`}>
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
        <span className={styles.content}>
          <section className={styles.dateSection}>
            <h2>Fecha</h2>
            <p>{tournamentInfo.date}</p>
          </section>
          <section className={styles.costSection}>
            <h2>Entrada</h2>
            <ul>
              {tournamentInfo.cost.map(c => (
                <li key={c}><b>{c.split(':')[0]}: </b>{c.split(':')[1]}</li>
              ))}
            </ul>
            {tournamentInfo?.costDisclaimer && <p>{tournamentInfo.costDisclaimer}</p>}
          </section>
          <section className={styles.pricesSection}>
            <h2>Premios</h2>
            <ul>
              {tournamentInfo.prices.map(c => (
                <li key={c}><b>{c.split(':')[0]}: </b>{c.split(':')[1]}</li>
              ))}
            </ul>
          </section>
          <section className={styles.quorumSection}>
            <h2>Aforo</h2>
            <p>{tournamentInfo.quorum}</p>
          </section>
          <section className={styles.rulesSection}>
            <h2>Reglas</h2>
            {tournamentInfo.rules.map(c => (
              <p key={c}>{c}</p>
            ))}
          </section>
          <section className={styles.modeSection}>
            <h2>Modalidad</h2>
            <ul>
              {tournamentInfo.mode.map(c => (
                (typeof (c) === 'string')
                  ? (<li key={`${c}`}>● {c}</li>)
                  : (
                    <li key={`${c}`}>
                      ● {c[0]}:
                      <ul>
                        {
                          (c as string[]).slice(1).map((d: string) => (
                            <li key={d} style={{ paddingLeft: '2rem' }}>◦ {d}</li>
                          ))
                        }
                      </ul>
                    </li>
                  )
              ))}
            </ul>
          </section>
          <section className={styles.contactSection}>
            <h2>Contacto</h2>
            <span className={styles.contactIcons}>
              {tournamentInfo.contact.map(c => (
                c.kind === 'whatsapp' ? (
                  <Link href={`https://wa.me/${c.value}?text=Hola, me gustaría participar en el torneo ${tournamentInfo.name}`}>
                    <a target="_blank" rel="noreferrer">
                      <WhatsAppIcon sx={{ color: green[400], fontSize: 60 }} />
                    </a>
                  </Link>
                ) : c.kind == 'discord' ? (
                  <Link href={c.value}>
                    <a target="_blank" rel="noreferrer">
                      <FontAwesomeIcon icon={['fab', 'discord']} size="3x" color="#5865F2" />
                    </a>
                  </Link>
                ) : c.kind == 'instagram' ? (
                  <Link href={c.value}>
                    <a target="_blank" rel="noreferrer">
                      <FontAwesomeIcon icon={['fab', 'instagram']} size="3x" color="#E1306C" />
                    </a>
                  </Link>
                ) : c.kind == 'facebook' ? (
                  <Link href={c.value}>
                    <a target="_blank" rel="noreferrer">
                      <FontAwesomeIcon icon={['fab', 'facebook']} size="3x" color="#1877F2" />
                    </a>
                  </Link>
                ) : c.kind == 'email' ? (
                  <Link href={`mailto:${c.value}`}>
                    <a target="_blank" rel="noreferrer">
                      <EmailIcon sx={{ fontSize: 60 }} />
                    </a>
                  </Link>
                ) : null
              ))}
            </span>
          </section>
          <section className={styles.mapSection}>
            <h2>Dirección</h2>
            <p>{tournamentInfo.placeDirection}</p>
            {isLoaded ? (
              <GoogleMap zoom={12} center={tournamentInfo.placeCoords} mapContainerClassName={styles.mapContainer}>
                <Marker key="marker_pointer" position={tournamentInfo.placeCoords} visible={true} />
                <OverlayView
                  key='marker_overview'
                  position={tournamentInfo.placeCoords}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                  <div
                    style={{
                      background: `#203254`,
                      padding: `7px 12px`,
                      fontSize: '11px',
                      color: `white`,
                      borderRadius: '4px',
                    }}
                  >
                    {tournamentInfo.placeName}
                  </div>
                </OverlayView>
              </GoogleMap>
            ) : <Loading />}
          </section>
        </span>
      </main>
    </Layout >
  )
};

type Params = {
  params: { id: string; name: string; };
  res: { setHeader: (name: string, value: string) => void; };
};

export const getServerSideProps = async ({ params, res }: Params) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1000, stale-while-revalidate=59'
  );

  try {
    const tournamentData = find(propEq('id', params.id), TOURNAMENTS_LIST);
    const rawTournamentInfo = await fetch(`${server}/data/tournaments/${params.id}/info.json`);
    const tournamentInfo = await rawTournamentInfo.json();

    return {
      props: {
        tournamentInfo: mergeAll([tournamentData, tournamentInfo]),
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default Info;
