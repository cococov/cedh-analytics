/* Own */
import CommandersTable from '../commandersTable';
/* Static */
import styles from '../../styles/CardsList.module.css';

async function getData(commandersURL: string) {
  const rawCommanders = await fetch(commandersURL);
  const commanders = await rawCommanders.json();

  return {
    commanders,
  };
};

export default async function AsyncCommandersTable({
  title,
  commandersURL,
  noCommanderPage,
}: {
  title?: string,
  commandersURL: string,
  noCommanderPage?: boolean,
}) {
  const { commanders } = await getData(commandersURL);
  return (
    <span className={styles.commandersContainer}>
      <CommandersTable
        title={title || "Commanders"}
        commanders={commanders}
        noCommanderPage={noCommanderPage}
      />
    </span>
  );
};
