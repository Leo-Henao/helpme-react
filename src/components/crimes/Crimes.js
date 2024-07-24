import React, { useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { obtenerTodos } from '../../services/public/DelitoService';
import { getUserById } from '../../services/private/UserProfileService';
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
                    {data.map(({ id, nombre, descripcion, agregadoPorNombre }) => (
                        <tr className="table-active" key={id}>
                            <th scope="row">{id}</th>
                            <td>{nombre}</td>
                            <td>{descripcion}</td>
                            <td>{agregadoPorNombre}</td>
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
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDelitos = async () => {
            try {
                const delitos = await obtenerTodos();
                const delitosConNombre = await Promise.all(delitos.map(async (delito) => {
                    const user = await getUserById(delito.agregadoPor);
                    return {
                        ...delito,
                        agregadoPorNombre: user.nombre // Asegúrate de que esta propiedad existe en la respuesta del usuario
                    };
                }));
                setTableData(delitosConNombre);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar los delitos:', error);
                setLoading(false);
            }
        };

        fetchDelitos();
    }, []);

    if (loading) {
        return <p>Cargando...</p>;
    }

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