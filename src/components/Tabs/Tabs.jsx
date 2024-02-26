import React from 'react';
import style from './Tabs.module.css'

const Tabs = ({tab, setTab}) => {

  const isActive = (name) => name === tab ? true : false
  return (
    <div className={style.Tabs}>
      <div className={`${style.Tab} ${isActive('allGroups') ? style.TabActive : ''}`} onClick={() => setTab('allGroups')}>All groups</div>
      <div className={`${style.Tab} ${isActive('train') ? style.TabActive : ''}`} onClick={() => setTab('train')}>Train</div>
      <div className={`${style.Tab} ${isActive('valid') ? style.TabActive : ''}`} onClick={() => setTab('valid')}>Valid</div>
      <div className={`${style.Tab} ${isActive('test') ? style.TabActive : ''}`} onClick={() => setTab('test')}>Test</div>
    </div>
  );
}

export default Tabs;