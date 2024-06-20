import styled from "styled-components";
import { UseFormRegister } from "react-hook-form";
import { FormFields } from "../types/userTypes";

export const InputStyled = styled.input`
  background-color: #98ff98;
  padding: 0.5vw 1vw;
  border: none;
  margin-left: 0.5vw;
  width: 100%;
`;

const Label = styled.label`
  font-size: ${window.innerWidth > 600 ? "1.5vw" : "4vw"};
  font-family: "Staatliches", sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

/**
 * Input component to display a label and an input field
 * It uses the styled-components library to style the input field
 * @param labelName { string } name of the label to be displayed
 * @param fieldName { string } name of the field to be displayed
 * @param setValue { React.Dispatch<React.SetStateAction<string | number>> } function to set the value of the input field
 * @param value { string | number | null | boolean } value of the input field
 * @param register { UseFormRegister<FormFields> } function to register the input field with react-hook-form
 * @returns an input component
 */
const Input = ({
  labelName,
  fieldName,
  setValue,
  value,
  register,
}: {
  labelName: string;
  fieldName: string;
  setValue: React.Dispatch<React.SetStateAction<string | number>>;
  value?: string | number | null | boolean;
  register?: UseFormRegister<FormFields>;
}) => {
  return (
    <Label>
      {labelName}
      <InputStyled
        {...(register ? register(fieldName as keyof FormFields) : {})}
        type={["Password", "Confirm"].includes(labelName) ? "password" : "text"}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        value={value ? value.toString() : ""}
      ></InputStyled>
    </Label>
  );
};

export default Input;
