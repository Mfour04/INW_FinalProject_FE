import { Link } from 'react-router-dom'
import DefaultAvatar from '../../../assets/img/default_avt.png'

export const SearchBar = () => {
  return (
    <div className="h-[90px] flex items-center px-[50px] bg-white dark:bg-[#0f0f11] justify-between">
      <input
        type="text"
        placeholder="Tìm Kiếm..."
        className="w-[650px] h-11 text-white rounded-[10px] px-4 py-6 bg-[#1c1c1f] border-0 focus:outline-none focus:ring-0"
      />
      <div className="flex items-center h-[50px]">
        <div className="w-[100px] mr-8 text-white">
          Coin
        </div>
        <Link to="/profile">
          <img
            src={DefaultAvatar}
            alt="User Avatar"
            className="w-12 h-12 rounded-full ml-3 object-cover cursor-pointer bg-white"
          />
        </Link>
      </div>
    </div>
  )
}
