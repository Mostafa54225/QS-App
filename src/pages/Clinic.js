import { CircularProgress } from '@mui/material'
import Select from 'react-select'
import axios from '../api/axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useFetch from '../api/useFetch'
import Map from '../Components/Map'
import '../styles/clinic.css'
import AuthContext from '../context/AuthProvider'
import ShowNotification from '../utils/ShowNotification'
const Clinic = () => {

    const CLINIC_URL = "/clinics"
    const RESERVATION_POST_URL = "/Reservations"
    const {user} = useContext(AuthContext)
    const location = useLocation()
    const id = location.pathname.split('/')[2]
    const {data, loading, error} = useFetch(`${CLINIC_URL}/${id}`)
    let res = []
    data.avaliableDates?.forEach((date, idx) => res.push({'value': date, 'label': date}))
    const [date, setDate] = useState(null)
    const [validDate, setValidDate] = useState(false)
    
    useEffect(() => {
      setValidDate(date !== null)
    }, [date])

    console.log(date)

  

  const bookAppointment = async () => {
    const userId = user.data.userId
    const clinicId = data.id
    try {
      const response = await axios.post(RESERVATION_POST_URL, 
        {
          UserId: userId,
          ClinicId: clinicId,
          DateTime: date,
          // Cost: 100
        }, {
          headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'text'
      })
      ShowNotification("Success", "You've booked an appointment successfully!", "success")
    } catch (error) {
      ShowNotification("Error", "There's somthing wrong", "danger")
    }

  }
  return (
    <>
    {!loading ? 
    <div className='homeContainer'>
          
        <div className="Item">
            
            {data.logo ? 
                <img className='cListImg' src={`data:image/png;base64,${data.logo}`} />  :
                <img className='cListImg' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" /> 
            }
            <div className='cListTitles'>
                <p className='clinicName'>{data.name}</p>
                
                <label htmlFor='date' className='date'>Available Dates:</label>
                <Select className='select' options={res}
                onChange={(choice) => setDate(choice.value)} />

                <button style={{cursor: 'pointer'}} onClick={bookAppointment} className='reserveButton' disabled={!validDate ? true: false} >Book appointment</button>
            </div>
            
        </div>

          
    </div>

      : 
        <div className='circularProgress'>
          <CircularProgress style={{color: 'white', width: '50px', height: '50px'}} />
        </div>
      
      }
    </>
  )
}

export default Clinic