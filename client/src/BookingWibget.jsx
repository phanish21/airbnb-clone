import { useContext, useEffect, useState } from "react"
import { differenceInCalendarDays } from 'date-fns'
import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function BookingWibget({place}) {

    const [checkIn , setCheckIn] = useState('');
    const [checkOut , setCheckOut] = useState('');
    const [numberOfGuests , setNumberOfGuests] = useState(1);
    const [name , setName] = useState('');
    const [phone , setPhone] = useState('');
    const [redirect , setRedirect] = useState('');
    const {user} =useContext(UserContext);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    });

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays( new Date(checkOut) , new Date(checkIn));
    }


    async function bookThisPlace(){
        const response = await axios.post('/bookings' , {
            place:place._id , checkIn , checkOut ,
            numberOfGuests , name , phone , price : numberOfNights * place.price});
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }
    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ${place.price} / per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="px-4 py-3">
                        <label>Check in</label>
                        <input type="date" value={checkIn} onChange={ ev => setCheckIn(ev.target.value)} />
                    </div>
                    <div className="px-4 py-3 border-l">
                        <label>Check out</label>
                        <input type="date" value={checkOut} onChange={ ev => setCheckOut(ev.target.value)}/>
                    </div>
                </div>
                <div className="px-4 py-3 border-t">
                    <label>Number of Guests:</label>
                    <input type="number" value={numberOfGuests}  onChange={ ev => setNumberOfGuests(ev.target.value)} />
                </div>
                {numberOfNights > 0 && (
                    <div className="px-4 py-3 border-t">
                    <label>Your Full Name </label>
                    <input type="text" value={name}  onChange={ ev => setName(ev.target.value)} />
                    <label>Phone Number </label>
                    <input type="tel" value={phone}  onChange={ ev => setPhone(ev.target.value)} />
                </div>
                )}
            </div>
            <button onClick={bookThisPlace} className="primary mt-4">
                BOOK IT NOW
                {numberOfNights > 0 && (
                    <span> ${numberOfNights * place.price}</span>
                )}
            </button>
        </div>

    )
}