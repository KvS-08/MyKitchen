import React from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  onChange: (newColor: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return (
    <div className="color-picker-container">
      <HexColorPicker color={color} onChange={onChange} />
    </div>
  );
};

export default ColorPicker;