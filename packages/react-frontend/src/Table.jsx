import React from "react"

// src/Table.jsx
function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Job</th>
        <th>Id</th>
        <th>Remove</th>
      </tr>
    </thead>
  );
}

// props are always read-only and can only be modified by the parent
function TableBody(props) {
    const rowContents = props.charData.map((row,index) => {
        return (
            <tr key={index}>
                <td>{row.name}</td>
                <td>{row.job}</td>
                <td>{row._id}</td>
                <td>
                    <button onClick={() => props.removeChar(index)}>
                    Delete
                    </button>
                </td>
            </tr>
        )
    });
    return (
        <tbody>
            {rowContents}
        </tbody>
    )
}

function Table(props) {
    return (
        <table>
            <TableHeader />
            <TableBody charData={props.charData} removeChar={props.removeChar}/>
        </table>
    );
}

export default Table;