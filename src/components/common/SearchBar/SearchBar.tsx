import { Link } from 'react-router-dom'
import DefaultAvatar from '../../../assets/img/default_avt.png'

export const SearchBar = () => {
  return (
    <div className="h-[90px] flex items-center justify-between px-12 md:px-13 lg:px-[50px] bg-white dark:bg-[#0f0f11]">
      <input
        type="text"
        placeholder="Tìm Kiếm..."
        className="w-full max-w-[650px] h-11 text-white rounded-[10px] px-4 py-2 bg-[#1c1c1f] border-0 focus:outline-none focus:ring-0"
      />

      <div className="flex items-center h-[50px] ml-4 shrink-0">
        <div className="text-white mr-4 sm:mr-6 md:mr-8 w-auto sm:w-[100px] text-right">
          Coin
        </div>
        <img
          src={DefaultAvatar}
          alt="User Avatar"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover cursor-pointer bg-white"
        />
      </div>
    </div>

  )
}
