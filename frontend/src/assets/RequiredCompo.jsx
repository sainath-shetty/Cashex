import {Link} from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import API_BASE from '../apiConfig';
import { FaCoins } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";

export function Heading({label}){
    return <div className="font-bold text-4xl pt-6 ">
        {label}
    </div>
}
export function SubHeading({label}){
    return <div className="text-slate-500 text-md pt-2 px-4 pb-4 " >
        {label}
    </div>
}
export function InputBox({onChange, label, placeholder, type='text', rightElement}){
    return <div>
        <div className="px-0 font-bold ml-1 text-left py-2">
            {label}
        </div>
        <div className="relative">
            <input onChange={onChange} className="w-full px-2 py-1 border rounded border-slate-200 pr-9" type={type} placeholder={placeholder} />
            {rightElement && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                    {rightElement}
                </div>
            )}
        </div>
    </div>
}
export function ButtonComponent({label, onClick}) {
    return <button onClick={onClick} type="button" className=" hover:bg-green-300 w-full text-white bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-5">{label}</button>
}
export function BottomWarning({label,buttonText,to}){
    return <div className='text-sm flex justify-center py-2'>
      <div>
      {label}
      </div>
      <Link className='pointer cursor-pointer underline' to={to}>{buttonText}</Link>
    </div>
}


export function Appbar({ firstName}) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Render component
  return (
    <div className='flex justify-between shadow h-14'>
      <div className='ml-1 font-bold text-orange-500 text-3xl flex'>
        Cashex
        <GiTakeMyMoney className='text-5xl ml-2 mb-2 text-amber-300'/>
      </div>
      
      <div className='flex'>
        <div className='flex flex-col justify-center text-xl h-full mr-5 text-white'>
          Hello
        </div>
        <div 
          className='rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2 relative'
          onMouseEnter={() => setShowTooltip(true)} // Show tooltip on hover
          onMouseLeave={() => setShowTooltip(false)} // Hide tooltip on mouse leave
        >
          <div className='flex flex-col justify-center h-full text-xl font-bold'>
            {firstName ? firstName[0].toUpperCase() : ''}
          </div>
          {showTooltip && (
            <div className='absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-white border rounded shadow-md p-2 text-center z-10'>
              <div className='font-bold'>{firstName}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Balance({value}){
    return <div className='flex '>
     <div className='font-bold text-xl ml-4 mt-5 text-white'>
        Your balance  
     </div>
     <div className='font-semibold text-xl mt-5 ml-3 text-white'>
        Rs {value} 
     </div>
     <FaCoins className="text-yellow mt-7 ml-3 text-yellow-400 text-lg"/>
    </div>
}

export function Users(){
    const [filter,setFilter]=useState("");
    const[users,setUsers]=useState([{
        firstName:"Sainath",
        lastName:"Shetty",
        _id:1
    },{
        firstName:"Dishitha",
        lastName:"Shetty",
        _id:2
    },{
        firstName:"Satvi",
        lastName:"Shetty",
        _id:3
    }]);
    useEffect(()=>{
        const response =axios.get(`${API_BASE}/api/v1/user/bulk?filter=`+filter).then(response=>{
            setUsers(response.data.user)
        })
    },[filter]);
    return <> <div className='flex justify-start mt-4 ml-4 font-bold text-xl text-white'>
    Users
    </div>
    <input  onChange={(e)=>setFilter(e.target.value)} type="text" placeholder='search users......' className='w-full flex-col justify-center bg-slate-500 border rounded px-5 text-white shadow-md mt-4 ml-4 text-lg' />
    
        <div>
            {users.map(user=>(<User key={user._id} user={user}/>))}
        </div>
    
    </>

}
function User({user}){
    const navigate=useNavigate();
return (<div className=' ml-4 flex mt-3 justify-between'>
   
<div className='rounded-full h-12 w-12 bg-slate-600 flex-col justify-center font-bold text-white text-xl py-2'>
     {user.firstName[0].toUpperCase()}
</div>
<div className='flex flex-col justify-start -ml-[70%] h-full mt-3 font-bold text-lg text-white'>
<div>
    {user.firstName} {user.lastName}
</div>
</div>
<div>
    <div className=' flex flex-col justify-between h-full ml-30'>
        <ButtonComponent onClick={e=>
        {
            navigate("/send?id="+user._id+"&name="+user.firstName)
        }} label={"Send Money"} />
    </div>
</div>
</div>)
}