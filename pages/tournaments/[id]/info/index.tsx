import { useReducer } from 'react';
import { GoogleMap, useLoadScript, Marker, OverlayView } from '@react-google-maps/api';
import { mergeAll, find, propEq } from 'ramda';
import Image from 'next/image';
import Link from 'next/link';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import { green } from '@mui/material/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { Layout, Loading, PriceByPlace, ResponsiveImageDialog } from '../../../../components';
import { server } from '../../../../config';
import styles from '../../../../styles/TournamentInfo.module.css';

import TOURNAMENTS_LIST from '../../../../public/data/tournaments/list.json';

type placeCoords = { lat: number; lng: number };

type ImageDialogState = { isOpen: boolean; image?: string, label?: string };
type ImageDialogPayload = { isOpen?: boolean; image?: string, label?: string };

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
  placePhotos?: { label: string; image: string }[];
  prices: { place: string; name: string; info: string; image: string; }[];
  quorum: string;
  rules: string[];
  mode: string[] | string[][];
  disclaimer: string | null;
  contact: { kind: string; value: string; }[];
  auspices: { name: string, image: string, link?: string, rectangle?: boolean }[];
};

type InfoProps = { tournamentInfo: TournamentInfo };

const Info: React.FC<InfoProps> = ({ tournamentInfo }) => {
  const theme = useTheme();
  const [imageDialogPayload, toggleImageDialog] = useReducer((state: ImageDialogState, { label, image }: ImageDialogPayload) => ({ image, label, isOpen: !state.isOpen }), { isOpen: false, image: '', label: '' });
  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' });
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isPortrait = useMediaQuery('(min-width:600px)');

  return (
    <Layout title={tournamentInfo.name} description={`${tournamentInfo.name} info`} image={`/data/tournaments/${!!tournamentInfo.imageName ? `${tournamentInfo.id}/${tournamentInfo.imageName}` : 'default.jpg'}`}>
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
          {tournamentInfo.showName && (<span className={styles.title}><h1>{tournamentInfo.name.split(' - ')[0]}</h1><h2>{tournamentInfo.name.split(' - ')[1]}</h2></span>)}
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
            <span className={styles.pricesWrapper}>
              {tournamentInfo.prices.map((c, i) => (
                <PriceByPlace key={i} image={`/data/tournaments/${tournamentInfo.id}/prices/${c.image}`} place={c.place} name={c.name} info={c.info} />
              ))}
            </span>
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
                  ? (<li key={`${c}`}>{c}</li>)
                  : (
                    <li key={`${c}`}>
                      {c[0]}:
                      <ul>
                        {
                          (c as string[]).slice(1).map((d: string) => (
                            <li key={d} style={{ paddingLeft: '2rem' }}>{d}</li>
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
                  <Link key={`key-${c.kind}`} href={`https://wa.me/${c.value}?text=Hola, me gustaría participar en el torneo ${tournamentInfo.name}`}>
                    <a target="_blank" rel="noreferrer">
                      <WhatsAppIcon sx={{ color: green[400], fontSize: 60 }} />
                    </a>
                  </Link>
                ) : c.kind == 'discord' ? (
                  <Link key={`key-${c.kind}`} href={c.value}>
                    <a target="_blank" rel="noreferrer">
                      <FontAwesomeIcon icon={['fab', 'discord']} size="3x" color="#5865F2" />
                    </a>
                  </Link>
                ) : c.kind == 'instagram' ? (
                  <Link key={`key-${c.kind}`} href={c.value}>
                    <a target="_blank" rel="noreferrer">
                      <FontAwesomeIcon icon={['fab', 'instagram']} size="3x" color="#E1306C" />
                    </a>
                  </Link>
                ) : c.kind == 'facebook' ? (
                  <Link key={`key-${c.kind}`} href={c.value}>
                    <a target="_blank" rel="noreferrer">
                      <FontAwesomeIcon icon={['fab', 'facebook']} size="3x" color="#1877F2" />
                    </a>
                  </Link>
                ) : c.kind == 'email' ? (
                  <Link key={`key-${c.kind}`} href={`mailto:${c.value}`}>
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
            {!!tournamentInfo.placePhotos && (
              <span className={styles.placePhotos}>
                {tournamentInfo.placePhotos.map(({ image, label }, i) => (
                  <span className={styles.placePhoto} onClick={() => toggleImageDialog({ image: `/data/tournaments/${tournamentInfo.id}/place/${image}`, label: label })} >
                    <Image
                      key={i}
                      src={`/data/tournaments/${tournamentInfo.id}/place/${image}`}
                      alt={`place-photo-${i}`}
                      height={isSmallScreen ? (isPortrait ? 140.6 : 224) : 112}
                      width={isSmallScreen ? (isPortrait ? 250 : 400) : 200}
                    />
                  </span>
                ))}
              </span>
            )}
          </section>
          <section className={styles.auspicesSection}>
            <h2>Auspician</h2>
            <span className={styles.auspicesWrapper}>
              {tournamentInfo.auspices.map((c, i) => (
                <span className={styles.auspice}>
                  <Link key={`key-${c.name}`} href={c.link || "#"}>
                    <a target="_blank" rel="noreferrer">
                      <Image
                        key={i}
                        src={`/data/tournaments/${tournamentInfo.id}/auspices/${c.image}`}
                        alt={c.name}
                        height={150}
                        width={c.rectangle ? 200 : 150}
                        quality={100}
                      />
                    </a>
                  </Link>
                </span>
              ))}
            </span>
          </section>
        </span>
        <ResponsiveImageDialog imageDialogPayload={imageDialogPayload} handleToggle={toggleImageDialog} />
      </main >
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
