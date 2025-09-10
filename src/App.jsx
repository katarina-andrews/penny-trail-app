import { useState, useEffect } from "react";
import "./App.scss";
import {
  listAllItems,
  createItem,
  updateItem,
  deleteItem,
} from "./utils/dynamo";
import dayjs from "dayjs";
import Form from "./components/Form";
import ModalForm from "./components/ModalForm";
import Table from "./components/Table";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [expenseEdit, setExpenseEdit] = useState({});

   useEffect(() => {
      const handleGetExpense = async () => {
        const items = await listAllItems("Spend");
  
        setExpenses(items);
      };
  
      handleGetExpense();
    }, []);

  // const handleCreateExpense = async (e) => {
  //   e.preventDefault();

  //   const newExpense = {
  //     id: Date.now().toString(),
  //     date: e.target.date.value,
  //     expenseName: e.target.expenseName.value,
  //     payMethod: e.target.payMethod.value,
  //     cost: parseFloat(e.target.cost.value),
  //   };

  //   await createItem("Spend", newExpense);

  //   setExpenses((oldExpenses) => {
  //     return [...oldExpenses, newExpense];
  //   });

  //   e.target.reset();
  // };

  //   const handleOpen = (expenseObject) => {
  //   setExpenseEdit({
  //     ...expenseObject,
  //     date: expenseObject.date ? dayjs(expenseObject.date) : null,
  //   });
  //   setOpen(true);
  // };
  // const handleClose = () => setOpen(false);

  // const handleUpdateExpense = async (e) => {
  //   e.preventDefault();

  //   const { date, expenseName, payMethod, cost } = expenseEdit;
  //   console.log(expenseEdit);
  //   console.log(expenseEdit.id);
  //   await updateItem(
  //     "Spend",
  //     { id: expenseEdit.id },
  //     {
  //       date: date ? date.format("MM/DD/YYYY") : "",
  //       expenseName,
  //       payMethod,
  //       cost: parseFloat(cost),
  //     }
  //   );

  //   setExpenses((oldExpenses) => {
  //     return oldExpenses.map((expenseObject) => {
  //       return expenseObject.id === expenseEdit.id
  //         ? {
  //             ...expenseEdit,
  //             date: date ? date.format("MM/DD/YYYY") : "",
  //             cost: parseFloat(expenseEdit.cost),
  //           }
  //         : expenseObject;
  //     });
  //   });

  //   setOpen(false);
  // };

  //   const handleDeleteExpense = async (id) => {
  //   await deleteItem("Spend", { id: id });
  //   console.log(id);
  //   setExpenses((oldExpenses) => {
  //     return oldExpenses.filter((expenseObject) => {
  //       return expenseObject.id != id;
  //     });
  //   });
  // };

  //   const totalCost = expenses.reduce((sum, expense) => {
  //   return sum + (parseFloat(expense.cost) || 0);
  // }, 0);

  

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
          <Form />
        </section>
        <section>
          <Table />
<ModalForm />
        </section>
      </main>
      <footer>&copy; Katarina Andrews</footer>
    </>
  );
}

export default App;
