import React from "react";

export default function Total({ totalCost }) {
  return (
    <div style={{ marginTop: "16px" }}>
      <h2>Total Expense Cost</h2> <p>${totalCost.toFixed(2)}</p>
    </div>
  );
}
