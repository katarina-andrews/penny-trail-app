import { useState, useEffect } from "react";
import { listAllItems,
   createItem,
    updateItem,
    deleteItem,
 } from "../utils/dynamo";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";

export default function ModalForm() {
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

    const handleOpen = (expenseObject) => {
    setExpenseEdit({
      ...expenseObject,
      date: expenseObject.date ? dayjs(expenseObject.date) : null,
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

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
  return (
    <>
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
                    value={expenseEdit?.date}
                    onChange={(newValue) =>
                      setExpenseEdit((prev) => ({
                        ...prev,
                        date: newValue,
                      }))
                    }
                  />
                </DemoContainer>
              </LocalizationProvider>

              <TextField
                label="Expense Name"
                value={expenseEdit?.expenseName}
                onChange={(e) => {
                  setExpenseEdit((prev) => ({
                    ...prev,
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
                value={expenseEdit?.payMethod}
                onChange={(e) => {
                  setExpenseEdit((prev) => ({
                    ...prev,
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
                value={expenseEdit?.cost}
                onChange={(e) => {
                  setExpenseEdit((prev) => ({
                    ...prev,
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
    </>
  );
}
