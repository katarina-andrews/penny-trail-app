import { useState, useEffect } from "react";
import "./App.scss";
import { listAllItems } from "./utils/dynamo";
import Total from "./components/Total";
import Form from "./components/Form";
import GridTable from "./components/GridTable";
import ModalAlone from "./components/ModalAlone";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [expenseEdit, setExpenseEdit] = useState({});
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

  const totalCost = expenses.reduce((sum, expense) => {
    return sum + (parseFloat(expense.cost) || 0);
  }, 0);

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
      <header>
        <h1>PennyTrail</h1>
        <p>
          Keep track of all your monthly expenses, bills and random purchases
        </p>
      </header>
      <main>
        <section>
          <Form
            setExpenses={setExpenses}
            validateExpenseName={validateExpenseName}
            validateNumberInput={validateNumberInput}
            validatePayMethod={validatePayMethod}
            expenseNameError={expenseNameError}
            expenseNameHelper={expenseNameHelper}
            payMethodHelper={payMethodHelper}
            payMethodError={payMethodError}
            numberError={numberError}
            numberHelper={numberHelper}
          />
        </section>
        <section>
          <Total totalCost={totalCost} />
          <GridTable
            expenses={expenses}
            setExpenses={setExpenses}
            setExpenseEdit={setExpenseEdit}
            setOpen={setOpen}
          />
          <ModalAlone
            setExpenses={setExpenses}
            setExpenseEdit={setExpenseEdit}
            setOpen={setOpen}
            open={open}
            expenseEdit={expenseEdit}
            validateNumberInput={validateNumberInput}
            validatePayMethod={validatePayMethod}
            validateExpenseName={validateExpenseName}
            expenseNameError={expenseNameError}
            expenseNameHelper={expenseNameHelper}
            payMethodError={payMethodError}
            payMethodHelper={payMethodHelper}
            numberError={numberError}
            numberHelper={numberHelper}
          />
        </section>
      </main>
      <footer>&copy; Katarina Andrews</footer>
    </>
  );
}

export default App;
