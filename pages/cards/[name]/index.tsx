import { useRouter } from 'next/router'
import styles from '../../../styles/Home.module.css';
import { CardInfoPage, Layout } from '../../../components';
import { AppProvider, CardProvider } from '../../../contexts';


const Cards = () => {
  const router = useRouter()
  const { name } = router.query
  return (
    <div className={styles.container}>
      <Layout title={name} description={`${name} info.`}>
        <AppProvider>
          <main className={styles.main}>
            <CardProvider>
              <CardInfoPage name={typeof (name) === "string" ? name : ''} />
            </CardProvider>
          </main>
        </AppProvider>
      </Layout>
    </div >
  )
}

export default Cards;
