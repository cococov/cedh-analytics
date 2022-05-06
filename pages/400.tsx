import Image from "next/image";
import Layout from "../components/layout";
import styles from '../styles/Home.module.css';
import utilsStyles from '../styles/Utils.module.css';
import { ArrowRightAlt } from '@material-ui/icons';
import { ButtonLink } from '../components';
import OathOfLiliana from '../public/images/Oath_of_Liliana.jpg';

const Custom400 = () => (
  <Layout title="Bad Request">
    <div className={styles.notFound}>
      <span className={styles.notFoundImage}>
        <Image
          src={OathOfLiliana}
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
          <span className={utilsStyles.leftArrow}>
            <ArrowRightAlt fontSize="small" />
          </span>
          Home
        </ButtonLink>
      </span>
    </div>
  </Layout>
);

export default Custom400;