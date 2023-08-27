import Header from '../header';
import Footer from '../footer';
import NavBar from '../navBar';
import { AppProvider } from '../../contexts';
import styles from '../../styles/Home.module.css';

const Layout: React.FC<{
  children?: any,
  title: string | undefined,
  description?: string | undefined
  image?: string | undefined
  externalImage?: boolean | undefined
}> = ({ children, title, description, image, externalImage }) => {
  return (
    <AppProvider>
      <div className={styles.container}>
        <Header title={title || ''} description={description} image={image} externalImage={externalImage} />
        <NavBar />
        {children}
        <Footer />
      </div >
    </AppProvider>
  )
}

export default Layout;