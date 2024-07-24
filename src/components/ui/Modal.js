import React, { useState } from 'react';
import { DelitoService } from '../../services/private/DelitoService';
import { messages } from '../../utils/messages';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

export default function Modal({ title }) {
    const [loading, setLoading] = useState(false);
    const [delito, setDelito] = useState({
        nombre: '',
        descripcion: ''
    });

    const [errors, setErrors] = useState({
        nombre: '',
        descripcion: ''
    });

    const handleValidation = () => {
        let errors = {};
        let isValid = true;
        if(!delito.nombre) {
            isValid = false;
            errors["nombre"] = "Nombre requerido";
        } else {
            errors["nombre"] = "";
        }
        if(!delito.descripcion) {
            isValid = false;
            errors["descripcion"] = "Descripción requerida";
        } else {
            errors["descripcion"] = "";
        }
        setErrors({...errors});
        return isValid;
    }

    const sendRegister = e => {
        e.preventDefault();
        setLoading(true);
        if(handleValidation()) {
            DelitoService.addDelito(delito)
            .then(r => {
                let newDelito = {
                    nombre: '',
                    descripcion: ''
                }
                setDelito({...newDelito});
                setLoading(false);
                return Swal.fire('OK', messages.REG_EXITOSO, 'success');
            })
            .catch(e => {
                const { data } = e.response;
                console.log(data);
                setLoading(false);
                if(data.message)
                    return Swal.fire('Error', data.message, 'error');
                return Swal.fire('Error', messages.ERROR_REGISTRO, 'error');
            });   
        } 
    };

    const handleChange = e => {
        setDelito({
            ...delito,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className="container">
            <div className="col-md-7 col-lg-8 my-3">
                <h4 className="mb-3">Registrar Delito</h4>
                <form 
                className="needs-validation" 
                onSubmit={sendRegister}
                autoComplete="off"
                >
                    <div className="row g-3">
                        <div className="col-12">
                        <label htmlFor="nombre" className="form-label">Nombre<span className="text-muted">*</span></label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="nombre"
                            placeholder="Nombre del delito" 
                            required=""
                            name="nombre"
                            value={delito.nombre}
                            onChange={handleChange}
                        />
                        <div className="invalid-feedback d-block">
                            {errors.nombre}
                        </div>
                        </div>

                        <div className="col-12">
                        <label htmlFor="descripcion" className="form-label">Descripción<span className="text-muted">*</span></label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="descripcion" 
                            placeholder="Descripción del delito" 
                            required=""
                            name="descripcion"
                            value={delito.descripcion}
                            onChange={handleChange}
                        />
                        <div className="invalid-feedback d-block">
                            {errors.descripcion}
                        </div>
                        </div>
                    </div>

                    <hr className="my-4"/>
                    <button
                        disabled={loading ? 1: 0}
                        type="submit"
                        className="btn btn-primary w-50 btn-lg button-standard"
                    >
                    {loading && (
                    <span 
                        className="spinner-border spinner-border-sm" 
                        role="status" 
                        aria-hidden="true"
                    >
                    </span>
                    )}
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    )
}