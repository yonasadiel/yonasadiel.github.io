import type { NextPage } from 'next';
import Head from 'next/head';
import { Fragment, useCallback, useEffect, useState, Dispatch, SetStateAction } from 'react'
import styles from './index.module.scss';
import { OrpheusData } from '../../lib/orpheus/types';
import { getAccessToken } from '../../lib/parthenon/auth';

const ORPHEUS_DATA_KEY = "orpheus_data"

type OrpheusDataProps = {
  onReceivedOrpheusData: (c: OrpheusData) => void
}

const OrpheusDataForm = ({ onReceivedOrpheusData }: OrpheusDataProps) => {
  const [encodedOrpheusData, setEncodedOrpheusData] = useState<string>("")
  const [error, setError] = useState<string>("")
  const updateOrpheusData = () => {
    try {
      const orpheusData = JSON.parse(encodedOrpheusData) as OrpheusData
      onReceivedOrpheusData(orpheusData)
    } catch (e: any) {
      setError("invalid server data")
    }
  }
  return (
    <Fragment>
      <label>Orpheus data</label>
      <input className={styles.orpheusDataInput} onChange={(e) => setEncodedOrpheusData(e.target.value)} />
      <p className={styles.error}>{error}</p>
      <button className={styles.submit} type="button" onClick={updateOrpheusData}>ACCESS</button>
    </Fragment>
  )
}

// const Manager: NextPage = () => {
//   const [accessToken, setAccessToken] = useState<string>("")
//   const [instanceStatus, setInstanceStatus] = useState<InstanceStatus | null>(null)
//   const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
//   const isIdle = (instanceStatus?.status === RUNNING || instanceStatus?.status === TERMINATED)
//   const updateInstanceStatus = useCallback(() => {
//     if (accessToken === "") return
//     if (orpheusData === null) return;
//     getInstance(orpheusData, accessToken, (status) => {
//       setInstanceStatus(status)
//       setLastUpdated(new Date())
//     })
//   }, [accessToken, orpheusData, setInstanceStatus, setLastUpdated])


//   useEffect(() => {
//     if (orpheusData === null) return
//     getAccessToken(orpheusData, setAccessToken)
//   }, [orpheusData])
//   useEffect(updateInstanceStatus, [accessToken])

//   // auto update periodically
//   useEffect(() => {
//     const intervalTime = (instanceStatus?.status === RUNNING || instanceStatus?.status === TERMINATED) ? 10000 : 1000
//     const timer = setInterval(() => {
//       if (accessToken === "") return
//       if (orpheusData === null) return
//       updateInstanceStatus()
//     }, intervalTime)
//     return () => clearInterval(timer)
//   }, [accessToken, orpheusData, instanceStatus])


//   const buttonClass: string[] = [styles.submit]
//   if (instanceStatus?.status === RUNNING) buttonClass.push(styles.red)
//   else if (instanceStatus?.status === TERMINATED) buttonClass.push(styles.green)
//   else buttonClass.push(styles.disabled)


//   return (
//     <Fragment>
//       <div>IP: {instanceStatus ? instanceStatus.ip : " "}</div>
//       <div className={styles.status}>
//         {"STATUS: "}
//         {!!instanceStatus
//           ? displayStatus[instanceStatus.status] || instanceStatus.status
//           : "Checking status..."
//         }
//         <button className={`${styles.reload} ${isIdle ? styles.loading : ""}`} type="button" onClick={updateInstanceStatus}>
//           <img className={`${!isIdle ? styles.loading : " "}`} src="/assets/reload.png" />
//         </button>
//       </div>
//       <p>Last updated: {lastUpdated.toLocaleDateString() + " " + lastUpdated.toLocaleTimeString()}</p>
//       <button
//         className={`${buttonClass.join(" ")}`}
//         type="button"
//         disabled={!isIdle}
//         onClick={() => {
//           setInstanceStatus(null)
//           if (instanceStatus?.status === TERMINATED) startInstance(orpheusData, accessToken, updateInstanceStatus)
//           else if (instanceStatus?.status === RUNNING) stopInstance(orpheusData, accessToken, updateInstanceStatus)
//         }}>
//         {instanceStatus ? (displayButton[instanceStatus.status] || instanceStatus.status) : "START"}
//       </button>
//     </Fragment>
//   )
// }

const loadOrpheusDataFromLocalStorage = (setOrpheusData: Dispatch<SetStateAction<OrpheusData | null>>) => () => {
  const storedOrpheusData = localStorage.getItem(ORPHEUS_DATA_KEY)
  if (storedOrpheusData !== null) {
    try {
      setOrpheusData(JSON.parse(Buffer.from(storedOrpheusData, "base64").toString()))
    } catch (e) {
      console.error(e)
      localStorage.removeItem(ORPHEUS_DATA_KEY)
    }
  }
}

const Manager: NextPage = () => {
  const [orpheusData, setOrpheusData] = useState<OrpheusData | null>(null)
  useEffect(loadOrpheusDataFromLocalStorage(setOrpheusData), [])

  if (orpheusData === null) {
    const handleReceivedOrpheusData = (newOrpheusData: OrpheusData) => {
      localStorage.setItem(ORPHEUS_DATA_KEY, JSON.stringify(newOrpheusData))
      setOrpheusData(newOrpheusData)
    }
    return <OrpheusDataForm onReceivedOrpheusData={handleReceivedOrpheusData} />
  }

  return (
    <div></div>
  )
}

const Parthenon: NextPage = () => {
  return (
    <div className={styles.orpheus}>
      <Head>
        <title>Orpheus</title>
        <link rel="icon" type="image/x-icon" href="/assets/favicon-32.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div className={styles.box}>
        <h1>Orpheus</h1>
        <Manager />
      </div>
    </div>
  )
}

export default Parthenon
