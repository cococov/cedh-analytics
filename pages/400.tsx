import Image from "next/image";
import Layout from "../components/layout";
import styles from '../styles/Home.module.css';
import { ButtonLink } from '../components';

const custom400 = () => (
  <Layout title="Bad Request">
    <div className={styles.notFound}>
      <span className={styles.notFoundImage}>
        <Image
          src="/Oath_of_Liliana.jpg"
          alt="Bad"
          layout="intrinsic"
          width={600}
          height={447}
        />
      </span>
      <span className={styles.notFoundText}>
        <h1>400</h1>
        <h3>Bad Request</h3>
        <ButtonLink variant="contained" color="primary" href="/">
          ⬅ Home
        </ButtonLink>
      </span>
    </div>
  </Layout>
);

export default custom400;