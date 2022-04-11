import React from "react";
import Board from "../src/Board";
import fetch from "isomorphic-unfetch";
import Navbar from "../src/Navbar";

export default function Index(props) {
  return <Board {...props} />;
}

function str_pad(n) {
  return String("00" + n).slice(-2);
}

async function getDoing() {
  const res = await fetch(
    "https://corsssssss.herokuapp.com/https://vsc.instructure.com/api/v1/users/self/custom_data?ns=dev.acardosi.canban",
    {
      headers: {
        Authorization: `Bearer ${process.env.canvasToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );
  const json = await res.json();
  return json.data.doing;
}

Index.getInitialProps = async ctx => {
  // Get doing ids
  const doingIds = await getDoing();

  // Get latest assignments
  const currentDate = new Date();

  const urls = [
    `https://vsc.instructure.com/api/v1/planner/items?order=asc&start_date=${currentDate.getFullYear()}-${str_pad(
      currentDate.getMonth() + 1
    )}-${str_pad(currentDate.getDate())}`,
    "https://vsc.instructure.com/api/v1/users/self/colors"
  ];

  return await Promise.all(
    urls.map(u =>
      fetch(u, {
        headers: {
          Authorization: `Bearer ${process.env.canvasToken}`
        }
      })
    )
  )
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(jsons => {
      return { assignments: jsons[0], colors: jsons[1], doingIds };
    });
};
