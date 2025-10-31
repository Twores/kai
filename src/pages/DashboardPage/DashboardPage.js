import React, { useState } from 'react';
import './DashboardPage.css';
import Icon from '../../components/Icon/Icon';

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

const ActionsBar = ({ onAddTask, filterMode, onFilterChange, searchValue, onSearchChange }) => {
  return (
    <div className="dash-actions">
      <button className="dash-btn dash-btn-primary" onClick={onAddTask}><Icon name="circle-plus" width={20} height={20} className="dash-logo" alt="" />Добавить задание</button>
      <button className="dash-btn"><Icon name="reply" width={20} height={20} className="dash-logo" alt="" />Запустить поочередно</button>
      <button className="dash-btn"><Icon name="reply-all" width={20} height={20} className="dash-logo" alt="" />Запустить параллельно</button>
      <button className="dash-btn dash-btn-danger"><Icon name="circle-x" width={20} height={20} className="dash-logo" alt="" />Остановить автоматизацию</button>
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

// Панель со справочниками (3 колонки)
const DirectoryPanel = () => {
  const contracts = new Array(12).fill(null).map((_, i) => `00${i + 1}/2025, Дополнительный договор`);
  const drivers = new Array(12).fill(null).map(() => 'ЛУГАНОВ АРТУР ВАЛИЕВИЧ (82-17 946750)');
  const plates = new Array(12).fill(null).map(() => 'О601КЕ193');

  return (
    <div className="dash-panel">
      <div className="directory-grid">
        <div className="directory-col">
          <div className="directory-col-header">Договоры</div>
          <div className="directory-list">
            {contracts.map((c, idx) => (
              <div className="directory-item" key={`c-${idx}`}>{c}</div>
            ))}
          </div>
          <div className="directory-actions">
            <button className="dash-btn dash-btn-primary"><Icon name="circle-plus" width={18} height={18} />Добавить договор</button>
          </div>
        </div>
        <div className="directory-col">
          <div className="directory-col-header">Водители</div>
          <div className="directory-list">
            {drivers.map((d, idx) => (
              <div className="directory-item" key={`d-${idx}`}>{d}</div>
            ))}
          </div>
          <div className="directory-actions">
            <button className="dash-btn dash-btn-primary"><Icon name="circle-plus" width={18} height={18} />Добавить водителя</button>
          </div>
        </div>
        <div className="directory-col">
          <div className="directory-col-header">Гос. номера</div>
          <div className="directory-list">
            {plates.map((p, idx) => (
              <div className="directory-item" key={`p-${idx}`}>{p}</div>
            ))}
          </div>
          <div className="directory-actions">
            <button className="dash-btn dash-btn-primary"><Icon name="circle-plus" width={18} height={18} />Добавить гос. номер</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Панель настроек (левая при активной звездочке)
const SettingsPanel = () => {
  return (
    <div className="dash-panel settings-panel">
      <div className="settings-form">
        <div className="form-row">
          <label>Интервал обновления (сек):</label>
          <input className="form-input" defaultValue="10" />
        </div>
        <div className="form-row">
          <label>Количество попыток:</label>
          <input className="form-input" defaultValue="100" />
        </div>
        <div className="form-row">
          <label>Задержка попыток (мин):</label>
          <input className="form-input" defaultValue="30" />
        </div>
        <div className="form-row">
          <label>Таймаут элементов (сек):</label>
          <input className="form-input" defaultValue="10" />
        </div>
        <div className="form-row">
          <label>URL сайта:</label>
          <input className="form-input" defaultValue="https://www.example_link.com" />
        </div>
        <div className="form-row">
          <label>Логин:</label>
          <input className="form-input" defaultValue="bullweb1337" />
        </div>
        <div className="form-row">
          <label>Пароль:</label>
          <input className="form-input" defaultValue="123456789" />
        </div>
        <div className="form-actions">
          <button className="dash-btn">Проверить подключение</button>
        </div>
      </div>
    </div>
  );
};

const TaskTable = ({ tasks, onDeleteTask, onTaskChange, onSaveTask }) => {
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
                {task.isNew ? (
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
                {task.isNew ? (
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
                {task.isNew ? (
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
                {task.isNew ? (
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
                {task.isNew ? (
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
                {task.isNew ? (
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
                {task.isNew ? (
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
                {task.isNew ? (
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
                      <button className="action-btn action-btn-edit" aria-label="Редактировать">
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
  const initialTasks = [
    { id: 1, status: 'running', date: '01.01.2025 (12:00)', func: 'Вывоз', slot: '01.01.2025 (14:00 - 16:00)', cont: 'STJU8906732', rel: '678129', plate: 'О601КЕ193', driver: 'ЛУГАНОВ АРТУР ВАЛИЕВИЧ (82-17 946750)', contract: '001/2025 (дополнительный)', checked: false, isNew: false },
    { id: 2, status: 'new', date: '01.01.2025 (12:00)', func: 'Вывоз', slot: '01.01.2025 (14:00 - 16:00)', cont: 'STJU8906732', rel: '678129', plate: 'О601КЕ193', driver: 'ЛУГАНОВ АРТУР ВАЛИЕВИЧ (82-17 946750)', contract: '001/2025 (дополнительный)', checked: false, isNew: false },
    { id: 3, status: 'error', date: '01.01.2025 (12:00)', func: 'Вывоз', slot: '01.01.2025 (14:00 - 16:00)', cont: 'STJU8906732', rel: '678129', plate: 'О601КЕ193', driver: 'ЛУГАНОВ АРТУР ВАЛИЕВИЧ (82-17 946750)', contract: '001/2025 (дополнительный)', checked: false, isNew: false },
    { id: 4, status: 'completed', date: '31.12.2024 (10:00)', func: 'Привоз', slot: '31.12.2024 (12:00 - 14:00)', cont: 'TCNU1234567', rel: '123456', plate: 'А123ВС77', driver: 'ИВАНОВ ИВАН ИВАНОВИЧ (99-11 123456)', contract: '002/2024 (основной)', checked: false, isNew: false },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [filterMode, setFilterMode] = useState('current');
  const [searchValue, setSearchValue] = useState('');
  const [nextId, setNextId] = useState(5);

  const handleAddTask = () => {
    const newTask = {
      id: nextId,
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
      isNew: true
    };
    setTasks([newTask, ...tasks]);
    setNextId(nextId + 1);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleTaskChange = (taskId, field, value) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ));
  };

  const handleSaveTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, isNew: false } : task
    ));
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

  const [activeScreen, setActiveScreen] = useState('tasks');

  return (
    <div className="dashboard-page">
      <Header activeScreen={activeScreen} onScreenChange={setActiveScreen} />

      {activeScreen === 'tasks' ? (
        <div className="dash-content">
          <div className="dash-col dash-col-right" style={{ width: '100%' }}>
            <div className="dash-panel">
              <ActionsBar 
                onAddTask={handleAddTask}
                filterMode={filterMode}
                onFilterChange={setFilterMode}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
              />
              <TaskTable 
                tasks={filteredTasks}
                onDeleteTask={handleDeleteTask}
                onTaskChange={handleTaskChange}
                onSaveTask={handleSaveTask}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="dash-content">
          <div className="dash-col dash-col-left">
            <DirectoryPanel />
          </div>
          <div className="dash-col dash-col-right">
            <SettingsPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;


