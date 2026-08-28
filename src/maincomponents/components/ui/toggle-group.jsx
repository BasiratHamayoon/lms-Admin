import React from 'react';

const ToggleGroup = ({ type = 'single', value, onValueChange, className = '', children }) => {
  const handleClick = (childValue) => {
    if (type === 'single') {
      onValueChange(childValue === value ? '' : childValue);
    }
  };

  return (
    <div className={`inline-flex rounded-md shadow-sm ${className}`} role="group">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          isSelected: value === child.props.value,
          onClick: () => handleClick(child.props.value)
        })
      )}
    </div>
  );
};

const ToggleGroupItem = ({ value, children, isSelected, onClick, className = '' }) => {
  return (
    <button
      type="button"
      value={value}
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border ${
        isSelected
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export { ToggleGroup, ToggleGroupItem };