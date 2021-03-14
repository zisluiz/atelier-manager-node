import Head from 'next/head'
//import styles from '../styles/Home.module.css'
import ServiceRequisitionPage from 'src/ui/form/ServiceRequisitionPage'
import React from 'react';
import { Service } from 'src/model/Service';

export default function Home() {
  const [service, setService] = React.useState<Service>(new Service(0, null, null, "", new Date(), 0.00, []));

  function handleServiceUpdate(service:Service) {
    setService(service);
  }

  return (
    <div>
      <Head>
        <title>Requisição de serviço</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <div>
          {service.id == 0 &&
            <ServiceRequisitionPage service={service} handleServiceUpdate={handleServiceUpdate} />
          }
          {service.id > 0 &&
            "AAAAAAA"
          }
      </div>
        
      </main>
    </div>

    /*<div className={styles.container}>
      <Head>
        <title>Requisição de serviço</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>        
        
        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>*/
  )
}
