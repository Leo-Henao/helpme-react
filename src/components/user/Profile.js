import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getUserById, edit, uploadImage } from '../../services/private/UserProfileService';
import {messages} from '../../utils/messages';
import './Profile.css';
import PropTypes from 'prop-types';

const urlImg = process.env.REACT_APP_URL_IMG;
const defaultImg = `${urlImg}/default.jpg`;
const initialUser = {
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    image: '',
    imageSrc: defaultImg, // Inicialmente se asigna la imagen por defecto
};

export default function Profile() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(initialUser);
    const [errors, setErrors] = useState({
        nombre: '',
        apellido: '',
        password: '',
        fecha_nacimiento: '',
    });
    const [loadingImg, setLoadingImg] = useState(true);

    useEffect(() => {
        const img = new Image();
        img.src = user.imageSrc;
        img.onload = () => setLoadingImg(false);
    }, [user.imageSrc]);

    useEffect(() => {
        let isMounted = true;
        
        const fetchUser = async () => {
            try {
                const r = await getUserById();
                if (r.roles) delete r.roles; // Eliminar el campo roles si existe
                let updatedUser = { ...r };
                updatedUser.imageSrc = r.image
                    ? r.image.startsWith('http')
                        ? r.image
                        : `${urlImg}/${r.image}`
                    : defaultImg;

                if (isMounted) setUser(updatedUser);
            } catch (e) {
                console.error(e);
            }
        };

        fetchUser();

        return () => { isMounted = false };
    }, []);

    const handleValidation = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        if (!user.nombre) {
            isValid = false;
            newErrors.nombre = 'Nombre requerido';
        }
        if (!user.apellido) {
            isValid = false;
            newErrors.apellido = 'Apellido requerido';
        }
        if (!user.fecha_nacimiento) {
            isValid = false;
            newErrors.fecha_nacimiento = 'Fecha requerida';
        }

        setErrors(newErrors);
        return isValid;
    }, [user]);

    const sendRegister = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            setLoading(true);
            try {
                await edit(user);
                setUser({ ...user });
                e.target[5].checked = false;
                Swal.fire('OK', 'Cambios guardados exitosamente', 'success');
            } catch (e) {
                const errorMsg = e.response?.data?.message || 'Error al modificar';
                Swal.fire('Error', errorMsg, 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleFile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setUser(prevUser => ({
                ...prevUser,
                image: file,
                imageSrc: url,
            }));
            await uploadImage(file);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="col-md-7 col-lg-8 my-3">
                <label id="labelimage">
                    <img src={user.imageSrc} alt="Imagen de perfil" className="avatar"/>
                    {(loading || loadingImg) && (
                        <div className="spinner-grow spinner-grow-lg" role="status">
                            <span className="sr-only">Cargando...</span>
                        </div>
                    )}
                    <div id="camera">
                        <i className="fas fa-camera"></i>
                    </div>
                    <input type="file" accept="image/*" id="fileimage" onChange={handleFile} />
                </label>

                <form
                    className="needs-validation"
                    onSubmit={sendRegister}
                    autoComplete="off"
                >
                    <div className="row g-3">
                        <div className="col-sm-6">
                            <label htmlFor="nombre" className="form-label">Nombre <span className="text-muted">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                placeholder="Juanito"
                                name="nombre"
                                value={user.nombre}
                                onChange={handleChange}
                                required
                            />
                            <div className="invalid-feedback d-block">{errors.nombre}</div>
                        </div>

                        <div className="col-sm-6">
                            <label htmlFor="apellido" className="form-label">Apellido <span className="text-muted">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="apellido"
                                placeholder="Doe"
                                name="apellido"
                                value={user.apellido}
                                onChange={handleChange}
                                required
                            />
                            <div className="invalid-feedback d-block">{errors.apellido}</div>
                        </div>

                        <div className="col-12">
                            <label htmlFor="username" className="form-label">Email <span className="text-muted">*</span></label>
                            <input
                                type="email"
                                className="form-control"
                                id="username"
                                placeholder="you@example.com"
                                name="username"
                                value={user.username || ''}
                                disabled
                            />
                        </div>

                        <div className="col-12">
                            <label htmlFor="password" className="form-label">Contraseña <span className="text-muted">*</span></label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={user.password || ''}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                            <div className="invalid-feedback d-block">{errors.password}</div>
                        </div>

                        <div className="col-12">
                            <label htmlFor="fecha_nacimiento" className="form-label">Fecha de Nacimiento <span className="text-muted">*</span></label>
                            <input
                                type="date"
                                className="form-control"
                                id="fecha_nacimiento"
                                name="fecha_nacimiento"
                                value={user.fecha_nacimiento}
                                onChange={handleChange}
                                required
                            />
                            <div className="invalid-feedback d-block">{errors.fecha_nacimiento}</div>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <button
                        type="submit"
                        className="btn btn-primary w-50 btn-lg button-standard"
                        disabled={loading}
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
            </div>
        </div>
    );
}

Profile.propTypes = {
    loading: PropTypes.bool,
};