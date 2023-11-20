import React from 'react';
import "./ResponsiveTable.css"
import MaterialTable from 'material-table';
import tableIcons from "./TableIcons";
import { Paper } from '@material-ui/core';

function ResponsiveTable({columns, data, setData, onAdd, onDelete, onUpdate}) {

    return (
        <MaterialTable
            columns={columns}
            data={data}
            icons={tableIcons}
            editable={{
                onRowAdd: newData =>
                new Promise((resolve, reject) => {
                        setTimeout(() => {
                        onAdd(newData)
                        resolve();
                    }, 500)
                }),
                onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        onUpdate(newData, oldData)
                        const dataUpdate = [...data];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        setData([...dataUpdate]);
                        resolve();
                    }, 500)
                }),
                onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        onDelete(oldData)
                        const dataDelete = [...data];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        setData([...dataDelete]);
                        resolve()
                    }, 500)
                }),
            }}
            options={{
                showTitle: false,
                paging: false,
                searchFieldAlignment: "left",
                actionsColumnIndex: -1,
                addRowPosition: "first",
           }}
           components={
            {
                Container: props => <Paper {...props} elevation={0}/>,
            }
           }
           localization={{ body: { editRow: { deleteText: 'Are you sure you want to remove this admin?' } } }}
        />
    )
}

export default ResponsiveTable;