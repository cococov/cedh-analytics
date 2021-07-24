import Image from "next/image";
import Layout from "../components/layout";
import styles from '../styles/Home.module.css';
import { ButtonLink } from '../components';

const Custom500 = () => (
  <Layout title="Server Error">
    <div className={styles.notFound}>
      <span className={styles.notFoundImage}>
        <Image
          src="/images/muddle-the-mixture.jpg"
          alt="Bad"
          layout="intrinsic"
          width={600}
          height={447}
        />
      </span>
      <span className={styles.notFoundText}>
        <h1>500</h1>
        <h3>Server Error</h3>
        <ButtonLink variant="contained" color="primary" href="/">
          ⬅ Home
        </ButtonLink>
      </span>
    </div>
  </Layout>
);

export default Custom500;