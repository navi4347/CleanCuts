import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { invoke } from "@tauri-apps/api/core";

function Dashboard() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    invoke("fetch_categories")
      .then(setCategories)
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  if (categories.length === 0) {
    return <p className="p-4">Loading data...</p>;
  }

  const categoryNames = categories.map((cat) => cat.name);

  const columnOptions = {
    chart: { type: "column" },
    title: { text: "Category-wise Stock Quantities" },
    xAxis: { categories: categoryNames, crosshair: true },
    yAxis: { min: 0, title: { text: "Quantity" } },
    tooltip: { shared: true, valueSuffix: " units" },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: { enabled: true },
      },
    },
    series: [
      { name: "Purchased", data: categories.map((cat) => cat.purchased_stock) },
      { name: "Sold", data: categories.map((cat) => cat.sold_stock) },
      { name: "Available", data: categories.map((cat) => cat.available_stock) },
      { name: "Scrap", data: categories.map((cat) => cat.scrap) },
    ],
  };

  const pieOptions = {
    chart: { type: "pie" },
    title: { text: "Available Stock Value by Category" },
    tooltip: { pointFormat: "{series.name}: <b>{point.y}</b>" },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
        },
      },
    },
    series: [
      {
        name: "Stock Value",
        colorByPoint: true,
        data: categories.map((cat) => ({
          name: cat.name,
          y: cat.available_stock_price,
        })),
      },
    ],
  };

  return (
    <div className="p-4 space-y-8">
      <div className="container text-center">
  <div className="row">
    <div className="col">
           <HighchartsReact highcharts={Highcharts} options={pieOptions} />
    </div>
    <div className="col">
      Column
    </div>
  </div>
</div>
      <HighchartsReact highcharts={Highcharts} options={columnOptions} />

    </div>
  );
}

export default Dashboard;
