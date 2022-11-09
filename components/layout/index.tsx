import Header from '../header';
import Footer from '../footer';
import NavBar from '../navBar';
import { AppProvider } from '../../contexts';
import styles from '../../styles/Home.module.css';

const Layout: React.FC<{
  title: string | string[] | undefined,
  description?: string | undefined
}> = ({ children, title, description }) => {
  return (
    <AppProvider>
      <div className={styles.container}>
        <Header title={title} description={description} />
        <NavBar />
        {children}
        <Footer />
      </div >
    </AppProvider>
  )
}

export default Layout;