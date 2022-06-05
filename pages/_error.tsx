import Image from "next/image";
import { NextPage } from 'next';
import Layout from "../components/layout";
import styles from '../styles/Home.module.css';
import { ButtonLink } from '../components';

interface Props {
  statusCode?: number;
}

const Error: NextPage<Props> = ({ statusCode }) => (
  <Layout title={`statusCode`}>
    <div className={styles.notFound}>
      <span className={styles.notFoundImage}>
        <Image
          src="/images/Oath_of_Liliana.jpg"
          alt="Bad"
          layout="intrinsic"
          width={600}
          height={447}
          placeholder="blur"
          priority
        />
      </span>
      <span className={styles.notFoundText}>
        <h1>{statusCode}</h1>
        <h3>Error</h3>
        <ButtonLink variant="contained" color="primary" href="/">
          ⬅ Home
        </ButtonLink>
      </span>
    </div>
  </Layout>
);

Error.getInitialProps = async ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode: statusCode }
}

export default Error;