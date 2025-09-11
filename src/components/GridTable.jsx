import React from "react";
import dayjs from "dayjs";
import { deleteItem } from "../utils/dynamo";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function GridTable({
  expenses,
  setExpenses,
  setOpen,
  setExpenseEdit,
}) {
  const handleOpen = (expenseObject) => {
    setExpenseEdit({
      ...expenseObject,
      date: expenseObject.date ? dayjs(expenseObject.date) : null,
    });
    setOpen(true);
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
    <Paper sx={{ width: "100%", maxWidth: "800px", margin: "0 auto", py: 3 }}>
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
  );
}
