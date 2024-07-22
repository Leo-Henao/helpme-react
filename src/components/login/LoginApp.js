import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import { types } from '../../types/types';
import { messages } from '../../utils/messages';
import Swal from 'sweetalert2';
import { login } from '../../services/AuthService';

export default function LoginApp() {
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [usr, setUsr] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({ username: '', password: '' });

    const handleValidation = useCallback(() => {
        const errors = {};
        let isValid = true;

        if (!usr.username) {
            isValid = false;
            errors.username = "Email requerido";
        } else {
            const lastAtPos = usr.username.lastIndexOf('@');
            const lastDotPos = usr.username.lastIndexOf('.');
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && lastDotPos > 2 && (usr.username.length - lastDotPos) > 2)) {
                isValid = false;
                errors.username = "Email no válido";
            }
        }

        if (!usr.password) {
            isValid = false;
            errors.password = "Contraseña requerida";
        }

        setErrors(errors);
        return isValid;
    }, [usr]);

    const sendLogin = useCallback((e) => {
        e.preventDefault();
        if (handleValidation()) {
            setLoading(true);
            login(usr)
                .then(r => {
                    const lastPath = localStorage.getItem('lastPath') || '/private/profile';
                    dispatch({
                        type: types.login,
                        payload: { user: r.data }
                    });
                    navigate(lastPath, { replace: true });
                })
                .catch(e => {
                    const { data } = e.response || {};
                    const errorMsg = data?.message || messages.CREDS_INVALIDAS;
                    Swal.fire('Error', errorMsg, 'error');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [handleValidation, usr, dispatch, navigate]);

    const handleChange = useCallback((e) => {
        setUsr(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const errorMessages = useMemo(() => errors, [errors]);

    return (
        <div className="container">
            <div className="col-md-7 col-lg-8 my-3">
                <h4 className="mb-3">Ingresa</h4>
                <form onSubmit={sendLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Email</label>
                        <input 
                            autoComplete="off"
                            name="username"
                            onChange={handleChange}
                            required
                            type="text"
                            className="form-control"
                            id="username"
                            aria-describedby="emailHelp"
                            value={usr.username}
                        />
                        <div className="invalid-feedback d-block">
                            {errorMessages.username}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            autoComplete="new-password"
                            name="password"
                            onChange={handleChange}
                            required
                            type="password"
                            className="form-control"
                            id="password"
                            value={usr.password}
                        />
                        <div className="invalid-feedback d-block">
                            {errorMessages.password}
                        </div>
                    </div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="btn btn-primary button-standard"
                    >
                        {loading && (
                            <span 
                                className="spinner-border spinner-border-sm" 
                                role="status" 
                                aria-hidden="true"
                            />
                        )}
                        Enviar
                    </button>
                </form>
                <Link to="/register">
                    <p>¿No estás registrado?</p>
                </Link>
            </div>
        </div>
    );
}