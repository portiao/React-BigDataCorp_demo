import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Container,Row } from "react-bootstrap";

function People() {
  //儲存api fetch回來的資料狀態
  const [returnApi, setReturnApi] = useState([]);
  //縣市轉換的狀態
  const [inputCity, setInputCity] = useState("");
  //男生的狀態
  const [male, setMale] = useState(0);
  //女生的狀態
  const [female, setFemale] = useState(0);
  //data狀態
  const [data, setData] = useState([]);

  //下拉選單
  const taipeiTownList = [
    "中正區",
    "大同區",
    "中山區",
    "松山區",
    "大安區",
    "萬華區",
    "信義區",
    "士林區",
    "北投區",
    "內湖區",
    "南港區",
    "文山區",
  ];

  //抓取API資料
  async function fetchFunction() {
    try {
      const response = await fetch(
        `https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/109?&COUNTY=臺北市&town=${inputCity}`
      );
      const json = await response.json();
      //轉換的結果寫入狀態
      setReturnApi(json);
    } catch (err) {
      throw err;
    }
  }

  //陣列相加
  //   "household_ordinary_m": "2227",
  //   "household_business_m": "0",
  //   "household_single_m": "337",
  //   "household_ordinary_f": "2355",
  //   "household_business_f": "0",
  //   "household_single_f": "365"

  function AllData(arr) {
    let sum_m = 0; //男
    let sum_f = 0; //女

    for (let i = 0; i < arr.length; i++) {
      sum_m +=
        parseInt(arr[i].household_ordinary_m, 10) +
        parseInt(arr[i].household_business_m, 10) +
        parseInt(arr[i].household_single_m, 10);
      sum_f +=
        parseInt(arr[i].household_ordinary_f, 10) +
        parseInt(arr[i].household_business_f, 10) +
        parseInt(arr[i].household_single_f, 10);
      // console.log(arr[i]);
    }
    // console.log(arr);
    setMale(sum_m);
    setFemale(sum_f);

    //圖表data
    setData([
      {
        name: "male",
        total: sum_m,
        amt: 2500,
      },
      {
        name: "female",
        total: sum_f,
        amt: 2500,
      },
    ]);
  }

  useEffect(() => {
    inputCity !== "" && fetchFunction();
  }, [inputCity]);

  //資料撈回時，在執行AllData()
  useEffect(() => {
    returnApi.responseData !== undefined && AllData(returnApi.responseData);
  }, [returnApi]);

  return (
    <>
      <Dropdown>
        <h5>區域選擇 : </h5>

        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {inputCity}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {taipeiTownList.map((v, i) => (
            <Dropdown.Item
              onClick={(e) => {
                setInputCity(e.target.text);
              }}
              key={i}
            >
              {v}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* <label>
        <select
          className="selectClass"
          value={inputCity}
          onChange={(e) => {
            setInputCity(e.target.value);
          }}
        >
          <option value="區域">臺北市行政區</option>
          {taipeiTownList.map((v, i) => (
            <option key={i}>{v}</option>
          ))}
        </select>
      </label> */}

      {/* 圖表 */}

      <Container>
        <Row className="justify-content-center">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </Row>
      </Container>
    </>
  );
}

export default People;
