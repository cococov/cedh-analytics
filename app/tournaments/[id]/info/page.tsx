import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
/* Vendor */
import { mergeAll, find, propEq } from 'ramda';
import { green } from '@mui/material/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* Own */
import { openGraphMetadata, twitterMetadata, descriptionMetadata } from '@shared-metadata';
import GoogleMap from '@/components/googleMap';
import PriceByPlace from '@/components/priceByPlace';
import ResponsiveImageDialog from '@/components/responsiveImageDialog';
import { MaterialWhatsAppIcon, MaterialEmailIcon } from '@/components/vendor/materialIcon';
import { TournamentInfoProvider } from '@/contexts/tournamentInfoStore';
import type { EventInfo, EventData } from './TournamentInfo';
/* Static */
import TOURNAMENTS_LIST from '@public/data/tournaments/list.json';
import styles from '@/styles/TournamentInfo.module.css';
import { server } from '@config';

type PageData = {
  tournamentInfo: EventData & EventInfo,
};

type ErrorData = { notFound: boolean };
type ResponseData = PageData & ErrorData | ErrorData;
type Params = { id: string | string[] | undefined };

export async function generateMetadata({
  params,
}: {
  params: Params,
}): Promise<Metadata> {
  const tournamentInfo = find(propEq(String(params.id), 'id'), TOURNAMENTS_LIST);
  const description = `${tournamentInfo?.name} info | ${descriptionMetadata}`;
  const image = `/data/tournaments/${!!tournamentInfo?.imageName ? `${tournamentInfo?.id}/${`small_${tournamentInfo?.imageName}`}` : 'default.jpg'}`;

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
    const tournamentData = find(propEq(String(id), 'id'), TOURNAMENTS_LIST);
    const rawTournamentInfo = await fetch(`${server}/data/tournaments/${String(id)}/info.json`);
    const tournamentInfo: EventInfo = await rawTournamentInfo.json();

    return {
      tournamentInfo: mergeAll([tournamentData as EventData, tournamentInfo]),
      notFound: false,
    };
  } catch (err) {
    return { notFound: true };
  }
};

export default async function TournamentInfo({
  params
}: {
  params: Params
}) {
  const response = await fetchData({ id: decodeURI(String(params.id)) });

  if (response.notFound) notFound();

  const { tournamentInfo } = response as PageData;

  return (
    <main className={styles.main}>
      <TournamentInfoProvider>
        <section className={styles.tournamentImageContainer}>
          <Image
            className={styles.tournamentImage}
            src={`/data/tournaments/${!!tournamentInfo.imageName ? `${tournamentInfo.id}/${tournamentInfo.imageName}` : 'default.jpg'}`}
            alt={`${tournamentInfo.id} Image`}
            height={1920}
            width={1080}
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
                <PriceByPlace key={i} image={`/data/tournaments/${tournamentInfo.id}/prices/${c.image}`} place={c.place} name={c.name} info={c.info} isCard={c.isCard} small={c.small} />
              ))}
            </span>
          </section>
          <section className={styles.quorumSection}>
            <h2>Aforo</h2>
            <p>{tournamentInfo.quorum}</p>
          </section>
          <section className={styles.rulesSection}>
            <h2>Reglas</h2>
            <h3>Decklist</h3>
            <p>Los jugadores inscritos deberán registrar el listado de mazo a través de <a href="https://moxfield.com" className={styles.infoLink}>Moxfield</a>.</p>
            <p>Deberán asegurarse que el link de acceso funcione correctamente y que sus listas no cuenten con ninguna variación antes de comenzar la ronda 1 del torneo. Al inicio de la primera ronda la organización duplicará cada lista enviada y esa será la lista oficial a utilizar en el torneo.</p>
            <br />
            <ul>
              <li><a href="https://magic.wizards.com/en/game-info/gameplay/rules-and-formats/rules" className={styles.infoLink}>Basic & Comprehensive Rules</a></li>
              <li><a href="https://magic.wizards.com/en/content/commander-format" className={styles.infoLink}>Basic Commander Rules & Banned List</a></li>
              <li><a href="https://mtgcommander.net/index.php/rules" className={styles.infoLink}>RC Commander Rules</a></li>
            </ul>
            <h3>Test Cards</h3>
            <p>Se podrá jugar con Playtest Cards. Estas cartas deben ser llevadas por los mismos jugadores y cumplir con lo siguiente:</p>
            <ul className={styles.listWithDots}>
              <li>Todas las test cards deben estar a color con una buena calidad de impresión.</li>
              <li>Sus dimensiones deben ser las correctas en tamaño y grosor.</li>
              <li>Todas las test cards deben tener ilustraciones oficiales de MTG (se permiten ilustraciones de MTGO).</li>
              <li>Se permiten cartas de ediciones internacionales y de campeones mundiales.</li>
              <li>Máximo de 5 cartas con arte alterado. Deben tener su nombre y cuadro de texto completamente legibles.</li>
              <li>No se permiten alters ofensivos.</li>
              <li>Si tiene cartas en idiomas que no sean español o inglés, o que tengan su cuadro de texto ilegible por alters u otros, deberá portar una copia legible, en idioma español o inglés, en caso de consultas.</li>
            </ul>
            <h3>Spite play, Kingmaking y Conceder</h3>
            <p>
              Alentamos a todos a jugar de la mejor manera posible y buscamos evitar actos de venganza y juegos desafiantes. Somos conscientes que no podemos impedir que las personas realicen acciones de juego, como contrarrestar el combo ganador del juego de un oponente con un Pacto de Negación sabiendo que uno no puede pagarlo en el siguiente mantenimiento y, por lo tanto, morirá con el trigger. Por lo tanto, apelamos a la deportividad de nuestros participantes: hagamos juegos buenos y justos.
            </p>
            <p>
              Ahora, si un jugador no tiene los recursos suficientes para poder llevarse la victoria, quedará bajo el criterio de la organización del torneo y del juez del mismo, la sanción a jugadores que realicen jugadas que beneficien deliberadamente a otro jugador con el fin de que este último se lleve la victoria. Sanciones que pueden ir desde la advertencia hasta la descalificación del torneo.
            </p>
            <p>
              En este mismo sentido, se espera que los jugadores NO actúen por factores externos a la partida actual, incluyendo la tabla de posiciones.
            </p>
            <p>
              Finalmente, queda prohibido el conceder durante el desarrollo de una partida. Si un jugador no puede continuar con el torneo, deberá dar aviso a la organización para su baja voluntaria drop del mismo.
            </p>
            <h3>Sanciones por problemas formales con el deck</h3>
            <p>
              Si durante el torneo, por cualquier motivo o razón se descubre que un mazo no coincide la lista informada con la que se está jugando o existe un error relacionado con las reglas de construcción del mazo de commander habrá que distinguir distintas situaciones.
            </p>
            <p><b>(A)</b> Si se descubre entre rondas:</p>
            <ol>
              <li>
                Si existe una carta faltante, se hará rápidamente una búsqueda de la carta e investigación sumaria. Es común que a veces cartas sean tomadas por equivocación por algún contrincante. El juez junto con los organizadores del evento teniendo a la vista los antecedentes obtenidos sumariamente tomarán la decisión de dar un warning o no al jugador, en atención a la importancia de la carta, circunstancias en que se pudo haber perdido, por ejemplo, si fue jugada o no, si sus oponentes recuerdan que la carta se jugó o no. Si la carta no aparece será reemplazada por una tierra básica.
              </li>
              <li>
                Si existen cartas adicionales al máximo permitido o más de una copia de lo que se permite una carta, los jueces y los organizadores harán una investigación sumaria del asunto, y las sanciones que puede acarrear el jugador son warning o una descalificación del torneo si se determina que el jugador lo hizo con la intención de hacer trampa.
              </li>
              <li>
                Si no existe concordancia entre el mazo registrado y el mazo presentado, pero cumple con todas las reglas de construcción de mazos en commander la sanción será un warning. Sin perjuicio de lo anterior, si se probara que durante el transcurso del torneo jugó alguna de las cartas que estaban en el mazo registrado y que ahora faltan en el mazo presentado, se entenderá que el jugador modificó su mazo en el transcurso del torneo y la sanción será la descalificación.
              </li>
            </ol>
            <p>
              <b>(B)</b> Si cualquiera de las situaciones descritas en el punto <b>A</b> es descubierta durante el transcurso de una ronda, la sanción será Game Loss más un warning. El jugador será retirado de la mesa y los jugadores restantes seguirán la partida. Si la situación se da en la mitad de la resolución de una pila, el juez determinará cómo se resuelve la misma y en qué estado dejar o retrotraer el juego. Inmediatamente se comenzará una investigación por el juez, que junto con los organizadores del torneo analizarán si se le aplica una descalificación del torneo.
            </p>
            <p>
              Se les recomienda a todos los jugadores, que, una vez terminada una ronda, cuenten las cartas de su mazo. <b>La obligación de presentar el mazo de forma correcta en cada una de las rondas es obligación del jugador.</b>
            </p>
            <p className={styles.rulesDisclaimer}>Para más información sobre conceptos mencionados en las reglas, ver nuestro <Link href='/glossary' className={styles.infoLink}>Glosario de cEDH</Link>.</p>
          </section>
          <section className={styles.modeSection}>
            <h2>Estructura del torneo</h2>
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
          <section className={styles.scheduleSection}>
            <h2>Horario</h2>
            <ul>
              {tournamentInfo.schedule.map(c => (
                <li key={c.time}>
                  <span className={styles.scheduleSectionTime}>{c.time}:</span>
                  <span className={styles.scheduleSectionEvent}>{c.event}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className={styles.contactSection}>
            <h2>Contacto</h2>
            <span className={styles.contactIcons}>
              {tournamentInfo.contact.map(c => (
                c.kind === 'whatsapp' ? (
                  <Link key={`key-${c.kind}`} href={`https://wa.me/${c.value}?text=Hola, me gustaría participar en el torneo ${tournamentInfo.name}`} target="_blank" rel="noreferrer">
                    <MaterialWhatsAppIcon sx={{ color: green[400], fontSize: 60 }} />
                  </Link>
                ) : c.kind == 'discord' ? (
                  <Link key={`key-${c.kind}`} href={c.value} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={['fab', 'discord']} size="3x" color="#5865F2" />
                  </Link>
                ) : c.kind == 'instagram' ? (
                  <Link key={`key-${c.kind}`} href={c.value} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={['fab', 'instagram']} size="3x" color="#E1306C" />
                  </Link>
                ) : c.kind == 'facebook' ? (
                  <Link key={`key-${c.kind}`} href={c.value} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={['fab', 'facebook']} size="3x" color="#1877F2" />
                  </Link>
                ) : c.kind == 'email' ? (
                  <Link key={`key-${c.kind}`} href={`mailto:${c.value}`} target="_blank" rel="noreferrer">
                    <MaterialEmailIcon sx={{ fontSize: 60 }} />
                  </Link>
                ) : null
              ))}
            </span>
          </section>
          <section className={styles.mapSection}>
            <h2>Dirección</h2>
            <p>{tournamentInfo.placeDirection}</p>
            <GoogleMap
              mapClassName={styles.mapContainer}
              placeCoords={tournamentInfo.placeCoords}
              placeName={tournamentInfo.placeName}
              placePhotos={tournamentInfo.placePhotos}
              basePathImages={`/data/tournaments/${tournamentInfo.id}/place`}
              placePhotosClassName={styles.placePhotos}
              placePhotoClassName={styles.placePhoto}
            />
          </section>
          <section className={styles.auspicesSection}>
            <h2>Nos Apoyan</h2>
            <span className={styles.auspicesWrapper}>
              {tournamentInfo.auspices.map((c, i) => (
                <span className={styles.auspice} key={`key-span-${c.name}`}>
                  <Link key={`key-${c.name}`} href={c.link || "#"} target="_blank" rel="noreferrer">
                    <Image
                      key={i}
                      src={`/data/tournaments/${tournamentInfo.id}/auspices/${c.image}`}
                      alt={c.name}
                      height={c.bigLogo ? 100 : 150}
                      width={c.bigLogo ? (c.rectangle ? 134 : 100) : (c.rectangle ? 200 : 150)}
                      quality={100}
                    />
                  </Link>
                </span>
              ))}
            </span>
          </section>
        </span>
        <ResponsiveImageDialog />
      </TournamentInfoProvider>
    </main >
  );
};
