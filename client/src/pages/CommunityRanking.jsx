import React from 'react'
import Layout from '../Layout'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import TuneIcon from '@mui/icons-material/Tune';
import MessageIcon from '../assets/icons/messages.png'
import RankingIcon from '../assets/icons/ranking.png'
import PeopleGroupIcon from '../assets/icons/peoplegroup.png'

export default function CommunityRanking() {

  const CommunityData = [
    {
      id: 1,
      rank: 1,
      membercount: 200012121,
      messages: "100M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Car lovers",
      Joined: false,
      ownedby: "manish2odnu"
    },
    {
      id: 2,
      rank: 2,
      membercount: 51234123,
      messages: "75M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Social Media Gurus",
      Joined: true,
      ownedby: "@socialking"
    },
    {
      id: 3,
      rank: 3,
      membercount: 43124123,
      messages: "50M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Photography World",
      Joined: false,
      ownedby: "photoqueen"
    },
    {
      id: 4,
      rank: 4,
      membercount: 39234123,
      messages: "45M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Open Source Devs",
      Joined: true,
      ownedby: "codemaster"
    },
    {
      id: 5,
      rank: 5,
      membercount: 38234123,
      messages: "40M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Apple Enthusiasts",
      Joined: false,
      ownedby: "applefan"
    },
    {
      id: 6,
      rank: 6,
      membercount: 36234123,
      messages: "38M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Tech Innovators",
      Joined: true,
      ownedby: "techguru"
    },
    {
      id: 7,
      rank: 7,
      membercount: 34234123,
      messages: "35M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Startup Founders",
      Joined: false,
      ownedby: "founderlife"
    },
    {
      id: 8,
      rank: 8,
      membercount: 32234123,
      messages: "32M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Meme Central",
      Joined: true,
      ownedby: "memelord"
    },
    {
      id: 9,
      rank: 9,
      membercount: 31234123,
      messages: "30M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Crypto Traders",
      Joined: false,
      ownedby: "cryptoking"
    },
    {
      id: 10,
      rank: 10,
      membercount: 30234123,
      messages: "28M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Messaging Experts",
      Joined: true,
      ownedby: "whatsappwizard"
    },
    {
      id: 11,
      rank: 11,
      membercount: 29234123,
      messages: "27M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Content Creators",
      Joined: true,
      ownedby: "createandearn"
    },
    {
      id: 12,
      rank: 12,
      membercount: 28234123,
      messages: "25M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Netflix Addicts",
      Joined: false,
      ownedby: "bingewatch"
    },
    {
      id: 13,
      rank: 13,
      membercount: 27234123,
      messages: "24M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "iOS Devs",
      Joined: true,
      ownedby: "ioscreator"
    },
    {
      id: 14,
      rank: 14,
      membercount: 26234123,
      messages: "23M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "YouTubers",
      Joined: false,
      ownedby: "ytstar"
    },
    {
      id: 15,
      rank: 15,
      membercount: 25234123,
      name: "Toyota",
      messages: "22M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      Joined: true,
      ownedby: "tiktokqueen"
    },
    {
      id: 16,
      rank: 16,
      membercount: 24234123,
      messages: "21M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Music Fans",
      Joined: false,
      ownedby: "musiclover"
    },
    {
      id: 17,
      rank: 17,
      membercount: 23234123,
      messages: "20M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Gamers United",
      Joined: true,
      ownedby: "gamerlife"
    },
    {
      id: 18,
      rank: 18,
      membercount: 22234123,
      messages: "19M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Snapchatters",
      Joined: false,
      ownedby: "snapqueen"
    },
    {
      id: 19,
      rank: 19,
      membercount: 21234123,
      messages: "18M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "DIY Enthusiasts",
      Joined: true,
      ownedby: "craftlover"
    },
    {
      id: 20,
      rank: 20,
      membercount: 20234123,
      messages: "17M+",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png",
      name: "Android Devs",
      Joined: false,
      ownedby: "androidbuilder"
    }
  ]

  return (
    <Layout>
      <div className='flex flex-col gap-[20px] text-[13px] w-full h-[calc(100%-80px)] p-[20px]'>
        <div className='w-full h-[40px] bg-black flex items-center px-[20px] rounded-full justify-between '>
          <h1 className='text-[#FF6500]'>Community Ranking <MilitaryTechIcon sx={{ fontSize: 16 }} /></h1>

          <div className='flex px-[10px] text-white bg-gray-900 min-w-[100px] rounded-full items-center gap-[20px]'>
            <TuneIcon sx={{ fontSize: 16 }} />

            <select name="filter-ranking" className='bg-gray-900 outline-none w-[100px]' id="filter-ranking">
              <option value="members">Members</option>
              <option value="messages">Messages</option>
              <option value="rating">Rating</option>
              <option value="rating">Categories</option>

            </select>
          </div>

        </div>

        <div className='flex flex-col h-[calc(100%-40px)] text-white gap-[10px] w-full overflow-y-auto'>

          {CommunityData.map((value, index) => (
            <div key={index} className='flex bg-black px-[20px] py-[7px] rounded-md w-[100%]  items-center justify-between gap-[20px] '>
              <div className='flex flex-col justify-center  gap-[10px] w-[20%]'>
              <div className='flex items-center gap-[10px]'>

                <p className='min-w-[40px] flex gap-[10px] items-center'><img src={RankingIcon} alt="" className='w-[20px] h-[20px]' />{value.rank}</p>
                <a href={`${import.meta.env.VITE_CLIENTLOCAL}/profile?user=${value.ownedby}`}> <i className='text-gray-300'>@{value.ownedby}</i> </a>
                </div>

              

                <div className='flex gap-[10px] items-center'>

                  <img src={value.icon} className='w-[20px] h-[20px] rounded-full object-cover' alt="" />
                  <p>{value.name}</p>

                </div>


              </div>

              <div className='flex  max-w-[200px] items-center gap-[20px]'>
                <p className='flex items-center gap-[10px]'><img src={PeopleGroupIcon} className='w-[20px] h-[20px]' alt="" />{value.membercount}</p>

                <p className='flex items-center gap-[10px]'><img src={MessageIcon} className='w-[20px] h-[20px]' alt="" />{value.messages}</p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
