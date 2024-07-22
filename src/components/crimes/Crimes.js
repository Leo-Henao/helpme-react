import React, { useContext, useRef } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import NoAuthorized from '../ui/NoAuthorized';
import '../../index.css';
import Create from './Create';
import jsPDF from 'jspdf';

const CrimesTable = ({ data }) => {
    return (
        <div className="table-responsive mb-5">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Agregado por</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(({ id, nombre, descripcion, agregadoPor }) => (
                        <tr className="table-active" key={id}>
                            <th scope="row">{id}</th>
                            <td>{nombre}</td>
                            <td>{descripcion}</td>
                            <td>{agregadoPor}</td>
                            <td>
                                <button className="btn btn-outline-primary" title="Editar">
                                    <i className="fa fa-edit"></i>
                                </button>
                                <button className="btn btn-outline-danger" title="Eliminar este">
                                    <i className="fa fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const PrintButton = ({ tableRef }) => {
    const print = () => {
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.fromHTML(tableRef.current, 15, 15, {
            'width': 170,
        });
        pdf.save("report.pdf");
    };

    return (
        <button className="btn btn-outline-primary" title="Imprimir PDF" onClick={print}>
            <i className="fas fa-print"></i>
        </button>
    );
};

export default function Crimes() {
    const { isAdmin } = useContext(AuthContext);
    const tableRef = useRef();

    const tableData = [
        { id: 1, nombre: 'Hurto', descripcion: 'cuando se quitan pertenencias', agregadoPor: 'julio' },
        { id: 2, nombre: 'Acoso Sexual', descripcion: 'Groserías a una persona', agregadoPor: 'julio' }
    ];

    return (
        <>
            {isAdmin ? (
                <div className="container" ref={tableRef}>
                    <CrimesTable data={tableData} />
                    <button
                        data-bs-toggle="modal"
                        href="#exampleModalToggle"
                        className="btn btn-outline-success"
                        title="Agregar nuevo"
                    >
                        <i className="fas fa-plus-circle"></i>
                    </button>
                    <PrintButton tableRef={tableRef} />
                </div>
            ) : (
                <NoAuthorized />
            )}
            <Create />
        </>
    );
}