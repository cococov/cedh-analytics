import Image from "next/image";
import Layout from "../components/layout";
import styles from '../styles/Error.module.css';
import utilsStyles from '../styles/Utils.module.css';
import Icon from '@material-ui/core/Icon';
import { ButtonLink } from '../components';
import Fblthp from '../public/images/fblthp.jpg';

const Custom404 = () => (
  <Layout title="Page Not Found">
    <div className={styles.error}>
      <span className={styles.errorImageContainer}>
        <Image
          src={Fblthp}
          className={styles.errorImage}
          alt="lost"
          width={600}
          height={447}
          placeholder="blur"
          priority
        />
      </span>
      <span className={styles.errorText}>
        <h1>404</h1>
        <h3>Page Not Found</h3>
        <ButtonLink variant="contained" color="primary" href="/">
          <span className={utilsStyles.leftArrow}>
            <Icon fontSize="small">arrow_right_alt</Icon>
          </span>
          Home
        </ButtonLink>
      </span>
    </div>
  </Layout>
);

export default Custom404;