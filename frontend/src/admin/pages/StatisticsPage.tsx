import styled from "styled-components";
import Chart from "../../components/chart";
import CustomSelect from "../../components/dropdown";
import Input from "../../components/input";
import Button from "../../components/button";
import React, { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import {
  clear,
  getImages,
  getStatistics,
  selectImages,
  selectStatistics,
} from "..";
import { useAppSelector } from "../../store/hooks";
import { ImageMap } from "../../types/userTypes";
import { DialogTitle } from "@mui/material";
import ImageCard from "../../components/imageCard";

/**
 * QuerySelect is a styled component that defines the style of the QuerySelect component.
 */
const QuerySelect = styled.div`
  display: flex;
  flex-direction: ${window.innerWidth > 600 ? "row" : "column"};
  align-items: ${window.innerWidth > 600 ? "center" : "flex-end"};
  ${window.innerWidth > 600 ? "justify-content: center; " : ""};
  & > * {
    margin: 1vw;
  }
`;

/**
 * ItemStyle is a CSSProperties object that defines the style of the items in the QuerySelect component.
 */
const ItemStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};

/**
 * StatisticsPage is a React functional component that renders the StatisticsPage page.
 * It uses the useAppDispatch hook.
 * It also uses the getStatistics, getImages functions.
 * It renders a form that allows the user to query the statistics.
 * @returns StatisticsPage component
 */
const StatisticsPage = () => {
  const data = useAppSelector(selectStatistics);

  const [value1, setValue1] = React.useState<number | string>(0);
  const [value2, setValue2] = React.useState<number | string>(0);
  const [value3, setValue3] = React.useState<number | string>(0);
  const dispatch = useAppDispatch();
  const images = useAppSelector(selectImages);

  useEffect(() => {
    dispatch(clear());
  }, []);

  return (
    <div>
      <QuerySelect>
        <div style={ItemStyle}>
          get all data of&nbsp;
          <CustomSelect
            values={[
              { numValue: 1, strValue: "scooter" },
              { numValue: 2, strValue: "user" },
            ]}
            value={value2}
            setValue={setValue2}
          />
        </div>
        <div style={ItemStyle}>
          with&nbsp;
          <Input
            value={value1}
            labelName="id"
            setValue={setValue1}
            fieldName={""}
          />
        </div>
        <div style={ItemStyle}>
          from&nbsp;
          <CustomSelect
            values={[
              { numValue: 1, strValue: "last week" },
              { numValue: 2, strValue: "last month" },
            ]}
            value={value3}
            setValue={setValue3}
          />
        </div>
        <Button
          content="Query"
          action={() => {
            dispatch(
              getStatistics({
                value: value2 === 1 ? "scooter" : "user",
                id: Number(value1),
                time: value3 === 1 ? "week" : "month",
              })
            );
            dispatch(getImages(data));
          }}
        />
      </QuerySelect>
      <DialogTitle>
        {value2 === 2 ? "Scooters " : "Users "}
        {value2 === 1 ? "for scooter " : "for user "}
        {value1}
        {value3 === 1 ? " last week" : " last month"}
      </DialogTitle>
      <Chart
        data={Object.entries(
          data.reduce(
            (
              acc: {
                [key: string]: {
                  good: number;
                  bad: number;
                };
              },
              item: ImageMap
            ) => {
              const date = new Date(item.timestamp);
              const day = date.toLocaleDateString("en-US", { weekday: "long" });
              const week = `Week ${Math.floor(date.getDate() / 7) + 1}`;

              const key = value3 === 1 ? day : week;

              if (!acc[key]) {
                acc[key] = { good: 0, bad: 0 };
              }

              if (item.prediction === "good") {
                acc[key].good += 1;
              } else if (item.prediction === "bad") {
                acc[key].bad += 1;
              }

              return acc;
            },
            {}
          )
        ).map(
          ([key, value]: [
            string,
            {
              good: number;
              bad: number;
            },
          ]) => ({
            timestamp: key,
            [key + " good"]: value.good,
            [key + " bad"]: value.bad,
          })
        )}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Button
          content="Go to edit page"
          action={() => {
            window.location.href = "http://localhost:8000/admin";
          }}
        />
      </div>
      <DialogTitle>Images</DialogTitle>
      <div
        style={{
          display: "flex",
          flexDirection: window.innerWidth > 600 ? "row" : "column",
        }}
      >
        {images
          ? images.map(
              (image, index) =>
                image && (
                  <ImageCard
                    key={index}
                    imageUrl={image ?? ""}
                    timestamp={new Date(data[index].timestamp).toLocaleString()}
                    prediction={data[index].prediction}
                  />
                )
            )
          : null}
      </div>
    </div>
  );
};

export default StatisticsPage;
