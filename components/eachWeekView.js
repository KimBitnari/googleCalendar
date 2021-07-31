import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css'
import TableBody from './tableBody';
import moment, { Moment as MomentTypes } from 'moment';

export default function EachWeekView (props) {
    let now = new Date();
    const t = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    let isTodayDate = props.week.month === now.getMonth() && props.week.date === now.getDate() ? 'bg-blue-600 text-white rounded-3xl mx-4' : '';
    let isTodayLang = props.week.month === now.getMonth() && props.week.date === now.getDate() ? 'text-blue-600' : '';
    let isFirst = props.index === 0 ? 'ml-12' : '';

    return <div className={`float-left w-1/9 text-center ${isFirst}`}>
        <p className={`text-xs ${isTodayLang}`}>{props.week.dateLang}</p>
        <p className={`text-2xl mb-3 ${isTodayDate}`}>{props.week.date}</p>
        <table className="border-collapse border border-gray-300 w-full border-r-0 mb-5">
                <tbody>
                    {
                        t.map((tc, index) => {
                            //moment.utc(e.e.start).local().format().slice(11, 16).replace(":", "")
                            const timeData = props.eventData.filter(e => moment.utc(e.e.start).local().format("HH") == tc)
                            return <TableBody timeData={timeData} weekIdx={index} key={index} />
                        })
                    }
                </tbody>
        </table>
        <div className="absolute text-gray-400 text-xs" style={{ top:"174px", left:"270px" }}>1 AM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"218px", left:"270px" }}>2 AM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"262px", left:"270px" }}>3 AM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"306px", left:"270px" }}>4 AM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"350px", left:"270px" }}>5 AM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"394px", left:"270px" }}>6 AM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"438px", left:"270px" }}>7 AM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"482px", left:"270px" }}>8 AM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"526px", left:"270px" }}>9 AM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"570px", left:"265px" }}>10 AM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"614px", left:"265px" }}>11 AM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"658px", left:"265px" }}>12 PM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"702px", left:"270px" }}>1 PM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"746px", left:"270px" }}>2 PM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"790px", left:"270px" }}>3 PM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"834px", left:"270px" }}>4 PM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"878px", left:"270px" }}>5 PM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"922px", left:"270px" }}>6 PM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"966px", left:"270px" }}>7 PM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"1010px", left:"270px" }}>8 PM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"1054px", left:"270px" }}>9 PM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"1098px", left:"265px" }}>10 PM</div>
        <div className="absolute text-gray-400 text-xs" style={{ top:"1142px", left:"265px" }}>11 PM</div>
  </div>
}