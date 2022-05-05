import Header from '../header';
import Footer from '../footer';
import NavBar from '../navBar';
import styles from '../../styles/Home.module.css';

const Layout: React.FC<{
  title: string | string[] | undefined,
  description?: string | undefined
}> = ({ children, title, description }) => {
  return (
    <div className={styles.container}>
      <Header title={title} description={description} />
      <NavBar />
      {children}
      <Footer />
    </div >
  )
}

export default Layout;