import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import 'tailwindcss/tailwind.css'
import users from '../users.json';
import moment, { Moment as MomentTypes } from 'moment';
import { BiPencil, BiTrash, BiCalendarEvent } from "react-icons/bi";
import { BsSquareFill, BsPerson, BsBell } from "react-icons/bs";
import { IoMdPerson } from "react-icons/io";

export default function EachEvent (props) {
    const dayKo = ['일', '월', '화', '수', '목', '금', '토'];
    const width = "w-1/"+props.count;
    const modalPosition = props.weekIdx>3? "right-full": "left-full"
    const userColor = users.users.filter(u => u.uid == props.evnet.ebu.hostUid)
    const organizer = users.users.filter(u => u.uid == props.evnet.e.organizerUid)
    const guests = props.evnet.e.guests;
    const [isOpen, setOpen] = useState(false);
    const jwtTokenUser = useSelector((state) => state.user.userProfile);
    const yes = props.evnet.ebu.isGoing==1? "text-"+userColor[0].color: "";
    const no = props.evnet.ebu.isGoing==2? "text-"+userColor[0].color: ""
    const yet = props.evnet.ebu.isGoing==3? "text-"+userColor[0].color: ""
    
    //onClick={() => showDetailEvent(props.evnet.e.uid, props.evnet.ebu.hostUid)}
    const showDetailEvent = (id, hostUser) => {

    }

    const editEvents = (eventUid) => {
    }

    const deleteEvents = (eventUid) => {
        // const inIndex = inboxD.findIndex(x => x.uid === id)
        // if(inIndex != -1) {
        //     inboxD.splice(inIndex, 1)
        //     setInboxMails(inboxD)
        //     dispatch(setInbox(inboxD));
        // }
    }

    function generate() {
        let clr = "";
        let left = "";
        const h = moment.duration(moment.utc(props.evnet.e.end).local().diff(moment.utc(props.evnet.e.start).local())).asMinutes()
        let realH = "";
        let realT = "";

        if(props.count == 1) left = "left-0"
        else left = "left-" + props.idx +"/"+props.count
        
        if(props.evnet.ebu.isGoing == 3) {
            clr = "text-white border-"+ userColor[0].color

            return <div className={`${width} cursor-pointer float-left text-left border-2 rounded-md ${clr}`} style={{ background: "repeating-linear-gradient(45deg, "+ userColor[0].color+", "+ userColor[0].color+" 2px, #888 0, #888 5px)"}}>
                <p className="text-xs">{props.evnet.e.title}</p>
                <span className="text-xs">{props.evnet.e.title}</span>
            </div>
        }
        else {
            if(props.evnet.ebu.isGoing == 1)
                clr = "border-transparent bg-"+ userColor[0].color+" text-white"
            else if(props.evnet.ebu.isGoing == 2)
                clr = "bg-white border-"+ userColor[0].color+" line-through text-"+ userColor[0].color
            else clr = "bg-white border-"+ userColor[0].color+" text-"+ userColor[0].color

            if(h%60) realH = "h-11." + Math.floor(h/60) + "/2"
            else {
                realH = "h-11." + h/60
                realT = "-top-5"
            }

            return <div className={`${width} absolute ${realH} ${realT} ${left} cursor-pointer float-left text-left leading-none border-2 rounded-md ${clr}`} onClick={() => setOpen(!isOpen)}>
                <p className="w-full text-xs overflow-hidden overflow-ellipsis whitespace-nowrap">{props.evnet.e.title}</p>
                <span className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap" style={{ fontSize: "10px"}}>{moment.utc(props.evnet.e.start).local().format("HH:mm")} ~ {moment.utc(props.evnet.e.end).local().format("HH:mm")}</span>
            </div>
        }
    }

    return <div>
        {generate()}
        <div className={isOpen? `absolute z-10 rounded bg-white w-96 shadow-lg p-1 pb-4 -top-5 ${modalPosition}`: "hidden"}>
            <div className="text-sm pl-4 py-2 text-gray-600 rounded-t-xl">
                <p className="inline-block float-right mr-2 cursor-pointer w-6 h-6 text-center text-xl leading-4 hover:bg-gray-300" onClick={() => setOpen(false)}>x</p>
                <BiTrash className="inline-block float-right mr-4 cursor-pointer leading-4 w-5 h-5 hover:bg-gray-300" size="18" onClick={() => deleteEvents(props.evnet.e.uid)} />
                <BiPencil className="inline-block float-right mr-4 cursor-pointer leading-4 w-5 h-5  hover:bg-gray-300" size="18" onClick={() => editEvents(props.evnet.e.uid)} />
            </div>
            <div className="px-5 mt-5">
                <div className="flex mb-4">
                    <BsSquareFill color={userColor[0].color} className="mr-6 w-10 mt-1" style={{ minWidth: "40px" }} />
                    <div>
                        <p className="text-left text-lg break-all">{props.evnet.e.title}</p>
                        <p className="text-left text-xs mt-1">{moment.utc(props.evnet.e.start).local().format("M")}월 {moment.utc(props.evnet.e.start).local().format("DD")}일 ({dayKo[moment.utc(props.evnet.e.start).local().day()]}요일) ・ {moment.utc(props.evnet.e.start).local().format("HH:mm")} ~ {moment.utc(props.evnet.e.end).local().format("HH:mm")}</p>
                    </div>
                </div>
                <div className={guests.length==0? "hidden" : "flex mb-4"}>
                    <BsPerson className="mr-6 w-10" style={{ minWidth: "40px" }} size="18" color="gray" />
                    <div>
                        <p className="text-sm text-left">참석자 {guests.length + 1}명</p>
                        <div>
                            <div className="flex mt-3">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full text-white text-sm" style={{ backgroundColor: organizer[0].color }}>
                                    <IoMdPerson size="18" className="opacity-70" />
                                </div>
                                <p className="text-sm ml-2 text-gray-500">{organizer[0].email} - 주최자</p>
                            </div>
                        {
                            guests.map((g, index) => {
                                const gUser = users.users.filter(u => u.uid == g.uid)
                                return <div className="flex mt-3" key={index}>
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full text-white text-sm" style={{ backgroundColor: gUser[0].color }}>
                                        <IoMdPerson size="18" className="opacity-70" />
                                    </div>
                                    <p className="text-sm ml-2 text-gray-500">{gUser[0].email}</p>
                                </div>
                            })
                        }
                        </div>
                    </div>
                </div>
                <div className="flex mb-4">
                    <BsBell className="mr-6 w-10" style={{ minWidth: "40px" }} size="18" color="gray" />
                    <div>
                        <p className="text-sm">30분 전</p>
                    </div>
                </div>
                <div className="flex mb-4">
                    <BiCalendarEvent className="mr-6 w-10" style={{ minWidth: "40px" }} size="18" color="gray" />
                    <div>
                        <p className="text-sm">{organizer[0].name}</p>
                    </div>
                </div>
            </div>
            {
                props.evnet.ebu.hostUid === jwtTokenUser.uid?
                <div>
                    <hr />
                    <div className="flex">
                        <p className="pl-4 pt-3 text-sm">참석 여부</p>
                        <p className={`ml-48 pt-3 cursor-pointer text-sm ${yes}`}>예</p>
                        <p className={`ml-3 pt-3 cursor-pointer text-sm ${no}`}>아니오</p>
                        <p className={`ml-3 pt-3 cursor-pointer text-sm ${yet}`}>미정</p>
                    </div>
                </div> :
                <div></div>
            }
        </div>
    </div>
}