import type { NextPage } from 'next'
import Head from 'next/head';
import { Fragment, useCallback, useEffect, useState } from 'react'
import { clearInterval } from 'timers';
import styles from './index.module.scss';
import { ServerData } from '../../lib/parthenon/types';
import { getAccessToken } from '../../lib/parthenon/auth';
import {
  TERMINATED, RUNNING,
  getInstance,
  startInstance,
  stopInstance,
} from '../../lib/parthenon/instances';

const displayStatus: {[status: string]: string} = {
  [TERMINATED]: "OFFLINE",
  [RUNNING]: "ONLINE",
}
const displayButton: {[status: string]: string} = {
  [TERMINATED]: "START",
  [RUNNING]: "STOP",
}

type ServerDataProps = {
  onReceivedServerData: (c: ServerData) => void
}

const ServerDataForm = ({ onReceivedServerData }: ServerDataProps) => {
  const [encodedServerData, setEncodedServerData] = useState<string>("")
  const [error, setError] = useState<string>("")
  const updateServerData = () => {
    try {
      const serverData = JSON.parse(Buffer.from(encodedServerData, "base64").toString()) as ServerData
      onReceivedServerData(serverData)
    } catch (e: any) {
      setError("invalid server data")
    }
  }
  return (
    <Fragment>
      <label>Server data</label>
      <textarea className={styles.serverData} onChange={(e) => setEncodedServerData(e.target.value)}></textarea>
      <p className={styles.error}>{error}</p>
      <button className={styles.submit} type="button" onClick={updateServerData}>ACCESS</button>
    </Fragment>
  )
}

const Manager: NextPage = () => {
  const [serverData, setServerData] = useState<ServerData | null>(null)
  const [accessToken, setAccessToken] = useState<string>("")
  const [instanceStatus, setInstanceStatus] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const updateInstanceStatus = useCallback(() => {
    if (accessToken === "") return
    if (serverData === null) return;
    getInstance(serverData, accessToken, (status) => {
      setInstanceStatus(status)
      setLastUpdated(new Date())
    })
  }, [accessToken, serverData, setInstanceStatus, setLastUpdated])

  useEffect(() => {
    if (serverData === null) return
    if (accessToken !== "") return //DEBUG
    getAccessToken(serverData, setAccessToken)
  }, [serverData])
  useEffect(updateInstanceStatus, [accessToken])

  // auto update periodically
  useEffect(() => {
    const timer = setInterval(() => {
      if (accessToken === "") return
      if (serverData === null) return
      updateInstanceStatus()
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  if (serverData === null) {
    return <ServerDataForm onReceivedServerData={setServerData} />
  }

  const buttonClass: string[] = [styles.submit]
  if (instanceStatus === RUNNING) buttonClass.push(styles.red)
  else if (instanceStatus === TERMINATED) buttonClass.push(styles.green)
  else buttonClass.push(styles.disabled)

  const isIdle = (instanceStatus === RUNNING || instanceStatus === TERMINATED)

  return (
    <Fragment>
      <div className={styles.status}>
        {"STATUS: "}
        {!!instanceStatus
          ? displayStatus[instanceStatus] || instanceStatus
          : "Checking status..."
        }
        <button className={`${styles.reload} ${isIdle ? styles.loading : ""}`} type="button" onClick={updateInstanceStatus}>
          <img className={`${!isIdle ? styles.loading : " "}`} src="/assets/reload.png" />
        </button>
      </div>
      <p>Last updated: {lastUpdated.toLocaleDateString() + " " + lastUpdated.toLocaleTimeString()}</p>
      <button
        className={`${buttonClass.join(" ")}`}
        type="button"
        disabled={!isIdle}
        onClick={() => {
          setInstanceStatus(null)
          if (instanceStatus === TERMINATED) startInstance(serverData, accessToken, updateInstanceStatus)
          else if (instanceStatus === RUNNING) stopInstance(serverData, accessToken, updateInstanceStatus)
        }}>
        {instanceStatus ? (displayButton[instanceStatus] || instanceStatus) : "START"}
      </button>
    </Fragment>
  )
}

const Parthenon: NextPage = () => {
  return (
    <div className={styles.parthenon}>
      <Head>
        <title>Parthenon</title>
        <link rel="icon" type="image/x-icon" href="/assets/favicon-32.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"></link>
      </Head>
      <div className={styles.box}>
        <h1>Parthenon</h1>
        <Manager />
      </div>
    </div>
  )
}

export default Parthenon
