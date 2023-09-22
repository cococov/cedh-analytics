/* Own */
import CommandersTable from '../commandersTable';

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
    <CommandersTable
      title={title || "Commanders"}
      commanders={commanders}
    />
  );
};
