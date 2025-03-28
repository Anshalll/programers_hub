import React, { useMemo, useState } from 'react'
import { useSendDataMutation } from '../redux/apis/slice'
import { debounce } from 'lodash'
import Loadingcomp from '../components/Loading'
export default function UserSearchbar() {
    const [DataSend] = useSendDataMutation()
    const [SearchedTerm, setSearchedTerm] = useState("")
 
    const [SearchedUsers, setSearchedUsers] = useState([])
    const [Loading, setLoading] = useState(false)

    const debouncedSearch = useMemo(() => debounce(async (value) => {

        const response = await DataSend({ url: "/searchusers", method: "POST", data: { search: value } });
     
        if (response.error) {
            
            console.error("An error occured!")
        }
        if (response.data.users.length > 0) {
            setSearchedUsers(response.data.users)
        } else {
            setSearchedUsers([])
        }
        setLoading(false)


    }, 500), [DataSend]);

    const handleSearchedTerm = (e) => {
        setSearchedTerm(e);
        setLoading(true)
        if (e.trim() !== "") {
            
            debouncedSearch(e);
        }
    };






    return (
        <div className=" flex w-[500px]  relative bg-black h-[50px] rounded-lg">
            <input value={SearchedTerm} onChange={(e) => handleSearchedTerm(e.target.value)} type="text" placeholder='Search user' className='outline-none px-[10px] text-[13px] w-full focus:border focus:border-[#FF6500] rounded-lg' />
        {SearchedTerm.trim() !== "" &&   <div className='absolute w-full max-h-[500px] flex flex-col overflow-y-auto gap-[20px] p-[10px] bg-black rounded-lg top-[52px]'>
                {(SearchedUsers.length > 0 && !Loading) ? SearchedUsers.map((user, index) => (
                    <Link to={`/profile?user=${user.username}`} key={index} className='flex gap-[10px] items-center p-[10px] bg-black hover:bg-gray-800 rounded-lg'>
                        <img src={user.profilePic} alt="" className='w-[30px] h-[30px] rounded-full' />
                        <div className='flex flex-col'>
                            <span className='text-white text-[13px]'>{user.username}</span>
                            <span className='text-gray-500 text-[12px]'>{user.name}</span>
                        </div>
                    </Link>
                )) : (SearchedTerm.trim() !== "" && !Loading) ? <div className='flex items-center justify-center w-full h-full'>No users found</div> : null}
                {Loading && <div className='flex items-center justify-center w-full h-full'> <div className='w-[40px]'>
                    </div> <Loadingcomp/></div>}
            </div>}

        </div>
    )
}
