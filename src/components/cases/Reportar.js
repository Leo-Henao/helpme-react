import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { obtenerTodos } from '../../services/public/DelitoService';
import { crear } from '../../services/private/CasoService';
import Swal from 'sweetalert2';
import { messages } from '../../utils/messages';
import '../../index.css';
import MapEdit from '../maps/MapEdit';

export default function Reportar() {

  const today = useCallback((offset = 0) => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear() - offset;
    return `${y}-${m}-${d}`;
  }, []);

  const { user: { user } } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [delitos, setDelitos] = useState([]);
  const [errors, setErrors] = useState({ mapa: '', descripcion: '', delito_id: '' });
  const [caso, setCaso] = useState({
    fecha_hora: '',
    latitud: 0,
    longitud: 0,
    altitud: 0,
    descripcion: '',
    url_mapa: '',
    rmi_url: '',
    delito_id: 0
  });
  const [controls] = useState({ maxDate: today() });

  useEffect(() => {
    const cargarDelitos = async () => {
      try {
        const response = await obtenerTodos();
        setDelitos(response.data);
      } catch (error) {
        console.error('Error fetching delitos:', error);
      }
    };
    cargarDelitos();
  }, [today]);

  const _onClickMap = useCallback((e, mapSt) => {
    const location = { lat: e.lat, lng: e.lng };
    setCaso(prevCaso => ({
      ...prevCaso,
      latitud: location.lat,
      longitud: location.lng,
      rmi_url: mapSt.rmiUrl,
      url_mapa: mapSt.mapUrl
    }));
  }, []);

  const handleValidation = useCallback(() => {
    const errors = {};
    let isValid = true;
    if (!caso.descripcion) {
      isValid = false;
      errors.descripcion = "Descripción requerida";
    }
    if (caso.fecha_hora > today()) {
      errors.fecha_hora = "No puede ser mayor a hoy";
    }
    if (!caso.url_mapa) {
      isValid = false;
      errors.mapa = "Ubique un punto en el mapa";
    }
    if (!caso.delito_id) {
      isValid = false;
      errors.delito_id = "Seleccione delito";
    }
    setErrors(errors);
    return isValid;
  }, [caso, today]);

  const sendRegister = useCallback(async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      setLoading(true);
      try {
        await crear(caso);
        setCaso({
          fecha_hora: '',
          latitud: 0,
          longitud: 0,
          altitud: 0,
          descripcion: '',
          url_mapa: '',
          rmi_url: '',
          delito_id: 0
        });
        Swal.fire('OK', messages.REG_EXITOSO, 'success');
      } catch (error) {
        console.error('Error creating caso:', error);
        Swal.fire('Error', messages.ERROR_REGISTRO_CASO, 'error');
      } finally {
        setLoading(false);
      }
    }
  }, [caso, handleValidation]);

  const handleChange = useCallback((e) => {
    setCaso(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleChangeDelito = useCallback((e) => {
    setCaso(prev => ({ ...prev, delito_id: e.target.value }));
  }, []);

  const errorMessages = useMemo(() => errors, [errors]);

  return (
    <div className="container">
      <div className="col-md-12 col-lg-12 mb-6">
        <h4 className="mb-3">Reportar caso</h4>
        <form className="needs-validation" onSubmit={sendRegister}>
          <div className="row clear">
            <div className="col-12">
              <label htmlFor="fecha_hora" className="form-label">
                Fecha del suceso <span className="text-muted">*</span>
              </label>
              <input
                max={controls.maxDate}
                type="datetime-local"
                className="form-control"
                id="fecha_hora"
                name="fecha_hora"
                value={caso.fecha_hora}
                onChange={handleChange}
              />
              <div className="invalid-feedback d-block">{errorMessages.fecha_hora}</div>
            </div>
            <div className="col-12">
              <div className="invalid-feedback d-block">{errorMessages.mapa}</div>
              <div style={{ height: '100vh', width: '100%' }}>
                <MapEdit onClickMap={_onClickMap} />
              </div>
              <div className="invalid-feedback d-block">{errorMessages.mapa}</div>
            </div>
          </div>
          <div className="row my-4">
            <div className="col-sm-6 col-lg-6">
              <label htmlFor="delito_id" className="form-label">
                Delito <span className="text-muted">*</span>
              </label>
              <select
                className="form-control"
                id="delito_id"
                name="delito_id"
                onChange={handleChangeDelito}
                required
              >
                <option value=""> -- Selecciona delito -- </option>
                {delitos.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </select>
              <div className="invalid-feedback d-block">{errorMessages.delito_id}</div>
            </div>
            <div className="col-sm-6">
              <label htmlFor="descripcion" className="form-label">
                Descripción <span className="text-muted">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="descripcion"
                placeholder="Descripción breve"
                name="descripcion"
                value={caso.descripcion}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback d-block">{errorMessages.descripcion}</div>
            </div>
            <hr className="my-1" />
            <button
              disabled={loading}
              className="w-50 btn btn-primary btn-lg button-standard"
              type="submit"
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
          </div>
        </form>
      </div>
    </div>
  );
}