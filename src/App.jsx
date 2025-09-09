import { useState, useEffect } from "react";
import "./App.scss";
import { createItem, listAllItems } from "./utils/dynamo";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [expenseEdit, setExpenseEdit] = useState({});
  const [calcExpense, setCalcExpense] = useState({});
  const [date, setDate] = useState(null);

  useEffect(() => {
    const handleGetExpense = async () => {
      const items = await listAllItems("Spend");

      setExpenses(items);
    };

    handleGetExpense();
  }, []);

  // add open and close function to connect to edit modal

  const handleCreateExpense = async (event) => {
    event.preventDefault();

    const newExpense = {
      id: Date.now().toString(),
      date: event.target.date.value,
      expenseName: event.target.expenseName.value,
      payMethod: event.target.payMethod.value,
      amount: parseFloat(event.target.amount.value),
    };
    // add console.logs to check newExpense

    await createItem("Spend", newExpense);

    setExpenses((oldExpenses) => {
      return [...oldExpenses, newExpense];
    });

    event.target.reset();
  };

  // add function for updating expenses

  // add function for deleting expenses

  return (
    <>
      <header>
        <h1>PennyTrail</h1>
        <p>Keep track of all your monthly bills and expenses </p>
      </header>
      <main>
        <section>
          <form onSubmit={(event) => handleCreateExpense(event)}>
            <Stack
              direction="column"
              spacing={2}
              sx={{ maxWidth: "fit-content" }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker", "DatePicker"]}>
                  <DatePicker
                    label="Date of Expense"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>

              <TextField
                id="outlined-basic"
                label="Expense Name"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                label="Payment Method"
                variant="outlined"
              />
              <TextField id="outlined-basic" label="Cost" variant="outlined" />
              <Button variant="contained" color="success" type="submit">
                Add Expense
              </Button>
            </Stack>
          </form>
        </section>
        <section>
          <h2>Expense Tracking</h2>
          {/* add divs for total amount  */}
          {/* add data grid data table from material ui  */}
        </section>
      </main>
      <footer>&copy; Katarina Andrews</footer>
    </>
  );
}

export default App;
