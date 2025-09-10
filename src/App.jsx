import { useState, useEffect } from "react";
import "./App.scss";
import {
  listAllItems,
  createItem,
  updateItem,
  deleteItem,
} from "./utils/dynamo";
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
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";

function App() {
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

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#f3e5f5",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const handleGetExpense = async () => {
      const items = await listAllItems("Spend");

      setExpenses(items);
    };

    handleGetExpense();
  }, []);

  const handleOpen = (expenseObject) => {
    setExpenseEdit({
      ...expenseObject,
      date: expenseObject.date ? dayjs(expenseObject.date) : null,
    });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const totalCost = expenses.reduce((sum, expense) => {
    return sum + (parseFloat(expense.cost) || 0);
  }, 0);

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

  const handleUpdateExpense = async (e) => {
    e.preventDefault();

    const { date, expenseName, payMethod, cost } = expenseEdit;
    console.log(expenseEdit);
    console.log(expenseEdit.id);
    await updateItem(
      "Spend",
      { id: expenseEdit.id },
      {
        date: date ? date.format("MM/DD/YYYY") : "",
        expenseName,
        payMethod,
        cost: parseFloat(cost),
      }
    );

    setExpenses((oldExpenses) => {
      return oldExpenses.map((expenseObject) => {
        return expenseObject.id === expenseEdit.id
          ? {
              ...expenseEdit,
              date: date ? date.format("MM/DD/YYYY") : "",
              cost: parseFloat(expenseEdit.cost),
            }
          : expenseObject;
      });
    });

    setOpen(false);
  };

  const handleDeleteExpense = async (id) => {
    await deleteItem("Spend", { id: id });
    console.log(id);
    setExpenses((oldExpenses) => {
      return oldExpenses.filter((expenseObject) => {
        return expenseObject.id != id;
      });
    });
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

  const columns = [
    { field: "date", headerName: "Date", flex: 1, minWidth: 100 },
    {
      field: "expenseName",
      headerName: "Expense Name",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "payMethod",
      headerName: "Payment Method",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "cost",
      headerName: "Cost",
      type: "number",
      flex: 0.5,
      minWidth: 80,
    },

    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (expenseObject) => {
        return (
          <IconButton onClick={() => handleOpen(expenseObject)}>
            <EditIcon />
          </IconButton>
        );
      },
    },

    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (expenseObject) => {
        return (
          <IconButton onClick={() => handleDeleteExpense(expenseObject.id)}>
            <DeleteIcon />
          </IconButton>
        );
      },
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <>
      <header>
        <h1>PennyTrail</h1>
        <p>
          Keep track of all your monthly expenses, bills and random purchases
        </p>
      </header>
      <main>
        <section>
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
        </section>
        <section>
          <div style={{ marginTop: "16px" }}>
            <h2>Total Expense Cost</h2> <p>${totalCost.toFixed(2)}</p>
          </div>
          <Paper
            sx={{ width: "100%", maxWidth: "800px", margin: "0 auto", py: 3 }}
          >
            <div>
              <DataGrid
                rows={expenses}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                sx={{
                  "& .MuiDataGrid-virtualScroller": { overflowX: "auto" },
                  "& .MuiDataGrid-main": { minWidth: "100%" },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                  },
                }}
              />
            </div>
          </Paper>

          <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
              <form onSubmit={(event) => handleUpdateExpense(event)}>
                <Stack
                  direction="column"
                  spacing={2}
                  sx={{ maxWidth: "fit-content", margin: "0 auto" }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker", "DatePicker"]}>
                      <DatePicker
                        label="Date of Expense"
                        value={expenseEdit.date}
                        onChange={(newValue) =>
                          setExpenseEdit((oldExpenses) => ({
                            ...oldExpenses,
                            date: newValue,
                          }))
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>

                  <TextField
                    label="Expense Name"
                    value={expenseEdit.expenseName}
                    onChange={(e) => {
                      setExpenseEdit((oldExpenses) => ({
                        ...oldExpenses,
                        expenseName: e.target.value,
                      }));
                      validateExpenseName(e.target.value);
                    }}
                    error={expenseNameError}
                    helperText={expenseNameHelper}
                    slotProps={{
                      input: {
                        onBlur: (e) => validateExpenseName(e.target.value),
                      },
                    }}
                  />

                  <TextField
                    label="Payment Method"
                    value={expenseEdit.payMethod}
                    onChange={(e) => {
                      setExpenseEdit((oldExpenses) => ({
                        ...oldExpenses,
                        payMethod: e.target.value,
                      }));
                      validatePayMethod(e.target.value);
                    }}
                    error={payMethodError}
                    helperText={payMethodHelper}
                    slotProps={{
                      input: {
                        onBlur: (e) => validatePayMethod(e.target.value),
                      },
                    }}
                  />

                  <TextField
                    label="Cost $"
                    value={expenseEdit.cost}
                    onChange={(e) => {
                      setExpenseEdit((oldExpenses) => ({
                        ...oldExpenses,
                        cost: e.target.value,
                      }));
                      validateNumberInput(e.target.value);
                    }}
                    type="text"
                    slotProps={{
                      input: {
                        step: "0.01",
                        min: 0,
                        inputMode: "decimal",
                        onBlur: (e) => validateNumberInput(e.target.value),
                      },
                    }}
                    error={numberError}
                    helperText={numberHelper}
                  />
                  <Button variant="contained" color="secondary" type="submit">
                    Update Expense
                  </Button>
                </Stack>
              </form>
            </Box>
          </Modal>
        </section>
      </main>
      <footer>&copy; Katarina Andrews</footer>
    </>
  );
}

export default App;
