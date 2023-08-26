import Image from "next/image";
import { NextPage } from 'next';
import Layout from "../components/layout";
import styles from '../styles/Error.module.css';
import { ButtonLink } from '../components';
import Icon from '@material-ui/core/Icon';
import OathOfLilianaImg from '../public/images/Oath_of_Liliana.jpg';
import utilsStyles from '../styles/Utils.module.css';

interface Props {
  statusCode?: number;
}

const Error: NextPage<Props> = ({ statusCode }) => (
  <Layout title={`statusCode`}>
    <div className={styles.error}>
      <span className={styles.errorImage}>
        <Image
          src={OathOfLilianaImg}
          alt="Bad"
          layout="intrinsic"
          width={600}
          height={447}
          placeholder="blur"
          priority
        />
      </span>
      <span className={styles.errorText}>
        <h1>{statusCode}</h1>
        <h3>Error</h3>
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

Error.getInitialProps = async ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode: statusCode }
}

export default Error;