import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import Icon from '../../components/Icon/Icon';
import * as api from '../../services/api';

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
            <button className="dash-btn dash-btn-primary" onClick={onAddContract}><Icon name="circle-plus" width={18} height={18} />Добавить договор</button>
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
            <button className="dash-btn dash-btn-primary" onClick={onAddDriver}><Icon name="circle-plus" width={18} height={18} />Добавить водителя</button>
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
            <button className="dash-btn dash-btn-primary" onClick={onAddPlate}><Icon name="circle-plus" width={18} height={18} />Добавить гос. номер</button>
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
  onSaveSettings
}) => {
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
            value={settings.site_url || ''}
            onChange={(e) => onSettingsChange('site_url', e.target.value)}
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
          <button className="dash-btn" onClick={onTestConnection}>Проверить подключение</button>
        </div>
      </div>
    </div>
  );
};

const TaskTable = ({ tasks, onDeleteTask, onTaskChange, onSaveTask, onEditTask }) => {
  const handleChange = (taskId, field, value) => {
    onTaskChange(taskId, field, value);
  };

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
              <td>
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
                  <input 
                    type="text" 
                    className="table-input" 
                    value={task.date || ''}
                    onChange={(e) => handleChange(task.id, 'date', e.target.value)}
                    placeholder="Дата старта"
                  />
                ) : (
                  task.date
                )}
              </td>
              <td>
                {task.isNew || task.isEditing ? (
                  <input 
                    type="text" 
                    className="table-input" 
                    value={task.func || ''}
                    onChange={(e) => handleChange(task.id, 'func', e.target.value)}
                    placeholder="Функция"
                  />
                ) : (
                  task.func
                )}
              </td>
              <td>
                {task.isNew || task.isEditing ? (
                  <input 
                    type="text" 
                    className="table-input" 
                    value={task.slot || ''}
                    onChange={(e) => handleChange(task.id, 'slot', e.target.value)}
                    placeholder="Слот (время)"
                  />
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
                    placeholder="Контейнер"
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
                    placeholder="Релиз"
                  />
                ) : (
                  task.rel
                )}
              </td>
              <td>
                {task.isNew || task.isEditing ? (
                  <input 
                    type="text" 
                    className="table-input" 
                    value={task.plate || ''}
                    onChange={(e) => handleChange(task.id, 'plate', e.target.value)}
                    placeholder="Гос. номер"
                  />
                ) : (
                  task.plate
                )}
              </td>
              <td className="driver-cell">
                {task.isNew || task.isEditing ? (
                  <input 
                    type="text" 
                    className="table-input" 
                    value={task.driver || ''}
                    onChange={(e) => handleChange(task.id, 'driver', e.target.value)}
                    placeholder="Водитель"
                  />
                ) : (
                  task.driver
                )}
              </td>
              <td style={{ position: 'relative' }}>
                {task.isNew || task.isEditing ? (
                  <>
                    <input 
                      type="text" 
                      className="table-input" 
                      value={task.contract || ''}
                      onChange={(e) => handleChange(task.id, 'contract', e.target.value)}
                      placeholder="Договор"
                    />
                    <div className="action-icons">
                      <button 
                        className="action-btn action-btn-send" 
                        onClick={() => onSaveTask(task.id)}
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
    terminal_contracts: []
  });
  const [loading, setLoading] = useState(false);
  const [searchDirectory, setSearchDirectory] = useState('');

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
      alert(`Ошибка загрузки заданий: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка при открытии вкладки "Задания"
  useEffect(() => {
    if (activeScreen === 'tasks') {
      loadTasks();
    }
  }, [activeScreen]);

  // Загрузка настроек
  const loadSettings = async () => {
    try {
      const settingsData = await api.getSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
      alert(`Ошибка загрузки настроек: ${error.message}`);
    }
  };

  // Загрузка справочников
  const loadReferences = async () => {
    try {
      const refs = await api.getReferences();
      setReferences({
        car_numbers: refs.car_numbers || [],
        drivers: refs.drivers || [],
        terminal_contracts: refs.terminal_contracts || []
      });
    } catch (error) {
      console.error('Ошибка загрузки справочников:', error);
      alert(`Ошибка загрузки справочников: ${error.message}`);
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
      alert(`Ошибка удаления задания: ${error.message}`);
    }
  };

  // Изменить задание
  const handleTaskChange = (taskId, field, value) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ));
  };

  // Сохранить задание (создать или обновить)
  const handleSaveTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Валидация обязательных полей
    if (!task.func || !task.date || !task.slot || !task.plate || !task.driver) {
      alert('Заполните обязательные поля: Функция, Дата старта, Слот, Гос. номер, Водитель');
      return;
    }

    try {
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
      alert(`Ошибка сохранения задания: ${error.message}`);
    }
  };

  // Редактировать задание
  const handleEditTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, isEditing: true } : task
    ));
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
        alert('Нет заданий для запуска');
        return;
      }
      selectedTasks.push(...allTasks);
    }

    try {
      await api.startAutomation(selectedTasks, false);
      alert('Автоматизация запущена поочередно');
      await loadTasks();
    } catch (error) {
      console.error('Ошибка запуска автоматизации:', error);
      alert(`Ошибка запуска автоматизации: ${error.message}`);
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
        alert('Нет заданий для запуска');
        return;
      }
      selectedTasks.push(...allTasks);
    }

    try {
      await api.startAutomation(selectedTasks, true);
      alert('Автоматизация запущена параллельно');
      await loadTasks();
    } catch (error) {
      console.error('Ошибка запуска автоматизации:', error);
      alert(`Ошибка запуска автоматизации: ${error.message}`);
    }
  };

  // Остановить автоматизацию
  const handleStopAutomation = async () => {
    try {
      await api.stopAutomation();
      alert('Автоматизация остановлена');
      await loadTasks();
    } catch (error) {
      console.error('Ошибка остановки автоматизации:', error);
      alert(`Ошибка остановки автоматизации: ${error.message}`);
    }
  };

  // Изменить настройки
  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Проверить подключение
  const handleTestConnection = async () => {
    if (!settings.site_url || !settings.login || !settings.password) {
      alert('Заполните URL сайта, логин и пароль');
      return;
    }

    try {
      const result = await api.testConnection({
        site_url: settings.site_url,
        login: settings.login,
        password: settings.password
      });

      if (result.success) {
        alert(`✅ ${result.message} (${result.duration}ms)`);
      } else {
        alert(`❌ ${result.message}: ${result.error}`);
      }
    } catch (error) {
      console.error('Ошибка проверки подключения:', error);
      alert(`Ошибка проверки подключения: ${error.message}`);
    }
  };

  // Сохранить настройки
  const handleSaveSettings = async () => {
    try {
      await api.saveSettings(settings);
      alert('Настройки сохранены');
      await loadSettings();
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
      alert(`Ошибка сохранения настроек: ${error.message}`);
    }
  };

  // Добавить элемент в справочник
  const handleAddReference = async (type, label) => {
    const value = prompt(`Введите значение для ${label}:`);
    if (!value) return;

    try {
      await api.addReference(type, value);
      alert(`${label} добавлен`);
      await loadReferences();
    } catch (error) {
      console.error(`Ошибка добавления ${label}:`, error);
      alert(`Ошибка добавления ${label}: ${error.message}`);
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
      alert(`Ошибка удаления ${label}: ${error.message}`);
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
          />
        </>
      ) : (
        <div className="dash-content">
          <div className="dash-col dash-col-left">
            <DirectoryPanel 
              contracts={references.terminal_contracts}
              drivers={references.drivers}
              plates={references.car_numbers}
              onAddContract={() => handleAddReference('contracts', 'договор')}
              onAddDriver={() => handleAddReference('drivers', 'водитель')}
              onAddPlate={() => handleAddReference('autos', 'гос. номер')}
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
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
