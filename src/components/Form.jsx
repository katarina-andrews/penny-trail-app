import "../App.scss";
import { useState, useEffect} from "react";
import {
  listAllItems,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/dynamo";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export default function Form() {
      const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [expenseEdit, setExpenseEdit] = useState({});
  const [date, setDate] = useState(null);
  const [numberError, setNumberError] = useState(false);
  const [numberHelper, setNumberHelper] = useState("");
  const [expenseNameError, setExpenseNameError] = useState(false);
  const [expenseNameHelper, setExpenseNameHelper] = useState("");
  const [payMethodError, setPayMethodError] = useState(false);
  const [payMethodHelper, setPayMethodHelper] = useState("");

   useEffect(() => {
      const handleGetExpense = async () => {
        const items = await listAllItems("Spend");
  
        setExpenses(items);
      };
  
      handleGetExpense();
    }, []);

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

  const validateExpenseName = (value) => {
    const textRegex = /^[A-Za-z\s]*$/;
    if (!textRegex.test(value)) {
      setExpenseNameError(true);
      setExpenseNameHelper("Please enter a valid text input.");
    } else {
      setExpenseNameError(false);
      setExpenseNameHelper("");
    }
  };

  const validatePayMethod = (value) => {
    const textRegex = /^[A-Za-z\s]*$/;
    if (!textRegex.test(value)) {
      setPayMethodError(true);
      setPayMethodHelper("Please enter a valid text input.");
    } else {
      setPayMethodError(false);
      setPayMethodHelper("");
    }
  };
  const validateNumberInput = async (value) => {
    const numberRegex = /^(0|[1-9]\d*)(\.\d+)?$/;
    if (!numberRegex.test(value)) {
      setNumberError(true);
      setNumberHelper("Please enter a valid monetary input.");
    } else {
      setNumberError(false);
      setNumberHelper("");
    }
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
