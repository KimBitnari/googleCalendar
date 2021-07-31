import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css'
import EachEvent from './eachEvent';

export default function TableBody (props) {
    
    // console.log(props.timeData)
    return <tr>
        <td className="border border-gray-300 w-1/9 h-11 border-r-0">
            <div className={props.timeData==""? "hidden": "w-full relative"}>
                {
                    props.timeData.map((evnet, index) => {
                        return <EachEvent evnet={evnet} count={props.timeData.length} idx={index} weekIdx={props.weekIdx} key={index} />
                    })
                }
            </div>
        </td>
    </tr>
}