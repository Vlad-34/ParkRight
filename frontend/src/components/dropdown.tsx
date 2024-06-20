import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

/**
 * Custom select component to display a dropdown
 * It uses the Material UI library to display the dropdown
 * The values are passed as a prop to the component
 * The values is an array of objects, where each object has a numValue key and a strValue key
 * @param values { numValue: number, strValue: string }[] values to be displayed in the dropdown
 * @param value { number | string } value of the dropdown
 * @param setValue { React.Dispatch<React.SetStateAction<number | string>> } function to set the value of the dropdown
 * @returns a dropdown component
 */
export default function CustomSelect({
  values,
  value,
  setValue,
}: {
  values: { numValue: number; strValue: string }[];
  value: number | string;
  setValue: React.Dispatch<React.SetStateAction<number | string>>;
}) {
  const handleChange = (event: SelectChangeEvent) => {
    setValue(Number(event.target.value));
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          labelId="demo-simple-select-label"
          value={value.toString()}
          id="demo-simple-select"
          onChange={handleChange}
          style={{
            height: "4vh",
          }}
        >
          {values.map((item) => (
            <MenuItem key={item.numValue} value={item.numValue}>
              {item.strValue}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
