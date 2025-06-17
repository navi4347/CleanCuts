// src/components/StockFilter.jsx
import React, { useState } from "react";
import { TextField, MenuItem, Button, Box, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { invoke } from "@tauri-apps/api/core";

const metricOptions = [
  { value: "purchased_stock", label: "Purchased Stock" },
  { value: "sold_stock", label: "Sold Stock" },
];

function StockFilter({ categories = [] }) {
  const [metric, setMetric] = useState("");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    if (!metric || !category) {
      setResult("Please select both metric and category.");
      return;
    }

    const payload = {
      category,
      metric,
      from: fromDate ? fromDate.toISOString().split("T")[0] : null,
      to: toDate ? toDate.toISOString().split("T")[0] : null,
      month: month ? month.getMonth() + 1 : null,
      year: month ? month.getFullYear() : null,
    };

    try {
      const value = await invoke("total_stock_for_category", payload);
      setResult(`Total ${metric.replace("_", " ")} for ${category}: ${value}`);
    } catch (err) {
      console.error("Error fetching stock total:", err);
      setResult("Error fetching result. Please try again.");
    }
  };

  const handleClear = () => {
    setMetric("");
    setCategory("");
    setMonth(null);
    setFromDate(null);
    setToDate(null);
    setResult("");
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        select
        label="Select the Metric"
        value={metric}
        onChange={(e) => setMetric(e.target.value)}
      >
        <MenuItem value="" disabled>
          Select the Metric
        </MenuItem>
        {metricOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Select the Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <MenuItem value="" disabled>
          Select the Category
        </MenuItem>
        {categories.map((c) => (
          <MenuItem key={c.name} value={c.name}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          views={["year", "month"]}
          label="Select Month"
          value={month}
          onChange={(newValue) => {
            setMonth(newValue);
            setFromDate(null);
            setToDate(null);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <Typography align="center">OR</Typography>

        <DatePicker
          label="From Date"
          value={fromDate}
          onChange={(newValue) => {
            setFromDate(newValue);
            setMonth(null);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <DatePicker
          label="To Date"
          value={toDate}
          onChange={(newValue) => {
            setToDate(newValue);
            setMonth(null);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </LocalizationProvider>

      <Box display="flex" gap={2}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="outlined" onClick={handleClear} color="secondary">
          Clear All
        </Button>
      </Box>

      <TextField
        label="Result"
        value={result}
        InputProps={{ readOnly: true }}
        fullWidth
        multiline
      />
    </Box>
  );
}

export default StockFilter;
