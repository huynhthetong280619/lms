import React from 'react';
import PropTypes from 'prop-types';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

function CustomOverlay({ classNames, selectedDay, children, ...props }) {
  return (
    <div
      className={classNames.overlayWrapper}
      style={{ marginLeft: -100 }}
      {...props}
    >
      <div className={classNames.overlay} style={{position: 'absolute', top: '-375px'}}>
        {children}
      </div>
    </div>
  );
}

CustomOverlay.propTypes = {
  classNames: PropTypes.object.isRequired,
  selectedDay: PropTypes.instanceOf(Date),
  children: PropTypes.node.isRequired,
};

export default function DayPickerInputCustomize({value, onDayChange, style}) {
  console.log('event', onDayChange)
  return (
    <DayPickerInput
      overlayComponent={CustomOverlay}
      dayPickerProps={{
        todayButton: 'Today',
      }}
      keepFocus={false}
      value={value}
      onDayChange={onDayChange}
      style={style}
    />
  );
}
