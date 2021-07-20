import Link from "next/link";
import Button from '@material-ui/core/Button';
import Image from "next/image";
import Layout from "../components/layout";
import styles from '../styles/Home.module.css';

const custom404 = () => (
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
        <Button variant="contained" color="primary">
          <Link href="/">
            ⬅ Home
          </Link>
        </Button>
      </span>
    </div>
  </Layout>
);

export default custom404;