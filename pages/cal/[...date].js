import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import 'tailwindcss/tailwind.css'
import Head from 'next/head'
import Layout from '../../components/layout'
import EachWeekView from '../../components/eachWeekView'
import moment, { Moment as MomentTypes } from 'moment';

export async function getServerSideProps(context) {
    const { date } = context.query;
    //console.log(context.params);

    return { props: 
        {
            year: date[0],
            month: date[1],
            date: date[2]
        } 
    };
}

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

export default function Post({ year, month, date }) {
    let d = new Date(year, month-1, date);
    let week = makeWeekArr(d);
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