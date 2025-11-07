import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
import './DashboardPage.css';
import Icon from '../../components/Icon/Icon';
import * as api from '../../services/api';

registerLocale('ru', ru);

const Header = ({ activeScreen, onScreenChange }) => {
  return (
    <header className="dash-header">
      <div className="dash-header-left">
        <Icon name="logi-enerance" width={200} height={45} className="dash-logo" alt="КАИ logo" />
        <div className="dash-title">
          <Icon name="autovisit" width={582} height={50} className="dash-logo" alt="КАИ Автовизит" />
        </div>
      </div>
      <div className="dash-header-right">
        <button 
          className={`dash-btn dash-btn-secondary ${activeScreen === 'tasks' ? 'dash-btn--active' : ''}`}
          onClick={() => onScreenChange('tasks')}
        >
          <Icon name="truck" width={20} height={20} className="dash-logo" alt="" />Задания
        </button>
        <button 
          className={`dash-btns dash-btn-icon ${activeScreen === 'settings' ? 'dash-btn--active' : ''}`}
          aria-label="Настройки"
          onClick={() => onScreenChange('settings')}
        >
          <Icon name="settings" width={20} height={20} className="dash-logo" alt="Настройки" />
        </button>
      </div>
    </header>
  );
};

const ActionsBar = ({ 
  onAddTask, 
  filterMode, 
  onFilterChange, 
  searchValue, 
  onSearchChange,
  onStartSequential,
  onStartParallel,
  onStopAutomation
}) => {
  return (
    <div className="dash-actions">
      <button className="dash-btn dash-btn-primary" onClick={onAddTask}><Icon name="circle-plus" width={20} height={20} className="dash-logo" alt="" />Добавить задание</button>
      <button className="dash-btn" onClick={onStartSequential}><Icon name="reply" width={20} height={20} className="dash-logo" alt="" />Запустить поочередно</button>
      <button className="dash-btn" onClick={onStartParallel}><Icon name="reply-all" width={20} height={20} className="dash-logo" alt="" />Запустить параллельно</button>
      <button className="dash-btn dash-btn-danger" onClick={onStopAutomation}><Icon name="circle-x" width={20} height={20} className="dash-logo" alt="" />Остановить автоматизацию</button>
      <button 
        className={`dash-btn dash-btn-filter ${filterMode === 'current' ? 'active' : ''}`}
        onClick={() => onFilterChange('current')}
      >
        Т
      </button>
      <button 
        className={`dash-btn dash-btn-filter ${filterMode === 'archive' ? 'active' : ''}`}
        onClick={() => onFilterChange('archive')}
      >
        А
      </button>
      <div className="dash-search-container">
        <Icon name="search" width={20} height={20} className="search-icon" alt="Поиск" />
        <input 
          className="dash-search" 
          placeholder="Поиск" 
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

const StatusBadge = ({ type, children }) => {
  const labels = {
    running: 'Запущено',
    new: 'Новое',
    stop: 'Стоп',
    error: 'Ошибка',
    completed: 'Завершено'
  };
  return <span className={`status-badge status-${type}`}>{children || labels[type]}</span>;
};

// Маппинг статуса из API в тип для StatusBadge
const mapStatusFromAPI = (apiStatus, inWork) => {
  if (inWork) return 'running';
  if (apiStatus === 'Новый') return 'new';
  if (apiStatus === 'Завершено' || apiStatus === 'Завершен') return 'completed';
  if (apiStatus === 'Ошибка') return 'error';
  if (apiStatus === 'Стоп') return 'stop';
  return 'new';
};

// Панель со справочниками (3 колонки)
const DirectoryPanel = ({ 
  contracts = [], 
  drivers = [], 
  plates = [],
  onAddContract,
  onAddDriver,
  onAddPlate,
  onDeleteContract,
  onDeleteDriver,
  onDeletePlate,
  searchDirectory,
  setSearchDirectory
}) => {
  const [newContract, setNewContract] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newPlate, setNewPlate] = useState('');

  // Фильтрация списков по поиску
  const filteredContracts = contracts.filter(contract => 
    contract.value && contract.value.toLowerCase().includes(searchDirectory.toLowerCase())
  );
  const filteredDrivers = drivers.filter(driver => 
    driver.value && driver.value.toLowerCase().includes(searchDirectory.toLowerCase())
  );
  const filteredPlates = plates.filter(plate => 
    plate.value && plate.value.toLowerCase().includes(searchDirectory.toLowerCase())
  );

  const handleAddContract = () => {
    if (newContract.trim()) {
      onAddContract(newContract.trim());
      setNewContract('');
    }
  };

  const handleAddDriver = () => {
    if (newDriver.trim()) {
      onAddDriver(newDriver.trim());
      setNewDriver('');
    }
  };

  const handleAddPlate = () => {
    if (newPlate.trim()) {
      onAddPlate(newPlate.trim());
      setNewPlate('');
    }
  };

  return (
    <div className="dash-panel">
      <div className="directory-header-container">
        <button className="directory-col-header-bt" disabled>Справочники</button>
        <div className="directory-search-container">
          <Icon name="search" width={20} height={20} className="search-icon" alt="Поиск" />
          <input 
            className="directory-search" 
            placeholder="Поиск" 
            value={searchDirectory}
            onChange={(e) => setSearchDirectory(e.target.value)}
          />
        </div>
      </div>
      <div className="directory-grid">
        <div className="directory-col">
          <div className="directory-list">
            {filteredContracts.map((contract) => (
              <div className="directory-item" key={contract.id}>
                {contract.value}
                <button 
                  className="action-btn action-btn-delete" 
                  onClick={() => onDeleteContract(contract.id)}
                  aria-label="Удалить"
                  style={{ float: 'right', marginLeft: '10px' }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <div className="directory-actions">
            <div className="directory-add-input-container">
              <input
                className="directory-add-input"
                type="text"
                placeholder="Введите договор"
                value={newContract}
                onChange={(e) => setNewContract(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddContract();
                  }
                }}
              />
              <button 
                className="directory-add-btn" 
                onClick={handleAddContract}
                disabled={!newContract.trim()}
                title="Добавить"
              >
                <Icon name="circle-plus" width={18} height={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="directory-col">
          <div className="directory-list">
            {filteredDrivers.map((driver) => (
              <div className="directory-item" key={driver.id}>
                {driver.value}
                <button 
                  className="action-btn action-btn-delete" 
                  onClick={() => onDeleteDriver(driver.id)}
                  aria-label="Удалить"
                  style={{ float: 'right', marginLeft: '10px' }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <div className="directory-actions">
            <div className="directory-add-input-container">
              <input
                className="directory-add-input"
                type="text"
                placeholder="Введите водителя"
                value={newDriver}
                onChange={(e) => setNewDriver(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddDriver();
                  }
                }}
              />
              <button 
                className="directory-add-btn" 
                onClick={handleAddDriver}
                disabled={!newDriver.trim()}
                title="Добавить"
              >
                <Icon name="circle-plus" width={18} height={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="directory-col">
          <div className="directory-list">
            {filteredPlates.map((plate) => (
              <div className="directory-item" key={plate.id}>
                {plate.value}
                <button 
                  className="action-btn action-btn-delete" 
                  onClick={() => onDeletePlate(plate.id)}
                  aria-label="Удалить"
                  style={{ float: 'right', marginLeft: '10px' }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <div className="directory-actions">
            <div className="directory-add-input-container">
              <input
                className="directory-add-input"
                type="text"
                placeholder="Введите гос. номер"
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddPlate();
                  }
                }}
              />
              <button 
                className="directory-add-btn" 
                onClick={handleAddPlate}
                disabled={!newPlate.trim()}
                title="Добавить"
              >
                <Icon name="circle-plus" width={18} height={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Панель настроек
const SettingsPanel = ({ 
  settings = {},
  onSettingsChange,
  onTestConnection,
  onSaveSettings,
  connectionStatus = null,
  isTestingConnection = false
}) => {
  const getConnectionStatusClass = () => {
    if (connectionStatus === 'success') return 'dash-btn-success';
    if (connectionStatus === 'error') return 'dash-btn-error';
    return '';
  };

  return (
    <div className="dash-panel settings-panel">
      <div className="settings-form">
        <div className="form-row">
          <label>Интервал обновления (сек):</label>
          <input 
            className="form-input" 
            type="number"
            value={settings.refresh_interval || ''}
            onChange={(e) => onSettingsChange('refresh_interval', parseInt(e.target.value))}
          />
        </div>
        <div className="form-row">
          <label>Количество попыток:</label>
          <input 
            className="form-input" 
            type="number"
            value={settings.default_execution_attempts || ''}
            onChange={(e) => onSettingsChange('default_execution_attempts', parseInt(e.target.value))}
          />
        </div>
        <div className="form-row">
          <label>Задержка попыток (мин):</label>
          <input 
            className="form-input" 
            type="number"
            value={settings.default_delay_try || ''}
            onChange={(e) => onSettingsChange('default_delay_try', parseInt(e.target.value))}
          />
        </div>
        <div className="form-row">
          <label>Таймаут элементов (сек):</label>
          <input 
            className="form-input" 
            type="number"
            value={settings.element_timeout || ''}
            onChange={(e) => onSettingsChange('element_timeout', parseInt(e.target.value))}
          />
        </div>
        <button className="dash-btn dash-btn-primary" onClick={onSaveSettings} style={{  }}>Сохранить настройки</button>
        <div className="form-row">
          <label>URL сайта:</label>
          <input 
            className="form-input" 
            type="text"
            value={settings.site_url || ''}
            onChange={(e) => onSettingsChange('site_url', e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <div className="form-row">
          <label>Логин:</label>
          <input 
            className="form-input" 
            value={settings.login || ''}
            onChange={(e) => onSettingsChange('login', e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Пароль:</label>
          <input 
            className="form-input" 
            type="password"
            value={settings.password || ''}
            onChange={(e) => onSettingsChange('password', e.target.value)}
          />
        </div>
        <div className="form-actions">
          <div className="connection-status-container">
            {connectionStatus !== null && (
              <span 
                className={`connection-status-indicator ${connectionStatus === 'success' ? 'connection-success' : 'connection-error'}`}
                title={connectionStatus === 'success' ? 'Подключение установлено' : 'Подключение отсутствует'}
              />
            )}
            <button 
              className={`dash-btn ${getConnectionStatusClass()}`} 
              onClick={onTestConnection}
              disabled={isTestingConnection}
            >
              {isTestingConnection ? 'Проверка...' : 'Проверить подключение'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskTable = ({ tasks, onDeleteTask, onTaskChange, onSaveTask, onEditTask, onCancelTask, carNumbers = [], drivers = [], terminalContracts = [], timeSlots = [], operationTypes = [], isTaskValid }) => {
  const handleChange = (taskId, field, value) => {
    onTaskChange(taskId, field, value);
  };

  const parseDateValue = (value) => {
    if (!value) return null;

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    let normalized = value;

    if (typeof normalized === 'string') {
      if (normalized.includes(' ') && !normalized.includes('T')) {
        normalized = normalized.replace(' ', 'T');
      }

      const parsed = new Date(normalized);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }

      const dotParts = normalized.split('.');
      if (dotParts.length === 3) {
        const [day, month, year] = dotParts;
        const constructed = new Date(Number(year), Number(month) - 1, Number(day));
        if (!Number.isNaN(constructed.getTime())) {
          return constructed;
        }
      }
    }

    return null;
  };

  const formatDateValue = (date) => {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (value) => {
    const parsed = parseDateValue(value);
    if (!parsed) {
      return value || '';
    }

    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = parsed.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const handleDateSelect = (taskId, date) => {
    handleChange(taskId, 'date', formatDateValue(date));
  };

  // Отладка: проверим, какие данные приходят
  console.log('TaskTable operationTypes:', operationTypes);

  return (
    <div className="table-wrapper">
      <table className="dash-table">
        <thead>
          <tr>
            <th>Чек</th>
            <th>Статус</th>
            <th>Дата старта</th>
            <th>Функция</th>
            <th>Слот (время)</th>
            <th>Контейнер</th>
            <th>Релиз</th>
            <th>Гос. номер</th>
            <th>Водитель</th>
            <th>Договор</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="checkbox-cell">
                <input 
                  type="checkbox" 
                  checked={task.checked}
                  onChange={(e) => handleChange(task.id, 'checked', e.target.checked)}
                />
              </td>
              <td>
                <StatusBadge type={task.status} />
              </td>
              <td>
                {task.isNew || task.isEditing ? (
                  <DatePicker
                    selected={parseDateValue(task.date)}
                    onChange={(date) => handleDateSelect(task.id, date)}
                    dateFormat="dd.MM.yyyy"
                    placeholderText="Дата старта"
                    className="table-input datepicker-input"
                    wrapperClassName="datepicker-wrapper"
                    locale="ru"
                    isClearable
                  />
                ) : (
                  formatDateDisplay(task.date)
                )}
              </td>
              <td>
                {task.isNew || task.isEditing ? (
                  <select 
                    className="table-input table-select" 
                    value={task.func || ''}
                    onChange={(e) => handleChange(task.id, 'func', e.target.value)}
                  >
                    <option value=""></option>
                    {operationTypes && operationTypes.length > 0 ? (
                      operationTypes.filter(item => item.is_active).map((item) => (
                        <option key={item.id} value={item.value}>
                          {item.value}
                        </option>
                      ))
                    ) : (
                      <option disabled>Загрузка...</option>
                    )}
                    {task.func && operationTypes && !operationTypes.some(item => item.is_active && item.value === task.func) && (
                      <option value={task.func}>{task.func}</option>
                    )}
                  </select>
                ) : (
                  task.func
                )}
              </td>
              <td>
                {task.isNew || task.isEditing ? (
                  <select 
                    className="table-input table-select" 
                    value={task.slot || ''}
                    onChange={(e) => handleChange(task.id, 'slot', e.target.value)}
                  >
                    <option value=""></option>
                    {timeSlots.filter(item => item.is_active).map((item) => (
                      <option key={item.id} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                    {task.slot && !timeSlots.some(item => item.is_active && item.value === task.slot) && (
                      <option value={task.slot}>{task.slot}</option>
                    )}
                  </select>
                ) : (
                  task.slot
                )}
              </td>
              <td>
                {task.isNew || task.isEditing ? (
                  <input 
                    type="text" 
                    className="table-input" 
                    value={task.cont || ''}
                    onChange={(e) => handleChange(task.id, 'cont', e.target.value)}
                    placeholder=""
                  />
                ) : (
                  task.cont
                )}
              </td>
              <td>
                {task.isNew || task.isEditing ? (
                  <input 
                    type="text" 
                    className="table-input" 
                    value={task.rel || ''}
                    onChange={(e) => handleChange(task.id, 'rel', e.target.value)}
                    placeholder=""
                  />
                ) : (
                  task.rel
                )}
              </td>
              <td>
                {task.isNew || task.isEditing ? (
                  <select 
                    className="table-input table-select" 
                    value={task.plate || ''}
                    onChange={(e) => handleChange(task.id, 'plate', e.target.value)}
                  >
                    <option value=""></option>
                    {carNumbers.filter(item => item.is_active).map((item) => (
                      <option key={item.id} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                    {task.plate && !carNumbers.some(item => item.is_active && item.value === task.plate) && (
                      <option value={task.plate}>{task.plate}</option>
                    )}
                  </select>
                ) : (
                  task.plate
                )}
              </td>
              <td className="driver-cell">
                {task.isNew || task.isEditing ? (
                  <select 
                    className="table-input table-select" 
                    value={task.driver || ''}
                    onChange={(e) => handleChange(task.id, 'driver', e.target.value)}
                  >
                    <option value=""></option>
                    {drivers.filter(item => item.is_active).map((item) => (
                      <option key={item.id} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                    {task.driver && !drivers.some(item => item.is_active && item.value === task.driver) && (
                      <option value={task.driver}>{task.driver}</option>
                    )}
                  </select>
                ) : (
                  task.driver
                )}
              </td>
              <td style={{ position: 'relative' }}>
                {task.isNew || task.isEditing ? (
                  <>
                    <select 
                      className="table-input table-select" 
                      value={task.contract || ''}
                      onChange={(e) => handleChange(task.id, 'contract', e.target.value)}
                    >
                      <option value=""></option>
                      {terminalContracts.filter(item => item.is_active).map((item) => (
                        <option key={item.id} value={item.value}>
                          {item.value}
                        </option>
                      ))}
                      {task.contract && !terminalContracts.some(item => item.is_active && item.value === task.contract) && (
                        <option value={task.contract}>{task.contract}</option>
                      )}
                    </select>
                    <div className="action-icons">
                      <button 
                        className="action-btn action-btn-cancel"
                        onClick={() => onCancelTask(task.id)}
                        aria-label="Отменить"
                        title="Отменить"
                      >
                        ✕
                      </button>
                      <button 
                        className="action-btn action-btn-send" 
                        onClick={() => onSaveTask(task.id)}
                        disabled={!isTaskValid(task)}
                        aria-label="Отправить"
                        title="Отправить"
                      >
                        ➤
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {task.contract}
                    <div className="action-icons">
                      <button 
                        className="action-btn action-btn-edit" 
                        onClick={() => onEditTask(task.id)}
                        aria-label="Редактировать"
                      >
                        📝
                      </button>
                      <button 
                        className="action-btn action-btn-delete" 
                        onClick={() => onDeleteTask(task.id)}
                        aria-label="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filterMode, setFilterMode] = useState('current');
  const [searchValue, setSearchValue] = useState('');
  const [activeScreen, setActiveScreen] = useState('tasks');
  const [settings, setSettings] = useState({});
  const [references, setReferences] = useState({
    car_numbers: [],
    drivers: [],
    terminal_contracts: [],
    time_slots: [],
    operation_types: []
  });
  const [loading, setLoading] = useState(false);
  const [searchDirectory, setSearchDirectory] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null); // 'success', 'error', null
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Преобразование данных из API в формат UI
  const mapTaskFromAPI = (apiTask) => {
    return {
      id: apiTask.id,
      status: mapStatusFromAPI(apiTask.status, apiTask.in_work),
      date: apiTask.date || '',
      func: apiTask.type_task || '',
      slot: apiTask.time_slot || '',
      cont: apiTask.number_container || '',
      rel: apiTask.release_order || '',
      plate: apiTask.num_auto || '',
      driver: apiTask.driver || '',
      contract: apiTask.contract_terminal || '',
      checked: false,
      isNew: false,
      isEditing: false,
      // Сохраняем оригинальные данные для обновления
      _original: apiTask
    };
  };

  // Преобразование данных UI в формат API для создания/обновления
  const mapTaskToAPI = (task) => {
    const baseData = task._original || {};
    return {
      id: task._original?.id,
      in_work: task.status === 'running',
      type_task: task.func,
      status: task.status === 'new' ? 'Новый' : (task._original?.status || 'Новый'),
      date: task.date,
      time_slot: task.slot,
      num_auto: task.plate,
      driver: task.driver,
      place: task._original?.place || '',
      index_container: task._original?.index_container || '',
      number_container: task.cont,
      release_order: task.rel,
      contract_terminal: task.contract,
      time_cancel: task._original?.time_cancel || 30,
      count_try: task._original?.count_try || 60,
      delay_try: task._original?.delay_try || 60
    };
  };

  // Загрузка заданий
  const loadTasks = async () => {
    try {
      setLoading(true);
      const apiTasks = await api.getTasks();
      const mappedTasks = apiTasks.map(mapTaskFromAPI);
      setTasks(mappedTasks);
    } catch (error) {
      console.error('Ошибка загрузки заданий:', error);
      //alert(`Ошибка загрузки заданий: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка при открытии вкладки "Задания"
  useEffect(() => {
    if (activeScreen === 'tasks') {
      loadTasks();
      loadReferences(); // Загружаем справочники для формы создания задания
    }
  }, [activeScreen]);

  // Загрузка настроек
  const loadSettings = async () => {
    try {
      const settingsData = await api.getSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
      //alert(`Ошибка загрузки настроек: ${error.message}`);
    }
  };

  // Загрузка справочников
  const loadReferences = async () => {
    try {
      const refs = await api.getReferences();
      console.log('Справочники загружены:', refs); // Отладка
      setReferences({
        car_numbers: refs.car_numbers || [],
        drivers: refs.drivers || [],
        terminal_contracts: refs.terminal_contracts || [],
        time_slots: refs.time_slots || [],
        operation_types: refs.operation_types || []
      });
    } catch (error) {
      console.error('Ошибка загрузки справочников:', error);
      //alert(`Ошибка загрузки справочников: ${error.message}`);
    }
  };

  // Загрузка данных при открытии вкладки "Настройки"
  useEffect(() => {
    if (activeScreen === 'settings') {
      loadSettings();
      loadReferences();
    }
  }, [activeScreen]);

  // Добавить задание
  const handleAddTask = () => {
    const newTask = {
      id: `temp-${Date.now()}`,
      status: 'new',
      date: '',
      func: '',
      slot: '',
      cont: '',
      rel: '',
      plate: '',
      driver: '',
      contract: '',
      checked: false,
      isNew: true,
      isEditing: false
    };
    setTasks([newTask, ...tasks]);
  };

  // Удалить задание
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Удалить задание?')) {
      return;
    }

    try {
      const task = tasks.find(t => t.id === taskId);
      // Если это новое задание, просто удаляем из списка
      if (task.isNew || taskId.toString().startsWith('temp-')) {
        setTasks(tasks.filter(t => t.id !== taskId));
        return;
      }

      await api.deleteTask(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Ошибка удаления задания:', error);
      //alert(`Ошибка удаления задания: ${error.message}`);
    }
  };

  // Изменить задание
  const handleTaskChange = (taskId, field, value) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ));
  };

  // Проверка, заполнены ли все обязательные поля
  const isTaskValid = (task) => {
    return !!(task.func && task.date && task.slot && task.plate && task.driver && task.contract);
  };

  // Сохранить задание (создать или обновить)
  const handleSaveTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Валидация обязательных полей - просто возвращаемся без сообщения
    if (!isTaskValid(task)) {
      return;
    }

    try {
      // Проверяем и добавляем недостающие элементы в справочники
      // Проверяем по всем элементам (не только активным), чтобы не дублировать
      
      // Проверяем тип операции (функция)
      if (task.func) {
        const operationExists = references.operation_types.some(item => item.value === task.func);
        if (!operationExists) {
          await api.addReference('operations', task.func);
        }
      }
      
      // Проверяем гос. номер
      if (task.plate) {
        const plateExists = references.car_numbers.some(item => item.value === task.plate);
        if (!plateExists) {
          await api.addReference('autos', task.plate);
        }
      }

      // Проверяем водителя
      if (task.driver) {
        const driverExists = references.drivers.some(item => item.value === task.driver);
        if (!driverExists) {
          await api.addReference('drivers', task.driver);
        }
      }

      // Проверяем договор
      if (task.contract) {
        const contractExists = references.terminal_contracts.some(item => item.value === task.contract);
        if (!contractExists) {
          await api.addReference('contracts', task.contract);
        }
      }

      // Проверяем временной слот
      if (task.slot) {
        const slotExists = references.time_slots.some(item => item.value === task.slot);
        if (!slotExists) {
          await api.addReference('timeslots', task.slot);
        }
      }

      // Обновляем справочники после добавления
      await loadReferences();

      // Теперь сохраняем задание
      const taskData = mapTaskToAPI(task);
      
      if (task.isNew || taskId.toString().startsWith('temp-')) {
        // Создать новое задание
        await api.createTask(taskData);
        await loadTasks();
      } else {
        // Обновить существующее задание
        await api.updateTask(taskData);
        await loadTasks();
      }
    } catch (error) {
      console.error('Ошибка сохранения задания:', error);
      //alert(`Ошибка сохранения задания: ${error.message}`);
    }
  };

  // Редактировать задание
  const handleEditTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, isEditing: true } : task
    ));
  };

  const handleCancelTask = (taskId) => {
    setTasks(prevTasks => {
      const updatedTasks = [];

      prevTasks.forEach(task => {
        if (task.id !== taskId) {
          updatedTasks.push(task);
          return;
        }

        if (task.isNew || taskId.toString().startsWith('temp-')) {
          return;
        }

        if (task._original) {
          const originalTask = mapTaskFromAPI(task._original);
          updatedTasks.push({ ...originalTask, checked: task.checked });
        } else {
          updatedTasks.push({ ...task, isEditing: false });
        }
      });

      return updatedTasks;
    });
  };

  // Запустить автоматизацию поочередно
  const handleStartSequential = async () => {
    const selectedTasks = tasks
      .filter(task => !task.isNew && task.checked && task.status !== 'running')
      .map(task => task.id);
    
    if (selectedTasks.length === 0) {
      // Если ничего не выбрано, используем все не запущенные
      const allTasks = tasks
        .filter(task => !task.isNew && task.status !== 'running')
        .map(task => task.id);
      
      if (allTasks.length === 0) {
        //alert('Нет заданий для запуска');
        return;
      }
      selectedTasks.push(...allTasks);
    }

    try {
      await api.startAutomation(selectedTasks, false);
      //alert('Автоматизация запущена поочередно');
      await loadTasks();
    } catch (error) {
      console.error('Ошибка запуска автоматизации:', error);
      //alert(`Ошибка запуска автоматизации: ${error.message}`);
    }
  };

  // Запустить автоматизацию параллельно
  const handleStartParallel = async () => {
    const selectedTasks = tasks
      .filter(task => !task.isNew && task.checked && task.status !== 'running')
      .map(task => task.id);
    
    if (selectedTasks.length === 0) {
      // Если ничего не выбрано, используем все не запущенные
      const allTasks = tasks
        .filter(task => !task.isNew && task.status !== 'running')
        .map(task => task.id);
      
      if (allTasks.length === 0) {
        //alert('Нет заданий для запуска');
        return;
      }
      selectedTasks.push(...allTasks);
    }

    try {
      await api.startAutomation(selectedTasks, true);
      //alert('Автоматизация запущена параллельно');
      await loadTasks();
    } catch (error) {
      console.error('Ошибка запуска автоматизации:', error);
      //alert(`Ошибка запуска автоматизации: ${error.message}`);
    }
  };

  // Остановить автоматизацию
  const handleStopAutomation = async () => {
    try {
      await api.stopAutomation();
      //alert('Автоматизация остановлена');
      await loadTasks();
    } catch (error) {
      console.error('Ошибка остановки автоматизации:', error);
      //alert(`Ошибка остановки автоматизации: ${error.message}`);
    }
  };

  // Изменить настройки
  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    // Сбрасываем статус подключения при изменении URL, логина или пароля
    if (field === 'site_url' || field === 'login' || field === 'password') {
      setConnectionStatus(null);
    }
  };

  // Проверить подключение
  const handleTestConnection = async () => {
    if (!settings.site_url || !settings.login || !settings.password) {
      //alert('Заполните URL сайта, логин и пароль');
      setConnectionStatus('error');
      return;
    }

    setIsTestingConnection(true);
    try {
      const result = await api.testConnection({
        site_url: settings.site_url,
        login: settings.login,
        password: settings.password
      });

      if (result.success) {
        setConnectionStatus('success');
        //alert(`✅ ${result.message} (${result.duration}ms)`);
      } else {
        setConnectionStatus('error');
        //alert(`❌ ${result.message}: ${result.error}`);
      }
    } catch (error) {
      console.error('Ошибка проверки подключения:', error);
      setConnectionStatus('error');
      //alert(`Ошибка проверки подключения: ${error.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Сохранить настройки
  const handleSaveSettings = async () => {
    try {
      await api.saveSettings(settings);
      //alert('Настройки сохранены');
      await loadSettings();
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
      //alert(`Ошибка сохранения настроек: ${error.message}`);
    }
  };

  // Добавить элемент в справочник
  const handleAddReference = async (type, value) => {
    if (!value || !value.trim()) return;

    try {
      await api.addReference(type, value.trim());
      await loadReferences();
    } catch (error) {
      console.error(`Ошибка добавления:`, error);
      //alert(`Ошибка добавления: ${error.message}`);
    }
  };

  // Удалить элемент из справочника
  const handleDeleteReference = async (type, itemId, label) => {
    if (!window.confirm(`Удалить ${label}?`)) {
      return;
    }

    try {
      await api.deleteReference(type, itemId);
      await loadReferences();
    } catch (error) {
      console.error(`Ошибка удаления ${label}:`, error);
      //alert(`Ошибка удаления ${label}: ${error.message}`);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filterMode === 'archive') {
      return task.status === 'completed';
    }
    return task.status !== 'completed';
  }).filter(task => {
    if (!searchValue) return true;
    const search = searchValue.toLowerCase();
    return Object.values(task).some(value => 
      String(value).toLowerCase().includes(search)
    );
  });

  return (
    <div className="dashboard-page">
      <Header activeScreen={activeScreen} onScreenChange={setActiveScreen} />

      {activeScreen === 'tasks' ? (
        <>
          <ActionsBar 
            onAddTask={handleAddTask}
            filterMode={filterMode}
            onFilterChange={setFilterMode}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onStartSequential={handleStartSequential}
            onStartParallel={handleStartParallel}
            onStopAutomation={handleStopAutomation}
          />
          {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка...</div>}
          <TaskTable 
            tasks={filteredTasks}
            onDeleteTask={handleDeleteTask}
            onTaskChange={handleTaskChange}
            onSaveTask={handleSaveTask}
            onEditTask={handleEditTask}
            onCancelTask={handleCancelTask}
            carNumbers={references.car_numbers}
            drivers={references.drivers}
            terminalContracts={references.terminal_contracts}
            timeSlots={references.time_slots}
            operationTypes={references.operation_types}
            isTaskValid={isTaskValid}
          />
        </>
      ) : (
        <div className="dash-content">
          <div className="dash-col dash-col-left">
            <DirectoryPanel 
              contracts={references.terminal_contracts}
              drivers={references.drivers}
              plates={references.car_numbers}
              onAddContract={(value) => handleAddReference('contracts', value)}
              onAddDriver={(value) => handleAddReference('drivers', value)}
              onAddPlate={(value) => handleAddReference('autos', value)}
              onDeleteContract={(id) => handleDeleteReference('contracts', id, 'договор')}
              onDeleteDriver={(id) => handleDeleteReference('drivers', id, 'водитель')}
              onDeletePlate={(id) => handleDeleteReference('autos', id, 'гос. номер')}
              searchDirectory={searchDirectory}
              setSearchDirectory={setSearchDirectory}
            />
          </div>
          <div className="dash-col dash-col-right">
            <SettingsPanel 
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onTestConnection={handleTestConnection}
              onSaveSettings={handleSaveSettings}
              connectionStatus={connectionStatus}
              isTestingConnection={isTestingConnection}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
