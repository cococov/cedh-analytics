import Image from "next/image";
import Layout from "../components/layout";
import styles from '../styles/Error.module.css';
import utilsStyles from '../styles/Utils.module.css';
import Icon from '@material-ui/core/Icon';
import { ButtonLink } from '../components';
import MuddleTheMixture from '../public/images/muddle-the-mixture.jpg';

const Custom500 = () => (
  <Layout title="Server Error">
    <div className={styles.error}>
      <span className={styles.errorImage}>
        <Image
          src={MuddleTheMixture}
          alt="Bad"
          layout="intrinsic"
          width={600}
          height={447}
          placeholder="blur"
          priority
        />
      </span>
      <span className={styles.errorText}>
        <h1>500</h1>
        <h3>Server Error</h3>
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

export default Custom500;