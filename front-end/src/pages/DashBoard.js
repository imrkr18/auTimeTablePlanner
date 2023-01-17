// External Modules
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// Components and Routes
import {  dashboardRoute } from '../utils/ApiRoutes'

// Calendar Modules 
import FullCalendar from '@fullcalendar/react' 
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const DashBoard = () => {
  const Navigate = useNavigate();

  // helper states
  const [coursesBucket, setCoursesBucket] = useState([])
  const [events, setEvents] = useState([])

  // To map days from numbers
  const day2Num = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 0
  }

  // To get user courses data
  const getData = async (req, res) => {
    const tempData = await axios.get(dashboardRoute)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        console.log(error);
      });
    setCoursesBucket(tempData.data)
  }

  // To post roll number details 
  const postRollNumDetails = async (event) => {
    // event.preventDefault();
    const rollNum = JSON.parse(localStorage.getItem('STTP-user'))
    const obj = {
      rollNum: rollNum
    }

    const data = await axios.post(`${dashboardRoute}/rollnumber`, obj)
      .then(function (response) {
        getData();
        return response;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const eventsSetup = () => {
    let eventsList = coursesBucket.map((course) => {
      return {
        title: course.courseName ,
        startTime: course.courseStartTime,
        endTime: course.courseEndTime,
        daysOfWeek: [day2Num[course.courseWeeklyFirstLec], day2Num[course.courseWeeklySecondLec]],
      }
    })
    setEvents(eventsList)
    return eventsList;
  }

  useEffect(() => {
    postRollNumDetails()
    const currUser = JSON.parse(localStorage.getItem('STTP-user'))
    if (!currUser) {
      Navigate("/login")
    }
  }, [])

  useEffect(() => {
    eventsSetup();
  }, [coursesBucket])

  return (
    <div className='w-screen	h-max flex justify-center	items-center flex-col mt-10'>
      <div className="w-1/2 ">
        <FullCalendar className="overflow-y-clip"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          events={events}
          slotMinTime={'08:00:00'}
          slotMaxTime={'19:30:00'}
          slotDuration={'00:30:00'} 
          allDaySlot = {false}  
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true} 
        />
      </div>
    </div>
  )
}

export default DashBoard

