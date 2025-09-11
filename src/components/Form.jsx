import { useState } from "react";
import { createItem } from "../utils/dynamo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export default function Form({
  setExpenses,
  validateNumberInput,
  validatePayMethod,
  validateExpenseName,
  expenseNameError,
  expenseNameHelper,
  payMethodError,
  payMethodHelper,
  numberError,
  numberHelper,
}) {
  const [date, setDate] = useState(null);

  const handleCreateExpense = async (e) => {
    e.preventDefault();

    const newExpense = {
      id: Date.now().toString(),
      date: e.target.date.value,
      expenseName: e.target.expenseName.value,
      payMethod: e.target.payMethod.value,
      cost: parseFloat(e.target.cost.value),
    };

    await createItem("Spend", newExpense);

    setExpenses((oldExpenses) => {
      return [...oldExpenses, newExpense];
    });

    e.target.reset();
  };
  return (
    <>
      <form onSubmit={(e) => handleCreateExpense(e)}>
        <Stack
          direction="column"
          spacing={2}
          sx={{ maxWidth: "fit-content", margin: "0 auto" }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker", "DatePicker"]}>
              <DatePicker
                id="date"
                name="date"
                label="Date of Expense"
                value={date}
                onChange={(newDate) => setDate(newDate)}
              />
            </DemoContainer>
          </LocalizationProvider>

          <TextField
            id="expenseName"
            name="expenseName"
            label="Expense Name"
            variant="outlined"
            slotProps={{
              input: {
                onChange: (e) => validateExpenseName(e.target.value),
                onBlur: (e) => validateExpenseName(e.target.value),
              },
            }}
            error={expenseNameError}
            helperText={expenseNameHelper}
          />
          <TextField
            id="payMethod"
            name="payMethod"
            label="Payment Method"
            variant="outlined"
            slotProps={{
              input: {
                onChange: (e) => validatePayMethod(e.target.value),
                onBlur: (e) => validatePayMethod(e.target.value),
              },
            }}
            error={payMethodError}
            helperText={payMethodHelper}
          />
          <TextField
            id="cost"
            name="cost"
            label="Cost $"
            variant="outlined"
            type="text"
            slotProps={{
              input: {
                step: "0.01",
                min: 0,
                inputMode: "decimal",
                onChange: (e) => validateNumberInput(e.target.value),
                onBlur: (e) => validateNumberInput(e.target.value),
              },
            }}
            error={numberError}
            helperText={numberHelper}
          />
          <Button variant="contained" color="secondary" type="submit">
            Add Expense
          </Button>
        </Stack>
      </form>
    </>
  );
}
