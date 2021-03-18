import React from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import ServiceRequisitionController from 'src/controller/ServiceRequisitionController';
import { Service } from 'src/model/Service';
import ServiceRequisitionForm from 'src/ui/form/ServiceRequisitionForm'
import ServiceExecutionForm from 'src/ui/form/ServiceExecutionForm';

export default function Home() {
  const [controller] = React.useState(new ServiceRequisitionController());
  //const [service, setService] = React.useState<Service>(controller.createNewService());
  const [service, setService] = React.useState<Service>(controller.createFilledService());

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
            <ServiceRequisitionForm controller={controller} service={service} handleServiceUpdate={handleServiceUpdate} />
          }
          {service.id > 0 &&
            <ServiceExecutionForm controller={controller} service={service} handleServiceUpdate={handleServiceUpdate} />
          }
      </div>
        
      </main>
    </div>

    /*<footer className={styles.footer}>
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
