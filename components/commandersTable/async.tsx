/* Own */
import CommandersTable from '../commandersTable';
/* Static */
import styles from '../../styles/CardsList.module.css';

async function getData(commandersURL: string) {
  const rawCards = await fetch(commandersURL);
  const commanders = await rawCards.json();

  return {
    commanders,
  };
};

export default async function AsyncCommandersTable({
  title,
  commandersURL,
}: {
  title?: string,
  commandersURL: string,
}) {
  const { commanders } = await getData(commandersURL);
  return (
    <span className={styles.commandersContainer}>
      <CommandersTable
        title={title || "Commanders"}
        commanders={commanders}
      />
    </span>
  );
};