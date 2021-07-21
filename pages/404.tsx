import Image from "next/image";
import Layout from "../components/layout";
import styles from '../styles/Home.module.css';
import { ButtonLink } from '../components';

const Custom404 = () => (
  <Layout title="Page Not Found">
    <div className={styles.notFound}>
      <span className={styles.notFoundImage}>
        <Image
          src="/fblthp.jpg"
          alt="lost"
          layout="intrinsic"
          width={600}
          height={447}
        />
      </span>
      <span className={styles.notFoundText}>
        <h1>404</h1>
        <h3>Page Not Found</h3>
        <ButtonLink variant="contained" color="primary" href="/">
          ⬅ Home
        </ButtonLink>
      </span>
    </div>
  </Layout>
);

export default Custom404;