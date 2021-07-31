import Head from 'next/head'
import Link from 'next/link'
import 'tailwindcss/tailwind.css'
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { IoMenu, IoSettingsOutline } from "react-icons/io5";
import { HiSearch } from "react-icons/hi";
import { IoMdHelpCircleOutline, IoIosKeypad, IoMdArrowDropdown, IoMdPerson } from "react-icons/io";
import { FaCheckSquare } from "react-icons/fa";
import { BsPerson } from "react-icons/bs";
import { BiTimeFive, BiCalendarEvent } from "react-icons/bi";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setNewEvent } from '../reducers/user';
import { v4 as uuidv4 } from 'uuid';
import moment, { Moment as MomentTypes } from 'moment';
import Router from 'next/router';
import users from '../users.json';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Layout({ children }) {
    const dispatch = useDispatch();
    let now = new Date();
    const [makeCalendar, setMakeCalendar] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(moment());
    const jwtTokenUser = useSelector((state) => state.user.userProfile);
    const [shareUsers, setShareUsers] = useState([]);
    const [createDate, setCreateDate] = useState(new Date());
    const [createSTime, setCreateSTime] = useState(new Date().setHours(0, 0));
    const [createETime, setCreateETime] = useState(new Date().setHours(1, 0));
    const [createGuests, setCreateGuests] = useState("");
    const originEvents = useSelector((state) => state.user.originEvents);
    const [originEBU, setOriginEBU] = useState(useSelector((state) => state.user.originEBU));

    useEffect(() => {
      const otherUsers = []
      for(var i in jwtTokenUser.shareUid) {
        const selectUser = users.users.filter(u => u.uid == jwtTokenUser.shareUid[i].uid);
        otherUsers.push(selectUser[0])
      }
      setShareUsers(otherUsers);
    },[]);

    const onTitleChange = (e) => {
      setTitle(e.target.value)
    }

    const onGuestChange = (e) => {
      setCreateGuests(e.target.value)
    }

    const createEvent = () => {
      const evnetUid = uuidv4();
      const madeG = createGuests.split(",");
      let resultG = [];
      const myebuUid = uuidv4();

      const myEbuPayload = {
        uid: myebuUid,
        hostUid: jwtTokenUser.uid,
        eventUid: evnetUid,
        isGoing: 1
      }
      const myebup = [...originEBU]
      myebup.push(myEbuPayload)
      dispatch(setNewEvent(myebup));
      setOriginEBU(myebup);
      
      for(var i in madeG) {
        const uInfo = users.users.filter(u => u.email == madeG[i]);
        if(uInfo.length != 0) {
          let uid = uuidv4();
          const ebuPayload = {
            uid: uid,
            hostUid: uInfo[0].uid,
            eventUid: evnetUid,
            isGoing: 0
          }
          const ebup = [...originEBU]
          ebup.push(ebuPayload)
          dispatch(setNewEvent(ebup));
          setOriginEBU(ebup);

          resultG.push({
            uid: uInfo[0].uid
          })
        }
      }

      const ePayload = {
        uid: evnetUid,
        title: title==""? "(제목 없음)": title,
        start: createDate.getFullYear() + "-" + ("0" + (createDate.getMonth() + 1)).slice(-2) + "-" + ("0" + createDate.getDate()).slice(-2) +"T"+moment.utc(createSTime).local().format("HH:mm")+":00",
        end: createDate.getFullYear() + "-" + ("0" + (createDate.getMonth() + 1)).slice(-2) + "-" + ("0" + createDate.getDate()).slice(-2) +"T"+moment.utc(createETime).local().format("HH:mm")+":00",
        organizerUid: jwtTokenUser.uid,
        guests: resultG
      }

      const ep = [...originEvents]
      ep.push(ePayload)
      dispatch(setNewEvent(ep));

      setMakeCalendar(false);
    }

    const handleDayClick = (current) => {
      setDate(current);
      Router.push('/cal/'+current.year()+'/'+(current.month()+1)+'/'+current.date());
    }
    const returnToday = () => {
      setDate(moment());
      Router.push('/cal/'+moment().year()+'/'+(moment().month()+1)+'/'+moment().date());
    }
    const jumpToWeek = (num) => {
      (num ? 
        setDate(date.clone().add(7, 'day')) : 
        setDate(date.clone().subtract(7, 'day'))
      );
      (num ? 
        Router.push('/cal/'+date.clone().add(7, 'day').year()+'/'+(date.clone().add(7, 'day').month()+1)+'/'+date.clone().add(7, 'day').date()) : 
        Router.push('/cal/'+date.clone().subtract(7, 'day').year()+'/'+(date.clone().subtract(7, 'day').month()+1)+'/'+date.clone().subtract(7, 'day').date())
      );
    }
    const jumpToMonth = (num) => {
      (num ? 
        setDate(date.clone().add(30, 'day')) : 
        setDate(date.clone().subtract(30, 'day'))
      );
      (num ? 
        Router.push('/cal/'+date.clone().add(30, 'day').year()+'/'+(date.clone().add(30, 'day').month()+1)+'/'+date.clone().add(30, 'day').date()) : 
        Router.push('/cal/'+date.clone().subtract(30, 'day').year()+'/'+(date.clone().subtract(30, 'day').month()+1)+'/'+date.clone().subtract(30, 'day').date())
      );
    }
    function generate() {
      const today = date;
      const startWeek = today.clone().startOf('month').week();
      const endWeek = today.clone().endOf('month').week() === 1 ? 53 : today.clone().endOf('month').week();
      let calendar = [];

      for (let week = startWeek; week <= endWeek; week++) {
        calendar.push(
          <div className="w-full" key={week}>
            {Array(7)
              .fill(0)
              .map((n, i) => {
                let current = today
                  .clone()
                  .week(week)
                  .startOf('week')
                  .add(n + i, 'day');
  
                let isSelected = today.format('YYYYMMDD') === current.format('YYYYMMDD') ? 'bg-blue-600 text-white rounded-2xl' : '';
                //text-blue-600 bg-blue-100 rounded-2xl
  
                let isGrayed = current.format('MM') !== today.format('MM') ? 'text-gray-400' : '';
  
                return (
                  <div className={`float-left w-1/7 my-1.5 text-center cursor-pointer ${isSelected} ${isGrayed}`} key={i} onClick={() => handleDayClick(current)}>
                    <span className="text">{current.format('D')}</span>
                  </div>
                );
              })}
          </div>,
        );
      }
      return calendar;
    }
  
    return (
        <div>
            <Head>
                <title>Calendar</title>
            </Head>
            <header>
                <div className="p-2 flex">
                    <div className="pr-8 h-11 flex min-w-max" style={{ width:"238px" }}>
                        <div className="p-3 mx-1 inline-block align-middle cursor-pointer"><IoMenu size="24"/></div>
                        <div className="relative top-1 float-left">
                            <Link href="/">
                                <a className="inline-block align-middle">
                                  <img className="inline-block" src={"https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_"+now.getDate()+"_2x.png"}
                                      style={{ width:"40px" }} />
                                  <span className="inline-block text-gray-600 text-2xl align-middle pl-2 font-light">Calendar</span>
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-1.5 w-40 min-w-max">
                      <div className="cursor-pointer border-gray-300 rounded border-2 float-left mr-3" onClick={returnToday}>
                        <span className="mt-1 mx-3 mb-1 inline-block text-sm">Today</span>
                      </div>
                      <div className="float-left w-8 cursor-pointer" onClick={() => jumpToWeek(0)}><RiArrowLeftSLine className="text-gray-600 ml-3 mt-1" size="24" /></div>
                      <div className="float-left w-8 cursor-pointer" onClick={() => jumpToWeek(1)}><RiArrowRightSLine className="text-gray-600 ml-3 mt-1" size="24" /></div>
                    </div>
                    <div className="flex h-11 min-w-max flex-auto px-2">
                        <div className="h-8 px-2.5 w-full">
                            <div className="relative h-11 p-1 ml-1" style={{ maxWidth:"720px" }}>
                                <div className="float-left text-2xl font-light text-gray-700">{date.format('YYYY')}년</div>
                                <div className="float-left text-2xl font-light text-gray-700 ml-2">{date.format('M')}월</div>
                            </div>
                        </div>
                    </div>
                    <div className="min-w-max h-11">
                        <div className="p-2 m-1 inline-block cursor-pointer"><HiSearch size="24" /></div>
                        <div className="p-2 m-1 inline-block cursor-pointer"><IoMdHelpCircleOutline size="24" /></div>
                        <div className="p-2 m-1 inline-block cursor-pointer"><IoSettingsOutline size="24" /></div>
                        <div className="inline-block cursor-pointer border-gray-300 rounded border-2 m-2">
                          <span className="mt-1 mx-3 mb-1 inline-block text-sm float-left">Week</span>
                          <IoMdArrowDropdown className="float-left mt-1 mr-1" />
                        </div>
                    </div>
                    <div className="min-w-max h-11 pl-8">
                        <div className="p-2 m-1 inline-block cursor-pointer"><IoIosKeypad size="24" /></div>
                        <div className="pt-1 px-2 mx-1 inline-block float-right cursor-pointer">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm" style={{ backgroundColor: jwtTokenUser.color }}><IoMdPerson size="24" className="opacity-70" /></div>
                        </div>
                    </div>
                </div>
            </header>
            <hr />
            <main>
                <div className="h-screen float-left min-w-max" style={{ width: "256px" }}>
                    <div className="flex shadow-md rounded-full h-12 py-2 px-3 w-28 cursor-pointer ml-3 my-4" onClick={() => { setMakeCalendar(!makeCalendar); }}>
                        <img className="absolute" src="https://www.gstatic.com/images/icons/material/colored_icons/2x/create_32dp.png" width="34" />
                        <p className="my-2 ml-10 text-xs">만들기</p>
                    </div>
                    <div className="pl-4 pb-4 pr-3" style={{ width:"246px", fontSize:"10px" }}>
                      <span>
                        <div className="float-left text-sm text-gray-700">{date.format('YYYY')}년</div>
                        <div className="float-left w-1/2 text-sm text-gray-700 ml-2">{date.format('M')}월</div>
                      </span>
                      <div className="float-right cursor-pointer" onClick={() => jumpToMonth(1)}><RiArrowRightSLine className="text-gray-600 ml-3 mt-1" size="16" /></div>
                      <div className="float-right cursor-pointer" onClick={() => jumpToMonth(0)}><RiArrowLeftSLine className="text-gray-600 ml-3 mt-1" size="16" /></div>
                      <div>
                        <div className="w-full">
                          {['일', '월', '화', '수', '목', '금', '토'].map((el) => (
                            <div className="float-left w-1/7 my-1.5 text-center" key={el}>
                              <span>{el}</span>
                            </div>
                          ))}
                        </div>
                        {generate()}
                      </div>
                    </div>
                    <div className="flex h-8 min-w-max flex-auto px-3 pt-4">
                        <div className="h-8 px-2.5 w-full">
                            <div className="bg-gray-100 relative rounded h-8" style={{ maxWidth:"720px" }}>
                                <div className="float-left cursor-pointer p-2 pl-4"><BsPerson size="18" className=" text-gray-600" /></div>
                                <div className="block float-left top-2.5 p-1"><input placeholder="사용자 검색" className="bg-transparent text-sm" /></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 mx-5">
                      <span className="text-sm">내 캘린더</span>
                      <div className="mt-1.5">
                        <FaCheckSquare color={jwtTokenUser.color} className="float-left mt-1" size="18" />
                        <span className="ml-2 text-sm">{jwtTokenUser.name}</span>
                      </div>
                    </div>
                    <div className="mt-6 mx-5">
                      <span className="text-sm">다른 캘린더</span>
                      {
                        shareUsers.map((su, index) => {
                          return <div className="mt-1.5" key={index}>
                            <FaCheckSquare color={su.color} className="float-left mt-1" size="18" />
                            <span className="ml-2 text-sm">{su.email}</span>
                          </div>
                        })
                      }
                    </div>
                </div>
                <div className="h-full min-w-max" style={{ minWidth: "688px" }}>{children}</div>
                <div className={makeCalendar? "absolute top-16 left-40 shadow-lg block bg-white rounded-xl" : "hidden" } style={{ width: "450px", height: "310px" }}>
                    <div className="bg-gray-100 text-sm pl-4 py-2 text-gray-600 rounded-t-xl">
                        <p className="inline-block"></p>
                        <p className="inline-block float-right mr-4 cursor-pointer w-6 h-6 text-center text-xl leading-4 hover:bg-gray-300" onClick={() => { setMakeCalendar(false); }}>x</p>
                    </div>
                    <div className="px-4">
                        <div className="pl-12 pt-2 pb-5">
                            <input type="text" placeholder="제목 추가" className="py-2 ml-2 outline-none text-xl" style={{ width: "354px" }}
                                value={title} onChange={e => onTitleChange(e)} />
                            <hr />
                        </div>
                        <div className="flex mb-4">
                            <BiTimeFive size="20" color="gray" className="w-11" />
                            <DatePicker className="ml-2 w-24 cursor-pointer hover:underline" dateFormat="yyyy-MM-dd" selected={createDate} onChange={(date) => setCreateDate(date)} />
                            <DatePicker className="ml-2 w-12 cursor-pointer hover:underline" showTimeSelect showTimeSelectOnly dateFormat="HH:mm" timeIntervals={30} selected={createSTime} onChange={ e => setCreateSTime(e) } />
                            -
                            <DatePicker className="ml-2 w-12 cursor-pointer hover:underline" showTimeSelect showTimeSelectOnly dateFormat="HH:mm" timeIntervals={30} selected={createETime} onChange={ e => setCreateETime(e) } />
                        </div>
                        <div className="flex mb-4">
                            <BsPerson size="20" color="gray" className="w-11 mt-1.5"  />
                            <input type="text" placeholder="참석자 추가" className="outline-none bg-gray-100 rounded-md p-2 text-sm" style={{ width: "354px" }}
                                value={createGuests} onChange={e => onGuestChange(e)} />
                        </div>
                        <div className="flex mb-4">
                            <BiCalendarEvent size="20" color="gray" className="w-11 mt-1.5"  />
                            <div>
                              <div className="flex">
                                <p className="text-sm">{jwtTokenUser.name}</p>
                                <div className="flex items-center justify-center w-4 h-4 rounded-full text-white text-sm ml-3" style={{ backgroundColor: jwtTokenUser.color }}></div>
                              </div>
                              <p className="text-xs text-gray-500">30분 전에 알림</p>
                            </div>
                        </div>
                        <div className="float-right mt-2">
                            <div className="bg-blue-500 rounded" style={{ width: "72px", height: "36px" }}>
                                <button className="ml-6 mt-2 text-sm text-white" onClick={() => createEvent()}>저장</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className={isProfileActive? "absolute top-14 right-0 shadow-lg block z-10" : "hidden" } style={{ width: "338px", height: "340px" }}> */}
                <div className="hidden" style={{ width: "338px", height: "340px" }}>
                    <div className="mx-8 my-5 z-20" style={{ width: "272px", height: "160px" }}>
                        <div>
                            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-700 text-white text-3xl ml-20 mb-3">김</div>
                        </div>
                        <div>
                            <div className="text-center">김빛나리</div>
                            <div className="text-center text-sm text-gray-500">bitnari@gmailc.om</div>
                        </div>
                    </div>
                    <hr />
                    {/* <div>
                        {
                        otherUsers.map((otherUser, index) => {
                            // onClick={() => { onChangeUser(otherUser.uid); }}
                            return (
                                <div key={index} className="px-8 py-3 cursor-pointer z-20">
                                    <div className="inline-block mr-3 align-middle">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-700 text-white text-sm">{otherUser.firstOfName}</div>
                                    </div>
                                    <div className="inline-block align-middle">
                                        <div className="text-sm">{otherUser.name}</div>
                                        <div className="text-xs text-gray-500">{otherUser.email}</div>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div> */}
                </div>
            </main>
        </div>
    );
}