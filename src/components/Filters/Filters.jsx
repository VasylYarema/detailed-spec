import React from 'react';
import style from './Filter.module.css'

const tags = ['Elbow positive', 'Fingers positive', 'Forearm fracture', 'Humerus fracture', 'Humerus', 'Shoulder fracture', 'Wrist positive'];

const Filters = () => {
  return (
    <div className="filters">
      <h4>Classes filter</h4>
      <div>
        <div className={style.FilterButton}>Select all</div>
        <div className={style.FilterButton}>Deselect all</div>
      </div>
      <ul className={style.FilterTags}>
        {tags.map((tag) => <li key={tag} className={style.FilterTag}>{tag}</li>)}
      </ul>
    </div>
  );
}

export default Filters;