import React from 'react';
import style from './Sidebar.module.css'
import logo from '../../dataspan.webp'
import Filters from '../Filters/Filters'
import Ranges from '../Ranges/Ranges';

const Sidebar = () => {
  return (
    <div className={style.Sidebar}>
      <img src={logo} alt='logo' className={style.Logo}/>
      <Filters />
      <Ranges />
      <button>Clear Filters</button>
    </div>
  );
}

export default Sidebar;