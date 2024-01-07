'use client'

import type { NextPage } from 'next'
import Head from 'next/head';
import { Fragment, useCallback, useEffect, useState } from 'react'
import { InstanceStatus, ServerData } from '../../lib/parthenon/types';
import { getAccessToken } from '../../lib/parthenon/auth';
import {
  TERMINATED, RUNNING,
  getInstance,
  startInstance,
  stopInstance,
} from '../../lib/parthenon/instances';
import styles from './styles.module.scss';

const SERVER_DATA_KEY = "parthenon_server_data"

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
  const [instanceStatus, setInstanceStatus] = useState<InstanceStatus | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const isIdle = (instanceStatus?.status === RUNNING || instanceStatus?.status === TERMINATED)
  const updateInstanceStatus = useCallback(() => {
    if (accessToken === "") return
    if (serverData === null) return;
    getInstance(serverData, accessToken, (status) => {
      setInstanceStatus(status)
      setLastUpdated(new Date())
    })
  }, [accessToken, serverData, setInstanceStatus, setLastUpdated])

  useEffect(() => {
    const storedServerData = localStorage.getItem(SERVER_DATA_KEY)
    if (storedServerData !== null) {
      try {
        setServerData(JSON.parse(Buffer.from(storedServerData, "base64").toString()))
      } catch (e) {
        console.error(e)
        localStorage.removeItem(SERVER_DATA_KEY)
      }
    }
  }, [])

  useEffect(() => {
    if (serverData === null) return
    getAccessToken(serverData, setAccessToken)
  }, [serverData])
  useEffect(updateInstanceStatus, [accessToken])

  // auto update periodically
  useEffect(() => {
    const intervalTime = (instanceStatus?.status === RUNNING || instanceStatus?.status === TERMINATED) ? 10000 : 1000
    const timer = setInterval(() => {
      if (accessToken === "") return
      if (serverData === null) return
      updateInstanceStatus()
    }, intervalTime)
    return () => clearInterval(timer)
  }, [accessToken, serverData, instanceStatus])

  if (serverData === null) {
    const handleReceivedServerData = (newServerData: ServerData) => {
      localStorage.setItem(SERVER_DATA_KEY, Buffer.from(JSON.stringify(newServerData)).toString("base64"))
      setServerData(newServerData)
    }
    return <ServerDataForm onReceivedServerData={handleReceivedServerData} />
  }

  const buttonClass: string[] = [styles.submit]
  if (instanceStatus?.status === RUNNING) buttonClass.push(styles.red)
  else if (instanceStatus?.status === TERMINATED) buttonClass.push(styles.green)
  else buttonClass.push(styles.disabled)


  return (
    <Fragment>
      <div>IP: {instanceStatus ? instanceStatus.ip : " "}</div>
      <div className={styles.status}>
        {"STATUS: "}
        {!!instanceStatus
          ? displayStatus[instanceStatus.status] || instanceStatus.status
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
          if (instanceStatus?.status === TERMINATED) startInstance(serverData, accessToken, updateInstanceStatus)
          else if (instanceStatus?.status === RUNNING) stopInstance(serverData, accessToken, updateInstanceStatus)
        }}>
        {instanceStatus ? (displayButton[instanceStatus.status] || instanceStatus.status) : "START"}
      </button>
    </Fragment>
  )
}

const Parthenon: NextPage = () => {
  return (
    <div className={styles.parthenon}>
      <Head>
        <title>Parthenon</title>
      </Head>
      <div className={styles.box}>
        <h1>Parthenon</h1>
        <Manager />
      </div>
    </div>
  )
}

export default Parthenon
