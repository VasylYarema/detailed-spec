import React, {useState} from 'react';
import { Range } from 'react-range';
import style from './Range.module.css'

const Ranges = () => {

  const [value, setValue] = useState([0, 4]);

  return (
    <div className="ranges">
      <h4 className={style.LabelRange}>Poligon ranges</h4>
      <div className={style.LabelsRanges}>
        <span>min 0</span>
        <span>max 4</span>
      </div>
      <Range
        step={1}
        min={0}
        max={4}
        values={value}
        onChange={(values) => setValue(values)}
        marks={[1]}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '3px',
              width: '100%',
              backgroundColor: '#FFD75C'
            }}
          >
            {children}
          </div>
        )}
        renderMark={({ props, index }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '10px',
              width: '5px',
              backgroundColor: '#fff',
              position: 'absolute',
            }}
          />
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '15px',
              width: '15px',
              backgroundColor: '#FFD75C',
              borderRadius: '50%',
            }}
          />
        )}
      />
      <div className={style.ClearFilter}>Clear filters</div>
    </div>
  );
}

export default Ranges;