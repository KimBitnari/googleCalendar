import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'
import EachWeekView from '../components/eachWeekView'
import moment, { Moment as MomentTypes } from 'moment';

const makeWeekArr = (date) => {
  const dateLang = ["일", "월", "화", "수", "목", "금", "토"]
  let day = date.getDay();
  let week = [];
  for (let i = 0; i < 7; i++) {
    let newDate = new Date(date.valueOf() + 86400000 * (i - day));
    week.push({
        year: newDate.getFullYear(),
        month: newDate.getMonth(),
        date: newDate.getDate(),
        dateLang: dateLang[newDate.getDay()]
    });
  }

  return week;
};

export default function Home() {
  let now = new Date();
  let date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let week = makeWeekArr(date);
  const events = useSelector((state) => state.user.event);
  const [allEvents, setAllEvents] = useState([])
  const originEvents = useSelector((state) => state.user.originEvents);

  useEffect(() => {
    const others = []
    for(var i in events) {
      const select = originEvents.filter(e => e.uid == events[i].eventUid);
      others.push({
        ebu: events[i],
        e: select[0]
      })
    }
    console.log(others)
    setAllEvents(others);
  },[]);

  return (
    <Layout>
      <Head>
        <title>Calendar</title>
      </Head>
      <section>
        <div className="w-full pt-4" style={{ minWidth:"1370px" }}>
        {
          week.map((w, index) => {
            const eventData = allEvents.filter(e => moment.utc(e.e.start).local().format('YYYYMD') == (w.year.toString()+(w.month+1).toString()+w.date.toString()))
            return <EachWeekView week={w} index={index} eventData={eventData} key={index} />
          })
        }
        </div>
      </section>
    </Layout>
  )
}
