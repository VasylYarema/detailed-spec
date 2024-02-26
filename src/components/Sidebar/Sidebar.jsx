import React from 'react';
import style from './Sidebar.module.css'
import logo from '../../dataspan.webp'
import Filters from '../Filters/Filters'
import Ranges from '../Ranges/Ranges';

const Sidebar = () => {
  return (
    <div className={style.Sidebar}>
      <img src='../../dataspan.webp' alt='logo' className={style.Logo}/>
      <Filters />
      <Ranges />
    </div>
  );
}

export default Sidebar;