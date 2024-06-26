import { useState } from "react";
import { predict, savePrediction, selectPredict } from "../redux";
import { useAppDispatch } from "../../store/hooks";
import { InputContainer, LoginContainer } from "../../auth/styles/LoginStyles";
import Button from "../../components/button";
import Input from "../../components/input";
import { useSelector } from "react-redux";

/**
 * PredictPage is a React functional component that renders the PredictPage page.
 * @returns PredictPage component
 */
function PredictPage() {
  const [image, setImage] = useState<{ image: File } | null>(null);
  const [nickname, setNickname] = useState<string | number>("");
  const dispatch = useAppDispatch();
  const prediction = useSelector(selectPredict);
  return (
    <LoginContainer>
      <input
        style={{ fontFamily: "'Staatliches', sans-serif" }}
        placeholder="image"
        type="file"
        name="image"
        onChange={(e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            setImage({
              image: file,
            });
          }
        }}
      />
      <Button
        content="Analyze parking"
        action={() => {
          dispatch(predict({ image: image?.image ?? null }));
        }}
      />
      <div style={{ display: "flex", flexDirection: "row" }}>
        Prediction:&nbsp;
        <div
          style={{
            color:
              prediction === "good"
                ? "green"
                : prediction === "bad"
                  ? "red"
                  : "gray",
          }}
        >
          {prediction ?? "No prediction yet"}
        </div>
      </div>
      <InputContainer>
        <Input
          value={nickname}
          labelName={"Scooter"}
          fieldName={""}
          setValue={setNickname}
        />
        <Button
          content="Finish parking"
          action={() =>
            dispatch(
              savePrediction({
                nickname: nickname.toString(),
                imageFile: image?.image ?? new File([], ""),
              }),
            )
          }
        />
      </InputContainer>
    </LoginContainer>
  );
}

export default PredictPage;
