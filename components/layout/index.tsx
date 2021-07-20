import Header from '../header';
import Footer from '../footer';
import styles from '../../styles/Home.module.css';

const Layout: React.FC<{
  title: string | string[] | undefined,
  description?: string | undefined
}> = ({ children, title, description }) => {
  return (
    <div className={styles.container}>
      <Header title={title} description={description} />
      {children}
      <Footer />
    </div >
  )
}

export default Layout;